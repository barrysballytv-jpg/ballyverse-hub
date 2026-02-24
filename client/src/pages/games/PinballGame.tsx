import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Trophy } from "lucide-react";
import Matter from "matter-js";

export default function PinballGamePage() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!sceneRef.current) return;

    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Events = Matter.Events,
      Body = Matter.Body;

    const engine = Engine.create();
    engineRef.current = engine;
    const world = engine.world;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: 400,
        height: 600,
        wireframes: false,
        background: 'transparent'
      }
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    const wallOptions = { isStatic: true, render: { fillStyle: '#DAA520' } };
    const leftWall = Bodies.rectangle(10, 300, 20, 600, wallOptions);
    const rightWall = Bodies.rectangle(390, 300, 20, 600, wallOptions);
    const topWall = Bodies.rectangle(200, 10, 400, 20, wallOptions);
    const bottomWall = Bodies.rectangle(200, 610, 400, 20, { ...wallOptions, isSensor: true });

    const bumperOptions = { 
      isStatic: true, 
      restitution: 1.5,
      render: { fillStyle: '#FFD700', strokeStyle: '#DAA520', lineWidth: 4 }
    };
    const bumper1 = Bodies.circle(100, 150, 25, bumperOptions);
    const bumper2 = Bodies.circle(300, 150, 25, bumperOptions);
    const bumper3 = Bodies.circle(200, 250, 30, bumperOptions);
    
    const slingLeft = Bodies.polygon(80, 450, 3, 30, { 
      isStatic: true, restitution: 1.8, angle: Math.PI / 2,
      render: { fillStyle: '#DAA520' }
    });
    const slingRight = Bodies.polygon(320, 450, 3, 30, { 
      isStatic: true, restitution: 1.8, angle: -Math.PI / 2,
      render: { fillStyle: '#DAA520' }
    });

    const flipperOptions = { isStatic: true, render: { fillStyle: '#FFD700' } };
    const leftFlipper = Bodies.rectangle(130, 550, 80, 15, { 
      ...flipperOptions, 
      chamfer: { radius: 7 },
      angle: 0.3
    });
    const rightFlipper = Bodies.rectangle(270, 550, 80, 15, { 
      ...flipperOptions, 
      chamfer: { radius: 7 },
      angle: -0.3
    });

    const createBall = () => {
      return Bodies.circle(365, 500, 10, {
        restitution: 0.5,
        friction: 0.005,
        render: { fillStyle: '#FFFFFF', strokeStyle: '#FFD700', lineWidth: 2 }
      });
    };
    let ball = createBall();

    Composite.add(world, [leftWall, rightWall, topWall, bottomWall, bumper1, bumper2, bumper3, slingLeft, slingRight, leftFlipper, rightFlipper, ball]);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') Body.setAngle(leftFlipper, -0.4);
      if (e.key === 'ArrowRight') Body.setAngle(rightFlipper, 0.4);
      if (e.key === ' ' || e.key === 'ArrowUp') Body.applyForce(ball, ball.position, { x: 0, y: -0.015 });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') Body.setAngle(leftFlipper, 0.3);
      if (e.key === 'ArrowRight') Body.setAngle(rightFlipper, -0.3);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    Events.on(engine, 'collisionStart', (event: any) => {
      event.pairs.forEach((pair: any) => {
        if (pair.bodyA === bumper1 || pair.bodyB === bumper1 || 
            pair.bodyA === bumper2 || pair.bodyB === bumper2 ||
            pair.bodyA === bumper3 || pair.bodyB === bumper3) {
          setScore(s => s + 100);
        }
        if (pair.bodyA === bottomWall || pair.bodyB === bottomWall) {
          setScore(0);
          Composite.remove(world, ball);
          ball = createBall();
          Composite.add(world, ball);
        }
      });
    });

    return () => {
      Render.stop(render);
      Engine.clear(engine);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/black-orchid.png')]" />
      
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-block mb-12 p-1 bg-gradient-to-r from-primary via-yellow-600 to-primary rounded-lg shadow-[0_0_40px_rgba(255,215,0,0.4)]">
            <div className="bg-black px-12 py-6 rounded-md border border-primary/30">
              <h1 className="text-4xl md:text-7xl font-display text-primary tracking-[0.2em] drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]">
                BALLY BUMPER
              </h1>
              <p className="text-primary/60 font-mono text-sm uppercase tracking-widest mt-3">Elite Boss Mode Edition</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-8">
            <div className="bg-black/80 border-8 border-primary/50 p-6 rounded-2xl shadow-[0_0_80px_rgba(218,165,32,0.4)] relative group">
              <div className="absolute inset-0 border-4 border-primary/20 m-2 pointer-events-none" />
              
              <div className="mb-6 bg-black/60 border-2 border-primary/30 py-4 px-10 rounded-xl flex justify-between items-center">
                <span className="text-primary font-display text-lg tracking-widest uppercase">BOSS SCORE</span>
                <span className="text-white font-mono text-4xl drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">
                  {score.toLocaleString().padStart(8, '0')}
                </span>
              </div>

              <div 
                ref={sceneRef} 
                className="bg-[radial-gradient(circle_at_center,_#2a2a2a_0%,_#000000_100%)] rounded-lg border-2 border-primary/30 overflow-hidden relative"
                style={{ width: 400, height: 600 }}
              >
                <div className="absolute top-10 left-10 w-24 h-24 border-2 border-primary/10 rounded-full animate-pulse" />
                <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-secondary/10 rounded-full animate-pulse delay-700" />
                <Trophy className="absolute bottom-6 right-6 w-16 h-16 text-primary/10" />
              </div>

              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="bg-primary/20 border-2 border-primary/30 p-4 rounded-lg text-xs font-mono text-primary uppercase text-center tracking-widest font-bold">
                  ← Left Flipper
                </div>
                <div className="bg-primary/20 border-2 border-primary/30 p-4 rounded-lg text-xs font-mono text-primary uppercase text-center tracking-widest font-bold">
                  Right Flipper →
                </div>
              </div>
              <div className="mt-4 bg-secondary/20 border-2 border-secondary/30 p-4 rounded-lg text-xs font-mono text-secondary uppercase text-center w-full tracking-widest font-bold">
                SPACE / UP TO LAUNCH BALL
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
