import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Hexagon, Loader2 } from 'lucide-react'; // Added Loader2
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 🟢 Import the Auth Hook
import Navbar from '../components/Navbar';

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, signup } = useAuth(); // 🟢 Pull actions from Context
  
  const isLogin = location.pathname === '/login';

  // 🟢 State Management
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.name, formData.email, formData.password);
      }
      // Success! Redirect to the neural dashboard
      navigate('/chat');
    } catch (err) {
      // Catch backend errors (e.g., "User already exists" or "Wrong password")
      setError(err.response?.data?.message || "Authentication failed. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col relative overflow-hidden">
      <Navbar />
      
      {/* 🟢 Kinetic Background Blurs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div 
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.15, 0.1] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[120px] pointer-events-none"
      />

      <main className="flex-1 flex items-center justify-center p-6 z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
            
            <div className="text-center mb-10">
              <motion.div 
                whileHover={{ rotate: 180, scale: 1.1 }}
                className="inline-flex p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-6 shadow-glow-blue"
              >
                <Hexagon className="text-blue-400" size={32} />
              </motion.div>
              <h2 className="text-4xl font-black tracking-tight">{isLogin ? "Welcome Back" : "Create Account"}</h2>
              
              {/* 🟢 Error Message Display */}
              <AnimatePresence>
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    className="text-red-400 text-xs mt-4 font-mono bg-red-400/10 py-2 rounded-lg border border-red-400/20"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-400 transition-colors" size={18} />
                      <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="John Doe" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-700"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-400 transition-colors" size={18} />
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="nexus@eusocial.ai" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500">Password</label>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-400 transition-colors" size={18} />
                  <input 
                    required
                    type="password" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-700"
                  />
                </div>
              </div>

              <motion.button
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.02, boxShadow: "0px 0px 25px rgba(59, 130, 246, 0.4)" } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold flex items-center justify-center gap-3 mt-4 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    {isLogin ? "Authenticate" : "Initialize Core"}
                    <ArrowRight size={20} />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-10 pt-6 border-t border-white/5 text-center text-sm">
              <span className="text-gray-500">{isLogin ? "First time here?" : "Already part of the swarm?"}</span>
              <Link to={isLogin ? "/signup" : "/login"} className="ml-2 text-blue-400 font-bold hover:text-blue-300 transition-colors">
                {isLogin ? "Create Account" : "Login Now"}
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AuthPage;