import { useUser } from "@clerk/clerk-react";
import { ArrowRightIcon, ZapIcon } from "lucide-react";

function WelcomeSection({ onCreateSession }) {
  const { user } = useUser();

  return (
    <>
      <style>{`
        .welcome-wrap {
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid #ffffff08;
        }
        .welcome-wrap::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 80% at 20% 50%, #00E5A008 0%, transparent 70%);
          pointer-events: none;
        }
        .welcome-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 56px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }
        .welcome-left { flex: 1; }
        .welcome-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: #00E5A015; border: 1px solid #00E5A025;
          color: #00E5A0; font-size: 12px; font-weight: 500;
          padding: 4px 12px; border-radius: 100px; margin-bottom: 20px;
        }
        .welcome-badge-dot {
          width: 6px; height: 6px; background: #00E5A0;
          border-radius: 50%; animation: wblink 1.5s infinite;
        }
        @keyframes wblink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        .welcome-title {
          font-family: 'Syne', sans-serif;
          font-size: 42px; font-weight: 800;
          letter-spacing: -1.5px; line-height: 1.1;
          color: #EEF2FF; margin-bottom: 12px;
        }
        .welcome-title span { color: #00E5A0; }
        .welcome-sub {
          font-size: 16px; color: #7A8499;
          font-weight: 300; line-height: 1.6;
        }
        .welcome-btn {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 28px; border-radius: 12px;
          background: #00E5A0; color: #000;
          border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 600;
          transition: all 0.2s; white-space: nowrap;
        }
        .welcome-btn:hover {
          background: #00FFB3;
          transform: translateY(-2px);
          box-shadow: 0 12px 32px #00E5A022;
        }
        .welcome-btn svg { transition: transform 0.2s; }
        .welcome-btn:hover svg:last-child { transform: translateX(4px); }
        @media(max-width:640px){
          .welcome-inner { flex-direction: column; align-items: flex-start; padding: 40px 20px; }
          .welcome-title { font-size: 28px; }
          .welcome-btn { width: 100%; justify-content: center; }
        }
      `}</style>

      <div className="welcome-wrap">
        <div className="welcome-inner">
          <div className="welcome-left">
            <div className="welcome-badge">
              <div className="welcome-badge-dot"></div>
              Welcome back
            </div>
            <h1 className="welcome-title">
              Hey, <span>{user?.firstName || "there"}</span> 👋
            </h1>
            <p className="welcome-sub">Ready to level up your coding skills today?</p>
          </div>

          <button className="welcome-btn" onClick={onCreateSession}>
            <ZapIcon size={18} />
            <span>Create Session</span>
            <ArrowRightIcon size={16} />
          </button>
        </div>
      </div>
    </>
  );
}

export default WelcomeSection;
