'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import { Images, navLinks } from "@/constants/constants";

import gsap from "gsap";

export default function Navbar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // Refs for animation targets
  const logoRef = useRef<HTMLDivElement | null>(null);
const navRef = useRef<HTMLDivElement | null>(null);
const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  if (logoRef.current?.children) {
    tl.fromTo(
      Array.from(logoRef.current.children),
      { y: -20, scale: 0.8, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, stagger: 0.2, delay: 0.3, duration: 0.6 }
    );
  }

  if (navRef.current?.children) {
    tl.fromTo(
      Array.from(navRef.current.children),
      { y: -20, scale: 0.6, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, stagger: 0.2, duration: 0.6 }
    );
  }

  if (buttonRef.current) {
    tl.fromTo(
      buttonRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6 }
    );
  }
}, []);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 20) {
        if (!scrolled) setScrolled(true);
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            duration: 0.5,
            backgroundColor: "rgba(0, 0, 0, 0.10)", // bg-white/5
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)", // shadow-lg
            borderColor: "rgba(255, 255, 255, 0.2)", // border-white/20
            marginTop: "20px",
            borderRadius: "1rem", // rounded-xl
            ease: "power3.out",
          });
        }
      } else {
        if (scrolled) setScrolled(false);
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            duration: 0.5,
            backgroundColor: "transparent",
            boxShadow: "none",
            borderColor: "transparent",
            marginTop: "0px",
            borderRadius: "0",
            ease: "power3.out",
          });
        }
      }
    }

    window.addEventListener("scroll", handleScroll);

    // Cleanup listener
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  return (
    <header className="sticky top-0 z-50 w-full px-5 border-none">
      <div
        ref={containerRef}
        className={`container backdrop-blur-md mx-auto flex items-center justify-between px-4 py-3 border transition-none`}
        style={{
          borderColor: "transparent",
          backgroundColor: "transparent",
          boxShadow: "none",
          marginTop: 0, 
          borderRadius: 0,
        }}
      >
        {/* Logo */}
        <div ref={logoRef}>
          <Link href="/" className="text-lg flex items-center gap-2 font-bold text-white">
          <Image
            src={Images.main_logo_transparent}
            alt="NexBot Logo"
            width={30}
            height={30}
            priority
          />
            NexBot
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav
  ref={navRef}
  className="absolute left-1/2 -translate-x-1/2 hidden md:flex gap-12 font-semibold"
>
  {navLinks.map((link) => (
    <Link
      key={link.href}
      href={link.href}
      className="text-md font-medium text-white/90 transition duration-300 group hover:text-blue-500 text-nowrap"
    >
      {link.label}
      <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-blue-500" />
    </Link>
  ))}
</nav>

        {/* Right Side (Button + Mobile Menu) */}
        <div className="flex items-center gap-2">
          {/* Desktop Button */}
          <Link href='/login'>
          <button
          ref={buttonRef}
            className="cursor-pointer bg-gradient-to-b from-blue-400 to-blue-600 shadow-[0px_4px_32px_0_rgba(99,102,241,.70)] px-6 py-2 rounded-xl border-[1px] border-blue-800 text-white font-medium group"
          >
            <div className="relative overflow-hidden">
              <p
                className="group-hover:-translate-y-7 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]"
              >
                Login
              </p>
              <p
                className="absolute top-7 left-0 group-hover:top-0 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]"
              >
                Login
              </p>
            </div>
          </button>
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="bg-white/5 backdrop-blur-lg border-none outline-none"
              >
                <SheetHeader className="sr-only">
                  <SheetTitle>Navbar</SheetTitle>
                  <SheetDescription>Mobile navigation menu</SheetDescription>
                </SheetHeader>

                <nav className="flex flex-col gap-4 mt-6 p-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium max-w-fit text-white/80 transition duration-300 group hover:text-blue-500"
                    >
                      {link.label}
                      <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-blue-500" />
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
