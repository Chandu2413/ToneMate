import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import AiRecommender from "./pages/AiRecommender";
import ColorMatch from "./pages/ColorMatch";
import ColorMixer from "./pages/ColorMixer";
import StylistChat from "./pages/StylistChat";
import Suggestions from "./pages/Suggestions";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ai-recommender" element={<AiRecommender />} />
          <Route path="/color-match" element={<ColorMatch />} />
          <Route path="/color-mixer" element={<ColorMixer />} />
          <Route path="/stylist-chat" element={<StylistChat />} />
          <Route path="/suggestions" element={<Suggestions />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />

        </Routes>
      </main>
      <Footer />
    </div>
  );
}
