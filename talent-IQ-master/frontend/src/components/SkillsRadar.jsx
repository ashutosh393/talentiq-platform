import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Color per skill source
const SOURCE_COLOR = {
  resume: '#8B7CF6',  // purple — from profile/resume
  dsa:    '#00E5A0',  // green  — from DSA sessions
};

const MAX_SKILLS = 8;

function SkillsRadar() {
  const [skills, setSkills] = useState([]);   // [{ name, proficiency, source }]
  const [sessionCount, setSessionCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API}/api/interview/skills-radar`, { withCredentials: true })
      .then((res) => {
        setSkills((res.data.skills || []).slice(0, MAX_SKILLS));
        setSessionCount(res.data.sessionCount || 0);
      })
      .catch(() => setSkills([]))
      .finally(() => setLoading(false));
  }, []);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={wrapStyle}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ width: 22, height: 22, border: '2px solid #ffffff10', borderTopColor: '#00E5A0', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────────
  if (skills.length < 3) {
    return (
      <div style={{ ...wrapStyle, border: '1px dashed #ffffff12', flexDirection: 'column', gap: 8, textAlign: 'center', padding: '14px 10px' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#3A4255" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <div style={{ fontSize: 9, color: '#3A4255', lineHeight: 1.6 }}>
          Upload a resume or complete<br/>DSA sessions to build your<br/>skills radar
        </div>
      </div>
    );
  }

  // ── Radar geometry ─────────────────────────────────────────────────────────
  const n = skills.length;
  const cx = 60, cy = 58, r = 34, labelR = r + 20;

  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pt    = (v, i) => [cx + r * v * Math.cos(angle(i)), cy + r * v * Math.sin(angle(i))];
  const lpt   = (i)    => [cx + labelR * Math.cos(angle(i)), cy + labelR * Math.sin(angle(i))];

  const scales = [0.25, 0.5, 0.75, 1.0];

  const polyPoints = (vFn) =>
    skills.map((sk, i) => pt(vFn(sk, i), i).join(',')).join(' ');

  // Full fill polygon using each skill's proficiency
  const fillPoly = polyPoints((sk) => sk.proficiency);
  // Outer grid ring
  const gridPoly = (sc) => skills.map((_, i) => pt(sc, i).join(',')).join(' ');

  return (
    <div style={{ ...wrapStyle, flexDirection: 'column', alignItems: 'center', padding: '10px 10px 8px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 4 }}>
        <div style={{ fontSize: '9px', color: '#7A8499', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>
          Skills Radar
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <LegendDot color={SOURCE_COLOR.resume} label="Profile" />
          <LegendDot color={SOURCE_COLOR.dsa}    label="DSA" />
        </div>
      </div>

      {/* SVG Radar */}
      <svg width="120" height="116" viewBox="0 0 120 116" style={{ overflow: 'visible' }}>
        {/* Grid rings */}
        {scales.map((sc, idx) => (
          <polygon key={idx} points={gridPoly(sc)} fill="none" stroke="#1C2430" strokeWidth="0.7" />
        ))}

        {/* Axis spokes */}
        {skills.map((_, i) => {
          const [x, y] = pt(1, i);
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#1C2430" strokeWidth="0.5" />;
        })}

        {/* Dual-layer fill: one unified polygon per source color would require
            splitting — instead we draw one blended polygon and tint dots by source */}
        <polygon points={fillPoly} fill="#8B7CF608" stroke="#8B7CF640" strokeWidth="1" />

        {/* Per-skill dot colored by source */}
        {skills.map((sk, i) => {
          const [x, y] = pt(sk.proficiency, i);
          const color = SOURCE_COLOR[sk.source] || '#7A8499';
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="3.5" fill={color} opacity="0.9" />
              <circle cx={x} cy={y} r="6" fill={color} opacity="0.12" />
            </g>
          );
        })}

        {/* Labels */}
        {skills.map((sk, i) => {
          const [lx, ly] = lpt(i);
          const label = sk.name.length > 9 ? sk.name.slice(0, 8) + '…' : sk.name;
          const color = SOURCE_COLOR[sk.source] || '#7A8499';
          return (
            <text
              key={i}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="5.5"
              fontFamily="'DM Sans', sans-serif"
              fill={color}
              fontWeight="600"
            >
              {label}
            </text>
          );
        })}
      </svg>

      {/* Chip list */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center', marginTop: 4, width: '100%' }}>
        {skills.map((sk, i) => {
          const color = SOURCE_COLOR[sk.source] || '#7A8499';
          const pct = Math.round(sk.proficiency * 100);
          return (
            <span key={i} style={{
              fontSize: 8, padding: '2px 7px', borderRadius: 10,
              background: color + '12', border: `1px solid ${color}30`,
              color, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3
            }}>
              {sk.name} <span style={{ opacity: 0.6 }}>{pct}%</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function LegendDot({ color, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
      <span style={{ fontSize: 8, color: '#7A8499' }}>{label}</span>
    </div>
  );
}

const wrapStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#111520',
  border: '1px solid #ffffff12',
  borderRadius: '8px',
  height: '100%',
  minHeight: 140,
};

export default SkillsRadar;
