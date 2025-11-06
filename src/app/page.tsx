import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { CTA } from "@/components/landing/CTA";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen animate-in slide-in-from-top-12 duration-1000">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
