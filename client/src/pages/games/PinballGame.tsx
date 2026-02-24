import { motion } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { Trophy } from "lucide-react";
import Matter from "matter-js";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";

const W = 420;
const H = 750;

function drawPlayfieldArt(ctx: CanvasRenderingContext2D) {
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "#1a0a2e");
  grad.addColorStop(0.3, "#0d1b3e");
  grad.addColorStop(0.6, "#0a2a1a");
  grad.addColorStop(1, "#1a0a0a");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "rgba(255,215,0,0.06)";
  ctx.lineWidth = 1;
  for (let i = 0; i < W; i += 20) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, H);
    ctx.stroke();
  }
  for (let j = 0; j < H; j += 20) {
    ctx.beginPath();
    ctx.moveTo(0, j);
    ctx.lineTo(W, j);
    ctx.stroke();
  }

  ctx.save();
  ctx.globalAlpha = 0.08;
  const starGrad = ctx.createRadialGradient(W / 2, 100, 10, W / 2, 100, 180);
  starGrad.addColorStop(0, "#FFD700");
  starGrad.addColorStop(1, "transparent");
  ctx.fillStyle = starGrad;
  ctx.fillRect(0, 0, W, 300);
  ctx.restore();

  const drawStar = (cx: number, cy: number, r: number, color: string) => {
    ctx.save();
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.15;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      const aInner = a + Math.PI / 5;
      ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      ctx.lineTo(cx + Math.cos(aInner) * r * 0.4, cy + Math.sin(aInner) * r * 0.4);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };
  drawStar(70, 60, 30, "#FF4444");
  drawStar(W - 90, 70, 25, "#4444FF");
  drawStar(W / 2, 50, 35, "#FFD700");

  const drawArrow = (x: number, y: number, angle: number, len: number, color: string) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(len, 0);
    ctx.lineTo(len - 8, -6);
    ctx.moveTo(len, 0);
    ctx.lineTo(len - 8, 6);
    ctx.stroke();
    ctx.restore();
  };
  drawArrow(40, 400, -0.5, 50, "#FF6B6B");
  drawArrow(W - 90, 400, Math.PI + 0.5, 50, "#6B6BFF");

  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.strokeStyle = "#FFD700";
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.arc(W / 2 - 15, 230, 80, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(W / 2 - 15, 230, 60, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  const drawLaneStripe = (x1: number, y1: number, x2: number, y2: number, color: string) => {
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = color;
    ctx.lineWidth = 12;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  };
  drawLaneStripe(30, 150, 30, 500, "#FF4444");
  drawLaneStripe(W - 70, 250, W - 70, 500, "#4444FF");
  drawLaneStripe(60, H - 200, 140, H - 100, "#FF8800");
  drawLaneStripe(W - 80, H - 200, W - 160, H - 100, "#00BBFF");

  const drawInsert = (x: number, y: number, r: number, color: string, lit: boolean) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    if (lit) {
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.7;
      ctx.fill();
      ctx.globalAlpha = 0.3;
      ctx.shadowColor = color;
      ctx.shadowBlur = 15;
      ctx.fill();
    } else {
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.15;
      ctx.fill();
    }
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;
    ctx.stroke();
    ctx.restore();
  };

  drawInsert(100, 380, 8, "#FF0000", true);
  drawInsert(160, 370, 8, "#FFAA00", false);
  drawInsert(220, 370, 8, "#00FF00", true);
  drawInsert(280, 380, 8, "#0088FF", false);

  drawInsert(80, 550, 6, "#FF00FF", true);
  drawInsert(W / 2 - 15, 560, 6, "#FFD700", true);
  drawInsert(W - 110, 550, 6, "#00FFFF", true);

  drawInsert(W / 2 - 60, 130, 6, "#FF4444", false);
  drawInsert(W / 2 + 30, 130, 6, "#4444FF", false);

  ctx.save();
  ctx.font = "bold 10px Arial";
  ctx.textAlign = "center";
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = "#FFD700";
  ctx.fillText("100", 100, 383);
  ctx.fillStyle = "#FF8800";
  ctx.fillText("250", 160, 373);
  ctx.fillStyle = "#00FF88";
  ctx.fillText("500", 220, 373);
  ctx.fillStyle = "#00AAFF";
  ctx.fillText("100", 280, 383);
  ctx.restore();

  ctx.save();
  ctx.font = "bold 14px serif";
  ctx.textAlign = "center";
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = "#FFD700";
  ctx.fillText("BALLY UP GANG", W / 2 - 15, 240);
  ctx.font = "bold 10px serif";
  ctx.fillText("KINGDOM", W / 2 - 15, 255);
  ctx.restore();

  drawRamp(ctx,
    [{ x: 55, y: 580 }, { x: 45, y: 280 }, { x: 60, y: 150 }, { x: 130, y: 80 }, { x: 200, y: 60 }],
    "#882222", "LEFT RAMP"
  );
  drawRamp(ctx,
    [{ x: W - 100, y: 580 }, { x: W - 85, y: 280 }, { x: W - 95, y: 150 }, { x: W - 150, y: 90 }, { x: W - 220, y: 70 }],
    "#222288", "RIGHT RAMP"
  );
  drawRamp(ctx,
    [{ x: 120, y: 580 }, { x: 160, y: 450 }, { x: W / 2, y: 350 }, { x: W - 160, y: 450 }, { x: W - 140, y: 580 }],
    "#228822", "CENTER LOOP"
  );

  ctx.save();
  ctx.font = "bold 8px Arial";
  ctx.textAlign = "center";
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = "#FF4444";
  ctx.fillText("SUPER", 80, 540);
  ctx.fillText("BONUS", 80, 550);
  ctx.fillStyle = "#FFD700";
  ctx.fillText("EXTRA", W / 2 - 15, 550);
  ctx.fillText("BALL", W / 2 - 15, 560);
  ctx.fillStyle = "#00FFFF";
  ctx.fillText("MULTI", W - 110, 540);
  ctx.fillText("BALL", W - 110, 550);
  ctx.restore();
}

function drawBumperOverlay(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, ringColor: string, hit: boolean) {
  ctx.save();
  if (hit) {
    ctx.shadowColor = "#FFFFFF";
    ctx.shadowBlur = 25;
  }

  const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
  grad.addColorStop(0, hit ? "#FFFFFF" : lighten(color, 60));
  grad.addColorStop(0.6, hit ? lighten(color, 40) : color);
  grad.addColorStop(1, darken(color, 30));
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = ringColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, r + 3, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = darken(ringColor, 20);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, r + 6, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.beginPath();
  ctx.arc(x - r * 0.25, y - r * 0.25, r * 0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawFlipperOverlay(ctx: CanvasRenderingContext2D, body: Matter.Body, w: number, h: number) {
  ctx.save();
  ctx.translate(body.position.x, body.position.y);
  ctx.rotate(body.angle);

  const grad = ctx.createLinearGradient(-w / 2, -h / 2, -w / 2, h / 2);
  grad.addColorStop(0, "#E8E8E8");
  grad.addColorStop(0.3, "#C0C0C0");
  grad.addColorStop(0.7, "#A0A0A0");
  grad.addColorStop(1, "#808080");
  ctx.fillStyle = grad;

  const r = h / 2;
  ctx.beginPath();
  ctx.moveTo(-w / 2 + r, -h / 2);
  ctx.lineTo(w / 2 - r, -h / 2);
  ctx.arc(w / 2 - r, 0, r, -Math.PI / 2, Math.PI / 2);
  ctx.lineTo(-w / 2 + r, h / 2);
  ctx.arc(-w / 2 + r, 0, r, Math.PI / 2, -Math.PI / 2);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "#666";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.beginPath();
  ctx.moveTo(-w / 2 + r, -h / 2 + 2);
  ctx.lineTo(w / 2 - r, -h / 2 + 2);
  ctx.arc(w / 2 - r, 0, r - 2, -Math.PI / 2, 0);
  ctx.lineTo(w / 2 - 2, 0);
  ctx.lineTo(-w / 2 + r, 0);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawSlingOverlay(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(18, 15);
  ctx.lineTo(-18, 15);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = darken(color, 30);
  ctx.lineWidth = 2;
  ctx.stroke();

  const rubberColor = "#FF4444";
  ctx.strokeStyle = rubberColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-18, 15);
  ctx.lineTo(0, -20);
  ctx.lineTo(18, 15);
  ctx.stroke();

  ctx.restore();
}

function drawBall(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.save();
  const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
  grad.addColorStop(0, "#FFFFFF");
  grad.addColorStop(0.4, "#E0E0E0");
  grad.addColorStop(0.8, "#B0B0B0");
  grad.addColorStop(1, "#808080");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#999";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.beginPath();
  ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.25, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawWall(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.save();
  const grad = ctx.createLinearGradient(x - w / 2, y, x + w / 2, y);
  grad.addColorStop(0, darken(color, 20));
  grad.addColorStop(0.3, color);
  grad.addColorStop(0.7, lighten(color, 15));
  grad.addColorStop(1, darken(color, 10));
  ctx.fillStyle = grad;
  ctx.fillRect(x - w / 2, y - h / 2, w, h);

  ctx.fillStyle = "rgba(255,255,255,0.1)";
  ctx.fillRect(x - w / 2, y - h / 2, w, h / 3);
  ctx.restore();
}

function drawRamp(ctx: CanvasRenderingContext2D, points: { x: number; y: number }[], color: string, label: string) {
  if (points.length < 2) return;
  ctx.save();

  ctx.strokeStyle = darken(color, 30);
  ctx.lineWidth = 18;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();

  const grad = ctx.createLinearGradient(points[0].x, points[0].y, points[points.length - 1].x, points[points.length - 1].y);
  grad.addColorStop(0, lighten(color, 20));
  grad.addColorStop(0.5, color);
  grad.addColorStop(1, darken(color, 10));
  ctx.strokeStyle = grad;
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.globalAlpha = 0.5;
  ctx.fillStyle = "#FFD700";
  ctx.font = "bold 8px Arial";
  ctx.textAlign = "center";
  const mid = points[Math.floor(points.length / 2)];
  ctx.fillText(label, mid.x, mid.y - 12);

  ctx.beginPath();
  const last = points[points.length - 1];
  const prev = points[points.length - 2];
  const angle = Math.atan2(last.y - prev.y, last.x - prev.x);
  ctx.translate(last.x, last.y);
  ctx.rotate(angle);
  ctx.moveTo(0, 0);
  ctx.lineTo(-8, -5);
  ctx.moveTo(0, 0);
  ctx.lineTo(-8, 5);
  ctx.strokeStyle = "#FFD700";
  ctx.lineWidth = 2;
  ctx.setLineDash([]);
  ctx.stroke();

  ctx.restore();
}

function drawGuideRail(ctx: CanvasRenderingContext2D, x: number, y: number, len: number, angle: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  ctx.strokeStyle = color;
  ctx.lineWidth = 8;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-len / 2, 0);
  ctx.lineTo(len / 2, 0);
  ctx.stroke();

  ctx.strokeStyle = lighten(color, 30);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-len / 2, -2);
  ctx.lineTo(len / 2, -2);
  ctx.stroke();

  ctx.restore();
}

function drawPeg(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.save();
  const grad = ctx.createRadialGradient(x - 1, y - 1, 0, x, y, r);
  grad.addColorStop(0, "#FFFFFF");
  grad.addColorStop(0.5, "#C0C0C0");
  grad.addColorStop(1, "#666666");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawTarget(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, angle: number, color: string, lit: boolean) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  ctx.fillStyle = lit ? lighten(color, 40) : color;
  ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 1;
  ctx.strokeRect(-w / 2, -h / 2, w, h);

  if (lit) {
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.fillStyle = color;
    ctx.fillRect(-w / 2, -h / 2, w, h);
  }

  ctx.restore();
}

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
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
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
  const bumperHitsRef = useRef<Map<number, number>>(new Map());
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
    bumperHitsRef.current.clear();
    targetHitsRef.current.clear();
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !overlayCanvasRef.current) return;

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
        pixelRatio: 1,
      },
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    const invisible = { visible: false };
    const wallOpts = { isStatic: true, render: invisible, friction: 0.1 };

    const leftWall = Bodies.rectangle(10, H / 2, 20, H, wallOpts);
    const topWall = Bodies.rectangle(W / 2, 10, W, 20, wallOpts);
    const launchWall = Bodies.rectangle(W - 10, H / 2, 10, H, wallOpts);
    const launchSepTop = 200;
    const launchSepHeight = H - launchSepTop - 60;
    const launchSep = Bodies.rectangle(W - 55, launchSepTop + launchSepHeight / 2, 10, launchSepHeight, wallOpts);
    const rightWallBottom = Bodies.rectangle(W - 55, H - 20, 10, 40, wallOpts);

    const bottomSensor = Bodies.rectangle(W / 2 - 25, H + 10, W - 110, 20, {
      isStatic: true,
      isSensor: true,
      render: invisible,
      label: "drain",
    });

    const curveGuide1 = Bodies.rectangle(W - 60, 60, 50, 10, {
      isStatic: true, angle: Math.PI / 4, render: invisible, friction: 0, restitution: 0.5,
    });
    const curveGuide2 = Bodies.rectangle(W - 95, 40, 60, 10, {
      isStatic: true, angle: Math.PI / 8, render: invisible, friction: 0, restitution: 0.5,
    });
    const curveGuide3 = Bodies.rectangle(W - 75, 130, 80, 10, {
      isStatic: true, angle: Math.PI / 5, render: invisible, friction: 0, restitution: 0.3,
    });

    const guideLeftX = 65;
    const guideRightX = W - 110;
    const guideY = H - 190;
    const guideLen = 120;

    const leftGuide = Bodies.rectangle(guideLeftX, guideY, guideLen, 8, {
      isStatic: true, angle: Math.PI / 5, render: invisible, friction: 0, restitution: 0.3,
    });
    const rightGuide = Bodies.rectangle(guideRightX, guideY, guideLen, 8, {
      isStatic: true, angle: -Math.PI / 5, render: invisible, friction: 0, restitution: 0.3,
    });

    const targets = [
      Bodies.rectangle(35, 300, 8, 30, { isStatic: true, render: invisible, label: "target", restitution: 1.2 }),
      Bodies.rectangle(35, 350, 8, 30, { isStatic: true, render: invisible, label: "target", restitution: 1.2 }),
      Bodies.rectangle(35, 400, 8, 30, { isStatic: true, render: invisible, label: "target", restitution: 1.2 }),
      Bodies.rectangle(W - 75, 300, 8, 30, { isStatic: true, render: invisible, label: "target", restitution: 1.2 }),
      Bodies.rectangle(W - 75, 350, 8, 30, { isStatic: true, render: invisible, label: "target", restitution: 1.2 }),
      Bodies.rectangle(W - 75, 400, 8, 30, { isStatic: true, render: invisible, label: "target", restitution: 1.2 }),
    ];

    const rampLeftEntry = Bodies.circle(55, 580, 12, {
      isStatic: true, isSensor: true, render: invisible, label: "ramp_left",
    });
    const rampRightEntry = Bodies.circle(W - 100, 580, 12, {
      isStatic: true, isSensor: true, render: invisible, label: "ramp_right",
    });
    const rampCenterEntry = Bodies.circle(W / 2, 350, 12, {
      isStatic: true, isSensor: true, render: invisible, label: "ramp_center",
    });

    Composite.add(world, [
      leftWall, topWall, launchWall, launchSep, rightWallBottom,
      bottomSensor, leftGuide, rightGuide,
      curveGuide1, curveGuide2, curveGuide3,
      ...targets,
      rampLeftEntry, rampRightEntry, rampCenterEntry,
    ]);

    const bumperData = [
      { x: 130, y: 190, r: 24, color: "#FF2222", ring: "#FF6666" },
      { x: 260, y: 170, r: 24, color: "#2255FF", ring: "#6688FF" },
      { x: 190, y: 290, r: 28, color: "#22CC22", ring: "#66FF66" },
      { x: 95, y: 360, r: 20, color: "#FF8800", ring: "#FFAA44" },
      { x: 290, y: 340, r: 20, color: "#CC22CC", ring: "#FF66FF" },
    ];

    const bumpers = bumperData.map((bd, i) =>
      Bodies.circle(bd.x, bd.y, bd.r, {
        isStatic: true,
        restitution: 1.5,
        render: invisible,
        label: `bumper_${i}`,
      })
    );

    const pegPositions: { x: number; y: number }[] = [];
    const pegs: Matter.Body[] = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 6; col++) {
        const offset = row % 2 === 0 ? 0 : 22;
        const px = 60 + col * 52 + offset;
        const py = 440 + row * 38;
        if (px > 30 && px < W - 80) {
          pegPositions.push({ x: px, y: py });
          pegs.push(Bodies.circle(px, py, 5, {
            isStatic: true, restitution: 0.8, render: invisible, label: "peg",
          }));
        }
      }
    }

    const slingPositions = [
      { x: 58, y: H - 250, angle: 0.5 },
      { x: W - 100, y: H - 250, angle: -0.5 },
    ];
    const slings = slingPositions.map((sp) =>
      Bodies.polygon(sp.x, sp.y, 3, 25, {
        isStatic: true, restitution: 2.0, render: invisible, label: "sling", angle: sp.angle,
      })
    );

    Composite.add(world, [...bumpers, ...pegs, ...slings]);

    const flipperW = 90;
    const flipperH = 14;
    const flipperY = H - 85;
    const leftPivotX = 85;
    const rightPivotX = W - 130;

    const flipperOpts = {
      density: 0.02, friction: 0.1, restitution: 0.05, render: invisible,
      chamfer: { radius: 7 },
    };

    const leftFlipper = Bodies.rectangle(leftPivotX + flipperW / 2 - 15, flipperY, flipperW, flipperH,
      { ...flipperOpts, label: "leftFlipper" });
    const rightFlipper = Bodies.rectangle(rightPivotX - flipperW / 2 + 15, flipperY, flipperW, flipperH,
      { ...flipperOpts, label: "rightFlipper" });

    const leftPivot = Constraint.create({
      pointA: { x: leftPivotX, y: flipperY }, bodyB: leftFlipper,
      pointB: { x: -flipperW / 2 + 15, y: 0 }, length: 0, stiffness: 1,
    });
    const rightPivot = Constraint.create({
      pointA: { x: rightPivotX, y: flipperY }, bodyB: rightFlipper,
      pointB: { x: flipperW / 2 - 15, y: 0 }, length: 0, stiffness: 1,
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

    const createBall = () => Bodies.circle(W - 33, H - 100, 11, {
      restitution: 0.4, friction: 0.005, density: 0.004, render: invisible, label: "ball",
    });

    let ball = createBall();
    ballRef.current = ball;
    Composite.add(world, ball);

    const overlayCtx = overlayCanvasRef.current!.getContext("2d")!;
    drawPlayfieldArt(overlayCtx);

    Events.on(render, "afterRender", () => {
      const ctx = render.context;

      drawWall(ctx, 10, H / 2, 20, H, "#8B4513");
      drawWall(ctx, W - 10, H / 2, 10, H, "#8B4513");
      drawWall(ctx, W / 2, 10, W, 20, "#8B4513");
      drawWall(ctx, W - 55, launchSepTop + launchSepHeight / 2, 10, launchSepHeight, "#654321");
      drawWall(ctx, W - 55, H - 20, 10, 40, "#654321");

      drawGuideRail(ctx, W - 60, 60, 50, Math.PI / 4, "#8B6914");
      drawGuideRail(ctx, W - 95, 40, 60, Math.PI / 8, "#8B6914");
      drawGuideRail(ctx, W - 75, 130, 80, Math.PI / 5, "#8B6914");
      drawGuideRail(ctx, guideLeftX, guideY, guideLen, Math.PI / 5, "#AA3333");
      drawGuideRail(ctx, guideRightX, guideY, guideLen, -Math.PI / 5, "#3333AA");

      targets.forEach((t, i) => {
        const lit = targetHitsRef.current.has(i);
        const color = i < 3 ? "#FF4444" : "#4488FF";
        drawTarget(ctx, t.position.x, t.position.y, 8, 30, 0, color, lit);
      });

      bumperData.forEach((bd, i) => {
        const now = Date.now();
        const hitTime = bumperHitsRef.current.get(i) || 0;
        const isHit = now - hitTime < 150;
        drawBumperOverlay(ctx, bd.x, bd.y, bd.r, bd.color, bd.ring, isHit);
      });

      pegPositions.forEach((p) => drawPeg(ctx, p.x, p.y, 5));

      slingPositions.forEach((sp, i) => {
        const color = i === 0 ? "#CC3333" : "#3333CC";
        drawSlingOverlay(ctx, sp.x, sp.y, sp.angle, color);
      });

      drawFlipperOverlay(ctx, leftFlipper, flipperW, flipperH);
      drawFlipperOverlay(ctx, rightFlipper, flipperW, flipperH);

      ctx.save();
      ctx.fillStyle = "#666";
      ctx.beginPath();
      ctx.arc(leftPivotX, flipperY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#888";
      ctx.beginPath();
      ctx.arc(leftPivotX, flipperY, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#666";
      ctx.beginPath();
      ctx.arc(rightPivotX, flipperY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#888";
      ctx.beginPath();
      ctx.arc(rightPivotX, flipperY, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      drawBall(ctx, ball.position.x, ball.position.y, 11);

      ctx.save();
      ctx.fillStyle = "#333";
      ctx.fillRect(W - 53, H - 55, 44, 55);
      const springGrad = ctx.createLinearGradient(W - 48, H - 50, W - 48, H - 10);
      springGrad.addColorStop(0, "#888");
      springGrad.addColorStop(0.5, "#AAA");
      springGrad.addColorStop(1, "#666");
      ctx.fillStyle = springGrad;
      for (let sy = H - 50; sy < H - 10; sy += 6) {
        ctx.fillRect(W - 45, sy, 30, 3);
      }
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

      const speed = Vector.magnitude(ball.velocity);
      if (speed > 15) {
        const scale = 15 / speed;
        Body.setVelocity(ball, { x: ball.velocity.x * scale, y: ball.velocity.y * scale });
      }
    });

    Events.on(engine, "collisionStart", (event: any) => {
      event.pairs.forEach((pair: any) => {
        const labels = [pair.bodyA.label, pair.bodyB.label];

        const bumperLabel = labels.find((l: string) => l.startsWith("bumper_"));
        if (bumperLabel) {
          const idx = parseInt(bumperLabel.split("_")[1]);
          bumperHitsRef.current.set(idx, Date.now());
          const pts = 100 * multiplierRef.current;
          scoreRef.current += pts;
          setScore(scoreRef.current);
        }

        if (labels.includes("target")) {
          const targetBody = pair.bodyA.label === "target" ? pair.bodyA : pair.bodyB;
          const tIdx = targets.indexOf(targetBody);
          if (tIdx >= 0 && !targetHitsRef.current.has(tIdx)) {
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

        const rampLabel = labels.find((l: string) => l.startsWith("ramp_"));
        if (rampLabel) {
          const pts = 500 * multiplierRef.current;
          scoreRef.current += pts;
          setScore(scoreRef.current);
        }

        if (labels.includes("sling")) {
          const pts = 50 * multiplierRef.current;
          scoreRef.current += pts;
          setScore(scoreRef.current);
        }

        if (labels.includes("peg")) {
          const pts = 10 * multiplierRef.current;
          scoreRef.current += pts;
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
            setTimeout(() => { if (finalScore > 0) saveScore(finalScore); }, 500);
          } else {
            ball = createBall();
            ballRef.current = ball;
            Composite.add(world, ball);
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
        Body.setVelocity(ball, { x: -2, y: -20 });
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
      const newBall = Matter.Bodies.circle(W - 33, H - 100, 11, {
        restitution: 0.4, friction: 0.005, density: 0.004,
        render: { visible: false }, label: "ball",
      });
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
                    textShadow: "none",
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
                    ref={overlayCanvasRef}
                    width={W}
                    height={H}
                    className="absolute inset-0 pointer-events-none"
                    style={{ zIndex: 0 }}
                  />
                  <canvas
                    ref={canvasRef}
                    width={W}
                    height={H}
                    className="relative"
                    style={{ zIndex: 1 }}
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
                    <div className="absolute bottom-6 left-0 right-0 text-center z-10">
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

                <div className="flex justify-center gap-6 px-4 py-2 border-t border-yellow-900/30"
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
                    <span className="text-yellow-700 text-[9px] uppercase block">Ramp</span>
                    <span className="text-yellow-500 text-[10px] font-bold">500</span>
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
