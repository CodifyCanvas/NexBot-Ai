// LoginPage.tsx

import { LoginForm } from "@/components/login-form";
import { Metadata } from "next";
import Image from "next/image";
import { Images, Names } from "@/constants/constants";
import Link from "next/link";

export const metadata: Metadata = {
  title: "NexBot - Login",
  description: "AI-Powered Chatbot",
};

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2 overflow-hidden radial-center-gradient-bg-dark">
      {/* Left side with form */}
      <div className="flex flex-col gap-4 p-6 md:p-10 overflow-hidden">
        {/* Header/logo */}
        <div className="flex justify-center gap-2 md:justify-start z-10">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-none text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Image src={Images.main_logo_transparent} alt="main Logo" width={20} height={20} />
            </div>
            {Names.app_name}
          </Link>
        </div>

        {/* Login form */}
        <div className="flex flex-1 items-center justify-center z-10">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Right side with image */}
      <div className="hidden lg:block overflow-hidden">
        <div className="relative h-full w-full">
          <Image
            src={Images.ai_svg_login}
            alt="SVG"
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
