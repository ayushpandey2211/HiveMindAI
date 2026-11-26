import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Bot, Paperclip, Loader2, BrainCircuit } from 'lucide-react';
import { sendChatMessage } from '../../services/chatService';

// 🟢 NEW: Markdown & Highlighting Imports
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', content: 'Neural Swarm initialized. How can I assist your collective intelligence today?', confidence: 100 }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userQuery = input.trim();
    const userMsg = { id: Date.now(), role: 'user', content: userQuery };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const data = await sendChatMessage(userQuery);
      const aiMsg = {
        id: Date.now() + 1,
        role: 'ai',
        content: data.final_answer,
        confidence: data.confidence,
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const reason = err?.response?.data?.error || err?.response?.data?.message;
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'ai', 
        content: reason
          ? `The swarm hit an error: ${reason}`
          : "Neural link timeout. The swarm is currently unreachable." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-transparent font-sans">
      
      {/* 🟢 Messages Stream */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                  msg.role === 'user' ? 'bg-white/5 border-white/10' : 'bg-blue-500/10 border-blue-500/20'
                }`}>
                  {msg.role === 'user' ? <User size={20} className="text-gray-400" /> : <Bot size={20} className="text-blue-400" />}
                </div>

                <div className={`p-5 rounded-[2rem] shadow-2xl ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white/5 border border-white/10 backdrop-blur-3xl text-gray-200 rounded-tl-none'
                }`}>
                  
                  {/* 🟢 RENDER MARKDOWN CONTENT */}
                  <div className="markdown-content text-sm leading-relaxed overflow-hidden">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({node, inline, className, children, ...props}) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <div className="relative my-4 rounded-xl overflow-hidden border border-white/10 bg-[#1a1a1e]">
                              <div className="flex justify-between items-center px-4 py-2 bg-white/5 text-[10px] font-mono text-gray-500 border-b border-white/10">
                                <span>{match[1].toUpperCase()}</span>
                              </div>
                              <SyntaxHighlighter
                                style={atomDark}
                                language={match[1]}
                                PreTag="div"
                                customStyle={{ margin: 0, background: 'transparent', padding: '1.25rem', fontSize: '13px', lineHeight: '1.6' }}
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            </div>
                          ) : (
                            <code className="bg-white/10 px-1.5 py-0.5 rounded text-blue-300 font-mono text-[0.9em]" {...props}>
                              {children}
                            </code>
                          )
                        },
                        ul: ({children}) => <ul className="list-disc ml-5 space-y-2 my-3">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal ml-5 space-y-2 my-3">{children}</ol>,
                        p: ({children}) => <p className="mb-3 last:mb-0">{children}</p>,
                        strong: ({children}) => <b className="font-bold text-blue-400">{children}</b>,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                  
                  {msg.confidence && (
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-[9px] font-mono text-blue-400 uppercase tracking-widest">
                      <Sparkles size={12} className="animate-pulse" /> Consensus: {msg.confidence}%
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <BrainCircuit size={20} className="text-blue-400 animate-pulse" />
                </div>
                <div className="px-5 py-3 rounded-full bg-white/5 border border-white/10 flex items-center gap-3">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce"></span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Swarm Debating...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 🟢 Input Box */}
      <div className="p-6 relative">
        <div className="max-w-4xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <form onSubmit={handleSend} className="relative bg-white/5 border border-white/10 rounded-[1.8rem] p-2 flex items-center gap-2 backdrop-blur-3xl">
            <button type="button" className="p-3 text-gray-500 hover:text-blue-400 transition-colors"><Paperclip size={20} /></button>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
              placeholder={isTyping ? "Swarm is thinking..." : "Ask the swarm anything..."}
              className="flex-1 bg-transparent border-none outline-none text-sm py-2 px-2 placeholder:text-gray-600 disabled:opacity-50"
            />
            <motion.button disabled={isTyping} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-blue-600 p-3 rounded-2xl shadow-lg">
              {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="text-white" />}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;