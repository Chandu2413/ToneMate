import React from "react";

export default function Footer() {
  return (
    <footer className="mt-12 bg-gradient-to-r from-tmindigo to-tmblue text-white">
      <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between">
        <div className="text-sm">© {new Date().getFullYear()} ToneMate</div>
        <div className="text-sm opacity-90">AI outfit & color recommender</div>
      </div>
    </footer>
  );
}
