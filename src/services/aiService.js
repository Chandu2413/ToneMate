import axios from "axios";
import API, { analyzeImage } from "./api";

// Backend API endpoints (these could be hosted on backend if needed)
const BACKEND_API = axios.create({
  baseURL: "http://localhost:5000",
});

export async function colorMixer(color1, color2) {
	try {
		const res = await fetch("http://localhost:5000/api/ai/color-mixer", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ color1, color2 }),
		});
		if (!res.ok) throw new Error("Color mixer failed");
		return res.json();
	} catch (error) {
		console.error("Color mixer error:", error);
		throw error;
	}
}

export async function colorMatch(shirt, pant, dressType) {
	try {
		const res = await fetch("http://localhost:5000/api/ai/color-match", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ shirt, pant, dressType }),
		});
		if (!res.ok) throw new Error("Color match failed");
		return res.json();
	} catch (error) {
		console.error("Color match error:", error);
		throw error;
	}
}

export async function aiChat(prompt) {
	try {
		const res = await fetch("http://localhost:5000/api/ai/chat", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ prompt }),
		});
		if (!res.ok) throw new Error("AI chat failed");
		return res.json();
	} catch (error) {
		console.error("AI chat error:", error);
		throw error;
	}
}

export { analyzeImage };
