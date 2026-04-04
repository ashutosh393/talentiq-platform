import { UsersIcon, TrophyIcon, CheckCircleIcon, ZapIcon } from "lucide-react";

function StatsCards() {
  return (
    <>
      <style>{`
        .stats-col {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }
        .stat-card {
          background: var(--bg2, #111520);
          border: 1px solid var(--border, #ffffff12);
          border-radius: 8px;
          padding: 10px 12px;
          flex: 1;
        }
        .stat-card-label {
          font-size: 9px;
          color: var(--text3, #7A8499);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 6px;
          font-weight: 500;
        }
        .stat-card-val {
          font-size: 18px;
          font-weight: 500;
          font-family: 'JetBrains Mono', monospace;
        }
        .val-green { color: var(--green, #00E5A0); }
        .val-purple { color: var(--purple, #8B7CF6); }
        .val-amber { color: var(--amber, #F59E0B); }
        .val-blue { color: var(--blue, #60A5FA); }
      `}</style>
      <div className="stats-col">
        <div className="stat-card">
          <div className="stat-card-label">Active</div>
          <div className="stat-card-val val-green">0</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Total</div>
          <div className="stat-card-val val-purple">5</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Solved</div>
          <div className="stat-card-val val-amber">12</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">XP</div>
          <div className="stat-card-val val-blue">180</div>
        </div>
      </div>
    </>
  );
}

export default StatsCards;
