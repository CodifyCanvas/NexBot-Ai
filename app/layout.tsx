import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner"
import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "@/components/ui/tooltip"
import { Images } from "@/constants/constants";

const openSans =Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexBot",
  description: "AI-Powered Chatbot",
  icons: {
    icon: `${Images.main_logo_transparent}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${openSans.variable} antialiased`}
        cz-shortcut-listen="true"
      >
        <SessionProvider>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          ><TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
          </ThemeProvider>
          </SessionProvider>

      </body>
    </html>
  );
}
