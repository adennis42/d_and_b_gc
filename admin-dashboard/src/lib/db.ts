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

// Lazy initialization - only create connection when actually needed
// This prevents build-time errors when environment variables aren't available
let sqlClient: ReturnType<typeof postgres> | null = null;

function getSqlClient() {
  if (!sqlClient) {
    let connectionString = process.env.POSTGRES_URL || process.env.PRISMA_DATABASE_URL;
    
    if (!connectionString) {
      // During build time, throw a helpful error
      throw new Error('POSTGRES_URL or PRISMA_DATABASE_URL environment variable is required. Make sure to set it in Vercel environment variables.');
    }

    // Strip quotes if present (sometimes Vercel env vars get double-quoted)
    // Remove leading/trailing quotes and whitespace
    connectionString = connectionString.trim().replace(/^["']|["']$/g, '');

    // Create a client that works with both pooled and direct connections
    // Using postgres package directly for compatibility with Prisma Postgres
    // The postgres package supports template literals directly: sql`SELECT * FROM table`
    sqlClient = postgres(connectionString, {
      max: 10, // Connection pool size
      idle_timeout: 20,
      connect_timeout: 10,
    });
  }
  
  return sqlClient;
}

// Create a template tag function that lazily initializes the client
function sqlTemplate(strings: TemplateStringsArray, ...values: any[]) {
  const client = getSqlClient();
  return (client as any)(strings, ...values);
}

// Attach methods to the template function
(sqlTemplate as any).unsafe = (query: string, params?: any[]) => {
  const client = getSqlClient();
  return (client as any).unsafe(query, params);
};

// Export sql as the template function with attached methods
const sql = sqlTemplate as ReturnType<typeof postgres>;

export { sql };
