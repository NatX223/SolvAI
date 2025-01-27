// app/page.tsx
"use client";

import { useState } from "react";
import ChatInterface from "@/components/chatinterface";
import { motion } from "framer-motion";

export default function Home() {
  const [showChat, setShowChat] = useState(false);

  const handleGetStarted = () => {
    setShowChat(true);
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {showChat ? (
        <div className="flex-1">
          <ChatInterface />
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center w-full text-center">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-5xl font-bold text-white mb-4">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                SolvAI
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-lg mx-auto">
              Empowering you with AI-driven insights for DeFi, development, and
              market trends on the Solana network.
            </p>
          </motion.div>

          {/* Illustration */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-16"
          >
          </motion.div>

          {/* Get Started Button */}
          <motion.button
            onClick={handleGetStarted}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-lg rounded-xl shadow-md hover:shadow-lg focus:outline-none"
          >
            Get Started
          </motion.button>
        </div>
      )}
    </div>
  );
}
