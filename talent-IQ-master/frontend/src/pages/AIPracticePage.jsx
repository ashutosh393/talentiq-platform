import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import { useUser } from "@clerk/clerk-react";
import axios from "../lib/axios";

// ─── Phase constants ──────────────────────────────────────────────────────────
const PHASE = { UPLOAD: "upload", READY: "ready", INTERVIEW: "interview", EVALUATION: "evaluation" };

// ─── Category color map ───────────────────────────────────────────────────────
const CAT_COLOR = { Technical: "#8B7CF6", Behavioral: "#F59E0B", Project: "#00E5A0" };
const DIFF_COLOR = { Easy: "#00E5A0", Medium: "#F59E0B", Hard: "#F87171" };

function AIPracticePage() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [phase, setPhase] = useState(PHASE.UPLOAD);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Resume parse result
  const [questions, setQuestions] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeScore, setResumeScore] = useState(0);
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");

  // Interview state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { qId: { answer, followUp, skipped } }
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [followUpText, setFollowUpText] = useState("");
  const [showFollowUp, setShowFollowUp] = useState(false);

  // Evaluation state
  const [evaluation, setEvaluation] = useState(null);
  const [evaluating, setEvaluating] = useState(false);

  // Voice AI State & Sequencing
  const [intPhase, setIntPhase] = useState("ai-speaking"); // "ai-speaking" | "thinking" | "recording" | "submitting"
  const [timeLeft, setTimeLeft] = useState(60);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  
  const synthRef = useRef(window.speechSynthesis);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const chatBottomRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [answers, followUpText, currentQIndex]);

  // State Timer for Thinking Phase
  useEffect(() => {
    let interval;
    if (intPhase === "thinking" && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    } else if (intPhase === "thinking" && timeLeft === 0) {
      startRecording();
    }
    return () => clearInterval(interval);
  }, [intPhase, timeLeft]);

  // Clean up Audio on unmount
  useEffect(() => {
    return () => {
      synthRef.current?.cancel();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Text-to-Speech Helper
  const speakText = (text) => {
    if (!synthRef.current) return;
    synthRef.current.cancel(); 
    
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = synthRef.current.getVoices();
      
      // Try to grab a premium sounding voice like Google US or Samantha
      const preferred = voices.find(v => v.name.includes("Google US") || v.name.includes("Samantha") || v.lang === "en-US");
      if (preferred) utterance.voice = preferred;
      
      utterance.onstart = () => setAiSpeaking(true);
      // Start thinking phase right after telling the question
      utterance.onend = () => {
        setAiSpeaking(false);
        if (intPhase === "ai-speaking") {
           setTimeLeft(60);
           setIntPhase("thinking");
        }
      };
      utterance.onerror = () => {
        setAiSpeaking(false);
        if (intPhase === "ai-speaking") {
           setTimeLeft(60);
           setIntPhase("thinking");
        }
      };
      
      synthRef.current.speak(utterance);
    }, 50);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Try to force WEBM if supported, otherwise let the browser default to its native format (Safari/iOS)
      let options = {};
      if (MediaRecorder.isTypeSupported('audio/webm')) {
        options = { mimeType: 'audio/webm' };
      }
      
      const mediaRecorder = new MediaRecorder(stream, options);
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIntPhase("recording");
    } catch (err) {
      console.error("Mic access denied or error:", err);
      alert("Microphone access is strictly required to answer questions using Voice. Make sure you allow microphone access.");
    }
  };

  // Trigger initial AI voice when interview starts
  useEffect(() => {
    if (phase === PHASE.INTERVIEW && questions.length > 0 && currentQIndex === 0 && !answers[questions[0].id]) {
       setIntPhase("ai-speaking");
       speakText(`Welcome to your mock interview. Let's begin. Question 1. ${questions[0].question}`);
    }
  }, [phase]);

  // Trigger voice on next question
  useEffect(() => {
     if (phase === PHASE.INTERVIEW && currentQIndex > 0 && questions[currentQIndex] && !answers[questions[currentQIndex].id]) {
       setIntPhase("ai-speaking");
       speakText(`Question ${currentQIndex + 1}. ${questions[currentQIndex].question}`);
     }
  }, [currentQIndex]);

  // ─── File handling ───────────────────────────────────────────────────────────
  const handleFile = async (file) => {
    if (!file || file.type !== "application/pdf") {
      setUploadError("Please upload a valid PDF file.");
      return;
    }
    setUploadError("");
    setFileName(file.name);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const res = await axios.post(`/interview/parse-resume`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setQuestions(res.data.questions);
      setSkills(res.data.skills);
      setResumeScore(res.data.resumeScore);
      setResumeText(res.data.resumeText);
      setPhase(PHASE.READY);
    } catch (err) {
      setUploadError(err.response?.data?.message || "Failed to analyze resume. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  // ─── Interview logic ─────────────────────────────────────────────────────────
  const currentQ = questions[currentQIndex];
  const totalQ = questions.length;
  const answeredCount = Object.keys(answers).length;

  const submitAnswer = async (isSkipped = false, audioBlob = null) => {
    setIsLoading(true);
    setShowFollowUp(false);
    setIntPhase("submitting");

    try {
      let res;
      if (audioBlob && !isSkipped) {
        const formData = new FormData();
        formData.append("question", currentQ.question);
        formData.append("isSkipped", "false");
        // Append a generic audio.wav extension so Groq's ffmpeg backend probes it properly regardless of browser origin
        formData.append("audio", audioBlob, "audio.wav");

        res = await axios.post(`/interview/chat/audio`, formData, { 
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true 
        });
      } else {
        res = await axios.post(`/interview/chat`, {
          question: currentQ.question,
          answer: "",
          isSkipped,
        }, { withCredentials: true });
      }

      const followUp = res.data.followUp;
      const finalTranscribed = res.data.transcribedAnswer || (isSkipped ? "" : "Audio Answer Tracked.");

      setAnswers((prev) => ({
        ...prev,
        [currentQ.id]: { answer: finalTranscribed, followUp, skipped: isSkipped },
      }));
      setFollowUpText(followUp);
      setShowFollowUp(true);
      setIntPhase("ai-speaking");
      speakText(followUp);
    } catch {
      setAnswers((prev) => ({
        ...prev,
        [currentQ.id]: { answer: isSkipped ? "" : "Failed to parse audio.", followUp: "Let's continue.", skipped: isSkipped },
      }));
      setFollowUpText("Let's continue.");
      setShowFollowUp(true);
      setIntPhase("ai-speaking");
      speakText("Let's continue.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopAndSubmit = (isSkipped = false) => {
    if (isSkipped) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      }
      submitAnswer(true, null);
      return;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.onstop = () => {
        // Leave Blob type generic to match the browser's raw recording chunks
        const audioBlob = new Blob(audioChunksRef.current);
        mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
        submitAnswer(false, audioBlob);
      };
      mediaRecorderRef.current.stop();
    }
  };

  const nextQuestion = () => {
    setShowFollowUp(false);
    setFollowUpText("");
    if (currentQIndex < totalQ - 1) {
      setCurrentQIndex((i) => i + 1);
    }
  };

  const isLastQuestion = currentQIndex === totalQ - 1;
  const canFinish = answeredCount > 0;

  const finishInterview = async () => {
    setEvaluating(true);
    setPhase(PHASE.EVALUATION);
    try {
      const qaList = questions.map((q) => {
        const a = answers[q.id];
        return {
          questionId: q.id,
          question: q.question,
          answer: a?.answer || "",
          skipped: a?.skipped || !a,
        };
      });
      const res = await axios.post(`/interview/evaluate`, { qaList }, { timeout: 30000 });
      setEvaluation(res.data);
    } catch {
      setEvaluation({
        overallScore: 65,
        grade: "C+",
        summary: "Could not load evaluation. Please try again.",
        strengths: [],
        improvements: [],
        questionScores: [],
        hiringRecommendation: "Needs Work",
      });
    } finally {
      setEvaluating(false);
    }
  };

  // ─── Render helpers ──────────────────────────────────────────────────────────
  const userInitials = user?.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const scoreColor = (s) => s >= 80 ? "#00E5A0" : s >= 60 ? "#F59E0B" : "#F87171";
  const gradeColor = (g) =>
    g?.startsWith("A") ? "#00E5A0" : g?.startsWith("B") ? "#8B7CF6" : g?.startsWith("C") ? "#F59E0B" : "#F87171";

  return (
    <>
      <style>{`
        /* ── Root ── */
        .ai-root { min-height: 100vh; background: #0A0C0F; color: #EEF2FF; font-family: 'DM Sans', sans-serif; padding-bottom: 60px; }
        .ai-wrap { max-width: 900px; margin: 0 auto; padding: 28px 24px; }

        /* ── Upload Phase ── */
        .up-card { background: #0D1117; border: 1px solid #ffffff12; border-radius: 16px; padding: 40px; text-align: center; }
        .drop-zone { border: 2px dashed #ffffff20; border-radius: 12px; padding: 48px 24px; cursor: pointer; transition: all 0.2s; position: relative; }
        .drop-zone:hover, .drop-zone.drag { border-color: #8B7CF660; background: #8B7CF608; }
        .drop-zone.drag { border-color: #8B7CF6; background: #8B7CF610; }
        .drop-icon { width: 56px; height: 56px; background: #8B7CF615; border: 1px solid #8B7CF640; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
        .drop-main { font-size: 16px; font-weight: 600; margin-bottom: 6px; }
        .drop-sub { font-size: 13px; color: #7A8499; margin-bottom: 20px; }
        .btn-browse { padding: 10px 24px; background: #8B7CF6; border: none; border-radius: 8px; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: 0.2s; }
        .btn-browse:hover { background: #9D8FF7; transform: translateY(-1px); }
        .upload-loader { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 40px; }
        .spin { width: 40px; height: 40px; border: 3px solid #ffffff15; border-top-color: #8B7CF6; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .err-msg { background: #F8717115; border: 1px solid #F8717140; border-radius: 8px; padding: 10px 14px; font-size: 13px; color: #F87171; margin-top: 16px; }

        /* ── Ready Phase ── */
        .ready-grid { display: grid; grid-template-columns: 280px 1fr; gap: 20px; }
        @media(max-width:720px) { .ready-grid { grid-template-columns: 1fr; } }
        .r-card { background: #0D1117; border: 1px solid #ffffff12; border-radius: 14px; padding: 20px; }
        .r-label { font-size: 10px; color: #7A8499; text-transform: uppercase; letter-spacing: .08em; font-weight: 600; margin-bottom: 12px; }
        .score-ring { display: flex; align-items: center; justify-content: center; margin: 8px 0 16px; }
        .skill-chips { display: flex; flex-wrap: wrap; gap: 6px; }
        .skill-chip { font-size: 11px; padding: 4px 10px; border-radius: 20px; background: #8B7CF615; border: 1px solid #8B7CF640; color: #8B7CF6; font-weight: 500; }
        .q-row { display: flex; gap: 10px; padding: 10px 12px; background: #111520; border: 1px solid #ffffff08; border-radius: 8px; margin-bottom: 8px; cursor: default; transition: 0.15s; }
        .q-row:hover { background: #161c2a; border-color: #ffffff15; }
        .q-num { font-size: 10px; color: #00E5A0; font-family: 'JetBrains Mono', monospace; font-weight: 700; min-width: 20px; margin-top: 1px; }
        .q-text { font-size: 13px; color: #C4CAD4; line-height: 1.5; }
        .q-meta { display: flex; gap: 6px; margin-top: 6px; }
        .q-tag { font-size: 10px; padding: 2px 8px; border-radius: 4px; font-weight: 600; }
        .btn-start { width: 100%; padding: 14px; background: linear-gradient(135deg, #8B7CF6, #00E5A0); border: none; border-radius: 10px; color: #fff; font-size: 15px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: 0.2s; margin-top: 4px; }
        .btn-start:hover { opacity: 0.9; transform: translateY(-1px); }

        /* ── Interview Phase ── */
        .int-layout { display: grid; grid-template-columns: 260px 1fr; gap: 20px; }
        @media(max-width:720px) { .int-layout { grid-template-columns: 1fr; } }
        .int-sidebar { background: #0D1117; border: 1px solid #ffffff12; border-radius: 14px; padding: 18px; height: fit-content; position: sticky; top: 80px; }
        .q-nav-item { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 8px; cursor: pointer; transition: 0.15s; margin-bottom: 4px; font-size: 13px; }
        .q-nav-item.active { background: #8B7CF620; border: 1px solid #8B7CF640; color: #8B7CF6; }
        .q-nav-item.done { background: #00E5A010; color: #00E5A0; }
        .q-nav-item.skipped { background: #F8717110; color: #F87171; }
        .q-nav-item.pending { color: #7A8499; }
        .q-nav-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .int-main { background: #0D1117; border: 1px solid #ffffff12; border-radius: 14px; display: flex; flex-direction: column; min-height: 500px; overflow: hidden; }
        .int-header { padding: 18px 20px; border-bottom: 1px solid #ffffff10; display: flex; justify-content: space-between; align-items: center; }
        .int-progress { height: 3px; background: #161C28; border-radius: 2px; overflow: hidden; }
        .int-progress-fill { height: 100%; background: linear-gradient(90deg, #8B7CF6, #00E5A0); border-radius: 2px; transition: width 0.4s ease; }
        .chat-area { flex: 1; padding: 20px; display: flex; flex-direction: column; gap: 16px; overflow-y: auto; max-height: 400px; }
        .msg-ai { display: flex; gap: 10px; }
        .ai-avatar { width: 34px; height: 34px; border-radius: 10px; background: #00E5A015; border: 1px solid #00E5A040; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ai-bubble { background: #161C28; border: 1px solid #ffffff08; border-radius: 10px; border-top-left-radius: 2px; padding: 12px 14px; font-size: 14px; color: #EEF2FF; line-height: 1.6; font-weight: 300; max-width: 85%; }
        .ai-bubble.followup { background: #1a2040; border-color: #8B7CF630; font-size: 13px; color: #b0b8d4; }
        .msg-user { display: flex; gap: 10px; justify-content: flex-end; }
        .user-avatar { width: 34px; height: 34px; border-radius: 10px; background: #8B7CF615; border: 1px solid #8B7CF640; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #8B7CF6; flex-shrink: 0; font-family: 'Syne', sans-serif; order: 2; }
        .user-bubble { background: #8B7CF620; border: 1px solid #8B7CF640; border-radius: 10px; border-top-right-radius: 2px; padding: 12px 14px; font-size: 14px; color: #EEF2FF; line-height: 1.6; font-weight: 300; max-width: 85%; order: 1; }
        .skipped-bubble { background: #F8717115; border: 1px solid #F8717130; border-radius: 10px; border-top-right-radius: 2px; padding: 10px 14px; font-size: 13px; color: #F87171; line-height: 1.5; max-width: 85%; order: 1; font-style: italic; }
        .typing { display: flex; gap: 5px; align-items: center; padding: 4px 0; }
        .typing span { width: 6px; height: 6px; border-radius: 50%; background: #7A8499; animation: bounce 1.2s infinite; }
        .typing span:nth-child(2) { animation-delay: 0.2s; }
        .typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }
        .int-input-area { padding: 16px 20px; border-top: 1px solid #ffffff10; background: #111520; }
        .int-input { width: 100%; background: #161C28; border: 1px solid #ffffff20; border-radius: 10px; padding: 12px 16px; font-size: 14px; color: #EEF2FF; outline: none; resize: none; font-family: 'DM Sans', sans-serif; min-height: 60px; }
        .int-input:focus { border-color: #8B7CF6; }
        .int-actions { display: flex; gap: 8px; margin-top: 10px; }
        .btn-submit { flex: 1; padding: 11px; background: #8B7CF6; border: none; border-radius: 8px; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: 0.2s; }
        .btn-submit:hover:not(:disabled) { background: #9D8FF7; }
        .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-skip { padding: 11px 16px; background: transparent; border: 1px solid #ffffff20; border-radius: 8px; color: #7A8499; font-size: 13px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: 0.2s; }
        .btn-skip:hover { border-color: #F87171; color: #F87171; }
        
        /* ── Strict Voice AI Styling ── */
        .seq-card { padding: 20px; background: #161C28; border: 1px solid #ffffff12; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 140px; text-align: center; }
        .seq-title { font-size: 14px; font-weight: 600; color: #EEF2FF; margin-bottom: 8px; }
        .seq-sub { font-size: 13px; color: #7A8499; }
        .timer-display { font-family: 'JetBrains Mono', monospace; font-size: 32px; font-weight: 700; margin: 12px 0; color: #F59E0B; }
        .recording-banner { background: #F8717115; border: 1px solid #F8717140; color: #F87171; border-radius: 8px; padding: 12px 20px; font-size: 15px; font-weight: 700; width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; animation: recPulse 2s infinite; }
        .rec-dot { width: 10px; height: 10px; background: #F87171; border-radius: 50%; box-shadow: 0 0 8px #F87171; }
        
        @keyframes recPulse {
          0%, 100% { border-color: #F8717140; box-shadow: 0 0 0 transparent; }
          50% { border-color: #F8717180; box-shadow: 0 0 15px #F8717120; }
        }
        
        .ai-avatar.speaking { animation: pulseAi 1.5s infinite; border-color: #00E5A0; box-shadow: 0 0 12px #00E5A040; }
        @keyframes pulseAi { 0% { transform: scale(1); } 50% { transform: scale(1.08); } 100% { transform: scale(1); } }

        .btn-next { padding: 11px 18px; background: #00E5A015; border: 1px solid #00E5A040; border-radius: 8px; color: #00E5A0; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: 0.2s; }
        .btn-next:hover { background: #00E5A025; }
        .btn-finish { flex: 1; padding: 11px; background: linear-gradient(135deg, #F59E0B, #F87171); border: none; border-radius: 8px; color: #fff; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: 0.2s; }
        .btn-finish:hover { opacity: 0.9; }
        .btn-finish:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ── Evaluation Phase ── */
        .eval-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media(max-width:720px) { .eval-grid { grid-template-columns: 1fr; } }
        .eval-card { background: #0D1117; border: 1px solid #ffffff12; border-radius: 14px; padding: 22px; }
        .eval-hero { background: linear-gradient(135deg, #8B7CF610, #00E5A010); border: 1px solid #8B7CF630; border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 20px; }
        .score-big { font-size: 72px; font-weight: 800; font-family: 'JetBrains Mono', monospace; line-height: 1; }
        .grade-badge { display: inline-block; padding: 6px 20px; border-radius: 20px; font-size: 18px; font-weight: 700; margin: 12px 0; font-family: 'Syne', sans-serif; }
        .rec-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; margin-top: 8px; }
        .q-score-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #ffffff08; }
        .q-score-row:last-child { border-bottom: none; }
        .q-score-text { font-size: 13px; color: #C4CAD4; line-height: 1.4; flex: 1; margin-right: 12px; }
        .q-score-num { font-size: 16px; font-weight: 700; font-family: 'JetBrains Mono', monospace; min-width: 44px; text-align: right; }
        .q-feedback { font-size: 11px; color: #7A8499; margin-top: 4px; line-height: 1.4; }
        .list-item { display: flex; gap: 8px; align-items: flex-start; margin-bottom: 10px; font-size: 13px; color: #C4CAD4; line-height: 1.5; }
        .list-dot { width: 6px; height: 6px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
        .eval-actions { display: flex; gap: 10px; margin-top: 20px; }
        .btn-retry { padding: 12px 24px; background: #8B7CF6; border: none; border-radius: 8px; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: 0.2s; }
        .btn-retry:hover { background: #9D8FF7; }
        .btn-dash { padding: 12px 24px; background: transparent; border: 1px solid #ffffff20; border-radius: 8px; color: #EEF2FF; font-size: 14px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: 0.2s; }
        .btn-dash:hover { background: #161C28; }
        .eval-loader { display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 80px 24px; text-align: center; }
        .eval-spin { width: 60px; height: 60px; border: 4px solid #ffffff15; border-top-color: #8B7CF6; border-radius: 50%; animation: spin 1s linear infinite; }
        .phase-header { margin-bottom: 24px; }
        .phase-title { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; margin-bottom: 4px; }
        .phase-sub { color: #7A8499; font-size: 14px; }
      `}</style>

      <div className="ai-root">
        <Navbar />
        <div className="ai-wrap">

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* PHASE 1 — UPLOAD                                               */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {phase === PHASE.UPLOAD && (
            <>
              <div className="phase-header">
                <h1 className="phase-title">AI Mock Interview</h1>
                <p className="phase-sub">Upload your resume — our AI will generate personalized interview questions</p>
              </div>

              <div className="up-card">
                {uploading ? (
                  <div className="upload-loader">
                    <div className="spin" />
                    <div style={{ fontSize: 14, color: "#7A8499" }}>Analyzing your resume with AI...</div>
                    <div style={{ fontSize: 12, color: "#3A4255" }}>Extracting skills & generating tailored questions</div>
                  </div>
                ) : (
                  <>
                    <div
                      className={`drop-zone${isDragging ? " drag" : ""}`}
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                    >
                      <div className="drop-icon">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#8B7CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="14 2 14 8 20 8" stroke="#8B7CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="12" y1="13" x2="12" y2="19" stroke="#8B7CF6" strokeWidth="1.5" strokeLinecap="round"/>
                          <polyline points="9 16 12 13 15 16" stroke="#8B7CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="drop-main">Drop your resume here</div>
                      <div className="drop-sub">Supports PDF format up to 10 MB</div>
                      <button className="btn-browse" onClick={(e) => e.stopPropagation()}>Browse Files</button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        style={{ display: "none" }}
                        onChange={(e) => handleFile(e.target.files[0])}
                      />
                    </div>
                    {uploadError && <div className="err-msg">⚠ {uploadError}</div>}
                    <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                      {["8 tailored questions", "Skills extraction", "Live AI follow-ups", "Final scorecard"].map((f) => (
                        <div key={f} style={{ fontSize: 12, color: "#7A8499", display: "flex", alignItems: "center", gap: 5 }}>
                          <span style={{ color: "#00E5A0" }}>✓</span> {f}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* PHASE 2 — READY                                                */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {phase === PHASE.READY && (
            <>
              <div className="phase-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h1 className="phase-title">Ready to Interview</h1>
                  <p className="phase-sub">Review your extracted skills and the generated questions below</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#00E5A015", border: "1px solid #00E5A040", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "#00E5A0" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round"/></svg>
                  {fileName}
                </div>
              </div>

              <div className="ready-grid">
                {/* Left sidebar */}
                <div>
                  <div className="r-card" style={{ marginBottom: 16 }}>
                    <div className="r-label">Resume Score</div>
                    <div className="score-ring">
                      <svg width="110" height="110" viewBox="0 0 110 110">
                        <circle cx="55" cy="55" r="46" fill="none" stroke="#161C28" strokeWidth="9"/>
                        <circle cx="55" cy="55" r="46" fill="none"
                          stroke={scoreColor(resumeScore)}
                          strokeWidth="9"
                          strokeDasharray={`${289}`}
                          strokeDashoffset={289 - (289 * resumeScore / 100)}
                          strokeLinecap="round"
                          transform="rotate(-90 55 55)"
                        />
                        <text x="55" y="62" textAnchor="middle" fill={scoreColor(resumeScore)} fontSize="26" fontFamily="'JetBrains Mono', monospace" fontWeight="700">{resumeScore}</text>
                      </svg>
                    </div>
                    <div style={{ textAlign: "center", fontSize: 12, color: "#7A8499" }}>
                      {resumeScore >= 80 ? "Excellent resume!" : resumeScore >= 60 ? "Good · room to improve" : "Needs improvement"}
                    </div>
                  </div>

                  <div className="r-card" style={{ marginBottom: 16 }}>
                    <div className="r-label">Extracted Skills ({skills.length})</div>
                    <div className="skill-chips">
                      {skills.map((s, i) => (
                        <span key={i} className="skill-chip">{s}</span>
                      ))}
                    </div>
                  </div>

                  <button className="btn-start" onClick={() => setPhase(PHASE.INTERVIEW)}>
                    Start Interview →
                  </button>
                  <button
                    onClick={() => { setPhase(PHASE.UPLOAD); setFileName(""); setSkills([]); setQuestions([]); }}
                    style={{ width: "100%", marginTop: 8, padding: "10px", background: "transparent", border: "1px solid #ffffff15", borderRadius: 8, color: "#7A8499", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Upload different resume
                  </button>
                </div>

                {/* Right — questions preview */}
                <div className="r-card">
                  <div className="r-label">Generated Questions ({questions.length})</div>
                  {questions.map((q, i) => (
                    <div key={q.id} className="q-row">
                      <div className="q-num">Q{i + 1}</div>
                      <div>
                        <div className="q-text">{q.question}</div>
                        <div className="q-meta">
                          <span className="q-tag" style={{ background: CAT_COLOR[q.category] + "20", color: CAT_COLOR[q.category] }}>{q.category}</span>
                          <span className="q-tag" style={{ background: DIFF_COLOR[q.difficulty] + "20", color: DIFF_COLOR[q.difficulty] }}>{q.difficulty}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* PHASE 3 — INTERVIEW                                            */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {phase === PHASE.INTERVIEW && (
            <>
              <div className="phase-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h1 className="phase-title">Interview In Progress</h1>
                  <p className="phase-sub">{answeredCount} of {totalQ} questions answered · you can skip questions</p>
                </div>
                <button
                  className="btn-finish"
                  disabled={!canFinish}
                  onClick={finishInterview}
                  style={{ width: "auto", padding: "10px 20px" }}
                >
                  Finish & Evaluate →
                </button>
              </div>

              {/* Progress bar */}
              <div className="int-progress" style={{ marginBottom: 20 }}>
                <div className="int-progress-fill" style={{ width: `${(answeredCount / totalQ) * 100}%` }} />
              </div>

              <div className="int-layout">
                {/* Sidebar — question navigator */}
                <div className="int-sidebar">
                  <div className="r-label" style={{ marginBottom: 12 }}>Questions</div>
                  {questions.map((q, i) => {
                    const ans = answers[q.id];
                    const isActive = i === currentQIndex;
                    const cls = isActive ? "active" : ans?.skipped ? "skipped" : ans ? "done" : "pending";
                    return (
                      <div
                        key={q.id}
                        className={`q-nav-item ${cls}`}
                        onClick={() => { setShowFollowUp(false); setCurrentQIndex(i); }}
                      >
                        <div className="q-nav-dot" style={{
                          background: isActive ? "#8B7CF6" : ans?.skipped ? "#F87171" : ans ? "#00E5A0" : "#3A4255"
                        }} />
                        <span style={{ fontSize: 12 }}>Q{i + 1} · {q.category}</span>
                        {ans?.skipped && <span style={{ marginLeft: "auto", fontSize: 10 }}>skip</span>}
                        {ans && !ans.skipped && <span style={{ marginLeft: "auto", fontSize: 12 }}>✓</span>}
                      </div>
                    );
                  })}

                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #ffffff10" }}>
                    <button
                      className="btn-finish"
                      disabled={!canFinish}
                      onClick={finishInterview}
                      style={{ width: "100%", padding: "11px" }}
                    >
                      Finish Interview
                    </button>
                  </div>
                </div>

                {/* Main chat area */}
                <div className="int-main">
                  <div className="int-header">
                    <div>
                      <div style={{ fontSize: 11, color: "#7A8499", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 2 }}>
                        {currentQ?.category} · {currentQ?.difficulty}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>Question {currentQIndex + 1} of {totalQ}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span className="q-tag" style={{ background: CAT_COLOR[currentQ?.category] + "20", color: CAT_COLOR[currentQ?.category], fontSize: 11, padding: "3px 10px", borderRadius: 6 }}>
                        {currentQ?.category}
                      </span>
                    </div>
                  </div>

                  <div className="chat-area">
                    {/* Current question from AI */}
                    <div className="msg-ai">
                      <div className={`ai-avatar ${aiSpeaking && !answers[currentQ?.id] ? "speaking" : ""}`}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="8" r="4" stroke="#00E5A0" strokeWidth="1.5"/>
                          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#00E5A0" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <div className="ai-bubble">{currentQ?.question}</div>
                    </div>

                    {/* Previous answer for this question */}
                    {answers[currentQ?.id] && (
                      <>
                        <div className="msg-user">
                          <div className="user-avatar">{userInitials}</div>
                          {answers[currentQ.id].skipped ? (
                            <div className="skipped-bubble">Skipped this question</div>
                          ) : (
                            <div className="user-bubble">{answers[currentQ.id].answer}</div>
                          )}
                        </div>
                        {/* Show stored follow-up */}
                        <div className="msg-ai">
                          <div className={`ai-avatar ${aiSpeaking ? "speaking" : ""}`}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="8" r="4" stroke="#00E5A0" strokeWidth="1.5"/>
                              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#00E5A0" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                          </div>
                          <div className="ai-bubble followup">{answers[currentQ.id].followUp}</div>
                        </div>
                      </>
                    )}

                    {/* Typing indicator */}
                    {isLoading && (
                      <div className="msg-ai">
                        <div className="ai-avatar">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="8" r="4" stroke="#00E5A0" strokeWidth="1.5"/>
                            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#00E5A0" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <div className="ai-bubble">
                          <div className="typing">
                            <span /><span /><span />
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={chatBottomRef} />
                  </div>

                  {/* Strict Input Sequence area */}
                  <div className="int-input-area">
                    {!answers[currentQ?.id] ? (
                      <>
                        {intPhase === "ai-speaking" && (
                          <div className="seq-card">
                            <div className="seq-title">AI is speaking...</div>
                            <div className="seq-sub">Please listen to the question. The mic will open soon.</div>
                            <div style={{ marginTop: 14 }}>
                              <button className="btn-skip" onClick={() => handleStopAndSubmit(true)}>Skip Question →</button>
                            </div>
                          </div>
                        )}

                        {intPhase === "thinking" && (
                          <div className="seq-card">
                            <div className="seq-title">Thinking Time</div>
                            <div className="timer-display">00:{timeLeft.toString().padStart(2, '0')}</div>
                            <div className="seq-sub">Prepare your answer. Recording begins automatically at 00:00.</div>
                            <div className="int-actions" style={{ justifyContent: "center", marginTop: 16 }}>
                              <button className="btn-skip" onClick={() => handleStopAndSubmit(true)}>Skip →</button>
                              <button className="btn-submit" onClick={startRecording}>Skip Time & Record Now</button>
                            </div>
                          </div>
                        )}

                        {intPhase === "recording" && (
                          <div className="seq-card">
                            <div className="recording-banner">
                              <span className="rec-dot"></span> LIVE REC — Speak your answer...
                            </div>
                            <div className="int-actions" style={{ justifyContent: "center", marginTop: 16, width: "100%" }}>
                              <button className="btn-skip" onClick={() => handleStopAndSubmit(true)}>Skip →</button>
                              <button className="btn-finish" style={{ flex: "none", width: "200px" }} onClick={() => handleStopAndSubmit(false)}>Submit Answer</button>
                            </div>
                          </div>
                        )}

                        {intPhase === "submitting" && (
                          <div className="seq-card">
                            <div className="typing"><span /><span /><span /></div>
                            <div className="seq-title" style={{ marginTop: 16 }}>Transcribing & Evaluating via Grok...</div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="int-actions">
                        {currentQIndex < totalQ - 1 ? (
                          <button className="btn-next" style={{ flex: 1 }} onClick={nextQuestion}>
                            Next Question →
                          </button>
                        ) : (
                          <button className="btn-finish" disabled={!canFinish} onClick={finishInterview}>
                            Finish & See Evaluation →
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* PHASE 4 — EVALUATION                                           */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {phase === PHASE.EVALUATION && (
            <>
              <div className="phase-header">
                <h1 className="phase-title">Interview Complete</h1>
                <p className="phase-sub">Here's your detailed performance evaluation</p>
              </div>

              {evaluating ? (
                <div className="eval-loader">
                  <div className="eval-spin" />
                  <div style={{ fontSize: 16, fontWeight: 600 }}>Evaluating your performance...</div>
                  <div style={{ fontSize: 13, color: "#7A8499" }}>AI is analyzing all your answers</div>
                </div>
              ) : evaluation && (
                <>
                  {/* Hero score card */}
                  <div className="eval-hero">
                    <div style={{ fontSize: 13, color: "#7A8499", marginBottom: 8 }}>Overall Score</div>
                    <div className="score-big" style={{ color: scoreColor(evaluation.overallScore) }}>
                      {evaluation.overallScore}
                    </div>
                    <div className="grade-badge" style={{
                      background: gradeColor(evaluation.grade) + "20",
                      color: gradeColor(evaluation.grade),
                      border: `1px solid ${gradeColor(evaluation.grade)}40`
                    }}>
                      {evaluation.grade}
                    </div>
                    <div style={{ fontSize: 14, color: "#C4CAD4", lineHeight: 1.6, maxWidth: 600, margin: "12px auto 0" }}>
                      {evaluation.summary}
                    </div>
                    <div className="rec-badge" style={{
                      margin: "12px auto 0",
                      background: evaluation.hiringRecommendation?.includes("Strong") ? "#00E5A015" : evaluation.hiringRecommendation?.includes("Consider") ? "#F59E0B15" : "#F8717115",
                      border: `1px solid ${evaluation.hiringRecommendation?.includes("Strong") ? "#00E5A040" : evaluation.hiringRecommendation?.includes("Consider") ? "#F59E0B40" : "#F8717140"}`,
                      color: evaluation.hiringRecommendation?.includes("Strong") ? "#00E5A0" : evaluation.hiringRecommendation?.includes("Consider") ? "#F59E0B" : "#F87171",
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="1.5"/></svg>
                      {evaluation.hiringRecommendation}
                    </div>
                  </div>

                  <div className="eval-grid">
                    {/* Strengths */}
                    <div className="eval-card">
                      <div className="r-label" style={{ marginBottom: 14 }}>💪 Strengths</div>
                      {evaluation.strengths?.map((s, i) => (
                        <div key={i} className="list-item">
                          <div className="list-dot" style={{ background: "#00E5A0" }} />
                          {s}
                        </div>
                      ))}
                    </div>

                    {/* Areas to improve */}
                    <div className="eval-card">
                      <div className="r-label" style={{ marginBottom: 14 }}>🎯 Areas to Improve</div>
                      {evaluation.improvements?.map((s, i) => (
                        <div key={i} className="list-item">
                          <div className="list-dot" style={{ background: "#F59E0B" }} />
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Per-question scores */}
                  <div className="eval-card" style={{ marginTop: 16 }}>
                    <div className="r-label" style={{ marginBottom: 14 }}>Per-Question Breakdown</div>
                    {questions.map((q, i) => {
                      const qs = evaluation.questionScores?.find((x) => x.questionId === q.id) || {};
                      const isSkipped = answers[q.id]?.skipped || !answers[q.id];
                      const score = qs.score;
                      return (
                        <div key={q.id} className="q-score-row">
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
                              <span style={{ fontSize: 10, color: "#7A8499", fontFamily: "'JetBrains Mono', monospace" }}>Q{i + 1}</span>
                              {isSkipped && <span style={{ fontSize: 10, color: "#F87171", background: "#F8717115", padding: "1px 6px", borderRadius: 4 }}>Skipped</span>}
                            </div>
                            <div className="q-score-text">{q.question}</div>
                            {qs.feedback && !isSkipped && (
                              <div className="q-feedback">{qs.feedback}</div>
                            )}
                          </div>
                          <div className="q-score-num" style={{ color: isSkipped ? "#F87171" : scoreColor(score || 0) }}>
                            {isSkipped ? "—" : (score !== undefined ? score : "—")}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="eval-actions">
                    <button className="btn-retry" onClick={() => {
                      setPhase(PHASE.UPLOAD);
                      setAnswers({});
                      setCurrentQIndex(0);
                      setQuestions([]);
                      setSkills([]);
                      setEvaluation(null);
                      setFileName("");
                    }}>
                      New Interview
                    </button>
                    <button className="btn-next" onClick={() => navigate("/dashboard")}>
                      Back to Dashboard
                    </button>
                  </div>
                </>
              )}
            </>
          )}

        </div>
      </div>
    </>
  );
}

export default AIPracticePage;
