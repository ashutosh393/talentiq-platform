import React, { useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";

function ResumePage() {
  const navigate = useNavigate();
  const [uploaded, setUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleUploadClick = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setUploaded(true);
    }, 1500);
  };

  const handleStartInterview = () => {
    navigate('/practice');
  };

  return (
    <>
      <style>{`
        .resume-root { min-height: 100vh; background: #0A0C0F; color: #EEF2FF; font-family: 'DM Sans', sans-serif; padding-bottom: 80px; }
        .resume-container { max-width: 1000px; margin: 0 auto; padding: 24px; }
        .res-grid { display: grid; grid-template-columns: 320px 1fr; gap: 24px; align-items: start; }
        .r-card { background: #0D1117; border: 1px solid #ffffff12; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
        .r-card-label { font-size: 11px; color: #7A8499; text-transform: uppercase; letter-spacing: .05em; font-weight: 500; margin-bottom: 16px; }
        
        .upload-zone { border: 1px dashed #ffffff20; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 16px; cursor: pointer; transition: 0.2s; }
        .upload-zone:hover { border-color: #00E5A050; background: #00E5A005; }
        .upload-icon { margin: 0 auto 8px; display: block; }
        .upload-text { font-size: 11px; color: #7A8499; margin-bottom: 12px; }
        
        .badge-uploaded { background: #00E5A015; border: 1px solid #00E5A030; border-radius: 6px; padding: 8px 10px; font-size: 10px; color: #00E5A0; font-weight: 500; display: flex; align-items: center; justify-content: center; }
        
        .score-box { text-align: center; }
        .score-circle { display: block; margin: 0 auto; }
        .score-text { font-size: 12px; color: #7A8499; margin-top: 8px; }
        
        .q-item { background: #111520; border: 1px solid #ffffff08; border-radius: 8px; padding: 12px 14px; display: flex; gap: 10px; margin-bottom: 8px; align-items: flex-start; }
        .q-badge { font-size: 10px; color: #00E5A0; font-family: 'JetBrains Mono', monospace; font-weight: 600; min-width: 20px; }
        .q-text { font-size: 13px; color: #EEF2FF; line-height: 1.5; font-weight: 300; }
        
        .sugg-item { display: flex; gap: 10px; align-items: flex-start; margin-bottom: 10px; }
        .sugg-dot { width: 6px; height: 6px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
        .sugg-text { font-size: 13px; color: #7A8499; line-height: 1.5; font-weight: 300; }
        
        .btn-green { width: 100%; padding: 12px; background: #00E5A0; color: #000; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: 0.2s; font-family: 'DM Sans', sans-serif; }
        .btn-green:hover { background: #00FFB3; transform: translateY(-1px); }
        .btn-ghost-sm { padding: 6px 12px; background: transparent; color: #EEF2FF; border: 1px solid #ffffff20; border-radius: 6px; font-size: 11px; cursor: pointer; transition: 0.2s; }
        .btn-ghost-sm:hover { background: #161C28; border-color: #ffffff40; }
        
        @media(max-width:768px){
          .res-grid { grid-template-columns: 1fr; }
        }
      `}</style>
      
      <div className="resume-root">
        <Navbar />
        
        <div className="resume-container">
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontFamily: 'Syne', fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>Resume AI</h1>
            <p style={{ color: '#7A8499', fontSize: '14px' }}>Upload your resume to get mock interview questions tailored to your experience</p>
          </div>

          <div className="res-grid">
            {/* Left */}
            <div>
              <div className="r-card" style={{ borderColor: uploaded ? '#00E5A040' : '#ffffff12' }}>
                <div className="r-card-label" style={{ marginBottom: '12px', color: '#EEF2FF' }}>Upload resume</div>
                
                {!uploaded && !analyzing && (
                  <div className="upload-zone" onClick={handleUploadClick}>
                    <svg className="upload-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 3v10M8 7l4-4 4 4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="#7A8499" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div className="upload-text">Drop PDF here or click to browse</div>
                    <button className="btn-ghost-sm">Browse Files</button>
                  </div>
                )}
                
                {analyzing && (
                  <div className="upload-zone" style={{ borderStyle: 'solid' }}>
                    <div style={{ fontSize: '12px', color: '#00E5A0' }}>Analyzing...</div>
                  </div>
                )}
                
                {uploaded && (
                  <div className="badge-uploaded">
                    resume_ashutosh.pdf · Uploaded ✓
                  </div>
                )}
              </div>
              
              {uploaded && (
                <div className="r-card score-box">
                  <div className="r-card-label">Resume score</div>
                  <svg className="score-circle" width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#161C28" strokeWidth="8"/>
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#00E5A0" strokeWidth="8" strokeDasharray="251" strokeDashoffset="62" strokeLinecap="round" transform="rotate(-90 50 50)"/>
                    <text x="50" y="58" textAnchor="middle" fill="#00E5A0" fontSize="26" fontFamily="'JetBrains Mono', monospace" fontWeight="600">75</text>
                  </svg>
                  <div className="score-text">Good · room to improve</div>
                </div>
              )}
              
              <button 
                className="btn-green" 
                onClick={handleStartInterview}
                style={{ opacity: uploaded ? 1 : 0.5, pointerEvents: uploaded ? 'auto' : 'none' }}
              >
                Start interview session →
              </button>
            </div>
            
            {/* Right */}
            {uploaded ? (
              <div>
                <div className="r-card">
                  <div className="r-card-label">AI-generated questions</div>
                  <div>
                    <div className="q-item">
                      <span className="q-badge">Q1</span>
                      <span className="q-text">You built TalentIQ — how did you handle WebRTC vs Stream SDK decision?</span>
                    </div>
                    <div className="q-item">
                      <span className="q-badge">Q2</span>
                      <span className="q-text">Walk me through the React + Node architecture in GreenCart.</span>
                    </div>
                    <div className="q-item">
                      <span className="q-badge">Q3</span>
                      <span className="q-text">How did you handle non-deterministic LLM outputs in your AI workflow project?</span>
                    </div>
                  </div>
                </div>
                
                <div className="r-card">
                  <div className="r-card-label">Enhancement suggestions</div>
                  <div>
                    <div className="sugg-item">
                      <div className="sugg-dot" style={{ background: '#F59E0B' }}></div>
                      <div className="sugg-text">Add "reduced load time by 40%" — quantify your impact</div>
                    </div>
                    <div className="sugg-item">
                      <div className="sugg-dot" style={{ background: '#00E5A0' }}></div>
                      <div className="sugg-text">Add keywords: CI/CD, microservices, distributed systems</div>
                    </div>
                    <div className="sugg-item">
                      <div className="sugg-dot" style={{ background: '#8B7CF6' }}></div>
                      <div className="sugg-text">Move GitHub and live demo links to the top of resume</div>
                    </div>
                    <div className="sugg-item">
                      <div className="sugg-dot" style={{ background: '#F87171' }}></div>
                      <div className="sugg-text">Add TypeScript, Docker to skills if you have experience</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', border: '1px dashed #ffffff12', borderRadius: '12px', minHeight: '300px' }}>
                <div style={{ textAlign: 'center', color: '#7A8499', fontSize: '13px' }}>Upload your resume to see your personalized analysis here.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ResumePage;
