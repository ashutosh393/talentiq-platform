import express from "express";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";
import fetch from "node-fetch";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";

import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";
import problemRoutes from "./routes/problemRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import { protectRoute } from "./middleware/protectRoute.js";

const app = express();

// ✅ Required for Railway proxy
app.set("trust proxy", 1);

// middleware
app.use(express.json());
app.use(cors({ 
  origin: [
    "https://talentiq-platform-new.vercel.app",
    "https://www.talentiq.live",
    "http://localhost:5173"
  ],
  credentials: true 
}));
app.use(clerkMiddleware());

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/newsletter", newsletterRoutes);

// CODE EXECUTION PROXY
const LANGUAGE_MAP = {
  javascript: "nodejs",
  python: "python",
  java: "java",
  cpp: "cpp",
  csharp: "csharp",
  go: "go",
  rust: "rust",
};

app.post("/api/execute", protectRoute, async (req, res) => {
  try {
    const { language, code } = req.body;

    if (!language || !code) {
      return res.status(400).json({ message: "Language and code are required" });
    }

    const response = await fetch(
      `https://onecompiler.com/api/v1/run?access_token=${ENV.ONECOMPILER_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: LANGUAGE_MAP[language] || language,
          files: [{ name: "main", content: code }],
        }),
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error in execute route:", error.message);
    res.status(500).json({ message: error.message });
  }
});

app.get("/health", (req, res) => {
  res.status(200).json({ msg: "api is up and running" });
});

app.get("/", (req, res) => {
  res.status(200).json({ msg: "talentIQ backend is running" });
});

import { autoFetchLeetCodeProblems } from "./lib/autoFetch.js";
import { dispatchDailyNewsletter } from "./lib/newsletterCron.js";

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => console.log("Server is running on port:", ENV.PORT));
    
    // Kick off background auto-sync immediately, and then every 24 hours
    autoFetchLeetCodeProblems();
    dispatchDailyNewsletter();
    
    setInterval(autoFetchLeetCodeProblems, 24 * 60 * 60 * 1000); // 24 hours
    setInterval(dispatchDailyNewsletter, 24 * 60 * 60 * 1000); // 24 hours
  } catch (error) {
    console.error("💥 Error starting the server", error);
  }
};

startServer();