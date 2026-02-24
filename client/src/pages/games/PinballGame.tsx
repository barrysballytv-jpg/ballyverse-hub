import { motion } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { Trophy } from "lucide-react";
import Matter from "matter-js";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";

const W = 380;
const H = 700;

function lighten(hex: string, pct: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, ((num >> 16) & 0xFF) + Math.floor(255 * pct / 100));
  const g = Math.min(255, ((num >> 8) & 0xFF) + Math.floor(255 * pct / 100));
  const b = Math.min(255, (num & 0xFF) + Math.floor(255 * pct / 100));
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, "0")}`;
}

function darken(hex: string, pct: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, ((num >> 16) & 0xFF) - Math.floor(255 * pct / 100));
  const g = Math.max(0, ((num >> 8) & 0xFF) - Math.floor(255 * pct / 100));
  const b = Math.max(0, (num & 0xFF) - Math.floor(255 * pct / 100));
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, "0")}`;
}

export default function PinballGamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
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
  const bumperFlashRef = useRef<Map<number, number>>(new Map());
  const targetHitsRef = useRef<Set<number>>(new Set());
  const multiplierRef = useRef(1);
  const [multiplier, setMultiplier] = useState(1);

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
    multiplierRef.current = 1;
    setMultiplier(1);
    bumperFlashRef.current.clear();
    targetHitsRef.current.clear();
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const { Engine, Render, Runner, Bodies, Composite, Events, Body, Constraint, Vector } = Matter;

    const engine = Engine.create({ gravity: { x: 0, y: 1.0, scale: 0.001 } });
    engineRef.current = engine;
    const world = engine.world;

    const render = Render.create({
      canvas: canvasRef.current,
      engine,
      options: { width: W, height: H, wireframes: false, background: "#0a0a1a", pixelRatio: 1 },
    });
    renderRef.current = render;
    Render.run(render);
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    const wallColor = "#5C3A1E";
    const wallRender = { fillStyle: wallColor, strokeStyle: "#8B6914", lineWidth: 2 };

    const playAreaW = W - 50;
    const chuteX = playAreaW + 5;
    const chuteW = W - playAreaW - 16;

    const leftWall = Bodies.rectangle(8, H / 2, 16, H, { isStatic: true, render: wallRender });
    const rightWall = Bodies.rectangle(W - 8, H / 2, 16, H, { isStatic: true, render: wallRender });
    const topWall = Bodies.rectangle(W / 2, 8, W, 16, { isStatic: true, render: wallRender });
    const chuteSepBottom = Bodies.rectangle(playAreaW, H / 2 + 100, 8, H - 200, {
      isStatic: true, render: { fillStyle: "#654321", strokeStyle: "#8B6914", lineWidth: 1 },
    });
    const chuteTopBlock = Bodies.rectangle(W - 12, 60, 30, 8, {
      isStatic: true, angle: -0.8, render: { fillStyle: "#654321", strokeStyle: "#8B6914", lineWidth: 1 },
      friction: 0, restitution: 0.6,
    });
    const chuteTopBlock2 = Bodies.rectangle(playAreaW + 10, 90, 30, 8, {
      isStatic: true, angle: -0.5, render: { fillStyle: "#654321", strokeStyle: "#8B6914", lineWidth: 1 },
      friction: 0, restitution: 0.6,
    });

    const drainY = H - 15;
    const drainGapWidth = 70;
    const playCenter = playAreaW / 2;
    const leftDrainEnd = playCenter - drainGapWidth / 2;
    const rightDrainStart = playCenter + drainGapWidth / 2;
    const leftDrainWall = Bodies.rectangle((16 + leftDrainEnd) / 2, drainY, leftDrainEnd - 16, 10, { isStatic: true, render: { fillStyle: "#333" } });
    const rightDrainWall = Bodies.rectangle((rightDrainStart + playAreaW) / 2, drainY, playAreaW - rightDrainStart, 10, { isStatic: true, render: { fillStyle: "#333" } });

    const drainSensor = Bodies.rectangle(playCenter, H + 20, playAreaW, 40, {
      isStatic: true, isSensor: true, render: { visible: false }, label: "drain",
    });

    const guideLen = 90;
    const guideY = H - 160;
    const guideAngle = Math.PI / 5;
    const leftGuide = Bodies.rectangle(50, guideY, guideLen, 8, {
      isStatic: true, angle: guideAngle, render: { fillStyle: "#AA3333", strokeStyle: "#FF4444", lineWidth: 2 },
      friction: 0, restitution: 0.3,
    });
    const rightGuide = Bodies.rectangle(playAreaW - 45, guideY, guideLen, 8, {
      isStatic: true, angle: -guideAngle, render: { fillStyle: "#3333AA", strokeStyle: "#4444FF", lineWidth: 2 },
      friction: 0, restitution: 0.3,
    });

    Composite.add(world, [leftWall, rightWall, topWall, chuteSepBottom, chuteTopBlock, chuteTopBlock2, leftDrainWall, rightDrainWall, drainSensor, leftGuide, rightGuide]);

    const bumperData = [
      { x: 110, y: 160, r: 24, color: "#FF2222", ring: "#FF6666" },
      { x: 230, y: 160, r: 24, color: "#2255FF", ring: "#6688FF" },
      { x: 170, y: 250, r: 28, color: "#22CC22", ring: "#66FF66" },
      { x: 70, y: 320, r: 20, color: "#FF8800", ring: "#FFAA44" },
      { x: 270, y: 320, r: 20, color: "#CC22CC", ring: "#FF66FF" },
    ];

    const bumpers = bumperData.map((bd, i) =>
      Bodies.circle(bd.x, bd.y, bd.r, {
        isStatic: true, restitution: 1.5, label: `bumper_${i}`,
        render: { fillStyle: bd.color, strokeStyle: bd.ring, lineWidth: 3 },
      })
    );

    const targets = [
      Bodies.rectangle(25, 280, 8, 30, { isStatic: true, label: "target_0", restitution: 1.2, render: { fillStyle: "#FF4444" } }),
      Bodies.rectangle(25, 340, 8, 30, { isStatic: true, label: "target_1", restitution: 1.2, render: { fillStyle: "#FF4444" } }),
      Bodies.rectangle(25, 400, 8, 30, { isStatic: true, label: "target_2", restitution: 1.2, render: { fillStyle: "#FF4444" } }),
      Bodies.rectangle(playAreaW - 15, 280, 8, 30, { isStatic: true, label: "target_3", restitution: 1.2, render: { fillStyle: "#4488FF" } }),
      Bodies.rectangle(playAreaW - 15, 340, 8, 30, { isStatic: true, label: "target_4", restitution: 1.2, render: { fillStyle: "#4488FF" } }),
      Bodies.rectangle(playAreaW - 15, 400, 8, 30, { isStatic: true, label: "target_5", restitution: 1.2, render: { fillStyle: "#4488FF" } }),
    ];

    const pegPositions: { x: number; y: number }[] = [];
    const pegs: Matter.Body[] = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 5; col++) {
        const offset = row % 2 === 0 ? 0 : 28;
        const px = 50 + col * 56 + offset;
        const py = 420 + row * 40;
        if (px > 25 && px < playAreaW - 20) {
          pegPositions.push({ x: px, y: py });
          pegs.push(Bodies.circle(px, py, 5, {
            isStatic: true, restitution: 0.8, label: "peg",
            render: { fillStyle: "#C0C0C0", strokeStyle: "#888", lineWidth: 1 },
          }));
        }
      }
    }

    const slingPositions = [
      { x: 45, y: H - 220, angle: 0.5 },
      { x: playAreaW - 45, y: H - 220, angle: -0.5 },
    ];
    const slings = slingPositions.map((sp, i) =>
      Bodies.polygon(sp.x, sp.y, 3, 22, {
        isStatic: true, restitution: 2.0, label: "sling", angle: sp.angle,
        render: { fillStyle: i === 0 ? "#CC3333" : "#3333CC", strokeStyle: "#FF4444", lineWidth: 2 },
      })
    );

    Composite.add(world, [...bumpers, ...targets, ...pegs, ...slings]);

    const flipperW = 75;
    const flipperH = 14;
    const flipperY = H - 60;
    const leftPivotX = playCenter - 55;
    const rightPivotX = playCenter + 55;

    const flipperRender = { fillStyle: "#C0C0C0", strokeStyle: "#888", lineWidth: 2 };
    const flipperOpts = { density: 0.02, friction: 0.1, restitution: 0.05, chamfer: { radius: 7 } };

    const leftFlipper = Bodies.rectangle(leftPivotX + flipperW / 2 - 15, flipperY, flipperW, flipperH,
      { ...flipperOpts, label: "leftFlipper", render: flipperRender });
    const rightFlipper = Bodies.rectangle(rightPivotX - flipperW / 2 + 15, flipperY, flipperW, flipperH,
      { ...flipperOpts, label: "rightFlipper", render: flipperRender });

    const leftPivotC = Constraint.create({
      pointA: { x: leftPivotX, y: flipperY }, bodyB: leftFlipper,
      pointB: { x: -flipperW / 2 + 15, y: 0 }, length: 0, stiffness: 1,
    });
    const rightPivotC = Constraint.create({
      pointA: { x: rightPivotX, y: flipperY }, bodyB: rightFlipper,
      pointB: { x: flipperW / 2 - 15, y: 0 }, length: 0, stiffness: 1,
    });

    Composite.add(world, [leftFlipper, rightFlipper, leftPivotC, rightPivotC]);
    leftFlipperRef.current = leftFlipper;
    rightFlipperRef.current = rightFlipper;

    const restAngleLeft = 0.4;
    const restAngleRight = -0.4;
    const flipAngleLeft = -0.6;
    const flipAngleRight = 0.6;
    Body.setAngle(leftFlipper, restAngleLeft);
    Body.setAngle(rightFlipper, restAngleRight);

    const ballSpawnX = chuteX + chuteW / 2 + 4;
    const ballSpawnY = H - 50;
    const createBall = () => Bodies.circle(ballSpawnX, ballSpawnY, 10, {
      restitution: 0.4, friction: 0.005, density: 0.004, label: "ball",
      render: { fillStyle: "#E8E8E8", strokeStyle: "#999", lineWidth: 1 },
    });

    let ball = createBall();
    ballRef.current = ball;
    Composite.add(world, ball);
    Body.setStatic(ball, true);

    Events.on(render, "afterRender", () => {
      const ctx = render.context;

      ctx.save();
      ctx.globalAlpha = 0.04;
      ctx.strokeStyle = "#FFD700";
      for (let i = 0; i < playAreaW; i += 20) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke(); }
      for (let j = 0; j < H; j += 20) { ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(playAreaW, j); ctx.stroke(); }
      ctx.restore();

      ctx.save();
      ctx.fillStyle = "#0d0808";
      ctx.fillRect(playAreaW - 4, 16, W - playAreaW + 4, H - 32);
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = 0.06;
      const starGrad = ctx.createRadialGradient(playCenter, 120, 10, playCenter, 120, 160);
      starGrad.addColorStop(0, "#FFD700");
      starGrad.addColorStop(1, "transparent");
      ctx.fillStyle = starGrad;
      ctx.fillRect(0, 0, playAreaW, 300);
      ctx.restore();

      ctx.save();
      ctx.font = "bold 11px serif";
      ctx.textAlign = "center";
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = "#FFD700";
      ctx.fillText("BALLY UP GANG", playCenter, 220);
      ctx.font = "bold 8px serif";
      ctx.fillText("KINGDOM QUEST", playCenter, 233);
      ctx.restore();

      const drawInsert = (x: number, y: number, r: number, color: string, lit: boolean) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = lit ? 0.6 : 0.12;
        ctx.fill();
        if (lit) { ctx.shadowColor = color; ctx.shadowBlur = 10; ctx.fill(); }
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.4;
        ctx.stroke();
        ctx.restore();
      };

      drawInsert(80, 380, 7, "#FF0000", true);
      drawInsert(playCenter, 370, 7, "#00FF00", true);
      drawInsert(playAreaW - 80, 380, 7, "#0088FF", true);
      drawInsert(65, 540, 5, "#FF00FF", true);
      drawInsert(playCenter, 540, 5, "#FFD700", true);
      drawInsert(playAreaW - 65, 540, 5, "#00FFFF", true);

      const now = Date.now();
      bumperData.forEach((bd, i) => {
        const flashTime = bumperFlashRef.current.get(i) || 0;
        if (now - flashTime < 150) {
          ctx.save();
          ctx.shadowColor = "#FFFFFF";
          ctx.shadowBlur = 20;
          ctx.beginPath();
          ctx.arc(bd.x, bd.y, bd.r + 4, 0, Math.PI * 2);
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 3;
          ctx.stroke();
          ctx.restore();
        }
      });

      ctx.save();
      ctx.globalAlpha = 0.12;
      ctx.strokeStyle = "#FF4444";
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 4]);
      ctx.beginPath();
      ctx.moveTo(45, 550);
      ctx.quadraticCurveTo(35, 250, 120, 80);
      ctx.stroke();
      ctx.strokeStyle = "#4444FF";
      ctx.beginPath();
      ctx.moveTo(playAreaW - 45, 550);
      ctx.quadraticCurveTo(playAreaW - 35, 250, playAreaW - 120, 80);
      ctx.stroke();
      ctx.strokeStyle = "#22CC22";
      ctx.beginPath();
      ctx.moveTo(100, 550);
      ctx.quadraticCurveTo(playCenter, 350, playAreaW - 100, 550);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      ctx.save();
      ctx.font = "bold 9px Arial";
      ctx.textAlign = "center";
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = "#FFD700";
      const chuteCenter = playAreaW + (W - playAreaW) / 2;
      ctx.fillText("▲", chuteCenter, H - 90);
      ctx.font = "bold 7px Arial";
      ctx.fillText("PULL", chuteCenter, H - 75);
      ctx.restore();
    });

    Events.on(engine, "beforeUpdate", () => {
      const lf = leftFlipperRef.current;
      const rf = rightFlipperRef.current;
      if (!lf || !rf) return;

      if (keysRef.current.left) {
        if (lf.angle > flipAngleLeft) Body.setAngularVelocity(lf, -0.35);
      } else {
        if (lf.angle < restAngleLeft) Body.setAngularVelocity(lf, 0.15);
        else { Body.setAngularVelocity(lf, 0); Body.setAngle(lf, restAngleLeft); }
      }

      if (keysRef.current.right) {
        if (rf.angle < flipAngleRight) Body.setAngularVelocity(rf, 0.35);
      } else {
        if (rf.angle > restAngleRight) Body.setAngularVelocity(rf, -0.15);
        else { Body.setAngularVelocity(rf, 0); Body.setAngle(rf, restAngleRight); }
      }
    });

    Events.on(engine, "collisionStart", (event: any) => {
      event.pairs.forEach((pair: any) => {
        const labels = [pair.bodyA.label, pair.bodyB.label];

        const bumperLabel = labels.find((l: string) => l.startsWith("bumper_"));
        if (bumperLabel) {
          const idx = parseInt(bumperLabel.split("_")[1]);
          bumperFlashRef.current.set(idx, Date.now());
          const pts = 100 * multiplierRef.current;
          scoreRef.current += pts;
          setScore(scoreRef.current);
        }

        const targetLabel = labels.find((l: string) => l.startsWith("target_"));
        if (targetLabel) {
          const tIdx = parseInt(targetLabel.split("_")[1]);
          if (!targetHitsRef.current.has(tIdx)) {
            targetHitsRef.current.add(tIdx);
            const pts = 250 * multiplierRef.current;
            scoreRef.current += pts;
            setScore(scoreRef.current);

            if (targetHitsRef.current.size >= 6) {
              multiplierRef.current = Math.min(multiplierRef.current + 1, 5);
              setMultiplier(multiplierRef.current);
              scoreRef.current += 1000;
              setScore(scoreRef.current);
              targetHitsRef.current.clear();
            }
          }
        }

        if (labels.includes("sling")) {
          scoreRef.current += 50 * multiplierRef.current;
          setScore(scoreRef.current);
        }

        if (labels.includes("peg")) {
          scoreRef.current += 10 * multiplierRef.current;
          setScore(scoreRef.current);
        }

        if (labels.includes("drain") && labels.includes("ball")) {
          const newBalls = ballsLeftRef.current - 1;
          ballsLeftRef.current = newBalls;
          setBallsLeft(newBalls);
          Composite.remove(world, ball);

          if (newBalls <= 0) {
            setGameOver(true);
            const finalScore = scoreRef.current;
            setTimeout(() => { if (finalScore > 0) saveScore(finalScore); }, 500);
          } else {
            ball = createBall();
            ballRef.current = ball;
            Composite.add(world, ball);
            Body.setStatic(ball, true);
            setLaunched(false);
            launchedRef.current = false;
            multiplierRef.current = 1;
            setMultiplier(1);
            targetHitsRef.current.clear();
          }
        }
      });
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keysRef.current.left = true;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keysRef.current.right = true;
      if ((e.key === " " || e.key === "ArrowUp") && !launchedRef.current) {
        Body.setStatic(ball, false);
        Body.setVelocity(ball, { x: 0, y: -25 });
        setLaunched(true);
        launchedRef.current = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keysRef.current.left = false;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keysRef.current.right = false;
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
      if (oldBall) Matter.Composite.remove(world, oldBall);
      const playAreaW = W - 50;
      const chuteX = playAreaW + 5;
      const chuteW = W - playAreaW - 16;
      const newBall = Matter.Bodies.circle(chuteX + chuteW / 2 + 4, H - 50, 10, {
        restitution: 0.4, friction: 0.005, density: 0.004, label: "ball",
        render: { fillStyle: "#E8E8E8", strokeStyle: "#999", lineWidth: 1 },
      });
      Matter.Body.setStatic(newBall, true);
      ballRef.current = newBall;
      Matter.Composite.add(world, newBall);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-24 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #1a0a2e 0%, #0d0d0d 50%, #1a0a0a 100%)" }}>

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>

          <div className="inline-block mb-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-yellow-500 to-blue-600 rounded-xl blur-sm opacity-60" />
              <div className="relative px-10 py-5 rounded-xl border-2 border-yellow-600/50"
                style={{ background: "linear-gradient(135deg, #2a1a0a, #1a0a2e, #0a1a2e)" }}>
                <h1 className="text-4xl md:text-6xl font-bold tracking-widest"
                  style={{
                    background: "linear-gradient(180deg, #FFD700, #FF8C00, #FFD700)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    filter: "drop-shadow(0 0 10px rgba(255,215,0,0.5))",
                  }}>
                  BALLY BUMPER
                </h1>
                <p className="text-yellow-600/80 text-xs uppercase tracking-[0.3em] mt-2 font-bold">
                  Kingdom Quest Edition
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative rounded-2xl p-1"
              style={{ background: "linear-gradient(180deg, #8B4513, #654321, #3a2510, #654321, #8B4513)" }}>
              <div className="rounded-xl overflow-hidden" style={{ background: "#2a1a0a" }}>

                <div className="flex items-center justify-between px-4 py-3 border-b-2 border-yellow-900/50"
                  style={{ background: "linear-gradient(90deg, #1a0a00, #2a1a0a, #1a0a00)" }}>
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1 rounded border border-red-800/50 bg-black/60">
                      <span className="text-red-500 text-[10px] uppercase tracking-widest font-bold block">Score</span>
                      <span className="font-mono text-2xl tracking-wider" data-testid="text-pinball-score"
                        style={{ color: "#FF3333", textShadow: "0 0 8px rgba(255,50,50,0.8)" }}>
                        {score.toLocaleString().padStart(8, "0")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {multiplier > 1 && (
                      <div className="px-2 py-1 rounded border border-yellow-600/50 bg-black/60">
                        <span className="text-yellow-400 text-xs font-bold" data-testid="text-multiplier">{multiplier}X</span>
                      </div>
                    )}
                    <div className="px-3 py-1 rounded border border-yellow-800/50 bg-black/60">
                      <span className="text-yellow-600 text-[10px] uppercase tracking-widest font-bold block">Ball</span>
                      <div className="flex gap-1 mt-0.5">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i}
                            className={`w-3.5 h-3.5 rounded-full border-2 ${
                              i < ballsLeft
                                ? "border-yellow-500 bg-gradient-to-b from-white to-gray-400"
                                : "border-gray-700 bg-transparent"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative" style={{ width: W, height: H }}>
                  <canvas
                    ref={canvasRef}
                    width={W}
                    height={H}
                    data-testid="canvas-pinball"
                  />

                  {gameOver && (
                    <div className="absolute inset-0 flex items-center justify-center z-20"
                      style={{ background: "rgba(0,0,0,0.85)" }}>
                      <div className="text-center space-y-4 p-8 rounded-xl border-2 border-yellow-600/50"
                        style={{ background: "linear-gradient(135deg, #2a1a0a, #1a0a2e)" }}>
                        <Trophy className="w-16 h-16 text-yellow-500 mx-auto" />
                        <h2 className="text-4xl font-bold" data-testid="text-game-over"
                          style={{
                            background: "linear-gradient(180deg, #FFD700, #FF8C00)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}>
                          GAME OVER
                        </h2>
                        <p className="font-mono text-2xl text-white">
                          {score.toLocaleString()} pts
                        </p>
                        {multiplier > 1 && (
                          <p className="text-yellow-400 text-sm">Max Multiplier: {multiplier}X</p>
                        )}
                        {scoreSaved && (
                          <p className="text-green-400 text-sm font-bold uppercase">Score Saved!</p>
                        )}
                        {!isAuthenticated && score > 0 && (
                          <p className="text-gray-400 text-sm">
                            <a href="/api/login" className="text-yellow-400 underline">Sign in</a> to save scores
                          </p>
                        )}
                        <button onClick={handleRestart} data-testid="button-restart-pinball"
                          className="px-8 py-3 rounded-lg font-bold text-lg uppercase tracking-wider transition-all hover:scale-105"
                          style={{
                            background: "linear-gradient(180deg, #FFD700, #CC8800)",
                            color: "#1a0a00",
                          }}>
                          Play Again
                        </button>
                      </div>
                    </div>
                  )}

                  {!launched && !gameOver && (
                    <div className="absolute bottom-24 left-0 right-0 text-center z-10">
                      <span className="px-5 py-2.5 rounded-lg font-bold text-sm uppercase tracking-widest animate-pulse border-2 border-yellow-600/50"
                        style={{ background: "rgba(0,0,0,0.85)", color: "#FFD700" }}>
                        Press SPACE to launch
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 border-t-2 border-yellow-900/50"
                  style={{ background: "linear-gradient(90deg, #1a0a00, #2a1a0a, #1a0a00)" }}>
                  <div className="py-2 rounded text-center border border-red-900/40"
                    style={{ background: "rgba(255,50,50,0.1)" }}>
                    <span className="text-red-400 text-[10px] uppercase tracking-widest font-bold">← / A</span>
                    <span className="block text-red-300 text-[9px] mt-0.5">Left Flipper</span>
                  </div>
                  <div className="py-2 rounded text-center border border-green-900/40"
                    style={{ background: "rgba(50,255,50,0.1)" }}>
                    <span className="text-green-400 text-[10px] uppercase tracking-widest font-bold">SPACE</span>
                    <span className="block text-green-300 text-[9px] mt-0.5">Launch</span>
                  </div>
                  <div className="py-2 rounded text-center border border-blue-900/40"
                    style={{ background: "rgba(50,50,255,0.1)" }}>
                    <span className="text-blue-400 text-[10px] uppercase tracking-widest font-bold">→ / D</span>
                    <span className="block text-blue-300 text-[9px] mt-0.5">Right Flipper</span>
                  </div>
                </div>

                <div className="flex justify-center gap-4 px-4 py-2 border-t border-yellow-900/30"
                  style={{ background: "#1a0a00" }}>
                  <div className="text-center">
                    <span className="text-yellow-700 text-[9px] uppercase block">Bumper</span>
                    <span className="text-yellow-500 text-[10px] font-bold">100</span>
                  </div>
                  <div className="text-center">
                    <span className="text-yellow-700 text-[9px] uppercase block">Target</span>
                    <span className="text-yellow-500 text-[10px] font-bold">250</span>
                  </div>
                  <div className="text-center">
                    <span className="text-yellow-700 text-[9px] uppercase block">Sling</span>
                    <span className="text-yellow-500 text-[10px] font-bold">50</span>
                  </div>
                  <div className="text-center">
                    <span className="text-yellow-700 text-[9px] uppercase block">Peg</span>
                    <span className="text-yellow-500 text-[10px] font-bold">10</span>
                  </div>
                  <div className="text-center">
                    <span className="text-yellow-700 text-[9px] uppercase block">All Targets</span>
                    <span className="text-yellow-500 text-[10px] font-bold">+1000 & Multi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
