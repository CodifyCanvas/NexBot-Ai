  // LoginPage.tsx

  import { Metadata } from "next";
  import Image from "next/image";
  import { Images, Names } from "@/constants/constants";
import Link from "next/link";
import { SignupForm } from "@/components/signup-form";

  export const metadata: Metadata = {
    title: "NexBot - Login",
    description: "AI-Powered Chatbot",
  };

  export default function LoginPage() {
    return (
      <div className="grid min-h-screen relative z-0 lg:grid-cols-2 overflow-hidden radial-center-gradient-bg-dark">
        {/* 🖼️ Left side: Image */}

        {/* Logo/Header */}
          <div className="flex absolute z-20 top-10 left-1/2 -translate-x-1/2 md:-translate-x-0 md:left-10 justify-center gap-2 md:justify-start w-full max-w-xs">
  <Link href="/" className="flex items-center gap-2 font-medium">
    <div className="bg-none text-primary-foreground flex size-6 items-center justify-center rounded-md">
      <Image
        src={Images.main_logo_transparent}
        alt="main Logo"
        width={20}
        height={20}
      />
    </div>
    {Names.app_name}
  </Link>
</div>


        <div className="relative hidden lg:block overflow-hidden">
          <Image
            src={Images.ai_svg_signup}
            alt="SVG"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* 🔐 Right side: Login form */}
        <div className="flex flex-col gap-4 p-6 md:p-10 justify-center items-center">
          

          {/* Form */}
          <div className="flex flex-1 items-center justify-center w-full">
            <div className="w-full max-w-xs">
              <SignupForm />
            </div>
          </div>
        </div>
      </div>
    );
  }
