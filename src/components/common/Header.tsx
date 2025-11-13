'use client';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MobileNav } from './MobileNav';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-colors duration-300",
      scrolled ? "border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" : "bg-transparent"
    )}>
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" asChild className={cn("hover:bg-accent hover:text-accent-foreground", scrolled ? "text-foreground" : "text-primary-foreground")}>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
        
        <div className="md:hidden">
          <MobileNav scrolled={scrolled} />
        </div>
      </div>
    </header>
  );
}
