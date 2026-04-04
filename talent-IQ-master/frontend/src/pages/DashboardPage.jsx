import { useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { useActiveSessions, useCreateSession, useMyRecentSessions } from "../hooks/useSessions";

import Navbar from "../components/Navbar";
import WelcomeSection from "../components/WelcomeSection";
import StatsCards from "../components/StatsCards";
import ActiveSessions from "../components/ActiveSessions";
import RecentSessions from "../components/RecentSessions";
import CreateSessionModal from "../components/CreateSessionModal";
import SkillsRadar from "../components/SkillsRadar";
import { FlameIcon, StarIcon } from "lucide-react";

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({ problem: "", difficulty: "" });
  const [showStreak] = useState(true);

  const createSessionMutation = useCreateSession();

  const { data: activeSessionsData, isLoading: loadingActiveSessions } = useActiveSessions();
  const { data: recentSessionsData, isLoading: loadingRecentSessions } = useMyRecentSessions();

  const handleCreateRoom = () => {
    if (!roomConfig.problem || !roomConfig.difficulty) return;
    createSessionMutation.mutate(
      { problem: roomConfig.problem, difficulty: roomConfig.difficulty.toLowerCase() },
      {
        onSuccess: (data) => {
          setShowCreateModal(false);
          navigate(`/session/${data.session._id}`);
        },
      }
    );
  };

  const activeSessions = activeSessionsData?.sessions || [];
  const recentSessions = recentSessionsData?.sessions || [];

  const isUserInSession = (session) => {
    if (!user?.id) return false;
    return session.host?.clerkId === user.id || session.participant?.clerkId === user.id;
  };

  return (
    <>
      <style>{`
        .dashboard-root {
          min-height: 100vh;
          background: #080A0D;
          font-family: 'DM Sans', sans-serif;
          color: #EEF2FF;
        }
        .dashboard-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px 80px;
        }
        .dashboard-grid {
          display: grid;
          grid-template-columns: 280px 1fr 1fr;
          gap: 20px;
          margin-bottom: 0;
        }
        .recent-radar-row {
          display: flex;
          gap: 20px;
          margin-top: 24px;
        }
        .recent-flex {
          flex: 1.3;
        }
        .radar-flex {
          flex: 0.7;
          display: flex;
        }
        @media(max-width:1024px){
          .dashboard-grid { grid-template-columns: 1fr 1fr; }
          .recent-radar-row { flex-direction: column; }
        }
        @media(max-width:640px){
          .dashboard-grid { grid-template-columns: 1fr; }
          .dashboard-container { padding: 0 16px 60px; }
        }
        .streak-banner {
          background: #F59E0B10;
          border: 1px solid #F59E0B25;
          border-radius: 6px;
          padding: 7px 10px;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }
        .ai-tip {
          background: #00E5A015;
          border: 1px solid #00E5A030;
          border-radius: 6px;
          padding: 8px 10px;
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
        }
      `}</style>

      <div className="dashboard-root">
        <Navbar />
        <WelcomeSection onCreateSession={() => setShowCreateModal(true)} />

        <div className="dashboard-container">
          
          {showStreak && (
            <div className="streak-banner">
              <FlameIcon size={14} color="#F59E0B" />
              <span style={{ fontSize: '11px', fontWeight: 500, color: '#F59E0B' }}>14-day streak!</span>
              <span style={{ fontSize: '10px', color: 'var(--text3)' }}>Keep it going today</span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '2px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#00E5A020', border: '1px solid #00E5A040' }}></div>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#00E5A020', border: '1px solid #00E5A040' }}></div>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#00E5A020', border: '1px solid #00E5A040' }}></div>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#F59E0B20', border: '1px solid #F59E0B50' }}></div>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--surface2)', border: '1px solid var(--border)' }}></div>
              </div>
            </div>
          )}

          <div className="dashboard-grid">
            <StatsCards />
            <ActiveSessions
              sessions={activeSessions}
              isLoading={loadingActiveSessions}
              isUserInSession={isUserInSession}
            />
          </div>

          <div className="ai-tip">
            <div style={{ width: '16px', height: '16px', background: '#00E5A030', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
              <StarIcon size={10} color="#00E5A0" fill="#00E5A0" />
            </div>
            <div>
              <div style={{ fontSize: '9px', color: '#00E5A0', fontWeight: 500, marginBottom: '2px' }}>AI TIP</div>
              <div style={{ fontSize: '10px', color: 'var(--text2)', lineHeight: 1.5 }}>You're strong at arrays. Try "Binary Tree Level Order Traversal" next — matches your skill level.</div>
            </div>
          </div>

          <div className="recent-radar-row">
            <div className="recent-flex">
              <RecentSessions
                sessions={recentSessions}
                isLoading={loadingRecentSessions}
              />
            </div>
            <div className="radar-flex">
              <div style={{ marginTop: '24px', width: '100%' }}>
                <SkillsRadar />
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        onCreateRoom={handleCreateRoom}
        isCreating={createSessionMutation.isPending}
      />
    </>
  );
}

export default DashboardPage;
