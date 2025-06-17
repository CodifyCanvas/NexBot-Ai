"use client";

import Image from "next/image";
import { Countries } from "@/constants/constants";
import { Card } from "@/components/ui/card";
import ContactForm from "../ContactForm";
import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ContactSection() {

    const sectionRef = useRef<HTMLElement | null>(null);
    const headingRef = useRef<HTMLHeadingElement | null>(null);
    const titleRef = useRef<HTMLParagraphElement | null>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Reset array each render to avoid stale refs
    cardRefs.current = [];

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

            // Animate background bubbles
            const bubbles = sectionRef.current?.querySelectorAll("div.absolute > div");
            if (bubbles && bubbles.length > 0) {
                tl.fromTo(
                    bubbles,
                    { opacity: 0, scale: 0.8 },
                    { opacity: 1, scale: 1, stagger: 0.2, duration: 0.7 }
                );
            }

            // Animate titleRefs
            if (titleRef.current) {
                tl.fromTo(
                    titleRef.current,
                    { y: -20, opacity: 0 },
                    { y: 0, opacity: 1, stagger: 0.2, duration: 0.5 },
                    "-=0.3"
                );
            }

            // Animate heading
            if (headingRef.current) {
                tl.fromTo(
                    headingRef.current,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5 },
                    "-=0.3"
                );
            }

            // Animate cards
            const filteredCards = cardRefs.current.filter(Boolean);
            if (filteredCards.length > 0) {
                tl.fromTo(
                    filteredCards,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, stagger: 0.2, duration: 0.5 },
                    "-=0.3"
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);


    let cardIndex = 0;

    return (
        <section
            id="contact-us"
            ref={sectionRef}
            className="scroll-mt-20 w-full relative min-h-screen flex flex-col items-center justify-center text-center text-white px-5"
        >
            {/* Gradient Background Circles */}
            <div className="absolute z-0 w-full h-full opacity-50 pointer-events-none">
                <div className="absolute left-[45%] top-1/2 w-48 h-48 bg-gradient-to-br from-red-500 to-red-900 rounded-full opacity-30 blur-2xl transform -translate-x-4/5 -translate-y-4/5" />
                <div className="absolute left-1/2 top-1/2 w-80 h-80 bg-gradient-to-br from-blue-500 to-blue-900 rounded-full opacity-60 blur-2xl transform -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute left-1/2 top-3/4 w-52 h-52 bg-gradient-to-br from-purple-500 to-purple-900 rounded-full opacity-30 blur-2xl transform -translate-x-5/5 -translate-y-5/5" />
                <div className="absolute left-3/5 top-1/2 w-52 h-52 bg-gradient-to-br from-yellow-500 to-yellow-900 rounded-full opacity-30 blur-2xl transform -translate-x-4/5 -translate-y-4/5" />
            </div>

            {/* Main Content */}
            <div className="z-10 max-w-7xl mt-10 flex flex-col gap-6 justify-between items-center">

                <div className="w-full flex flex-col gap-5 sm:flex-row justify-between items-center">
                    <div className="flex flex-col w-full sm:w-1/2 items-start">
                        <p ref={titleRef} className="text-blue-500 font-semibold text-sm sm:text-base">
                            Contact us
                        </p>
                        <h2 ref={headingRef} className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white text-start">
                            Discover the Benefits of Genius
                        </h2>
                    </div>
                    <div className="w-full sm:w-1/2">
                        <p ref={titleRef} className="text-white/50 text-sm md:text-base font-normal text-start">
                            This concise version effectively communicates the main advantages of using NexBot, making it easy for potential users to quickly grasp why they should choose Your platform.
                        </p>
                    </div>
                </div>

                <div className="w-full flex flex-col sm:flex-row gap-5">
                    <div className="w-full sm:w-1/2" ref={(el) => {
                        if (el) cardRefs.current[cardIndex++] = el;
                    }} >
                        <ContactForm />
                    </div>

                    <div className="w-full sm:w-1/2 flex flex-col gap-5">
                        <Card ref={(el) => {
                            if (el) cardRefs.current[cardIndex++] = el;
                        }} className="w-full p-5 flex flex-col items-start isolate bg-white/5 backdrop-blur-lg">
                            <div className="flex flex-row max-h-24 overflow-hidden flex-wrap justify-center items-center gap-4">
                                {Countries.map((item, i) => (
                                    <div key={i} className="relative h-9 w-12 overflow-hidden rounded-sm">
                                        <Image src={item.flag} alt={`${item.country} Flag`} fill style={{ objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                            <h1 className="text-white text-2xl sm:text-3xl font-semibold">Multilingual</h1>
                            <p className="text-white/50 text-sm sm:text-base font-normal text-start">Proficient in comprehending and producing content across multiple languages. enabling effective communbcation and engagement diverse audiences</p>
                        </Card>

                        <div className="w-full flex flex-row justify-between gap-5">
                            <Card ref={(el) => {
                                if (el) {
                                    cardRefs.current[cardIndex++] = el;
                                }
                            }} className="w-1/2 p-5 flex flex-col items-start isolate bg-white/5 backdrop-blur-lg">
                                <h1 className="text-white text-3xl font-semibold">👌</h1>
                                <div>
                                    <h1 className="text-white text-2xl sm:text-3xl font-semibold">95%</h1>
                                    <p className="text-white/50 text-sm sm:text-base font-normal text-start">Efficient</p>
                                </div>
                            </Card>
                            <Card ref={(el) => {
                                if (el) {
                                    cardRefs.current[cardIndex++] = el;
                                }
                            }} className="w-1/2 p-5 flex flex-col items-start isolate bg-white/5 backdrop-blur-lg">
                                <h1 className="text-white text-2xl sm:text-3xl font-semibold">⭐</h1>
                                <div>
                                    <h1 className="text-white text-2xl sm:text-3xl font-semibold">4.8</h1>
                                    <p className="text-white/50 text-sm sm:text-base font-normal text-start">Rating</p>
                                </div>
                            </Card>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}
