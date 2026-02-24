import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Menu, X, Info, ChevronDown, Gamepad2, LayoutDashboard, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
        <div className="font-display text-sm uppercase tracking-wider cursor-pointer transition-colors duration-200 hover:text-primary text-muted-foreground flex items-center gap-2 w-full md:w-auto">
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
            
            {/* Games Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="font-display text-sm uppercase tracking-wider cursor-pointer transition-colors duration-200 hover:text-primary text-muted-foreground flex items-center gap-1 group">
                  Games
                  <ChevronDown className="w-4 h-4 group-data-[state=open]:rotate-180 transition-transform" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/95 border-primary/20 text-white min-w-[200px]">
                <DropdownMenuLabel className="font-display text-xs uppercase tracking-widest text-primary/60 px-4 py-2">
                  Arcade
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-primary/10" />
                <DropdownMenuItem asChild>
                  <Link href="/games/clicker" className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-primary/10 transition-colors focus:bg-primary/10 focus:text-white">
                    <Gamepad2 className="w-4 h-4 text-primary" />
                    <span className="font-display text-sm uppercase tracking-wider">Clicker Challenge</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/games/pinball" className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-secondary/10 transition-colors focus:bg-secondary/10 focus:text-white">
                    <Gamepad2 className="w-4 h-4 text-secondary" />
                    <span className="font-display text-sm uppercase tracking-wider">Bally Bumper</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
            
            <AboutDialog />
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer group ml-4" data-testid="button-user-menu">
                    {user?.profileImageUrl ? (
                      <img src={user.profileImageUrl} alt="Avatar" className="w-8 h-8 rounded-full border border-primary" />
                    ) : (
                      <div className="w-8 h-8 rounded-full border border-primary bg-primary/20 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    <span className="font-display text-sm text-white uppercase tracking-wider" data-testid="text-navbar-username">
                      {user?.firstName || "Member"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-black/95 border-primary/20 text-white min-w-[180px]">
                  <DropdownMenuLabel className="font-display text-xs uppercase tracking-widest text-primary/60 px-4 py-2">
                    {user?.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-primary/10" />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-primary/10 transition-colors focus:bg-primary/10 focus:text-white" data-testid="link-dashboard">
                      <LayoutDashboard className="w-4 h-4 text-primary" />
                      <span className="font-display text-sm uppercase tracking-wider">Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-primary/10" />
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-destructive/10 transition-colors text-destructive focus:bg-destructive/10 focus:text-destructive"
                    data-testid="button-logout-nav"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-display text-sm uppercase tracking-wider">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <a href="/api/login" className="ml-4" data-testid="link-login">
                  <div className="px-4 py-2 bg-primary/10 text-primary border border-primary hover:bg-primary hover:text-black transition-all font-display text-xs uppercase cursor-pointer">
                    Sign In
                  </div>
                </a>
                <a href="/api/login" className="ml-2" data-testid="link-signup">
                  <div className="px-4 py-2 bg-primary text-black border border-primary hover:bg-primary/80 transition-all font-display text-xs uppercase cursor-pointer">
                    Sign Up
                  </div>
                </a>
              </>
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
        <div className="md:hidden bg-black/95 border-b border-primary/20 backdrop-blur-xl max-h-[90vh] overflow-y-auto">
          <div className="px-4 pt-2 pb-6 space-y-4">
            
            {/* Mobile Games Section */}
            <div className="space-y-2 px-3 py-4">
              <div className="font-display text-xs uppercase tracking-[0.2em] text-primary/60 mb-4 border-b border-primary/10 pb-2">
                Arcade Games
              </div>
              <Link 
                href="/games/clicker" 
                className="flex items-center gap-4 py-3 text-muted-foreground hover:text-primary transition-all group"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Gamepad2 className="w-5 h-5 text-primary" />
                </div>
                <span className="font-display text-base uppercase tracking-widest">Clicker Challenge</span>
              </Link>
              <Link 
                href="/games/pinball" 
                className="flex items-center gap-4 py-3 text-muted-foreground hover:text-secondary transition-all group"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-10 h-10 rounded bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <Gamepad2 className="w-5 h-5 text-secondary" />
                </div>
                <span className="font-display text-base uppercase tracking-widest">Bally Bumper</span>
              </Link>
            </div>

            <div className="border-t border-white/5 pt-4" />

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
              <>
                <Link href="/dashboard">
                  <div
                    className="block px-3 py-4 font-display text-lg uppercase tracking-widest border-l-2 border-primary text-primary hover:bg-primary/10 transition-all cursor-pointer"
                    onClick={() => setIsOpen(false)}
                    data-testid="link-dashboard-mobile"
                  >
                    Dashboard
                  </div>
                </Link>
                <button 
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="w-full text-left block px-3 py-4 font-display text-lg uppercase tracking-widest border-l-2 border-destructive text-destructive hover:bg-destructive/10 transition-all"
                  data-testid="button-logout-mobile"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/api/login">
                  <div 
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-4 font-display text-lg uppercase tracking-widest border-l-2 border-primary text-primary hover:bg-primary/10 transition-all cursor-pointer"
                    data-testid="link-login-mobile"
                  >
                    Sign In
                  </div>
                </a>
                <a href="/api/login">
                  <div 
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-4 font-display text-lg uppercase tracking-widest border-l-2 border-primary bg-primary/10 text-primary hover:bg-primary/20 transition-all cursor-pointer"
                    data-testid="link-signup-mobile"
                  >
                    Sign Up
                  </div>
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
