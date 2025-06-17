"use client";
import { useLayoutEffect, useRef } from "react";
import { MousePointer2 } from "lucide-react";
import gsap from "gsap";
import Link from "next/link";

export default function HeroSection() {
  // Refs for animation targets
  const sectionRef = useRef<HTMLElement | null>(null);
const headingRef = useRef<HTMLDivElement | null>(null);
const descriptionRef = useRef<HTMLParagraphElement | null>(null);
const labelsRef = useRef<HTMLDivElement | null>(null);
const buttonRef = useRef<HTMLButtonElement | null>(null);


  useLayoutEffect(() => {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  if (sectionRef.current) {
    const bubbles = sectionRef.current.querySelectorAll("div.absolute > div");
    if (bubbles.length > 0) {
      tl.fromTo(
        bubbles,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, stagger: 0.2, duration: 1 }
      );
    }
  }

  if (labelsRef.current?.children) {
    tl.fromTo(
      labelsRef.current.children,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.2, duration: 0.5 },
      "-=0.5"
    );
  }

  if (headingRef.current?.children) {
    tl.fromTo(
      headingRef.current.children,
      { scale: 0.75, opacity: 0 },
      { scale: 1, opacity: 1, stagger: 0.2, duration: 0.5 },
      "-=0.4"
    );
  }

  if (descriptionRef.current) {
    tl.fromTo(
      descriptionRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      "-=0.2"
    );
  }

  if (buttonRef.current) {
    tl.fromTo(
      buttonRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6 },
      "-=0.2"
    );
  }
}, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="scroll-mt-[100px] w-full relative min-h-[calc(100vh-60px)] flex flex-col items-center justify-center text-center text-white px-5"
    >
      {/* Background Gradient Circles */}
      <div className="absolute z-0 w-full h-full opacity-70">
        <div className="absolute z-0 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-br from-blue-500 to-blue-900 opacity-60 blur-2xl pointer-events-none"></div>
        <div className="absolute z-0 left-[45%] top-2/4 transform -translate-x-4/5 -translate-y-4/5 w-48 h-48 rounded-full bg-gradient-to-br from-red-500 to-red-900 opacity-30 blur-2xl pointer-events-none"></div>
        <div className="absolute z-0 left-3/5 top-2/4 transform -translate-x-4/5 -translate-y-4/5 w-52 h-52 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-900 opacity-30 blur-2xl pointer-events-none"></div>
        <div className="absolute z-0 left-3/6 top-3/4 transform -translate-x-5/5 -translate-y-5/5 w-52 h-52 rounded-full bg-gradient-to-br from-purple-500 to-purple-900 opacity-30 blur-2xl pointer-events-none"></div>
      </div>

      {/* Main Content Container */}
      <div className="w-fit z-20 relative">
        {/* Pointer Labels */}
        <div
          ref={labelsRef}
          className="absolute z-10 w-full h-full top-0 left-0 pointer-events-none"
        >
          {/* Top Left Label */}
          <div className="top-0 left-0 flex flex-row items-end gap-3">
            <div className="px-4 hidden sm:flex py-2 w-fit bg-gradient-to-tr to-pink-500 from-pink-600 text-black rounded-full text-sm font-bold">
              Social Media
            </div>
            <MousePointer2 className="fill-pink-500 text-pink-500 rotate-[175deg]" />
          </div>

          {/* Top Right Label */}
          <div className="bottom-0 right-24 flex flex-row justify-end items-end gap-3">
            <MousePointer2 className="fill-purple-500 text-purple-500 -rotate-[60deg]" />
            <div className="px-4 py-2 hidden sm:flex w-fit bg-gradient-to-tr to-purple-500 from-purple-600 text-black rounded-full text-sm font-bold">
              Chat
            </div>
          </div>

          {/* Bottom Left Label */}
          <div className="absolute bottom-43 left-0 flex flex-row items-start gap-3">
            <div className="px-4 py-2 hidden sm:flex w-fit bg-yellow-400 text-black rounded-full text-sm font-bold">
              Blog
            </div>
            <MousePointer2 className="fill-yellow-400 text-yellow-400 rotate-[125deg]" />
          </div>

          {/* Bottom Right Label */}
          <div className="absolute bottom-40 right-0 flex flex-row items-center justify-start gap-3">
            <MousePointer2 className="fill-fuchsia-400 text-fuchsia-400 -rotate-[25deg]" />
            <div className="px-4 py-2 hidden sm:flex w-fit bg-gradient-to-tr to-fuchsia-400 from-fuchsia-500 text-black rounded-full text-sm font-bold">
              Ideas
            </div>
          </div>
        </div>

        {/* Heading & Subtitle */}
        <div
          ref={headingRef}
          className="flex flex-col items-center justify-center gap-5"
        >
          <p className="text-gray-400 font-semibold text-sm sm:text-base transition-all duration-300">
            Transform Ideas into Reality with NexBot
          </p>
          <h1 className="flex text-[clamp(2rem,6vw,6rem)]  flex-col items-center justify-center w-full leading-tight font-bold mb-8 transition-all duration-300">
            <span>Examine the</span>
            <span>Protentail of Genius&apos;s</span>
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 drop-shadow-lg leading-tight">
              AI Chatting
            </span>
          </h1>
        </div>

        {/* Description and Call to Action */}
        <div className="w-full flex flex-col items-center justify-center gap-7">
          <p ref={descriptionRef} className="max-w-2xl text-gray-400 text-sm sm:text-base font-semibold transition-all duration-300">
            At Genius, we harness the power of artificial intelligence to
            elevate the way you work, think, and create. Our platform offers a
            suite of cutting-edge AI tools built to revolutionize writing,
            coding, and problem-solving — turning your ideas into powerful
            outcomes.
          </p>
          <Link href='/chat'>
            <button
              ref={buttonRef}
              className="cursor-pointer  bg-gradient-to-b from-blue-400 to-blue-600 shadow-[0px_4px_32px_0_rgba(99,102,241,.70)] px-8 py-2 rounded-xl border-[1px] border-blue-800 text-white font-medium group"
            >
              <div className="relative overflow-hidden">
                <p className="group-hover:-translate-y-7 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
                  Get Started
                </p>
                <p className="absolute top-7 left-0 group-hover:top-0 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
                  Get Started
                </p>
              </div>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
