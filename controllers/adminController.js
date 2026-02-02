import OpenAI from "openai";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

let openai;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
} else {
  // Friendly mock implementation to allow local development without API key
  openai = {
    chat: {
      completions: {
        create: async ({ messages }) => {
          const userMessage = Array.isArray(messages)
            ? messages.reverse().find(m => m.role === 'user')?.content || 'No input'
            : 'No input';
          return { choices: [{ message: { content: `Mock reply: ${userMessage}` } }] };
        },
      },
    },
    responses: {
      create: async ({ input }) => {
        const promptText = Array.isArray(input)
          ? input.map(i => (typeof i === 'string' ? i : i.content || JSON.stringify(i))).join(' ')
          : String(input || '');
        return { output: [{ content: [{ text: `Mock reply for prompt: ${promptText.substring(0, 200)}` }] }] };
      },
    },
  };
}

/* -----------------------------------------------------------
   1️⃣ SKIN TONE DETECTOR (Optional AI-based version)
----------------------------------------------------------- */
export const skinToneDetector = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert fashion stylist. Analyze the user's skin tone from the image description.",
        },
        { role: "user", content: `Analyze skin tone based on this image: ${imageUrl}` },
      ],
    });

    res.json({
      skinTone: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("Skin Tone AI Error:", error);
    res.json({
      skinTone: "medium",
      recommendedShirt: "#4CAF50",
      recommendedPant: "#222222",
    });
  }
};

/* -----------------------------------------------------------
   2️⃣ COLOR MIXER AI (Optional AI explanation)
----------------------------------------------------------- */
export const colorMixerAI = async (req, res) => {
  const { color1, color2 } = req.body;

  const mixed =
    "#" +
    (
      (parseInt(color1.substring(1), 16) +
        parseInt(color2.substring(1), 16)) /
      2
    )
      .toString(16)
      .padStart(6, "0");

  try {
    const explain = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You explain color theory simply." },
        {
          role: "user",
          content: `Explain what happens when you mix ${color1} and ${color2}.`,
        },
      ],
    });

    res.json({ mixedColor: mixed, explanation: explain.choices[0].message.content });
  } catch {
    res.json({ mixedColor: mixed, explanation: "Mixed based on average RGB values." });
  }
};

/* -----------------------------------------------------------
   3️⃣ COLOR MATCH AI (Analyzes shirt + pant combination)
----------------------------------------------------------- */
export const colorMatchAI = async (req, res) => {
  try {
    const { shirt, pant } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a fashion expert. Evaluate color combinations for men's outfits.",
        },
        {
          role: "user",
          content: `Evaluate this outfit: Shirt color ${shirt}, Pant color ${pant}.`,
        },
      ],
    });

    res.json({
      matchScore: "AI Evaluation",
      description: response.choices[0].message.content,
    });
  } catch (error) {
    res.json({
      matchScore: "Great Match",
      description: "These colors go well together!",
    });
  }
};

/* -----------------------------------------------------------
   4️⃣ AI STYLIST CHAT (MAIN FEATURE)
----------------------------------------------------------- */
export const aiChat = async (req, res) => {
  try {
    const { prompt } = req.body;

    console.log("Received prompt:", prompt);
    console.log("Using API Key:", process.env.OPENAI_API_KEY ? "Loaded" : "NOT LOADED");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are ToneMate, an AI fashion stylist expert. Help users with outfit suggestions, color combinations, dress recommendations, and fashion advice. Be friendly, professional, and provide specific recommendations based on their questions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    console.log("OpenAI Response:", completion);

    const reply = completion.choices[0].message.content;

    res.json({ reply });

  } catch (error) {
    console.error("🔥 AI Chat Error FULL:", error);

    res.status(500).json({
      reply:
        "I'm here to help with fashion advice! Please try again. " +
        (error.response?.data?.error?.message ||
         error.message ||
         "Unknown error"),
    });
  }
};

// Simple admin auth (local/dev-friendly)
export const registerAdmin = async (req, res) => {
  // Controlled by env flag to avoid accidental open registration
  if (process.env.ALLOW_ADMIN_REGISTER !== "true") {
    return res.status(403).json({ message: "Registration disabled" });
  }

  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Missing fields" });

  // In small dev setup we don't persist to DB — instruct caller to enable ALLOW_ADMIN_REGISTER
  return res.json({ success: true, admin: { username } });
};

export const loginAdmin = async (req, res) => {
  const { username, password, email } = req.body;
  const user = username || email; // accept either `username` or `email` from the frontend

  const ADMIN_USER = process.env.ADMIN_USER || "admin";
  const ADMIN_PASS = process.env.ADMIN_PASS || "password";

  if (user === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ username: user }, process.env.JWT_SECRET || "devsecret", { expiresIn: "7d" });
    return res.json({ token, admin: { username: user } });
  }

  return res.status(401).json({ message: "Invalid credentials" });
};
