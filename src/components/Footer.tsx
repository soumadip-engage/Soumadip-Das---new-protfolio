import React from 'react';
import { ArrowUp, Github, Linkedin, Twitter, Mail, Orbit, Radio } from 'lucide-react';
import { PortfolioData } from '../types';

interface FooterProps {
  data: PortfolioData;
  onReturnToEntrance?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ data, onReturnToEntrance }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/10 bg-[#03060e] text-white py-12 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <p className="text-sm font-bold font-mono text-white tracking-wide">
              {data.name} // PORTFOLIO
            </p>
          </div>
          <p className="text-xs text-stone-400 mt-1 font-mono">
            © {new Date().getFullYear()} • Engineered with React, Motion & Singularity Mechanics.
          </p>
        </div>

        {/* Action controls and portal button */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {onReturnToEntrance && (
            <button
              onClick={onReturnToEntrance}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-mono font-medium transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] cursor-pointer"
              title="Return to Black Hole Gateway"
            >
              <Orbit className="w-3.5 h-3.5 text-cyan-400" />
              <span>Singularity Gateway</span>
            </button>
          )}

          <div className="flex items-center gap-3">
            {data.social.github && (
              <a
                href={data.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {data.social.linkedin && (
              <a
                href={data.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-stone-400 hover:text-sky-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {data.social.twitter && (
              <a
                href={data.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-stone-400 hover:text-cyan-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs font-mono font-medium text-stone-400 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
