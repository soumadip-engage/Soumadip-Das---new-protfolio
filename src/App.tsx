import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BlackHoleEntrance } from './components/portal/BlackHoleEntrance';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VideoSection } from './components/VideoSection';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Experience } from './components/Experience';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ResumeModal } from './components/ResumeModal';
import { SectionNavigator, PORTFOLIO_SECTIONS } from './components/transitions/SectionNavigator';
import { SpaceWarpTransition } from './components/transitions/SpaceWarpTransition';
import { SlideFlightController } from './components/transitions/SlideFlightController';
import { portalSound } from './utils/portalAudio';
import { PortfolioData } from './types';
import { defaultPortfolioData } from './data/defaultData';
import { getStoredAvatar, getStoredVoiceAudio } from './utils/mediaStorage';

export default function App() {
  const [data] = useState<PortfolioData>(() => {
    const stored = getStoredAvatar();
    if (stored) {
      return {
        ...defaultPortfolioData,
        avatarUrl: stored,
        videoShowcase: defaultPortfolioData.videoShowcase
          ? { ...defaultPortfolioData.videoShowcase, posterUrl: stored }
          : undefined,
      };
    }
    return defaultPortfolioData;
  });

  const [hasEntered, setHasEntered] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0); // 0: Home, 1: About, 2: Reel, 3: Skills, 4: Projects, 5: Experience, 6: Connect
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'backward'>('forward');
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  // Synchronize stored avatar and voice to persistent server storage on load
  useEffect(() => {
    const syncPersistedMedia = async () => {
      try {
        const avatar = getStoredAvatar();
        const voice = await getStoredVoiceAudio();
        if (avatar || voice) {
          await fetch('/api/sync-media', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ avatar, voice }),
          });
        }
      } catch (err) {
        console.warn('Persisted media sync check:', err);
      }
    };

    syncPersistedMedia();
  }, []);

  // Smooth cinematic space-warp transition between sections
  const handleSlideChange = useCallback(
    (targetIndex: number) => {
      if (isTransitioning || targetIndex === currentSlide) return;
      if (targetIndex < 0 || targetIndex >= PORTFOLIO_SECTIONS.length) return;

      const direction = targetIndex > currentSlide ? 'forward' : 'backward';
      setTransitionDirection(direction);
      setIsTransitioning(true);

      // Play cosmic warp whoosh audio
      portalSound.playSectionWarp();

      // Midpoint: Swap active slide content and scroll smoothly to top of viewport
      setTimeout(() => {
        setCurrentSlide(targetIndex);
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 380);

      // Complete transition
      setTimeout(() => {
        setIsTransitioning(false);
      }, 850);
    },
    [isTransitioning, currentSlide]
  );

  const handleNext = useCallback(() => {
    if (currentSlide < PORTFOLIO_SECTIONS.length - 1) {
      handleSlideChange(currentSlide + 1);
    } else {
      // Loop back to main page
      handleSlideChange(0);
    }
  }, [currentSlide, handleSlideChange]);

  const handlePrev = useCallback(() => {
    if (currentSlide > 0) {
      handleSlideChange(currentSlide - 1);
    } else {
      setHasEntered(false); // Return to Black Hole Entrance
    }
  }, [currentSlide, handleSlideChange]);

  return (
    <div className="min-h-screen bg-[#050811] text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-200 antialiased relative">
      {/* 1. Cinematic Black Hole Singularity Entrance & Wormhole Gateway */}
      <AnimatePresence mode="wait">
        {!hasEntered && (
          <BlackHoleEntrance
            key="singularity-portal"
            data={data}
            onEnter={() => {
              setHasEntered(true);
              setCurrentSlide(0); // Start at Main Page
            }}
          />
        )}
      </AnimatePresence>

      {/* 2. Space Warp Overlay Transition Between Every Section Slide */}
      <SpaceWarpTransition
        isTransitioning={isTransitioning}
        direction={transitionDirection}
      />

      {/* 3. Main Portfolio View (Slide-by-Slide Cosmic Journey) */}
      {hasEntered && (
        <div className="relative min-h-screen flex flex-col">
          {/* Navigation Bar with Active Slide Telemetry */}
          <Navbar
            data={data}
            currentIndex={currentSlide}
            onSelectSection={handleSlideChange}
            onOpenResume={() => setIsResumeOpen(true)}
            onReturnToEntrance={() => setHasEntered(false)}
          />

          {/* Floating Slide Flight Controller Dock & Keyboard Navigator */}
          <SlideFlightController
            currentIndex={currentSlide}
            onNext={handleNext}
            onPrev={handlePrev}
            onJumpTo={handleSlideChange}
            onReturnToEntrance={() => setHasEntered(false)}
            disabled={isTransitioning}
          />

          {/* Active Section Slide Container with Cinematic Reveal */}
          <main className="flex-1 flex flex-col pt-16 sm:pt-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={`slide-${currentSlide}`}
                initial={{
                  opacity: 0,
                  scale: 0.95,
                  filter: 'blur(8px)',
                  y: transitionDirection === 'forward' ? 15 : -15,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  filter: 'blur(0px)',
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 1.04,
                  filter: 'blur(10px)',
                  y: transitionDirection === 'forward' ? -20 : 20,
                }}
                transition={{
                  duration: 0.72,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="w-full flex-1 flex flex-col"
              >
                {/* Slide 0: Main Page / Mission Command Hero */}
                {currentSlide === 0 && (
                  <Hero
                    data={data}
                    onOpenResume={() => setIsResumeOpen(true)}
                    onNextSection={() => handleSlideChange(1)}
                  />
                )}

                {/* Slide 1: About & Dossier */}
                {currentSlide === 1 && (
                  <About
                    data={data}
                    onOpenResume={() => setIsResumeOpen(true)}
                  />
                )}

                {/* Slide 2: Video Showreel & Interactive Systems */}
                {currentSlide === 2 && (
                  <VideoSection
                    showcase={data.videoShowcase}
                    data={data}
                  />
                )}

                {/* Slide 3: Flight Deck Skills & Radar */}
                {currentSlide === 3 && (
                  <Skills
                    data={data}
                  />
                )}

                {/* Slide 4: Mission Projects & Interactive Simulator */}
                {currentSlide === 4 && (
                  <Projects
                    data={data}
                  />
                )}

                {/* Slide 5: Experience & Timeline Milestones */}
                {currentSlide === 5 && (
                  <Experience
                    data={data}
                    onOpenResume={() => setIsResumeOpen(true)}
                  />
                )}

                {/* Slide 6: Comms Relay & Secure Contact Console */}
                {currentSlide === 6 && (
                  <Contact
                    data={data}
                  />
                )}

                {/* Section Navigation Bar at Bottom of Every Section */}
                <SectionNavigator
                  currentIndex={currentSlide}
                  onNext={handleNext}
                  onPrev={handlePrev}
                  onJumpTo={handleSlideChange}
                  onReturnToEntrance={() => setHasEntered(false)}
                  disabled={isTransitioning}
                />
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Space Mission Footer with Singularity Reset */}
          <Footer
            data={data}
            onReturnToEntrance={() => setHasEntered(false)}
          />

          {/* Official Verified Resume Modal */}
          <ResumeModal
            isOpen={isResumeOpen}
            onClose={() => setIsResumeOpen(false)}
            data={data}
          />
        </div>
      )}
    </div>
  );
}
