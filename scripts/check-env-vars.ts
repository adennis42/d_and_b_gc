/**
 * Script to check which Postgres environment variables are set
 * Helps diagnose connection issues
 * 
 * Usage: npx tsx scripts/check-env-vars.ts
 */

// Load .env.local file if it exists
import { readFileSync } from 'fs';
import { join } from 'path';

try {
  const envPath = join(process.cwd(), '.env.local');
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
} catch (error) {
  // .env.local doesn't exist or can't be read - that's okay
}

const envVars = [
  'POSTGRES_URL',
  'POSTGRES_URL_NON_POOLING',
  'POSTGRES_URL_NO_SSL',
  'DATABASE_URL',
  'DATABASE_URL_NON_POOLING',
  'PRISMA_DATABASE_URL',
  'POSTGRES_PRISMA_URL',
];

console.log('Checking Postgres environment variables...\n');

let found = false;
for (const varName of envVars) {
  const value = process.env[varName];
  if (value) {
    found = true;
    // Mask sensitive parts of connection string
    const masked = value.replace(/:([^:@]+)@/, ':****@');
    console.log(`✓ ${varName}: ${masked.substring(0, 50)}...`);
  }
}

if (!found) {
  console.log('✗ No Postgres environment variables found!\n');
  console.log('  Make sure you have one of these set in .env.local:');
  envVars.forEach(v => console.log(`    - ${v}`));
  console.log('\n  If Vercel provided different variable names, add them to .env.local');
  process.exit(1);
}

console.log('\n✓ Environment variables found!');
console.log('\n  Next steps:');
console.log('    1. Run: npm run setup-db');
console.log('    2. Run: npm run migrate-db');

