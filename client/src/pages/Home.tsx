import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Sparkles, Gamepad2, ShoppingBag } from "lucide-react";
import { NeonCard } from "@/components/NeonCard";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="min-h-screen pt-20">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0">
           {/* hero scenic city night neon */}
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
           <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-display text-white mb-6 tracking-tighter flex flex-wrap justify-center items-baseline gap-x-4">
              <span>BALLY UP GANG</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-accent animate-pulse">BuG</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-mono mb-10">
              Elite gamers, masterful streamers, strategic helper.
              <br />
              <span className="text-primary uppercase">We handle a wide range of services.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/merch">
                <button className="px-8 py-4 bg-primary text-black font-display text-lg uppercase tracking-wider hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all flex items-center justify-center gap-2 group">
                  <ShoppingBag className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Shop Merch
                </button>
              </Link>
              <a href="https://discord.gg/yq8kFPcHc" target="_blank" rel="noopener noreferrer">
                <button className="px-8 py-4 bg-transparent border-2 border-secondary text-secondary font-display text-lg uppercase tracking-wider hover:bg-secondary hover:text-black hover:shadow-[0_0_30px_rgba(0,255,128,0.5)] transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
                  <Gamepad2 className="w-5 h-5" />
                  Join Discord
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <NeonCard variant="primary" className="h-full">
                <Sparkles className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl text-white mb-2">Exclusive Events</h3>
                <p className="text-muted-foreground mb-6">
                  Join our weekly giveaways, gaming tournaments, and community hangouts.
                </p>
                <Link href="/events">
                  <div className="inline-flex items-center text-primary hover:text-white font-display text-sm uppercase cursor-pointer">
                    View Calendar <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </Link>
              </NeonCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <NeonCard variant="secondary" className="h-full">
                <Gamepad2 className="w-12 h-12 text-secondary mb-4" />
                <h3 className="text-2xl text-white mb-2">Community First</h3>
                <p className="text-muted-foreground mb-6">
                  A safe space for streamers to grow, gamers to connect, and friends to chill.
                </p>
                <a href="https://discord.gg/yq8kFPcHc" target="_blank" className="inline-flex items-center text-secondary hover:text-white font-display text-sm uppercase cursor-pointer">
                  Join The Gang <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </NeonCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <NeonCard variant="accent" className="h-full">
                <ShoppingBag className="w-12 h-12 text-accent mb-4" />
                <h3 className="text-2xl text-white mb-2">Fresh Drip</h3>
                <p className="text-muted-foreground mb-6">
                  Rep the BuG with our exclusive merchandise collection. Limited drops available.
                </p>
                <Link href="/merch">
                  <div className="inline-flex items-center text-accent hover:text-white font-display text-sm uppercase cursor-pointer">
                    Browse Store <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </Link>
              </NeonCard>
            </motion.div>

            <Link href="/team">
              <button className="px-8 py-4 bg-primary text-black font-display text-xl uppercase tracking-tighter hover:bg-white hover:text-primary transition-all duration-300 border-2 border-black shadow-[0_0_20px_rgba(var(--primary),0.5)]">
                Meet the Team
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* BANNER IMAGE */}
      <div className="w-full h-64 md:h-96 relative overflow-hidden my-12">
        {/* abstract neon city streets */}
        <div className="absolute inset-0 bg-[url('https://pixabay.com/get/gdc08d5e097fb10727d2da795332cb7f08972d5e6a10b6694e951910df721b7ffb54f644014bd0b3286b3e87e326c09e09b019fd10b976d66eed66e49b0a3d819_1280.jpg')] bg-cover bg-center bg-fixed opacity-40 hover:scale-105 transition-transform duration-1000" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-4xl md:text-6xl font-display text-white text-center px-4 mix-blend-overlay">
            WELCOME TO THE UNDERGROUND
          </h2>
        </div>
      </div>

      {/* CLICKER MINI-GAME */}
      <section className="py-24 relative z-10 bg-black/40">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display text-primary mb-12 tracking-widest">
              BuG CLICKER CHALLENGE
            </h2>
            
            <ClickerGame />
          </motion.div>
        </div>
      </section>

    </div>
  );
}

function ClickerGame() {
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
    <div className="bg-black/60 border-2 border-primary/20 p-8 md:p-12 rounded-lg shadow-[0_0_50px_rgba(255,215,0,0.1)] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-[80px]" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-secondary/10 rounded-full blur-[80px]" />

      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="text-center">
          <div className="text-6xl font-display text-white mb-2 tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
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
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/40 transition-colors" />
          <div className="relative w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center border-4 border-white/20 shadow-2xl overflow-hidden group-active:translate-y-1 transition-transform">
            <Gamepad2 className="w-16 h-16 md:w-24 md:h-24 text-black drop-shadow-lg" />
            <div className="absolute inset-0 scanlines opacity-30" />
          </div>
        </motion.button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
          <div className="bg-white/5 border border-white/10 p-4 rounded flex flex-col items-center justify-center">
            <span className="text-muted-foreground text-xs uppercase font-mono mb-1">Click Power</span>
            <span className="text-white font-display text-xl">x{multiplier}</span>
          </div>
          
          <button
            onClick={buyUpgrade}
            disabled={points < upgradeCost}
            className={cn(
              "p-4 rounded border font-display uppercase text-sm transition-all flex flex-col items-center justify-center gap-1",
              points >= upgradeCost 
                ? "bg-secondary/20 border-secondary text-secondary hover:bg-secondary hover:text-black shadow-[0_0_15px_rgba(0,255,128,0.2)]" 
                : "bg-white/5 border-white/10 text-muted-foreground cursor-not-allowed opacity-50"
            )}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Upgrade
            </div>
            <span className="font-mono text-[10px] tracking-widest">
              Cost: {upgradeCost}
            </span>
          </button>
        </div>

        <p className="text-muted-foreground text-[10px] font-mono uppercase tracking-widest animate-pulse mt-4">
          Click the icon to earn points • Auto-earning: 1/sec
        </p>
      </div>
    </div>
  );
}
