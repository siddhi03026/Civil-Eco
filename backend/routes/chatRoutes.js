import express from "express";
import { chatWithGroq } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, chatWithGroq);

export default router;
