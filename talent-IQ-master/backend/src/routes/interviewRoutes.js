import express from "express";
import multer from "multer";
import os from "os";
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
const uploadMemory = multer({
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

// Multer — store Audio temporarily on disk for Groq SDK natively via OS temp to avoid Railway FS errors
const uploadDisk = multer({
  dest: os.tmpdir(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

// Resume upload & question generation
router.post("/parse-resume", protectRoute, uploadMemory.single("resume"), parseResume);

// Per-answer AI follow-up (Text only)
router.post("/chat", protectRoute, chatFollowUp);

// Per-answer AI follow-up (Audio transcribed via Groq)
router.post("/chat/audio", protectRoute, uploadDisk.single("audio"), chatFollowUp);

// End-of-interview evaluation
router.post("/evaluate", protectRoute, evaluateSession);

// Profile CRUD
router.get("/profile", protectRoute, getProfile);
router.patch("/profile", protectRoute, updateProfile);

// Skills radar — merged profile + DSA topics
router.get("/skills-radar", protectRoute, getSkillsRadar);

export default router;
