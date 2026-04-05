import { getDifficultyColor } from "../lib/utils";


function ProblemDescription({ problem }) {
  const diffCol = getDifficultyColor(problem.difficulty);

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#0A0C0F', padding: '24px' }}>
      <style>{`
        .pd-title { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; color: #EEF2FF; }
        .pd-diff-badge { font-family: 'Syne', sans-serif; font-size: 11px; padding: 4px 10px; border-radius: 4px; font-weight: 600; text-transform: uppercase; }
        .pd-label { font-size: 11px; color: #7A8499; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; margin: 24px 0 12px; }
        .pd-text { font-size: 14px; color: #A0ABC0; line-height: 1.7; font-weight: 400; }
        .pd-example-box { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 16px; font-family: 'JetBrains Mono', monospace; font-size: 12px; margin-bottom: 16px; }
        .pd-ex-in { color: #00E5A0; margin-bottom: 4px; font-weight: 500; }
        .pd-ex-val { color: #EEF2FF; margin-bottom: 12px; }
        .pd-ex-out { color: #8B7CF6; margin-bottom: 4px; font-weight: 500; }
        .pd-const-box { padding: 4px 0; display: flex; flex-direction: column; gap: 8px; }
        .pd-const-line { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #EEF2FF; background: rgba(255, 255, 255, 0.03); padding: 4px 10px; border-radius: 6px; display: inline-block; border: 1px solid rgba(255, 255, 255, 0.08); }
        .pd-glass-container { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 20px; margin-bottom: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
      `}</style>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <h1 className="pd-title">{problem.title}</h1>
        <span className="pd-diff-badge" style={{ background: diffCol.bg, color: diffCol.text, marginLeft: 'auto' }}>
          {problem.difficulty}
        </span>
      </div>

      <div className="pd-glass-container">
        <p className="pd-text" style={{ marginBottom: problem.description.notes?.length ? '16px' : '0' }}>{problem.description.text}</p>
        
        {problem.description.notes && problem.description.notes.map((note, idx) => (
          <p key={idx} className="pd-text" style={{ marginBottom: idx !== problem.description.notes.length - 1 ? '16px' : '0' }}>{note}</p>
        ))}
      </div>

      {problem.examples && problem.examples.length > 0 && (
        <>
          <div className="pd-label">EXAMPLES</div>
          {problem.examples.map((example, idx) => (
            <div key={idx} className="pd-example-box">
              <div className="pd-ex-in">Input:</div>
              <div className="pd-ex-val">{example.input}</div>
              <div className="pd-ex-out">Output:</div>
              <div className="pd-ex-val">{example.output}</div>
              {example.explanation && (
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', color: '#A0ABC0' }}>
                  <span style={{ color: '#00E5A0', fontWeight: '500' }}>Explanation:</span> {example.explanation}
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {problem.constraints && problem.constraints.length > 0 && (
        <>
          <div className="pd-label">CONSTRAINTS</div>
          <div className="pd-const-box">
            {problem.constraints.map((constraint, idx) => (
              <div key={idx} className="pd-const-line">{constraint}</div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ProblemDescription;
