// auth.config.ts
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      // Define the protected paths
      const protectedRoutes = ['/chat', '/admin'];
      const isProtected = protectedRoutes.some(path =>
        nextUrl.pathname.startsWith(path)
      );

      const isOnLoginPage = nextUrl.pathname === '/login';

      if (isProtected) {
        // Block access if not logged in
        return isLoggedIn;
      }

      if (isLoggedIn && isOnLoginPage) {
        // Redirect logged-in users away from login page
        return Response.redirect(new URL('/chat', nextUrl));
      }

      // Allow access to non-protected public routes
      return true;
    },
  },
  providers: [], // Add providers here
} satisfies NextAuthConfig;
