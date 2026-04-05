import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useEndSession, useJoinSession, useSessionById } from "../hooks/useSessions";
import { PROBLEMS } from "../data/problems";
import { executeCode } from "../lib/piston";
import axiosInstance from "../lib/axios";
import Navbar from "../components/Navbar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { getDifficultyBadgeClass } from "../lib/utils";
import { Loader2Icon, LogOutIcon, PhoneOffIcon } from "lucide-react";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";
import ProblemDescription from "../components/ProblemDescription";

import useStreamClient from "../hooks/useStreamClient";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "../components/VideoCallUI";

function SessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const { data: sessionData, isLoading: loadingSession, refetch } = useSessionById(id);

  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();

  const session = sessionData?.session;
  const isHost = session?.host?.clerkId === user?.id;
  const isParticipant = session?.participant?.clerkId === user?.id;

  const { call, channel, chatClient, isInitializingCall, streamClient } = useStreamClient(
    session,
    loadingSession,
    isHost,
    isParticipant
  );

  const [problemData, setProblemData] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");

  useEffect(() => {
    if (!session?.problem) return;
    
    const slug = session.problem.toLowerCase().replace(/\s+/g, '-');
    
    axiosInstance.get(`/problems/${slug}`)
      .then(response => {
        const data = response.data;
        if (!data.error) {
          setProblemData(data);
          const lang = "javascript"; // or whatever default
          if (data.starterCode?.[lang]) {
            setCode(data.starterCode[lang]);
          }
        }
      })
      .catch(err => console.error("Error fetching problem:", err));
  }, [session?.problem]);

  // auto-join session if user is not already a participant and not the host
  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipant) return;

    joinSessionMutation.mutate(id, { onSuccess: refetch });

    // We deliberately omit some dependencies here to avoid infinite loops, ignoring exhaustive-deps warning for now.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, user, loadingSession, isHost, isParticipant, id]);

  // redirect the "participant" when session ends
  useEffect(() => {
    if (!session || loadingSession) return;

    if (session.status === "completed") navigate("/dashboard");
  }, [session, loadingSession, navigate]);

  // update code when problem loads or changes
  useEffect(() => {
    if (problemData?.starterCode?.[selectedLanguage]) {
      setCode(problemData.starterCode[selectedLanguage]);
    }
  }, [problemData, selectedLanguage]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    // use problem-specific starter code
    const starterCode = problemData?.starterCode?.[newLang] || "";
    setCode(starterCode);
    setOutput(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const result = await executeCode(selectedLanguage, code);
    setOutput(result);
    setIsRunning(false);
  };

  const handleEndSession = () => {
    if (confirm("Are you sure you want to end this session? All participants will be notified.")) {
      // this will navigate the HOST to dashboard
      endSessionMutation.mutate(id, { onSuccess: () => navigate("/dashboard") });
    }
  };

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className="flex-1">
        <PanelGroup direction="horizontal">
          {/* LEFT PANEL - CODE EDITOR & PROBLEM DETAILS */}
          <Panel defaultSize={50} minSize={30}>
            <PanelGroup direction="vertical">
              {/* PROBLEM DSC PANEL */}
              <Panel defaultSize={50} minSize={20}>
                <div className="h-full bg-[#0A0C0F] flex flex-col">
                  {/* SESSION CONTROL HEADER */}
                  <div className="px-6 py-3 bg-[#111520] border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {isHost && session?.status === "active" && (
                        <button
                          onClick={handleEndSession}
                          disabled={endSessionMutation.isPending}
                          className="btn btn-error btn-sm gap-2 rounded-md"
                        >
                          {endSessionMutation.isPending ? (
                            <Loader2Icon className="w-4 h-4 animate-spin" />
                          ) : (
                            <LogOutIcon className="w-4 h-4" />
                          )}
                          End Session
                        </button>
                      )}
                      {session?.status === "completed" && (
                        <span className="badge badge-ghost badge-md">Completed</span>
                      )}
                    </div>
                    
                    <div className="text-xs text-[#7A8499] font-medium flex gap-3">
                      <span>Host: {session?.host?.name || "Loading..."}</span>
                      <span className="text-[#00E5A0">•</span>
                      <span>{session?.participant ? 2 : 1}/2 participants</span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    {problemData ? (
                      <ProblemDescription problem={problemData} />
                    ) : (
                      <div className="h-full flex items-center justify-center p-8 text-[#A0ABC0] text-sm">
                        <Loader2Icon className="w-6 h-6 animate-spin mb-2" />
                        Loading problem data from engine...
                      </div>
                    )}
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

            <Panel defaultSize={50} minSize={20}>
                <PanelGroup direction="vertical">
                  <Panel defaultSize={55} minSize={30}>
                    <CodeEditorPanel
                      selectedLanguage={selectedLanguage}
                      code={code}
                      isRunning={isRunning}
                      onLanguageChange={handleLanguageChange}
                      onCodeChange={(value) => setCode(value)}
                      onRunCode={handleRunCode}
                    />
                  </Panel>

                  <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

                  <Panel defaultSize={30} minSize={15}>
                    <OutputPanel output={output} />
                    
                    {/* AI Hint */}
                    <div style={{ background: '#00E5A015', border: '1px solid #00E5A030', borderRadius: '5px', padding: '6px 8px', margin: '8px' }}>
                      <div style={{ fontSize: '9px', color: '#00E5A0', fontWeight: 500, marginBottom: '2px' }}>AI HINT</div>
                      <div style={{ fontSize: '10px', color: '#7A8499' }}>Think about what complement each number needs...</div>
                    </div>
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

          {/* RIGHT PANEL - VIDEO CALLS & CHAT */}
          <Panel defaultSize={50} minSize={30}>
            <div className="h-full bg-base-200 p-4 overflow-auto">
              {isInitializingCall ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
                    <p className="text-lg">Connecting to video call...</p>
                  </div>
                </div>
              ) : !streamClient || !call ? (
                <div className="h-full flex items-center justify-center">
                  <div className="card bg-base-100 shadow-xl max-w-md">
                    <div className="card-body items-center text-center">
                      <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mb-4">
                        <PhoneOffIcon className="w-12 h-12 text-error" />
                      </div>
                      <h2 className="card-title text-2xl">Connection Failed</h2>
                      <p className="text-base-content/70">Unable to connect to the video call</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full">
                  <StreamVideo client={streamClient}>
                    <StreamCall call={call}>
                      <VideoCallUI chatClient={chatClient} channel={channel} />
                    </StreamCall>
                  </StreamVideo>
                </div>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default SessionPage;
