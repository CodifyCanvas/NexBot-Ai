"use client";

import FeatureCard from "@/components/custom/FeatureCard";
import { Images } from "@/constants/constants";
import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardRefs = useRef<HTMLElement[]>([]);
  const labelsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none none",
        },
        defaults: { ease: "power3.out" },
      });

      const bubbles = sectionRef.current?.querySelectorAll("div.absolute > div");
      if (bubbles?.length) {
        tl.fromTo(
          bubbles,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, stagger: 0.2, duration: 0.7 }
        );
      }

      if (titleRef.current) {
        tl.fromTo(
          titleRef.current,
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 }
        );
      }

      if (headingRef.current) {
        tl.fromTo(
          headingRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.3"
        );
      }

      if (cardRefs.current.length) {
        tl.fromTo(
          cardRefs.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.2, duration: 0.5 },
          "-=0.4"
        );
      }

      if (labelsRef.current?.children?.length) {
        tl.fromTo(
          labelsRef.current.children,
          { y: 20, x: 20, opacity: 0 },
          { y: 0, x: 0, opacity: 1, stagger: 0.2, duration: 0.5 },
          "-=0.5"
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  let cardIndex = 0;

  return (
    <section
      id="features"
      ref={sectionRef}
      className="scroll-mt-24 w-full relative min-h-screen flex flex-col items-center justify-center text-center text-white px-5"
    >
      {/* Background Circles */}
      <div className="absolute z-0 w-full h-full opacity-50 pointer-events-none">
        <div className="absolute left-1/2 top-3/4 w-52 h-52 bg-gradient-to-br from-purple-500 to-purple-900 rounded-full opacity-30 blur-2xl -translate-x-[100%] -translate-y-[100%]" />
        <div className="absolute left-1/2 top-1/2 w-80 h-80 bg-gradient-to-br from-blue-500 to-blue-900 rounded-full opacity-60 blur-2xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute left-[60%] top-1/2 w-52 h-52 bg-gradient-to-br from-yellow-500 to-yellow-900 rounded-full opacity-30 blur-2xl -translate-x-[80%] -translate-y-[80%]" />
        <div className="absolute left-[45%] top-1/2 w-48 h-48 bg-gradient-to-br from-red-500 to-red-900 rounded-full opacity-30 blur-2xl -translate-x-[80%] -translate-y-[80%]" />
      </div>

      {/* Main Content */}
      <div className="z-10 w-fit">
        <p ref={titleRef} className="text-blue-500 font-semibold text-sm sm:text-base">
          Our Features
        </p>
        <h2
          ref={headingRef}
          className="text-2xl sm:text-4xl font-semibold text-white text-center"
        >
          Transform your workflow with AI
        </h2>

        <div className="max-w-7xl mt-10 flex flex-col gap-6">
          {/* Main Feature Card */}
          <FeatureCard
            ref={(el) => {
              if (el) cardRefs.current[cardIndex++] = el;
            }}
            title="Chat Smarter with NextBot"
            subtitle="Your Personal AI Companion"
            description="Engage in natural, intelligent conversations with our powerful AI chatbot. Whether you're brainstorming ideas, solving problems, or just having a friendly chat, NextBot adapts to your needs—offering fast, reliable, and human-like interactions 24/7."
            imageSrc={Images.main_feature_card}
            hasImage
            labelsRef={labelsRef}
          />

          {/* Smaller Features */}
          <div className="flex flex-col md:flex-row gap-5">
            {[
              {
                title: "Boost Productivity",
                description:
                  "Get real-time answers, summaries, and insights. From writing assistance to quick research, NextBot helps you work smarter—not harder.",
              },
              {
                title: "Always Available",
                description:
                  "NextBot learns from your style and preferences over time, delivering more personalized and accurate responses every time you chat.",
              },
              {
                title: "Simplify Tasks",
                description:
                  "Forget commands or code—just type what you need. NextBot understands plain language and delivers powerful results with ease.",
              },
            ].map((card, i) => (
              <FeatureCard
                key={i}
                ref={(el) => {
                  if (el) cardRefs.current[cardIndex++] = el;
                }}
                {...card}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
