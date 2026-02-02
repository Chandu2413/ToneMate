import express from "express";
import cors from "cors";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";
import aiRoutes from "./routes/aiRoutes.js";
import suggestionRoutes from "./routes/suggestionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();
const PORT = 5000;

/* -------------------- MIDDLEWARE -------------------- */
app.use(cors());
app.use(express.json());

/* -------------------- MULTER SETUP -------------------- */
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

/* -------------------- HEALTH CHECK -------------------- */
app.get("/", (req, res) => {
  res.json({
    status: "Backend running",
    ai_service: "http://127.0.0.1:8000",
  });
});

/* -------------------- AI ANALYZE ROUTE -------------------- */
// Mount route modules
app.use("/api/ai", aiRoutes);
app.use("/api/suggestions", suggestionRoutes);
app.use("/api/admin", adminRoutes);

/* -------------------- START SERVER -------------------- */
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
