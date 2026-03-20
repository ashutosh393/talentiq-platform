import {
  ArrowRightIcon, Code2Icon, CrownIcon,
  SparklesIcon, UsersIcon, ZapIcon, LoaderIcon,
} from "lucide-react";
import { Link } from "react-router";

const diffColor = (d) => {
  if (d === "easy")   return { bg: "#00E5A015", color: "#00E5A0", border: "#00E5A025" };
  if (d === "medium") return { bg: "#F59E0B15", color: "#F59E0B", border: "#F59E0B25" };
  return                     { bg: "#F8717115", color: "#F87171", border: "#F8717125" };
};

function ActiveSessions({ sessions, isLoading, isUserInSession }) {
  return (
    <>
      <style>{`
        .active-card {
          background: #111520;
          border: 1px solid #ffffff12;
          border-radius: 16px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          min-height: 320px;
        }
        .active-card-header {
          display: flex; align-items: center;
          justify-content: space-between; margin-bottom: 24px;
        }
        .active-card-title {
          display: flex; align-items: center; gap: 10px;
        }
        .active-icon-wrap {
          width: 36px; height: 36px; border-radius: 10px;
          background: #00E5A015; border: 1px solid #00E5A025;
          display: flex; align-items: center; justify-content: center;
        }
        .active-h2 {
          font-family: 'Syne', sans-serif;
          font-size: 20px; font-weight: 700; color: #EEF2FF;
        }
        .active-count {
          display: flex; align-items: center; gap: 6px;
          font-size: 13px; color: #22C55E;
        }
        .active-count-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #22C55E; box-shadow: 0 0 6px #22C55E60;
        }
        .active-list {
          display: flex; flex-direction: column; gap: 12px;
          max-height: 400px; overflow-y: auto;
          padding-right: 4px;
          scrollbar-width: thin;
          scrollbar-color: #ffffff12 transparent;
        }
        .session-row {
          background: #0C0F13;
          border: 1px solid #ffffff08;
          border-radius: 12px;
          padding: 16px 20px;
          display: flex; align-items: center;
          justify-content: space-between; gap: 16px;
          transition: border-color 0.2s;
        }
        .session-row:hover { border-color: #00E5A025; }
        .session-row-left { display: flex; align-items: center; gap: 14px; flex: 1; min-width: 0; }
        .session-code-icon {
          position: relative;
          width: 48px; height: 48px; border-radius: 12px;
          background: #00E5A015; border: 1px solid #00E5A025;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .session-live-dot {
          position: absolute; top: -3px; right: -3px;
          width: 10px; height: 10px; border-radius: 50%;
          background: #22C55E; border: 2px solid #0C0F13;
          box-shadow: 0 0 6px #22C55E60;
        }
        .session-problem {
          font-family: 'Syne', sans-serif;
          font-size: 14px; font-weight: 600;
          color: #EEF2FF; margin-bottom: 6px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .session-meta {
          display: flex; align-items: center; gap: 12px;
          font-size: 12px; color: #7A8499;
        }
        .session-meta-item { display: flex; align-items: center; gap: 4px; }
        .diff-badge {
          font-size: 10px; font-weight: 500;
          padding: 2px 8px; border-radius: 100px;
        }
        .status-badge {
          font-size: 10px; font-weight: 600;
          padding: 2px 8px; border-radius: 100px;
          letter-spacing: 0.04em;
        }
        .badge-full  { background: #F8717115; color: #F87171; border: 1px solid #F8717125; }
        .badge-open  { background: #00E5A015; color: #00E5A0; border: 1px solid #00E5A025; }
        .join-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 8px;
          background: #00E5A0; color: #000;
          font-size: 13px; font-weight: 600;
          text-decoration: none; border: none; cursor: pointer;
          transition: all 0.2s; white-space: nowrap; flex-shrink: 0;
        }
        .join-btn:hover { background: #00FFB3; transform: translateY(-1px); }
        .join-btn-disabled {
          padding: 7px 14px; border-radius: 8px;
          background: #ffffff08; color: #3A4255;
          font-size: 13px; font-weight: 500;
          border: 1px solid #ffffff08; cursor: not-allowed;
          white-space: nowrap; flex-shrink: 0;
        }
        .active-empty {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 40px 20px; text-align: center;
        }
        .active-empty-icon {
          width: 72px; height: 72px; border-radius: 20px;
          background: #00E5A008; border: 1px solid #00E5A015;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
        }
        .active-empty-title { font-size: 16px; font-weight: 600; color: #EEF2FF; margin-bottom: 6px; }
        .active-empty-sub   { font-size: 13px; color: #3A4255; }
        .active-loader {
          flex: 1; display: flex;
          align-items: center; justify-content: center; padding: 40px;
        }
      `}</style>

      <div className="active-card" style={{ gridColumn: "span 2" }}>
        {/* Header */}
        <div className="active-card-header">
          <div className="active-card-title">
            <div className="active-icon-wrap">
              <ZapIcon size={18} color="#00E5A0" />
            </div>
            <h2 className="active-h2">Live Sessions</h2>
          </div>
          <div className="active-count">
            <div className="active-count-dot"></div>
            <span>{sessions.length} active</span>
          </div>
        </div>

        {/* Body */}
        {isLoading ? (
          <div className="active-loader">
            <LoaderIcon size={36} color="#00E5A0" style={{ animation: "spin 1s linear infinite" }} />
          </div>
        ) : sessions.length > 0 ? (
          <div className="active-list">
            {sessions.map((session) => {
              const dc = diffColor(session.difficulty);
              const isFull = session.participant && !isUserInSession(session);
              return (
                <div key={session._id} className="session-row">
                  <div className="session-row-left">
                    <div className="session-code-icon">
                      <Code2Icon size={22} color="#00E5A0" />
                      <div className="session-live-dot"></div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                        <div className="session-problem">{session.problem}</div>
                        <span className="diff-badge" style={{ background: dc.bg, color: dc.color, border: `1px solid ${dc.border}` }}>
                          {session.difficulty.charAt(0).toUpperCase() + session.difficulty.slice(1)}
                        </span>
                      </div>
                      <div className="session-meta">
                        <div className="session-meta-item">
                          <CrownIcon size={13} />
                          <span>{session.host?.name}</span>
                        </div>
                        <div className="session-meta-item">
                          <UsersIcon size={13} />
                          <span>{session.participant ? "2/2" : "1/2"}</span>
                        </div>
                        <span className={`status-badge ${isFull ? "badge-full" : "badge-open"}`}>
                          {isFull ? "FULL" : "OPEN"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isFull ? (
                    <span className="join-btn-disabled">Full</span>
                  ) : (
                    <Link to={`/session/${session._id}`} className="join-btn">
                      {isUserInSession(session) ? "Rejoin" : "Join"}
                      <ArrowRightIcon size={14} />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="active-empty">
            <div className="active-empty-icon">
              <SparklesIcon size={32} color="#00E5A040" />
            </div>
            <div className="active-empty-title">No active sessions</div>
            <div className="active-empty-sub">Be the first to create one!</div>
          </div>
        )}
      </div>
    </>
  );
}

export default ActiveSessions;
