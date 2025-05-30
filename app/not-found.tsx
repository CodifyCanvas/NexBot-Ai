import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Lost in the Matrix - NexBot 404",
  description: "Looks like you’ve wandered off track. Let’s get you back to chatting with NexBot!",
};

export default function NotFound() {
  return (
    <main className="flex h-screen w-full items-center justify-center radial-center-gradient-bg-dark">
      <section className="flex flex-col items-center gap-5 text-center px-4">
        <h1 className="text-9xl font-extrabold uppercase text-white">404</h1>
        <p className="text-white/80 uppercase max-w-lg">
          We are sorry, but the page you requested was not found.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/chat" passHref>
            <Button className="w-40 py-5 uppercase text-white cursor-pointer font-semibold bg-gradient-to-tr from-blue-400 to-blue-700">
              Go Home
            </Button>
          </Link>
          <Link href="/contact" passHref>
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
