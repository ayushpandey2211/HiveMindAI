import { motion } from 'framer-motion';

const Loader = () => (
  <div className="flex flex-col items-center justify-center space-y-4">
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-3 w-3 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
    <p className="text-xs font-mono uppercase tracking-[0.3em] text-blue-400 animate-pulse">
      Syncing Intelligence
    </p>
  </div>
);

export default Loader;