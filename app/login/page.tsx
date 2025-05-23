import { LoginForm } from "@/components/login-form";
import { Metadata } from "next";
import Image from "next/image";
import LoginVideo from "@/components/custom/LoginVideo";

export const metadata: Metadata = {
  title: "NexBot | Login",
  description: "AI-Powered Chatbot",
};

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 ">
      {/* Left side with form */}
      <div className="relative flex flex-col gap-4 p-6 md:p-10 overflow-hidden">
        {/* Background image behind form */}
        <Image
          src="/assets/images/background-gradient.png"
          alt="background"
          className="absolute inset-0 z-0 h-full w-full object-cover opacity-30"
          width={100}
          height={100}
        />

        {/* Header/logo */}
        <div className="flex justify-center gap-2 md:justify-start z-10">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-none text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Image src="/assets/images/main_logo_transparent.png" alt="main Logo" width={20} height={20} />
            </div>
            NexBot
          </a>
        </div>

        {/* Login form */}
        <div className="flex flex-1 items-center justify-center z-10">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Right side with image */}
      <div className="relative hidden lg:block bg-background">
        {/* <video autoPlay loop muted className="absolute inset-0 h-full w-full object-cover">
          <source src="/assets/videos/login.mp4" type="video/mp4" />
        </video> */}
        <LoginVideo />
      </div>
    </div>
  );
}
