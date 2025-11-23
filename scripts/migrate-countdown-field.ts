/**
 * Migration script to add show_countdown field to promotional_banners table
 * Run with: tsx scripts/migrate-countdown-field.ts
 */

import postgres from 'postgres';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables from .env.local manually
function loadEnvFile(filePath: string): void {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();
    // Skip comments and empty lines
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }

    // Parse KEY=VALUE format
    const equalIndex = trimmedLine.indexOf('=');
    if (equalIndex === -1) {
      continue;
    }

    const key = trimmedLine.substring(0, equalIndex).trim();
    let value = trimmedLine.substring(equalIndex + 1).trim();

    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Only set if not already in environment
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

// Try loading from root .env.local first
const envPath = path.join(process.cwd(), '.env.local');
loadEnvFile(envPath);

// Try admin-dashboard/.env.local as fallback
const adminEnvPath = path.join(process.cwd(), 'admin-dashboard', '.env.local');
if (!process.env.POSTGRES_URL && fs.existsSync(adminEnvPath)) {
  loadEnvFile(adminEnvPath);
}

const POSTGRES_URL = process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING;

if (!POSTGRES_URL) {
  console.error('❌ Error: POSTGRES_URL environment variable is not set');
  console.error('Please set POSTGRES_URL in your .env.local file');
  process.exit(1);
}

async function migrate() {
  console.log('🔄 Starting migration: Add show_countdown field to promotional_banners...\n');

  const sql = postgres(POSTGRES_URL, {
    max: 1,
  });

  try {
    // Check if column already exists
    const checkResult = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'promotional_banners' 
      AND column_name = 'show_countdown'
    `;

    if (checkResult.length > 0) {
      console.log('✅ Column show_countdown already exists. Skipping migration.');
      await sql.end();
      return;
    }

    // Add the column
    await sql`
      ALTER TABLE promotional_banners
      ADD COLUMN show_countdown BOOLEAN DEFAULT false
    `;

    console.log('✅ Successfully added show_countdown column to promotional_banners table');

    // Add comment
    await sql`
      COMMENT ON COLUMN promotional_banners.show_countdown IS 
      'If true, displays a countdown showing days remaining until end_date. On the final day, displays "Last Day!" instead of "1 day remaining".'
    `;

    console.log('✅ Added column comment');
    console.log('\n✨ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await sql.end();
  }
}

migrate()
  .then(() => {
    console.log('\n✅ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });

