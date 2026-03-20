import { Code2Icon, LoaderIcon, PlusIcon, XIcon } from "lucide-react";
import { PROBLEMS } from "../data/problems";

function CreateSessionModal({ isOpen, onClose, roomConfig, setRoomConfig, onCreateRoom, isCreating }) {
  const problems = Object.values(PROBLEMS);

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .modal-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(4px);
          z-index: 999;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: mfadein 0.15s ease;
        }
        @keyframes mfadein { from{opacity:0} to{opacity:1} }
        .modal-box {
          background: #111520;
          border: 1px solid #ffffff18;
          border-radius: 20px;
          padding: 32px;
          width: 100%;
          max-width: 560px;
          position: relative;
          animation: mslideup 0.2s ease;
          box-shadow: 0 24px 60px rgba(0,0,0,0.6);
        }
        @keyframes mslideup { from{transform:translateY(16px);opacity:0} to{transform:translateY(0);opacity:1} }
        .modal-close {
          position: absolute; top: 16px; right: 16px;
          width: 32px; height: 32px; border-radius: 8px;
          background: #ffffff08; border: 1px solid #ffffff10;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #7A8499; transition: all 0.2s;
        }
        .modal-close:hover { background: #ffffff15; color: #EEF2FF; }
        .modal-title {
          font-family: 'Syne', sans-serif;
          font-size: 22px; font-weight: 800;
          color: #EEF2FF; margin-bottom: 28px;
          letter-spacing: -0.5px;
        }
        .modal-label {
          display: flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 500; color: #7A8499;
          text-transform: uppercase; letter-spacing: 0.06em;
          margin-bottom: 10px;
        }
        .modal-label-req { color: #F87171; }
        .modal-select {
          width: 100%;
          padding: 11px 14px;
          background: #0C0F13;
          border: 1px solid #ffffff12;
          border-radius: 10px;
          color: #EEF2FF;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          cursor: pointer;
          transition: border-color 0.2s;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%237A8499' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px;
        }
        .modal-select:focus { border-color: #00E5A040; }
        .modal-select option { background: #111520; }
        .modal-summary {
          margin-top: 20px;
          background: #00E5A008;
          border: 1px solid #00E5A025;
          border-radius: 12px;
          padding: 16px;
          display: flex; gap: 12px; align-items: flex-start;
        }
        .modal-summary-icon {
          width: 36px; height: 36px; border-radius: 9px;
          background: #00E5A015; border: 1px solid #00E5A025;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .modal-summary-title {
          font-size: 12px; font-weight: 600; color: #00E5A0;
          text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px;
        }
        .modal-summary-row { font-size: 13px; color: #7A8499; margin-bottom: 3px; }
        .modal-summary-row span { color: #EEF2FF; font-weight: 500; }
        .modal-actions {
          display: flex; gap: 10px; justify-content: flex-end;
          margin-top: 28px; padding-top: 20px;
          border-top: 1px solid #ffffff08;
        }
        .modal-btn-cancel {
          padding: 10px 20px; border-radius: 10px;
          background: transparent; border: 1px solid #ffffff12;
          color: #7A8499; font-size: 14px; font-weight: 500;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }
        .modal-btn-cancel:hover { background: #ffffff08; color: #EEF2FF; }
        .modal-btn-create {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 24px; border-radius: 10px;
          background: #00E5A0; border: none;
          color: #000; font-size: 14px; font-weight: 600;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }
        .modal-btn-create:hover:not(:disabled) { background: #00FFB3; transform: translateY(-1px); }
        .modal-btn-create:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="modal-box">
          <button className="modal-close" onClick={onClose}>
            <XIcon size={16} />
          </button>

          <h3 className="modal-title">Create New Session</h3>

          {/* Problem selection */}
          <div>
            <div className="modal-label">
              Select Problem
              <span className="modal-label-req">*</span>
            </div>
            <select
              className="modal-select"
              value={roomConfig.problem}
              onChange={(e) => {
                const selected = problems.find((p) => p.title === e.target.value);
                setRoomConfig({ difficulty: selected.difficulty, problem: e.target.value });
              }}
            >
              <option value="" disabled>Choose a coding problem...</option>
              {problems.map((p) => (
                <option key={p.id} value={p.title}>
                  {p.title} ({p.difficulty})
                </option>
              ))}
            </select>
          </div>

          {/* Summary */}
          {roomConfig.problem && (
            <div className="modal-summary">
              <div className="modal-summary-icon">
                <Code2Icon size={18} color="#00E5A0" />
              </div>
              <div>
                <div className="modal-summary-title">Room Summary</div>
                <div className="modal-summary-row">Problem: <span>{roomConfig.problem}</span></div>
                <div className="modal-summary-row">Max Participants: <span>2 (1-on-1 session)</span></div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="modal-actions">
            <button className="modal-btn-cancel" onClick={onClose}>Cancel</button>
            <button
              className="modal-btn-create"
              onClick={onCreateRoom}
              disabled={isCreating || !roomConfig.problem}
            >
              {isCreating
                ? <LoaderIcon size={16} style={{ animation: "spin 1s linear infinite" }} />
                : <PlusIcon size={16} />
              }
              {isCreating ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateSessionModal;
