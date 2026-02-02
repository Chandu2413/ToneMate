import React, { useRef, useState, useEffect } from "react";

/**
 * ColorMatch.jsx
 * - Uses canvas-based recoloring so photo JPGs (non-transparent) recolor realistically.
 * - Keeps shadows/folds by scaling the chosen color with original pixel luminance.
 * - Skips near-white background pixels to avoid coloring the background.
 *
 * Make sure your images are available under:
 * public/images/shirts/*.jpg
 * public/images/pants/*.jpg
 */

const dressImages = {
  shirt_pant: {
    upper: "/images/shirts/formal-shirt.png",
    lower: "/images/pants/formal-trouser.png",
  },
  tshirt_jeans: {
    upper: "/images/shirts/tshirt.jpg",
    lower: "/images/pants/formal-trouser.png",
  },
  kurta_pajama: {
    upper: "/images/shirts/kurta.jpg",
    lower: "/images/pants/formal-trouser.png",
  },
  hoodie_joggers: {
    upper: "/images/shirts/hoodie.jpg",
    lower: "/images/pants/formal-trouser.png",
  },
  polo_shorts: {
    upper: "/images/shirts/polo.jpg",
    lower: "/images/pants/formal-trouser.png",
  },
};

export default function ColorMatch() {
  const [dressType, setDressType] = useState("shirt_pant");
  const [upperColor, setUpperColor] = useState("#4A90E2");
  const [lowerColor, setLowerColor] = useState("#333333");

  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const upperCanvasRef = useRef(null);
  const lowerCanvasRef = useRef(null);

// Recolor whenever dressType or colors change
useEffect(() => {
  const upperCanvas = upperCanvasRef.current;
  const lowerCanvas = lowerCanvasRef.current;

  function hexToRgb(hex) {
    const clean = hex.replace("#", "");
    const bigint = parseInt(
      clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean,
      16
    );
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
  }

  function recolorLocal(imgSrc, hexColor, canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.crossOrigin = "";
    img.src = imgSrc;

    img.onload = () => {
      const maxW = 320;
      const scale = Math.min(1, maxW / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);

      canvas.width = w;
      canvas.height = h;

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);

      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      const target = hexToRgb(hexColor);
      const backgroundLuminanceThreshold = 245;
      const alphaThreshold = 10;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        const lum = (r + g + b) / 3;

        if (lum > backgroundLuminanceThreshold || a < alphaThreshold) {
          continue;
        }

        const factor = lum / 255;

        const newR = Math.round(target.r * factor);
        const newG = Math.round(target.g * factor);
        const newB = Math.round(target.b * factor);

        data[i] = newR;
        data[i + 1] = newG;
        data[i + 2] = newB;
      }

      ctx.putImageData(imgData, 0, 0);
    };

    img.onerror = (err) => {
      console.error("Image load error:", imgSrc, err);      // Try a sensible fallback to avoid console 404s and broken previews
      try {
        if (!img.dataset.fallback) {
          img.dataset.fallback = "1";
          if (imgSrc.includes("/images/pants")) {
            img.src = "/images/pants/formal-trouser.png";
          } else {
            img.src = "/images/shirts/formal-shirt.png";
          }
        }
      } catch (e) {
        console.warn("Fallback image failed", e);
      }    };
  }

  recolorLocal(dressImages[dressType].upper, upperColor, upperCanvas);
  recolorLocal(dressImages[dressType].lower, lowerColor, lowerCanvas);
}, [dressType, upperColor, lowerColor]);

  // Send shirt + pant colors to AI to evaluate the combo
  async function evaluateColors() {
    setAiLoading(true);
    setAiResult(null);
    try {
      const { colorMatch } = await import("../services/aiService");
      const res = await colorMatch(upperColor, lowerColor, dressType);
      setAiResult(res);
    } catch (err) {
      setAiResult({ matchScore: "Error", description: "AI evaluation failed." });
    } finally {
      setAiLoading(false);
    }
  }

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-3">
            🎨 Color Match
          </h1>
          <p className="text-lg text-gray-600">
            Try different color combinations and see how they look together
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Controls */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">👗 Select Your Outfit</h2>

            {/* Dress Type Selection */}
            <div className="mb-6">
              <label className="block font-semibold text-gray-800 mb-3">Dress Type</label>
              <select
                value={dressType}
                onChange={(e) => setDressType(e.target.value)}
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-400 bg-white"
              >
                <option value="shirt_pant">👔 Formal Shirt + Pant</option>
                <option value="tshirt_jeans">👕 T-Shirt + Jeans</option>
                <option value="kurta_pajama">👚 Kurta + Pajama</option>
                <option value="hoodie_joggers">🧥 Hoodie + Joggers</option>
                <option value="polo_shorts">🎾 Polo + Shorts</option>
              </select>
            </div>

            {/* Visual Selection */}
            <div className="mb-6">
              <label className="block font-semibold text-gray-800 mb-3">Or Choose Visually</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(dressImages).map(([key]) => (
                  <button
                    key={key}
                    onClick={() => setDressType(key)}
                    className={`p-3 rounded-lg border-2 transition-all transform hover:scale-105 ${
                      dressType === key
                        ? "border-purple-500 bg-purple-50 shadow-md"
                        : "border-gray-200 bg-white hover:border-purple-300"
                    }`}
                  >
                    <div className="text-xs font-semibold text-center">
                      {key.replace('_', ' ').split(' ').slice(0, 1).join(' ')}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Inputs */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block font-semibold text-gray-800 mb-3">👕 Upper Wear Color</label>
                <div className="flex gap-4 items-center">
                  <input
                    type="color"
                    value={upperColor}
                    onChange={(e) => setUpperColor(e.target.value)}
                    className="w-20 h-20 rounded-xl cursor-pointer border-2 border-purple-200 shadow-md hover:shadow-lg transition-shadow"
                  />
                  <div>
                    <p className="text-sm font-mono bg-purple-50 px-3 py-2 rounded-lg text-gray-700">
                      {upperColor.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-800 mb-3">👖 Lower Wear Color</label>
                <div className="flex gap-4 items-center">
                  <input
                    type="color"
                    value={lowerColor}
                    onChange={(e) => setLowerColor(e.target.value)}
                    className="w-20 h-20 rounded-xl cursor-pointer border-2 border-blue-200 shadow-md hover:shadow-lg transition-shadow"
                  />
                  <div>
                    <p className="text-sm font-mono bg-blue-50 px-3 py-2 rounded-lg text-gray-700">
                      {lowerColor.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Evaluate Button */}
            <button
              onClick={evaluateColors}
              disabled={aiLoading}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all transform ${
                aiLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:scale-105 active:scale-95"
              }`}
            >
              {aiLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⚙️</span> Evaluating...
                </span>
              ) : (
                "🔍 Evaluate Outfit"
              )}
            </button>

            {/* AI Result */}
            {aiResult && (
              <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 animate-fadeIn">
                <h3 className="font-bold text-gray-800 mb-2">✨ AI Evaluation</h3>
                <p className="text-sm text-gray-700">
                  {aiResult.description || aiResult.explanation || aiResult.reply || JSON.stringify(aiResult)}
                </p>
                {aiResult.matchScore && (
                  <p className="text-xs text-gray-500 mt-3">Score: {aiResult.matchScore}</p>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: Preview */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">✨ Live Preview</h2>

            <div className="space-y-8">
              {/* Upper Wear */}
              <div className="flex flex-col items-center">
                <p className="text-sm font-semibold text-gray-600 mb-4">👕 Top</p>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200">
                  <canvas
                    ref={upperCanvasRef}
                    style={{ width: 240, height: 240, display: "block", borderRadius: "12px" }}
                  />
                </div>
              </div>

              {/* Lower Wear */}
              <div className="flex flex-col items-center">
                <p className="text-sm font-semibold text-gray-600 mb-4">👖 Bottom</p>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border-2 border-blue-200">
                  <canvas
                    ref={lowerCanvasRef}
                    style={{ width: 240, height: 240, display: "block", borderRadius: "12px" }}
                  />
                </div>
              </div>
            </div>

            <p className="text-gray-500 mt-8 text-center text-sm leading-relaxed">
              💡 Change the colors and dress type on the left to see the live preview update in real-time!
            </p>
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
