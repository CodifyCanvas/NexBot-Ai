import React, { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MoveUpRight, Sparkles, WandSparkles } from "lucide-react";
import Image from "next/image";

interface FeatureCardProps {
  title: string;
  subtitle?: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  hasImage?: boolean;
  labelsRef?: React.Ref<HTMLDivElement>;
}

const FeatureCard = forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ title, subtitle, description, imageSrc, imageAlt, hasImage = false, labelsRef }, ref) => {
    return (
      <Card
        ref={ref}
        className={`bg-white/5 outline outline-gray-700 px-7 flex ${
          hasImage ? "flex-col-reverse sm:flex-row" : "flex-col"
        } justify-between w-full gap-6`}
      >
        {/* Left/Text Content */}
        <div
          className={`flex flex-col justify-center items-start gap-4 ${
            hasImage ? "w-full sm:w-1/2" : "w-full"
          }`}
        >
          <h1 className="text-white text-2xl sm:text-3xl font-semibold text-start">{title}</h1>
          {subtitle && (
            <h2 className="text-white/75 text-base sm:text-lg font-semibold">{subtitle}</h2>
          )}
          <p className="text-white/50 text-sm sm:text-base font-normal text-start">{description}</p>

          <Button className="group flex items-center gap-2 text-base sm:text-lg text-white bg-transparent hover:bg-transparent mt-10 transition-all duration-300 hover:underline">
            Explore
            <span className="p-2 rounded-full transition-all duration-300 group-hover:bg-white">
              <MoveUpRight
                size={20}
                className="text-white transition-all duration-300 transform group-hover:text-black group-hover:scale-125"
              />
            </span>
          </Button>
        </div>

        {/* Right/Image Content */}
        {hasImage && imageSrc && (
          <div className="relative w-full sm:w-1/2 h-80">
            <Image
              src={imageSrc}
              alt={imageAlt || "AI Feature"}
              fill
              className="object-cover rounded-lg"
              priority={false}
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Labels Overlay */}
            <div
              ref={labelsRef}
              className="absolute z-10 w-full h-full top-0 left-0 pointer-events-none"
            >
              {/* Top Left Label */}
              <div className="absolute top-10 -left-10 hidden md:flex items-start gap-3">
                <div className="px-4 py-2 flex items-center gap-3 bg-white/5 backdrop-blur-md outline outline-blue-500 text-white/85 rounded-full text-sm font-semibold">
                  <Sparkles className="text-blue-500" size={17} />
                  Enter Your Prompt
                </div>
              </div>

              {/* Bottom Right Label */}
              <div className="absolute bottom-5 -right-10 hidden md:flex items-center gap-3">
                <div className="px-4 py-2 flex items-center gap-3 bg-white/5 backdrop-blur-md outline outline-purple-500 text-white/90 rounded-full text-sm font-semibold">
                  <WandSparkles className="text-purple-500" size={17} />
                  Write Description
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    );
  }
);

FeatureCard.displayName = "FeatureCard";
export default FeatureCard;
