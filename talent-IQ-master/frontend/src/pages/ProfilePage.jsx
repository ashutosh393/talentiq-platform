import React from "react";
import Navbar from "../components/Navbar";
import { generateActivityHeatmap, ACHIEVEMENTS } from "../lib/utils";

function ProfilePage() {
  // We'll mock the user profile since the real endpoint isn't fully integrated yet
  const userProfile = {
    name: "Ashutosh Tiwari",
    initials: "AT",
    education: "MCA · HBTU Kanpur",
    skills: ["MERN", "AI/ML"],
    stats: {
      sessions: 5,
      solved: 12,
      rank: "#142"
    },
    achievements: Object.values(ACHIEVEMENTS), 
    problems: {
      easy: { solved: 8, total: 20 },
      medium: { solved: 3, total: 20 },
      hard: { solved: 1, total: 10 }
    }
  };

  const heatmap = generateActivityHeatmap();
  const colors = ['#1C2430','#00E5A015','#00E5A030','#00E5A060','#00E5A0'];

  return (
    <>
      <style>{`
        .profile-root { min-height: 100vh; background: #0A0C0F; color: #EEF2FF; font-family: 'DM Sans', sans-serif; padding-bottom: 80px; }
        .profile-container { max-width: 1000px; margin: 0 auto; padding: 24px; }
        .prof-grid { display: grid; grid-template-columns: 320px 1fr; gap: 24px; align-items: start; }
        .p-card { background: #0D1117; border: 1px solid #ffffff12; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
        .p-card-label { font-size: 11px; color: #7A8499; text-transform: uppercase; letter-spacing: .05em; font-weight: 500; margin-bottom: 16px; }
        
        .p-avatar { width: 64px; height: 64px; border-radius: 50%; background: #00E5A015; border: 2px solid #00E5A040; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; color: #00E5A0; font-family: 'Syne', sans-serif; margin: 0 auto 12px; }
        .p-name { font-size: 18px; font-weight: 600; text-align: center; margin-bottom: 4px; }
        .p-edu { font-size: 12px; color: #7A8499; text-align: center; margin-bottom: 12px; }
        .p-skills { display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; }
        .p-tag { font-size: 10px; padding: 3px 8px; border-radius: 4px; font-weight: 500; }
        
        .ach-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .ach-box { border-radius: 6px; padding: 10px; text-align: center; background: #ffffff05; border: 1px solid #ffffff10; }
        .ach-icon { font-size: 20px; margin-bottom: 4px; }
        .ach-label { font-size: 10px; font-weight: 500; }
        
        .stats-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 24px; }
        .s-card { background: #0D1117; border: 1px solid #ffffff12; border-radius: 12px; padding: 20px; text-align: center; }
        .s-val { font-size: 24px; font-weight: 600; font-family: 'JetBrains Mono', monospace; margin-bottom: 4px; }
        
        .hm-grid { display: flex; gap: 4px; flex-wrap: wrap; }
        .hm-cell { width: 14px; height: 14px; border-radius: 3px; }
        
        .prog-item { margin-bottom: 16px; }
        .prog-item:last-child { margin-bottom: 0; }
        .prog-top { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 11px; font-weight: 500; }
        .prog-bar-bg { height: 6px; background: #161C28; border-radius: 3px; overflow: hidden; }
        .prog-bar-fill { height: 100%; border-radius: 3px; }
        
        @media(max-width:768px){
          .prof-grid { grid-template-columns: 1fr; }
        }
      `}</style>
      
      <div className="profile-root">
        <Navbar />
        
        <div className="profile-container">
          <div className="prof-grid">
            {/* Left */}
            <div>
              <div className="p-card">
                <div className="p-avatar">{userProfile.initials}</div>
                <div className="p-name">{userProfile.name}</div>
                <div className="p-edu">{userProfile.education}</div>
                <div className="p-skills">
                  <span className="p-tag" style={{ background: '#00E5A015', color: '#00E5A0' }}>{userProfile.skills[0]}</span>
                  <span className="p-tag" style={{ background: '#8B7CF615', color: '#8B7CF6' }}>{userProfile.skills[1]}</span>
                </div>
              </div>
              
              <div className="p-card">
                <div className="p-card-label">Achievements</div>
                <div className="ach-grid">
                  {userProfile.achievements.map((ach) => (
                    <div key={ach.id} className="ach-box" style={{ background: ach.color + '10', borderColor: ach.color + '25' }}>
                      <div className="ach-icon">{ach.icon}</div>
                      <div className="ach-label" style={{ color: ach.color }}>{ach.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right */}
            <div>
              <div className="stats-row">
                <div className="s-card">
                  <div className="s-val" style={{ color: '#00E5A0' }}>{userProfile.stats.sessions}</div>
                  <div className="p-card-label" style={{ marginBottom: 0 }}>Sessions</div>
                </div>
                <div className="s-card">
                  <div className="s-val" style={{ color: '#F59E0B' }}>{userProfile.stats.solved}</div>
                  <div className="p-card-label" style={{ marginBottom: 0 }}>Solved</div>
                </div>
                <div className="s-card">
                  <div className="s-val" style={{ color: '#8B7CF6' }}>{userProfile.stats.rank}</div>
                  <div className="p-card-label" style={{ marginBottom: 0 }}>Rank</div>
                </div>
              </div>
              
              <div className="p-card">
                <div className="p-card-label">Activity — last 30 days</div>
                <div className="hm-grid">
                  {heatmap.map((val, idx) => (
                    <div key={idx} className="hm-cell" style={{ background: colors[val] }}></div>
                  ))}
                </div>
              </div>
              
              <div className="p-card">
                <div className="p-card-label">Problems</div>
                <div className="prog-item">
                  <div className="prog-top">
                    <span style={{ color: '#00E5A0' }}>Easy</span>
                    <span style={{ color: '#7A8499' }}>{userProfile.problems.easy.solved}/{userProfile.problems.easy.total}</span>
                  </div>
                  <div className="prog-bar-bg">
                    <div className="prog-bar-fill" style={{ width: `${(userProfile.problems.easy.solved/userProfile.problems.easy.total)*100}%`, background: '#00E5A0' }}></div>
                  </div>
                </div>
                
                <div className="prog-item">
                  <div className="prog-top">
                    <span style={{ color: '#F59E0B' }}>Medium</span>
                    <span style={{ color: '#7A8499' }}>{userProfile.problems.medium.solved}/{userProfile.problems.medium.total}</span>
                  </div>
                  <div className="prog-bar-bg">
                    <div className="prog-bar-fill" style={{ width: `${(userProfile.problems.medium.solved/userProfile.problems.medium.total)*100}%`, background: '#F59E0B' }}></div>
                  </div>
                </div>
                
                <div className="prog-item">
                  <div className="prog-top">
                    <span style={{ color: '#F87171' }}>Hard</span>
                    <span style={{ color: '#7A8499' }}>{userProfile.problems.hard.solved}/{userProfile.problems.hard.total}</span>
                  </div>
                  <div className="prog-bar-bg">
                    <div className="prog-bar-fill" style={{ width: `${(userProfile.problems.hard.solved/userProfile.problems.hard.total)*100}%`, background: '#F87171' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
