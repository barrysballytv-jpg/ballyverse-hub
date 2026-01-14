import { Github, Instagram, Twitter, Youtube, Twitch, Music } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 mt-20 pb-10 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          
          {/* Brand */}
          <div className="space-y-4">
            <h2 className="font-display text-2xl text-primary tracking-widest">
              BALLY UP <span className="text-secondary">GANG</span>
            </h2>
            <p className="text-muted-foreground max-w-xs mx-auto md:mx-0">
              The ultimate community for gamers, streamers, and helpers. 
              Join the chaos, share the love.
            </p>
          </div>

          {/* Socials */}
          <div className="space-y-4">
            <h3 className="font-display text-white text-lg">Connect</h3>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <a href="#" className="p-2 bg-white/5 hover:bg-primary hover:text-black transition-all rounded-sm group">
                <Twitch className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/@BALLYUPGANGBuG" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-primary hover:text-black transition-all rounded-sm group">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/bally_upgang?igsh=Z2dobTk3aHVzcXox" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-primary hover:text-black transition-all rounded-sm group">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.tiktok.com/@bally_up_gang?_r=1&_t=ZS-933Tse0s1Nl" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-primary hover:text-black transition-all rounded-sm group">
                <Music className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-display text-white text-lg">Legal</h3>
            <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
              <a href="/rules" className="hover:text-primary transition-colors">Community Rules</a>
              <a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 text-center text-xs text-muted-foreground font-mono">
          © {new Date().getFullYear()} BALLY UP GANG. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}
