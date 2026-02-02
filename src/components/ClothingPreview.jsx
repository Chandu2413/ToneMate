import React from "react";

export default function ClothingPreview({ imgSrc, color = "#ffffff", alt = "" }) {
  return (
    <div className="relative inline-block w-64 h-64 overflow-hidden rounded-lg shadow">
      <img src={imgSrc} alt={alt} className="object-contain w-full h-full" />
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-multiply"
        style={{ backgroundColor: color, opacity: 0.95 }}
      />
    </div>
  );
}
