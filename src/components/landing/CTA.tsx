import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export function CTA() {
  return (
    <section className="w-full py-20 md:py-32">
      <div className="container mx-auto px-4 text-center md:px-6">
        <Sparkles className="mx-auto mb-4 h-12 w-12 text-accent" />
        <h2 className="text-3xl font-bold text-primary md:text-4xl font-headline">
          Ready to experience peace of mind?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-foreground/70">
          Join thousands of users who trust LocAIte to keep track of their valuables. Get started today for free.
        </p>
        <div className="mt-8">
          <Button size="lg" asChild className="group bg-accent text-accent-foreground shadow-lg transition-all duration-300 hover:bg-accent/90 hover:shadow-xl hover:-translate-y-1">
            <Link href="/signup">
              Create Your Account Now
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
