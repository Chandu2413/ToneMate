import React from "react";

export default function SuggestionCard({ suggestion }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow hover:shadow-md transition">
      <h3 className="text-lg font-semibold">{suggestion.title}</h3>
      <div className="mt-2 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded border" style={{ background: suggestion.shirt }} />
          <span className="text-sm text-gray-600">Shirt</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded border" style={{ background: suggestion.pant }} />
          <span className="text-sm text-gray-600">Pant</span>
        </div>
      </div>
      <p className="mt-3 text-gray-700">{suggestion.description}</p>
    </div>
  );
}
