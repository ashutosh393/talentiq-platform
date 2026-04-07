import pdfParse from "pdf-parse-new";
import {
  generateInterviewQuestions,
  generateFollowUp,
  evaluateInterview,
  transcribeAudio
} from "../lib/ai.js";
import User from "../models/User.js";
import fs from "fs";
import Session from "../models/Session.js";
import Problem from "../models/Problem.js";

// DSA category → readable skill label mapping
const CATEGORY_LABEL = {
  Array: "Arrays",
  "Two Pointers": "Two Pointers",
  "Sliding Window": "Sliding Window",
  Stack: "Stack",
  Queue: "Queue",
  "Linked List": "Linked Lists",
  Tree: "Trees",
  "Binary Search": "Binary Search",
  Graph: "Graphs",
  "Dynamic Programming": "DP",
  Greedy: "Greedy",
  Backtracking: "Backtracking",
  "Hash Table": "Hash Map",
  Heap: "Heap / PQ",
  Math: "Math",
  String: "Strings",
  Recursion: "Recursion",
};

// Difficulty weight → proficiency contribution per attempt
const DIFF_WEIGHT = { easy: 0.4, medium: 0.7, hard: 1.0 };

// ─── PARSE RESUME ────────────────────────────────────────────────────────────
export async function parseResume(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No PDF file uploaded" });
    }

    // Extract text from PDF buffer
    const data = await pdfParse(req.file.buffer);
    const resumeText = data.text;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ message: "Could not extract text from PDF. Please ensure it is not scanned." });
    }

    // Call Gemini to generate questions and extract skills
    const aiResult = await generateInterviewQuestions(resumeText);

    // Save resume text and skills to the user's profile
    await User.findByIdAndUpdate(req.user._id, {
      resumeText,
      skills: aiResult.skills,
    });

    res.json({
      questions: aiResult.questions,
      skills: aiResult.skills,
      resumeScore: aiResult.resumeScore,
      resumeText,
    });
  } catch (error) {
    console.error("Error in parseResume:", error.message);
    res.status(500).json({ message: error.message || "Failed to analyze resume" });
  }
}

// ─── FOLLOW-UP CHAT ──────────────────────────────────────────────────────────
export async function chatFollowUp(req, res) {
  try {
    const rawSkipped = req.body.isSkipped;
    const isSkipped = rawSkipped === "true" || rawSkipped === true;
    let answer = req.body.answer;

    if (!question) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Question is required" });
    }

    // If an audio file was uploaded, use Groq Whisper to transcribe it
    if (req.file) {
      // Multer strips file extensions in its temp paths. Groq's SDK strictly requires
      // the filepath to contain a valid audio extension (e.g. .wav) to parse correctly.
      const newPath = req.file.path + ".wav";
      fs.renameSync(req.file.path, newPath);

      try {
        answer = await transcribeAudio(newPath);
      } catch (audioErr) {
        console.error("Transcription explicitly failed:", audioErr.message);
        answer = "I spoke but the system failed to transcribe my audio properly.";
      } finally {
        // ALWAYS clean up the temporary disk file securely
        if (fs.existsSync(newPath)) fs.unlinkSync(newPath);
      }
    }

    const result = await generateFollowUp(question || req.body.question, answer, isSkipped);
    // Attach the actual transcribed answer so the frontend can populate its UI accurately
    res.json({ ...result, transcribedAnswer: answer });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    console.error("Error in chatFollowUp:", error.message);
    res.status(500).json({ message: error.message || "Failed to generate follow-up" });
  }
}

// ─── EVALUATE INTERVIEW ──────────────────────────────────────────────────────
export async function evaluateSession(req, res) {
  try {
    const { qaList } = req.body;
    if (!qaList || !Array.isArray(qaList) || qaList.length === 0) {
      return res.status(400).json({ message: "qaList is required" });
    }

    const resumeText = req.user.resumeText || "";
    const evaluation = await evaluateInterview(qaList, resumeText);

    res.json(evaluation);
  } catch (error) {
    console.error("Error in evaluateSession:", error.message);
    res.status(500).json({ message: error.message || "Failed to evaluate interview" });
  }
}

// ─── GET PROFILE ─────────────────────────────────────────────────────────────
export async function getProfile(req, res) {
  try {
    const user = req.user;
    res.json({
      name: user.name,
      email: user.email,
      education: user.education || "",
      bio: user.bio || "",
      skills: user.skills || [],
      profileImage: user.profileImage || "",
    });
  } catch (error) {
    console.error("Error in getProfile:", error.message);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
}

// ─── UPDATE PROFILE ──────────────────────────────────────────────────────────
export async function updateProfile(req, res) {
  try {
    const { name, education, bio, skills } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (education !== undefined) updateData.education = education.trim();
    if (bio !== undefined) updateData.bio = bio.trim();
    if (skills !== undefined && Array.isArray(skills)) {
      updateData.skills = skills.map((s) => s.trim()).filter(Boolean);
    }

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true }
    );

    res.json({
      name: updated.name,
      email: updated.email,
      education: updated.education,
      bio: updated.bio,
      skills: updated.skills,
      profileImage: updated.profileImage,
    });
  } catch (error) {
    console.error("Error in updateProfile:", error.message);
    res.status(500).json({ message: "Failed to update profile" });
  }
}

// ─── SKILLS RADAR DATA ────────────────────────────────────────────────────────
// Merges:
//   1. Resume skills (profile) → fixed proficiency of 0.70
//   2. DSA categories from sessions → proficiency scored by attempts + difficulty
export async function getSkillsRadar(req, res) {
  try {
    const userId = req.user._id;

    // ── 1. Resume / profile skills ──────────────────────────────────────────
    const profileSkills = (req.user.skills || []).slice(0, 5).map((name) => ({
      name,
      proficiency: 0.70,  // baseline from resume
      source: "resume",
    }));

    // ── 2. DSA topics from completed sessions ───────────────────────────────
    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
    }).select("problem difficulty").lean();

    // Map counts per topic+difficulty
    const topicScores = {}; // { topicLabel: { total, count } }

    if (sessions.length > 0) {
      // Get unique problem titles from sessions
      const problemTitles = [...new Set(sessions.map((s) => s.problem))];

      // Find matching problems by title to get their category
      const problems = await Problem.find({
        title: { $in: problemTitles },
      }).select("title category").lean();

      const titleToCategory = {};
      problems.forEach((p) => { if (p.category) titleToCategory[p.title] = p.category; });

      // Score each session's DSA topic
      sessions.forEach((s) => {
        const rawCat = titleToCategory[s.problem] || null;
        if (!rawCat) return;
        const label = CATEGORY_LABEL[rawCat] || rawCat;
        if (!topicScores[label]) topicScores[label] = { total: 0, count: 0 };
        topicScores[label].total += DIFF_WEIGHT[s.difficulty] || 0.5;
        topicScores[label].count += 1;
      });
    }

    // Convert topic scores → proficiency 0–1 (soft cap via sigmoid-like formula)
    // Each attempt pushes proficiency up; 3 hard problems ≈ 1.0
    const dsaSkills = Object.entries(topicScores)
      .map(([name, { total }]) => ({
        name,
        proficiency: Math.min(0.95, total / 3),  // 3 weighted attempts → near max
        source: "dsa",
      }))
      .sort((a, b) => b.proficiency - a.proficiency)
      .slice(0, 5); // top 5 DSA topics

    // ── 3. Merge: profile skills go first, DSA skills fill remaining slots ──
    const profileNames = new Set(profileSkills.map((s) => s.name.toLowerCase()));
    const merged = [
      ...profileSkills,
      ...dsaSkills.filter((d) => !profileNames.has(d.name.toLowerCase())),
    ].slice(0, 8); // max 8 for a clean radar

    res.json({ skills: merged, sessionCount: sessions.length });
  } catch (error) {
    console.error("Error in getSkillsRadar:", error.message);
    res.status(500).json({ message: "Failed to load skills radar" });
  }
}

