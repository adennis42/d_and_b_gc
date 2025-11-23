/**
 * Script to upload ALL images from public/images/gallery/ to Vercel Blob Storage
 * and update database URLs
 * 
 * This script:
 * 1. Scans public/images/gallery/ for all image files
 * 2. Uploads them to Vercel Blob Storage
 * 3. Maps them to database entries by matching category and order
 * 
 * Usage:
 * 1. Set BLOB_READ_WRITE_TOKEN in admin-dashboard/.env.local
 * 2. Place images in public/images/gallery/{category}/
 * 3. Run: cd admin-dashboard && npx tsx ../scripts/upload-all-images-to-blob.ts
 */

import { readdirSync, readFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';
import postgres from 'postgres';
import { put, list } from '@vercel/blob';
import sharp from 'sharp';

// Load .env.local
function loadEnvLocal() {
  const currentDir = process.cwd();
  const isInAdminDashboard = currentDir.endsWith('admin-dashboard');
  const rootDir = isInAdminDashboard ? join(currentDir, '..') : currentDir;
  
  const envPaths = [
    join(currentDir, '.env.local'),
    join(rootDir, '.env.local'),
    join(rootDir, 'admin-dashboard', '.env.local'),
  ];
  
  for (const envPath of envPaths) {
    if (existsSync(envPath)) {
      try {
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
            if (!process.env[key] && value) {
              process.env[key] = value;
            }
          }
        });
      } catch (error) {
        // Ignore
      }
    }
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
  process.exit(1);
}

const sql = postgres(connectionString, { ssl: { rejectUnauthorized: false } });

// Get root directory
const currentDir = process.cwd();
const isInAdminDashboard = currentDir.endsWith('admin-dashboard');
const rootDir = isInAdminDashboard ? join(currentDir, '..') : currentDir;
const galleryDir = join(rootDir, 'public', 'images', 'gallery');

async function uploadAllImages() {
  try {
    console.log('🔍 Scanning for images in public/images/gallery/...\n');
    
    // Map database category names (singular) to folder names (plural)
    const categoryMap: Record<string, string> = {
      'kitchen': 'kitchens',
      'bathroom': 'bathrooms',
      'sunroom': 'sunrooms',
      'millwork': 'millwork', // Already singular
    };
    
    const allFiles: Array<{ category: string; filename: string; fullPath: string }> = [];
    
    // Collect all image files from all category folders
    const folderNames = ['kitchens', 'bathrooms', 'sunrooms', 'millwork'];
    for (const folderName of folderNames) {
      const categoryDir = join(galleryDir, folderName);
      if (!existsSync(categoryDir)) {
        console.log(`⚠️  Directory not found: ${categoryDir}`);
        continue;
      }
      
      const files = readdirSync(categoryDir).filter(file => {
        const ext = file.toLowerCase().split('.').pop();
        return ['jpg', 'jpeg', 'png', 'webp'].includes(ext || '');
      });
      
      // Map folder name back to database category name
      const dbCategory = Object.keys(categoryMap).find(
        key => categoryMap[key] === folderName
      ) || folderName;
      
      for (const file of files) {
        const fullPath = join(categoryDir, file);
        const stats = statSync(fullPath);
        if (stats.isFile()) {
          allFiles.push({ category: dbCategory, filename: file, fullPath });
        }
      }
    }
    
    console.log(`Found ${allFiles.length} image files\n`);
    
    if (allFiles.length === 0) {
      console.log('❌ No images found in public/images/gallery/');
      await sql.end();
      return;
    }
    
    // Get database images that need URLs
    const dbImages = await sql<{ id: string; url: string; project_id: string; category: string; order: number }>`
      SELECT 
        pi.id,
        pi.url,
        pi.project_id,
        p.category,
        pi."order"
      FROM project_images pi
      JOIN projects p ON pi.project_id = p.id
      WHERE pi.url LIKE '/images/%'
      ORDER BY p.category, p."order", pi."order"
    `;
    
    const dbImagesArray = Array.isArray(dbImages) ? dbImages : [];
    console.log(`Found ${dbImagesArray.length} database entries needing URLs\n`);
    
    // Group database images by project
    const imagesByProject = new Map<string, typeof dbImagesArray>();
    for (const img of dbImagesArray) {
      if (!imagesByProject.has(img.project_id)) {
        imagesByProject.set(img.project_id, []);
      }
      imagesByProject.get(img.project_id)!.push(img);
    }
    
    // Group files by category
    const filesByCategory = new Map<string, typeof allFiles>();
    for (const file of allFiles) {
      if (!filesByCategory.has(file.category)) {
        filesByCategory.set(file.category, []);
      }
      filesByCategory.get(file.category)!.push(file);
    }
    
    let uploaded = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;
    
    // Debug: Show category mapping
    console.log(`\n📁 Files by category:`);
    for (const [cat, files] of filesByCategory.entries()) {
      console.log(`   ${cat}: ${files.length} files`);
    }
    console.log(`\n📊 Projects by category:`);
    const projectsByCategory = new Map<string, number>();
    for (const [projectId, projectImages] of imagesByProject) {
      const category = projectImages[0].category;
      projectsByCategory.set(category, (projectsByCategory.get(category) || 0) + 1);
    }
    for (const [cat, count] of projectsByCategory.entries()) {
      console.log(`   ${cat}: ${count} projects`);
    }
    console.log('');
    
    // Process each project
    for (const [projectId, projectImages] of imagesByProject) {
      const firstImage = projectImages[0];
      const category = firstImage.category;
      const categoryFiles = filesByCategory.get(category) || [];
      
      if (categoryFiles.length === 0) {
        // Don't log every single project - just skip silently
        skipped += projectImages.length;
        continue;
      }
      
      // Match images to files by order (first file -> first image, etc.)
      for (let i = 0; i < projectImages.length && i < categoryFiles.length; i++) {
        const dbImage = projectImages[i];
        const file = categoryFiles[i];
        
        try {
          // Read and optimize image
          const imageBuffer = readFileSync(file.fullPath);
          const optimized = await sharp(imageBuffer)
            .rotate()
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
          
          // Get dimensions
          const metadata = await sharp(optimized).metadata();
          const width = metadata.width || 1920;
          const height = metadata.height || 1440;
          
          // Generate blob path from database URL
          const blobPath = `gallery${dbImage.url.replace('/images/gallery', '')}`;
          
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
            WHERE id = ${dbImage.id}
          `;
          
          console.log(`✅ Uploaded: ${file.filename} → ${blob.url}`);
          uploaded++;
          updated++;
        } catch (error: any) {
          console.error(`❌ Error uploading ${file.filename}:`, error.message);
          errors++;
        }
      }
      
      // Remove processed files from category list
      const remaining = categoryFiles.slice(projectImages.length);
      filesByCategory.set(category, remaining);
    }
    
    console.log(`\n📊 Migration Summary:`);
    console.log(`   ✅ Uploaded: ${uploaded}`);
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ⚠️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    
    if (uploaded > 0) {
      console.log(`\n✅ Successfully uploaded ${uploaded} images to Vercel Blob Storage!`);
    }
    
    await sql.end();
  } catch (error) {
    console.error('❌ Migration error:', error);
    await sql.end();
    process.exit(1);
  }
}

uploadAllImages();

