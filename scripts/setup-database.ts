/**
 * Database setup script
 * Creates all tables and indexes from schema.sql
 * 
 * Usage:
 * 1. Set POSTGRES_URL in .env.local
 * 2. Run: npm run setup-db
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import postgres from 'postgres';

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

async function setupDatabase() {
  // Support multiple environment variable names that Vercel might provide
  // Priority: NON_POOLING variants first (better for migrations), then pooled, then generic
  const postgresUrl = 
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_URL_NO_SSL ||
    process.env.DATABASE_URL_NON_POOLING ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.PRISMA_DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL;

  if (!postgresUrl) {
    console.error('✗ Error: No Postgres connection string found');
    console.error('\n  Supported environment variable names:');
    console.error('    - POSTGRES_URL_NON_POOLING (preferred for migrations)');
    console.error('    - POSTGRES_URL_NO_SSL');
    console.error('    - DATABASE_URL_NON_POOLING');
    console.error('    - POSTGRES_URL');
    console.error('    - DATABASE_URL');
    console.error('    - PRISMA_DATABASE_URL');
    console.error('    - POSTGRES_PRISMA_URL');
    console.error('\n  Set one in .env.local or export it:');
    console.error('  export POSTGRES_URL="your-connection-string"');
    console.error('\n  Run "npm run check-env" to see which variables are set');
    process.exit(1);
  }

  // Show which variable was used
  const usedVar = 
    process.env.POSTGRES_URL_NON_POOLING ? 'POSTGRES_URL_NON_POOLING' :
    process.env.POSTGRES_URL_NO_SSL ? 'POSTGRES_URL_NO_SSL' :
    process.env.DATABASE_URL_NON_POOLING ? 'DATABASE_URL_NON_POOLING' :
    process.env.POSTGRES_URL ? 'POSTGRES_URL' :
    process.env.DATABASE_URL ? 'DATABASE_URL' :
    process.env.PRISMA_DATABASE_URL ? 'PRISMA_DATABASE_URL' :
    'POSTGRES_PRISMA_URL';
  
  console.log('✓ Database connection string found');
  console.log(`  Using: ${usedVar}`);
  console.log('  Connecting to database...');

  try {
    // Read schema file
    const schemaPath = join(process.cwd(), 'database', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');

    console.log('✓ Schema file loaded');

    // Connect to database
    const sql = postgres(postgresUrl, { max: 1 });

    // Split schema into individual statements
    // Handle dollar-quoted strings and multi-line statements properly
    const statements: string[] = [];
    let currentStatement = '';
    let inDollarQuote = false;
    let dollarTag = '';
    
    const lines = schema.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Skip comments
      if (trimmed.startsWith('--')) {
        continue;
      }
      
      // Check for dollar-quoted strings (e.g., $$ LANGUAGE plpgsql $$)
      const dollarMatch = trimmed.match(/\$(\w*)\$/g);
      if (dollarMatch) {
        for (const match of dollarMatch) {
          if (!inDollarQuote) {
            inDollarQuote = true;
            dollarTag = match;
          } else if (match === dollarTag) {
            inDollarQuote = false;
            dollarTag = '';
          }
        }
      }
      
      currentStatement += line + '\n';
      
      // If we're not in a dollar-quoted string and line ends with semicolon, it's a complete statement
      if (!inDollarQuote && trimmed.endsWith(';')) {
        const stmt = currentStatement.trim();
        if (stmt.length > 0) {
          statements.push(stmt);
        }
        currentStatement = '';
      }
    }
    
    // Add any remaining statement
    if (currentStatement.trim().length > 0) {
      statements.push(currentStatement.trim());
    }

    console.log(`  Executing ${statements.length} SQL statements...`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.length > 0) {
        try {
          await sql.unsafe(statement);
          if ((i + 1) % 5 === 0) {
            console.log(`  Progress: ${i + 1}/${statements.length} statements executed`);
          }
        } catch (error: any) {
          // Ignore "already exists" errors
          if (!error.message?.includes('already exists') && !error.message?.includes('duplicate')) {
            console.warn(`  Warning on statement ${i + 1}:`, error.message);
          }
        }
      }
    }

    await sql.end();

    console.log('\n✓ Database schema created successfully!');
    console.log('\n  Tables created:');
    console.log('    - projects');
    console.log('    - project_images');
    console.log('    - project_videos');
    console.log('    - analytics_events');
    console.log('    - users');
    console.log('\n  Next steps:');
    console.log('    1. Run migration: npm run migrate-db');
    console.log('    2. Create admin user: cd admin-dashboard && npx tsx scripts/create-admin-user.ts <email> <password>');
    console.log('    3. Test gallery: npm run dev');
  } catch (error) {
    console.error('\n✗ Error setting up database:', error);
    process.exit(1);
  }
}

// Run setup if executed directly
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('\n✓ Setup completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n✗ Setup failed:', error);
      process.exit(1);
    });
}

export { setupDatabase };

