import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Gamepad2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ClickerGamePage() {
  const [points, setPoints] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const upgradeCost = multiplier * 100;

  useEffect(() => {
    const timer = setInterval(() => {
      setPoints((p) => p + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClick = () => {
    setPoints((p) => p + multiplier);
  };

  const buyUpgrade = () => {
    if (points >= upgradeCost) {
      setPoints((p) => p - upgradeCost);
      setMultiplier((m) => m * 2);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 bg-black relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(255,215,0,0.05)_0%,_transparent_70%)] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h1 className="text-4xl md:text-6xl font-display text-primary mb-4 tracking-[0.2em]">
            BuG CLICKER
          </h1>
          <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest mb-12">
            Click to earn, upgrade to dominate
          </p>

          <div className="bg-black/60 border-2 border-primary/20 p-8 md:p-12 rounded-lg shadow-[0_0_50px_rgba(255,215,0,0.1)] relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-[80px]" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-secondary/10 rounded-full blur-[80px]" />

            <div className="relative z-10 flex flex-col items-center gap-8">
              <div className="text-center">
                <div className="text-7xl md:text-8xl font-display text-white mb-2 tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                  {points.toLocaleString()}
                </div>
                <div className="text-primary font-mono uppercase tracking-[0.3em] text-sm">
                  BuG Points
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClick}
                className="relative group cursor-pointer"
              >
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/40 transition-colors" />
                <div className="relative w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center border-4 border-white/20 shadow-2xl overflow-hidden group-active:translate-y-1 transition-transform">
                  <Gamepad2 className="w-24 h-24 md:w-32 md:h-32 text-black drop-shadow-lg" />
                  <div className="absolute inset-0 scanlines opacity-30" />
                </div>
              </motion.button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
                <div className="bg-white/5 border border-white/10 p-6 rounded flex flex-col items-center justify-center">
                  <span className="text-muted-foreground text-xs uppercase font-mono mb-2">Click Power</span>
                  <span className="text-white font-display text-2xl">x{multiplier}</span>
                </div>
                
                <button
                  onClick={buyUpgrade}
                  disabled={points < upgradeCost}
                  className={cn(
                    "p-6 rounded border font-display uppercase text-sm transition-all flex flex-col items-center justify-center gap-2",
                    points >= upgradeCost 
                      ? "bg-secondary/20 border-secondary text-secondary hover:bg-secondary hover:text-black shadow-[0_0_20px_rgba(0,255,128,0.3)]" 
                      : "bg-white/5 border-white/10 text-muted-foreground cursor-not-allowed opacity-50"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Upgrade
                  </div>
                  <span className="font-mono text-xs tracking-widest">
                    Cost: {upgradeCost}
                  </span>
                </button>
              </div>

              <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest animate-pulse mt-6">
                Click the icon to earn points • Auto-earning: 1/sec
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
