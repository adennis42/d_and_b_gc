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

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true, // Required for NextAuth v5 in some configurations
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Find user by email
          const result = await sql`
            SELECT id, email, password_hash, role, name
            FROM users
            WHERE email = ${credentials.email as string}
            LIMIT 1
          `;

          // postgres package returns arrays directly
          const users = Array.isArray(result) ? result : [];
          if (users.length === 0) {
            return null;
          }

          const user = users[0];

          // Verify password
          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password_hash as string
          );

          if (!isValid) {
            return null;
          }

          return {
            id: user.id as string,
            email: user.email as string,
            name: (user.name as string) || null,
            role: (user.role as string) || "admin",
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
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

