import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import { colorMixerAI, aiChat, colorMatchAI } from "../controllers/adminController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Health check for AI microservice
router.get("/status", async (req, res) => {
  try {
    const r = await axios.get("http://127.0.0.1:8000/health", { timeout: 3000 });
    return res.json({ ok: true, ai: r.data });
  } catch (err) {
    console.error("AI status check failed:", err && (err.message || err.code || err.response && err.response.status));
    // Always return 200 with ok:false so frontend can easily consume the result
    // without encountering an HTTP 5xx which triggers browser-level errors.
    const msg = err.code === "ECONNREFUSED" ? "AI microservice unreachable at http://127.0.0.1:8000" : (err.message || 'AI status check failed');
    return res.json({ ok: false, message: msg });
  }
});

router.post("/analyze", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const filePath = req.file && req.file.path;
  try {
    const formData = new FormData();
    // Include the original filename so the AI microservice can validate file extension
    // (multer stores files with a generated name in uploads/ which may lack an extension)
    console.log("Forwarding file to AI microservice", { filePath, originalname: req.file?.originalname, mimetype: req.file?.mimetype });
    formData.append(
      "file",
      fs.createReadStream(filePath),
      req.file && req.file.originalname ? req.file.originalname : "image.jpg"
    );

    console.log('Posting to AI microservice at http://127.0.0.1:8000/analyze with headers', Object.keys(formData.getHeaders()));
    const aiResponse = await axios.post(
      "http://127.0.0.1:8000/analyze",
      formData,
      { headers: formData.getHeaders(), timeout: 20000 }
    );

    console.log('Received response from AI microservice', { status: aiResponse.status });
    // If microservice returns unexpected non-JSON, log the body for review
    try {
      console.log('AI response snippet:', JSON.stringify(aiResponse.data).slice(0, 500));
    } catch (e) {
      console.log('AI response (non-json) length:', typeof aiResponse.data, aiResponse.data && aiResponse.data.length);
    }

    res.json(aiResponse.data);

  } catch (err) {
    // Detailed logging for debugging
    console.error("AI analyze error message:", err.message);
    if (err.response) {
      console.error("AI analyze error response status:", err.response.status);
      console.error("AI analyze error response data:", err.response.data);

      const status = err.response.status;

      // If microservice returned a client error (4xx), forward it to the client
      if (status >= 400 && status < 500) {
        res.setHeader('X-AI-Forwarded-Filename', req.file && req.file.originalname ? req.file.originalname : 'unknown');
        return res.status(status).json({ message: "AI microservice error", details: err.response.data });
      }

      // For server errors (5xx) or any other unexpected response, return a deterministic
      // mock so the frontend doesn't get a 500 during transient upstream failures.
      console.error("AI analyze microservice returned server error; returning mock response", status, err.response.data);
        const mock = {
          status: 'success',
          is_mock: true,
          file_name: req.file ? req.file.originalname || 'image.jpg' : 'image.jpg',
          personal_characteristics: {
            gender: 'unknown',
          skin_tone: 'medium',
          hair_color: 'black',
          body_type: 'average',
          face_shape: 'oval',
          ethnicity: 'south asian',
          color_undertone: 'warm'
        },
        recommendations: {
          traditional: { dress_name: 'Anarkali', kurta_color: 'deep emerald', bottom_color: 'golden', style_details: 'Silk, embroidered, A-line', reason: 'Flattering for average/curvy body types' },
          western: { dress_name: 'Casual Dress', shirt_color: 'navy blue', pant_color: 'denim', style_details: 'Cotton dress, knee-length', reason: 'Versatile everyday wear' },
          function: { dress_name: 'Party Saree', outfit_color: 'deep red', accent_color: 'gold', style_details: 'Silk saree with sequins', reason: 'Festive and bright' },
          office: { dress_name: 'Formal Blazer', shirt_color: 'white', pant_color: 'charcoal', style_details: 'Tailored blazer with trousers', reason: 'Professional and flattering' }
        },
        downloaded_images: {},
        message: 'AI microservice returned a server error — returning mock response for development',
        microservice_error: err.response.data
      };

      res.setHeader('X-AI-Forwarded-Filename', req.file && req.file.originalname ? req.file.originalname : 'unknown');
      return res.json(mock);
    }
    if (err.code && (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND' || err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT' || err.code === 'EAI_AGAIN')) {
      // Provide a deterministic mock response so UI keeps working during local development
      console.error("AI analyze network error; returning mock response", err.code);
      const mock = {
        status: 'success',
        is_mock: true,
        file_name: req.file ? req.file.originalname || 'image.jpg' : 'image.jpg',
        personal_characteristics: {
          gender: 'unknown',
          skin_tone: 'medium',
          hair_color: 'black',
          body_type: 'average',
          face_shape: 'oval',
          ethnicity: 'south asian',
          color_undertone: 'warm'
        },
        recommendations: {
          traditional: { dress_name: 'Anarkali', kurta_color: 'deep emerald', bottom_color: 'golden', style_details: 'Silk, embroidered, A-line', reason: 'Flattering for average/curvy body types' },
          western: { dress_name: 'Casual Dress', shirt_color: 'navy blue', pant_color: 'denim', style_details: 'Cotton dress, knee-length', reason: 'Versatile everyday wear' },
          function: { dress_name: 'Party Saree', outfit_color: 'deep red', accent_color: 'gold', style_details: 'Silk saree with sequins', reason: 'Festive and bright' },
          office: { dress_name: 'Formal Blazer', shirt_color: 'white', pant_color: 'charcoal', style_details: 'Tailored blazer with trousers', reason: 'Professional and flattering' }
        },
        downloaded_images: {},
        message: 'AI microservice unreachable — returned mock response for development'
      };
      return res.json(mock);
    }

    console.error("Unhandled error in /analyze handler:", err);
    // As a final safety net, return a deterministic mock rather than a 500 to
    // the frontend. This keeps the UI usable during unexpected failures.
      const mock = {
      status: 'success',
      is_mock: true,
      file_name: req.file ? req.file.originalname || 'image.jpg' : 'image.jpg',
      personal_characteristics: {
        gender: 'unknown',
        skin_tone: 'medium',
        hair_color: 'black',
        body_type: 'average',
        face_shape: 'oval',
        ethnicity: 'south asian',
        color_undertone: 'warm'
      },
      recommendations: {
        traditional: { dress_name: 'Anarkali', kurta_color: 'deep emerald', bottom_color: 'golden', style_details: 'Silk, embroidered, A-line', reason: 'Flattering for average/curvy body types' },
        western: { dress_name: 'Casual Dress', shirt_color: 'navy blue', pant_color: 'denim', style_details: 'Cotton dress, knee-length', reason: 'Versatile everyday wear' },
        function: { dress_name: 'Party Saree', outfit_color: 'deep red', accent_color: 'gold', style_details: 'Silk saree with sequins', reason: 'Festive and bright' },
        office: { dress_name: 'Formal Blazer', shirt_color: 'white', pant_color: 'charcoal', style_details: 'Tailored blazer with trousers', reason: 'Professional and flattering' }
      },
      downloaded_images: {},
      message: 'AI service error — returned mock response for development',
      debug: err && (err.message || String(err))
    };

    return res.json(mock);
  } finally {
    // always attempt to remove the uploaded file
    try {
      if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (cleanupErr) {
      console.warn("Failed to cleanup uploaded file:", cleanupErr);
    }
  }
});

// Color mixer route (explain mixing two colors)
router.post("/color-mixer", express.json(), colorMixerAI);
router.post("/chat", express.json(), aiChat);
router.post("/color-match", express.json(), colorMatchAI);

export default router;
