import React, { useState } from "react";
import Navbar from "../components/Navbar";

function AIPracticePage() {
  const [messages, setMessages] = useState([
    { role: 'system', text: "Let's dive into your experience with React. In your project 'TalentIQ', you mentioned using WebRTC for real-time collaboration. Can you explain how you handled connection drops?" },
    { role: 'user', text: "Yes, we implemented a reconnection strategy using ICE restarts and buffered the Delta updates so they could be replayed once the connection was re-established." }
  ]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  
  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: inputText }]);
    setInputText("");
    
    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'system', text: "That's a solid approach. How did you ensure the ordering of those buffered Delta updates?" }]);
    }, 1500);
  };
  
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // In a real app, stop MediaRecorder and process audio
    } else {
      setIsRecording(true);
      // In a real app, request microphone permissions and start MediaRecorder
    }
  };

  return (
    <>
      <style>{`
        .ai-root { min-height: 100vh; background: #0A0C0F; color: #EEF2FF; font-family: 'DM Sans', sans-serif; padding-bottom: 40px; display: flex; flex-direction: column; }
        .ai-container { max-width: 800px; margin: 0 auto; width: 100%; padding: 24px; flex: 1; display: flex; flex-direction: column; }
        .ai-card { flex: 1; background: #0D1117; border: 1px solid #ffffff12; border-radius: 12px; display: flex; flex-direction: column; overflow: hidden; min-height: 400px; margin-top: 16px; }
        
        .chat-area { flex: 1; padding: 24px; display: flex; flex-direction: column; gap: 20px; overflow-y: auto; }
        
        .msg-sys { display: flex; gap: 12px; align-items: flex-start; }
        .msg-sys-avatar { width: 32px; height: 32px; border-radius: 8px; background: #00E5A015; border: 1px solid #00E5A040; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .msg-sys-bubble { background: #161C28; border: 1px solid #ffffff08; border-radius: 8px; border-top-left-radius: 2px; padding: 12px 16px; font-size: 14px; color: #EEF2FF; line-height: 1.5; font-weight: 300; max-width: 85%; }
        
        .msg-usr { display: flex; gap: 12px; align-items: flex-start; justify-content: flex-end; }
        .msg-usr-avatar { width: 32px; height: 32px; border-radius: 8px; background: #8B7CF615; border: 1px solid #8B7CF640; display: flex; align-items: center; justify-content: center; flex-shrink: 0; order: 2; font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700; color: #8B7CF6; }
        .msg-usr-bubble { background: #8B7CF620; border: 1px solid #8B7CF640; border-radius: 8px; border-top-right-radius: 2px; padding: 12px 16px; font-size: 14px; color: #EEF2FF; line-height: 1.5; font-weight: 300; max-width: 85%; order: 1; }
        
        .input-area { padding: 16px; border-top: 1px solid #ffffff12; background: #111520; display: flex; gap: 10px; align-items: center; }
        .chat-input { flex: 1; background: #161C28; border: 1px solid #ffffff20; border-radius: 8px; padding: 12px 16px; font-size: 14px; color: #EEF2FF; outline: none; }
        .chat-input:focus { border-color: #8B7CF6; }
        
        .btn-mic { width: 44px; height: 44px; border-radius: 8px; background: #161C28; border: 1px solid #ffffff20; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
        .btn-mic:hover { background: #ffffff10; }
        .btn-mic.recording { background: #F8717120; border-color: #F8717150; animation: pulse 1.5s infinite; }
        
        .btn-send { width: 44px; height: 44px; border-radius: 8px; background: #8B7CF6; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
        .btn-send:hover { background: #9D8FF7; }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(248, 113, 113, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(248, 113, 113, 0); }
          100% { box-shadow: 0 0 0 0 rgba(248, 113, 113, 0); }
        }
      `}</style>
      
      <div className="ai-root">
        <Navbar />
        
        <div className="ai-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontFamily: 'Syne', fontSize: '32px', fontWeight: 800, marginBottom: '4px' }}>AI Mock Interview</h1>
              <p style={{ color: '#7A8499', fontSize: '14px' }}>Voice-enabled interviewer tailored to your resume</p>
            </div>
            <div style={{ padding: '6px 12px', background: '#F59E0B15', border: '1px solid #F59E0B40', borderRadius: '6px', fontSize: '11px', color: '#F59E0B', fontWeight: 500 }}>
              Session: React Architecture
            </div>
          </div>
          
          <div className="ai-card">
            <div className="chat-area">
              {messages.map((m, i) => (
                m.role === 'system' ? (
                  <div key={i} className="msg-sys">
                    <div className="msg-sys-avatar">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="msg-sys-bubble">{m.text}</div>
                  </div>
                ) : (
                  <div key={i} className="msg-usr">
                    <div className="msg-usr-avatar">AT</div>
                    <div className="msg-usr-bubble">{m.text}</div>
                  </div>
                )
              ))}
            </div>
            
            <div className="input-area">
              <button className={`btn-mic ${isRecording ? 'recording' : ''}`} onClick={toggleRecording}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2A3 3 0 009 5v7a3 3 0 006 0V5a3 3 0 00-3-3zM19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" stroke={isRecording ? "#F87171" : "#7A8499"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <input 
                type="text" 
                className="chat-input" 
                placeholder="Type your answer, or hold mic to speak..." 
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              
              <button className="btn-send" onClick={handleSend}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AIPracticePage;
