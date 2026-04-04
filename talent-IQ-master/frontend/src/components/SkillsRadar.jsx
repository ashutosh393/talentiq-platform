import React from 'react';

function SkillsRadar() {
  const skills = [0.88, 0.42, 0.74, 0.65, 0.82];
  const n = skills.length;
  const cx = 35;
  const cy = 35;
  const r = 26;

  const pt = (v, i, sc = 1) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + r * v * sc * Math.cos(a), cy + r * v * sc * Math.sin(a)];
  };

  const scales = [0.25, 0.5, 0.75, 1];
  
  const fillPoints = skills.map((s, i) => pt(s, i).join(',')).join(' ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#111520', border: '1px solid #ffffff12', borderRadius: '8px', padding: '10px 12px', height: '100%' }}>
      <div style={{ fontSize: '9px', color: '#7A8499', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '6px', fontWeight: 500, alignSelf: 'flex-start' }}>Skills</div>
      <svg width="70" height="70" viewBox="0 0 70 70">
        {scales.map((s, idx) => {
          const pts = skills.map((_, i) => pt(1, i, s).join(',')).join(' ');
          return (
            <polygon key={idx} points={pts} fill="none" stroke="#1C2430" strokeWidth="0.8" />
          );
        })}
        <polygon points={fillPoints} fill="#00E5A010" stroke="#00E5A0" strokeWidth="1.5" />
        {skills.map((s, i) => {
          const [x, y] = pt(s, i);
          return <circle key={i} cx={x} cy={y} r="2.5" fill="#00E5A0" />;
        })}
      </svg>
    </div>
  );
}

export default SkillsRadar;
