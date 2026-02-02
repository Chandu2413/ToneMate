import { useState } from "react";
import { detectSkinTone } from "../services/aiService";

export default function ColorRecommender() {
  const [result, setResult] = useState(null);

  const handleImageUpload = async (file) => {
    const base64 = await convertToBase64(file);
    const res = await detectSkinTone(base64);
    setResult(res);
  };

  return (
    <div>
      <h1>Color Recommender</h1>
      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0])} />
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}

async function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
