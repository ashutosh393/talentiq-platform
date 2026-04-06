import express from "express";
import multer from "multer";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  parseResume,
  chatFollowUp,
  evaluateSession,
  getProfile,
  updateProfile,
  getSkillsRadar,
} from "../controllers/interviewController.js";

const router = express.Router();

// Multer — store PDF in memory (max 10 MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

// Resume upload & question generation
router.post("/parse-resume", protectRoute, upload.single("resume"), parseResume);

// Per-answer AI follow-up
router.post("/chat", protectRoute, chatFollowUp);

// End-of-interview evaluation
router.post("/evaluate", protectRoute, evaluateSession);

// Profile CRUD
router.get("/profile", protectRoute, getProfile);
router.patch("/profile", protectRoute, updateProfile);

// Skills radar — merged profile + DSA topics
router.get("/skills-radar", protectRoute, getSkillsRadar);

export default router;
