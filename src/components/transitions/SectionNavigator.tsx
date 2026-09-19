import React from 'react';
import { ArrowLeft, ArrowRight, Orbit, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

export interface SectionMeta {
  id: string;
  name: string;
  shortLabel: string;
}

export const PORTFOLIO_SECTIONS: SectionMeta[] = [
  { id: 'home', name: 'Main Page', shortLabel: 'Home' },
  { id: 'about', name: 'About & Dossier', shortLabel: 'About' },
  { id: 'reel', name: 'Video Reel', shortLabel: 'Reel' },
  { id: 'skills', name: 'Flight Deck Skills', shortLabel: 'Skills' },
  { id: 'projects', name: 'Mission Projects', shortLabel: 'Projects' },
  { id: 'experience', name: 'Experience & Timeline', shortLabel: 'Experience' },
  { id: 'connect', name: 'Comms Relay & Connect', shortLabel: 'Connect' },
];

interface SectionNavigatorProps {
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onJumpTo: (index: number) => void;
  onReturnToEntrance?: () => void;
  disabled?: boolean;
}

export const SectionNavigator: React.FC<SectionNavigatorProps> = ({
  currentIndex,
  onNext,
  onPrev,
  onJumpTo,
  onReturnToEntrance,
  disabled = false,
}) => {
  const currentSection = PORTFOLIO_SECTIONS[currentIndex];
  const prevSection = currentIndex > 0 ? PORTFOLIO_SECTIONS[currentIndex - 1] : null;
  const nextSection = currentIndex < PORTFOLIO_SECTIONS.length - 1 ? PORTFOLIO_SECTIONS[currentIndex + 1] : null;

  return (
    <div className="w-full max-w-5xl mx-auto mt-16 pt-8 pb-12 px-4 border-t border-white/10">
      <div className="bg-gradient-to-r from-cyan-950/40 via-black/60 to-cyan-950/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-4 sm:p-6 shadow-[0_4px_30px_rgba(0,0,0,0.6)] flex flex-col sm:flex-row items-center justify-between gap-5">
        {/* 1. Left Action: Previous Section / Entrance */}
        <div className="w-full sm:w-auto flex justify-start">
          {currentIndex === 0 ? (
            onReturnToEntrance ? (
              <button
                onClick={onReturnToEntrance}
                disabled={disabled}
                className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-cyan-950/70 border border-white/10 hover:border-cyan-500/40 text-stone-300 hover:text-cyan-300 text-xs sm:text-sm font-mono font-medium transition-all cursor-pointer disabled:opacity-50 shadow-xs"
                title="Return to Singularity Black Hole Entrance"
              >
                <Orbit className="w-4 h-4 text-cyan-400 group-hover:rotate-180 transition-transform duration-500" />
                <span>← Singularity Entrance</span>
              </button>
            ) : (
              <div className="text-xs font-mono text-stone-500">Mission Start</div>
            )
          ) : (
            <button
              onClick={onPrev}
              disabled={disabled}
              className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-cyan-950/70 border border-white/10 hover:border-cyan-500/40 text-stone-200 hover:text-white text-xs sm:text-sm font-mono font-medium transition-all cursor-pointer disabled:opacity-50 shadow-xs"
              title={`Return to ${prevSection?.name}`}
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
              <span>
                Previous: <strong className="text-cyan-300">{prevSection?.shortLabel}</strong>
              </span>
            </button>
          )}
        </div>

        {/* 2. Center: Interactive Slide Step Dots & Telemetry */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-cyan-300">
              SLIDE 0{currentIndex + 1} / 0{PORTFOLIO_SECTIONS.length} • {currentSection.shortLabel}
            </span>
          </div>

          {/* Interactive Step Navigation Dots */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
            {PORTFOLIO_SECTIONS.map((sec, idx) => {
              const isActive = idx === currentIndex;
              const isPassed = idx < currentIndex;
              return (
                <button
                  key={sec.id}
                  onClick={() => onJumpTo(idx)}
                  disabled={disabled}
                  className={`relative transition-all duration-300 rounded-full cursor-pointer ${
                    isActive
                      ? 'w-6 h-2 bg-gradient-to-r from-cyan-400 to-sky-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]'
                      : isPassed
                      ? 'w-2 h-2 bg-cyan-600/70 hover:bg-cyan-400'
                      : 'w-2 h-2 bg-white/20 hover:bg-white/50'
                  }`}
                  title={`Jump to Slide ${idx + 1}: ${sec.name}`}
                  aria-label={`Jump to ${sec.name}`}
                />
              );
            })}
          </div>
        </div>

        {/* 3. Right Action: Next Section / Restart Tour */}
        <div className="w-full sm:w-auto flex justify-end">
          {nextSection ? (
            <button
              onClick={onNext}
              disabled={disabled}
              className="group relative flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono font-semibold text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] border border-cyan-300/40 transition-all cursor-pointer disabled:opacity-50 overflow-hidden"
              title={`Advance to ${nextSection.name}`}
            >
              {/* Button Shine */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

              <span>
                Next: <strong className="text-cyan-100">{nextSection.shortLabel}</strong>
              </span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button
              onClick={() => onJumpTo(0)}
              disabled={disabled}
              className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/50 text-cyan-300 hover:text-white font-mono font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              title="Return to Main Page"
            >
              <RotateCcw className="w-4 h-4 text-cyan-400 group-hover:-rotate-90 transition-transform duration-300" />
              <span>Return to Main Page</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
