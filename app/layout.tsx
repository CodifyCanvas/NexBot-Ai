import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Images } from "@/constants/constants";

// Load Open Sans font with CSS variable for consistent usage across app
const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

// Metadata for SEO and page info, including favicon
export const metadata: Metadata = {
  title: "NexBot — Smarter AI Conversations",
  description:
    "Experience NexBot, the AI-powered chatbot that transforms communication, boosts creativity, and simplifies your workflow with intelligent, natural text-based interactions.",
  icons: {
    icon: `${Images.main_logo_transparent}`,
  },
};

// RootLayout wraps the entire app and provides global providers and styles
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${openSans.variable} antialiased`}
        cz-shortcut-listen="true" // Chrome extension compatibility attribute
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              {children}
              {/* Global toast notifications */}
              <Toaster />
            </TooltipProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
