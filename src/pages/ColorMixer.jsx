import React, { useState } from "react";
import { colorMixer } from "../services/aiService";

export default function ColorMixer() {
  const [color1, setColor1] = useState("#ff0000");
  const [color2, setColor2] = useState("#0000ff");
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);

  function mixColors(c1, c2) {
    const mixed =
      "#" +
      (
        (parseInt(c1.substring(1), 16) + parseInt(c2.substring(1), 16)) / 2
      )
        .toString(16)
        .padStart(6, "0");
    return mixed;
  }

  async function handleExplain() {
    setLoading(true);
    try {
      const res = await colorMixer(color1, color2);
      setExplanation(res.explanation || res);
    } catch (err) {
      alert("Failed to get explanation");
    } finally {
      setLoading(false);
    }
  }

  const mixed = mixColors(color1, color2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-3">
          🎭 Color Mixer
        </h1>
        <p className="text-lg text-gray-600">
          Mix two colors and discover the resulting shade with AI insights
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Main Container */}
        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
          {/* Color Selection Grid */}
          <div className="grid md:grid-cols-3 gap-8 items-center mb-8">
            {/* Color 1 */}
            <div className="flex flex-col items-center gap-4">
              <label className="text-lg font-semibold text-gray-800">Color 1</label>
              <div className="relative">
                <input
                  type="color"
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className="w-32 h-32 rounded-2xl cursor-pointer border-4 border-purple-200 shadow-md hover:shadow-lg transition-shadow"
                />
              </div>
              <p className="text-sm font-mono bg-purple-50 px-4 py-2 rounded-lg text-gray-700">
                {color1.toUpperCase()}
              </p>
            </div>

            {/* Plus Icon */}
            <div className="flex justify-center">
              <div className="text-5xl text-purple-400">+</div>
            </div>

            {/* Color 2 */}
            <div className="flex flex-col items-center gap-4">
              <label className="text-lg font-semibold text-gray-800">Color 2</label>
              <div className="relative">
                <input
                  type="color"
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className="w-32 h-32 rounded-2xl cursor-pointer border-4 border-blue-200 shadow-md hover:shadow-lg transition-shadow"
                />
              </div>
              <p className="text-sm font-mono bg-blue-50 px-4 py-2 rounded-lg text-gray-700">
                {color2.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Equals Section */}
          <div className="text-center my-8">
            <div className="inline-block">
              <p className="text-4xl text-gray-400 mb-4">=</p>
              <div className="flex flex-col items-center gap-4">
                <label className="text-lg font-semibold text-gray-800">Mixed Result</label>
                <div
                  className="w-40 h-40 rounded-2xl shadow-lg border-4 border-gray-200 transition-transform hover:scale-105"
                  style={{ backgroundColor: mixed }}
                />
                <p className="text-sm font-mono bg-gray-50 px-4 py-2 rounded-lg text-gray-700">
                  {mixed.toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          {/* Explain Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={handleExplain}
              disabled={loading}
              className={`px-8 py-3 rounded-lg font-semibold text-white transition-all transform ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:scale-105 active:scale-95"
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⚙️</span> Analyzing...
                </span>
              ) : (
                "🔍 Get AI Explanation"
              )}
            </button>
          </div>

          {/* Explanation Section */}
          {explanation && (
            <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 animate-fadeIn">
              <h3 className="font-bold text-lg text-gray-800 mb-3">✨ AI Insights</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {explanation}
              </p>
            </div>
          )}
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
