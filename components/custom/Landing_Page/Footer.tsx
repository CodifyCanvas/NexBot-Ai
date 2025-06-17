'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { icons, Images, navLinks } from '@/constants/constants';
import Image from 'next/image';
import Link from 'next/link';
import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 90%',
          end: 'bottom 30%',
          toggleActions: 'play none none none',
        },
        defaults: { ease: 'power3.out' },
      });

      tl.fromTo(
        footerRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, delay: 0.3, duration: 0.5 }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="w-full mt-4 sm:mt-0 py-6 px-5 text-white bg-transparent">
      {/* Top Section: Logo & Navigation */}
      <section className="container max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end border-b border-white/30 pb-4 gap-6">
        {/* Logo & Description */}
        <div className="flex-1">
          <div className="mb-2">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-white">
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
          <p className="text-white/50 text-sm leading-relaxed">
            NexBot is your intelligent AI companion, designed to simplify conversations and spark creativity—making every chat smarter and more meaningful.
          </p>

        </div>

        {/* Navigation Links */}
        <nav className="flex flex-wrap w-full md:w-1/2 justify-center md:justify-end gap-4 text-sm font-semibold text-white/50">
          {navLinks.map(({ label, href }, index) => (
            <Link key={index} href={href} className="hover:underline transition-all duration-300">
              {label}
            </Link>
          ))}
        </nav>
      </section>

      {/* Bottom Section: Legal, Policies, Social */}
      <section className="container max-w-7xl mx-auto mt-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
        {/* Copyright */}
        <p>&copy; 2025 NexBot. All rights reserved.</p>

        {/* Policy Links */}
        <div className="flex gap-4">
          {['Privacy Policy', 'Help Center', 'Security'].map((text, index) => (
            <span key={index} className="cursor-pointer hover:underline">
              {text}
            </span>
          ))}
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-4">
          {icons.map((icon, index) => (
            icon.path && (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    href={icon.link}
                    target={icon.link.startsWith('http') ? '_blank' : undefined}
                    rel={icon.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="relative w-5 h-5 hover:scale-125 transition-transform"
                    aria-label={icon.label}
                  >
                    <Image
                      src={icon.path}
                      alt={icon.label}
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="bg-white text-black text-xs font-medium">
                  {icon.label}
                </TooltipContent>
              </Tooltip>
            )
          ))}
        </div>
      </section>
    </footer>
  );
};

export default Footer;
