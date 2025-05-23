// auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { fetchUserForLogin } from './lib/actions/user';

export type UserLogin = {
  id: string;
  profileImg: string;
  name: string;
  email: string;
  password: string;
  admin: boolean;
  createdAt: string;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(4) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await fetchUserForLogin(email, password);

          if (!user) return null;
 
            return {
              id: user.id,
              profileImg: user.profileImg,
              name: user.name,
              email: user.email,
              admin: user.admin,
              createdAt: user.createdAt,
            };
        }
        return null;
      },
    }),
  ],

  // Add callbacks to include custom fields in the session and JWT
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.profileImg = user.profileImg;
        token.name = user.name;
        token.email = user.email;
        token.admin = user.admin;
        token.createdAt = user.createdAt;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.profileImg = token.profileImg as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.admin = token.admin as string;
        session.user.createdAt = token.createdAt as string;
      }
      return session;
    },
  },

  session: {
    strategy: 'jwt',
  },
});
