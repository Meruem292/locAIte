import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, ChevronRight } from 'lucide-react';

export function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');

  return (
    <section className="relative w-full overflow-hidden bg-card">
      <div className="container mx-auto grid items-center gap-8 px-4 py-20 md:grid-cols-2 md:px-6 lg:py-28">
        <div className="z-10 flex flex-col items-start space-y-6">
          <h1 className="text-4xl font-bold tracking-tighter text-primary sm:text-5xl md:text-6xl lg:text-7xl font-headline">
            Never Lose Anything Again.
          </h1>
          <p className="max-w-xl text-lg text-foreground/80 md:text-xl">
            LocAIte combines precise GPS tracking with predictive AI to not only show you where your things are, but where they're likely to be.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" asChild className="group bg-accent text-accent-foreground shadow-lg transition-all duration-300 hover:bg-accent/90 hover:shadow-xl hover:-translate-y-1">
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
        <div className="relative flex h-full min-h-[300px] items-center justify-center md:min-h-0">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              width={800}
              height={533}
              className="rounded-xl object-contain shadow-2xl"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
           <div className="absolute -bottom-8 -right-8 h-40 w-40 animate-pulse rounded-full bg-accent/20 blur-3xl -z-10"></div>
           <div className="absolute -top-8 -left-8 h-40 w-40 animate-pulse rounded-full bg-primary/10 blur-3xl -z-10 animation-delay-300"></div>
        </div>
      </div>
    </section>
  );
}
