import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/dashboard/Sidebar';
import ChatWindow from '../components/dashboard/ChatWindow';
import SwarmStatus from '../components/dashboard/SwarmStatus';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isStatusOpen, setIsStatusOpen] = useState(true);

  return (
    <div className="flex h-screen bg-[#060608] text-white overflow-hidden font-sans">
      {/* 🟢 Background Gradient Blobs (Static for performance in Chat) */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] pointer-events-none" />

      {/* 1. Left Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* 2. Main Chat Area */}
      <main className="flex-1 flex flex-col relative z-10 border-x border-white/5 bg-white/[0.01] backdrop-blur-3xl">
        <ChatWindow />
      </main>

      {/* 3. Right Swarm Status (The "Brain" Visualization) */}
      <AnimatePresence>
        {isStatusOpen && (
          <SwarmStatus close={() => setIsStatusOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;