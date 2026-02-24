import { motion } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { Trophy } from "lucide-react";
import Matter from "matter-js";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function PinballGamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const ballRef = useRef<Matter.Body | null>(null);
  const leftFlipperRef = useRef<Matter.Body | null>(null);
  const rightFlipperRef = useRef<Matter.Body | null>(null);
  const keysRef = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });
  const scoreRef = useRef(0);
  const [score, setScore] = useState(0);
  const [ballsLeft, setBallsLeft] = useState(3);
  const ballsLeftRef = useRef(3);
  const [gameOver, setGameOver] = useState(false);
  const [launched, setLaunched] = useState(false);
  const launchedRef = useRef(false);
  const { user, isAuthenticated } = useAuth();
  const [scoreSaved, setScoreSaved] = useState(false);

  const W = 400;
  const H = 700;

  const saveScore = useCallback(async (finalScore: number) => {
    if (!isAuthenticated || finalScore <= 0 || scoreSaved) return;
    try {
      await apiRequest("POST", "/api/scores", { game: "pinball", score: finalScore });
      queryClient.invalidateQueries({ queryKey: ["/api/scores/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/scores/leaderboard/pinball"] });
      setScoreSaved(true);
    } catch (e) {}
  }, [isAuthenticated, scoreSaved]);

  const resetGame = useCallback(() => {
    setScore(0);
    scoreRef.current = 0;
    setBallsLeft(3);
    ballsLeftRef.current = 3;
    setGameOver(false);
    setLaunched(false);
    launchedRef.current = false;
    setScoreSaved(false);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const Runner = Matter.Runner;
    const Bodies = Matter.Bodies;
    const Composite = Matter.Composite;
    const Events = Matter.Events;
    const Body = Matter.Body;
    const Constraint = Matter.Constraint;
    const Vector = Matter.Vector;

    const engine = Engine.create({
      gravity: { x: 0, y: 1.2, scale: 0.001 },
    });
    engineRef.current = engine;
    const world = engine.world;

    const render = Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: W,
        height: H,
        wireframes: false,
        background: "transparent",
        pixelRatio: window.devicePixelRatio || 1,
      },
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    const gold = "#FFD700";
    const darkGold = "#DAA520";
    const wallColor = "#8B7500";

    const wallOpts = { isStatic: true, render: { fillStyle: wallColor }, friction: 0.1 };

    const leftWall = Bodies.rectangle(10, H / 2, 20, H, wallOpts);
    const topWall = Bodies.rectangle(W / 2, 10, W, 20, wallOpts);

    const launchWall = Bodies.rectangle(W - 10, H / 2, 10, H, wallOpts);

    const launchSepTop = 200;
    const launchSepHeight = H - launchSepTop - 60;
    const launchSep = Bodies.rectangle(W - 50, launchSepTop + launchSepHeight / 2, 10, launchSepHeight, wallOpts);

    const rightWallBottom = Bodies.rectangle(W - 50, H - 20, 10, 40, wallOpts);

    const bottomSensor = Bodies.rectangle(W / 2 - 25, H + 10, W - 100, 20, {
      isStatic: true,
      isSensor: true,
      render: { fillStyle: "transparent" },
      label: "drain",
    });

    const curveGuide1 = Bodies.rectangle(W - 55, 60, 50, 10, {
      isStatic: true,
      angle: Math.PI / 4,
      render: { fillStyle: darkGold },
      friction: 0,
      restitution: 0.5,
    });
    const curveGuide2 = Bodies.rectangle(W - 90, 40, 60, 10, {
      isStatic: true,
      angle: Math.PI / 8,
      render: { fillStyle: darkGold },
      friction: 0,
      restitution: 0.5,
    });
    const curveGuide3 = Bodies.rectangle(W - 70, 120, 80, 10, {
      isStatic: true,
      angle: Math.PI / 5,
      render: { fillStyle: darkGold },
      friction: 0,
      restitution: 0.3,
    });

    const guideLeftX = 60;
    const guideRightX = W - 100;
    const guideY = H - 180;
    const guideLen = 120;

    const leftGuide = Bodies.rectangle(guideLeftX, guideY, guideLen, 8, {
      isStatic: true,
      angle: Math.PI / 5,
      render: { fillStyle: darkGold },
      friction: 0,
      restitution: 0.3,
    });
    const rightGuide = Bodies.rectangle(guideRightX, guideY, guideLen, 8, {
      isStatic: true,
      angle: -Math.PI / 5,
      render: { fillStyle: darkGold },
      friction: 0,
      restitution: 0.3,
    });

    Composite.add(world, [
      leftWall, topWall, launchWall, launchSep,
      rightWallBottom,
      bottomSensor, leftGuide, rightGuide,
      curveGuide1, curveGuide2, curveGuide3,
    ]);

    const bumperOpts = {
      isStatic: true,
      restitution: 1.5,
      render: { fillStyle: gold, strokeStyle: darkGold, lineWidth: 3 },
      label: "bumper",
    };

    const bumpers = [
      Bodies.circle(120, 180, 22, { ...bumperOpts, label: "bumper" }),
      Bodies.circle(250, 160, 22, { ...bumperOpts, label: "bumper" }),
      Bodies.circle(180, 280, 26, { ...bumperOpts, label: "bumper" }),
      Bodies.circle(90, 350, 20, { ...bumperOpts, label: "bumper" }),
      Bodies.circle(280, 330, 20, { ...bumperOpts, label: "bumper" }),
    ];

    const pegOpts = {
      isStatic: true,
      restitution: 0.8,
      render: { fillStyle: "#B8860B" },
      label: "peg",
    };
    const pegs: Matter.Body[] = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 5; col++) {
        const offset = row % 2 === 0 ? 0 : 25;
        const px = 70 + col * 60 + offset;
        const py = 420 + row * 40;
        if (px > 30 && px < W - 80) {
          pegs.push(Bodies.circle(px, py, 5, pegOpts));
        }
      }
    }

    const slingOpts = {
      isStatic: true,
      restitution: 2.0,
      render: { fillStyle: darkGold },
      label: "sling",
    };
    const slingLeft = Bodies.polygon(55, H - 240, 3, 25, {
      ...slingOpts,
      angle: 0.5,
    });
    const slingRight = Bodies.polygon(W - 95, H - 240, 3, 25, {
      ...slingOpts,
      angle: -0.5,
    });

    Composite.add(world, [...bumpers, ...pegs, slingLeft, slingRight]);

    const flipperW = 90;
    const flipperH = 14;
    const flipperY = H - 80;
    const leftPivotX = 80;
    const rightPivotX = W - 120;

    const flipperOpts = {
      density: 0.02,
      friction: 0.1,
      restitution: 0.05,
      render: { fillStyle: gold, strokeStyle: darkGold, lineWidth: 2 },
      chamfer: { radius: 7 },
    };

    const leftFlipper = Bodies.rectangle(
      leftPivotX + flipperW / 2 - 15,
      flipperY,
      flipperW,
      flipperH,
      { ...flipperOpts, label: "leftFlipper" }
    );
    const rightFlipper = Bodies.rectangle(
      rightPivotX - flipperW / 2 + 15,
      flipperY,
      flipperW,
      flipperH,
      { ...flipperOpts, label: "rightFlipper" }
    );

    const leftPivot = Constraint.create({
      pointA: { x: leftPivotX, y: flipperY },
      bodyB: leftFlipper,
      pointB: { x: -flipperW / 2 + 15, y: 0 },
      length: 0,
      stiffness: 1,
    });
    const rightPivot = Constraint.create({
      pointA: { x: rightPivotX, y: flipperY },
      bodyB: rightFlipper,
      pointB: { x: flipperW / 2 - 15, y: 0 },
      length: 0,
      stiffness: 1,
    });

    Composite.add(world, [leftFlipper, rightFlipper, leftPivot, rightPivot]);
    leftFlipperRef.current = leftFlipper;
    rightFlipperRef.current = rightFlipper;

    const restAngleLeft = 0.4;
    const restAngleRight = -0.4;
    const flipAngleLeft = -0.6;
    const flipAngleRight = 0.6;
    Body.setAngle(leftFlipper, restAngleLeft);
    Body.setAngle(rightFlipper, restAngleRight);

    const createBall = () => {
      const b = Bodies.circle(W - 32, H - 100, 10, {
        restitution: 0.4,
        friction: 0.005,
        density: 0.004,
        render: { fillStyle: "#FFFFFF", strokeStyle: gold, lineWidth: 2 },
        label: "ball",
      });
      return b;
    };

    let ball = createBall();
    ballRef.current = ball;
    Composite.add(world, ball);

    Events.on(engine, "beforeUpdate", () => {
      const lf = leftFlipperRef.current;
      const rf = rightFlipperRef.current;
      if (!lf || !rf) return;

      if (keysRef.current.left) {
        if (lf.angle > flipAngleLeft) {
          Body.setAngularVelocity(lf, -0.35);
        }
      } else {
        if (lf.angle < restAngleLeft) {
          Body.setAngularVelocity(lf, 0.15);
        } else {
          Body.setAngularVelocity(lf, 0);
          Body.setAngle(lf, restAngleLeft);
        }
      }

      if (keysRef.current.right) {
        if (rf.angle < flipAngleRight) {
          Body.setAngularVelocity(rf, 0.35);
        }
      } else {
        if (rf.angle > restAngleRight) {
          Body.setAngularVelocity(rf, -0.15);
        } else {
          Body.setAngularVelocity(rf, 0);
          Body.setAngle(rf, restAngleRight);
        }
      }

      const speed = Vector.magnitude(ball.velocity);
      if (speed > 15) {
        const scale = 15 / speed;
        Body.setVelocity(ball, {
          x: ball.velocity.x * scale,
          y: ball.velocity.y * scale,
        });
      }
    });

    Events.on(engine, "collisionStart", (event: any) => {
      event.pairs.forEach((pair: any) => {
        const labels = [pair.bodyA.label, pair.bodyB.label];

        if (labels.includes("bumper")) {
          scoreRef.current += 100;
          setScore(scoreRef.current);
          const bumper = pair.bodyA.label === "bumper" ? pair.bodyA : pair.bodyB;
          const originalFill = bumper.render.fillStyle;
          bumper.render.fillStyle = "#FFFFFF";
          setTimeout(() => {
            bumper.render.fillStyle = originalFill;
          }, 100);
        }

        if (labels.includes("sling")) {
          scoreRef.current += 50;
          setScore(scoreRef.current);
        }

        if (labels.includes("peg")) {
          scoreRef.current += 10;
          setScore(scoreRef.current);
        }

        if (labels.includes("drain")) {
          const newBalls = ballsLeftRef.current - 1;
          ballsLeftRef.current = newBalls;
          setBallsLeft(newBalls);

          Composite.remove(world, ball);

          if (newBalls <= 0) {
            setGameOver(true);
            const finalScore = scoreRef.current;
            setTimeout(() => {
              if (finalScore > 0) {
                saveScore(finalScore);
              }
            }, 500);
          } else {
            ball = createBall();
            ballRef.current = ball;
            Composite.add(world, ball);
            setLaunched(false);
            launchedRef.current = false;
          }
        }
      });
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        keysRef.current.left = true;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        keysRef.current.right = true;
      }
      if ((e.key === " " || e.key === "ArrowUp") && !launchedRef.current) {
        Body.setVelocity(ball, { x: -2, y: -20 });
        setLaunched(true);
        launchedRef.current = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        keysRef.current.left = false;
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        keysRef.current.right = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [saveScore]);

  const handleRestart = () => {
    resetGame();
    if (engineRef.current) {
      const world = engineRef.current.world;
      const oldBall = ballRef.current;
      if (oldBall) {
        Matter.Composite.remove(world, oldBall);
      }
      const newBall = Matter.Bodies.circle(W - 32, H - 100, 10, {
        restitution: 0.4,
        friction: 0.005,
        density: 0.004,
        render: { fillStyle: "#FFFFFF", strokeStyle: "#FFD700", lineWidth: 2 },
        label: "ball",
      });
      ballRef.current = newBall;
      Matter.Composite.add(world, newBall);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/black-orchid.png')]" />

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-block mb-8 p-1 bg-gradient-to-r from-primary via-yellow-600 to-primary rounded-lg shadow-[0_0_40px_rgba(255,215,0,0.4)]">
            <div className="bg-black px-12 py-6 rounded-md border border-primary/30">
              <h1 className="text-4xl md:text-7xl font-display text-primary tracking-[0.2em] drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]">
                BALLY BUMPER
              </h1>
              <p className="text-primary/60 font-mono text-sm uppercase tracking-widest mt-3">
                Elite Boss Mode Edition
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="bg-black/80 border-8 border-primary/50 p-6 rounded-2xl shadow-[0_0_80px_rgba(218,165,32,0.4)] relative">
              <div className="absolute inset-0 border-4 border-primary/20 m-2 pointer-events-none rounded-xl" />

              <div className="mb-4 bg-black/60 border-2 border-primary/30 py-3 px-6 rounded-xl flex justify-between items-center gap-8">
                <div className="flex items-center gap-4">
                  <span className="text-primary font-display text-sm tracking-widest uppercase">
                    SCORE
                  </span>
                  <span className="text-white font-mono text-3xl drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]" data-testid="text-pinball-score">
                    {score.toLocaleString().padStart(8, "0")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary/60 font-display text-xs tracking-wider uppercase">
                    BALLS
                  </span>
                  <div className="flex gap-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 rounded-full border-2 ${
                          i < ballsLeft
                            ? "bg-white border-primary"
                            : "bg-transparent border-primary/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative" style={{ width: W, height: H }}>
                <canvas
                  ref={canvasRef}
                  className="bg-[radial-gradient(circle_at_center,_#1a1a2e_0%,_#000000_100%)] rounded-lg border-2 border-primary/30"
                  width={W}
                  height={H}
                  data-testid="canvas-pinball"
                />

                {gameOver && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-lg z-20">
                    <div className="text-center space-y-4">
                      <Trophy className="w-16 h-16 text-primary mx-auto" />
                      <h2 className="font-display text-4xl text-primary" data-testid="text-game-over">
                        GAME OVER
                      </h2>
                      <p className="font-mono text-2xl text-white">
                        Final Score: {score.toLocaleString()}
                      </p>
                      {scoreSaved && (
                        <p className="text-secondary text-sm font-display uppercase">
                          Score Saved!
                        </p>
                      )}
                      {!isAuthenticated && score > 0 && (
                        <p className="text-muted-foreground text-sm">
                          <a href="/api/login" className="text-primary underline">
                            Sign in
                          </a>{" "}
                          to save your scores
                        </p>
                      )}
                      <button
                        onClick={handleRestart}
                        className="px-8 py-3 bg-primary text-black font-display text-lg uppercase tracking-wider hover:bg-white transition-all"
                        data-testid="button-restart-pinball"
                      >
                        Play Again
                      </button>
                    </div>
                  </div>
                )}

                {!launched && !gameOver && (
                  <div className="absolute bottom-4 left-0 right-0 text-center z-10">
                    <span className="bg-black/80 text-primary font-display text-sm uppercase tracking-widest px-4 py-2 rounded border border-primary/30 animate-pulse">
                      Press SPACE to launch
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-primary/20 border-2 border-primary/30 p-3 rounded-lg text-xs font-mono text-primary uppercase text-center tracking-widest font-bold">
                  ← / A = Left Flipper
                </div>
                <div className="bg-primary/20 border-2 border-primary/30 p-3 rounded-lg text-xs font-mono text-primary uppercase text-center tracking-widest font-bold">
                  → / D = Right Flipper
                </div>
              </div>
              <div className="mt-3 bg-secondary/20 border-2 border-secondary/30 p-3 rounded-lg text-xs font-mono text-secondary uppercase text-center w-full tracking-widest font-bold">
                SPACE / UP = LAUNCH BALL
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
