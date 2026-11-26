// src/components/FeatureCard.jsx
import { motion } from 'framer-motion';

/**
 * A responsive, asymmetric card that alternates layout.
 * @param {string} title - The title of the feature
 * @param {string} description - The descriptive text
 * @param {string} iconText - The placeholder text for the 'image' box
 * @param {boolean} reverse - If true, text comes second on desktop
 */
const FeatureCard = ({ title, description, iconText, reverse = false }) => {
  return (
    <motion.div 
      // 🟢 Framer Motion: Animate on scroll (fade in and slide up)
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }} // Animate once, when 30% visible
      transition={{ duration: 0.8, ease: "easeOut" }}
      
      // 🟢 Hover Interaction: Subtle lift and glow
      whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.15)" }}
      className={`
        flex flex-col md:flex-row items-center gap-12 p-8 md:p-12 mb-20 rounded-3xl
        border border-white/5 bg-white/5 backdrop-blur-3xl shadow-2xl transition-all duration-300
        ${reverse ? 'md:flex-row-reverse' : ''} // Alternating layout
      `}
    >
      {/* 🟢 Text Content (Wider, Wavy Content Flow) */}
      <div className="flex-1 space-y-4 text-left md:text-left">
        <h3 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          {title}
        </h3>
        <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-xl">
          {description}
        </p>
      </div>

      {/* 🟢 Image/Visualization Placeholder (Glass-like, Asymmetric Box) */}
      <div className="relative flex-none w-full md:w-2/5 aspect-[4/3] rounded-2xl border-2 border-dashed border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center overflow-hidden">
        {/* Subtle inner background glow */}
        <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-5"></div>
        
        {/* Decorative corner element for premium feel */}
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-400/30 rounded-tr-lg"></div>

        {/* Minimal placeholder text */}
        <div className="relative font-mono text-xs tracking-[0.3em] uppercase text-white/30 z-10 p-4 text-center">
          {iconText} <br /> VISUALIZATION
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureCard;