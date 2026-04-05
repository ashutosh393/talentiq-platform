import { Link } from "react-router";
import { useState, useEffect } from "react";
import axiosInstance from "../lib/axios";
import Navbar from "../components/Navbar";
import { PROBLEMS } from "../data/problems";
import { getDifficultyColor } from "../lib/utils";

import { GoogleIcon, AmazonIcon, MicrosoftIcon, MetaIcon, AppleIcon } from "../components/CompanyIcons";

const COMPANIES = [
  { name: "Google", icon: <GoogleIcon size={12} /> },
  { name: "Amazon", icon: <AmazonIcon size={12} /> },
  { name: "Microsoft", icon: <MicrosoftIcon size={12} /> },
  { name: "Meta", icon: <MetaIcon size={12} /> },
  { name: "Apple", icon: <AppleIcon size={12} /> }
];

function ProblemsPage() {
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState("All");
  const [activeCompanies, setActiveCompanies] = useState([]);
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axiosInstance.get("/problems");
        if (response.data) {
          setProblems(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch problems:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProblems();
  }, []);

  // Mock solved logic (assume problem 1 is solved)
  const isSolved = (id) => id === "1" || id === 1;

  const toggleCompany = (companyName) => {
    setActiveCompanies(prev => 
      prev.includes(companyName) ? prev.filter(c => c !== companyName) : [...prev, companyName]
    );
  };

  const filteredProblems = problems.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchDiff = diffFilter === "All" || p.difficulty === diffFilter;
    const matchCompany = activeCompanies.length === 0 || activeCompanies.includes("Google"); 
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
            {isLoading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#7A8499' }}>Loading problems dynamically from Database engine...</div>
            ) : filteredProblems.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#7A8499' }}>No problems match your filters.</div>
            ) : (
              filteredProblems.map((p, idx) => {
                const diffCol = getDifficultyColor(p.difficulty);
                const solved = isSolved(p.id);
                return (
                  <Link key={p.id} to={`/problem/${p.id}`} className="problem-row">
                    <span className="pr-number">#{p.id || idx + 1}</span>
                    <span className="pr-title">{p.title}</span>
                    <div className="pr-logos">
                      {idx % 2 === 0 ? COMPANIES[0].icon : null}
                      {idx % 3 === 0 ? COMPANIES[1].icon : null}
                      {idx % 5 === 0 ? COMPANIES[2].icon : null}
                    </div>
                    <span className="pr-diff" style={{ background: diffCol.bg, color: diffCol.text }}>{p.difficulty}</span>
                    <span className="pr-status">{solved ? 'Solved ✓' : 'Try →'}</span>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProblemsPage;
