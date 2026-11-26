// src/components/NetworkNodes.jsx
import { motion } from 'framer-motion';

const NetworkNodes = () => {
  // A helper function to create nodes with different positions and delays
  const Node = ({ top, left, delay }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 1, 0.2], scale: [0, 1, 0.8] }}
      transition={{ duration: 4, delay: delay, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
      style={{ top, left }}
      className="absolute h-1.5 w-1.5 rounded-full bg-blue-400 z-0"
    >
      <div className="absolute inset-0 h-full w-full rounded-full bg-blue-500 blur-sm scale-150"></div>
    </motion.div>
  );

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <Node top="20%" left="15%" delay={0} />
      <Node top="60%" left="10%" delay={1} />
      <Node top="80%" left="25%" delay={2} />
      <Node top="30%" left="80%" delay={1.5} />
      <Node top="70%" left="85%" delay={2.5} />
      
      {/* Decorative connection line placeholder */}
      <div className="absolute top-[20.5%] left-[16%] w-[10%] h-[1px] bg-blue-500/20 rotate-[35deg] transform-origin-left"></div>
      <div className="absolute top-[30.5%] left-[81%] w-[10%] h-[1px] bg-blue-500/10 -rotate-[35deg] transform-origin-left"></div>
    </div>
  );
};

export default NetworkNodes;