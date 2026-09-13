import React, { useState, useEffect } from 'react';
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
import { PortfolioData } from './types';
import { defaultPortfolioData } from './data/defaultData';
import { getStoredAvatar, saveStoredAvatar, removeStoredAvatar } from './utils/mediaStorage';

export default function App() {
  const [data, setData] = useState<PortfolioData>(() => {
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
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isCustomAvatar, setIsCustomAvatar] = useState(false);

  useEffect(() => {
    setIsCustomAvatar(!!getStoredAvatar());
  }, []);

  const handleUpdateAvatar = (newAvatarUrl: string) => {
    saveStoredAvatar(newAvatarUrl);
    setIsCustomAvatar(true);
    setData((prev) => ({
      ...prev,
      avatarUrl: newAvatarUrl,
      videoShowcase: prev.videoShowcase
        ? { ...prev.videoShowcase, posterUrl: newAvatarUrl }
        : undefined,
    }));
  };

  const handleResetAvatar = () => {
    removeStoredAvatar();
    setIsCustomAvatar(false);
    setData((prev) => ({
      ...prev,
      avatarUrl: defaultPortfolioData.avatarUrl,
      videoShowcase: defaultPortfolioData.videoShowcase
        ? { ...defaultPortfolioData.videoShowcase, posterUrl: defaultPortfolioData.avatarUrl }
        : undefined,
    }));
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 antialiased">
      {/* Fixed Navbar with Resume and Contact Links */}
      <Navbar
        data={data}
        onOpenResume={() => setIsResumeOpen(true)}
      />

      {/* Main Content Sections */}
      <main>
        {/* 1. Hero Section with Typewriter, Voice Narration & Light styling */}
        <Hero
          data={data}
          onOpenResume={() => setIsResumeOpen(true)}
          onUpdateAvatar={handleUpdateAvatar}
          onResetAvatar={handleResetAvatar}
          isCustomAvatar={isCustomAvatar}
        />

        {/* 2. Video Showreel & Motion Showcase (Timeline synchronized with Audio Narration) */}
        {data.videoShowcase?.enabled && (
          <VideoSection
            showcase={data.videoShowcase}
            data={data}
          />
        )}

        {/* 3. About Section with Voice Read-Aloud */}
        <About
          data={data}
          onOpenResume={() => setIsResumeOpen(true)}
        />

        {/* 4. Skills & Expertise */}
        <Skills
          data={data}
        />

        {/* 5. Featured Projects with Live Simulator */}
        <Projects
          data={data}
        />

        {/* 6. Experience & Education Timeline */}
        <Experience
          data={data}
          onOpenResume={() => setIsResumeOpen(true)}
        />

        {/* 7. Contact Section with Voice Typing Dictation & Verified Channels */}
        <Contact
          data={data}
        />
      </main>

      {/* Footer */}
      <Footer data={data} />

      {/* Official Verified Resume / CV Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        data={data}
      />
    </div>
  );
}
