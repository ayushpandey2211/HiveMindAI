import { motion } from 'framer-motion';
import { Cpu, ShieldCheck, Zap, BrainCircuit } from 'lucide-react';

const SwarmStatus = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-80 h-full p-6 bg-black/10 hidden xl:flex flex-col gap-6"
    >
      <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-gray-500">Neural Swarm Status</h3>
      
      <div className="space-y-4">
        <AgentStat Icon={BrainCircuit} name="Logic Agent" color="text-blue-400" status="Idle" />
        <AgentStat Icon={Zap} name="Creative Agent" color="text-purple-400" status="Idle" />
        <AgentStat Icon={ShieldCheck} name="Critic Module" color="text-orange-400" status="Ready" />
      </div>

      <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10">
        <p className="text-[10px] font-mono text-blue-300 uppercase mb-2">Network Health</p>
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            animate={{ width: ["20%", "85%", "80%"] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="h-full bg-blue-500" 
          />
        </div>
        <p className="text-[10px] text-gray-500 mt-2">Latency: 24ms</p>
      </div>
    </motion.div>
  );
};

const AgentStat = ({ Icon, name, color, status }) => (
  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
    <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-sm font-bold">{name}</p>
      <p className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter">{status}</p>
    </div>
  </div>
);

export default SwarmStatus;