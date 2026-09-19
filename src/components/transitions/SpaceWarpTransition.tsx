import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SpaceWarpTransitionProps {
  isTransitioning: boolean;
  onTransitionMiddle?: () => void;
  direction?: 'forward' | 'backward';
}

export const SpaceWarpTransition: React.FC<SpaceWarpTransitionProps> = ({
  isTransitioning,
  direction = 'forward',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isTransitioning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle streaks for space travel warp
    interface WarpParticle {
      angle: number;
      dist: number;
      speed: number;
      length: number;
      size: number;
      color: string;
      alpha: number;
    }

    const colors = ['#ffffff', '#38bdf8', '#00f0ff', '#818cf8', '#bae6fd'];
    const particleCount = window.innerWidth < 768 ? 90 : 180;
    const particles: WarpParticle[] = Array.from({ length: particleCount }, () => {
      const angle = Math.random() * Math.PI * 2;
      return {
        angle,
        dist: Math.random() * 120 + 20,
        speed: 15 + Math.random() * 25,
        length: 20 + Math.random() * 60,
        size: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.2 + Math.random() * 0.8,
      };
    });

    const startTime = performance.now();
    const duration = 850; // ms total transition

    const render = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(1, elapsed / duration);

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Draw Hyperspace particle streaks
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Accelerate particles outward from center
        const accel = 1 + progress * 4.5;
        p.dist += p.speed * accel * (direction === 'forward' ? 1 : -0.7);

        const x1 = cx + Math.cos(p.angle) * p.dist;
        const y1 = cy + Math.sin(p.angle) * p.dist;
        const streakLen = p.length * (1 + progress * 3);
        const x2 = cx + Math.cos(p.angle) * (p.dist + streakLen);
        const y2 = cy + Math.sin(p.angle) * (p.dist + streakLen);

        // Alpha peaks mid-warp then fades
        const currentAlpha = Math.sin(progress * Math.PI) * p.alpha;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size * (1 + progress);
        ctx.globalAlpha = Math.max(0, Math.min(1, currentAlpha));
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 8;
        ctx.stroke();
      }

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      if (progress < 1) {
        animIdRef.current = requestAnimationFrame(render);
      }
    };

    animIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [isTransitioning, direction]);

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          key="space-warp-transition-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden"
        >
          {/* 1. Backdrop dark space fog */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.75, 0.85, 0] }}
            transition={{ duration: 0.85, times: [0, 0.3, 0.6, 1], ease: 'easeInOut' }}
            className="absolute inset-0 bg-[#03060f]/80 backdrop-blur-md"
          />

          {/* 2. Fast particle streak canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
          />

          {/* 3. Concentric Expanding Orbital Rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            {/* Ring 1: High speed expanding shockwave */}
            <motion.div
              initial={{ scale: 0.1, opacity: 0.9, rotate: 0 }}
              animate={{ scale: [0.1, 2.5, 5], opacity: [0.9, 0.7, 0], rotate: 180 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute w-72 h-72 rounded-full border border-cyan-400/80 shadow-[0_0_30px_rgba(6,182,212,0.8)]"
              style={{ borderStyle: 'dashed', borderWidth: '2px' }}
            />

            {/* Ring 2: Counter-rotating secondary ring */}
            <motion.div
              initial={{ scale: 0.2, opacity: 0.7, rotate: 0 }}
              animate={{ scale: [0.2, 2.8, 6], opacity: [0.7, 0.5, 0], rotate: -220 }}
              transition={{ duration: 0.85, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="absolute w-84 h-84 rounded-full border border-sky-300/60 shadow-[0_0_25px_rgba(56,189,248,0.6)]"
              style={{ borderWidth: '1.5px' }}
            />

            {/* Ring 3: Broad outer cosmic pulse */}
            <motion.div
              initial={{ scale: 0.3, opacity: 0.5 }}
              animate={{ scale: [0.3, 3.2, 7], opacity: [0.5, 0.3, 0] }}
              transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
              className="absolute w-96 h-96 rounded-full border border-blue-400/40 shadow-[0_0_40px_rgba(99,102,241,0.4)]"
            />
          </div>

          {/* 4. Central Black-Hole Gravitational Distortion Lens */}
          <div className="relative z-30 flex items-center justify-center">
            {/* Photon Ring Glow */}
            <motion.div
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{
                scale: [0.2, 1.4, 0.4],
                opacity: [0, 0.95, 0],
              }}
              transition={{ duration: 0.8, times: [0, 0.45, 1], ease: 'easeInOut' }}
              className="w-48 h-48 rounded-full bg-radial from-white via-cyan-400/80 to-transparent blur-xl"
            />

            {/* Event Horizon Shadow (Black Hole Center) */}
            <motion.div
              initial={{ scale: 0.1, opacity: 0 }}
              animate={{
                scale: [0.1, 1.15, 0.2],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 0.8, times: [0, 0.45, 1], ease: 'easeInOut' }}
              className="absolute w-28 h-28 rounded-full bg-[#000000] border border-cyan-400/90 shadow-[0_0_25px_rgba(6,182,212,0.9)]"
            />
          </div>

          {/* 5. Minimal Sci-Fi Telemetry HUD Pulse */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: [0, 1, 0], scale: [0.9, 1.05, 1.15] }}
            transition={{ duration: 0.7, times: [0, 0.4, 1] }}
            className="absolute z-40 bottom-12 font-mono text-xs text-cyan-300 tracking-[0.25em] uppercase px-4 py-1.5 rounded-full bg-black/60 border border-cyan-500/40 shadow-lg backdrop-blur-md"
          >
            SPACETIME WARP // {direction === 'forward' ? 'VECTOR VECTOR +1' : 'VECTOR -1'}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
