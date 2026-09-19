import React from 'react';
import { User, Code2, Briefcase, Award, MapPin, CheckCircle2, Sparkles, Mail, Orbit, Cpu, Shield, Database } from 'lucide-react';
import { motion } from 'motion/react';
import { PortfolioData } from '../types';
import { VoicePlayer } from './VoicePlayer';

interface AboutProps {
  data: PortfolioData;
  onOpenResume?: () => void;
}

export const About: React.FC<AboutProps> = ({ data, onOpenResume }) => {
  const highlights = [
    { label: 'Hackathon Leadership', value: '1× Winner 🏆', icon: Award },
    { label: 'HIT Academic CGPA', value: '9.16 / 10.0', icon: Cpu },
    { label: 'Professional Roles', value: '10+ Positions', icon: Briefcase },
    { label: 'Board Examination Scores', value: '93% & 92%', icon: Shield },
  ];

  return (
    <section id="about" className="py-24 px-4 sm:px-6 border-t border-white/10 bg-[#050811] text-white relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-semibold mb-3">
              <Orbit className="w-3.5 h-3.5 text-cyan-400" />
              <span>01 // MISSION DOSSIER</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              About & Background
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <VoicePlayer
              textToSpeak={data.bio.join(' ')}
              authorName={data.name}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Bio Text */}
          <div className="lg:col-span-7 space-y-5 text-stone-300 text-base leading-relaxed">
            <p>
              I’m <strong className="text-white">Soumadip Das</strong>, an Information Technology scholar and <strong className="text-cyan-300 font-semibold">AI & Software Developer</strong> passionate about architecting intelligent, reliable, and high-performance technology systems. As a <strong className="text-amber-300">1× Hackathon Winner</strong>, I lead multidisciplinary teams to build production-grade platforms addressing mission-critical problems.
            </p>

            <p>
              I have hands-on engineering proficiency in <strong className="text-white">Python, Java, C/C++, SQL, SQLite, HTML, CSS, JavaScript, Git, GitHub, Power BI, and Generative AI</strong>. My project leadership includes <strong className="text-cyan-300 font-semibold">SecureFlow AI</strong>, an AI-powered real-time UPI fraud telemetry and prevention platform engineered for a national-scale hackathon.
            </p>

            <p>
              Beyond core software engineering, my background encompasses <strong className="text-white">AI model training, scientific research at NSRI, digital marketing, developer community advocacy, and team leadership</strong>.
            </p>

            {/* Focus Chips */}
            <div className="p-5 rounded-2xl bg-white/5 border border-cyan-500/20 text-sm backdrop-blur-md">
              <strong className="text-cyan-300 font-mono text-xs uppercase tracking-wider block mb-2.5">
                // ACTIVE RESEARCH & ENGINEERING FOCUS
              </strong>
              <div className="flex flex-wrap gap-2 text-xs font-mono font-semibold">
                <span className="px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-400/30 text-cyan-200">Applied AI</span>
                <span className="px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-400/30 text-cyan-200">Software Architecture</span>
                <span className="px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-400/30 text-cyan-200">Cybersecurity & Fraud Telemetry</span>
                <span className="px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-400/30 text-cyan-200">FinTech</span>
                <span className="px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-400/30 text-cyan-200">Generative AI</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-stone-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                Robust Microservice Systems
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-stone-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                Machine Learning & Anomaly Detection
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-stone-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                High-Impact Team Leadership
              </span>
            </div>
          </div>

          {/* Quick Metrics & Stats Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 shadow-xs flex flex-col justify-between transition-all"
                >
                  <Icon className="w-5 h-5 text-cyan-400 mb-3" />
                  <span className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
                    {item.value}
                  </span>
                  <span className="text-xs font-medium text-stone-400 mt-1.5">
                    {item.label}
                  </span>
                </motion.div>
              );
            })}

            {/* Direct Verified Contact Snippet (No Phone) */}
            <div className="col-span-2 p-5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-stone-300 space-y-2.5 font-mono">
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Coordinates:</span>
                <span className="text-cyan-300 font-semibold">{data.location || 'Haldia, West Bengal, India (22.06°N 88.06°E)'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Verified Email:</span>
                <a href={`mailto:${data.email}`} className="text-cyan-300 font-semibold hover:underline">
                  {data.email}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Institution:</span>
                <span className="text-white">Haldia Institute of Technology</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
