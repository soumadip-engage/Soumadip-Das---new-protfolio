import React, { useEffect, useRef } from 'react';

interface PixelCanvasProps {
  gap?: number;
  speed?: number;
  colors?: string[];
  noFocus?: boolean;
}

export const PixelCanvas: React.FC<PixelCanvasProps> = ({
  gap = 10,
  colors = ['#00f0ff', '#38bdf8', '#0284c7', '#818cf8', '#ffffff'],
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 300);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 200);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const mouse = { x: -1000, y: -1000, radius: 90 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    interface Pixel {
      x: number;
      y: number;
      size: number;
      baseAlpha: number;
      currentAlpha: number;
      color: string;
      phase: number;
    }

    const pixels: Pixel[] = [];
    const cols = Math.floor(width / gap);
    const rows = Math.floor(height / gap);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        pixels.push({
          x: i * gap + gap / 2,
          y: j * gap + gap / 2,
          size: 1.5,
          baseAlpha: 0.08 + Math.random() * 0.15,
          currentAlpha: 0.1,
          color,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    let time = 0;
    const render = () => {
      time += 0.03;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < pixels.length; i++) {
        const p = pixels[i];
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Proximity flare
        let targetAlpha = p.baseAlpha + Math.sin(time + p.phase) * 0.08;
        if (dist < mouse.radius) {
          const power = 1 - dist / mouse.radius;
          targetAlpha = Math.max(targetAlpha, 0.4 + power * 0.6);
        }

        p.currentAlpha += (targetAlpha - p.currentAlpha) * 0.12;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.min(1, Math.max(0, p.currentAlpha));
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [gap, colors]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
