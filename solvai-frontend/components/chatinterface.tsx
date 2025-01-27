// components/ChatInterface.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiZap, FiClock, FiTrendingUp } from 'react-icons/fi';

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);

  const trendingTopics = [
    "GATE 2025 Syllabus",
    "AI Architecture",
    "Web3 Integration",
    "System Design"
  ];

  const recentChats = [
    { id: 1, query: "Blockchain consensus mechanisms", time: "3:47 PM" },
    { id: 2, query: "Neural network optimization", time: "3:51 PM" },
    { id: 3, query: "Quantum computing basics", time: "2:30 PM" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      content: input,
      isAI: false,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        content: "This is a sophisticated AI response. Integrate your AI model here.",
        isAI: true,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="h-screen bg-[#0f0f0f] text-gray-100 flex">
      {/* Navigation Sidebar */}
      <div className="w-80 border-r border-[#252525] bg-[#161616] p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            SolvAI
          </h1>
          <button className="mt-4 w-full py-3 bg-[#252525] hover:bg-[#2d2d2d] rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
            <FiZap className="w-4 h-4" />
            Connect Wallet
          </button>
        </div>

        <div className="flex-1 space-y-6">
          <div>
            <h3 className="text-sm text-gray-400 mb-3 flex items-center gap-2">
              <FiClock className="w-4 h-4" />
              Recent Chats
            </h3>
            <div className="space-y-2">
              {recentChats.map(chat => (
                <motion.div
                  key={chat.id}
                  whileHover={{ scale: 0.98 }}
                  className="p-3 bg-[#252525] rounded-lg cursor-pointer"
                >
                  <p className="text-sm truncate">{chat.query}</p>
                  <span className="text-xs text-gray-500 mt-1 block">{chat.time}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm text-gray-400 mb-3 flex items-center gap-2">
              <FiTrendingUp className="w-4 h-4" />
              Trending Topics
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {trendingTopics.map((topic, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 0.96 }}
                  className="p-2 bg-[#252525] rounded-lg text-xs text-center cursor-pointer hover:bg-[#2d2d2d]"
                >
                  {topic}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto text-center space-y-4"
              >
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  How can we help you?
                </h2>
                <p className="text-gray-400 text-lg">
                  Ask SolvAI anything about technology, science, or innovation
                </p>
              </motion.div>
            )}

            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`p-4 rounded-2xl max-w-[80%] ${
                    message.isAI ? 'bg-[#252525]' : 'bg-gradient-to-r from-blue-600 to-purple-600'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <span className="text-xs text-gray-400 mt-2 block">{message.timestamp}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-8 border-t border-[#252525]">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="max-w-3xl mx-auto relative"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask SolvAI anything..."
              className="w-full pr-16 pl-6 py-4 bg-[#161616] border-2 border-[#252525] rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/30 transition-all"
            />
            <button
              type="submit"
              disabled={isProcessing}
              className="absolute right-3 top-3 p-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 transition-all"
            >
              <FiSend className="w-5 h-5" />
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}