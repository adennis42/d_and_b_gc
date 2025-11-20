/**
 * Database client for PostgreSQL (Vercel Postgres)
 * Shared with main app - uses same database
 */

import postgres from 'postgres';

// Database connection is handled by postgres package
// Environment variables required:
// - POSTGRES_URL

// Note: Prisma Postgres provides a direct connection string
// We use the postgres package directly (same as migration scripts) to handle it properly
const connectionString = process.env.POSTGRES_URL || process.env.PRISMA_DATABASE_URL;

if (!connectionString) {
  throw new Error('POSTGRES_URL or PRISMA_DATABASE_URL environment variable is required');
}

// Create a client that works with both pooled and direct connections
// Using postgres package directly for compatibility with Prisma Postgres
// The postgres package supports template literals directly: sql`SELECT * FROM table`
const sql = postgres(connectionString, {
  max: 10, // Connection pool size
  idle_timeout: 20,
  connect_timeout: 10,
});

export { sql };
