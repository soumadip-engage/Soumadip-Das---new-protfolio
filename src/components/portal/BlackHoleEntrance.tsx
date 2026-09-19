import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Orbit } from 'lucide-react';
import { BlackHoleCanvas } from './BlackHoleCanvas';
import { portalSound } from '../../utils/portalAudio';
import { PortfolioData } from '../../types';

interface BlackHoleEntranceProps {
  data?: PortfolioData;
  onEnter: () => void;
}

export const BlackHoleEntrance: React.FC<BlackHoleEntranceProps> = ({ onEnter }) => {
  const [isWarping, setIsWarping] = useState(false);

  const handleEnterClick = () => {
    if (isWarping) return;
    setIsWarping(true);
    portalSound.playWormholeWarp();

    // Trigger dimensional shift completion after warp animation
    setTimeout(() => {
      onEnter();
    }, 1400);
  };

  // Keyboard shortcut: Press Enter or Space to initiate warp
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Enter' || e.code === 'Space') && !isWarping) {
        e.preventDefault();
        handleEnterClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isWarping]);

  return (
    <div className="fixed inset-0 z-50 bg-[#02040a] text-white flex flex-col justify-between overflow-hidden select-none">
      {/* 1. Interactive 3D Physics Black Hole & Cosmic Starfield */}
      <div className="absolute inset-0 z-0">
        <BlackHoleCanvas warpActive={isWarping} />
      </div>

      {/* 2. Top Subtle Status */}
      <div className="relative z-10 p-5 sm:p-8 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 font-mono text-xs text-cyan-400/90 bg-black/40 backdrop-blur-md px-3.5 py-1 rounded-full border border-cyan-500/20">
          <Orbit className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
          <span className="font-semibold tracking-widest text-[11px]">COSMIC GATEWAY</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-stone-400/80 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="tracking-widest">ONLINE</span>
        </div>
      </div>

      {/* 3. Central Cinematic Action Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-xl mx-auto my-auto pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{
            opacity: isWarping ? 0 : 1,
            scale: isWarping ? 1.35 : 1,
            y: isWarping ? -35 : 0,
            filter: isWarping ? 'blur(10px)' : 'blur(0px)',
          }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* Welcome Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cyan-950/60 border border-cyan-400/30 text-cyan-300 text-xs font-mono mb-3 tracking-[0.25em] uppercase shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>WELCOME</span>
          </div>

          {/* Soumadip's Portfolio Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-8 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-cyan-200 drop-shadow-[0_0_35px_rgba(6,182,212,0.6)]">
              Soumadip's Portfolio
            </span>
          </h1>

          {/* Smooth Central Explore Button (Only Explore) */}
          <motion.button
            id="portal-enter-button"
            onClick={handleEnterClick}
            disabled={isWarping}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="group relative px-10 sm:px-14 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white font-bold text-sm sm:text-base tracking-[0.25em] shadow-[0_0_35px_rgba(6,182,212,0.55)] hover:shadow-[0_0_55px_rgba(6,182,212,0.85)] border border-cyan-200/40 transition-all cursor-pointer flex items-center gap-3 overflow-hidden font-mono uppercase"
          >
            {/* Ambient Shine Reflection */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

            <Orbit className="w-4 h-4 text-white group-hover:rotate-180 transition-transform duration-700" />
            <span>EXPLORE</span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>

      {/* 4. Bottom of Page: Completely Clean */}
      <div className="relative z-10 h-10 sm:h-16 pointer-events-none" />

      {/* 5. Dimension Shift / Wormhole Warp Overlay Animation */}
      <AnimatePresence>
        {isWarping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
          >
            {/* Expanding Event Horizon Tunnel Flash */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 2, 8], opacity: [0, 0.85, 1] }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-96 h-96 rounded-full bg-gradient-to-r from-cyan-400 via-sky-300 to-white blur-2xl"
            />

            {/* Dimensional Text HUD */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 1.8] }}
              transition={{ duration: 1.2, times: [0, 0.4, 1] }}
              className="absolute z-20 text-center font-mono text-cyan-300 text-lg sm:text-2xl font-bold tracking-[0.25em]"
            >
              WARPING TO MAIN DECK
            </motion.div>

            {/* White-out Dimensional Flash */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.2, 1] }}
              transition={{ duration: 1.4, times: [0, 0.7, 1] }}
              className="absolute inset-0 bg-[#050811]"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
