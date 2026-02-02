import React, { useState } from "react";
import { analyzeImage } from "../services/api";

const SkinToneColors = {
  Light: "bg-yellow-100",
  Medium: "bg-amber-300",
  Dark: "bg-amber-900",
};

const GenderIcons = {
  Male: "👨",
  Female: "👩",
};

export default function AiRecommender() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  function handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setError(null);
    } else {
      setError("Please upload a valid image file");
    }
  }

  function onFile(e) {
    const f = e.target.files[0];
    if (f && f.type.startsWith("image/")) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setError(null);
    } else {
      setError("Please upload a valid image file");
    }
  }

  async function submit() {
    if (!file) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await analyzeImage(file);
      console.log("✓ Analysis Result:", data);

      if (data.error) {
        setError(data.error);
        setResult(null);
      } else {
        setResult(data);
      }
    } catch (err) {
      console.error("✗ AI analyze error", err);
      const msg =
        err?.response?.data?.message ||
        err.message ||
        "Failed to analyze image. Please try again.";
      setError(msg);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-3">
          AI Style Analyzer
        </h1>
        <p className="text-lg text-gray-600">
          Upload your photo and get personalized dress recommendations based on your skin tone!
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Main Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              📸 Upload Your Photo
            </h2>

            {/* Drag & Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-3 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                dragActive
                  ? "border-purple-500 bg-purple-50 scale-105"
                  : "border-gray-300 bg-gray-50 hover:border-purple-400"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={onFile}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <div className="text-4xl mb-3">📁</div>
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  Drag and drop your image here
                </p>
                <p className="text-sm text-gray-500">or click to browse</p>
              </label>
            </div>

            {/* Preview */}
            {preview && (
              <div className="mt-8">
                <p className="text-sm font-semibold text-gray-600 mb-4">
                  Image Preview
                </p>
                <div className="w-full h-80 overflow-hidden rounded-lg shadow-md border-2 border-purple-200 flex items-center justify-center bg-gray-100">
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  File: {file?.name || "Unknown"}
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <p className="text-sm text-red-700 font-medium">⚠️ {error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={submit}
                disabled={loading || !file}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all transform ${
                  loading || !file
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:scale-105 active:scale-95"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⚙️</span> Analyzing...
                  </span>
                ) : (
                  "🔍 Analyze Photo"
                )}
              </button>
              {file && (
                <button
                  onClick={resetForm}
                  className="py-3 px-6 rounded-lg font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              ✨ Your Results
            </h2>

            {!result && !loading && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <div className="text-6xl mb-4">👤</div>
                <p className="text-lg font-medium text-gray-500">
                  Upload and analyze a photo to see results
                </p>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-bounce text-6xl mb-4">🤖</div>
                <p className="text-lg font-semibold text-gray-700">
                  Analyzing your photo...
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  This may take a few seconds
                </p>
              </div>
            )}

            {result && (
              <div className="space-y-6 animate-fadeIn">
                {/* Gender Card */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
                  <h3 className="text-lg font-bold text-blue-900 mb-3">
                    Gender Detected
                  </h3>
                  <div className="flex items-center gap-4">
                    <span className="text-6xl">{GenderIcons[result.gender] || "👤"}</span>
                    <div>
                      <p className="text-3xl font-bold text-blue-900">
                        {result.gender || "Unknown"}
                      </p>
                      <p className="text-sm text-blue-700 mt-1">
                        High confidence prediction
                      </p>
                    </div>
                  </div>
                </div>

                {/* Skin Tone Card */}
                <div className={`${SkinToneColors[result.skin_tone] || "bg-gray-100"} rounded-xl p-6 border-2 border-gray-300`}>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Skin Tone Classification
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className={`w-20 h-20 rounded-full shadow-lg border-4 border-white ${SkinToneColors[result.skin_tone] || "bg-gray-100"}`}></div>
                    <div>
                      <p className="text-3xl font-bold text-gray-900">
                        {result.skin_tone || "Unknown"}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        Perfectly identified for recommendations
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dress Recommendations Card */}
                {result.recommended_dresses && result.recommended_dresses.length > 0 && (
                  <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 border-2 border-pink-200">
                    <h3 className="text-lg font-bold text-pink-900 mb-4">
                      👗 Recommended Dresses
                    </h3>
                    <div className="space-y-3">
                      {result.recommended_dresses.map((dress, idx) => (
                        <div
                          key={idx}
                          className="bg-white rounded-lg p-4 flex items-center gap-3 shadow hover:shadow-md transition-shadow"
                        >
                          <span className="text-2xl">👔</span>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {dress}
                            </p>
                            <p className="text-xs text-gray-500">
                              Perfect match for your tone
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={resetForm}
                  className="w-full py-3 px-6 rounded-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transition-all"
                >
                  🔄 Analyze Another Photo
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-bold text-gray-800 mb-2">Accurate Analysis</h3>
            <p className="text-sm text-gray-600">
              Advanced AI to detect gender and skin tone
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="font-bold text-gray-800 mb-2">Smart Recommendations</h3>
            <p className="text-sm text-gray-600">
              Personalized dress suggestions matched to you
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-bold text-gray-800 mb-2">Instant Results</h3>
            <p className="text-sm text-gray-600">
              Get recommendations in seconds
            </p>
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
