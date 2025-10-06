import NextAuth from 'next-auth';
// import { authConfig } from './auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/db/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compareSync } from 'bcrypt-ts-edge';
import type { NextAuthConfig } from 'next-auth';

export const config = {
      pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
    adapter: PrismaAdapter(prisma),
    providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        // find use in database 
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });
        if (user && user.password) {
            const isMatch = compareSync(credentials.password as string, user.password);

            // If password is correct, return user
            if (isMatch) {
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                }
            }  
        }
        // If user does not exist or password does not match return null
        return null;
      }
    })],
    callbacks: {
    async session({ session, user, trigger, token }: any) {
        // Set the user ID from the token
        session.user.id = token.sub;

        // If there is an update, set the user name
        if (trigger === 'update') {
            session.user.name = token.name;
        }

        return session;
    },
},
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);