/**
 * Script to create an admin user for the admin dashboard
 * 
 * Usage:
 * npx tsx scripts/create-admin-user.ts <email> <password> [name]
 * 
 * Example:
 * npx tsx scripts/create-admin-user.ts admin@example.com mypassword "Admin User"
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import bcrypt from 'bcryptjs';
import postgres from 'postgres';

// Load .env.local file if it exists (check both admin-dashboard and parent directory)
function loadEnvLocal() {
  const envPaths = [
    join(process.cwd(), '.env.local'), // admin-dashboard/.env.local
    join(process.cwd(), '..', '.env.local'), // parent .env.local
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

// Load environment variables before proceeding
loadEnvLocal();

async function createAdminUser() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] || 'Admin User';

  if (!email || !password) {
    console.error('✗ Error: Email and password are required');
    console.error('\nUsage:');
    console.error('  npx tsx scripts/create-admin-user.ts <email> <password> [name]');
    console.error('\nExample:');
    console.error('  npx tsx scripts/create-admin-user.ts admin@example.com mypassword "Admin User"');
    process.exit(1);
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error('✗ Error: Invalid email format');
    process.exit(1);
  }

  // Validate password length
  if (password.length < 8) {
    console.error('✗ Error: Password must be at least 8 characters long');
    process.exit(1);
  }

  console.log('✓ Creating admin user...');
  console.log(`  Email: ${email}`);
  console.log(`  Name: ${name}`);

  try {
    // Get connection string
    const connectionString = 
      process.env.POSTGRES_URL ||
      process.env.PRISMA_DATABASE_URL ||
      process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error('No Postgres connection string found. Make sure POSTGRES_URL is set in .env.local');
    }
    
    // Create database client using postgres package (works better for scripts)
    const sql = postgres(connectionString, { max: 1 });
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log('✓ Password hashed');

    // Insert or update user
    await sql`
      INSERT INTO users (email, password_hash, role, name)
      VALUES (${email}, ${passwordHash}, 'admin', ${name})
      ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        name = EXCLUDED.name,
        updated_at = CURRENT_TIMESTAMP
    `;
    
    // Close connection
    await sql.end();

    console.log('\n✓ Admin user created/updated successfully!');
    console.log('\n  You can now log in to the admin dashboard:');
    console.log(`    Email: ${email}`);
    console.log(`    Password: ${password}`);
    console.log('\n  Start the admin dashboard:');
    console.log('    cd admin-dashboard && npm run dev');
    console.log('    Then visit: http://localhost:3001/login');
  } catch (error) {
    console.error('\n✗ Error creating user:', error);
    console.error('\n  Make sure:');
    console.error('    1. Database is set up (run: npm run setup-db)');
    console.error('    2. POSTGRES_URL is set in .env.local');
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  createAdminUser()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('✗ Unexpected error:', error);
      process.exit(1);
    });
}

export { createAdminUser };

