/**
 * Script to migrate local image paths to Vercel Blob Storage URLs
 * 
 * This script:
 * 1. Finds all images in the database with local paths (/images/gallery/...)
 * 2. Checks if images already exist in Vercel Blob Storage
 * 3. If found in Blob, updates database URLs to point to Blob URLs
 * 4. If not found in Blob but exists locally, uploads to Blob and updates database
 * 5. Skips images not found in Blob or locally
 * 
 * Usage:
 * 1. Set BLOB_READ_WRITE_TOKEN in admin-dashboard/.env.local
 * 2. Place images in public/images/gallery/ (matching database paths)
 * 3. Run: cd admin-dashboard && npm run migrate-images
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import postgres from 'postgres';
import { put, list } from '@vercel/blob';
import sharp from 'sharp';

// Load .env.local - check multiple locations
function loadEnvLocal() {
  const currentDir = process.cwd();
  
  // Check if we're in admin-dashboard directory
  const isInAdminDashboard = currentDir.endsWith('admin-dashboard');
  
  // Try admin-dashboard/.env.local first (if running from admin-dashboard)
  if (isInAdminDashboard) {
    const envPath = join(currentDir, '.env.local');
    if (existsSync(envPath)) {
      loadEnvFile(envPath);
    }
  }
  
  // Try admin-dashboard/.env.local (if running from root)
  const adminDashboardPath = join(currentDir, 'admin-dashboard');
  const adminEnvPath = join(adminDashboardPath, '.env.local');
  if (existsSync(adminEnvPath)) {
    loadEnvFile(adminEnvPath);
  }
  
  // Also try root .env.local
  const rootEnvPath = join(currentDir, '.env.local');
  if (existsSync(rootEnvPath)) {
    loadEnvFile(rootEnvPath);
  }
  
  // Try parent directory (if running from scripts/)
  const parentEnvPath = join(currentDir, '..', 'admin-dashboard', '.env.local');
  if (existsSync(parentEnvPath)) {
    loadEnvFile(parentEnvPath);
  }
}

function loadEnvFile(filePath: string) {
  try {
    const envFile = readFileSync(filePath, 'utf-8');
    envFile.split('\n').forEach(line => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        // Only set if not already set (first file wins)
        if (!process.env[key] && value) {
          process.env[key] = value;
        }
      }
    });
  } catch (error) {
    // Silently ignore file read errors
  }
}

loadEnvLocal();

// Debug: Show what we found
const currentDir = process.cwd();
const isInAdminDashboard = currentDir.endsWith('admin-dashboard');
console.log(`\n🔍 Debug Info:`);
console.log(`   Current directory: ${currentDir}`);
console.log(`   Running from admin-dashboard: ${isInAdminDashboard}`);
console.log(`   BLOB_READ_WRITE_TOKEN found: ${process.env.BLOB_READ_WRITE_TOKEN ? 'Yes (length: ' + process.env.BLOB_READ_WRITE_TOKEN.length + ')' : 'No'}`);
console.log(`   POSTGRES_URL found: ${process.env.POSTGRES_URL ? 'Yes' : 'No'}\n`);

const connectionString = 
  process.env.POSTGRES_URL || 
  process.env.PRISMA_DATABASE_URL || 
  process.env.POSTGRES_URL_NON_POOLING || 
  process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ No Postgres connection string found');
  console.error('Please set POSTGRES_URL or PRISMA_DATABASE_URL in .env.local');
  process.exit(1);
}

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('❌ BLOB_READ_WRITE_TOKEN not found');
  console.error('\nPlease set BLOB_READ_WRITE_TOKEN in admin-dashboard/.env.local');
  console.error('\nTo get your token:');
  console.error('1. Go to https://vercel.com/dashboard');
  console.error('2. Select your project → Storage → Blob');
  console.error('3. Go to Settings → Environment Variables');
  console.error('4. Copy BLOB_READ_WRITE_TOKEN');
  console.error('5. Add it to admin-dashboard/.env.local:');
  console.error('   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx');
  console.error('\nSee GET_BLOB_TOKEN.md for detailed instructions.\n');
  process.exit(1);
}

const sql = postgres(connectionString, { ssl: { rejectUnauthorized: false } });

interface ImageRecord {
  id: string;
  url: string;
  project_id: string;
}

async function migrateImages() {
  try {
    console.log('🔍 Finding images with local paths...\n');
    
    // Find all images with local paths
    const localImages = await sql<ImageRecord>`
      SELECT id, url, project_id
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
    
    // Check if images already exist in Vercel Blob Storage
    console.log('🔍 Checking Vercel Blob Storage for existing images...\n');
    let blobMap = new Map<string, string>(); // pathname -> url
    let blobUrlMap = new Map<string, string>(); // filename -> url (for fuzzy matching)
    try {
      const { blobs } = await list({ prefix: 'gallery/' });
      // Create maps for exact and fuzzy matching
      for (const blob of blobs) {
        blobMap.set(blob.pathname, blob.url);
        // Extract filename for fuzzy matching (e.g., "kitchen-001-1.webp")
        const filename = blob.pathname.split('/').pop() || '';
        if (filename) {
          blobUrlMap.set(filename, blob.url);
        }
      }
      console.log(`Found ${blobs.length} existing images in Vercel Blob Storage\n`);
    } catch (error: any) {
      console.log(`⚠️  Could not list existing blobs: ${error.message}\n`);
    }
    
    let uploaded = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const image of imagesArray) {
      const localPath = image.url;
      // Extract filename from local path (e.g., "/images/gallery/kitchens/kitchen-001-1.webp" -> "kitchen-001-1.webp")
      const filename = localPath.split('/').pop() || '';
      const blobPath = `gallery${localPath.replace('/images/gallery', '')}`;
      
      // First, try exact path match
      let blobUrl: string | undefined = blobMap.get(blobPath);
      
      // If not found, try fuzzy match by filename
      if (!blobUrl && filename) {
        blobUrl = blobUrlMap.get(filename);
        if (blobUrl) {
          console.log(`📎 Found by filename match: ${filename}`);
        }
      }
      
      // If found in Blob Storage, update database
      if (blobUrl) {
        await sql`
          UPDATE project_images
          SET url = ${blobUrl}
          WHERE id = ${image.id}
        `;
        console.log(`✅ Updated: ${localPath} → ${blobUrl}`);
        updated++;
        continue;
      }
      
      // Image not found in Blob Storage - try to upload from local file
      // Determine correct path: if running from admin-dashboard, go up one level to root
      const scriptCurrentDir = process.cwd();
      const isInAdminDashboard = scriptCurrentDir.endsWith('admin-dashboard');
      const rootDir = isInAdminDashboard ? join(scriptCurrentDir, '..') : scriptCurrentDir;
      const publicPath = join(rootDir, 'public', localPath);
      
      // Also try with different extensions in case files are .jpg/.png but DB has .webp
      const basePath = publicPath.replace(/\.webp$/, '');
      const possiblePaths = [
        publicPath, // Exact match
        `${basePath}.jpg`,
        `${basePath}.jpeg`,
        `${basePath}.png`,
      ];
      
      let foundPath: string | null = null;
      for (const path of possiblePaths) {
        if (existsSync(path)) {
          foundPath = path;
          break;
        }
      }
      
      if (!foundPath) {
        console.log(`⚠️  Skipping ${localPath} - file not found locally (tried: ${possiblePaths.join(', ')})`);
        skipped++;
        continue;
      }
      
      try {
        // Read and optimize image
        const imageBuffer = readFileSync(foundPath);
        const optimized = await sharp(imageBuffer)
          .rotate() // Auto-rotate based on EXIF
          .resize(1920, 1440, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({ quality: 85 })
          .toBuffer();
        
        // Generate blur placeholder
        const blurPlaceholder = await sharp(imageBuffer)
          .resize(20, 15, { fit: 'cover' })
          .webp({ quality: 20 })
          .toBuffer();
        const blurDataURL = `data:image/webp;base64,${blurPlaceholder.toString('base64')}`;
        
        // Get image dimensions
        const metadata = await sharp(optimized).metadata();
        const width = metadata.width || 1920;
        const height = metadata.height || 1440;
        
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
        console.error(`❌ Error uploading ${localPath}:`, error.message);
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
      console.log(`\n📝 Next steps:`);
      console.log(`   1. Verify images load correctly on the main site`);
      console.log(`   2. Check admin dashboard projects page`);
      console.log(`   3. All future uploads will automatically use Vercel Blob Storage`);
    }
    
    if (skipped > 0) {
      console.log(`\n⚠️  ${skipped} images were skipped (not found in Vercel Blob or locally).`);
      console.log(`\n📤 To upload these images:`);
      console.log(`   1. Place images in public/images/gallery/ matching database paths`);
      console.log(`   2. Run this migration script again`);
      console.log(`   OR`);
      console.log(`   3. Go to Admin Dashboard → Projects`);
      console.log(`   4. Edit each project and upload images using the file uploader`);
    }
    
    await sql.end();
  } catch (error) {
    console.error('❌ Migration error:', error);
    await sql.end();
    process.exit(1);
  }
}

migrateImages();

