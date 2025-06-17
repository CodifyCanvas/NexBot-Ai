import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { fetchUserForLogin } from './lib/actions/user';
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

export type UserLogin = {
  id: string;
  name: string;
  email: string;
  password?: string;
  admin: boolean;
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
            id: String(user.id),
            name: user.name,
            email: user.email,
            admin: user.admin,
          };
        }
        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: UserLogin }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.admin = user.admin;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.id ?? "";
        session.user.name = token.name ?? "";
        session.user.email = token.email ?? "";
        session.user.admin = token.admin ?? false;
      }
      return session;
    },
  },

  session: {
    strategy: 'jwt',
  },
});
