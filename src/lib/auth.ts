// src/auth.ts
import { NextAuthOptions, Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createUser, getUserByEmail } from '@/app/controllers/userController';
import { IUser, IUserRef } from '@/app/types/user';
import { AppEnv } from '@/config/env';

interface Credentials {
  email: string;
  password: string;
}
export interface MySession extends Session {
  user: IUser;
}

export const authOptions: NextAuthOptions = {
  secret: AppEnv.AUTH_SECRET,
  session: { strategy: 'jwt' },
  providers: [
    GoogleProvider({
      clientId: AppEnv.AUTH_GOOGLE_CLIENT_ID || '',
      clientSecret: AppEnv.AUTH_GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'you@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) throw new Error('Missing credentials');
        const { email, password } = credentials as Credentials;

        const user: IUser | null = await getUserByEmail(email);

        if (!user) throw new Error('No user found');

        if (user.password) {
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) throw new Error('Password doesnt Match');
        }

        return {
          id: (user.id || '')?.toString(),
          email: user.email,
          name: user.name,
          provider: user.provider || 'credentials',
          image: user.image || null,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && profile) {
        // Check if user exists
        let dbUser = await getUserByEmail(profile.email || '');
        if (!dbUser) {
          // Create user if doesn't exist
          dbUser = await createUser({
            name: profile.name,
            email: profile.email,
            image: profile.image,
            //
            // password: undefined, // Google users have no password
            id: profile.sub,
            provider: 'google',
          });
        }

        // Override the user object returned to JWT
        user.id = dbUser.id.toString();
        user.email = dbUser.email;
        user.name = dbUser.name;
        // user.provider = dbUser.provider || "google";
        user.image = dbUser.image || null;
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        const userData = user as IUserRef;
        token.user = {
          name: userData.name,
          image: userData.image,
          email: userData.email,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token && token?.user) {
        const userData = token.user as IUserRef;
        session.user = {
          name: userData.name,
          image: userData.image,
          email: userData.email,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
};

export default authOptions;
