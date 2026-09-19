import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Download, FileText, Orbit, Sparkles } from 'lucide-react';
import { PortfolioData } from '../types';
import { downloadResumePdf } from '../utils/generatePdf';

interface NavbarProps {
  data: PortfolioData;
  currentIndex?: number;
  onSelectSection?: (index: number) => void;
  onOpenResume?: () => void;
  onReturnToEntrance?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  data,
  currentIndex = 0,
  onSelectSection,
  onOpenResume,
  onReturnToEntrance,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleResumeClick = () => {
    downloadResumePdf(data);
    if (onOpenResume) {
      onOpenResume();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 7 slides in the space journey
  const navItems = [
    { label: 'Home', index: 0 },
    { label: 'About', index: 1 },
    { label: 'Reel', index: 2 },
    { label: 'Skills', index: 3 },
    { label: 'Projects', index: 4 },
    { label: 'Experience', index: 5 },
    { label: 'Connect', index: 6 },
  ];

  const handleNavItemClick = (index: number) => {
    setMobileMenuOpen(false);
    if (onSelectSection) {
      onSelectSection(index);
    }
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#03060f]/92 backdrop-blur-xl border-b border-cyan-500/25 shadow-[0_4px_30px_rgba(0,0,0,0.8)] py-3'
          : 'bg-[#03060f]/75 backdrop-blur-md border-b border-white/10 py-3 sm:py-3.5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={() => handleNavItemClick(0)}
          className="flex items-center gap-2.5 text-left group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-mono text-sm font-bold bg-cyan-950/90 border border-cyan-400/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(6,182,212,0.7)] transition-all">
            {data.name.charAt(0) || 'S'}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold tracking-tight text-white group-hover:text-cyan-300 transition-colors font-mono text-sm sm:text-base">
              {data.name}
            </span>
            <span className="text-[10px] font-mono text-cyan-400/70 hidden sm:inline">
              MISSION TOUR
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-black/40 px-2 py-1 rounded-full border border-white/10">
          {navItems.map((item) => {
            const isActive = currentIndex === item.index;
            return (
              <button
                key={item.label}
                onClick={() => handleNavItemClick(item.index)}
                className={`relative px-3 py-1 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-950/90 border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.35)]'
                    : 'text-stone-300 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Entrance Button */}
          {onReturnToEntrance && (
            <button
              onClick={onReturnToEntrance}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-cyan-300 hover:text-white bg-cyan-950/70 border border-cyan-500/40 hover:border-cyan-400 rounded-lg transition-all cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.2)]"
              title="Return to Space Entrance Gateway"
            >
              <Orbit className="w-3.5 h-3.5 text-cyan-400" />
              <span>Entrance</span>
            </button>
          )}

          <button
            onClick={handleResumeClick}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold text-stone-200 bg-white/5 border border-white/15 hover:border-cyan-400 hover:text-white hover:bg-white/10 rounded-lg transition-all cursor-pointer shadow-xs"
            title="Download Soumadip Das Resume PDF directly"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Resume (PDF)</span>
          </button>

          <button
            onClick={() => handleNavItemClick(6)}
            className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-mono font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            <span>Connect</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Controls Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {onReturnToEntrance && (
            <button
              onClick={onReturnToEntrance}
              className="p-1.5 rounded-lg text-cyan-300 bg-cyan-950/80 border border-cyan-500/50"
              title="Return to Singularity"
            >
              <Orbit className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleResumeClick}
            className="p-1.5 rounded-lg text-stone-300 bg-white/10 border border-white/15"
            title="Download CV (PDF)"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-stone-300 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#050811]/98 backdrop-blur-xl border-b border-cyan-500/25 px-5 py-4 space-y-3 shadow-2xl">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const isActive = currentIndex === item.index;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavItemClick(item.index)}
                  className={`text-left py-2 px-3 rounded-lg text-sm font-mono flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  <span>Slide {item.index + 1}: {item.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                </button>
              );
            })}
          </div>
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2 font-mono">
            {onReturnToEntrance && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onReturnToEntrance();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 rounded-lg"
              >
                <Orbit className="w-4 h-4" />
                Return to Entrance
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleResumeClick();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-white bg-cyan-600 rounded-lg shadow-sm"
            >
              <Download className="w-4 h-4" />
              Download Resume (PDF)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
