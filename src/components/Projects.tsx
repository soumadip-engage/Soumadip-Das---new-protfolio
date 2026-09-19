import React, { useState } from 'react';
import { ExternalLink, Github, Plus, Film, Play, Pause, Award, ShieldAlert, ShieldCheck, Activity, BarChart3, ArrowRight, Zap, RefreshCw, Orbit } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PortfolioData, Project } from '../types';

interface ProjectsProps {
  data: PortfolioData;
}

export const Projects: React.FC<ProjectsProps> = ({ data }) => {
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  // UPI Fraud Live Simulator State
  const [showUpiSim, setShowUpiSim] = useState(false);
  const [simTxnType, setSimTxnType] = useState<'safe' | 'fraud' | 'high_value'>('safe');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    score: number;
    status: 'APPROVED' | 'FLAGGED' | 'CHALLENGE';
    flags: string[];
    latency: number;
  }>({
    score: 12,
    status: 'APPROVED',
    flags: ['Device MAC Match', 'Known Geolocation', 'Standard Merchant Category'],
    latency: 38,
  });

  // Economic Impact Explorer State
  const [showEconExplorer, setShowEconExplorer] = useState(false);
  const [selectedYear, setSelectedYear] = useState<2020 | 2021 | 2022 | 2023>(2022);

  const econData = {
    2020: {
      energyIndex: 42,
      inflation: 3.2,
      supplyChainDisruption: 55,
      foodIndex: 61,
      summary: 'Initial pandemic shock, transport bottlenecks, and fiscal stimulus stabilization.',
    },
    2021: {
      energyIndex: 68,
      inflation: 4.7,
      supplyChainDisruption: 78,
      foodIndex: 75,
      summary: 'Global demand rebound meets severe shipping port congestion and semiconductor shortages.',
    },
    2022: {
      energyIndex: 98,
      inflation: 8.8,
      supplyChainDisruption: 92,
      foodIndex: 94,
      summary: 'Outbreak of Ukraine war triggers historic European natural gas surges and grain export sanctions.',
    },
    2023: {
      energyIndex: 76,
      inflation: 5.8,
      supplyChainDisruption: 64,
      foodIndex: 82,
      summary: 'Aggressive central bank rate hikes begin cooling commodity spirals with re-routed supply lanes.',
    },
  };

  const runUpiSimulation = (type: 'safe' | 'fraud' | 'high_value') => {
    setSimTxnType(type);
    setIsScanning(true);

    setTimeout(() => {
      setIsScanning(false);
      if (type === 'safe') {
        setScanResult({
          score: 8,
          status: 'APPROVED',
          flags: ['Device Fingerprint Verified', 'Standard Velocity', 'Regular P2M Merchant'],
          latency: 24,
        });
      } else if (type === 'high_value') {
        setScanResult({
          score: 61,
          status: 'CHALLENGE',
          flags: ['Amount 12× 30-day mean', 'Midnight transaction timestamp', 'Biometric step-up requested'],
          latency: 42,
        });
      } else {
        setScanResult({
          score: 94,
          status: 'FLAGGED',
          flags: ['Velocity Spike: 14 txns/min', 'Impossible Geolocation Travel (Mumbai -> London)', 'Known Mule Account UPI ID'],
          latency: 29,
        });
      }
    }, 650);
  };

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 border-t border-white/10 bg-[#050811] text-white relative overflow-hidden">
      {/* Space ambient lighting */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-cyan-600/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Heading */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-semibold mb-3">
            <Orbit className="w-3.5 h-3.5 text-cyan-400" />
            <span>03 // FLAGSHIP WORKS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Featured Systems & Deployments
          </h2>
          <p className="text-sm sm:text-base text-stone-300 mt-2 max-w-xl">
            Engineered by Soumadip Das • Tejas India Hackathon Winner (Team Lead) & Quantitative Anomaly Systems.
          </p>
        </div>

        {/* Two Flagship Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.projects.slice(0, 2).map((project, idx) => {
            const isUpiProject = project.title.toLowerCase().includes('upi') || idx === 0;
            const isWarProject = project.title.toLowerCase().includes('war') || project.title.toLowerCase().includes('ripple') || idx === 1;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.15 }}
                className="group flex flex-col rounded-3xl bg-[#090e1f] border border-cyan-500/20 hover:border-cyan-400/60 shadow-[0_0_25px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] overflow-hidden transition-all duration-300"
              >
                {/* Media Container with Badges */}
                <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                  {playingVideoId === project.id && project.videoUrl ? (
                    <video
                      src={project.videoUrl}
                      autoPlay
                      controls
                      loop
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <img
                        src={project.imageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop'}
                        alt={project.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop';
                        }}
                      />

                      {/* Hackathon Ribbon for UPI Project */}
                      {isUpiProject && (
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-xs font-bold font-mono shadow-md border border-amber-300">
                          <Award className="w-3.5 h-3.5 fill-current" />
                          <span>Tejas India Hackathon Winner 🏆</span>
                        </div>
                      )}

                      {/* Research Tag for War Project */}
                      {isWarProject && (
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-900/90 text-cyan-200 border border-cyan-400/50 text-xs font-semibold font-mono shadow-md backdrop-blur-sm">
                          <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Macroeconomic Research</span>
                        </div>
                      )}

                      {/* Category tag on right */}
                      {project.category && (
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-white text-[11px] font-mono font-medium border border-white/10 shadow-xs">
                          {project.category}
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* Project Info */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed mb-4">
                      {project.description}
                    </p>
                  </div>

                  <div>
                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-1 rounded-lg bg-cyan-950/50 border border-cyan-800/40 text-cyan-200 text-[11px] font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Interactive Animated Feature Buttons */}
                    <div className="space-y-3 pt-4 border-t border-white/10">
                      {isUpiProject && (
                        <button
                          onClick={() => setShowUpiSim(!showUpiSim)}
                          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white text-xs font-bold font-mono flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          <span>{showUpiSim ? 'Close Live Risk Simulator' : 'Test Live UPI Threat Simulator'}</span>
                        </button>
                      )}

                      {isWarProject && (
                        <button
                          onClick={() => setShowEconExplorer(!showEconExplorer)}
                          className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold font-mono flex items-center justify-center gap-2 border border-white/10 transition-all cursor-pointer"
                        >
                          <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{showEconExplorer ? 'Close Economic Explorer' : 'Explore Macroeconomic Data (2020-2023)'}</span>
                        </button>
                      )}

                      {/* Links Row */}
                      <div className="flex items-center justify-between pt-1">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 font-mono transition-colors"
                          >
                            <span>Live Telemetry</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-stone-300 hover:text-white transition-colors"
                          >
                            <Github className="w-3.5 h-3.5" />
                            <span>Source Code</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* INTERACTIVE MODULE 1: Live UPI Fraud Telemetry Simulator */}
        <AnimatePresence>
          {showUpiSim && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 overflow-hidden"
            >
              <div className="p-6 sm:p-8 rounded-3xl bg-[#080d1e] text-white border border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.25)]">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <span>SecureFlow AI: Live UPI Risk Assessment Simulator</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
                          Tejas India Hackathon Winner
                        </span>
                      </h4>
                      <p className="text-xs text-stone-400 mt-0.5">
                        Simulate real-time payment packets and watch the anomaly detection engine calculate risk in &lt;50ms.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowUpiSim(false)}
                    className="text-xs text-stone-400 hover:text-white font-mono cursor-pointer"
                  >
                    [ Close Simulator ]
                  </button>
                </div>

                {/* Simulation Scenario Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  <button
                    onClick={() => runUpiSimulation('safe')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      simTxnType === 'safe'
                        ? 'bg-emerald-950/70 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="text-xs font-bold text-white block font-mono">Scenario A: Normal Payment</span>
                    <span className="text-[11px] text-stone-400 block mt-1 font-mono">₹450 • Trusted Device • Known Merchant</span>
                  </button>

                  <button
                    onClick={() => runUpiSimulation('high_value')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      simTxnType === 'high_value'
                        ? 'bg-amber-950/70 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="text-xs font-bold text-white block font-mono">Scenario B: High-Value Anomaly</span>
                    <span className="text-[11px] text-stone-400 block mt-1 font-mono">₹75,000 • New Hardware MAC • Late Night</span>
                  </button>

                  <button
                    onClick={() => runUpiSimulation('fraud')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      simTxnType === 'fraud'
                        ? 'bg-red-950/70 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="text-xs font-bold text-white block font-mono">Scenario C: Coordinated Mule Attack</span>
                    <span className="text-[11px] text-stone-400 block mt-1 font-mono">₹1,90,000 • Velocity Spike • Flagged Mule</span>
                  </button>
                </div>

                {/* Live Inspection Screen */}
                <div className="p-5 rounded-2xl bg-black/60 border border-white/10 font-mono space-y-4">
                  <div className="flex items-center justify-between text-xs pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isScanning ? 'bg-amber-400 animate-ping' : 'bg-cyan-400'}`} />
                      <span className="text-stone-300">
                        STATUS: {isScanning ? 'PROCESSING TELEMETRY PACKET...' : 'INFERENCE COMPLETE'}
                      </span>
                    </div>
                    <span className="text-cyan-400 font-bold">LATENCY: {scanResult.latency}ms</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-stone-400 block mb-1 text-[11px]">ANOMALY RISK SCORE:</span>
                      <div className="flex items-baseline gap-2">
                        <span className={`text-3xl font-extrabold ${
                          scanResult.score < 30 ? 'text-emerald-400' : scanResult.score < 70 ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          {scanResult.score}/100
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          scanResult.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' :
                          scanResult.status === 'CHALLENGE' ? 'bg-amber-950 text-amber-300 border border-amber-700' :
                          'bg-red-950 text-red-300 border border-red-700'
                        }`}>
                          {scanResult.status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-stone-400 block mb-1 text-[11px]">ENGINE HEURISTIC FLAGS:</span>
                      <ul className="space-y-1 text-stone-300 text-[11px]">
                        {scanResult.flags.map((flag, fIdx) => (
                          <li key={fIdx} className="flex items-center gap-1.5">
                            <span className="text-cyan-400">›</span>
                            <span>{flag}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* INTERACTIVE MODULE 2: Macroeconomic Shock Data Explorer */}
        <AnimatePresence>
          {showEconExplorer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 overflow-hidden"
            >
              <div className="p-6 sm:p-8 rounded-3xl bg-[#080d1e] text-white border border-cyan-500/40 shadow-2xl">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">
                        Global Supply-Chain Shock Telemetry (2020–2023)
                      </h4>
                      <p className="text-xs text-stone-400 mt-0.5">
                        Quantitative econometric model tracking price shocks, transport stress, and fiscal inflation.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowEconExplorer(false)}
                    className="text-xs text-stone-400 hover:text-white font-mono cursor-pointer"
                  >
                    [ Close Explorer ]
                  </button>
                </div>

                {/* Year Selection Tabs */}
                <div className="flex gap-2 mb-6">
                  {([2020, 2021, 2022, 2023] as const).map((year) => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        selectedYear === year
                          ? 'bg-cyan-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                          : 'bg-white/5 text-stone-300 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {year} Data
                    </button>
                  ))}
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex justify-between text-xs font-semibold text-stone-300 mb-1.5 font-mono">
                      <span>Energy Price Index</span>
                      <span className="text-cyan-300 font-bold">{econData[selectedYear].energyIndex} / 100</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${econData[selectedYear].energyIndex}%` }}
                        transition={{ duration: 0.5 }}
                        className="bg-cyan-400 h-2 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex justify-between text-xs font-semibold text-stone-300 mb-1.5 font-mono">
                      <span>Annual Headline CPI</span>
                      <span className="text-sky-300 font-bold">{econData[selectedYear].inflation}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, econData[selectedYear].inflation * 10)}%` }}
                        transition={{ duration: 0.5 }}
                        className="bg-sky-400 h-2 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex justify-between text-xs font-semibold text-stone-300 mb-1.5 font-mono">
                      <span>Freight & Logistics Stress</span>
                      <span className="text-amber-300 font-bold">{econData[selectedYear].supplyChainDisruption} / 100</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${econData[selectedYear].supplyChainDisruption}%` }}
                        transition={{ duration: 0.5 }}
                        className="bg-amber-400 h-2 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex justify-between text-xs font-semibold text-stone-300 mb-1.5 font-mono">
                      <span>Food Commodity Index</span>
                      <span className="text-purple-300 font-bold">{econData[selectedYear].foodIndex} / 100</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${econData[selectedYear].foodIndex}%` }}
                        transition={{ duration: 0.5 }}
                        className="bg-purple-400 h-2 rounded-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-stone-200 font-mono">
                  <span className="font-bold text-cyan-300 block mb-1">Key Research Takeaway ({selectedYear}):</span>
                  <p className="leading-relaxed">{econData[selectedYear].summary}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
