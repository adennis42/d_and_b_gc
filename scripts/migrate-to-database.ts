/**
 * Migration script to move gallery data from static TypeScript file to PostgreSQL database
 * 
 * Usage:
 * 1. Ensure database schema is created (run: npm run setup-db)
 * 2. Set POSTGRES_URL in .env.local
 * 3. Run: npm run migrate-db
 * 
 * Supported environment variables:
 * - POSTGRES_URL (preferred)
 * - DATABASE_URL
 * - POSTGRES_URL_NON_POOLING
 * - PRISMA_DATABASE_URL
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import postgres from 'postgres';
import { getAllProjects } from '../src/lib/gallery-data';
import { createHash } from 'crypto';
import type { Project } from '../src/types';

// Load .env.local file if it exists
function loadEnvLocal() {
  const envPath = join(process.cwd(), '.env.local');
  if (existsSync(envPath)) {
    const envFile = readFileSync(envPath, 'utf-8');
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
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
}

// Load environment variables before proceeding
loadEnvLocal();

interface ProjectRow {
  id: string;
  title: string;
  category: 'kitchen' | 'bathroom' | 'sunroom' | 'millwork';
  description: string | null;
  featured: boolean;
  order: number;
}

interface ImageRow {
  project_id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  blur_data_url: string | null;
  order: number;
}

interface VideoRow {
  project_id: string;
  video_id: string;
  alt: string;
  width: number;
  height: number;
  thumbnail_url: string | null;
  order: number;
}

/**
 * Generate a deterministic UUID v5 from a string
 * Uses SHA-1 hash to create consistent UUIDs from project IDs
 */
function generateUUIDFromString(str: string): string {
  // Create a namespace UUID for our projects (using a fixed namespace)
  const namespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'; // DNS namespace
  
  // Create SHA-1 hash of namespace + string
  const hash = createHash('sha1');
  hash.update(Buffer.from(namespace.replace(/-/g, ''), 'hex'));
  hash.update(str);
  const hashBytes = hash.digest();
  
  // Convert to UUID v5 format
  const bytes = Array.from(hashBytes.slice(0, 16));
  
  // Set version (5) and variant bits
  bytes[6] = (bytes[6] & 0x0f) | 0x50; // Version 5
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10
  
  // Format as UUID string
  const hex = bytes.map(b => b.toString(16).padStart(2, '0')).join('');
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join('-');
}

/**
 * Migrate projects from static data to database
 */
async function migrateProjects() {
  console.log('Starting migration...');
  
  try {
    // Get connection string (prefer non-pooling, fallback to pooled)
    const connectionString = 
      process.env.POSTGRES_URL_NON_POOLING ||
      process.env.POSTGRES_URL ||
      process.env.DATABASE_URL ||
      process.env.PRISMA_DATABASE_URL;
    
    if (!connectionString) {
      throw new Error('No Postgres connection string found in environment variables');
    }
    
    // Create a direct client for migrations using postgres package
    // This works better for scripts outside of Vercel's runtime
    const sql = postgres(connectionString, { max: 1 });
    
    // Test database connection
    await sql`SELECT 1`;
    console.log('✓ Database connection successful');
    
    // Get all projects from static data
    const projects = getAllProjects();
    console.log(`✓ Found ${projects.length} projects to migrate`);
    
    // Check if projects already exist
    const existingProjects = await sql`SELECT id FROM projects LIMIT 1`;
    // postgres package returns array directly, not wrapped in .rows
    if (Array.isArray(existingProjects) && existingProjects.length > 0) {
      console.log('⚠ Warning: Projects already exist in database');
      console.log('  Continuing migration (will update existing projects)...');
    }
    
    // Clear existing data (optional - comment out if you want to preserve)
    // await sql`TRUNCATE TABLE project_images, project_videos, projects CASCADE`;
    
    let migratedCount = 0;
    let imageCount = 0;
    let videoCount = 0;
    
    // Migrate each project
    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      
      // Generate deterministic UUID from project ID
      const projectUUID = generateUUIDFromString(project.id);
      
      // Insert project
      try {
        await sql`
          INSERT INTO projects (id, title, category, description, featured, "order")
          VALUES (${projectUUID}, ${project.title}, ${project.category}, ${project.description || null}, ${project.featured || false}, ${i})
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            category = EXCLUDED.category,
            description = EXCLUDED.description,
            featured = EXCLUDED.featured,
            "order" = EXCLUDED."order",
            updated_at = CURRENT_TIMESTAMP
        `;
        
        // Migrate images
        if (project.images && project.images.length > 0) {
          // Delete existing images for this project
          await sql`DELETE FROM project_images WHERE project_id = ${projectUUID}`;
          
          for (let j = 0; j < project.images.length; j++) {
            const image = project.images[j];
            await sql`
              INSERT INTO project_images (project_id, url, alt, width, height, blur_data_url, "order")
              VALUES (${projectUUID}, ${image.url}, ${image.alt}, ${image.width}, ${image.height}, ${image.blurDataURL || null}, ${j})
            `;
            imageCount++;
          }
        }
        
        // Migrate videos
        if (project.videos && project.videos.length > 0) {
          // Delete existing videos for this project
          await sql`DELETE FROM project_videos WHERE project_id = ${projectUUID}`;
          
          for (let j = 0; j < project.videos.length; j++) {
            const video = project.videos[j];
            await sql`
              INSERT INTO project_videos (project_id, video_id, alt, width, height, thumbnail_url, "order")
              VALUES (${projectUUID}, ${video.videoId}, ${video.alt}, ${video.width}, ${video.height}, ${video.thumbnailUrl || null}, ${j})
            `;
            videoCount++;
          }
        }
        
        migratedCount++;
        
        if ((i + 1) % 10 === 0) {
          console.log(`  Migrated ${i + 1}/${projects.length} projects...`);
        }
      } catch (error) {
        console.error(`✗ Error migrating project ${project.id}:`, error);
        throw error;
      }
    }
    
    console.log('\n✓ Migration completed successfully!');
    console.log(`  Projects: ${migratedCount}`);
    console.log(`  Images: ${imageCount}`);
    console.log(`  Videos: ${videoCount}`);
    
    // Verify migration
    const projectCountResult = await sql`SELECT COUNT(*)::text as count FROM projects`;
    const imageCountResult = await sql`SELECT COUNT(*)::text as count FROM project_images`;
    const videoCountResult = await sql`SELECT COUNT(*)::text as count FROM project_videos`;
    
    console.log('\n✓ Verification:');
    // postgres package returns array directly, not wrapped in .rows
    const projectCountDb = Array.isArray(projectCountResult) ? projectCountResult[0]?.count : projectCountResult?.count || '0';
    const imageCountDb = Array.isArray(imageCountResult) ? imageCountResult[0]?.count : imageCountResult?.count || '0';
    const videoCountDb = Array.isArray(videoCountResult) ? videoCountResult[0]?.count : videoCountResult?.count || '0';
    console.log(`  Projects in DB: ${projectCountDb}`);
    console.log(`  Images in DB: ${imageCountDb}`);
    console.log(`  Videos in DB: ${videoCountDb}`);
    
    // Close the connection
    await sql.end();
    
  } catch (error) {
    console.error('✗ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if executed directly
if (require.main === module) {
  migrateProjects()
    .then(() => {
      console.log('\n✓ Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('✗ Migration script failed:', error);
      process.exit(1);
    });
}

export { migrateProjects };

