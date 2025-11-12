import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Hero } from "@/components/landing/Hero";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen animate-in slide-in-from-left-full duration-700 bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
