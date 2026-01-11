import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Sparkles, Gamepad2, ShoppingBag } from "lucide-react";
import { NeonCard } from "@/components/NeonCard";

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
              <a href="https://discord.gg" target="_blank" rel="noopener noreferrer">
                <button className="px-8 py-4 bg-transparent border-2 border-secondary text-secondary font-display text-lg uppercase tracking-wider hover:bg-secondary hover:text-black hover:shadow-[0_0_30px_rgba(0,255,128,0.5)] transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
                  <Gamepad2 className="w-5 h-5" />
                  Join Discord
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-24 relative z-10 bg-black/40 border-y border-primary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="text-center">
              <h2 className="text-3xl md:text-5xl font-display text-primary mb-4 tracking-widest">
                THE MOVEMENT
              </h2>
              <div className="h-1 w-24 bg-primary mx-auto" />
            </div>

            <div className="prose prose-invert prose-lg max-w-none font-body leading-relaxed space-y-8 text-muted-foreground">
              <p className="first-letter:text-5xl first-letter:font-display first-letter:text-primary first-letter:mr-3 first-letter:float-left">
                The Bally Gang isn't just a name—it's a movement. Born from frustration with a world that loves to tear people down for no reason, it started with a simple idea: what if everyone was equal? Not in some cheesy poster way, but actually. No judgments, no hierarchy, no one flexing their cash or their clout to feel bigger.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-8">
                <div className="bg-primary/5 p-8 border border-primary/20 rounded-lg">
                  <h3 className="font-display text-white text-xl mb-4">Why the Bally?</h3>
                  <p>
                    Short for balaclava. Yeah, the ski mask. Sounds weird, right? But here's why it clicks—put one on, and suddenly nobody knows if you're rich, broke, tall, short, whatever. You're just... you. And that's enough.
                  </p>
                </div>
                <p>
                  We kicked off because Barry—he's the guy behind it—got fed up watching decent folks get shredded online. One day you're laughing at a video, next day some stranger's calling you trash 'cause your life's not Instagram-perfect. Bull. Everyone's equal, end of story.
                </p>
              </div>

              <p>
                The Bally Gang flips that script. Online, the mask is optional—wear it if you're scared of the trolls, the ones who think perfection's required. It's like armor for the introverts, the ones who wanna chat but hate getting roasted. No one's forced, though. Rule one: you don't have to hide.
              </p>

              <blockquote className="border-l-4 border-primary pl-6 py-4 bg-primary/5 italic text-white text-xl font-display">
                "Bally Gang isn't curing the world, but it's a pocket of it that's real. No one's better. Everyone's in. That's us."
              </blockquote>

              <div className="pt-12 border-t border-primary/10">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-1">
                    <h3 className="font-display text-primary text-2xl mb-4">Meet Barry</h3>
                    <p>
                      Barry's the country lad who drove the length of Australia, saw mines and mansions, heard every story under the sun. And through it all, he's learned one thing: everything's a lesson. You trip? Dust off, laugh, move on.
                    </p>
                  </div>
                  <div className="flex-1">
                    <p>
                      "I'm the guy who'll prank you just to see you grin—if you don't like it, I'll quit, no drama. Because here's the secret: we're all just kids balancing on that line between dirt and sky. And when the sun comes up, we're still here. Still equal. Still Bally."
                    </p>
                  </div>
                </div>
              </div>
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
                <a href="https://discord.gg" target="_blank" className="inline-flex items-center text-secondary hover:text-white font-display text-sm uppercase cursor-pointer">
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

    </div>
  );
}
