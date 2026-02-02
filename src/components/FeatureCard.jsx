import React from "react";
import { Link } from "react-router-dom";

export default function FeatureCard({ title, desc, to, icon }) {
  return (
    <Link to={to} className="block p-6 rounded-2xl bg-white shadow hover:shadow-lg transition border">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-lg bg-gradient-to-tr from-tmblue to-tmindigo text-white flex items-center justify-center text-xl">
          {icon}
        </div>
        <div>
          <div className="text-lg font-semibold">{title}</div>
          <div className="text-sm text-gray-500 mt-1">{desc}</div>
        </div>
      </div>
    </Link>
  );
}
