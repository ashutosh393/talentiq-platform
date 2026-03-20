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

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({ problem: "", difficulty: "" });

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
        @media(max-width:1024px){
          .dashboard-grid { grid-template-columns: 1fr 1fr; }
        }
        @media(max-width:640px){
          .dashboard-grid { grid-template-columns: 1fr; }
          .dashboard-container { padding: 0 16px 60px; }
        }
      `}</style>

      <div className="dashboard-root">
        <Navbar />
        <WelcomeSection onCreateSession={() => setShowCreateModal(true)} />

        <div className="dashboard-container">
          <div className="dashboard-grid">
            <StatsCards
              activeSessionsCount={activeSessions.length}
              recentSessionsCount={recentSessions.length}
            />
            <ActiveSessions
              sessions={activeSessions}
              isLoading={loadingActiveSessions}
              isUserInSession={isUserInSession}
            />
          </div>

          <RecentSessions
            sessions={recentSessions}
            isLoading={loadingRecentSessions}
          />
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
