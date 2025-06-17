"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Crosshair, Telescope } from "lucide-react";
import { Images } from "@/constants/constants";
import { Card } from "@/components/ui/card";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRefs = useRef<HTMLParagraphElement[]>([]);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const imageRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
  gsap.registerPlugin(ScrollTrigger);

  if (!sectionRef.current) return;

  const ctx = gsap.context(() => {
    const section = sectionRef.current!;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none none",
      },
      defaults: { ease: "power3.out" },
    });

    const bubbles = section.querySelectorAll("div.absolute > div");
    if (bubbles.length) {
      tl.fromTo(bubbles, { opacity: 0, scale: 0.8 }, {
        opacity: 1, scale: 1, stagger: 0.2, duration: 0.7,
      });
    }

    if (titleRefs.current.length) {
      tl.fromTo(titleRefs.current, { y: -20, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.2, duration: 0.4,
      }, "-=0.5");
    }

    if (headingRef.current) {
      tl.fromTo(headingRef.current, { y: 20, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.4,
      }, "-=0.3");
    }

    const cards = cardRefs.current.filter(Boolean);
    if (cards.length) {
      tl.fromTo(cards, { y: 20, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.2, duration: 0.5,
      }, "-=0.3");
    }

    if (imageRef.current) {
      tl.fromTo(imageRef.current, { y: 20, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.5,
      }, "-=0.3");
    }
  }, sectionRef);

  return () => ctx.revert();
}, []);


  return (
    <section
      id="about"
      ref={sectionRef}
      className="scroll-mt-24 md:scroll-mt-0 w-full relative min-h-screen flex flex-col items-center justify-center text-center text-white px-5"
    >
      {/* Background Bubbles */}
      <div className="absolute z-0 w-full h-full opacity-50 pointer-events-none">
        {[
          { className: "left-1/2 top-1/2 w-80 h-80 from-blue-500 to-blue-900 -translate-x-1/2 -translate-y-1/2", opacity: "60" },
          { className: "left-3/5 top-1/2 w-52 h-52 from-yellow-500 to-yellow-900 -translate-x-4/5 -translate-y-4/5", opacity: "30" },
          { className: "left-1/2 top-3/4 w-52 h-52 from-purple-500 to-purple-900 -translate-x-5/5 -translate-y-5/5", opacity: "30" },
          { className: "left-[45%] top-1/2 w-48 h-48 from-red-500 to-red-900 -translate-x-4/5 -translate-y-4/5", opacity: "30" },
        ].map((b, i) => (
          <div
            key={i}
            className={`absolute ${b.className} bg-gradient-to-br rounded-full opacity-${b.opacity} blur-2xl`}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="z-10 max-w-7xl mt-10 flex flex-col md:flex-row gap-6 justify-between items-center">
        {/* Left */}
        <div className="flex flex-col items-start gap-7 mb-10 w-full md:w-1/2">
          <p
            ref={(el) => {
              if (el) titleRefs.current[0] = el;
            }}
            className="text-blue-500 font-semibold text-sm sm:text-base"
          >
            About Us
          </p>

          <h2
            ref={headingRef}
            className="text-2xl sm:text-4xl font-semibold text-white text-start"
          >
            Innovate with Intelligence
          </h2>

          <p
            ref={(el) => {
              if (el) titleRefs.current[1] = el;
            }}
            className="text-white/50 text-sm sm:text-base font-normal text-start"
          >
            At NexBot, we’re dedicated to leveraging AI to make communication smarter and easier. Our text-based chatbot empowers users and businesses to connect, create, and solve challenges faster—transforming everyday interactions with intelligent technology.
          </p>

          {/* Info Cards */}
          <div className="w-full flex flex-row gap-5">
            {[
              {
                title: "Our Mission",
                description: "Making advanced AI simple, accessible, and helpful for everyone.",
                Icon: Crosshair,
              },
              {
                title: "Our Vision",
                description: "A future where AI and human creativity work together effortlessly.",
                Icon: Telescope,
              },
            ].map((card, i) => (
              <Card
                key={i}
                ref={(el) => {
                  if (el) {
                    cardRefs.current[i] = el;
                  } else {
                    cardRefs.current[i] = null!;
                  }
                }}
                className="bg-white/5 outline outline-gray-700 p-2 flex flex-row justify-between w-full"
              >
                <div className="flex flex-col lg:flex-row items-start gap-4 w-full">
                  <card.Icon className="text-blue-500 w-10 h-10 pl-2 lg:scale-150" />
                  <div className="flex flex-col justify-center items-start gap-2">
                    <h1 className="text-white text-xl font-semibold">{card.title}</h1>
                    <p className="text-white/50 text-sm sm:text-base font-normal text-start">
                      {card.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right: Image */}
        <div
          ref={imageRef}
          className="relative flex rounded-xl items-center justify-center overflow-hidden w-full md:max-w-1/2 max-h-[70vh]"
        >
          <Image
            src={Images.about_image}
            alt="About image"
            width={400}
            height={500}
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
