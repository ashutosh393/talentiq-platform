import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import axios from "../lib/axios";

function ResumePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [phase, setPhase] = useState("idle"); // idle | uploading | done
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [uploadError, setUploadError] = useState("");

  // Results from backend
  const [resumeScore, setResumeScore] = useState(0);
  const [skills, setSkills] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [suggestions, setSuggestions] = useState([
    { color: "#F59E0B", text: 'Add quantified impact — e.g. "reduced load time by 40%"' },
    { color: "#00E5A0", text: "Add keywords: CI/CD, microservices, distributed systems" },
    { color: "#8B7CF6", text: "Move GitHub and live demo links to the top of resume" },
    { color: "#F87171", text: "Add TypeScript, Docker to skills if you have experience" },
  ]);

  const scoreColor = (s) => s >= 80 ? "#00E5A0" : s >= 60 ? "#F59E0B" : "#F87171";

  // ── File upload ───────────────────────────────────────────────────────────────
  const handleFile = async (file) => {
    if (!file || file.type !== "application/pdf") {
      setUploadError("Please upload a valid PDF file.");
      return;
    }
    setUploadError("");
    setFileName(file.name);
    setPhase("uploading");

    try {
      const formData = new FormData();
      formData.append("resume", file);
      const res = await axios.post(`/interview/parse-resume`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResumeScore(res.data.resumeScore);
      setSkills(res.data.skills);
      setQuestions(res.data.questions);
      setPhase("done");
    } catch (err) {
      setUploadError(err.response?.data?.message || "Failed to analyze resume. Please try again.");
      setPhase("idle");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleStartInterview = () => {
    // Navigate to practice page — AIPracticePage will handle its own upload state
    // We pass a flag in state hinting user has already analyzed via ResumePage
    navigate("/practice");
  };

  return (
    <>
      <style>{`
        .resume-root { min-height: 100vh; background: #0A0C0F; color: #EEF2FF; font-family: 'DM Sans', sans-serif; padding-bottom: 80px; }
        .resume-container { max-width: 1000px; margin: 0 auto; padding: 24px; }
        .res-grid { display: grid; grid-template-columns: 300px 1fr; gap: 20px; align-items: start; }
        .r-card { background: #0D1117; border: 1px solid #ffffff12; border-radius: 12px; padding: 22px; margin-bottom: 16px; }
        .r-label { font-size: 10px; color: #7A8499; text-transform: uppercase; letter-spacing: .07em; font-weight: 600; margin-bottom: 14px; }
        
        .drop-zone { border: 2px dashed #ffffff18; border-radius: 10px; padding: 28px 20px; text-align: center; cursor: pointer; transition: all 0.2s; }
        .drop-zone:hover, .drop-zone.drag { border-color: #8B7CF660; background: #8B7CF608; }
        .drop-zone.drag { border-color: #8B7CF6; }
        .drop-icon { width: 44px; height: 44px; background: #8B7CF615; border: 1px solid #8B7CF640; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; }
        .upload-text { font-size: 12px; color: #7A8499; margin-bottom: 12px; }
        .btn-browse { padding: 8px 18px; background: #8B7CF620; border: 1px solid #8B7CF640; border-radius: 7px; color: #8B7CF6; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: 0.2s; }
        .btn-browse:hover { background: #8B7CF630; }

        .analyzing-state { text-align: center; padding: 20px 0; }
        .spin { width: 36px; height: 36px; border: 3px solid #ffffff10; border-top-color: #8B7CF6; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 10px; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .badge-done { display: flex; align-items: center; gap: 8px; background: #00E5A015; border: 1px solid #00E5A030; border-radius: 8px; padding: 10px 14px; font-size: 12px; color: #00E5A0; font-weight: 500; }
        .btn-reupload { background: none; border: none; color: #7A8499; font-size: 11px; cursor: pointer; text-decoration: underline; margin-top: 8px; font-family: 'DM Sans', sans-serif; }
        .btn-reupload:hover { color: #EEF2FF; }

        .score-box { text-align: center; padding: 8px 0; }

        .skill-chips { display: flex; flex-wrap: wrap; gap: 6px; }
        .skill-chip { font-size: 11px; padding: 4px 10px; border-radius: 20px; background: #8B7CF615; border: 1px solid #8B7CF640; color: #8B7CF6; font-weight: 500; }

        .q-item { display: flex; gap: 10px; padding: 10px 12px; background: #111520; border: 1px solid #ffffff08; border-radius: 8px; margin-bottom: 8px; }
        .q-badge { font-size: 10px; color: #00E5A0; font-family: 'JetBrains Mono', monospace; font-weight: 700; min-width: 20px; margin-top: 1px; }
        .q-text { font-size: 13px; color: #C4CAD4; line-height: 1.5; }
        .q-tag { font-size: 10px; padding: 2px 7px; border-radius: 4px; font-weight: 600; display: inline-block; margin-top: 5px; margin-right: 4px; }

        .sugg-item { display: flex; gap: 10px; align-items: flex-start; margin-bottom: 12px; }
        .sugg-dot { width: 6px; height: 6px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
        .sugg-text { font-size: 13px; color: #7A8499; line-height: 1.5; }

        .btn-green { width: 100%; padding: 13px; background: linear-gradient(135deg, #8B7CF6, #00E5A0); border: none; border-radius: 9px; color: #fff; font-size: 14px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: 0.2s; }
        .btn-green:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .btn-green:disabled { opacity: 0.4; cursor: not-allowed; }

        .empty-right { display: flex; align-items: center; justify-content: center; min-height: 300px; border: 1px dashed #ffffff12; border-radius: 12px; }

        .err-msg { background: #F8717115; border: 1px solid #F8717140; border-radius: 8px; padding: 10px 14px; font-size: 12px; color: #F87171; margin-top: 12px; }

        @media(max-width:768px){ .res-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="resume-root">
        <Navbar />

        <div className="resume-container">
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontFamily: "Syne", fontSize: 30, fontWeight: 800, marginBottom: 6 }}>Resume AI</h1>
            <p style={{ color: "#7A8499", fontSize: 14 }}>
              Upload your resume — we'll extract your skills and generate a tailored mock interview
            </p>
          </div>

          <div className="res-grid">
            {/* ── Left ── */}
            <div>
              <div className="r-card" style={{ borderColor: phase === "done" ? "#00E5A040" : "#ffffff12" }}>
                <div className="r-label" style={{ color: "#EEF2FF" }}>Upload Resume</div>

                {phase === "idle" && (
                  <>
                    <div
                      className={`drop-zone${isDragging ? " drag" : ""}`}
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                    >
                      <div className="drop-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#8B7CF6" strokeWidth="1.5" strokeLinecap="round"/>
                          <line x1="12" y1="13" x2="12" y2="19" stroke="#8B7CF6" strokeWidth="1.5" strokeLinecap="round"/>
                          <polyline points="9 16 12 13 15 16" stroke="#8B7CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="upload-text">Drop PDF here or click to browse</div>
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
                  </>
                )}

                {phase === "uploading" && (
                  <div className="analyzing-state">
                    <div className="spin" />
                    <div style={{ fontSize: 13, color: "#8B7CF6", fontWeight: 500 }}>Analyzing with AI...</div>
                    <div style={{ fontSize: 11, color: "#3A4255", marginTop: 4 }}>Extracting skills & generating questions</div>
                  </div>
                )}

                {phase === "done" && (
                  <>
                    <div className="badge-done">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#00E5A0" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      {fileName} · Uploaded ✓
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <button className="btn-reupload" onClick={() => { setPhase("idle"); setFileName(""); setSkills([]); setQuestions([]); }}>
                        Upload a different resume
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Score */}
              {phase === "done" && (
                <div className="r-card score-box">
                  <div className="r-label">Resume Score</div>
                  <svg width="110" height="110" viewBox="0 0 110 110" style={{ display: "block", margin: "0 auto 8px" }}>
                    <circle cx="55" cy="55" r="46" fill="none" stroke="#161C28" strokeWidth="9"/>
                    <circle cx="55" cy="55" r="46" fill="none"
                      stroke={scoreColor(resumeScore)}
                      strokeWidth="9"
                      strokeDasharray="289"
                      strokeDashoffset={289 - (289 * resumeScore / 100)}
                      strokeLinecap="round"
                      transform="rotate(-90 55 55)"
                    />
                    <text x="55" y="63" textAnchor="middle" fill={scoreColor(resumeScore)} fontSize="26" fontFamily="'JetBrains Mono', monospace" fontWeight="700">{resumeScore}</text>
                  </svg>
                  <div style={{ fontSize: 12, color: "#7A8499", textAlign: "center" }}>
                    {resumeScore >= 80 ? "Excellent resume!" : resumeScore >= 60 ? "Good · room to improve" : "Needs improvement"}
                  </div>
                </div>
              )}

              {/* Extracted skills */}
              {phase === "done" && skills.length > 0 && (
                <div className="r-card">
                  <div className="r-label">Extracted Skills</div>
                  <div className="skill-chips">
                    {skills.map((s, i) => <span key={i} className="skill-chip">{s}</span>)}
                  </div>
                </div>
              )}

              <button
                className="btn-green"
                onClick={handleStartInterview}
                disabled={phase !== "done"}
              >
                Start Interview Session →
              </button>
              {phase !== "done" && (
                <div style={{ textAlign: "center", fontSize: 11, color: "#3A4255", marginTop: 8 }}>
                  Upload your resume first to unlock
                </div>
              )}
            </div>

            {/* ── Right ── */}
            {phase === "done" ? (
              <div>
                {/* AI-generated questions */}
                <div className="r-card">
                  <div className="r-label">AI-Generated Questions ({questions.length})</div>
                  {questions.map((q, i) => (
                    <div key={q.id} className="q-item">
                      <span className="q-badge">Q{i + 1}</span>
                      <div>
                        <div className="q-text">{q.question}</div>
                        <span className="q-tag" style={{
                          background: q.category === "Technical" ? "#8B7CF615" : q.category === "Behavioral" ? "#F59E0B15" : "#00E5A015",
                          color: q.category === "Technical" ? "#8B7CF6" : q.category === "Behavioral" ? "#F59E0B" : "#00E5A0"
                        }}>{q.category}</span>
                        <span className="q-tag" style={{
                          background: q.difficulty === "Easy" ? "#00E5A015" : q.difficulty === "Medium" ? "#F59E0B15" : "#F8717115",
                          color: q.difficulty === "Easy" ? "#00E5A0" : q.difficulty === "Medium" ? "#F59E0B" : "#F87171"
                        }}>{q.difficulty}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Enhancement suggestions */}
                <div className="r-card">
                  <div className="r-label">Enhancement Suggestions</div>
                  {suggestions.map((s, i) => (
                    <div key={i} className="sugg-item">
                      <div className="sugg-dot" style={{ background: s.color }} />
                      <div className="sugg-text">{s.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="empty-right">
                <div style={{ textAlign: "center", color: "#7A8499", fontSize: 13 }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ margin: "0 auto 10px", display: "block" }}>
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#3A4255" strokeWidth="1.5" strokeLinecap="round"/>
                    <polyline points="14 2 14 8 20 8" stroke="#3A4255" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Upload your resume to see your personalized analysis here
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ResumePage;
