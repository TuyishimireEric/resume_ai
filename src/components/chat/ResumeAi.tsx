"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Loader2,
  MessageCircle,
  X,
  Minimize2,
  Maximize2,
  Target,
  TrendingUp,
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

const QUICK_QUESTIONS = [
  "How does the 50% matching rule work?",
  "What file formats can I upload?",
  "Is Resume AI really free?",
  "How accurate is the AI analysis?",
  "What does strengths analysis show?",
  "How do I improve my match score?",
  "Why can't I submit below 50%?",
  "What weaknesses does AI identify?",
];

export default function ResumeAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hi! I'm your Resume AI assistant. I can help you understand how our free platform works - from uploading your resume to achieving the 50% match score needed for job applications. What would you like to know about Resume AI?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const sendMessage = async (messageText?: string) => {
    const messageToSend = messageText || input.trim();
    if (!messageToSend || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageToSend,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSend }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          data.response ||
          "Resume AI is a free platform that analyzes your resume against job descriptions. You need 50% match score to submit applications. Please try asking again.",
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Resume AI is completely free and analyzes your resume against job descriptions with a 50% matching threshold. Please try your question again.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50 animate-pulse"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl transition-all duration-300 z-50 ${
        isMinimized ? "h-14" : "h-96 w-80"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
              Resume AI Help
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Free • 50% Match Rule
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4" />
            ) : (
              <Minimize2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 max-h-24 overflow-y-auto">
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                Common questions:
              </p>
              <div className="grid grid-cols-1 gap-1">
                {QUICK_QUESTIONS.slice(0, 4).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="text-left px-2 py-1 text-xs bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 rounded border border-blue-200 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors truncate"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 h-48">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-600"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.role === "assistant" && (
                      <Target className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    <Loader2 className="w-3 h-3 animate-spin text-gray-500" />
                    <span className="text-xs text-gray-500">Analyzing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Key Info Banner */}
          <div className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-blue-700 dark:text-blue-300 flex items-center">
                <Target className="w-3 h-3 mr-1" />
                50% Match Required
              </span>
              <span className="text-green-600 dark:text-green-400 font-medium">
                100% Free
              </span>
            </div>
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about Resume AI features..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">
              Resume AI • Free Platform • Ask anything!
            </p>
          </div>
        </>
      )}
    </div>
  );
}
