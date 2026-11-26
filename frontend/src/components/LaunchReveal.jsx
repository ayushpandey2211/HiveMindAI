import { useState } from 'react';
import { motion } from 'framer-motion';
import { Hexagon } from 'lucide-react';

const LaunchReveal = ({ onComplete }) => {
  const [dots] = useState(() =>
    Array.from({ length: 20 }, () => ({
      x: Math.random() * 1000 - 500,
      y: Math.random() * 1000 - 500,
    }))
  );

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
      className="fixed inset-0 z-[100] bg-[#09090b] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* 🟢 Background Swarm Dots (Scattered to Centered) */}
      <div className="absolute inset-0 pointer-events-none">
        {dots.map((dot, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: dot.x, 
              y: dot.y, 
              opacity: 0 
            }}
            animate={{ 
              x: 0, 
              y: 0, 
              opacity: [0, 1, 0] 
            }}
            transition={{ 
              duration: 2, 
              delay: i * 0.05, 
              ease: "circOut" 
            }}
            className="absolute top-1/2 left-1/2 w-1 h-1 bg-blue-500 rounded-full blur-[1px]"
          />
        ))}
      </div>

      {/* 🟢 The Core Hexagon Assembly */}
      <div className="relative">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 20, 
            delay: 0.5 
          }}
          className="relative z-10"
        >
          <Hexagon size={80} className="text-blue-500 fill-blue-500/10" strokeWidth={1.5} />
          
          {/* Inner Glow Pulse */}
          <motion.div 
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 bg-blue-500 blur-2xl rounded-full"
          />
        </motion.div>
      </div>

      {/* 🟢 Text Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        onAnimationComplete={() => setTimeout(onComplete, 1000)} // Hold for 1s then exit
        className="mt-8 text-center"
      >
        <h2 className="text-xl font-bold tracking-[0.4em] text-white uppercase">
          HiveMind<span className="text-blue-500"> AI</span>
        </h2>
        <div className="mt-2 h-[1px] w-48 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mx-auto" />
        <p className="mt-4 text-[10px] font-mono text-gray-500 tracking-[0.2em] uppercase">
          Initializing Collective Core
        </p>
      </motion.div>
    </motion.div>
  );
};

export default LaunchReveal;