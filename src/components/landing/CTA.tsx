import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export function CTA() {
  return (
    <section className="w-full py-20 md:py-32 bg-primary/5">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <Sparkles className="mx-auto h-12 w-12 text-accent mb-4" />
        <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">
          Ready to experience peace of mind?
        </h2>
        <p className="max-w-xl mx-auto mt-4 text-lg text-foreground/70">
          Join thousands of users who trust LocAIte to keep track of their valuables. Get started today for free.
        </p>
        <div className="mt-8">
          <Button size="lg" asChild className="group bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transform hover:-translate-y-1 transition-all duration-300">
            <Link href="/signup">
              Create Your Account Now
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
