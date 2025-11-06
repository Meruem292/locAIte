import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, ChevronRight } from 'lucide-react';

export function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');

  return (
    <section className="relative w-full py-20 md:py-32 bg-card overflow-hidden">
      <div className="absolute inset-0 bg-primary/10 -z-10"></div>
      <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-start space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold font-headline text-primary tracking-tighter">
            Never Lose Anything Again.
          </h1>
          <p className="max-w-xl text-lg text-foreground/80">
            LocAIte combines precise GPS tracking with predictive AI to not only show you where your things are, but where they're likely to be.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild className="group bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="ghost" asChild className="group">
              <Link href="#features">
                Learn More
                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="relative">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              width={1200}
              height={800}
              className="rounded-xl shadow-2xl"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
           <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-accent/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
           <div className="absolute -top-4 -left-4 w-40 h-40 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse animation-delay-300"></div>
        </div>
      </div>
    </section>
  );
}
