'use client';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Logo } from './Logo';
import { cn } from '@/lib/utils';

type MobileNavProps = {
  scrolled: boolean;
};

export function MobileNav({ scrolled }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} className={cn(scrolled ? "text-foreground" : "text-primary-foreground")}>
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open Menu</span>
      </Button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background p-6">
          <div className="flex items-center justify-between">
            <Logo />
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-foreground">
              <X className="h-6 w-6" />
              <span className="sr-only">Close Menu</span>
            </Button>
          </div>
          <nav className="mt-12 flex flex-col items-center gap-8 text-lg">
            <div className="flex flex-col items-center gap-4 w-full mt-8">
              <Button variant="ghost" asChild className="w-full text-foreground hover:bg-accent">
                <Link href="/login" onClick={() => setIsOpen(false)}>Login</Link>
              </Button>
              <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/signup" onClick={() => setIsOpen(false)}>Sign Up</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
