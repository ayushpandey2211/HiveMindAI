// src/pages/LandingPage.jsx
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AboutSection from "../components/AboutSection";
import LaunchReveal from "../components/LaunchReveal";

const LandingPage = () => {
  const [isLaunching, setIsLaunching] = useState(true);

  return (
    <div className="relative w-full min-h-screen bg-[#09090b] text-white selection:bg-blue-500/30">
      
      {/* 1. Launch Reveal Overlay */}
      <AnimatePresence>
        {isLaunching && (
          <LaunchReveal onComplete={() => setIsLaunching(false)} />
        )}
      </AnimatePresence>

      {/* 2. Main Site Content (Hidden or Un-interactable while launching) */}
      <div className={isLaunching ? "opacity-0" : "opacity-100 transition-opacity duration-1000"}>
        <Navbar />
        <main className="relative z-10">
          <Hero />
          <AboutSection />
        </main>

        <footer className="relative z-10 py-10 px-6 text-center text-gray-600 text-sm border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div>© 2026 HiveMind AI. Intelligence Through Unity.</div>
            <div className="flex gap-6 font-mono text-xs">
              <a href="#" className="hover:text-gray-400">Security</a>
              <a href="#" className="hover:text-gray-400">Architecture</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;