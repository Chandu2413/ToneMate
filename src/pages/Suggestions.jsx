import React, { useEffect, useState } from "react";
import { getSuggestions } from "../services/suggestionService";
import { motion as Motion } from "framer-motion";

export default function Suggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getSuggestions();
        setSuggestions(data);
      } catch {
        setError("Failed to load suggestions");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-3">
          Fashion Suggestions
        </h1>
        <p className="text-lg text-gray-600">
          Discover curated outfit ideas from fashion experts
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-bounce text-6xl mb-4">✨</div>
            <p className="text-lg font-semibold text-gray-700">Loading suggestions...</p>
          </div>
        )}

        {error && (
          <div className="p-6 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <p className="text-red-700 font-medium">⚠️ {error}</p>
          </div>
        )}

        {!loading && !error && suggestions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-lg font-semibold text-gray-700">No suggestions yet</p>
            <p className="text-sm text-gray-500 mt-2">Check back soon for curated outfit ideas!</p>
          </div>
        )}

        {!loading && !error && suggestions.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((item, index) => (
              <Motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all transform overflow-hidden h-full border-2 border-transparent hover:border-purple-300">
                  {/* Color Bar */}
                  <div className="h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"></div>
                  
                  <div className="p-6">
                    <div className="text-4xl mb-3 group-hover:scale-125 transition-transform">👗</div>
                    <h3 className="font-bold text-xl text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.desc}
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-purple-600 font-semibold">
                        Perfect for your style →
                      </p>
                    </div>
                  </div>
                </div>
              </Motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
