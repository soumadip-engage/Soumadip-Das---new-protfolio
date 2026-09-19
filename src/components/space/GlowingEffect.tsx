import React, { useEffect, useRef } from 'react';

interface GlowingEffectProps {
  spread?: number;
  borderWidth?: number;
  glowColor?: string;
}

export const GlowingEffect: React.FC<GlowingEffectProps> = ({
  spread = 200,
  borderWidth = 1.5,
  glowColor = '#00f0ff',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current?.parentElement;
    if (!el) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (containerRef.current) {
        containerRef.current.style.setProperty('--mouse-x', `${x}px`);
        containerRef.current.style.setProperty('--mouse-y', `${y}px`);
        containerRef.current.style.opacity = '1';
      }
    };

    const handlePointerLeave = () => {
      if (containerRef.current) {
        containerRef.current.style.opacity = '0';
      }
    };

    el.addEventListener('pointermove', handlePointerMove);
    el.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      el.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute -inset-[1px] rounded-3xl transition-opacity duration-300 opacity-0 z-20"
      style={{
        background: `radial-gradient(${spread}px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${glowColor}66, transparent 80%)`,
        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',
        WebkitMaskComposite: 'xor',
        padding: `${borderWidth}px`,
      }}
    />
  );
};
