import express from "express";
import { getAllUsers, getAllIssuesAdmin, deleteUser } from "../controllers/adminController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users", protect, requireRole("admin"), getAllUsers);
router.delete("/users/:id", protect, requireRole("admin"), deleteUser);
router.get("/issues", protect, requireRole("admin"), getAllIssuesAdmin);

export default router;
