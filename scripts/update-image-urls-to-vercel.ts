/**
 * Script to update image URLs in database to use Vercel Blob Storage
 * 
 * This script updates local image paths (/images/gallery/...) to Vercel Blob URLs
 * 
 * Two modes:
 * 1. If images exist locally: Uploads them to Vercel Blob and updates URLs
 * 2. If images already in Vercel Blob: Updates URLs to match existing Blob URLs
 * 
 * Usage:
 * 1. Set BLOB_READ_WRITE_TOKEN in admin-dashboard/.env.local
 * 2. Run: cd admin-dashboard && npm run migrate-images
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import postgres from 'postgres';
import { put, list } from '@vercel/blob';
import sharp from 'sharp';

// Load .env.local
function loadEnvLocal() {
  const adminDashboardPath = join(process.cwd(), 'admin-dashboard');
  const envPath = join(adminDashboardPath, '.env.local');
  if (existsSync(envPath)) {
    const envFile = readFileSync(envPath, 'utf-8');
    envFile.split('\n').forEach(line => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
  
  const rootEnvPath = join(process.cwd(), '.env.local');
  if (existsSync(rootEnvPath)) {
    const envFile = readFileSync(rootEnvPath, 'utf-8');
    envFile.split('\n').forEach(line => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
}

loadEnvLocal();

const connectionString = 
  process.env.POSTGRES_URL || 
  process.env.PRISMA_DATABASE_URL || 
  process.env.POSTGRES_URL_NON_POOLING || 
  process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ No Postgres connection string found');
  process.exit(1);
}

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('❌ BLOB_READ_WRITE_TOKEN not found');
  console.error('Please set BLOB_READ_WRITE_TOKEN in admin-dashboard/.env.local');
  process.exit(1);
}

const sql = postgres(connectionString, { ssl: { rejectUnauthorized: false } });

interface ImageRecord {
  id: string;
  url: string;
  project_id: string;
  alt: string;
  width: number;
  height: number;
  blur_data_url: string | null;
}

async function migrateImages() {
  try {
    console.log('🔍 Finding images with local paths...\n');
    
    // Find all images with local paths
    const localImages = await sql<ImageRecord>`
      SELECT id, url, project_id, alt, width, height, blur_data_url
      FROM project_images
      WHERE url LIKE '/images/%'
      ORDER BY url
    `;
    
    const imagesArray = Array.isArray(localImages) ? localImages : [];
    
    if (imagesArray.length === 0) {
      console.log('✅ No local image paths found. All images are already using external URLs.');
      await sql.end();
      return;
    }
    
    console.log(`Found ${imagesArray.length} images with local paths\n`);
    
    // Check if images exist in Vercel Blob Storage
    console.log('🔍 Checking Vercel Blob Storage for existing images...\n');
    const { blobs } = await list({ prefix: 'gallery/' });
    const blobMap = new Map(blobs.map(b => [b.pathname, b.url]));
    
    let uploaded = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const image of imagesArray) {
      const localPath = image.url;
      const blobPath = `gallery${localPath.replace('/images/gallery', '')}`;
      
      // Check if already exists in Blob Storage
      if (blobMap.has(blobPath)) {
        const blobUrl = blobMap.get(blobPath)!;
        await sql`
          UPDATE project_images
          SET url = ${blobUrl}
          WHERE id = ${image.id}
        `;
        console.log(`✅ Updated: ${localPath} → ${blobUrl}`);
        updated++;
        continue;
      }
      
      // Try to upload from local file
      const publicPath = join(process.cwd(), 'public', localPath);
      
      if (!existsSync(publicPath)) {
        console.log(`⚠️  Skipping ${localPath} - file not found locally and not in Vercel Blob`);
        skipped++;
        continue;
      }
      
      try {
        // Read and optimize image
        const imageBuffer = readFileSync(publicPath);
        const optimized = await sharp(imageBuffer)
          .rotate()
          .resize(1920, 1440, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({ quality: 85 })
          .toBuffer();
        
        // Generate blur placeholder if not exists
        let blurDataURL = image.blur_data_url;
        if (!blurDataURL) {
          const blurPlaceholder = await sharp(imageBuffer)
            .resize(20, 15, { fit: 'cover' })
            .webp({ quality: 20 })
            .toBuffer();
          blurDataURL = `data:image/webp;base64,${blurPlaceholder.toString('base64')}`;
        }
        
        // Get image dimensions
        const metadata = await sharp(optimized).metadata();
        const width = metadata.width || image.width || 1920;
        const height = metadata.height || image.height || 1440;
        
        // Upload to Vercel Blob
        const blob = await put(blobPath, optimized, {
          access: 'public',
          contentType: 'image/webp',
        });
        
        // Update database
        await sql`
          UPDATE project_images
          SET 
            url = ${blob.url},
            blur_data_url = ${blurDataURL},
            width = ${width},
            height = ${height}
          WHERE id = ${image.id}
        `;
        
        console.log(`✅ Uploaded: ${localPath} → ${blob.url}`);
        uploaded++;
      } catch (error: any) {
        console.error(`❌ Error processing ${localPath}:`, error.message);
        errors++;
      }
    }
    
    console.log(`\n📊 Migration Summary:`);
    console.log(`   ✅ Uploaded: ${uploaded}`);
    console.log(`   ✅ Updated (found in Blob): ${updated}`);
    console.log(`   ⚠️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    
    if (uploaded > 0 || updated > 0) {
      console.log(`\n✅ Successfully migrated ${uploaded + updated} images to use Vercel Blob Storage!`);
    }
    
    await sql.end();
  } catch (error) {
    console.error('❌ Migration error:', error);
    await sql.end();
    process.exit(1);
  }
}

migrateImages();

