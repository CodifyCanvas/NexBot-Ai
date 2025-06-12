import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

// Metadata for SEO and browser tab info
export const metadata: Metadata = {
  title: "Oops! Page Not Found — NexBot",
  description:
    "Looks like this page took a wrong turn. Return to NexBot and continue your intelligent chat journey.",
};

export default function NotFound() {
  return (
    <main className="flex h-screen w-full items-center justify-center radial-center-gradient-bg-dark">
      <section className="flex flex-col items-center gap-5 text-center px-4">
        {/* Large 404 heading */}
        <h1 className="text-9xl font-extrabold uppercase text-white">404</h1>

        {/* Friendly explanation message */}
        <p className="text-white/80 uppercase max-w-lg">
          Sorry, the page you’re looking for doesn’t exist.
        </p>

        {/* Navigation buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          {/* Home button */}
          <Link href="/chat" passHref>
            <Button className="w-40 py-5 uppercase text-white cursor-pointer font-semibold bg-gradient-to-tr from-blue-400 to-blue-700">
              Go Home
            </Button>
          </Link>

          {/* Contact button */}
          <Link href="/" passHref>
            <Button
              variant="outline"
              className="w-40 py-5 uppercase cursor-pointer font-semibold backdrop-blur-2xl bg-white/20 text-white"
            >
              Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
