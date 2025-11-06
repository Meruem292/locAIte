import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MobileNav } from './MobileNav';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" style={{ backgroundColor: '#134686' }}>
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Logo />
        
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="#features" className="text-primary-foreground/60 transition-colors hover:text-primary-foreground/80">
            Features
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" asChild className="text-primary-foreground hover:bg-primary-foreground/10">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
        
        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
