// components/ChatInterface.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiZap, FiClock, FiTrendingUp, FiSearch, FiBook, FiCode, FiUsers } from 'react-icons/fi';

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const trendingTokens = [
    { symbol: "SOL", name: "Solana", change: "+5.2%", price: "$142.50" },
    { symbol: "ETH", name: "Ethereum", change: "+2.1%", price: "$3,200.00" },
    { symbol: "BTC", name: "Bitcoin", change: "+1.8%", price: "$63,400.00" },
    { symbol: "DOT", name: "Polkadot", change: "+3.4%", price: "$9.20" },
  ];

  const features = [
    {
      icon: <FiUsers className="w-6 h-6" />,
      title: "DeFi Agent Orchestration",
      description: "Coordinate AI agents on Solana network",
      gradient: "from-purple-600 to-blue-500"
    },
    {
      icon: <FiCode className="w-6 h-6" />,
      title: "Developer Knowledge",
      description: "Protocol documentation & integration guides",
      gradient: "from-green-600 to-cyan-500"
    },
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      title: "Trending Analysis",
      description: "Real-time crypto market insights",
      gradient: "from-orange-600 to-yellow-500"
    },
    {
      icon: <FiBook className="w-6 h-6" />,
      title: "AI-Powered Research",
      description: "Deep technical analysis & reports",
      gradient: "from-pink-600 to-red-500"
    }
  ];

  return (
    <div className="h-screen bg-[#0f0f0f] text-gray-100 flex">
      {/* Navigation Sidebar */}
      <div className="w-80 border-r border-[#252525] bg-[#161616] p-6 flex flex-col">
        {/* Sidebar content remains same */}
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
              {[
                { id: 1, query: "DeFi Agent Setup", time: "3:47 PM" },
                { id: 2, query: "SOL Market Analysis", time: "3:51 PM" },
                { id: 3, query: "Smart Contract Audit", time: "2:30 PM" }
              ].map(chat => (
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
        </div>
      </div>

      {/* Main Content - Updated RHS */}
      <div className="flex-1 flex flex-col p-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-6"
          >
            How can we help you?
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto relative"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the hive anything..."
              className="w-full px-8 py-5 bg-[#161616] border-2 border-[#252525] rounded-2xl text-lg focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20"
            />
            <button className="absolute right-4 top-4 p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:opacity-90">
              <FiSearch className="w-6 h-6" />
            </button>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className={`bg-gradient-to-br ${feature.gradient} p-px rounded-2xl hover:shadow-xl transition-shadow`}
            >
              <div className="h-full bg-[#0f0f0f] rounded-2xl p-6">
                <div className="mb-4 text-3xl">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trending Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-8 bg-[#161616] rounded-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold">Trending Tokens</h3>
            <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
              View All
              <FiZap className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingTokens.map((token, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="p-4 bg-[#252525] rounded-xl hover:bg-[#2d2d2d] transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{token.symbol}</span>
                  <span className={`text-sm ${token.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {token.change}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">{token.name}</span>
                  <span className="text-sm">{token.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}