import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto px-4 py-20 text-center md:py-32">
        <div className="z-10 flex flex-col items-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tighter text-primary sm:text-5xl md:text-6xl font-headline">
            Never Lose Anything Again.
          </h1>
          <p className="max-w-2xl text-lg text-foreground/80 md:text-xl">
            LocAIte combines precise GPS tracking with predictive AI to not only show you where your things are, but where they're likely to be.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" asChild className="group bg-accent text-accent-foreground shadow-lg transition-all duration-300 hover:bg-accent/90 hover:shadow-xl hover:-translate-y-1">
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="relative mt-12 flex h-full max-h-[300px] items-center justify-center md:max-h-[400px]">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              width={500}
              height={300}
              className="rounded-xl object-contain shadow-2xl"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
        </div>
      </div>
    </section>
  );
}
