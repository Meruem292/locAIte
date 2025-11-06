import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <Logo />
        <p className="text-sm text-foreground/60">
          © {new Date().getFullYear()} LocAIte. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
