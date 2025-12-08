/**
 * Migration script to add ttl_days field to promotional_banners table
 * 
 * Usage:
 *   npm run migrate-ttl
 * 
 * Or directly:
 *   tsx scripts/migrate-ttl-field.ts
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import postgres from 'postgres';

// Load .env.local file
function loadEnvLocal() {
  const envPath = join(process.cwd(), '.env.local');
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
}

loadEnvLocal();

async function migrate() {
  const connectionString = process.env.POSTGRES_URL || process.env.PRISMA_DATABASE_URL;
  
  if (!connectionString || connectionString.startsWith('prisma+')) {
    console.error('❌ No valid POSTGRES_URL found. Please set it in .env.local');
    process.exit(1);
  }

  const sql = postgres(connectionString);

  try {
    console.log('🔄 Running migration: Add ttl_days field to promotional_banners...');
    
    // Read migration file
    const migrationPath = join(process.cwd(), 'database/migrations/add_ttl_to_banners.sql');
    if (!existsSync(migrationPath)) {
      console.error('❌ Migration file not found:', migrationPath);
      process.exit(1);
    }
    
    const migrationSQL = readFileSync(migrationPath, 'utf-8');
    
    // Execute migration
    await sql.unsafe(migrationSQL);
    
    console.log('✅ Migration completed successfully!');
    console.log('');
    console.log('The ttl_days field has been added to the promotional_banners table.');
    console.log('You can now set TTL (time to live) for banners in the admin dashboard.');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

migrate();

