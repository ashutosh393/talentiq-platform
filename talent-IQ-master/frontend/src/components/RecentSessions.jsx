import { Code2, Clock, Users, Trophy, Loader } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const diffColor = (d) => {
  if (d === "easy")   return { bg: "#00E5A015", color: "#00E5A0", border: "#00E5A025" };
  if (d === "medium") return { bg: "#F59E0B15", color: "#F59E0B", border: "#F59E0B25" };
  return                     { bg: "#F8717115", color: "#F87171", border: "#F8717125" };
};

function RecentSessions({ sessions, isLoading }) {
  return (
    <>
      <style>{`
        .recent-wrap {
          background: #111520;
          border: 1px solid #ffffff12;
          border-radius: 16px;
          padding: 28px;
          margin-top: 24px;
        }
        .recent-header {
          display: flex; align-items: center; gap: 10px; margin-bottom: 24px;
        }
        .recent-icon-wrap {
          width: 36px; height: 36px; border-radius: 10px;
          background: #8B7CF615; border: 1px solid #8B7CF625;
          display: flex; align-items: center; justify-content: center;
        }
        .recent-h2 {
          font-family: 'Syne', sans-serif;
          font-size: 20px; font-weight: 700; color: #EEF2FF;
        }
        .recent-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }
        .recent-card {
          background: #0C0F13;
          border: 1px solid #ffffff08;
          border-radius: 12px;
          padding: 20px;
          position: relative;
          transition: border-color 0.2s, transform 0.2s;
        }
        .recent-card:hover { border-color: #ffffff18; transform: translateY(-2px); }
        .recent-card.active-session {
          background: #00E5A008;
          border-color: #00E5A025;
        }
        .recent-card.active-session:hover { border-color: #00E5A040; }
        .active-pill {
          position: absolute; top: 14px; right: 14px;
          display: flex; align-items: center; gap: 5px;
          font-size: 9px; font-weight: 700; letter-spacing: 0.06em;
          padding: 3px 8px; border-radius: 100px;
          background: #00E5A015; color: #00E5A0; border: 1px solid #00E5A025;
        }
        .active-pill-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #00E5A0;
          animation: rpulse 1.5s infinite;
        }
        @keyframes rpulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .recent-card-top {
          display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px;
        }
        .recent-code-icon {
          width: 44px; height: 44px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .recent-problem {
          font-family: 'Syne', sans-serif;
          font-size: 14px; font-weight: 600;
          color: #EEF2FF; margin-bottom: 6px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .diff-badge {
          font-size: 10px; font-weight: 500;
          padding: 2px 8px; border-radius: 100px;
          display: inline-block;
        }
        .recent-meta {
          display: flex; flex-direction: column; gap: 6px;
          font-size: 12px; color: #7A8499; margin-bottom: 16px;
        }
        .recent-meta-row { display: flex; align-items: center; gap: 6px; }
        .recent-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 12px; border-top: 1px solid #ffffff08;
        }
        .recent-footer-label {
          font-size: 11px; font-weight: 600;
          color: #7A8499; text-transform: uppercase; letter-spacing: 0.05em;
        }
        .recent-footer-date { font-size: 11px; color: #3A4255; }
        .recent-empty {
          grid-column: 1 / -1;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 60px 20px; text-align: center;
        }
        .recent-empty-icon {
          width: 72px; height: 72px; border-radius: 20px;
          background: #8B7CF610; border: 1px solid #8B7CF620;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
        }
        .recent-empty-title { font-size: 16px; font-weight: 600; color: #EEF2FF; margin-bottom: 6px; }
        .recent-empty-sub   { font-size: 13px; color: #3A4255; }
        .recent-loader {
          grid-column: 1 / -1;
          display: flex; align-items: center; justify-content: center; padding: 60px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="recent-wrap">
        <div className="recent-header">
          <div className="recent-icon-wrap">
            <Clock size={18} color="#8B7CF6" />
          </div>
          <h2 className="recent-h2">Your Past Sessions</h2>
        </div>

        <div className="recent-grid">
          {isLoading ? (
            <div className="recent-loader">
              <Loader size={36} color="#00E5A0" style={{ animation: "spin 1s linear infinite" }} />
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session) => {
              const dc = diffColor(session.difficulty);
              const isActive = session.status === "active";
              return (
                <div key={session._id} className={`recent-card${isActive ? " active-session" : ""}`}>
                  {isActive && (
                    <div className="active-pill">
                      <div className="active-pill-dot"></div>
                      ACTIVE
                    </div>
                  )}

                  <div className="recent-card-top">
                    <div
                      className="recent-code-icon"
                      style={{ background: isActive ? "#00E5A015" : "#8B7CF610", border: `1px solid ${isActive ? "#00E5A025" : "#8B7CF620"}` }}
                    >
                      <Code2 size={22} color={isActive ? "#00E5A0" : "#8B7CF6"} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="recent-problem">{session.problem}</div>
                      <span className="diff-badge" style={{ background: dc.bg, color: dc.color, border: `1px solid ${dc.border}` }}>
                        {session.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="recent-meta">
                    <div className="recent-meta-row">
                      <Clock size={13} />
                      <span>
                        {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="recent-meta-row">
                      <Users size={13} />
                      <span>{session.participant ? "2" : "1"} participant{session.participant ? "s" : ""}</span>
                    </div>
                  </div>

                  <div className="recent-footer">
                    <span className="recent-footer-label">Completed</span>
                    <span className="recent-footer-date">
                      {new Date(session.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="recent-empty">
              <div className="recent-empty-icon">
                <Trophy size={32} color="#8B7CF640" />
              </div>
              <div className="recent-empty-title">No sessions yet</div>
              <div className="recent-empty-sub">Start your coding journey today!</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default RecentSessions;
