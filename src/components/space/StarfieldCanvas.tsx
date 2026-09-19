import React, { useEffect, useRef } from 'react';

interface StarfieldCanvasProps {
  className?: string;
  speedMultiplier?: number;
  starCount?: number;
  interactive?: boolean;
}

interface Star {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  layer: number; // 0 = far, 1 = mid, 2 = near
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  alpha: number;
  active: boolean;
}

export const StarfieldCanvas: React.FC<StarfieldCanvasProps> = ({
  className = '',
  speedMultiplier = 0.6,
  starCount = 140,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const stars: Star[] = [];
    const shootingStars: ShootingStar[] = [];
    let lastShootingStarTime = 0;

    const colors = [
      '#ffffff',
      '#e0f2fe', // sky-100
      '#bae6fd', // sky-200
      '#38bdf8', // sky-400 (Cosmic Cyan)
      '#7dd3fc', // sky-300
      '#c4b5fd', // violet-300 (Cosmic Lavender)
    ];

    const initStars = (w: number, h: number) => {
      stars.length = 0;
      const count = Math.floor((w * h) / 7500) || starCount;

      for (let i = 0; i < count; i++) {
        const layer = Math.random() < 0.6 ? 0 : Math.random() < 0.85 ? 1 : 2;
        const size = layer === 0 ? Math.random() * 1.2 + 0.5 : layer === 1 ? Math.random() * 1.6 + 1.0 : Math.random() * 2.2 + 1.5;
        const baseAlpha = layer === 0 ? Math.random() * 0.4 + 0.2 : layer === 1 ? Math.random() * 0.5 + 0.4 : Math.random() * 0.4 + 0.6;

        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size,
          baseAlpha,
          alpha: baseAlpha,
          twinkleSpeed: Math.random() * 0.03 + 0.008,
          twinklePhase: Math.random() * Math.PI * 2,
          layer,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);

      initStars(width, height);
    };

    handleResize();

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(canvas);

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 30;
      mouseRef.current.targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 30;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Spawn a shooting star
    const maybeSpawnShootingStar = (now: number) => {
      if (now - lastShootingStarTime > 4000 && Math.random() < 0.35) {
        lastShootingStarTime = now;
        const startX = Math.random() * width * 0.8;
        const startY = Math.random() * (height * 0.4);
        const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.3;
        const speed = Math.random() * 9 + 12;

        shootingStars.push({
          x: startX,
          y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          length: Math.random() * 110 + 70,
          alpha: 1,
          active: true,
        });
      }
    };

    let prevTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - prevTime) / 1000, 0.1);
      prevTime = now;

      // Mouse parallax smooth interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Draw background stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Twinkle
        star.twinklePhase += star.twinkleSpeed;
        star.alpha = star.baseAlpha + Math.sin(star.twinklePhase) * 0.28;
        if (star.alpha < 0.08) star.alpha = 0.08;
        if (star.alpha > 1) star.alpha = 1;

        // Parallax drift based on layer
        const parallaxFactor = (star.layer + 1) * 0.4;
        const renderX = (star.x + mouseRef.current.x * parallaxFactor + width) % width;
        const renderY = (star.y + mouseRef.current.y * parallaxFactor + height) % height;

        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(renderX, renderY, star.size, 0, Math.PI * 2);
        ctx.fill();

        // If bright star in layer 2, add subtle cross flare / halo
        if (star.layer === 2 && star.alpha > 0.65) {
          ctx.strokeStyle = star.color;
          ctx.lineWidth = 0.5;
          ctx.globalAlpha = star.alpha * 0.35;
          const flareLen = star.size * 2.8;

          ctx.beginPath();
          ctx.moveTo(renderX - flareLen, renderY);
          ctx.lineTo(renderX + flareLen, renderY);
          ctx.moveTo(renderX, renderY - flareLen);
          ctx.lineTo(renderX, renderY + flareLen);
          ctx.stroke();
        }
      }

      // Handle shooting stars
      maybeSpawnShootingStar(now);

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        if (!ss.active) {
          shootingStars.splice(i, 1);
          continue;
        }

        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.alpha -= dt * 0.85;

        if (ss.alpha <= 0 || ss.x > width + 100 || ss.y > height + 100) {
          ss.active = false;
          continue;
        }

        const angle = Math.atan2(ss.vy, ss.vx);
        const tailX = ss.x - Math.cos(angle) * ss.length;
        const tailY = ss.y - Math.sin(angle) * ss.length;

        const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        grad.addColorStop(0, 'rgba(56, 189, 248, 0)');
        grad.addColorStop(0.7, `rgba(56, 189, 248, ${ss.alpha * 0.6})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${ss.alpha})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.globalAlpha = ss.alpha;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.stroke();

        // Bright tip glow
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [interactive, speedMultiplier, starCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none w-full h-full ${className}`}
      aria-hidden="true"
    />
  );
};
