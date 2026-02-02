import express from "express";
import { registerAdmin, loginAdmin } from "../controllers/adminController.js";

const router = express.Router();

router.post("/register", registerAdmin); // for Postman only
router.post("/login", loginAdmin);       // for frontend login

export default router;
