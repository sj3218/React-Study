import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, RotateCcw, Trophy, XCircle, PauseCircle, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Game Constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 15;
const BALL_RADIUS = 8;
const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_PADDING = 10;
const BRICK_OFFSET_TOP = 60;
const BRICK_OFFSET_LEFT = 35;
const BRICK_HEIGHT = 25;
const BRICK_WIDTH = (CANVAS_WIDTH - (BRICK_OFFSET_LEFT * 2) - ((BRICK_COLS - 1) * BRICK_PADDING)) / BRICK_COLS;

type GameStatus = 'START' | 'PLAYING' | 'PAUSED' | 'GAMEOVER' | 'WON';

interface Brick {
  x: number;
  y: number;
  status: number;
  color: string;
}

export default function BrickBreakerPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<GameStatus>('START');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Game State Refs (avoiding state re-renders for game loop)
  const paddleRef = useRef({ x: (CANVAS_WIDTH - PADDLE_WIDTH) / 2 });
  const ballRef = useRef({
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT - 30,
    dx: 4,
    dy: -4,
  });
  const bricksRef = useRef<Brick[]>([]);

  // Initialize Bricks
  const initBricks = useCallback(() => {
    const bricks: Brick[] = [];
    const colors = ['#FB7185', '#FB923C', '#FACC15', '#4ADE80', '#3b82f6'];
    for (let c = 0; c < BRICK_COLS; c++) {
      for (let r = 0; r < BRICK_ROWS; r++) {
        bricks.push({
          x: c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT,
          y: r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP,
          status: 1,
          color: colors[r % colors.length],
        });
      }
    }
    bricksRef.current = bricks;
  }, []);

  const resetGame = () => {
    paddleRef.current.x = (CANVAS_WIDTH - PADDLE_WIDTH) / 2;
    ballRef.current = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - 30,
      dx: 4 * (Math.random() > 0.5 ? 1 : -1),
      dy: -4,
    };
    initBricks();
    setScore(0);
    setStatus('PLAYING');
  };

  useEffect(() => {
    initBricks();
    const savedHighScore = localStorage.getItem('brickBreakerHighScore');
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
  }, [initBricks]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('brickBreakerHighScore', score.toString());
    }
  }, [score, highScore]);

  // Input Handling
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const root = document.documentElement;
      const mouseX = e.clientX - rect.left - root.scrollLeft;
      
      let nextX = mouseX - PADDLE_WIDTH / 2;
      if (nextX < 0) nextX = 0;
      if (nextX > CANVAS_WIDTH - PADDLE_WIDTH) nextX = CANVAS_WIDTH - PADDLE_WIDTH;
      paddleRef.current.x = nextX;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        setStatus(prev => prev === 'PLAYING' ? 'PAUSED' : prev === 'PAUSED' ? 'PLAYING' : prev);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [status]);

  // Main Game Loop
  useEffect(() => {
    if (status !== 'PLAYING') return;

    let animationFrameId: number;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    const draw = () => {
      if (!ctx || !canvas) return;

      // Clear Canvas
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw Background (Geometric Balance design)
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= CANVAS_WIDTH; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y <= CANVAS_HEIGHT; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
      }

      // Draw Bricks
      bricksRef.current.forEach(brick => {
        if (brick.status === 1) {
          ctx.beginPath();
          ctx.rect(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT);
          ctx.fillStyle = brick.color;
          ctx.fill();
          // Subtle shadow instead of glow for "Geometric Balance"
          ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
          ctx.fillRect(brick.x, brick.y + BRICK_HEIGHT - 4, BRICK_WIDTH, 4);
          ctx.closePath();
        }
      });

      // Draw Paddle
      ctx.beginPath();
      ctx.roundRect(paddleRef.current.x, CANVAS_HEIGHT - PADDLE_HEIGHT - 10, PADDLE_WIDTH, PADDLE_HEIGHT, 10);
      ctx.fillStyle = '#38BDF8';
      ctx.fill();
      ctx.closePath();

      // Draw Ball
      ctx.beginPath();
      ctx.arc(ballRef.current.x, ballRef.current.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
      ctx.closePath();
      ctx.shadowBlur = 0;

      // Collision Detection: Walls
      if (ballRef.current.x + ballRef.current.dx > CANVAS_WIDTH - BALL_RADIUS || ballRef.current.x + ballRef.current.dx < BALL_RADIUS) {
        ballRef.current.dx = -ballRef.current.dx;
      }
      if (ballRef.current.y + ballRef.current.dy < BALL_RADIUS) {
        ballRef.current.dy = -ballRef.current.dy;
      } else if (ballRef.current.y + ballRef.current.dy > CANVAS_HEIGHT - BALL_RADIUS - 10) {
        // Collision Detection: Paddle
        if (ballRef.current.x > paddleRef.current.x && ballRef.current.x < paddleRef.current.x + PADDLE_WIDTH) {
          ballRef.current.dy = -ballRef.current.dy;
          // Add some spin based on where it hit the paddle
          const hitPoint = (ballRef.current.x - (paddleRef.current.x + PADDLE_WIDTH / 2)) / (PADDLE_WIDTH / 2);
          ballRef.current.dx = hitPoint * 5;
        } else if (ballRef.current.y + ballRef.current.dy > CANVAS_HEIGHT - BALL_RADIUS) {
          setStatus('GAMEOVER');
          return;
        }
      }

      // Collision Detection: Bricks
      let remainingBricks = 0;
      bricksRef.current.forEach(brick => {
        if (brick.status === 1) {
          remainingBricks++;
          if (
            ballRef.current.x > brick.x &&
            ballRef.current.x < brick.x + BRICK_WIDTH &&
            ballRef.current.y > brick.y &&
            ballRef.current.y < brick.y + BRICK_HEIGHT
          ) {
            ballRef.current.dy = -ballRef.current.dy;
            brick.status = 0;
            setScore(s => s + 10);
          }
        }
      });

      if (remainingBricks === 0) {
        setStatus('WON');
        return;
      }

      // Move Ball
      ballRef.current.x += ballRef.current.dx;
      ballRef.current.y += ballRef.current.dy;

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationFrameId);
  }, [status]);

  return (
    <div className="min-h-screen w-full bg-game-bg text-game-text flex items-center justify-center font-sans">
      <div className="grid grid-cols-[240px_1fr_240px] gap-5 px-5 max-w-[1400px] w-full h-[700px]">
        {/* Left Sidebar: Stats */}
        <aside className="flex flex-col gap-5 h-full">
          <div className="bg-game-card border border-white/5 p-5 rounded-xl shadow-sm">
            <div className="text-[10px] uppercase tracking-widest text-game-muted mb-1">Current Score</div>
            <div className="font-mono text-2xl font-bold text-game-accent">
              {score.toLocaleString('en-US', { minimumIntegerDigits: 5, useGrouping: true })}
            </div>
          </div>
          <div className="bg-game-card border border-white/5 p-5 rounded-xl shadow-sm">
            <div className="text-[10px] uppercase tracking-widest text-game-muted mb-1">High Score</div>
            <div className="font-mono text-2xl font-bold text-game-muted">
              {highScore.toLocaleString('en-US', { minimumIntegerDigits: 5, useGrouping: true })}
            </div>
          </div>
          <div className="bg-game-card border border-white/5 p-5 rounded-xl shadow-sm">
            <div className="text-[10px] uppercase tracking-widest text-game-muted mb-2">Lives</div>
            <div className="flex gap-2">
              {[1, 2, 3].map((life) => (
                <svg key={life} width="20" height="20" viewBox="0 0 24 24" fill={life <= 2 ? "#FB7185" : "rgba(255,255,255,0.1)"}>
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              ))}
            </div>
          </div>
          <div className="bg-game-card border border-white/5 p-5 rounded-xl shadow-sm">
            <div className="text-[10px] uppercase tracking-widest text-game-muted mb-1">Stage</div>
            <div className="font-mono text-2xl font-bold text-game-accent">01 / 20</div>
          </div>
        </aside>

        {/* Game Viewport */}
        <main className="relative bg-viewport border-2 border-game-card rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="cursor-none max-w-full max-h-full object-contain"
            id="game-canvas"
          />

          {/* Overlays */}
          <AnimatePresence>
            {status === 'START' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-game-bg/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 z-10"
              >
                <div className="w-20 h-20 bg-game-accent/20 rounded-full flex items-center justify-center mx-auto border border-game-accent/50 mb-6">
                  <Play className="w-10 h-10 text-game-accent fill-current ml-1" />
                </div>
                <h2 className="text-3xl font-bold mb-2 tracking-tight">READY TO BREAK?</h2>
                <p className="text-game-muted max-w-sm mb-8 text-sm">Use your mouse to control the paddle. Clear all bricks to win.</p>
                <button
                  onClick={() => setStatus('PLAYING')}
                  className="px-10 py-4 bg-game-accent text-game-bg transition-all rounded-lg font-bold text-sm tracking-widest uppercase hover:brightness-110 active:scale-95 shadow-lg shadow-game-accent/20"
                >
                  Start Mission
                </button>
              </motion.div>
            )}

            {status === 'PAUSED' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-game-bg/60 backdrop-blur-xs flex flex-col items-center justify-center z-10"
              >
                <div className="bg-game-card p-8 rounded-2xl border border-white/10 shadow-2xl flex flex-col items-center">
                  <PauseCircle className="w-16 h-16 text-game-accent mb-4" />
                  <h2 className="text-2xl font-bold mb-6 italic tracking-tight uppercase">Paused</h2>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setStatus('PLAYING')}
                      className="flex items-center gap-2 px-6 py-3 bg-game-accent text-game-bg rounded-lg font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all"
                    >
                      <PlayCircle className="w-5 h-5" /> Resume
                    </button>
                    <button
                      onClick={resetGame}
                      className="flex items-center gap-2 px-6 py-3 border border-slate-700 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all text-game-muted"
                    >
                      <RotateCcw className="w-5 h-5" /> Restart
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {status === 'GAMEOVER' && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute inset-0 bg-red-950/40 backdrop-blur-md flex flex-col items-center justify-center z-10"
              >
                <XCircle className="w-20 h-20 text-red-500 mb-4" />
                <h2 className="text-5xl font-black uppercase tracking-tighter text-red-100 mb-2">Game Over</h2>
                <p className="text-xl font-mono text-red-200 mb-8">SCORE: {score.toLocaleString()}</p>
                <button
                  onClick={resetGame}
                  className="px-12 py-5 bg-white text-black rounded-lg font-black text-lg uppercase tracking-widest hover:scale-105 transition-transform"
                >
                  Try Again
                </button>
              </motion.div>
            )}

            {status === 'WON' && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute inset-0 bg-game-accent/20 backdrop-blur-md flex flex-col items-center justify-center z-10"
              >
                <Trophy className="w-24 h-24 text-yellow-500 mb-4 animate-bounce" />
                <h2 className="text-6xl font-black uppercase tracking-tighter text-white mb-2">Victory</h2>
                <p className="text-3xl font-mono text-yellow-400 font-bold mb-8">SCORE: {score.toLocaleString()}</p>
                <button
                  onClick={resetGame}
                  className="px-12 py-5 bg-game-accent text-game-bg rounded-lg font-black text-lg uppercase tracking-widest transition-all hover:scale-105"
                >
                  Next Wave
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Right Sidebar: Controls */}
        <aside className="flex flex-col gap-5 h-full">
          <div className="bg-game-card border border-white/5 p-5 rounded-xl shadow-sm flex-1">
            <h1 className="text-xl font-bold uppercase tracking-[0.15em] text-center mb-6 py-2 border-b border-white/5">
              Brick Breaker
            </h1>
            
            <div className="text-[10px] uppercase font-bold tracking-widest text-game-muted mb-4">How to Play</div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-slate-700 px-2 py-1 rounded border-b-2 border-slate-900 font-mono text-xs">MOUSE</div>
                <div className="text-[10px] uppercase font-bold text-game-muted">Movement</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-slate-700 px-2 py-1 rounded border-b-2 border-slate-900 font-mono text-xs">P / ESC</div>
                <div className="text-[10px] uppercase font-bold text-game-muted">Pause Game</div>
              </div>
            </div>

            <div className="mt-10">
              <div className="text-[10px] uppercase font-bold tracking-widest text-game-muted mb-3 border-b border-white/5 pb-1">Status</div>
              <div className="text-xs text-game-muted leading-relaxed space-y-1">
                <p>• Engine Stabilized</p>
                <p>• Power Levels 100%</p>
                <p>• Grid Online</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setStatus(s => s === 'PLAYING' ? 'PAUSED' : s === 'PAUSED' ? 'PLAYING' : s)}
            className="w-full bg-game-accent text-game-bg py-4 rounded-lg font-bold text-sm uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all"
          >
            {status === 'PAUSED' ? 'Resume Game' : 'Pause Game'}
          </button>
        </aside>
      </div>
    </div>
  );
}
