import Link from 'next/link';
import { Button } from '@/components/ui/button';
import placeholderImages from '@/lib/placeholder-images.json';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  const heroImage = placeholderImages.placeholderImages.find(p => p.id === 'hero');

  return (
    <section
      className="relative w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImage?.imageUrl})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      <div className="relative z-10 px-4 h-full flex flex-col items-center justify-center text-center">
        <div className="flex flex-col items-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl font-headline animate-fade-in-down">
            Never Lose Anything Again.
          </h1>
          <p className="max-w-3xl text-lg text-foreground/80 md:text-xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            LocAIte combines precise GPS tracking with predictive AI to not only show you where your things are, but where they're likely to be.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Button size="lg" asChild className="group bg-primary text-primary-foreground shadow-lg transition-transform duration-300 hover:scale-105">
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
