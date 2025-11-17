// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// NextAuth configuration
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt", // use JWT-based session
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email & password required");
        }

        // Find user in the database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        // Compare password with hashed password
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }

        // Return user object for JWT
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    // Add user info to JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },

    // Add token info to session object
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string | undefined;
        session.user.name = token.name ?? session.user.name;
        session.user.role = token.role as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login", // custom login page
  },

  secret: process.env.NEXTAUTH_SECRET, // required for JWT signing
};

// Next.js App Router: export GET and POST handlers
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
