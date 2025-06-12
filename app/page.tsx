import AboutSection from "@/components/custom/Landing_Page/AboutSection";
import ContactSection from "@/components/custom/Landing_Page/ContactSection";
import FeaturesSection from "@/components/custom/Landing_Page/FeaturesSection";
import Footer from "@/components/custom/Landing_Page/Footer";
import HeroSection from "@/components/custom/Landing_Page/HeroSection";
import Navbar from "@/components/custom/Landing_Page/Navbar";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col bg-neutral-950 items-center min-h-screen">

      {/* Navigation bar */}
      <Navbar />

      {/* Hero / Intro Section */}
      <HeroSection />

      {/* Key Features Section */}
      <FeaturesSection />

      {/* About NexBot Section */}
      <AboutSection />

      {/* Contact / Get in Touch Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
