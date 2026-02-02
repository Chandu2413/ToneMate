import axios from "axios";

// Backend API (for admin, suggestions, etc.)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

// AI Module API (for image analysis)
const AI_API = axios.create({
  baseURL: import.meta.env.VITE_AI_API_URL || "http://127.0.0.1:8000",
});

// Attach token from localStorage if present
export function setAuthToken(token) {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("admin_token", token);
  }
}

export function clearAuthToken() {
  delete API.defaults.headers.common["Authorization"];
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_user");
}

// Initialize from storage
const existing = localStorage.getItem("admin_token");
if (existing) {
  setAuthToken(existing);
}

// 🔹 AI image analysis (sends to AI module on port 8000)
export async function analyzeImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await AI_API.post("/analyze", formData);
  return res.data;
}

export default API;
