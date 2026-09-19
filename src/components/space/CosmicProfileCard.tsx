import React, { useState, useRef, useCallback } from 'react';
import { 
  Github, Linkedin, Twitter, Mail, Download, Check, Volume2, Pause, 
  ExternalLink, Sparkles, Orbit, Radio, Shield, Award, Terminal, Compass
} from 'lucide-react';
import { motion } from 'motion/react';
import { PortfolioData } from '../../types';
import { PixelCanvas } from './PixelCanvas';
import { GlowingEffect } from './GlowingEffect';
import { downloadResumePdf } from '../../utils/generatePdf';
import { speakText, stopSpeech, pauseSpeech, resumeSpeech } from '../../utils/voice';

interface CosmicProfileCardProps {
  data: PortfolioData;
  onOpenResume?: () => void;
  className?: string;
}

export const CosmicProfileCard: React.FC<CosmicProfileCardProps> = ({
  data,
  onOpenResume,
  className = '',
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transformStyle, setTransformStyle] = useState<string>('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [isHovered, setIsHovered] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [isVoicePaused, setIsVoicePaused] = useState(false);
  const [showTelemetry, setShowTelemetry] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 3D Tilt calculation for cosmic perspective
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Max tilt angles: 10deg
    const rotX = -((y - centerY) / centerY) * 9;
    const rotY = ((x - centerX) / centerX) * 9;

    setTransformStyle(`perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`);
  }, []);

  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  }, []);

  // Resume Download
  const handleDownloadCv = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadResumePdf(data);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
    if (onOpenResume) {
      onOpenResume();
    }
  };

  // Voice narration toggle
  const handleToggleVoice = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlayingVoice) {
      if (isVoicePaused) {
        if (audioRef.current) {
          audioRef.current.play();
        } else {
          resumeSpeech();
        }
        setIsVoicePaused(false);
      } else {
        if (audioRef.current) {
          audioRef.current.pause();
        } else {
          pauseSpeech();
        }
        setIsVoicePaused(true);
      }
    } else {
      setIsPlayingVoice(true);
      setIsVoicePaused(false);

      // Check if custom audio asset is available
      try {
        if (!audioRef.current) {
          const testAudio = new Audio('/voice.webm');
          testAudio.onended = () => {
            setIsPlayingVoice(false);
            setIsVoicePaused(false);
          };
          testAudio.onerror = () => {
            fallbackSpeech();
          };
          await testAudio.play();
          audioRef.current = testAudio;
          return;
        } else {
          audioRef.current.currentTime = 0;
          await audioRef.current.play();
          return;
        }
      } catch {
        fallbackSpeech();
      }
    }
  };

  const fallbackSpeech = () => {
    const text = data.voiceIntroText || `Hi, I am ${data.name}, an Information Technology student and AI and software developer, 1-time Hackathon Winner, passionate about building intelligent technology solutions.`;
    speakText(
      text,
      0.95,
      0.95,
      () => {
        setIsPlayingVoice(false);
        setIsVoicePaused(false);
      },
      () => {
        setIsPlayingVoice(false);
        setIsVoicePaused(false);
      }
    );
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`pixel-card relative flex flex-col w-full max-w-[380px] sm:max-w-[420px] mx-auto rounded-3xl cursor-default select-none transition-all duration-300 ${className}`}
      style={{
        boxSizing: 'border-box',
        isolation: 'isolate',
      }}
    >
      {/* 3D Tilted Body */}
      <div
        className="relative z-10 flex flex-col w-full h-full rounded-3xl p-5 sm:p-6 text-white overflow-hidden"
        style={{
          transform: transformStyle,
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          background: 'linear-gradient(180deg, rgba(13, 19, 33, 0.88) 0%, rgba(7, 10, 18, 0.96) 100%)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: isHovered
            ? '0 30px 60px -15px rgba(0, 0, 0, 0.85), 0 0 35px rgba(56, 189, 248, 0.28), inset 0 1px rgba(255, 255, 255, 0.2)'
            : '0 20px 40px -15px rgba(0, 0, 0, 0.7), inset 0 1px rgba(255, 255, 255, 0.12)',
          border: isHovered ? '1px solid rgba(56, 189, 248, 0.45)' : '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Dynamic Interactive Pixel Canvas inside the card */}
        <PixelCanvas gap={9} colors={['#00f0ff', '#38bdf8', '#0284c7', '#818cf8', '#c084fc', '#ffffff']} />

        {/* Cosmic Ambient Glass Mesh in Card Header */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Cyber Reticle Corner Accents [ + ] */}
        <div className="absolute top-3 left-3 text-[10px] font-mono text-cyan-400/40 select-none pointer-events-none">⌜</div>
        <div className="absolute top-3 right-3 text-[10px] font-mono text-cyan-400/40 select-none pointer-events-none">⌝</div>
        <div className="absolute bottom-3 left-3 text-[10px] font-mono text-cyan-400/40 select-none pointer-events-none">⌞</div>
        <div className="absolute bottom-3 right-3 text-[10px] font-mono text-cyan-400/40 select-none pointer-events-none">⌟</div>

        {/* Top HUD Telemetry Bar */}
        <div className="relative z-10 flex items-center justify-between gap-2 pb-3 mb-4 border-b border-white/10 font-mono text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span className="text-cyan-400 font-bold tracking-wider">SYS: ONLINE</span>
            <span className="text-white/30">•</span>
            <span className="text-stone-400 text-[10px] hidden sm:inline">COSMIC ORBIT</span>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-cyan-400/80 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
            <Radio className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
            <span>22.06°N 88.06°E</span>
          </div>
        </div>

        {/* Cosmic Orbital Avatar Wrapper */}
        <div className="relative z-10 flex flex-col items-center justify-center py-2">
          <div className="relative w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center">
            
            {/* Outer Concentric Orbital Ring 1 (Tilted 3D Orbit with Satellite Beacon) */}
            <div 
              className="absolute inset-0 rounded-full border border-cyan-400/25 animate-orbit pointer-events-none"
              style={{
                boxShadow: '0 0 15px rgba(56, 189, 248, 0.15)',
              }}
            >
              {/* Orbiting Satellite Dot / Pulsar */}
              <div 
                className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-300 border border-white shadow-[0_0_10px_#00f0ff] flex items-center justify-center"
              >
                <div className="w-1 h-1 rounded-full bg-white animate-ping" />
              </div>
            </div>

            {/* Middle Orbit Ring 2 (Dashed Reverse Orbit) */}
            <div 
              className="absolute -inset-3 rounded-full border border-dashed border-sky-400/20 animate-orbit-reverse pointer-events-none"
            >
              {/* Secondary Nano-beacon */}
              <div className="absolute -bottom-1 left-1/3 w-2 h-2 rounded-full bg-sky-400/80 shadow-[0_0_8px_#38bdf8]" />
            </div>

            {/* Inner Pulsar Halo */}
            <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-cyan-500/20 via-sky-500/10 to-transparent animate-radar pointer-events-none" />

            {/* Avatar Image Circle with Hologram Scanline */}
            <div 
              className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-b from-cyan-400/60 via-sky-500/40 to-cyan-900/80 overflow-hidden shadow-[0_0_25px_rgba(56,189,248,0.35)] transition-transform duration-500 group"
              style={{
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <img
                src={data.avatarUrl || '/profile.jpg'}
                alt={data.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full select-none"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src.indexOf('soumadip.jpg') === -1) {
                    target.src = '/soumadip.jpg';
                  } else {
                    target.src = '/profile.jpg';
                  }
                }}
              />

              {/* Hologram Laser Scanline traversing across portrait */}
              <div 
                className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_12px_#00f0ff] animate-hologram pointer-events-none"
              />

              {/* Glass Rim highlight */}
              <div className="absolute inset-0 rounded-full ring-1 ring-white/30 pointer-events-none" />
            </div>

            {/* Status Pill on Avatar */}
            <div className="absolute -bottom-1 z-20 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/85 border border-cyan-400/60 text-[10px] font-mono font-bold text-cyan-300 shadow-md backdrop-blur-md">
              <Award className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>TEJAS WINNER</span>
            </div>
          </div>

          {/* Member Name & Role */}
          <div className="text-center mt-4">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
              <span>{data.name}</span>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </h3>
            <p className="text-xs sm:text-sm text-cyan-200/80 font-mono mt-0.5">
              AI & Software Developer • Tejas Hackathon Winner
            </p>
            <p className="text-[11px] text-stone-400 mt-1 max-w-[280px] mx-auto line-clamp-2">
              B.Tech IT Scholar @ HIT (9.16 CGPA) • UPI Fraud Detection Lead
            </p>
          </div>

          {/* Mission Spec Badges */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 text-[10px] font-mono border border-cyan-700/50">
              <Orbit className="w-2.5 h-2.5 text-cyan-400" />
              <span>1× Hackathon Winner</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-950/60 text-sky-300 text-[10px] font-mono border border-sky-700/50">
              <Shield className="w-2.5 h-2.5 text-sky-400" />
              <span>SecureFlow AI</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 text-[10px] font-mono border border-emerald-700/50">
              <Check className="w-2.5 h-2.5 text-emerald-400" />
              <span>HIT IT '27</span>
            </span>
          </div>

          {/* Voice Narration Audio Trigger */}
          <div className="mt-3.5 w-full">
            <button
              onClick={handleToggleVoice}
              className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-mono font-semibold transition-all cursor-pointer ${
                isPlayingVoice && !isVoicePaused
                  ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'bg-white/5 hover:bg-white/10 text-stone-200 border-white/10 hover:border-cyan-400/50'
              }`}
              title="Listen to Soumadip's Voice Introduction"
            >
              {isPlayingVoice && !isVoicePaused ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-cyan-300 fill-current" />
                  <span>Pause Voice Bio</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Hear Authentic Voice</span>
                </>
              )}

              {/* Sound Wave Bars */}
              <div className="flex items-center gap-0.5 h-3.5 ml-1">
                {[30, 80, 100, 60, 90, 45].map((h, idx) => (
                  <span
                    key={idx}
                    className={`w-0.5 rounded-full transition-all ${
                      isPlayingVoice && !isVoicePaused ? 'bg-cyan-400 animate-pulse' : 'bg-stone-600'
                    }`}
                    style={{
                      height: isPlayingVoice && !isVoicePaused ? `${h}%` : '25%',
                      animationDelay: `${idx * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </button>
          </div>
        </div>

        {/* Card Footer with Glowing Separator */}
        <div className="relative z-10 pt-3 mt-3 border-t border-white/10 flex flex-col gap-2.5">
          {/* Glowing separator line */}
          <div 
            className="absolute -top-[1px] left-1/2 -translate-x-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent transition-all duration-300"
            style={{ width: isHovered ? '80%' : '40%' }}
          />

          {/* Social Links with Interactive Shine Effect */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {data.social.github && (
                <a
                  href={data.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-btn-glow relative overflow-hidden p-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-stone-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/50 transition-colors"
                  aria-label="GitHub"
                  title="GitHub Profile"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span className="icon-btn__shine" />
                </a>
              )}
              {data.social.linkedin && (
                <a
                  href={data.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-btn-glow relative overflow-hidden p-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-stone-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/50 transition-colors"
                  aria-label="LinkedIn"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span className="icon-btn__shine" />
                </a>
              )}
              {data.social.twitter && (
                <a
                  href={data.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-btn-glow relative overflow-hidden p-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-stone-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/50 transition-colors"
                  aria-label="Twitter / X"
                  title="Twitter / X Profile"
                >
                  <Twitter className="w-3.5 h-3.5" />
                  <span className="icon-btn__shine" />
                </a>
              )}
              {data.email && (
                <a
                  href={`mailto:${data.email}`}
                  className="icon-btn-glow relative overflow-hidden p-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-stone-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/50 transition-colors"
                  aria-label="Email"
                  title="Email Direct"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span className="icon-btn__shine" />
                </a>
              )}
            </div>

            {/* Quick Action: Download Flight Log / CV */}
            <button
              onClick={handleDownloadCv}
              className="icon-btn-glow relative overflow-hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-[11px] font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
              title="Download Soumadip Das CV immediately"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-3 h-3 text-white" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-3 h-3 text-white" />
                  <span>Download CV</span>
                </>
              )}
              <span className="icon-btn__shine" />
            </button>
          </div>

          {/* Telemetry Toggle Bar */}
          <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 px-1">
            <span className="flex items-center gap-1 text-cyan-400/70">
              <Compass className="w-2.5 h-2.5" />
              <span>ORBIT: VERIFIED</span>
            </span>
            <button
              onClick={() => setShowTelemetry(!showTelemetry)}
              className="hover:text-cyan-300 underline transition-colors cursor-pointer"
            >
              {showTelemetry ? '[-] Close Specs' : '[+] Telemetry Specs'}
            </button>
          </div>

          {/* Expandable Telemetry Drawer */}
          {showTelemetry && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-1 p-2.5 rounded-xl bg-black/60 border border-cyan-800/40 text-[10px] font-mono space-y-1 text-cyan-200/90"
            >
              <div className="flex justify-between border-b border-cyan-900/50 pb-1">
                <span className="text-stone-400">PILOT:</span>
                <span className="text-white font-bold">{data.name}</span>
              </div>
              <div className="flex justify-between border-b border-cyan-900/50 pb-1">
                <span className="text-stone-400">ACADEMICS:</span>
                <span>HIT B.Tech IT (9.16 CGPA)</span>
              </div>
              <div className="flex justify-between border-b border-cyan-900/50 pb-1">
                <span className="text-stone-400">CORE SYSTEM:</span>
                <span>Python, GenAI, Full-Stack</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">FLAGSHIP:</span>
                <span className="text-amber-300">Tejas Winner (UPI Fraud AI)</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Dynamic Cursor-Tracking Glowing Border Effect */}
      <GlowingEffect spread={230} borderWidth={1.5} glowColor="#00f0ff" />
    </div>
  );
};

export const NsscProfileCard = CosmicProfileCard;
