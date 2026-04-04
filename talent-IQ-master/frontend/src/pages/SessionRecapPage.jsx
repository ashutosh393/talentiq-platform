import { useParams, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import { formatSessionStats, getDifficultyColor } from "../lib/utils";
import { useSessionById } from "../hooks/useSessions";

function SessionRecapPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  // We'll mock the session if useSessionById isn't fully ready with recap data yet.
  const { data, isLoading } = useSessionById(id);
  
  const mockSession = {
    problem: "Two Sum",
    difficulty: "Easy",
    mentorName: "Priya S.",
    duration: "26 minutes",
    runtime: "48",
    beats: "94",
    complexity: "O(n)",
    xp: "15"
  };

  const session = data?.session || mockSession;
  const stats = formatSessionStats(session);
  const diffCol = getDifficultyColor(session.difficulty || 'Easy');

  if (isLoading) {
    return <div className="min-h-screen bg-[#0A0C0F] text-[#EEF2FF] flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <style>{`
        .recap-root { min-height: 100vh; background: #0A0C0F; color: #EEF2FF; font-family: 'DM Sans', sans-serif; padding-bottom: 80px; }
        .recap-container { max-width: 800px; margin: 0 auto; padding: 40px 24px; }
        .rc-label { font-size: 9px; color: var(--green, #00E5A0); font-family: 'JetBrains Mono', monospace; font-weight: 500; letter-spacing: .06em; margin-bottom: 4px; text-transform: uppercase; }
        .rc-title { font-size: 24px; font-weight: 700; color: #EEF2FF; margin-bottom: 8px; font-family: 'Syne', sans-serif; }
        .rc-sub { font-size: 13px; color: #7A8499; margin-bottom: 32px; }
        .rc-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
        .rc-card { background: #0D1117; border: 1px solid #ffffff12; border-radius: 8px; padding: 16px; text-align: center; }
        .rc-card-val { font-size: 24px; font-weight: 500; font-family: 'JetBrains Mono', monospace; margin-bottom: 4px; }
        .rc-card-label { font-size: 10px; color: #7A8499; text-transform: uppercase; letter-spacing: .05em; font-weight: 500; }
        
        .rc-main-grid { display: grid; grid-template-columns: 1fr 0.6fr; gap: 16px; align-items: start; }
        .rc-panel { background: #0D1117; border: 1px solid #ffffff12; border-radius: 8px; padding: 20px; }
        .rc-panel-title { font-size: 11px; color: #7A8499; text-transform: uppercase; letter-spacing: .05em; font-weight: 500; margin-bottom: 16px; }
        
        .ai-review-item { display: flex; gap: 10px; align-items: flex-start; margin-bottom: 12px; }
        .ai-review-dot { width: 6px; height: 6px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
        .ai-review-text { font-size: 13px; color: #EEF2FF; line-height: 1.5; font-weight: 300; }
        
        .btn-green-full { width: 100%; padding: 10px 16px; background: #00E5A0; color: #000; border: none; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; text-align: left; display: flex; justify-content: space-between; transition: 0.2s; margin-bottom: 8px; font-family: 'DM Sans', sans-serif; }
        .btn-green-full:hover { background: #00FFB3; }
        .btn-ghost-full { width: 100%; padding: 10px 16px; background: transparent; color: #EEF2FF; border: 1px solid #ffffff12; border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer; text-align: left; transition: 0.2s; margin-bottom: 8px; font-family: 'DM Sans', sans-serif; }
        .btn-ghost-full:hover { background: #161C28; border-color: #ffffff20; }
      `}</style>
      
      <div className="recap-root">
        <Navbar />
        <div className="recap-container">
          <div style={{ textAlign: 'center' }}>
            <div className="rc-label">SESSION COMPLETE</div>
            <div className="rc-title">{session.problem} · <span style={{ color: diffCol.text }}>{session.difficulty}</span></div>
            <div className="rc-sub">With {mockSession.mentorName} · {mockSession.duration}</div>
          </div>
          
          <div className="rc-stats-grid">
            <div className="rc-card">
              <div className="rc-card-val" style={{ color: '#00E5A0' }}>{stats.runtime}</div>
              <div className="rc-card-label">Runtime</div>
            </div>
            <div className="rc-card">
              <div className="rc-card-val" style={{ color: '#8B7CF6' }}>{stats.beats}</div>
              <div className="rc-card-label">Beats</div>
            </div>
            <div className="rc-card">
              <div className="rc-card-val" style={{ color: '#F59E0B' }}>{stats.complexity}</div>
              <div className="rc-card-label">Complexity</div>
            </div>
            <div className="rc-card">
              <div className="rc-card-val" style={{ color: '#22C55E' }}>{stats.xp}</div>
              <div className="rc-card-label">XP</div>
            </div>
          </div>
          
          <div className="rc-main-grid">
            <div className="rc-panel">
              <div className="rc-panel-title">AI Code Review</div>
              <div>
                <div className="ai-review-item">
                  <div className="ai-review-dot" style={{ background: '#00E5A0' }}></div>
                  <div className="ai-review-text">Great O(n) hashmap approach. Clean code.</div>
                </div>
                <div className="ai-review-item">
                  <div className="ai-review-dot" style={{ background: '#F59E0B' }}></div>
                  <div className="ai-review-text">Consider edge case: empty array input.</div>
                </div>
                <div className="ai-review-item">
                  <div className="ai-review-dot" style={{ background: '#8B7CF6' }}></div>
                  <div className="ai-review-text">Rename "seen" to "complement_map" for clarity.</div>
                </div>
              </div>
            </div>
            
            <div className="rc-panel" style={{ background: 'transparent', border: 'none', padding: 0 }}>
              <div className="rc-panel-title" style={{ paddingLeft: '4px' }}>Next Steps</div>
              <button className="btn-green-full" onClick={() => navigate('/problems')}>
                Try 3Sum next <span>→</span>
              </button>
              <button className="btn-ghost-full" onClick={() => navigate(`/problem/${id || ''}`)}>
                Practice again
              </button>
              <button className="btn-ghost-full">
                Share result
              </button>
              <button className="btn-ghost-full" onClick={() => navigate('/dashboard')}>
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SessionRecapPage;
