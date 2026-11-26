// src/components/AboutSection.jsx
import { motion } from 'framer-motion';
import FeatureCard from './FeatureCard';

const AboutSection = () => {
  // Define our 5 features in an array
  const hivemindFeatures = [
    {
      title: "Intelligence Through Swarm Collective Thinking",
      description: "Traditional AI relies on one mind. HiveMind AI synthesizes logic, creativity, and critique from a swarm of models to deliver verified intelligence.",
      iconText: "MODEL SWARM SYNC",
      reverse: false, // Text Left
    },
    {
      title: "Parallel Agents, Single Truth",
      description: "When you ask HiveMind AI, your query isn't just processed. It's debated. Multiple agents explore angles, math, and concepts in parallel before a final judge combines the best of all.",
      iconText: "DEBATE PIPELINE",
      reverse: true, // Text Right
    },
    {
      title: "Eliminating Hallucinations, One Query at a Time",
      description: "By integrating a constant 'Critic' model into the flow, we spot errors and logical jumps that single-LLM systems miss. Get accuracy you can trust.",
      iconText: "CRITIC FEEDBACK LOOP",
      reverse: false, // Text Left
    },
    {
      title: "Adaptable Minds, Optimal Results",
      description: "Our classifier instantly directs your prompt. Greetings bypass the expensive pipeline, while complex analysis triggers the full multi-agent consensus system.",
      iconText: "QUERY CLASSIFIER",
      reverse: true, // Text Right
    },
    {
      title: "The HiveMind Advantage: Shared Learning",
      description: "Our unique architecture ensures every part of the system is constantly monitored. We don't just return answers; we build comprehensive reasoning that shows you *how* we got there.",
      iconText: "REASONING CHAIN",
      reverse: false, // Text Left
    }
  ];

  return (
    <section id="about" className="relative px-6 py-20 md:py-32 overflow-hidden bg-[#09090b]">
      {/* Decorative radial blur for section separation */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100%] h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent blur-xl"></div>
      
      <div className="max-w-7xl mx-auto z-10 relative">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-24 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-white/10 rounded-full text-xs font-mono uppercase tracking-[0.2em] text-blue-400 bg-white/5 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Our Technology
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
            Intelligence Reimagined <br />Through Consensus
          </h2>
        </motion.div>

        {/* The List of Alternating Cards */}
        <div className="flex flex-col">
          {hivemindFeatures.map((feature, index) => (
            <FeatureCard
              key={index} // Key is unique because title is unique
              title={feature.title}
              description={feature.description}
              iconText={feature.iconText}
              reverse={feature.reverse}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;