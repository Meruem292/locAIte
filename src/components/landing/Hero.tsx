import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');

  return (
    <section
      className="relative w-full h-screen bg-cover bg-fixed bg-center"
      style={{ backgroundImage: `url(${heroImage?.imageUrl})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      <div className="relative z-10 px-4 h-full flex flex-col items-center justify-center text-center">
        <div className="flex flex-col items-center space-y-6">
          <h1 className="text-5xl font-bold tracking-tighter text-foreground sm:text-6xl md:text-7xl lg:text-8xl font-headline animate-fade-in-down">
            Never Lose Anything Again.
          </h1>
          <p className="max-w-3xl text-lg text-foreground/90 md:text-xl animate-fade-in-up animation-delay-300">
            LocAIte combines precise GPS tracking with predictive AI to not only show you where your things are, but where they're likely to be.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row animate-fade-in-up animation-delay-600">
            <Button size="lg" asChild className="group bg-accent text-accent-foreground shadow-lg transition-all duration-300 hover:bg-accent/90 hover:shadow-xl hover:-translate-y-1">
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
