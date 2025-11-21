/**
 * Database client for PostgreSQL (Vercel Postgres)
 * Provides connection pooling and query utilities
 */

import postgres from 'postgres';
import type { Project } from '@/types';

// Database connection is handled by postgres package
// 
// Environment variables supported (in order of preference):
// - POSTGRES_URL (primary)
// - PRISMA_DATABASE_URL (Prisma-specific)
//
// Note: Prisma Postgres provides direct connection strings
// We use the postgres package directly (same as admin-dashboard) to handle it properly

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

/**
 * Execute a SQL query
 * @param query - SQL query string
 * @param params - Query parameters
 * @returns Query result
 */
export async function query<T = unknown>(
  queryText: string,
  params?: unknown[]
): Promise<T[]> {
  try {
    // postgres package doesn't have a .query() method with params array
    // Use template literal syntax instead
    // Cast params to any[] to satisfy TypeScript (unsafe method accepts any[])
    const result = await sql.unsafe(queryText, (params || []) as any[]);
    // Convert RowList to array
    const arrayResult = Array.isArray(result) ? Array.from(result) : [result];
    return arrayResult as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Execute a SQL query and return a single row
 * @param queryText - SQL query string
 * @param params - Query parameters
 * @returns Single row or null
 */
export async function queryOne<T = unknown>(
  queryText: string,
  params?: unknown[]
): Promise<T | null> {
  const results = await query<T>(queryText, params);
  return results[0] || null;
}

/**
 * Execute a SQL query and return the first value
 * @param queryText - SQL query string
 * @param params - Query parameters
 * @returns First value or null
 */
export async function queryValue<T = unknown>(
  queryText: string,
  params?: unknown[]
): Promise<T | null> {
  const result = await queryOne<{ value: T }>(queryText, params);
  return result?.value || null;
}

/**
 * Execute an INSERT/UPDATE/DELETE query
 * @param queryText - SQL query string
 * @param params - Query parameters
 * @returns Number of affected rows
 */
export async function execute(
  queryText: string,
  params?: unknown[]
): Promise<number> {
  try {
    // Cast params to any[] to satisfy TypeScript (unsafe method accepts any[])
    const result = await sql.unsafe(queryText, (params || []) as any[]);
    // postgres package returns array, count is length
    return Array.isArray(result) ? result.length : 1;
  } catch (error) {
    console.error('Database execute error:', error);
    throw error;
  }
}

/**
 * Test database connection
 * @returns true if connection is successful
 */
export async function testConnection(): Promise<boolean> {
  try {
    await sql`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}

// Export sql for direct access if needed (template literal usage)
export { sql };
