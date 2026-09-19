import React from 'react';
import { Terminal, Database, BrainCircuit, Wrench, Orbit, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { PortfolioData } from '../types';

interface SkillsProps {
  data: PortfolioData;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Programming Languages': <Terminal className="w-4 h-4 text-cyan-400" />,
  'Databases & Query Optimization': <Database className="w-4 h-4 text-sky-400" />,
  'AI, Data & Specialized': <BrainCircuit className="w-4 h-4 text-amber-400" />,
  'Development Tools & CS Fundamentals': <Wrench className="w-4 h-4 text-purple-400" />,
};

export const Skills: React.FC<SkillsProps> = ({ data }) => {
  return (
    <section id="skills" className="py-24 px-4 sm:px-6 border-t border-white/10 bg-[#070b18] text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-cyan-600/10 blur-[150px] rounded-full translate-y-24" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Heading */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-semibold mb-3">
            <Orbit className="w-3.5 h-3.5 text-cyan-400" />
            <span>02 // TECHNICAL ARSENAL</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Skills & Core Capabilities
          </h2>
          <p className="text-sm sm:text-base text-stone-300 mt-2 max-w-xl">
            Technical proficiencies spanning machine learning pipelines, cybersecurity telemetry, database modeling, and scalable full-stack development.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.skills.map((group, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -3 }}
              className="p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 shadow-xs backdrop-blur-md transition-all group"
            >
              <div className="flex items-center justify-between gap-2.5 mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-white/10 border border-white/10">
                    {CATEGORY_ICONS[group.name] || <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />}
                  </div>
                  <h3 className="font-bold text-white text-base tracking-tight font-mono">
                    {group.name}
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-cyan-400/70">
                  {group.skills.length} MODULES
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-3 py-1.5 rounded-xl bg-cyan-950/40 text-cyan-100 border border-cyan-800/50 hover:border-cyan-400/80 hover:text-cyan-300 hover:bg-cyan-900/50 text-xs font-mono transition-all cursor-default shadow-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
