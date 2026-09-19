import React, { useState } from 'react';
import { Play, Github, Linkedin, Twitter, Mail, MapPin, Sparkles, Award, Download, Check, Radio, Orbit, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { PortfolioData } from '../types';
import { VoicePlayer } from './VoicePlayer';
import { TypewriterText } from './TypewriterText';
import { downloadResumePdf } from '../utils/generatePdf';
import { StarfieldCanvas } from './space/StarfieldCanvas';
import { CosmicProfileCard } from './space/CosmicProfileCard';

interface HeroProps {
  data: PortfolioData;
  onOpenResume?: () => void;
  onNextSection?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  data, 
  onOpenResume,
  onNextSection,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadResume = () => {
    downloadResumePdf(data);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
    if (onOpenResume) {
      onOpenResume();
    }
  };

  const roles = [
    'Tejas India Hackathon Winner 🏆',
    'B.Tech IT Scholar @ HIT (9.16 CGPA)',
    'Research Assistant @ NSRI',
    'UPI Fraud & AI Security Architect',
    'Full-Stack & Deep Learning Engineer',
  ];

  return (
    <section
      id="hero"
      className="relative min-h-[95vh] flex flex-col justify-center pt-28 pb-20 px-4 sm:px-6 overflow-hidden bg-[#050811] text-white"
    >
      {/* 1. Interactive Cosmic Starfield Canvas */}
      <StarfieldCanvas speedMultiplier={0.8} starCount={160} interactive={true} />

      {/* 2. Space Nebula Glow Meshes */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center overflow-hidden">
        <div className="w-[600px] h-[600px] bg-cyan-600/12 blur-[140px] rounded-full translate-x-48 -translate-y-20 animate-float" />
        <div className="w-[500px] h-[500px] bg-sky-500/10 blur-[150px] rounded-full -translate-x-48 translate-y-24" />
        <div className="w-[450px] h-[450px] bg-indigo-600/10 blur-[130px] rounded-full translate-y-52" />
        
        {/* Subtle Cyber Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]"
        />
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10 my-auto">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-14">
          
          {/* Left: Text & Telemetry Content */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex-1 text-center lg:text-left"
          >
            {/* High-Tech Badges & Voice Player Bar */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 mb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-semibold shadow-[0_0_12px_rgba(6,182,212,0.25)]">
                <Orbit className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
                <span>COSMIC ASTRO-TECH PROFILE</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-950/70 border border-amber-400/40 text-amber-300 text-xs font-bold font-mono shadow-xs">
                <Award className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Tejas India Hackathon Winner 🏆</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-stone-300 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span>{data.status || 'Active & Available'}</span>
              </div>

              {/* Voice Narration Feature */}
              <div className="hidden sm:inline-block">
                <VoicePlayer
                  textToSpeak={data.voiceIntroText || `${data.name}, ${data.title}. ${data.tagline}`}
                  authorName={data.name}
                />
              </div>
            </div>

            {/* Greeting & Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-3 leading-[1.14]">
              Hello, I'm{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-teal-300 drop-shadow-[0_0_20px_rgba(56,189,248,0.35)]">
                {data.name}
              </span>
            </h1>

            {/* Dynamic Animated Typewriter Line */}
            <div className="text-xl sm:text-2xl font-medium text-cyan-100/90 mb-4 min-h-[36px] flex items-center justify-center lg:justify-start font-mono">
              <TypewriterText words={roles} />
            </div>

            {/* Bio description */}
            <p className="text-base sm:text-lg text-stone-300 max-w-xl mb-6 leading-relaxed">
              {data.tagline}
            </p>

            {/* Verified Contact Meta with Space HUD Glass Styling */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs text-stone-300 mb-7 font-mono">
              {data.location && (
                <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{data.location}</span>
                </div>
              )}
              {data.email && (
                <a
                  href={`mailto:${data.email}`}
                  className="flex items-center gap-1.5 bg-cyan-950/40 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/50 hover:border-cyan-300 font-mono transition-all shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{data.email}</span>
                </a>
              )}
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8">
              <a
                href="#projects"
                className="icon-btn-glow relative overflow-hidden px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2"
              >
                <span>Explore Mission Projects</span>
                <span className="icon-btn__shine" />
              </a>

              <button
                id="hero-download-cv-btn"
                onClick={handleDownloadResume}
                className="icon-btn-glow relative overflow-hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-all border border-white/15 hover:border-cyan-400/60 cursor-pointer backdrop-blur-md shadow-xs"
                title="Download Soumadip Das CV (PDF) immediately"
              >
                {downloadSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Downloaded PDF!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-cyan-400" />
                    <span>Download CV (PDF)</span>
                  </>
                )}
                <span className="icon-btn__shine" />
              </button>

              {data.videoShowcase?.enabled && (
                <a
                  href="#video-reel"
                  className="icon-btn-glow relative overflow-hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 text-stone-200 border border-white/10 hover:border-cyan-400/50 hover:text-white font-medium text-sm transition-all backdrop-blur-md"
                >
                  <Play className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                  <span>Watch Video Reel</span>
                  <span className="icon-btn__shine" />
                </a>
              )}
            </div>

            {/* Social Links Bar with Cosmic Glow Shines */}
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold font-mono">
                Connect:
              </span>
              {data.social.github && (
                <a
                  href={data.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-btn-glow relative overflow-hidden p-2.5 text-stone-300 hover:text-cyan-300 bg-white/5 hover:bg-cyan-500/20 rounded-xl transition-all border border-white/10 hover:border-cyan-400/50"
                  aria-label="GitHub"
                  title="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                  <span className="icon-btn__shine" />
                </a>
              )}
              {data.social.linkedin && (
                <a
                  href={data.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-btn-glow relative overflow-hidden p-2.5 text-sky-400 hover:text-white bg-white/5 hover:bg-sky-500/20 rounded-xl transition-all border border-white/10 hover:border-sky-400/50"
                  aria-label="LinkedIn"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                  <span className="icon-btn__shine" />
                </a>
              )}
              {data.social.twitter && (
                <a
                  href={data.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-btn-glow relative overflow-hidden p-2.5 text-stone-300 hover:text-cyan-300 bg-white/5 hover:bg-cyan-500/20 rounded-xl transition-all border border-white/10 hover:border-cyan-400/50"
                  aria-label="Twitter / X"
                  title="X (Twitter) Profile"
                >
                  <Twitter className="w-4 h-4" />
                  <span className="icon-btn__shine" />
                </a>
              )}
              {data.email && (
                <a
                  href={`mailto:${data.email}`}
                  className="icon-btn-glow relative overflow-hidden p-2.5 text-stone-300 hover:text-cyan-300 bg-white/5 hover:bg-cyan-500/20 rounded-xl transition-all border border-white/10 hover:border-cyan-400/50"
                  aria-label="Email"
                  title="Email Direct"
                >
                  <Mail className="w-4 h-4" />
                  <span className="icon-btn__shine" />
                </a>
              )}
            </div>
          </motion.div>

          {/* Right: Signature 3D Tilt Animated Cosmic Profile Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
            className="w-full lg:w-auto flex justify-center"
          >
            <CosmicProfileCard
              data={data}
              onOpenResume={onOpenResume}
            />
          </motion.div>

        </div>
      </div>

      {/* Bottom Celestial Fade into Following Space Sections */}
      <div 
        className="absolute bottom-0 inset-x-0 h-24 pointer-events-none bg-gradient-to-b from-transparent via-[#050811]/60 to-[#050811]"
      />

      {/* Subtle Scroll / Advance Indicator */}
      <div className="relative z-10 flex justify-center mt-6 text-stone-400/70 hover:text-cyan-400 transition-colors">
        {onNextSection ? (
          <button
            onClick={onNextSection}
            aria-label="Advance to About section"
            className="flex flex-col items-center gap-1 text-[11px] font-mono cursor-pointer group"
          >
            <span className="group-hover:text-cyan-300 transition-colors">ADVANCE TO ABOUT</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-cyan-400" />
          </button>
        ) : (
          <a href="#about" aria-label="Scroll to about section" className="flex flex-col items-center gap-1 text-[11px] font-mono">
            <span>SCROLL DOWN</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </a>
        )}
      </div>
    </section>
  );
};
