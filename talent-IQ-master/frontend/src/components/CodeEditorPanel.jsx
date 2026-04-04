import Editor from "@monaco-editor/react";
import { Loader2Icon, PlayIcon } from "lucide-react";
import { LANGUAGE_CONFIG } from "../data/problems";
import { useState, useEffect } from "react";
import { formatTime } from "../lib/utils";

function CodeEditorPanel({
  selectedLanguage,
  code,
  isRunning,
  onLanguageChange,
  onCodeChange,
  onRunCode,
}) {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-full flex flex-col" style={{ background: '#0D1117' }}>
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ background: '#161C28', borderColor: '#ffffff12' }}>
        <div className="flex items-center gap-3">
          <img
            src={LANGUAGE_CONFIG[selectedLanguage].icon}
            alt={LANGUAGE_CONFIG[selectedLanguage].name}
            className="size-6"
          />
          <select 
            value={selectedLanguage} 
            onChange={onLanguageChange}
            style={{ background: 'transparent', color: '#EEF2FF', outline: 'none', border: 'none', fontSize: '13px', cursor: 'pointer' }}
          >
            {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
              <option key={key} value={key} style={{ color: '#000' }}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <div style={{ background: '#F87171', borderRadius: '4px', padding: '4px 8px', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#fff', fontWeight: 500 }}>
            {formatTime(timeLeft)}
          </div>
          <button 
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#00E5A0', color: '#000', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 500, cursor: 'pointer', border: 'none' }} 
            disabled={isRunning} 
            onClick={onRunCode}
          >
            {isRunning ? (
              <>
                <Loader2Icon className="size-3 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <PlayIcon className="size-3" fill="#000" />
                Run Code
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1" style={{ padding: '8px 0' }}>
        <Editor
          height={"100%"}
          language={LANGUAGE_CONFIG[selectedLanguage].monacoLang}
          value={code}
          onChange={onCodeChange}
          theme="vs-dark"
          options={{
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: false },
          }}
        />
      </div>
    </div>
  );
}
export default CodeEditorPanel;
