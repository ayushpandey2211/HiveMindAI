// src/components/Hero.jsx
import { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Sparkles, ArrowRight, BrainCircuit, Mic, ShieldCheck, Database, BotMessageSquare, FileText, Cpu, Zap } from 'lucide-react';
import NetworkNodes from './NetworkNodes';
import Particles from './Particles';

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX - innerWidth / 2) / (innerWidth / 2);
    const y = (clientY - innerHeight / 2) / (innerHeight / 2);
    setMousePosition({ x, y });
  };

  const springX = useSpring(0, { stiffness: 50, damping: 20 });
  const springY = useSpring(0, { stiffness: 50, damping: 20 });

  useEffect(() => {
    springX.set(mousePosition.x);
    springY.set(mousePosition.y);
  }, [mousePosition, springX, springY]);

  // 🟢 3D TRANSFORMATIONS
  const rotateX = useTransform(springY, [-1, 1], [10, -10]); // Tilt up/down
  const rotateY = useTransform(springX, [-1, 1], [-15, 15]); // Tilt left/right
  const translateX = useTransform(springX, [-1, 1], [-30, 30]);

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center pt-20 px-6 md:px-12 overflow-hidden bg-[#09090b] perspective-[1200px]"
    >
      <Particles />
      <NetworkNodes />

      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* LEFT CONTENT */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="lg:col-span-5 space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono tracking-widest uppercase">
            <Zap size={14} className="animate-pulse" /> Consensus Engine v2.0
          </div>

          <h1 className="text-6xl md:text-8xl font-black leading-tight text-white">
            Future <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Synthesized
            </span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed">
            Where others see noise, we see consensus. Deploy a swarm of AI agents to verify, critique, and perfect every answer.
          </p>

          <div className="flex gap-4">
            <motion.button whileHover={{ scale: 1.05 }} className="px-8 py-4 bg-blue-600 rounded-2xl font-bold flex items-center gap-2">
              Get Started <ArrowRight size={20} />
            </motion.button>
            <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold">Documentation</button>
          </div>
        </motion.div>

        {/* RIGHT CONTENT: THE 3D HIVE STAGE */}
        <motion.div 
          style={{ rotateX, rotateY, x: translateX, transformStyle: "preserve-3d" }}
          className="lg:col-span-7 relative h-[600px] flex items-center justify-center"
        >
          {/* 🌟 Central Energy Core */}
          <div className="relative w-80 h-80 flex items-center justify-center">
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 bg-blue-500/20 blur-[80px] rounded-full"
            />
            <div className="relative z-10 p-10 rounded-full border border-white/10 bg-white/5 backdrop-blur-3xl shadow-glow-blue animate-spin-slow">
              <Cpu size={60} className="text-blue-400" />
            </div>
          </div>

          {/* 🌟 Floating 3D "Logic" Card (Layered Forward) */}
          <motion.div 
            style={{ translateZ: 100 }}
            className="absolute top-10 left-0 p-6 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl flex gap-4 items-center"
          >
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <BrainCircuit className="text-blue-400" />
            </div>
            <div>
              <div className="text-xs font-mono text-blue-300">Logic_Agent</div>
              <div className="text-lg font-bold">Verification: 99%</div>
            </div>
          </motion.div>

          {/* 🌟 Floating 3D "Critic" Card (Layered Backward) */}
          <motion.div 
            style={{ translateZ: -50 }}
            className="absolute bottom-10 right-0 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex gap-4 items-center"
          >
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <ShieldCheck className="text-orange-400" />
            </div>
            <div>
              <div className="text-xs font-mono text-orange-300">Critic_Module</div>
              <div className="text-lg font-bold">Conflict Resolved</div>
            </div>
          </motion.div>

          {/* 🌟 Small Decorative Elements filling the "Empty" space */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-1/2 -right-10 w-20 h-20 border border-white/10 rounded-full flex items-center justify-center bg-white/5"
          >
            <Database size={24} className="text-purple-400" />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;