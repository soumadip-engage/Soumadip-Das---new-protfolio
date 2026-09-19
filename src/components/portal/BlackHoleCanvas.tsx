import React, { useRef, useEffect, useState, useCallback } from 'react';

interface BlackHoleCanvasProps {
  warpActive?: boolean; // When true, triggers warp speed dimension shift
  onWarpComplete?: () => void;
  interactive?: boolean;
}

export const BlackHoleCanvas: React.FC<BlackHoleCanvasProps> = ({
  warpActive = false,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Dynamic physics states
  const physicsRef = useRef({
    spinSpeed: 0.015,
    targetSpinSpeed: 0.015,
    angle: 0,
    zoom: 1,
    warpProgress: 0,
    ripples: [] as Array<{ radius: number; maxRadius: number; alpha: number; speed: number; color: string }>,
    jets: [] as Array<{ y: number; speed: number; length: number; alpha: number }>,
    shockwaveAlpha: 0,
    pointerX: 0,
    pointerY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    currentMouseX: 0,
    currentMouseY: 0,
    isDragging: false,
    lastMouseX: 0,
  });

  // Trigger gravitational wave burst on click
  const triggerGravitationalBurst = useCallback((clientX?: number, clientY?: number) => {
    const p = physicsRef.current;
    p.targetSpinSpeed = Math.min(0.09, p.targetSpinSpeed + 0.02);

    // Add gravitational wave ripple
    p.ripples.push({
      radius: 45,
      maxRadius: Math.max(window.innerWidth, window.innerHeight) * 0.85,
      alpha: 0.95,
      speed: 7 + Math.random() * 5,
      color: p.ripples.length % 2 === 0 ? 'rgba(6, 182, 212, ' : 'rgba(56, 189, 248, ',
    });

    // Add relativistic jet pulses
    for (let i = 0; i < 4; i++) {
      p.jets.push({
        y: (Math.random() - 0.5) * 60,
        speed: 9 + Math.random() * 9,
        length: 90 + Math.random() * 130,
        alpha: 0.95,
      });
    }

    // Flash slight shockwave
    p.shockwaveAlpha = Math.min(1, p.shockwaveAlpha + 0.4);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse Move for Parallax
    const handleWindowMouseMove = (e: MouseEvent) => {
      const p = physicsRef.current;
      p.targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      p.targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleWindowMouseMove);

    // Stars generation with depth for 3D parallax
    interface Star {
      x: number;
      y: number;
      z: number; // 0.1 to 1 depth factor
      size: number;
      alpha: number;
      baseAlpha: number;
      flickerSpeed: number;
      color: string;
      dist: number;
      angle: number;
    }

    const starColors = ['#e0f2fe', '#bae6fd', '#7dd3fc', '#ffffff', '#c4b5fd', '#fef08a'];
    const stars: Star[] = Array.from({ length: 320 }, () => {
      const x = (Math.random() - 0.5) * width * 1.6;
      const y = (Math.random() - 0.5) * height * 1.6;
      const z = 0.2 + Math.random() * 0.8;
      const dist = Math.sqrt(x * x + y * y);
      const angle = Math.atan2(y, x);
      const baseAlpha = 0.15 + Math.random() * 0.75;
      return {
        x,
        y,
        z,
        size: (Math.random() * 1.8 + 0.5) * z,
        alpha: baseAlpha,
        baseAlpha,
        flickerSpeed: 0.02 + Math.random() * 0.05,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        dist,
        angle,
      };
    });

    // Multiple concentric orbital rings rotating at different speeds & directions
    interface OrbitalRing {
      radiusRatio: number;
      tiltX: number;
      tiltY: number;
      angle: number;
      speed: number;
      width: number;
      alpha: number;
      dash: number[];
      color: string;
      hasNode?: boolean;
      nodeAngle: number;
    }

    const orbitalRings: OrbitalRing[] = [
      { radiusRatio: 1.45, tiltX: 0.28, tiltY: 0.88, angle: 0, speed: 0.012, width: 1.5, alpha: 0.55, dash: [8, 12], color: '#38bdf8', hasNode: true, nodeAngle: 0.4 },
      { radiusRatio: 1.95, tiltX: -0.22, tiltY: 0.78, angle: Math.PI / 4, speed: -0.008, width: 1.2, alpha: 0.45, dash: [14, 18], color: '#06b6d4', hasNode: true, nodeAngle: 2.1 },
      { radiusRatio: 2.55, tiltX: 0.35, tiltY: 0.72, angle: Math.PI / 2, speed: 0.006, width: 1.0, alpha: 0.35, dash: [4, 8], color: '#818cf8', hasNode: false, nodeAngle: 0 },
      { radiusRatio: 3.25, tiltX: -0.15, tiltY: 0.82, angle: Math.PI * 0.8, speed: -0.004, width: 1.2, alpha: 0.28, dash: [20, 24], color: '#38bdf8', hasNode: true, nodeAngle: 4.2 },
      { radiusRatio: 4.10, tiltX: 0.18, tiltY: 0.75, angle: Math.PI * 1.2, speed: 0.003, width: 0.8, alpha: 0.2, dash: [10, 16], color: '#67e8f9', hasNode: false, nodeAngle: 0 },
      { radiusRatio: 5.20, tiltX: -0.28, tiltY: 0.70, angle: Math.PI * 1.5, speed: -0.002, width: 0.9, alpha: 0.15, dash: [6, 14], color: '#a5b4fc', hasNode: false, nodeAngle: 0 },
    ];

    // Accretion disk particles + inflow particles (spiraling inward)
    interface AccretionParticle {
      radius: number;
      angle: number;
      speed: number;
      size: number;
      alpha: number;
      hue: number;
      verticalOffset: number;
      inflowRate: number; // rate of spiral toward center
      burstVx?: number;
      burstVy?: number;
    }

    const diskParticles: AccretionParticle[] = Array.from({ length: 360 }, () => {
      const radius = 65 + Math.random() * 260;
      return {
        radius,
        angle: Math.random() * Math.PI * 2,
        // Keplerian velocity: v proportional to 1/sqrt(r)
        speed: (0.02 + Math.random() * 0.015) * Math.sqrt(150 / radius),
        size: Math.random() * 2.4 + 0.6,
        alpha: 0.35 + Math.random() * 0.65,
        hue: radius < 110 ? 190 : radius < 170 ? 196 : radius < 230 ? 210 : 230,
        verticalOffset: (Math.random() - 0.5) * 14,
        inflowRate: 0.04 + Math.random() * 0.08,
      };
    });

    // Curved gravitational light rays
    interface LightRay {
      baseAngle: number;
      currentAngle: number;
      speed: number;
      arcLength: number;
      radiusRatio: number;
      alpha: number;
      width: number;
    }

    const lightRays: LightRay[] = Array.from({ length: 8 }, (_, i) => ({
      baseAngle: (i / 8) * Math.PI * 2,
      currentAngle: (i / 8) * Math.PI * 2,
      speed: (0.008 + (i % 3) * 0.004) * (i % 2 === 0 ? 1 : -1),
      arcLength: 0.8 + Math.random() * 1.2,
      radiusRatio: 1.12 + (i % 4) * 0.18,
      alpha: 0.3 + Math.random() * 0.4,
      width: 2 + Math.random() * 3,
    }));

    let lastTime = performance.now();

    // Render loop
    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const p = physicsRef.current;

      // Smooth mouse parallax damping
      p.currentMouseX += (p.targetMouseX - p.currentMouseX) * 0.05;
      p.currentMouseY += (p.targetMouseY - p.currentMouseY) * 0.05;

      const parallaxOffsetX = p.currentMouseX * 35;
      const parallaxOffsetY = p.currentMouseY * 25;

      // Handle Warp Animation Progression (When user clicks ENTER / EXPLORE)
      if (warpActive) {
        p.warpProgress = Math.min(1, p.warpProgress + dt * 0.72);
        p.spinSpeed += dt * 0.6;
        p.zoom += dt * 14 * (1 + p.warpProgress * 5);
      } else {
        // Natural physics easing
        p.spinSpeed += (p.targetSpinSpeed - p.spinSpeed) * 0.05;
        p.targetSpinSpeed += (0.015 - p.targetSpinSpeed) * 0.015;
        p.zoom += (1 - p.zoom) * 0.05;
        p.shockwaveAlpha *= 0.94;
      }

      p.angle += p.spinSpeed;

      const cx = width / 2 + parallaxOffsetX * 0.3;
      const cy = height / 2 + parallaxOffsetY * 0.3;

      // Deep space void clear
      ctx.fillStyle = '#03060f';
      ctx.fillRect(0, 0, width, height);

      // Distant cosmic background glow
      const bgGrad = ctx.createRadialGradient(cx, cy, 40, cx, cy, Math.max(width, height) * 0.8);
      bgGrad.addColorStop(0, 'rgba(8, 28, 55, 0.55)');
      bgGrad.addColorStop(0.3, 'rgba(4, 18, 38, 0.35)');
      bgGrad.addColorStop(0.65, 'rgba(3, 10, 24, 0.2)');
      bgGrad.addColorStop(1, 'rgba(3, 6, 15, 1)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(cx, cy);

      const bhRadius = 70 * p.zoom;
      const einsteinRadius = bhRadius * 2.25;

      // 1. Render background stars with gravitational lensing deflection & Parallax
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.alpha = star.baseAlpha + Math.sin(time * 0.002 * star.flickerSpeed + i) * 0.22;

        // Apply depth parallax
        const px = star.x + parallaxOffsetX * star.z;
        const py = star.y + parallaxOffsetY * star.z;

        // If warp is active, stretch stars radially (Hyperspace jump!)
        if (warpActive) {
          const warpStretch = p.warpProgress * 110 * star.z;
          ctx.beginPath();
          ctx.strokeStyle = star.color;
          ctx.lineWidth = star.size * (1 + p.warpProgress * 2.5);
          ctx.globalAlpha = Math.min(1, star.alpha + p.warpProgress * 0.8);

          const r = star.dist * (1 + p.warpProgress * 3.5);
          const x1 = Math.cos(star.angle) * r;
          const y1 = Math.sin(star.angle) * r;
          const x2 = Math.cos(star.angle) * (r + warpStretch);
          const y2 = Math.sin(star.angle) * (r + warpStretch);

          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          continue;
        }

        // Gravitational lensing deflection
        let sx = px;
        let sy = py;
        const d = Math.sqrt(sx * sx + sy * sy);

        if (d > 10) {
          const deflection = (einsteinRadius * einsteinRadius) / (d + bhRadius * 0.5);
          const factor = (d + deflection) / d;
          sx *= factor;
          sy *= factor;
        }

        // Star obscured if behind the event horizon
        if (d < bhRadius * 0.96) {
          continue;
        }

        ctx.beginPath();
        ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, star.alpha));
        ctx.fill();
      }

      ctx.globalAlpha = 1;

      // 2. Render Multiple Thin Orbital Rings
      const ringAccel = warpActive ? 1 + p.warpProgress * 8 : 1;
      for (let i = 0; i < orbitalRings.length; i++) {
        const ring = orbitalRings[i];
        ring.angle += ring.speed * ringAccel;
        ring.nodeAngle += ring.speed * ringAccel * 1.5;

        const currentRadius = bhRadius * ring.radiusRatio * (warpActive ? 1 + p.warpProgress * 1.5 : 1);
        ctx.save();
        ctx.rotate(ring.tiltX + (warpActive ? p.warpProgress * 0.5 : 0));
        ctx.scale(1, ring.tiltY);

        ctx.beginPath();
        ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = ring.width;
        ctx.globalAlpha = Math.max(0, ring.alpha * (warpActive ? 1 - p.warpProgress * 0.5 : 1));
        ctx.setLineDash(ring.dash);
        ctx.lineDashOffset = -ring.angle * 60;
        ctx.stroke();
        ctx.setLineDash([]);

        // Glowing orbital node if present
        if (ring.hasNode) {
          const nx = Math.cos(ring.nodeAngle) * currentRadius;
          const ny = Math.sin(ring.nodeAngle) * currentRadius;
          ctx.beginPath();
          ctx.arc(nx, ny, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = ring.color;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        ctx.restore();
      }

      // 3. Render Gravitational Wave Ripples
      for (let i = p.ripples.length - 1; i >= 0; i--) {
        const rip = p.ripples[i];
        rip.radius += rip.speed;
        rip.alpha *= 0.965;

        if (rip.alpha < 0.01 || rip.radius > rip.maxRadius) {
          p.ripples.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.ellipse(0, 0, rip.radius, rip.radius * 0.45, -0.25, 0, Math.PI * 2);
        ctx.strokeStyle = `${rip.color}${rip.alpha.toFixed(3)})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // 4. Render Relativistic Jets
      for (let i = p.jets.length - 1; i >= 0; i--) {
        const jet = p.jets[i];
        jet.alpha *= 0.95;
        jet.length += jet.speed;

        if (jet.alpha < 0.02) {
          p.jets.splice(i, 1);
          continue;
        }

        const jetGradTop = ctx.createLinearGradient(0, -bhRadius, 0, -bhRadius - jet.length);
        jetGradTop.addColorStop(0, `rgba(255, 255, 255, ${jet.alpha})`);
        jetGradTop.addColorStop(0.35, `rgba(56, 189, 248, ${jet.alpha * 0.8})`);
        jetGradTop.addColorStop(1, 'rgba(6, 182, 212, 0)');

        ctx.beginPath();
        ctx.strokeStyle = jetGradTop;
        ctx.lineWidth = 3.5;
        ctx.moveTo(0, -bhRadius);
        ctx.lineTo(0, -bhRadius - jet.length);
        ctx.stroke();

        const jetGradBottom = ctx.createLinearGradient(0, bhRadius, 0, bhRadius + jet.length);
        jetGradBottom.addColorStop(0, `rgba(255, 255, 255, ${jet.alpha})`);
        jetGradBottom.addColorStop(0.35, `rgba(56, 189, 248, ${jet.alpha * 0.8})`);
        jetGradBottom.addColorStop(1, 'rgba(6, 182, 212, 0)');

        ctx.beginPath();
        ctx.strokeStyle = jetGradBottom;
        ctx.lineWidth = 3.5;
        ctx.moveTo(0, bhRadius);
        ctx.lineTo(0, bhRadius + jet.length);
        ctx.stroke();
      }

      // 5. Scale & Rotate Disk Coordinate System for 3D Perspective Accretion Disk
      ctx.save();
      ctx.rotate(-0.25); // Celestial inclination
      ctx.scale(p.zoom, p.zoom * 0.42); // Elliptical projection

      // Background Gravitational Lensing Halo
      const haloGrad = ctx.createRadialGradient(0, 0, bhRadius * 1.05, 0, 0, bhRadius * 3.6);
      haloGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      haloGrad.addColorStop(0.12, 'rgba(6, 182, 212, 0.85)');
      haloGrad.addColorStop(0.38, 'rgba(56, 189, 248, 0.45)');
      haloGrad.addColorStop(0.72, 'rgba(124, 58, 237, 0.22)');
      haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.arc(0, 0, bhRadius * 3.6, 0, Math.PI * 2);
      ctx.fillStyle = haloGrad;
      ctx.fill();

      // Accretion Disk Bands (Doppler Asymmetry: Left side approaches observer and is bluer & brighter)
      const diskBands = [
        { r: bhRadius * 1.3, w: 24, alpha: 0.75, color: 'rgba(6, 182, 212,' },
        { r: bhRadius * 1.85, w: 38, alpha: 0.55, color: 'rgba(56, 189, 248,' },
        { r: bhRadius * 2.5, w: 50, alpha: 0.38, color: 'rgba(99, 102, 241,' },
        { r: bhRadius * 3.3, w: 60, alpha: 0.22, color: 'rgba(147, 51, 234,' },
      ];

      for (const band of diskBands) {
        ctx.beginPath();
        ctx.arc(0, 0, band.r, 0, Math.PI * 2);
        ctx.lineWidth = band.w;
        ctx.strokeStyle = `${band.color} ${band.alpha})`;
        ctx.stroke();
      }

      // 6. Swirling Accretion Particles with Keplerian Acceleration & Inflow
      for (let i = 0; i < diskParticles.length; i++) {
        const dp = diskParticles[i];

        // Accelerate rotation closer to horizon
        const orbitalSpeed = dp.speed * (p.spinSpeed / 0.015);
        dp.angle += orbitalSpeed * (warpActive ? 1 + p.warpProgress * 6 : 1);

        // Slow spiral inflow toward event horizon
        if (!warpActive) {
          dp.radius -= dp.inflowRate;
          if (dp.radius < 65) {
            dp.radius = 230 + Math.random() * 50; // Recycle outer particle
          }
        } else {
          // Relativistic burst outward initially, then rapid collapse
          const burstPower = Math.sin(p.warpProgress * Math.PI) * 40;
          dp.radius += burstPower * dt;
        }

        const px = Math.cos(dp.angle) * (dp.radius * p.zoom);
        const py = Math.sin(dp.angle) * (dp.radius * p.zoom) + dp.verticalOffset;

        // Relativistic Doppler brightening factor
        const doppler = 1.0 - Math.cos(dp.angle) * 0.65;

        ctx.beginPath();
        ctx.arc(px, py, dp.size * doppler, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${dp.hue}, 95%, ${Math.min(96, 56 * doppler)}%, ${Math.min(1, dp.alpha * doppler)})`;
        ctx.fill();
      }

      ctx.restore(); // End disk tilt

      // 7. Curved Gravitational Light Rays (Lensing Arcs circling the photon sphere)
      for (let i = 0; i < lightRays.length; i++) {
        const ray = lightRays[i];
        ray.currentAngle += ray.speed * (warpActive ? 1 + p.warpProgress * 5 : 1);
        const rayRadius = bhRadius * ray.radiusRatio;

        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, rayRadius, ray.currentAngle, ray.currentAngle + ray.arcLength);
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(56, 189, 248, 0.45)' : 'rgba(6, 182, 212, 0.4)';
        ctx.lineWidth = ray.width * p.zoom;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.restore();
      }

      // Gravitational Arc Lensing (Interstellar Gargantua Upper and Lower Arcs)
      // Upper Arch
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(0, -bhRadius * 0.46, bhRadius * 1.48, bhRadius * 0.78, 0, Math.PI * 1.08, Math.PI * 1.92);
      ctx.lineWidth = 14 * p.zoom;
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.8)';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 26;
      ctx.stroke();
      ctx.restore();

      // Lower Arch
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(0, bhRadius * 0.46, bhRadius * 1.48, bhRadius * 0.78, 0, Math.PI * 0.08, Math.PI * 0.92);
      ctx.lineWidth = 10 * p.zoom;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 22;
      ctx.stroke();
      ctx.restore();

      // THE PHOTON SPHERE (Glowing ring at 1.5 * Schwarzschild radius)
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, bhRadius * 1.09, 0, Math.PI * 2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.8 * p.zoom;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 20;
      ctx.stroke();
      ctx.restore();

      // THE EVENT HORIZON / BLACK HOLE SHADOW (Absolute Singularity)
      ctx.beginPath();
      ctx.arc(0, 0, bhRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#000000';
      ctx.fill();

      // Sharp inner shadow rim
      ctx.beginPath();
      ctx.arc(0, 0, bhRadius + 1.2, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.98)';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Warp Screen Flash / Dimensional Shift White-Out
      if (warpActive && p.warpProgress > 0.42) {
        const flashAlpha = Math.min(1, (p.warpProgress - 0.42) * 2.3);
        ctx.fillStyle = `rgba(224, 242, 254, ${flashAlpha})`;
        ctx.fillRect(-width, -height, width * 2, height * 2);
      }

      ctx.restore();

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleWindowMouseMove);
    };
  }, [warpActive]);

  // Pointer Interaction Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    physicsRef.current.isDragging = true;
    physicsRef.current.lastMouseX = e.clientX;
    triggerGravitationalBurst(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!interactive || !physicsRef.current.isDragging) return;
    const dx = e.clientX - physicsRef.current.lastMouseX;
    physicsRef.current.lastMouseX = e.clientX;
    physicsRef.current.targetSpinSpeed += dx * 0.00045;
  };

  const handlePointerUp = () => {
    physicsRef.current.isDragging = false;
  };

  return (
    <div className="relative w-full h-full select-none cursor-pointer overflow-hidden">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-full h-full block touch-none"
      />
    </div>
  );
};
