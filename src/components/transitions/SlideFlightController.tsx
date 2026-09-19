import React, { useEffect } from 'react';
import { ChevronUp, ChevronDown, Compass, Orbit } from 'lucide-react';
import { PORTFOLIO_SECTIONS } from './SectionNavigator';

interface SlideFlightControllerProps {
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onJumpTo: (index: number) => void;
  onReturnToEntrance: () => void;
  disabled?: boolean;
}

export const SlideFlightController: React.FC<SlideFlightControllerProps> = ({
  currentIndex,
  onNext,
  onPrev,
  onJumpTo,
  onReturnToEntrance,
  disabled = false,
}) => {
  // Keyboard arrow listeners for space travel navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        onNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        onPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev]);

  const currentSection = PORTFOLIO_SECTIONS[currentIndex];
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < PORTFOLIO_SECTIONS.length - 1;

  return (
    <div className="fixed right-4 bottom-6 z-40 hidden md:flex flex-col items-center gap-2 select-none">
      <div className="bg-black/75 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-2 shadow-[0_8px_32px_rgba(0,0,0,0.8)] flex flex-col items-center gap-1.5 transition-all">
        {/* Previous Button */}
        <button
          onClick={onPrev}
          disabled={!canGoPrev || disabled}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-300 hover:text-cyan-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          title={canGoPrev ? `Previous: ${PORTFOLIO_SECTIONS[currentIndex - 1]?.shortLabel}` : 'First Slide'}
          aria-label="Previous Slide"
        >
          <ChevronUp className="w-4 h-4" />
        </button>

        {/* Current Slide Display */}
        <div className="flex flex-col items-center py-1 px-1 border-y border-white/10 my-0.5 text-center">
          <span className="font-mono text-[10px] font-bold text-cyan-400">
            0{currentIndex + 1}
          </span>
          <span className="font-mono text-[9px] text-stone-500">
            0{PORTFOLIO_SECTIONS.length}
          </span>
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          disabled={!canGoNext || disabled}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-300 hover:text-cyan-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          title={canGoNext ? `Next: ${PORTFOLIO_SECTIONS[currentIndex + 1]?.shortLabel}` : 'Last Slide'}
          aria-label="Next Slide"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Mini Singularity Quick Switcher */}
      <button
        onClick={onReturnToEntrance}
        disabled={disabled}
        className="w-9 h-9 rounded-full bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 hover:text-white flex items-center justify-center shadow-lg transition-all cursor-pointer group"
        title="Return to Black Hole Gateway"
        aria-label="Return to Black Hole Gateway"
      >
        <Orbit className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500 text-cyan-400" />
      </button>
    </div>
  );
};
