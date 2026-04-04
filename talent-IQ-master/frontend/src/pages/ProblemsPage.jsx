import { Link } from "react-router";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { PROBLEMS } from "../data/problems";
import { getDifficultyColor } from "../lib/utils";

const COMPANIES = [
  { name: "Google", icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> },
  { name: "Amazon", icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="#FF9900"><path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595.226-.088.39.02.294.224C19.757 21.02 18.47 22.5 16.5 23.5c-1.145.39-2.34.59-3.585.59-2.423 0-4.686-.62-6.79-1.858A11.94 11.94 0 01.045 18.02z"/></svg> },
  { name: "Microsoft", icon: <svg width="10" height="10" viewBox="0 0 24 24"><path fill="#F25022" d="M1 1h10v10H1z"/><path fill="#7FBA00" d="M13 1h10v10H13z"/><path fill="#00A4EF" d="M1 13h10v10H1z"/><path fill="#FFB900" d="M13 13h10v10H13z"/></svg> },
  { name: "Meta", icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> }
];

function ProblemsPage() {
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState("All");
  const [activeCompanies, setActiveCompanies] = useState([]);

  // Mock solved logic (assume problem 1 is solved)
  const isSolved = (id) => id === "1" || id === 1;

  const toggleCompany = (companyName) => {
    setActiveCompanies(prev => 
      prev.includes(companyName) ? prev.filter(c => c !== companyName) : [...prev, companyName]
    );
  };

  const problems = Object.values(PROBLEMS).filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchDiff = diffFilter === "All" || p.difficulty === diffFilter;
    // Basic company match simulation for frontend preview: just say meta on even, google on odd, or if problem has tags map them.
    const matchCompany = activeCompanies.length === 0 || activeCompanies.includes("Google"); // Simplified for dummy display
    return matchSearch && matchDiff && matchCompany;
  });

  return (
    <>
      <style>{`
        .prob-root { min-height: 100vh; background: #0A0C0F; color: #EEF2FF; font-family: 'DM Sans', sans-serif; padding-bottom: 80px; }
        .prob-container { max-width: 900px; margin: 0 auto; padding: 24px; }
        .search-row { display: flex; gap: 8px; margin-bottom: 16px; }
        .search-input { flex: 1; background: #0D1117; border: 1px solid #ffffff12; border-radius: 6px; padding: 10px 14px; font-size: 14px; color: #EEF2FF; outline: none; }
        .search-input:focus { border-color: #00E5A0; }
        .filter-btn-group { display: flex; gap: 6px; }
        .filter-btn { padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; border: none; }
        .filter-btn-active { background: #00E5A0; color: #000; }
        .filter-btn-inactive { background: transparent; border: 1px solid #ffffff12; color: #7A8499; }
        .filter-btn-inactive:hover { background: #161C28; color: #EEF2FF; }
        
        .companies-row { display: flex; gap: 6px; margin-bottom: 24px; flex-wrap: wrap; }
        .company-btn { display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; transition: all 0.2s; border: 1px solid #ffffff12; background: transparent; color: #7A8499; }
        .company-btn:hover { background: #161C28; border-color: #ffffff20; }
        .company-btn-active { background: #161C28; border-color: #00E5A050; color: #00E5A0; }
        
        .problems-col { display: flex; flex-direction: column; gap: 8px; }
        .problem-row { background: #111520; border: 1px solid #ffffff08; border-radius: 8px; padding: 16px 20px; display: flex; align-items: center; gap: 16px; text-decoration: none; color: #EEF2FF; transition: all 0.2s; }
        .problem-row:hover { background: #161C28; border-color: #ffffff20; transform: translateX(2px); }
        .pr-number { font-size: 12px; color: #7A8499; font-family: 'JetBrains Mono', monospace; min-width: 30px; }
        .pr-title { font-size: 15px; flex: 1; font-weight: 500; }
        .pr-logos { display: flex; gap: 6px; }
        .pr-diff { font-size: 11px; padding: 4px 10px; border-radius: 4px; font-weight: 500; }
        .pr-status { font-size: 12px; color: #7A8499; min-width: 60px; text-align: right; }
      `}</style>
      
      <div className="prob-root">
        <Navbar />
        
        <div className="prob-container">
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontFamily: 'Syne', fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>Problems</h1>
            <p style={{ color: '#7A8499', fontSize: '14px' }}>Search and filter curated coding challenges</p>
          </div>

          <div className="search-row">
            <input 
              type="text" 
              placeholder="Search problems..." 
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="filter-btn-group">
              {['All', 'Easy', 'Medium', 'Hard'].map(d => (
                <button 
                  key={d}
                  className={`filter-btn ${diffFilter === d ? 'filter-btn-active' : 'filter-btn-inactive'}`}
                  onClick={() => setDiffFilter(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="companies-row">
            <button 
              className={`filter-btn ${activeCompanies.length === 0 ? 'filter-btn-active' : 'filter-btn-inactive'}`}
              style={{ padding: '6px 12px', fontSize: '12px' }}
              onClick={() => setActiveCompanies([])}
            >
              All
            </button>
            {COMPANIES.map(c => (
              <button 
                key={c.name}
                className={`company-btn ${activeCompanies.includes(c.name) ? 'company-btn-active' : ''}`}
                onClick={() => toggleCompany(c.name)}
              >
                {c.icon} {c.name}
              </button>
            ))}
          </div>

          <div className="problems-col">
            {problems.map((p, idx) => {
              const diffCol = getDifficultyColor(p.difficulty);
              const solved = isSolved(p.id);
              return (
                <Link key={p.id} to={`/problem/${p.id}`} className="problem-row">
                  <span className="pr-number">#{p.id}</span>
                  <span className="pr-title">{p.title}</span>
                  <div className="pr-logos">
                    {/* Display mock logos for visual presentation */}
                    {idx % 2 === 0 ? COMPANIES[0].icon : null}
                    {idx % 3 === 0 ? COMPANIES[1].icon : null}
                    {idx % 5 === 0 ? COMPANIES[2].icon : null}
                  </div>
                  <span className="pr-diff" style={{ background: diffCol.bg, color: diffCol.text }}>{p.difficulty}</span>
                  <span className="pr-status">{solved ? 'Solved ✓' : 'Try →'}</span>
                </Link>
              );
            })}
            
            {problems.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: '#7A8499' }}>No problems match your filters.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProblemsPage;
