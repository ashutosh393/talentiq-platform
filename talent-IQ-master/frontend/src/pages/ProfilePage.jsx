import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { generateActivityHeatmap, ACHIEVEMENTS } from "../lib/utils";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5001";

// ── Tag color palette (cycles) ────────────────────────────────────────────────
const CHIP_COLORS = [
  { bg: "#00E5A015", border: "#00E5A040", text: "#00E5A0" },
  { bg: "#8B7CF615", border: "#8B7CF640", text: "#8B7CF6" },
  { bg: "#F59E0B15", border: "#F59E0B40", text: "#F59E0B" },
  { bg: "#F8717115", border: "#F8717140", text: "#F87171" },
  { bg: "#38BDF815", border: "#38BDF840", text: "#38BDF8" },
];

function ProfilePage() {
  const { user: clerkUser } = useUser();
  const heatmap = generateActivityHeatmap();
  const colors = ["#1C2430", "#00E5A015", "#00E5A030", "#00E5A060", "#00E5A0"];

  // ── Profile state ────────────────────────────────────────────────────────────
  const [profile, setProfile] = useState({
    name: "Ashutosh Tiwari",
    education: "MCA · HBTU Kanpur",
    bio: "",
    skills: ["MERN", "AI/ML"],
  });
  const [loadingProfile, setLoadingProfile] = useState(true);

  // ── Edit modal state ─────────────────────────────────────────────────────────
  const [showModal, setShowModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", education: "", bio: "", skills: [] });
  const [newSkill, setNewSkill] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Stats (still mocked — real data would come from session/problem APIs)
  const stats = { sessions: 5, solved: 12, rank: "#142" };
  const problems = {
    easy: { solved: 8, total: 20 },
    medium: { solved: 3, total: 20 },
    hard: { solved: 1, total: 10 },
  };
  const achievements = Object.values(ACHIEVEMENTS);

  // ── Load profile from backend ────────────────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API}/api/interview/profile`, { withCredentials: true });
        setProfile({
          name: res.data.name || profile.name,
          education: res.data.education || profile.education,
          bio: res.data.bio || "",
          skills: res.data.skills?.length ? res.data.skills : profile.skills,
        });
      } catch {
        // keep defaults if backend isn't set up yet
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  // ── Initials from name ───────────────────────────────────────────────────────
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // ── Open edit modal ──────────────────────────────────────────────────────────
  const openModal = () => {
    setEditForm({ ...profile });
    setNewSkill("");
    setSaveError("");
    setShowModal(true);
  };

  // ── Skill chip management ────────────────────────────────────────────────────
  const addSkill = () => {
    const s = newSkill.trim();
    if (!s || editForm.skills.includes(s)) return;
    setEditForm((f) => ({ ...f, skills: [...f.skills, s] }));
    setNewSkill("");
  };
  const removeSkill = (skill) => {
    setEditForm((f) => ({ ...f, skills: f.skills.filter((x) => x !== skill) }));
  };

  // ── Save profile ─────────────────────────────────────────────────────────────
  const saveProfile = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const res = await axios.patch(
        `${API}/api/interview/profile`,
        { name: editForm.name, education: editForm.education, bio: editForm.bio, skills: editForm.skills },
        { withCredentials: true }
      );
      setProfile({
        name: res.data.name,
        education: res.data.education,
        bio: res.data.bio,
        skills: res.data.skills,
      });
      setShowModal(false);
    } catch (err) {
      setSaveError(err.response?.data?.message || "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style>{`
        .profile-root { min-height: 100vh; background: #0A0C0F; color: #EEF2FF; font-family: 'DM Sans', sans-serif; padding-bottom: 80px; }
        .profile-container { max-width: 1000px; margin: 0 auto; padding: 24px; }
        .prof-grid { display: grid; grid-template-columns: 300px 1fr; gap: 24px; align-items: start; }
        .p-card { background: #0D1117; border: 1px solid #ffffff12; border-radius: 12px; padding: 22px; margin-bottom: 16px; }
        .p-card-label { font-size: 10px; color: #7A8499; text-transform: uppercase; letter-spacing: .07em; font-weight: 600; margin-bottom: 14px; }
        
        .p-avatar { width: 64px; height: 64px; border-radius: 50%; background: #00E5A015; border: 2px solid #00E5A040; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; color: #00E5A0; font-family: 'Syne', sans-serif; margin: 0 auto 12px; }
        .p-name { font-size: 18px; font-weight: 700; text-align: center; margin-bottom: 4px; font-family: 'Syne', sans-serif; }
        .p-edu { font-size: 12px; color: #7A8499; text-align: center; margin-bottom: 6px; }
        .p-bio { font-size: 12px; color: #5A6275; text-align: center; line-height: 1.5; margin-bottom: 12px; max-width: 220px; margin-left: auto; margin-right: auto; }
        .p-skills { display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; margin-bottom: 14px; }
        .p-tag { font-size: 10px; padding: 3px 10px; border-radius: 20px; font-weight: 600; border: 1px solid transparent; }
        
        .btn-edit { width: 100%; padding: 9px; background: transparent; border: 1px solid #ffffff20; border-radius: 8px; color: #EEF2FF; font-size: 13px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .btn-edit:hover { background: #161C28; border-color: #8B7CF660; color: #8B7CF6; }
        
        .ach-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .ach-box { border-radius: 8px; padding: 10px; text-align: center; background: #ffffff05; border: 1px solid #ffffff10; transition: 0.15s; }
        .ach-box:hover { transform: translateY(-1px); }
        .ach-icon { font-size: 22px; margin-bottom: 4px; }
        .ach-label { font-size: 10px; font-weight: 600; }
        
        .stats-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 16px; }
        .s-card { background: #0D1117; border: 1px solid #ffffff12; border-radius: 12px; padding: 18px; text-align: center; }
        .s-val { font-size: 26px; font-weight: 700; font-family: 'JetBrains Mono', monospace; margin-bottom: 4px; }
        
        .hm-grid { display: flex; gap: 3px; flex-wrap: wrap; }
        .hm-cell { width: 14px; height: 14px; border-radius: 3px; }
        
        .prog-item { margin-bottom: 14px; }
        .prog-item:last-child { margin-bottom: 0; }
        .prog-top { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 11px; font-weight: 600; }
        .prog-bar-bg { height: 6px; background: #161C28; border-radius: 3px; overflow: hidden; }
        .prog-bar-fill { height: 100%; border-radius: 3px; transition: width 0.6s ease; }
        
        /* ── Edit Modal ── */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.15s ease; }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        .modal-box { background: #0D1117; border: 1px solid #ffffff18; border-radius: 16px; padding: 28px; width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; animation: slideUp 0.2s ease; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        .modal-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; margin-bottom: 4px; }
        .modal-sub { font-size: 12px; color: #7A8499; margin-bottom: 22px; }
        .field-label { font-size: 11px; color: #7A8499; text-transform: uppercase; letter-spacing: .06em; font-weight: 600; margin-bottom: 6px; }
        .field-input { width: 100%; background: #111520; border: 1px solid #ffffff18; border-radius: 8px; padding: 10px 14px; font-size: 13px; color: #EEF2FF; outline: none; font-family: 'DM Sans', sans-serif; transition: 0.2s; box-sizing: border-box; }
        .field-input:focus { border-color: #8B7CF6; }
        .field-group { margin-bottom: 18px; }
        .skills-edit-area { display: flex; flex-wrap: wrap; gap: 7px; min-height: 40px; background: #111520; border: 1px solid #ffffff18; border-radius: 8px; padding: 8px 10px; margin-bottom: 8px; }
        .skill-edit-chip { display: flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; border: 1px solid transparent; cursor: default; }
        .skill-remove { background: none; border: none; cursor: pointer; color: inherit; font-size: 14px; line-height: 1; padding: 0; opacity: 0.6; transition: 0.15s; }
        .skill-remove:hover { opacity: 1; }
        .skill-add-row { display: flex; gap: 8px; }
        .skill-add-input { flex: 1; background: #111520; border: 1px solid #ffffff18; border-radius: 8px; padding: 9px 12px; font-size: 13px; color: #EEF2FF; outline: none; font-family: 'DM Sans', sans-serif; }
        .skill-add-input:focus { border-color: #8B7CF6; }
        .btn-add-skill { padding: 9px 14px; background: #8B7CF620; border: 1px solid #8B7CF640; border-radius: 8px; color: #8B7CF6; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: 0.2s; white-space: nowrap; }
        .btn-add-skill:hover { background: #8B7CF630; }
        .modal-actions { display: flex; gap: 10px; margin-top: 24px; }
        .btn-save { flex: 1; padding: 12px; background: #8B7CF6; border: none; border-radius: 8px; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: 0.2s; }
        .btn-save:hover:not(:disabled) { background: #9D8FF7; }
        .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-cancel { padding: 12px 18px; background: transparent; border: 1px solid #ffffff18; border-radius: 8px; color: #7A8499; font-size: 14px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: 0.2s; }
        .btn-cancel:hover { background: #161C28; color: #EEF2FF; }
        .save-err { background: #F8717115; border: 1px solid #F8717140; border-radius: 8px; padding: 10px 14px; font-size: 12px; color: #F87171; margin-top: 12px; }

        @media(max-width:768px){ .prof-grid { grid-template-columns: 1fr; } .stats-row { grid-template-columns: 1fr 1fr; } }
      `}</style>

      <div className="profile-root">
        <Navbar />

        <div className="profile-container">
          <div className="prof-grid">
            {/* ── Left Column ── */}
            <div>
              <div className="p-card">
                <div className="p-avatar">{initials}</div>
                <div className="p-name">{profile.name}</div>
                <div className="p-edu">{profile.education || "—"}</div>
                {profile.bio && <div className="p-bio">{profile.bio}</div>}
                <div className="p-skills">
                  {profile.skills.map((s, i) => {
                    const c = CHIP_COLORS[i % CHIP_COLORS.length];
                    return (
                      <span key={s} className="p-tag" style={{ background: c.bg, borderColor: c.border, color: c.text }}>
                        {s}
                      </span>
                    );
                  })}
                </div>
                <button className="btn-edit" onClick={openModal}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Edit Profile
                </button>
              </div>

              <div className="p-card">
                <div className="p-card-label">Achievements</div>
                <div className="ach-grid">
                  {achievements.map((ach) => (
                    <div key={ach.id} className="ach-box" style={{ background: ach.color + "10", borderColor: ach.color + "25" }}>
                      <div className="ach-icon">{ach.icon}</div>
                      <div className="ach-label" style={{ color: ach.color }}>{ach.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right Column ── */}
            <div>
              <div className="stats-row">
                <div className="s-card">
                  <div className="s-val" style={{ color: "#00E5A0" }}>{stats.sessions}</div>
                  <div className="p-card-label" style={{ marginBottom: 0 }}>Sessions</div>
                </div>
                <div className="s-card">
                  <div className="s-val" style={{ color: "#F59E0B" }}>{stats.solved}</div>
                  <div className="p-card-label" style={{ marginBottom: 0 }}>Solved</div>
                </div>
                <div className="s-card">
                  <div className="s-val" style={{ color: "#8B7CF6" }}>{stats.rank}</div>
                  <div className="p-card-label" style={{ marginBottom: 0 }}>Rank</div>
                </div>
              </div>

              <div className="p-card" style={{ marginBottom: 16 }}>
                <div className="p-card-label">Activity — last 30 days</div>
                <div className="hm-grid">
                  {heatmap.map((val, idx) => (
                    <div key={idx} className="hm-cell" style={{ background: colors[val] }} />
                  ))}
                </div>
              </div>

              <div className="p-card">
                <div className="p-card-label">Problems</div>
                <div className="prog-item">
                  <div className="prog-top">
                    <span style={{ color: "#00E5A0" }}>Easy</span>
                    <span style={{ color: "#7A8499" }}>{problems.easy.solved}/{problems.easy.total}</span>
                  </div>
                  <div className="prog-bar-bg">
                    <div className="prog-bar-fill" style={{ width: `${(problems.easy.solved / problems.easy.total) * 100}%`, background: "#00E5A0" }} />
                  </div>
                </div>
                <div className="prog-item">
                  <div className="prog-top">
                    <span style={{ color: "#F59E0B" }}>Medium</span>
                    <span style={{ color: "#7A8499" }}>{problems.medium.solved}/{problems.medium.total}</span>
                  </div>
                  <div className="prog-bar-bg">
                    <div className="prog-bar-fill" style={{ width: `${(problems.medium.solved / problems.medium.total) * 100}%`, background: "#F59E0B" }} />
                  </div>
                </div>
                <div className="prog-item">
                  <div className="prog-top">
                    <span style={{ color: "#F87171" }}>Hard</span>
                    <span style={{ color: "#7A8499" }}>{problems.hard.solved}/{problems.hard.total}</span>
                  </div>
                  <div className="prog-bar-bg">
                    <div className="prog-bar-fill" style={{ width: `${(problems.hard.solved / problems.hard.total) * 100}%`, background: "#F87171" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* EDIT PROFILE MODAL                                                    */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box">
            <div className="modal-title">Edit Profile</div>
            <div className="modal-sub">Update your name, education, bio and skills</div>

            {/* Name */}
            <div className="field-group">
              <div className="field-label">Full Name</div>
              <input
                className="field-input"
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Your full name"
              />
            </div>

            {/* Education */}
            <div className="field-group">
              <div className="field-label">Education</div>
              <input
                className="field-input"
                value={editForm.education}
                onChange={(e) => setEditForm((f) => ({ ...f, education: e.target.value }))}
                placeholder="e.g. MCA · HBTU Kanpur"
              />
            </div>

            {/* Bio */}
            <div className="field-group">
              <div className="field-label">Bio <span style={{ color: "#3A4255", fontWeight: 400 }}>(optional)</span></div>
              <textarea
                className="field-input"
                value={editForm.bio}
                onChange={(e) => setEditForm((f) => ({ ...f, bio: e.target.value }))}
                placeholder="A short intro about yourself..."
                rows={3}
                style={{ resize: "vertical", minHeight: 72 }}
              />
            </div>

            {/* Skills */}
            <div className="field-group">
              <div className="field-label">Skills</div>
              <div className="skills-edit-area">
                {editForm.skills.map((s, i) => {
                  const c = CHIP_COLORS[i % CHIP_COLORS.length];
                  return (
                    <span key={s} className="skill-edit-chip" style={{ background: c.bg, borderColor: c.border, color: c.text }}>
                      {s}
                      <button className="skill-remove" onClick={() => removeSkill(s)} title="Remove">×</button>
                    </span>
                  );
                })}
                {editForm.skills.length === 0 && (
                  <span style={{ fontSize: 12, color: "#3A4255" }}>No skills added yet</span>
                )}
              </div>
              <div className="skill-add-row">
                <input
                  className="skill-add-input"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSkill()}
                  placeholder="Add a skill (e.g. React, Python)"
                />
                <button className="btn-add-skill" onClick={addSkill}>+ Add</button>
              </div>
            </div>

            {saveError && <div className="save-err">⚠ {saveError}</div>}

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-save" onClick={saveProfile} disabled={saving || !editForm.name.trim()}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProfilePage;
