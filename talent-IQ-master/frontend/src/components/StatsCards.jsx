import { TrophyIcon, UsersIcon } from "lucide-react";

function StatsCards({ activeSessionsCount, recentSessionsCount }) {
  return (
    <>
      <style>{`
        .stats-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .stat-card {
          background: #111520;
          border: 1px solid #ffffff12;
          border-radius: 16px;
          padding: 24px;
          transition: border-color 0.2s, transform 0.2s;
          cursor: default;
        }
        .stat-card:hover { border-color: #ffffff20; transform: translateY(-2px); }
        .stat-card-top {
          display: flex; align-items: center;
          justify-content: space-between; margin-bottom: 16px;
        }
        .stat-icon {
          width: 44px; height: 44px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
        }
        .stat-live-badge {
          font-size: 10px; font-weight: 600;
          padding: 3px 10px; border-radius: 100px;
          background: #00E5A015; color: #00E5A0;
          border: 1px solid #00E5A025;
          letter-spacing: 0.05em;
          animation: pulse-badge 2s infinite;
        }
        @keyframes pulse-badge { 0%,100%{opacity:1} 50%{opacity:0.6} }
        .stat-num {
          font-family: 'Syne', sans-serif;
          font-size: 40px; font-weight: 800;
          color: #EEF2FF; line-height: 1;
          margin-bottom: 6px;
        }
        .stat-label { font-size: 13px; color: #7A8499; font-weight: 300; }
      `}</style>

      <div className="stats-col">
        {/* Active Sessions */}
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon" style={{ background: "#00E5A010" }}>
              <UsersIcon size={22} color="#00E5A0" />
            </div>
            <div className="stat-live-badge">● LIVE</div>
          </div>
          <div className="stat-num">{activeSessionsCount}</div>
          <div className="stat-label">Active Sessions</div>
        </div>

        {/* Total Sessions */}
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon" style={{ background: "#8B7CF610" }}>
              <TrophyIcon size={22} color="#8B7CF6" />
            </div>
          </div>
          <div className="stat-num">{recentSessionsCount}</div>
          <div className="stat-label">Total Sessions</div>
        </div>
      </div>
    </>
  );
}

export default StatsCards;
