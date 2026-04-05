import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Navbar from "../components/Navbar";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";
import { executeCode } from "../lib/piston";
import axiosInstance from "../lib/axios";

import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { Loader2Icon, ArrowLeftIcon } from "lucide-react";

function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentProblem, setCurrentProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // fetch problem data when ID changes
  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    
    axiosInstance.get(`/problems/${id}`)
      .then(response => {
        const data = response.data;
        if (!data.error) {
          setCurrentProblem(data);
          setCode(data.starterCode?.[selectedLanguage] || "");
        }
      })
      .catch(err => {
        console.error("Error fetching problem:", err);
        toast.error("Failed to load problem details.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id, selectedLanguage]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    if (currentProblem?.starterCode) {
      setCode(currentProblem.starterCode[newLang] || "");
    }
    setOutput(null);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.2, y: 0.6 },
    });

    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.8, y: 0.6 },
    });
  };

  const normalizeOutput = (output) => {
    if (!output) return "";
    return output
      .trim()
      .split("\n")
      .map((line) =>
        line
          .trim()
          .replace(/\[\s+/g, "[")
          .replace(/\s+\]/g, "]")
          .replace(/\s*,\s*/g, ",")
      )
      .filter((line) => line.length > 0)
      .join("\n");
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const result = await executeCode(selectedLanguage, code);
    setOutput(result);
    setIsRunning(false);

    if (result.success) {
      const expectedOutput = currentProblem?.expectedOutput?.[selectedLanguage];
      
      // If we have strict expectedOutput (e.g. mock DB problems), test against it.
      if (expectedOutput) {
        const testsPassed = normalizeOutput(result.output) === normalizeOutput(expectedOutput);
        if (testsPassed) {
          triggerConfetti();
          toast.success("All tests passed! Great job!");
        } else {
          toast.error("Tests failed. Check your output!");
        }
      } else {
        // If it's a dynamic problem without expectedOutput, just celebrate successful compilation
        triggerConfetti();
        toast.success("Code Executed Successfully!");
      }
    } else {
      toast.error("Code execution failed!");
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-[#0A0C0F] flex flex-col items-center justify-center text-[#7A8499]">
        <Loader2Icon className="w-8 h-8 animate-spin mb-4 text-[#00E5A0]" />
        <p>Loading problem details from Database...</p>
      </div>
    );
  }

  if (!currentProblem) {
    return (
      <div className="h-screen bg-[#0A0C0F] flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold">Problem Not Found</h1>
        <button onClick={() => navigate("/problems")} className="mt-4 text-[#00E5A0] hover:underline">
          Return to Problems
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0A0C0F] flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* left panel- problem desc */}
          <Panel defaultSize={40} minSize={30}>
            <div className="h-full bg-[#0A0C0F] overflow-y-auto w-full flex flex-col">
               <div className="px-6 pt-4">
                 <button onClick={() => navigate("/problems")} className="flex items-center gap-2 text-sm text-[#7A8499] hover:text-[#00E5A0] transition-colors font-medium">
                   <ArrowLeftIcon className="w-4 h-4" />
                   Back to Problems
                 </button>
               </div>
               <div className="flex-1">
                 <ProblemDescription problem={currentProblem} />
               </div>
            </div>
          </Panel>

          <PanelResizeHandle className="w-2 bg-[#161C28] hover:bg-[#00E5A0] transition-colors cursor-col-resize" />

          {/* right panel- code editor & output */}
          <Panel defaultSize={60} minSize={30}>
            <PanelGroup direction="vertical">
              {/* Top panel - Code editor */}
              <Panel defaultSize={70} minSize={30}>
                <CodeEditorPanel
                  selectedLanguage={selectedLanguage}
                  code={code}
                  isRunning={isRunning}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={setCode}
                  onRunCode={handleRunCode}
                />
              </Panel>

              <PanelResizeHandle className="h-2 bg-[#161C28] hover:bg-[#00E5A0] transition-colors cursor-row-resize" />

              {/* Bottom panel - Output Panel*/}
              <Panel defaultSize={30} minSize={30}>
                <OutputPanel output={output} />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default ProblemPage;
