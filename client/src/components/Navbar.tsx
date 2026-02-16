import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Menu, X, Info } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Merch", href: "/merch" },
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Rules", href: "/rules" },
  { label: "Meet the Team", href: "/team" },
];

function AboutDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="font-display text-sm uppercase tracking-wider cursor-pointer transition-colors duration-200 hover:text-primary text-muted-foreground flex items-center gap-2">
          <Info className="w-4 h-4" />
          About
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-black/95 border-primary/20 text-white p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b border-primary/10">
          <DialogTitle className="font-display text-2xl text-primary tracking-widest text-center">
            THE MOVEMENT
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh] px-8 py-6">
          <div className="prose prose-invert prose-gold font-body leading-relaxed space-y-6 text-muted-foreground pb-8">
            <p className="first-letter:text-4xl first-letter:font-display first-letter:text-primary first-letter:mr-3 first-letter:float-left">
              The Bally Gang isn't just a name—it's a movement. Born from frustration with a world that loves to tear people down for no reason, it started with a simple idea: what if everyone was equal? Not in some cheesy poster way, but actually. No judgments, no hierarchy, no one flexing their cash or their clout to feel bigger.
            </p>
            
            <div className="bg-primary/5 p-6 border border-primary/20 rounded-lg">
              <h3 className="font-display text-white text-lg mb-2">Why the Bally?</h3>
              <p className="text-sm">
                Short for balaclava. Yeah, the ski mask. Sounds weird, right? But here's why it clicks—put one on, and suddenly nobody knows if you're rich, broke, tall, short, whatever. You're just... you. And that's enough.
              </p>
            </div>

            <p>
              We kicked off because Barry—he's the guy behind it—got fed up watching decent folks get shredded online. One day you're laughing at a video, next day some stranger's calling you trash 'cause your life's not Instagram-perfect. Bull. Everyone's equal, end of story.
            </p>

            <p>
              The Bally Gang flips that script. Online, the mask is optional—wear it if you're scared of the trolls, the ones who think perfection's required. It's like armor for the introverts, the ones who wanna chat but hate getting roasted. No one's forced, though. Rule one: you don't have to hide.
            </p>

            <blockquote className="border-l-4 border-primary pl-6 py-4 bg-primary/5 italic text-white font-display">
              "Bally Gang isn't curing the world, but it's a pocket of it that's real. No one's better. Everyone's in. That's us."
            </blockquote>

            <div className="pt-6 border-t border-primary/10">
              <h3 className="font-display text-primary text-xl mb-3">Meet Barry</h3>
              <p className="text-sm mb-4">
                Barry's the country lad who drove the length of Australia, saw mines and mansions, heard every story under the sun. And through it all, he's learned one thing: everything's a lesson. You trip? Dust off, laugh, move on.
              </p>
              <p className="text-sm italic">
                "I'm the guy who'll prank you just to see you grin—if you don't like it, I'll quit, no drama. Because here's the secret: we're all just kids balancing on that line between dirt and sky. And when the sun comes up, we're still here. Still equal. Still Bally."
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 cursor-pointer group">
            <span className="font-display text-2xl md:text-3xl text-primary tracking-widest group-hover:text-shadow-neon transition-all duration-300">
              BALLY UP <span className="text-secondary">GANG</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <ThemeToggle />
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
              <div className="flex items-center gap-4 ml-4">
                <AboutDialog />
                <button 
                  onClick={() => logout()}
                  className="px-4 py-2 bg-destructive/20 text-destructive border border-destructive hover:bg-destructive hover:text-white transition-all font-display text-xs uppercase"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 ml-4">
                <AboutDialog />
                <Link href="/api/login">
                  <div className="px-4 py-2 bg-secondary/10 text-secondary border border-secondary hover:bg-secondary hover:text-black transition-all font-display text-xs uppercase cursor-pointer">
                    Login
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
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
            <div className="px-3 py-4 border-l-2 border-transparent">
              <AboutDialog />
            </div>
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
