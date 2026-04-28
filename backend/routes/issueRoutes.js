import express from "express";
import {
  createIssue,
  getAllIssues,
  getMapIssues,
  getUserIssues,
  respondToIssue,
  updateIssueStatus,
} from "../controllers/issueController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", protect, upload.single("image"), createIssue);
router.get("/", protect, requireRole("admin"), getAllIssues);
router.get("/user", protect, getUserIssues);
router.get("/map", protect, getMapIssues);
router.put("/:id/status", protect, requireRole("admin"), updateIssueStatus);
router.post("/:id/respond", protect, respondToIssue);

export default router;
