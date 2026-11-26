import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Hexagon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // 🟢 Effect to handle background change on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper to check if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav 
      className={`fixed top-0 w-full z-[100] px-6 py-4 transition-all duration-500 ${
        scrolled 
          ? "backdrop-blur-xl bg-black/40 border-b border-white/10" 
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* 🟢 Logo Link */}
        <Link to="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="relative">
            <Hexagon 
              className="text-blue-500 group-hover:rotate-90 transition-transform duration-700 ease-in-out" 
              size={32} 
            />
            <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 group-hover:opacity-60 transition-opacity"></div>
          </div>
          <span className="text-xl font-black tracking-tighter text-white">HiveMind AI</span>
        </Link>

        {/* 🟢 Navigation Links (Desktop) */}
        <div className="hidden md:flex gap-10 text-xs font-mono uppercase tracking-[0.2em] text-gray-400">
          <a href="#features" className="hover:text-blue-400 transition-colors relative group">
            Features
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-500 transition-all group-hover:w-full" />
          </a>
          <a href="#about" className="hover:text-blue-400 transition-colors relative group">
            About
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-500 transition-all group-hover:w-full" />
          </a>
          <Link to="/chat" className={`transition-colors ${isActive('/chat') ? 'text-blue-400' : 'hover:text-blue-400'}`}>
            Technology
          </Link>
        </div>

        {/* 🟢 Auth Buttons */}
        <div className="flex items-center gap-6">
          <Link 
            to="/login" 
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors hidden sm:block"
          >
            Login
          </Link>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/signup" 
              className="px-6 py-2.5 text-xs font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all uppercase tracking-widest"
            >
              Sign Up
            </Link>
          </motion.div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;