import { Link } from "react-router-dom";
import { FaTshirt, FaPalette, FaComments, FaLightbulb, FaFillDrip } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex flex-col">
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4 animate-fadeIn">
            ToneMate
          </h1>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            🎨 AI-powered outfit and color tools designed to make you look amazing
          </p>

          <Link
            to="/ai-recommender"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all transform"
          >
            ✨ Try AI Recommender →
          </Link>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-20">

        {/* AI Recommender */}
        <Link to="/ai-recommender">
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer transform group border-2 border-transparent hover:border-purple-300 h-full">
            <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">👨</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">AI Recommender</h3>
            <p className="text-gray-600">
              Upload a photo — AI analyzes gender and skin tone to suggest perfect dresses.
            </p>
          </div>
        </Link>

        {/* Color Match */}
        <Link to="/color-match">
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer transform group border-2 border-transparent hover:border-blue-300 h-full">
            <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">🎨</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Color Match</h3>
            <p className="text-gray-600">
              Try shirt + pant or kurta + pajama combos. See realistic color combinations instantly.
            </p>
          </div>
        </Link>

        {/* Color Mixer */}
        <Link to="/color-mixer">
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer transform group border-2 border-transparent hover:border-pink-300 h-full">
            <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">🎭</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Color Mixer</h3>
            <p className="text-gray-600">
              Mix 2 colors and discover the resulting shade with AI-powered explanations.
            </p>
          </div>
        </Link>

        {/* Chat */}
        <Link to="/chat" className="md:col-span-2 lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer transform group border-2 border-transparent hover:border-cyan-300 h-full">
            <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">💬</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Stylist Chat</h3>
            <p className="text-gray-600">
              Ask the AI stylist for outfit ideas, colors, and fashion tips.
            </p>
          </div>
        </Link>

        {/* Suggestions */}
        <Link to="/suggestions">
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer transform group border-2 border-transparent hover:border-yellow-300 h-full">
            <div className="text-5xl mb-4 group-hover:scale-125 transition-transform">✨</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Suggestions</h3>
            <p className="text-gray-600">
              See curated outfit ideas from the admin (seasonal & trending).
            </p>
          </div>
        </Link>

      </section>

      {/* Info Section */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 px-6 pb-12">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow p-6 text-center border-2 border-blue-200">
          <div className="text-5xl mb-3">🚀</div>
          <h3 className="font-bold text-gray-800 mb-2 text-lg">Fast & Easy</h3>
          <p className="text-sm text-gray-700">
            Get personalized recommendations in seconds
          </p>
        </div>
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl shadow p-6 text-center border-2 border-pink-200">
          <div className="text-5xl mb-3">🤖</div>
          <h3 className="font-bold text-gray-800 mb-2 text-lg">AI-Powered</h3>
          <p className="text-sm text-gray-700">
            Advanced machine learning for accuracy
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow p-6 text-center border-2 border-purple-200">
          <div className="text-5xl mb-3">💎</div>
          <h3 className="font-bold text-gray-800 mb-2 text-lg">Premium Results</h3>
          <p className="text-sm text-gray-700">
            Look your absolute best with science
          </p>
        </div>
      </section>

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
