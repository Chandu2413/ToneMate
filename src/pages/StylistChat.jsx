import React, { useState } from "react";
import { aiChat } from "../services/aiService";

export default function StylistChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function send() {
    const prompt = input.trim();
    if (!prompt) return;

    const userMsg = { id: Date.now(), role: "user", text: prompt };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await aiChat(prompt);
      const aiText = res.reply || res?.output || res?.explanation || JSON.stringify(res);
      const aiMsg = { id: Date.now() + 1, role: "ai", text: aiText };
      setMessages((m) => [...m, aiMsg]);
    } catch (err) {
      const errMsg = { id: Date.now() + 2, role: "ai", text: "AI Error: failed to get response" };
      setMessages((m) => [...m, errMsg]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 flex flex-col">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-3">
          💬 Stylist Chat
        </h1>
        <p className="text-lg text-gray-600">
          Ask for outfit ideas, fashion tips, and style advice
        </p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 max-w-3xl mx-auto w-full flex flex-col">
        {/* Messages Area */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex-1 overflow-y-auto max-h-96">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <div className="text-6xl mb-4">👗</div>
              <p className="text-lg font-medium">Start a conversation with the AI Stylist!</p>
              <p className="text-sm mt-2">Ask for outfit recommendations, color advice, or fashion tips.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      m.role === "user"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none"
                        : "bg-gradient-to-br from-blue-50 to-purple-50 text-gray-800 border-2 border-blue-200 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{m.text}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-blue-100 px-4 py-3 rounded-2xl rounded-bl-none border-2 border-blue-200">
                    <div className="flex gap-2 items-center">
                      <span className="animate-bounce text-xl">✨</span>
                      <p className="text-sm text-gray-700">Stylist is thinking...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Ask me anything about fashion and style... (Shift + Enter for new line)"
              className="flex-1 p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 resize-none"
              rows="3"
            />

            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className={`px-6 py-4 rounded-xl font-semibold text-white transition-all transform ${
                loading || !input.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:scale-105 active:scale-95"
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⚙️</span>
                </span>
              ) : (
                "💬 Send"
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
