import React from "react";

export default function ColorPicker({ value, onChange, label = "" }) {
  return (
    <div className="flex items-center gap-3">
      {label && <label className="text-sm text-gray-700">{label}</label>}
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-8 p-0 border rounded"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded px-2 py-1 w-28"
      />
    </div>
  );
}
