import { motion } from 'framer-motion';
import { MessageSquare, Plus, Settings, LogOut, Hexagon, Search } from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  return (
    <motion.aside 
      initial={false}
      animate={{ width: isOpen ? 280 : 80 }}
      className="h-full flex flex-col p-4 bg-black/20 relative"
    >
      {/* Logo Area */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <Hexagon className="text-blue-400" size={20} />
        </div>
        {isOpen && <span className="font-bold tracking-tighter text-lg">HiveMind AI</span>}
      </div>

      {/* New Chat Button */}
      <button className="flex items-center justify-center gap-2 w-full py-3 mb-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-sm font-medium">
        <Plus size={18} />
        {isOpen && <span>New Thread</span>}
      </button>

      {/* Chat History (Scrollable) */}
      <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
        {[1, 2, 3].map((i) => (
          <div key={i} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all border border-transparent hover:border-white/5">
            <MessageSquare size={18} className="text-gray-500 group-hover:text-blue-400" />
            {isOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm truncate text-gray-300">Market Analysis #{i}</p>
                <p className="text-[10px] text-gray-600 font-mono">Consensus: 98%</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* User Footer */}
      <div className="mt-auto pt-4 border-t border-white/5 space-y-2">
        <button className="flex items-center gap-3 w-full p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
          <Settings size={18} />
          {isOpen && <span className="text-sm">Settings</span>}
        </button>
        <button className="flex items-center gap-3 w-full p-3 rounded-xl text-red-400 hover:bg-red-400/5 transition-all">
          <LogOut size={18} />
          {isOpen && <span className="text-sm">Disconnect</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;