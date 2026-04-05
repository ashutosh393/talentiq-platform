import { Link, useLocation } from "react-router";
import { BookOpenIcon, LayoutDashboardIcon, SparklesIcon } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";

function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        .tiq-nav {
          background: rgba(8,10,13,0.85);
          backdrop-filter: blur(24px);
          border-bottom: 1px solid #ffffff12;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .tiq-nav-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 14px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .tiq-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          transition: transform 0.2s;
        }
        .tiq-logo:hover { transform: scale(1.03); }
        .tiq-logo-mark {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: #00E5A0;
          display: flex; align-items: center; justify-content: center;
        }
        .tiq-logo-name {
          font-family: 'Syne', sans-serif;
          font-size: 18px; font-weight: 800;
          color: #EEF2FF; letter-spacing: -0.5px;
        }
        .tiq-logo-sub { font-size: 10px; color: #3A4255; font-weight: 300; }
        .tiq-nav-links { display: flex; align-items: center; gap: 4px; }
        .tiq-nav-link {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 14px; border-radius: 8px;
          font-size: 14px; font-weight: 500;
          text-decoration: none;
          transition: all 0.2s;
          color: #7A8499;
        }
        .tiq-nav-link:hover { background: #111520; color: #EEF2FF; }
        .tiq-nav-link.active { background: #00E5A015; color: #00E5A0; border: 1px solid #00E5A025; }
        .tiq-nav-link svg { width: 16px; height: 16px; }
        .tiq-nav-right { display: flex; align-items: center; gap: 16px; }
      `}</style>

      <nav className="tiq-nav">
        <div className="tiq-nav-inner">
          <Link to="/" className="tiq-logo">
            <div className="tiq-logo-mark">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10h12M10 4l6 6-6 6" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div className="tiq-logo-name">TalentIQ</div>
              <div className="tiq-logo-sub">Code Together</div>
            </div>
          </Link>

          <div className="tiq-nav-links">
            <Link to="/problems" className={`tiq-nav-link${isActive("/problems") ? " active" : ""}`}>
              <BookOpenIcon />
              <span>Problems</span>
            </Link>
            <Link to="/dashboard" className={`tiq-nav-link${isActive("/dashboard") ? " active" : ""}`}>
              <LayoutDashboardIcon />
              <span>Dashboard</span>
            </Link>
            <Link to="/resume" className={`tiq-nav-link${isActive("/resume") ? " active" : ""}`} style={{ color: '#8B7CF6' }}>
              <SparklesIcon size={16} />
              <span>AI Interviews</span>
            </Link>
            <Link to="/newsletter" className={`tiq-nav-link${isActive("/newsletter") ? " active" : ""}`}>
              <span>Newsletter</span>
            </Link>
            <Link to="/profile" className={`tiq-nav-link${isActive("/profile") ? " active" : ""}`}>
              <span>Profile</span>
            </Link>
          </div>

          <div className="tiq-nav-right">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
