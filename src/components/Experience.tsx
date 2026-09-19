import React, { useState } from 'react';
import {
  Briefcase,
  GraduationCap,
  Building2,
  Award,
  Users,
  CheckCircle2,
  Sparkles,
  Filter,
  Download,
  Printer,
  FileText,
  Trophy,
  Globe,
  Terminal,
  CreditCard,
  Cloud,
  Rocket,
  Cpu,
  BrainCircuit,
  ShieldCheck,
  Zap,
  ExternalLink,
  ChevronRight,
  Orbit
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PortfolioData } from '../types';
import { downloadResumePdf } from '../utils/generatePdf';

interface ExperienceProps {
  data: PortfolioData;
  onOpenResume?: () => void;
}

interface BrandTheme {
  headline: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
}

const getExperienceBrandTheme = (company: string, role: string): BrandTheme => {
  const c = company.toLowerCase();
  const r = role.toLowerCase();

  if (c.includes('tejas') || c.includes('hackathon')) {
    return {
      headline: 'NATIONAL LEVEL HACKATHON • 1ST PLACE',
      badgeBg: 'bg-amber-500/10',
      badgeBorder: 'border-amber-300',
      badgeText: 'text-amber-300',
      iconBg: 'bg-gradient-to-br from-amber-400 to-amber-600',
      iconColor: 'text-stone-950',
      icon: <Trophy className="w-5 h-5 text-stone-950 fill-stone-950" />
    };
  }

  if (c.includes('nsri') || c.includes('research')) {
    return {
      headline: 'SCIENTIFIC RESEARCH • DATA & LITERATURE',
      badgeBg: 'bg-cyan-950/60',
      badgeBorder: 'border-cyan-400/40',
      badgeText: 'text-cyan-300',
      iconBg: 'bg-gradient-to-br from-cyan-500 to-blue-600',
      iconColor: 'text-white',
      icon: <FileText className="w-5 h-5 text-white" />
    };
  }

  if (c.includes('mercor')) {
    return {
      headline: 'ARTIFICIAL INTELLIGENCE & EVALUATION',
      badgeBg: 'bg-purple-950/60',
      badgeBorder: 'border-purple-400/40',
      badgeText: 'text-purple-300',
      iconBg: 'bg-gradient-to-br from-purple-500 to-indigo-600',
      iconColor: 'text-white',
      icon: <BrainCircuit className="w-5 h-5 text-white" />
    };
  }

  if (c.includes('gfg') || c.includes('geeksforgeeks')) {
    return {
      headline: 'TECHNICAL ADVOCACY & CAMPUS LEAD',
      badgeBg: 'bg-emerald-950/60',
      badgeBorder: 'border-emerald-400/40',
      badgeText: 'text-emerald-300',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-green-700',
      iconColor: 'text-white',
      icon: <Terminal className="w-5 h-5 text-white" />
    };
  }

  if (c.includes('paytm')) {
    return {
      headline: 'FINTECH OPERATIONS & STRATEGY',
      badgeBg: 'bg-sky-950/60',
      badgeBorder: 'border-sky-400/40',
      badgeText: 'text-sky-300',
      iconBg: 'bg-gradient-to-br from-sky-400 to-blue-700',
      iconColor: 'text-white',
      icon: <CreditCard className="w-5 h-5 text-white" />
    };
  }

  if (c.includes('imun')) {
    return {
      headline: 'GLOBAL DIPLOMATIC OUTREACH',
      badgeBg: 'bg-blue-950/60',
      badgeBorder: 'border-blue-400/40',
      badgeText: 'text-blue-300',
      iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-700',
      iconColor: 'text-white',
      icon: <Globe className="w-5 h-5 text-white" />
    };
  }

  return {
    headline: 'ENGINEERING & LEADERSHIP',
    badgeBg: 'bg-cyan-950/60',
    badgeBorder: 'border-cyan-400/40',
    badgeText: 'text-cyan-300',
    iconBg: 'bg-gradient-to-br from-cyan-600 to-slate-800',
    iconColor: 'text-white',
    icon: <Briefcase className="w-5 h-5 text-white" />
  };
};

const getCertificateBrandTheme = (name: string, issuer: string) => {
  const n = name.toLowerCase();
  const iss = issuer.toLowerCase();

  if (n.includes('google') || iss.includes('google')) {
    return {
      headline: 'GENERATIVE AI & CLOUD',
      iconBg: 'bg-gradient-to-br from-blue-500 via-green-500 to-amber-500 text-white',
      accentBorder: 'hover:border-cyan-400',
      icon: <Cloud className="w-4 h-4 text-white" />
    };
  }

  if (n.includes('deloitte') || iss.includes('deloitte')) {
    return {
      headline: 'CYBERSECURITY SIMULATION',
      iconBg: 'bg-gradient-to-br from-slate-900 to-emerald-600 text-white',
      accentBorder: 'hover:border-emerald-400',
      icon: <ShieldCheck className="w-4 h-4 text-white" />
    };
  }

  if (n.includes('goldman') || iss.includes('goldman')) {
    return {
      headline: 'GLOBAL OPERATIONS SIMULATION',
      iconBg: 'bg-gradient-to-br from-blue-900 to-amber-500 text-white',
      accentBorder: 'hover:border-sky-400',
      icon: <Award className="w-4 h-4 text-white" />
    };
  }

  if (n.includes('hp') || iss.includes('hp')) {
    return {
      headline: 'CRITICAL THINKING IN AI',
      iconBg: 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white',
      accentBorder: 'hover:border-cyan-400',
      icon: <BrainCircuit className="w-4 h-4 text-white" />
    };
  }

  if (n.includes('tcs') || iss.includes('tcs')) {
    return {
      headline: 'CORPORATE PRESENTATION & SOFT SKILLS',
      iconBg: 'bg-gradient-to-br from-purple-700 to-indigo-800 text-white',
      accentBorder: 'hover:border-purple-400',
      icon: <Sparkles className="w-4 h-4 text-white" />
    };
  }

  return {
    headline: 'TECHNICAL CREDENTIAL',
    iconBg: 'bg-gradient-to-br from-cyan-600 to-teal-700 text-white',
    accentBorder: 'hover:border-cyan-400',
    icon: <Award className="w-4 h-4 text-white" />
  };
};

export const Experience: React.FC<ExperienceProps> = ({ data, onOpenResume }) => {
  const [filter, setFilter] = useState<'all' | 'engineering' | 'research' | 'leadership'>('all');

  const filteredExperiences = data.experiences.filter((exp) => {
    if (filter === 'all') return true;
    const text = (exp.role + ' ' + exp.company + ' ' + exp.description).toLowerCase();
    if (filter === 'engineering') {
      return text.includes('engineer') || text.includes('hackathon') || text.includes('ai') || text.includes('full stack');
    }
    if (filter === 'research') {
      return text.includes('research') || text.includes('nsri') || text.includes('trainer') || text.includes('academic');
    }
    if (filter === 'leadership') {
      return text.includes('ambassador') || text.includes('lead') || text.includes('chapter') || text.includes('partner') || text.includes('imun') || text.includes('paytm');
    }
    return true;
  });

  return (
    <section id="experience" className="py-24 px-4 sm:px-6 border-t border-white/10 bg-[#070b18] text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 -left-48 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Heading */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-semibold mb-3">
            <Orbit className="w-3.5 h-3.5 text-cyan-400" />
            <span>04 // CAREER TRAJECTORY & CREDENTIALS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Experience & Academic Records
          </h2>
          <p className="text-sm sm:text-base text-stone-300 mt-2 max-w-xl">
            Track record across hackathon championship, AI model training, NSRI research, and developer leadership.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Work & Leadership Experience Column */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2 text-white font-bold text-base font-mono">
                  <Briefcase className="w-4 h-4 text-cyan-400" />
                  <span>Roles & Positions ({data.experiences.length})</span>
                </div>

                {/* Interactive Filter Pills */}
                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 backdrop-blur-md">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${
                      filter === 'all' ? 'bg-cyan-600 text-white font-bold' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    All ({data.experiences.length})
                  </button>
                  <button
                    onClick={() => setFilter('engineering')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${
                      filter === 'engineering' ? 'bg-cyan-600 text-white font-bold' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    Engineering
                  </button>
                  <button
                    onClick={() => setFilter('research')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${
                      filter === 'research' ? 'bg-cyan-600 text-white font-bold' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    Research
                  </button>
                  <button
                    onClick={() => setFilter('leadership')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${
                      filter === 'leadership' ? 'bg-cyan-600 text-white font-bold' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    Leadership
                  </button>
                </div>
              </div>

              {/* Roles Timeline with Colorful Logos and Headlines */}
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {filteredExperiences.map((item, idx) => {
                    const theme = getExperienceBrandTheme(item.company, item.role);
                    const isHackathonWin = item.company.toLowerCase().includes('tejas') || item.role.toLowerCase().includes('winner');

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25, delay: idx * 0.04 }}
                        className={`group p-5 rounded-2xl transition-all border shadow-xs ${
                          isHackathonWin
                            ? 'bg-amber-950/30 border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                            : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-cyan-400/50'
                        }`}
                      >
                        {/* Distinct Brand Header & Headline */}
                        <div className="flex items-start gap-3.5 mb-3">
                          {/* Colorful Company Emblem / Logo */}
                          <div className={`w-11 h-11 rounded-xl shrink-0 flex items-center justify-center shadow-xs ${theme.iconBg}`}>
                            {theme.icon}
                          </div>

                          <div className="flex-1 min-w-0">
                            {/* Colorful Headline Tag */}
                            <span className="block text-[10px] font-mono font-bold tracking-wider uppercase text-cyan-400 mb-0.5">
                              {theme.headline}
                            </span>

                            <div className="flex flex-wrap items-center justify-between gap-1.5">
                              <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors font-mono">
                                {item.role}
                              </h3>
                              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-cyan-200 font-medium">
                                {item.period}
                              </span>
                            </div>

                            <p className="text-xs font-semibold text-stone-300 mt-0.5 flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-stone-400" />
                              <span>{item.company}</span>
                            </p>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-stone-300 leading-relaxed mb-3 pl-1">
                          {item.description}
                        </p>

                        {/* Technology Badges */}
                        {item.skills && item.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pl-1">
                            {item.skills.map((skill, sIdx) => (
                              <span
                                key={sIdx}
                                className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-800/40 text-cyan-200"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Education & Certifications Column */}
          <div className="lg:col-span-6 space-y-8">
            {/* Education Sub-section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-white font-bold text-base font-mono">
                  <GraduationCap className="w-4 h-4 text-cyan-400" />
                  <span>Academic Qualifications</span>
                </div>
                <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-400/40 px-2.5 py-0.5 rounded-full font-bold">
                  Verified Records
                </span>
              </div>

              <div className="space-y-4">
                {data.educations.map((edu) => (
                  <motion.div
                    key={edu.id}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h4 className="text-sm font-bold text-white font-mono">
                        {edu.degree}
                      </h4>
                      <span className="text-[11px] font-mono text-stone-400 shrink-0">
                        {edu.period}
                      </span>
                    </div>

                    <p className="text-xs text-stone-300 font-semibold mb-2">
                      {edu.institution}
                    </p>

                    {edu.score && (
                      <div className="mb-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold font-mono px-2.5 py-0.5 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                          {edu.score}
                        </span>
                      </div>
                    )}

                    {edu.details && (
                      <p className="text-xs text-stone-400 leading-relaxed">
                        {edu.details}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Certifications & Industry Simulations */}
            {data.certifications && data.certifications.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-4 text-white font-bold text-base font-mono">
                  <Award className="w-4 h-4 text-cyan-400" />
                  <span>Certifications & Simulation Honors</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.certifications.map((cert) => {
                    const certTheme = getCertificateBrandTheme(cert.name, cert.issuer);

                    return (
                      <motion.div
                        key={cert.id}
                        whileHover={{ y: -2 }}
                        className={`p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/40 transition-all ${certTheme.accentBorder}`}
                      >
                        <div className="flex items-center gap-2.5 mb-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-2xs shrink-0 ${certTheme.iconBg}`}>
                            {certTheme.icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-cyan-400 block truncate">
                              {certTheme.headline}
                            </span>
                            <span className="text-xs font-bold text-white block leading-tight truncate">
                              {cert.name}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1 border-t border-white/10 font-mono">
                          <span className="text-stone-300 font-medium truncate max-w-[170px]">{cert.issuer}</span>
                          {cert.year && <span className="text-cyan-400 shrink-0 font-semibold">{cert.year}</span>}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Resume Download Feature Card */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-cyan-950/60 to-slate-950 text-white shadow-xl border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 text-center sm:text-left">
                <div className="p-3 rounded-2xl bg-cyan-600/20 border border-cyan-400/40 text-cyan-300">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-mono">
                    Official Resume & Academic Profile
                  </h4>
                  <p className="text-xs text-stone-300 mt-0.5">
                    Download or print Soumadip Das's comprehensive CV with coursework, verified scores & hackathon records.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    downloadResumePdf(data);
                    if (onOpenResume) {
                      onOpenResume();
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer font-mono"
                  title="Download Soumadip Das Resume (PDF)"
                >
                  <Download className="w-4 h-4" />
                  <span>Download CV (PDF)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
