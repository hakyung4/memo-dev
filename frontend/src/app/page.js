import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function LandingPage() {
  return (
    <main className="bg-gradient-to-b from-white to-gray-100 dark:from-black dark:to-gray-900 text-gray-900 dark:text-gray-100">
      <Hero />
      <HowItWorks />
      <Features />
      <CTA />
    </main>
  );
}