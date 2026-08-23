import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSend, FiUser, FiMessageCircle } from 'react-icons/fi';
import API from '../api/axios';

const SUGGESTIONS = [
  'Which crop should I plant this season?',
  'Tell me about PM-KISAN scheme',
  'How to improve soil health?',
  'Best fertilizers for rice?',
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Namaskar! I am Krushi Sahayak, your AI farming assistant. Ask me anything about crops, government schemes, soil health, or farming tips. I can help in Hindi, Marathi, English, or Hinglish!' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    const userMsg = { role: 'user', text: msg };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = [...messages, userMsg].slice(-10).map(m => ({
        role: m.role === 'bot' ? 'model' : 'user',
        text: m.text,
      })).filter((_, i, arr) => i === 0 ? arr[i].role === 'user' : true);

      const { data } = await API.post('/chatbot/chat', { message: msg, history });
      setMessages(prev => [...prev, { role: 'bot', text: data.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[400px] max-h-[70vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden z-50"
          >
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                  <FiMessageCircle className="text-white" size={18} />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Krushi Sahayak</h3>
                  <p className="text-primary-200 text-xs">AI Farming Assistant</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white p-1">
                <FiX size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0" style={{ maxHeight: 'calc(70vh - 140px)' }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] ${msg.role === 'user'
                    ? 'bg-primary-600 text-white rounded-2xl rounded-br-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl rounded-bl-md'
                  } px-4 py-2.5`}>
                    <div className="flex items-start gap-2">
                      {msg.role === 'bot' && <FiMessageCircle size={14} className="text-primary-500 mt-0.5 shrink-0" />}
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                      {msg.role === 'user' && <FiUser size={14} className="text-primary-200 mt-0.5 shrink-0" />}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              {messages.length === 1 && !loading && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => send(s)}
                      className="text-xs px-3 py-1.5 rounded-full border border-primary-300 dark:border-primary-700 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 p-3">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about farming, crops, schemes..."
                  className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 placeholder-gray-400"
                  disabled={loading}
                />
                <button
                  onClick={() => send()}
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-xl flex items-center justify-center transition-colors shrink-0"
                >
                  <FiSend size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Logo Button - fixed bottom-right */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        <div className="w-14 h-14 flex items-center justify-center">
          {isOpen ? <FiX size={24} /> : (
            <svg width="32" height="32" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 4C9.16 4 2 10.48 2 18.5C2 22.92 4.24 26.84 7.72 29.48L6.5 33L10.6 31.08C12.68 32.04 15.04 32.58 17.56 32.58C26.38 32.58 33.5 26.1 33.5 18.12C33.5 10.14 26.38 4 18 4Z" fill="currentColor" />
              <circle cx="12" cy="17.5" r="2" fill="white" />
              <circle cx="18" cy="17.5" r="2" fill="white" />
              <circle cx="24" cy="17.5" r="2" fill="white" />
            </svg>
          )}
        </div>
        {!isOpen && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="pr-4 text-sm font-semibold hidden sm:block"
          >
            Krushi Sahayak
          </motion.span>
        )}
      </motion.button>
    </>
  );
}
