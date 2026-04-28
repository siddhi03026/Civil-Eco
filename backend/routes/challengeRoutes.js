import express from "express";
import { getChallenges, completeChallenge } from "../controllers/challengeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getChallenges);
router.post("/complete", protect, completeChallenge);

export default router;
