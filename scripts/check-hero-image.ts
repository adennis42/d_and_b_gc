/**
 * Script to check hero image settings in the database
 * 
 * Usage:
 * npx tsx scripts/check-hero-image.ts
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import postgres from 'postgres';

// Load .env.local file if it exists
function loadEnvLocal() {
  const envPaths = [
    join(process.cwd(), '.env.local'),
    join(process.cwd(), '..', '.env.local'),
  ];
  
  for (const envPath of envPaths) {
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
      return true;
    }
  }
  return false;
}

// Load environment variables
loadEnvLocal();

async function checkHeroImage() {
  try {
    // Get connection string
    const connectionString = 
      process.env.POSTGRES_URL ||
      process.env.PRISMA_DATABASE_URL ||
      process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error('No Postgres connection string found. Make sure POSTGRES_URL is set in .env.local');
    }
    
    // Create database client
    const sql = postgres(connectionString, { max: 1 });
    
    console.log('🔍 Checking hero image settings in database...\n');
    
    // Check if site_settings table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'site_settings'
      );
    `;
    
    if (!tableExists[0].exists) {
      console.log('❌ site_settings table does not exist!');
      console.log('   Run: npm run setup-db');
      await sql.end();
      process.exit(1);
    }
    
    // Get all site settings
    const allSettings = await sql`
      SELECT key, value, description, created_at, updated_at
      FROM site_settings
      ORDER BY key;
    `;
    
    console.log(`📊 Total site settings: ${allSettings.length}\n`);
    
    if (allSettings.length === 0) {
      console.log('⚠️  No site settings found in database.');
      console.log('   The hero image has not been configured yet.\n');
    } else {
      console.log('📋 All site settings:');
      console.log('─'.repeat(80));
      allSettings.forEach((setting: any) => {
        console.log(`\nKey: ${setting.key}`);
        console.log(`Value: ${setting.value || '(null)'}`);
        if (setting.description) {
          console.log(`Description: ${setting.description}`);
        }
        console.log(`Created: ${setting.created_at}`);
        console.log(`Updated: ${setting.updated_at}`);
      });
      console.log('\n' + '─'.repeat(80));
    }
    
    // Specifically check hero image settings
    const heroUrl = await sql`
      SELECT value FROM site_settings WHERE key = 'hero_image_url' LIMIT 1;
    `;
    
    const heroAlt = await sql`
      SELECT value FROM site_settings WHERE key = 'hero_image_alt' LIMIT 1;
    `;
    
    console.log('\n🎨 Hero Image Settings:');
    console.log('─'.repeat(80));
    
    if (heroUrl.length > 0) {
      console.log(`✅ Hero Image URL: ${heroUrl[0].value || '(null)'}`);
    } else {
      console.log('❌ Hero Image URL: Not set');
    }
    
    if (heroAlt.length > 0) {
      console.log(`✅ Hero Image Alt Text: ${heroAlt[0].value || '(null)'}`);
    } else {
      console.log('❌ Hero Image Alt Text: Not set');
    }
    
    console.log('─'.repeat(80));
    
    // Close connection
    await sql.end();
    
    console.log('\n✅ Database check complete!');
    
  } catch (error) {
    console.error('\n❌ Error checking database:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  checkHeroImage()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('✗ Unexpected error:', error);
      process.exit(1);
    });
}

export { checkHeroImage };

