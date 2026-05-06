/**
 * NextAuth configuration for admin dashboard
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { sql } from "@/lib/db";
import bcrypt from "bcryptjs";

// Extend NextAuth types to include role
declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role?: string;
    };
  }
}

// Normalize AUTH_URL to ensure it has a protocol
// NextAuth v5 reads this from environment and uses it for callback URLs
function normalizeAuthUrl() {
  const authUrl = process.env.AUTH_URL;
  if (!authUrl) {
    // Default to localhost in development
    return process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3001' 
      : undefined;
  }
  
  // If it already has a protocol, return as-is
  if (authUrl.startsWith('http://') || authUrl.startsWith('https://')) {
    return authUrl;
  }
  
  // Add protocol based on environment
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  return `${protocol}://${authUrl}`;
}

// Normalize AUTH_URL before NextAuth reads it
const normalizedAuthUrl = normalizeAuthUrl();
if (normalizedAuthUrl) {
  process.env.AUTH_URL = normalizedAuthUrl;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true, // Required for NextAuth v5 - automatically detects URL from request
  debug: process.env.NODE_ENV === 'development', // Enable debug logging in development
  basePath: "/api/auth", // Explicitly set the base path for NextAuth routes
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          // Find user by email (case-insensitive)
          const result = await sql`
            SELECT id, email, password_hash, role, name
            FROM users
            WHERE LOWER(email) = LOWER(${credentials.email as string})
            LIMIT 1
          `;

          // postgres package returns arrays directly
          const users = Array.isArray(result) ? result : [];
          
          if (users.length === 0) {
            // User doesn't exist - throw error that will be caught by NextAuth
            // NextAuth v5 will pass this error message to the client
            throw new Error("ACCOUNT_NOT_FOUND");
          }

          const user = users[0];

          // Verify password
          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password_hash as string
          );

          if (!isValid) {
            // Invalid password - throw error (same message for security - don't reveal if email exists)
            throw new Error("ACCOUNT_NOT_FOUND");
          }

          // Authentication successful
          return {
            id: user.id as string,
            email: user.email as string,
            name: (user.name as string) || null,
            role: (user.role as string) || "admin",
          };
        } catch (error) {
          // Re-throw our custom error so NextAuth can handle it
          if (error instanceof Error && error.message === "ACCOUNT_NOT_FOUND") {
            throw error;
          }
          // Log unexpected errors but don't expose them to the user
          console.error("[NextAuth] Auth error:", error);
          // For any other error, also return account not found for security
          throw new Error("ACCOUNT_NOT_FOUND");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});

