"use client";

import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings, Sun, Moon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/tags", label: "Tags" },
  { href: "/dashboard/devices", label: "Devices" },
  { href: "/dashboard/location", label: "Location" },
  { href: "/dashboard/settings", label: "Settings" },
];

export function DashboardHeader() {
  const { auth, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  // A simple theme toggle state. In a real app, you'd use a theme provider.
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
         <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden md:flex items-center gap-4">
            {navItems.map((item) => (
                <Link key={item.href} href={item.href} legacyBehavior>
                    <a className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        pathname === item.href ? "text-primary font-semibold" : "text-muted-foreground"
                    )}>
                        {item.label}
                    </a>
                </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.photoURL ?? undefined} alt="User Avatar" />
                    <AvatarFallback>{user?.displayName?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.displayName ?? "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email ?? "user@example.com"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
