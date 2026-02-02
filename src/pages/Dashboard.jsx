import React from "react";
import MainLayout from "../components/MainLayout";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const nav = useNavigate();
  const cards = [
    { title: "AI Color Recommender", to: "/ai-recommender", emoji: "👨", color: "from-purple-600 to-pink-600" },
    { title: "AI Stylist Chat", to: "/chat", emoji: "💬", color: "from-blue-600 to-cyan-600" },
    { title: "Color Mixer", to: "/color-mixer", emoji: "🎭", color: "from-pink-600 to-red-600" },
    { title: "Color Match", to: "/color-match", emoji: "🎨", color: "from-yellow-600 to-orange-600" },
    { title: "Suggestions", to: "/suggestions", emoji: "✨", color: "from-indigo-600 to-purple-600" },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-12">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-3">
            Dashboard
          </h2>
          <p className="text-lg text-gray-600">
            Access all the amazing tools to enhance your style
          </p>
        </div>

        {/* Cards Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((c) => (
              <div
                key={c.title}
                onClick={() => nav(c.to)}
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer transform group border-2 border-transparent hover:border-purple-300"
              >
                <div className={`text-5xl mb-4 group-hover:scale-125 transition-transform`}>
                  {c.emoji}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{c.title}</h3>
                <p className="text-gray-600 mb-4">
                  Click to explore this feature
                </p>
                <div className={`w-full h-1 bg-gradient-to-r ${c.color} rounded-full`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
