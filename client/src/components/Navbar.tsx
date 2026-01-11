import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Merch", href: "/merch" },
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Rules", href: "/rules" },
];

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 cursor-pointer group flex flex-col leading-none">
            <span className="font-display text-2xl md:text-3xl text-primary tracking-widest group-hover:text-shadow-neon transition-all duration-300">
              BALLY UP <span className="text-secondary">GANG</span>
            </span>
            <span className="font-display text-xs md:text-sm text-muted-foreground tracking-[0.3em] uppercase opacity-70 group-hover:text-primary transition-colors">
              Bug
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div 
                  className={cn(
                    "font-display text-sm uppercase tracking-wider cursor-pointer transition-colors duration-200 hover:text-primary",
                    location === item.href ? "text-primary text-shadow-neon" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </div>
              </Link>
            ))}
            
            {isAuthenticated ? (
              <button 
                onClick={() => logout()}
                className="ml-4 px-4 py-2 bg-destructive/20 text-destructive border border-destructive hover:bg-destructive hover:text-white transition-all font-display text-xs uppercase"
              >
                Logout
              </button>
            ) : (
              <Link href="/api/login">
                <div className="ml-4 px-4 py-2 bg-secondary/10 text-secondary border border-secondary hover:bg-secondary hover:text-black transition-all font-display text-xs uppercase cursor-pointer">
                  Login
                </div>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-primary transition-colors"
            >
              {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/95 border-b border-primary/20 backdrop-blur-xl">
          <div className="px-4 pt-2 pb-6 space-y-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div 
                  className={cn(
                    "block px-3 py-4 font-display text-lg uppercase tracking-widest border-l-2 transition-all cursor-pointer",
                    location === item.href 
                      ? "border-primary text-primary bg-primary/10 pl-6" 
                      : "border-transparent text-muted-foreground hover:text-white hover:pl-6"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </div>
              </Link>
            ))}
            {isAuthenticated ? (
              <button 
                onClick={() => { logout(); setIsOpen(false); }}
                className="w-full text-left block px-3 py-4 font-display text-lg uppercase tracking-widest border-l-2 border-destructive text-destructive hover:bg-destructive/10 transition-all"
              >
                Logout
              </button>
            ) : (
              <Link href="/api/login">
                <div 
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 font-display text-lg uppercase tracking-widest border-l-2 border-secondary text-secondary hover:bg-secondary/10 transition-all cursor-pointer"
                >
                  Login
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
