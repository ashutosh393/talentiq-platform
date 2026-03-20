import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

const GoogleIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);
const AmazonIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#FF9900">
    <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39.02.294.224-.505 1.096-1.247 2.05-2.224 2.86a9.76 9.76 0 01-3.01 1.71c-1.145.39-2.34.59-3.585.59-2.423 0-4.686-.62-6.79-1.858a11.94 11.94 0 01-5.06-5.54c-.083-.186-.047-.31.1-.266z"/>
    <path d="M20.023 15.613c-.148-.21-.461-.24-.94-.09l-.174.06c-1.248.434-2.556.651-3.926.651-2.204 0-4.136-.602-5.8-1.806-1.664-1.204-2.82-2.855-3.47-4.953-.148-.486-.26-.98-.334-1.484C5.305 7.488 5.44 7.92 5.44 7.41c0-1.248.217-2.413.65-3.493.435-1.08 1.063-2.02 1.884-2.82.82-.8 1.795-1.42 2.925-1.86C11.03.8 12.256.58 13.58.58c1.203 0 2.31.198 3.322.593 1.01.396 1.898.95 2.664 1.66.766.71 1.37 1.554 1.812 2.534.44.98.66 2.04.66 3.18 0 1.084-.177 2.1-.53 3.047-.352.947-.848 1.79-1.488 2.527-.077.09-.085.185-.024.284l2.05 2.99c.082.117.068.233-.04.347z"/>
  </svg>
);
const MicrosoftIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path fill="#F25022" d="M1 1h10v10H1z"/>
    <path fill="#7FBA00" d="M13 1h10v10H13z"/>
    <path fill="#00A4EF" d="M1 13h10v10H1z"/>
    <path fill="#FFB900" d="M13 13h10v10H13z"/>
  </svg>
);
const MetaIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
const AppleIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="var(--text2)">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

const problems = [
  { id: 1, num: "#1",   diff: "easy",   title: "Two Sum",                                          tags: ["Array","Hashmap"],         icons: [<GoogleIcon/>,<AmazonIcon/>],    extra: "+5 companies", companies: "google amazon all" },
  { id: 2, num: "#3",   diff: "medium", title: "Longest Substring Without Repeating Characters",   tags: ["String","Sliding Window"],  icons: [<AmazonIcon/>,<MicrosoftIcon/>], extra: "+3 companies", companies: "amazon microsoft all" },
  { id: 3, num: "#15",  diff: "medium", title: "3Sum",                                             tags: ["Array","Two Pointers"],     icons: [<GoogleIcon/>,<MetaIcon/>],      extra: "+2 companies", companies: "google meta all" },
  { id: 4, num: "#42",  diff: "hard",   title: "Trapping Rain Water",                              tags: ["Stack","DP"],               icons: [<AmazonIcon/>,<AppleIcon/>],     extra: "+2 companies", companies: "amazon apple all" },
  { id: 5, num: "#200", diff: "medium", title: "Number of Islands",                                tags: ["Graph","BFS/DFS"],          icons: [<GoogleIcon/>,<MicrosoftIcon/>], extra: "+4 companies", companies: "google microsoft all" },
  { id: 6, num: "#206", diff: "easy",   title: "Reverse Linked List",                              tags: ["Linked List","Recursion"],  icons: [<MetaIcon/>,<AmazonIcon/>],      extra: "+3 companies", companies: "meta amazon all" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const subRef = useRef(null);
  const [nlName, setNlName]       = useState("");
  const [nlEmail, setNlEmail]     = useState("");
  const [nlRole, setNlRole]       = useState("");
  const [nlSuccess, setNlSuccess] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [activeCompany, setActiveCompany] = useState("all");
  const [counters, setCounters] = useState({ users: "0+", problems: "0+", sessions: "0+", satisfaction: "0%" });
  const [trendBars, setTrendBars] = useState(false);

  /* ── all DOM-level effects ── */
  useEffect(() => {
    /* cursor */
    const cur  = document.getElementById("cur");
    const ring = document.getElementById("cur-ring");
    let mx = 0, my = 0, rx = 0, ry = 0;
    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      if (cur)  { cur.style.left  = mx + "px"; cur.style.top  = my + "px"; }
      const spot = document.getElementById("spotlight");
      if (spot) { spot.style.left = mx + "px"; spot.style.top = my + "px"; }
    };
    document.addEventListener("mousemove", onMove);
    const animRing = () => {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      if (ring) { ring.style.left = rx + "px"; ring.style.top = ry + "px"; }
      requestAnimationFrame(animRing);
    };
    animRing();

    /* hover class */
    const hoverEls = document.querySelectorAll("button, .nav-link, .feat, .step");
    const addH = () => document.body.classList.add("hovering");
    const remH = () => document.body.classList.remove("hovering");
    hoverEls.forEach(el => { el.addEventListener("mouseenter", addH); el.addEventListener("mouseleave", remH); });

    /* hidden-code spotlight */
    const hiddenEls = document.querySelectorAll("[data-hidden='true']");
    const onSpot = (e) => {
      hiddenEls.forEach(el => {
        const er   = el.getBoundingClientRect();
        const cx   = er.left + er.width  / 2;
        const cy   = er.top  + er.height / 2;
        const dist = Math.sqrt((e.clientX - cx) ** 2 + (e.clientY - cy) ** 2);
        const rad  = 220;
        if (dist < rad) {
          const s = Math.pow(1 - dist / rad, 0.5);
          el.style.opacity    = Math.min(1, 0.05 + s * 0.95);
          el.style.textShadow = `0 0 ${Math.round(s * 20)}px rgba(0,229,160,${(s * 0.7).toFixed(2)})`;
          el.style.transform  = `translateX(${s * 2}px)`;
        } else {
          el.style.opacity    = "0.05";
          el.style.textShadow = "none";
          el.style.transform  = "translateX(0)";
        }
      });
    };
    document.addEventListener("mousemove", onSpot);

    /* typing */
    const text = "Practice real interview problems in live 1-on-1 sessions. Video, chat, and a shared code editor — no external tools needed.";
    if (subRef.current) {
      subRef.current.textContent = "";
      let i = 0;
      const type = () => {
        if (subRef.current && i < text.length) {
          subRef.current.textContent += text[i++];
          setTimeout(type, 18);
        }
      };
      setTimeout(type, 900);
    }

    /* particles */
    const pc = document.getElementById("particles");
    if (pc && pc.childElementCount === 0) {
      for (let i = 0; i < 18; i++) {
        const p = document.createElement("div");
        p.className = "particle";
        p.style.cssText = `left:${Math.random()*100}%;animation-duration:${6+Math.random()*10}s;animation-delay:${Math.random()*8}s;--drift:${(Math.random()-.5)*100}px;opacity:0;width:${1+Math.random()*2}px;height:${1+Math.random()*2}px;`;
        pc.appendChild(p);
      }
    }

    /* counter animation */
    const counterDefs = [
      { key: "users",        target: 2400,  suffix: "+"  },
      { key: "problems",     target: 50,    suffix: "+"  },
      { key: "sessions",     target: 12000, suffix: "+"  },
      { key: "satisfaction", target: 98,    suffix: "%"  },
    ];
    const cEls = document.querySelectorAll("[data-counter]");
    const cobs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const key  = entry.target.dataset.counter;
        const def  = counterDefs.find(d => d.key === key);
        if (!def) return;
        let cur2 = 0;
        const step = def.target / 60;
        const t = setInterval(() => {
          cur2 = Math.min(cur2 + step, def.target);
          setCounters(prev => ({ ...prev, [key]: Math.floor(cur2).toLocaleString() + def.suffix }));
          if (cur2 >= def.target) clearInterval(t);
        }, 25);
        cobs.unobserve(entry.target);
      });
    });
    cEls.forEach(c => cobs.observe(c));

    /* fade-up */
    const fus  = document.querySelectorAll(".fu");
    const fobs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add("vis"), 80);
          fobs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    fus.forEach(f => fobs.observe(f));

    /* trend bars */
    const trendEl = document.querySelector(".trend-section");
    if (trendEl) {
      const tobs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) { setTrendBars(true); tobs.disconnect(); }
      }, { threshold: 0.1 });
      tobs.observe(trendEl);
    }

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousemove", onSpot);
      hoverEls.forEach(el => { el.removeEventListener("mouseenter", addH); el.removeEventListener("mouseleave", remH); });
    };
  }, []);

  const scrollToProblems = () =>
    document.getElementById("problems-section")?.scrollIntoView({ behavior: "smooth" });

  const handleNewsletterSubmit = () => {
    if (!nlEmail || !nlEmail.includes("@")) {
      setEmailError(true);
      setTimeout(() => setEmailError(false), 2000);
      return;
    }
    setTimeout(() => {
      setNlSuccess(true);
      const subject = encodeURIComponent("Welcome to TalentIQ Weekly!");
      const body    = encodeURIComponent(`Hi ${nlName || "there"},\n\nWelcome to TalentIQ Weekly! 🎉\n\nYour first edition lands this Monday.\n\nHappy coding!\nTalentIQ Team\nhttps://www.talentiq.live`);
      window.location.href = `mailto:${nlEmail}?subject=${subject}&body=${body}`;
    }, 900);
  };

  const filteredProblems = problems.filter(p =>
    activeCompany === "all" || p.companies.includes(activeCompany)
  );

  return (
    <>
      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=JetBrains+Mono:wght@400;500;600&display=swap');
        :root{--green:#00E5A0;--green-dark:#00A36B;--green-glow:#00E5A022;--green-border:#00E5A025;--bg:#080A0D;--bg2:#0C0F13;--surface:#111520;--surface2:#161C28;--border:#ffffff08;--border2:#ffffff12;--border3:#ffffff20;--text:#EEF2FF;--text2:#7A8499;--text3:#3A4255;--purple:#8B7CF6;--amber:#F59E0B;--blue:#60A5FA;}
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);overflow-x:hidden;cursor:none;min-height:100vh;}
        body::after{content:'';position:fixed;inset:0;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");pointer-events:none;z-index:0;opacity:.35;}

        /* CURSOR */
        #cur{width:8px;height:8px;background:var(--green);border-radius:50%;position:fixed;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:width .15s,height .15s,background .15s;mix-blend-mode:screen;}
        #cur-ring{width:32px;height:32px;border:1.5px solid var(--green);border-radius:50%;position:fixed;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);opacity:.45;transition:width .25s,height .25s,opacity .25s,border-color .25s;}
        body.hovering #cur{width:14px;height:14px;background:#fff;}
        body.hovering #cur-ring{width:50px;height:50px;opacity:.2;border-color:#fff;}
        #spotlight{position:fixed;width:300px;height:300px;border-radius:50%;pointer-events:none;z-index:5;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(0,229,160,.06) 0%,transparent 70%);}

        /* NAV */
        nav{display:flex;align-items:center;justify-content:space-between;padding:18px 64px;border-bottom:1px solid var(--border);position:sticky;top:0;background:rgba(8,10,13,.85);backdrop-filter:blur(24px);z-index:100;animation:slideDown .6s ease both;}
        @keyframes slideDown{from{transform:translateY(-100%);opacity:0}to{transform:translateY(0);opacity:1}}
        .logo{display:flex;align-items:center;gap:12px;}
        .logo-mark{width:38px;height:38px;background:var(--green);border-radius:10px;display:flex;align-items:center;justify-content:center;transition:transform .3s,box-shadow .3s;cursor:pointer;}
        .logo-mark:hover{transform:rotate(12deg) scale(1.1);box-shadow:0 0 20px var(--green-glow);}
        .logo-name{font-family:'Syne',sans-serif;font-size:19px;font-weight:800;letter-spacing:-.5px;}
        .logo-sub{font-size:10px;color:var(--text3);font-weight:300;}
        .nav-links{display:flex;align-items:center;gap:36px;}
        .nav-link{font-size:14px;color:var(--text2);cursor:pointer;position:relative;padding-bottom:2px;transition:color .2s;}
        .nav-link::after{content:'';position:absolute;bottom:0;left:0;width:0;height:1px;background:var(--green);transition:width .2s;}
        .nav-link:hover{color:var(--text);}
        .nav-link:hover::after{width:100%;}
        .nav-btns{display:flex;gap:8px;}
        .btn-ghost{padding:8px 18px;border:1px solid var(--border2);border-radius:8px;background:transparent;color:var(--text2);font-size:13px;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s;}
        .btn-ghost:hover{border-color:var(--border3);color:var(--text);background:var(--surface);}
        .btn-green{padding:8px 18px;border:none;border-radius:8px;background:var(--green);color:#000;font-size:13px;font-weight:500;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s;}
        .btn-green:hover{background:#00FFB3;transform:translateY(-1px);box-shadow:0 8px 24px var(--green-glow);}

        /* HERO */
        .hero{min-height:92vh;display:grid !important;grid-template-columns:1fr 1fr !important;align-items:center;gap:60px;padding:80px 64px;position:relative;overflow:hidden;width:100%;max-width:100vw;box-sizing:border-box;}
        .hero-grid-bg{position:absolute;inset:0;background-image:linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px);background-size:64px 64px;mask-image:radial-gradient(ellipse 70% 80% at 30% 50%,black 20%,transparent 80%);pointer-events:none;}
        .hero-orb{position:absolute;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,#00E5A008 0%,transparent 60%);top:50%;left:25%;transform:translate(-50%,-50%);pointer-events:none;animation:orbPulse 6s ease-in-out infinite;}
        @keyframes orbPulse{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:1}50%{transform:translate(-50%,-50%) scale(1.2);opacity:.6}}
        .hero-left{position:relative;z-index:2;min-width:0 !important;max-width:100%;overflow:hidden;word-break:break-word;}
        .pill{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--green-border);background:var(--green-glow);color:var(--green);font-size:12px;padding:5px 14px 5px 8px;border-radius:100px;margin-bottom:28px;font-weight:500;animation:fadeUp .8s .2s both;}
        .pill-dot{width:6px;height:6px;background:var(--green);border-radius:50%;animation:blink 1.5s infinite;flex-shrink:0;}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}
        h1{font-family:'Syne',sans-serif;font-size:58px;font-weight:800;line-height:1.05;letter-spacing:-2.5px;margin-bottom:24px;animation:fadeUp .8s .35s both;}
        h1 em{font-style:normal;color:var(--green);position:relative;display:inline-block;}
        h1 em svg{position:absolute;bottom:-6px;left:0;width:100%;height:6px;overflow:visible;}
        .hero-sub{font-size:17px;color:var(--text2);line-height:1.75;max-width:460px;margin-bottom:40px;font-weight:300;animation:fadeUp .8s .5s both;min-height:60px;}
        .hero-actions{display:flex;align-items:center;gap:12px;margin-bottom:52px;animation:fadeUp .8s .65s both;}
        .btn-hero{padding:13px 28px;border-radius:10px;font-size:15px;font-weight:500;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .25s;display:flex;align-items:center;gap:8px;border:none;}
        .btn-hp{background:var(--green);color:#000;}
        .btn-hp:hover{background:#00FFB3;transform:translateY(-2px);box-shadow:0 12px 32px var(--green-glow);}
        .btn-hs{background:transparent;color:var(--text);border:1px solid var(--border2);}
        .btn-hs:hover{background:var(--surface);transform:translateY(-2px);}
        .hero-stats{display:flex;gap:32px;animation:fadeUp .8s .8s both;}
        .hstat-num{font-family:'Syne',sans-serif;font-size:26px;font-weight:700;color:var(--green);}
        .hstat-label{font-size:12px;color:var(--text3);font-weight:300;margin-top:2px;}
        .hstat-div{width:1px;background:var(--border2);}
        .hero-section-tag{display:flex;align-items:center;gap:16px;margin-bottom:48px;animation:fadeUp .8s .95s both;}
        .hst-item{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text3);}
        .hst-div{width:1px;height:14px;background:var(--border2);}

        /* TERMINAL */
        .hero-right{position:relative;z-index:2;animation:fadeUp .8s .4s both;min-width:0 !important;max-width:100%;}
        .terminal{background:var(--surface);border:1px solid var(--border2);border-radius:16px;overflow:hidden;}
        .term-header{display:flex;align-items:center;gap:8px;padding:14px 20px;border-bottom:1px solid var(--border);background:var(--surface2);}
        .term-dots{display:flex;gap:6px;}
        .term-dot{width:11px;height:11px;border-radius:50%;}
        .term-title{font-size:12px;color:var(--text3);margin-left:8px;font-family:'JetBrains Mono',monospace;}
        .term-badge{margin-left:auto;font-size:10px;color:var(--green);border:1px solid var(--green-border);padding:2px 8px;border-radius:100px;background:var(--green-glow);}
        .term-body{padding:20px 24px;font-family:'JetBrains Mono',monospace;font-size:13px;line-height:1.8;}
        .ln{display:flex;gap:20px;align-items:flex-start;}
        .lnum{color:var(--text3);min-width:16px;user-select:none;font-size:11px;margin-top:2px;}
        .lc{flex:1;}
        .kw{color:#C084FC;}.fn{color:#60A5FA;}.str{color:var(--green);}.cm{color:var(--text3);}.num{color:#FB923C;}.op{color:var(--text2);}
        .hidden-code{opacity:.05;transition:opacity .25s ease,text-shadow .25s ease,transform .25s ease;}
        .term-output{margin:12px 0 4px;padding:12px 16px;background:var(--bg);border-radius:8px;border:1px solid var(--border);}
        .out-label{font-size:10px;color:var(--text3);margin-bottom:6px;letter-spacing:.05em;}
        .out-line{color:var(--green);font-size:12px;}

        /* SECTION */
        .section{padding:100px 64px;max-width:1200px;margin:0 auto;}
        .sec-eyebrow{font-size:11px;font-weight:500;color:var(--green);text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;}
        .sec-title{font-family:'Syne',sans-serif;font-size:40px;font-weight:800;letter-spacing:-1.5px;line-height:1.1;margin-bottom:16px;}
        .sec-sub{font-size:16px;color:var(--text2);max-width:480px;line-height:1.75;font-weight:300;margin-bottom:52px;}
        .hr{height:1px;background:var(--border);margin:0 64px;}

        /* FEATURES */
        .feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border2);border:1px solid var(--border2);border-radius:16px;overflow:hidden;}
        .feat{background:var(--bg);padding:32px;transition:background .25s;position:relative;overflow:hidden;}
        .feat::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--green);transform:scaleX(0);transform-origin:left;transition:transform .3s;}
        .feat:hover{background:var(--surface);}
        .feat:hover::after{transform:scaleX(1);}
        .feat-ico{width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;border:1px solid var(--border2);transition:border-color .2s,box-shadow .2s;}
        .feat:hover .feat-ico{border-color:var(--green-border);box-shadow:0 0 16px var(--green-glow);}
        .feat-title{font-family:'Syne',sans-serif;font-size:16px;font-weight:600;margin-bottom:10px;letter-spacing:-.3px;}
        .feat-desc{font-size:13px;color:var(--text2);line-height:1.7;font-weight:300;}
        .feat-tags{margin-top:14px;display:flex;gap:6px;flex-wrap:wrap;}
        .tag{font-size:10px;padding:2px 8px;border-radius:4px;background:var(--surface2);color:var(--text3);font-family:'JetBrains Mono',monospace;}

        /* STEPS */
        .steps{display:grid;grid-template-columns:repeat(4,1fr);gap:0;position:relative;margin-top:52px;}
        .steps::before{content:'';position:absolute;top:21px;left:7%;width:86%;height:1px;background:linear-gradient(90deg,transparent,var(--border2) 20%,var(--border2) 80%,transparent);}
        .step{text-align:center;padding:0 20px;position:relative;z-index:1;}
        .step-num{width:42px;height:42px;border-radius:50%;background:var(--bg);border:1px solid var(--green-border);color:var(--green);font-family:'Syne',sans-serif;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;margin:0 auto 22px;transition:all .3s;}
        .step:hover .step-num{background:var(--green);color:#000;transform:scale(1.1);box-shadow:0 0 20px var(--green-glow);}
        .step-title{font-family:'Syne',sans-serif;font-size:14px;font-weight:600;margin-bottom:10px;letter-spacing:-.2px;}
        .step-desc{font-size:13px;color:var(--text2);line-height:1.7;font-weight:300;}

        /* COMPANY TABS */
        .ctab{padding:8px 18px;border-radius:100px;font-size:13px;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .2s;font-weight:400;border:1px solid var(--border2);background:transparent;color:var(--text2);}
        .ctab:hover{border-color:var(--border3);color:var(--text);background:var(--surface);}
        .ctab.active{background:var(--green);color:#000;border-color:var(--green);font-weight:500;}

        /* PROB CARDS */
        .prob-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
        .prob-card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:24px;cursor:pointer;transition:all .25s;position:relative;overflow:hidden;}
        .prob-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--green);transform:scaleX(0);transform-origin:left;transition:transform .3s;}
        .prob-card:hover{border-color:var(--border2);transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.3);}
        .prob-card:hover::before{transform:scaleX(1);}
        .prob-card.hidden{display:none;}
        .prob-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;}
        .prob-diff{font-size:11px;font-weight:500;padding:3px 10px;border-radius:100px;}
        .prob-diff.easy{background:#00E5A015;color:#00E5A0;border:1px solid #00E5A025;}
        .prob-diff.medium{background:#F59E0B15;color:#F59E0B;border:1px solid #F59E0B25;}
        .prob-diff.hard{background:#F8717115;color:#F87171;border:1px solid #F8717125;}
        .prob-num{font-size:11px;color:var(--text3);font-family:'JetBrains Mono',monospace;}
        .prob-title{font-family:'Syne',sans-serif;font-size:15px;font-weight:600;margin-bottom:10px;letter-spacing:-.2px;line-height:1.3;}
        .prob-tags{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;}
        .ptag{font-size:10px;padding:2px 8px;border-radius:4px;background:var(--surface2);color:var(--text3);font-family:'JetBrains Mono',monospace;}
        .prob-companies-row{display:flex;align-items:center;gap:4px;}

        /* RESUME */
        .resume-card{background:var(--surface);border:1px solid var(--border2);border-radius:16px;padding:24px;}
        .resume-feature{display:flex;align-items:flex-start;gap:14px;padding:16px;border-radius:12px;border:1px solid var(--border);background:var(--bg);transition:all .2s;}
        .resume-feature:hover{border-color:var(--border2);background:var(--surface);}
        .rf-icon{width:38px;height:38px;min-width:38px;border-radius:9px;border:1px solid;display:flex;align-items:center;justify-content:center;}
        .rf-title{font-family:'Syne',sans-serif;font-size:14px;font-weight:600;margin-bottom:4px;letter-spacing:-.2px;}
        .rf-desc{font-size:13px;color:var(--text2);line-height:1.6;font-weight:300;}
        .rq-item{display:flex;align-items:flex-start;gap:10px;padding:10px 12px;border-radius:8px;background:var(--bg);border:1px solid var(--border);transition:border-color .2s;}
        .rq-item:hover{border-color:var(--green-border);}
        .rq-num{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--green);font-weight:600;min-width:20px;margin-top:2px;}
        .rq-text{font-size:12px;color:var(--text2);line-height:1.6;font-weight:300;}
        .sugg-item{display:flex;align-items:flex-start;gap:8px;}
        .sugg-dot{width:6px;height:6px;border-radius:50%;min-width:6px;margin-top:5px;}

        /* TRENDS */
        .trend-card{background:var(--surface);border:1px solid var(--border2);border-radius:14px;padding:20px;transition:border-color .2s;}
        .trend-card:hover{border-color:var(--border3);}
        .trend-item{display:flex;align-items:center;gap:10px;}
        .trend-rank{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:600;min-width:20px;}
        .trend-name{font-size:12px;color:var(--text2);margin-bottom:4px;font-weight:300;}
        .trend-bar-wrap{height:3px;background:var(--surface2);border-radius:2px;width:100%;}
        .trend-bar{height:100%;border-radius:2px;transition:width 1.2s ease;}
        .trend-pct{font-size:11px;font-family:'JetBrains Mono',monospace;font-weight:500;min-width:36px;text-align:right;}
        .job-item{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;border:1px solid var(--border);background:var(--bg);transition:border-color .2s;}
        .job-item:hover{border-color:var(--border2);}
        .job-logo{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;font-family:'Syne',sans-serif;flex-shrink:0;}
        .job-title-text{font-size:12px;font-weight:500;color:var(--text);margin-bottom:2px;}
        .job-meta{font-size:10px;color:var(--text3);font-family:'JetBrains Mono',monospace;}
        .job-badge{font-size:9px;padding:2px 7px;border-radius:100px;background:var(--surface2);color:var(--text3);font-weight:500;white-space:nowrap;}
        .job-badge.new{background:#00E5A015;color:#00E5A0;border:1px solid #00E5A025;}
        .job-badge.hot{background:#F8717115;color:#F87171;border:1px solid #F8717125;}
        .nl-feature{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--text2);font-weight:300;}
        .nl-input{width:100%;padding:9px 12px;border-radius:8px;background:var(--bg);border:1px solid var(--border2);color:var(--text);font-size:13px;font-family:'DM Sans',sans-serif;outline:none;transition:border-color .2s;}
        .nl-input:focus{border-color:var(--green-border);}
        .nl-select{width:100%;padding:9px 12px;border-radius:8px;background:var(--bg);border:1px solid var(--border2);color:var(--text2);font-size:13px;font-family:'DM Sans',sans-serif;outline:none;cursor:pointer;transition:border-color .2s;}
        .nl-select:focus{border-color:var(--green-border);}
        .nl-btn{width:100%;padding:11px;border-radius:8px;background:var(--green);color:#000;border:none;font-size:14px;font-weight:500;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s;}
        .nl-btn:hover{background:#00FFB3;}

        /* CTA */
        .cta-wrap{margin:0 64px 100px;border:1px solid var(--border2);border-radius:20px;padding:80px;text-align:center;position:relative;overflow:hidden;background:var(--surface);}
        .cta-orb{position:absolute;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,#00E5A006 0%,transparent 60%);top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;}
        .cta-wrap h2{font-family:'Syne',sans-serif;font-size:48px;font-weight:800;letter-spacing:-2px;margin-bottom:16px;position:relative;z-index:1;}
        .cta-wrap p{font-size:17px;color:var(--text2);margin-bottom:40px;font-weight:300;position:relative;z-index:1;}
        .cta-btns{display:flex;justify-content:center;gap:12px;position:relative;z-index:1;}

        /* FOOTER */
        footer{border-top:1px solid var(--border);padding:28px 64px;display:flex;align-items:center;justify-content:space-between;}
        .foot-copy{font-size:13px;color:var(--text3);font-weight:300;}
        .foot-links{display:flex;gap:28px;}
        .foot-link{font-size:13px;color:var(--text3);cursor:pointer;transition:color .2s;}
        .foot-link:hover{color:var(--text2);}

        /* FADE-UP */
        .fu{opacity:0;transform:translateY(28px);transition:opacity .7s ease,transform .7s ease;}
        .fu.vis{opacity:1;transform:translateY(0);}

        /* PARTICLES */
        .particles{position:absolute;inset:0;pointer-events:none;overflow:hidden;}
        .particle{position:absolute;border-radius:50%;background:var(--green);opacity:0;animation:particleFloat linear infinite;}
        @keyframes particleFloat{0%{transform:translateY(100vh) translateX(0);opacity:0}10%{opacity:.6}90%{opacity:.3}100%{transform:translateY(-100px) translateX(var(--drift));opacity:0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}

        /* MISC */
        .stars{color:var(--amber);font-size:13px;margin-bottom:10px;}
        .tcard{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:28px;transition:all .25s;position:relative;}
        .tcard:hover{border-color:var(--border2);transform:translateY(-4px);}
        .tcard-q{font-family:'Syne',sans-serif;font-size:40px;color:var(--green);opacity:.3;line-height:1;margin-bottom:10px;}
        .tcard-text{font-size:14px;color:var(--text2);line-height:1.8;margin-bottom:20px;font-style:italic;font-weight:300;}
        .tcard-footer{display:flex;align-items:center;gap:12px;padding-top:16px;border-top:1px solid var(--border);}
        .av{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;font-family:'Syne',sans-serif;}
        .aname{font-size:14px;font-weight:500;}
        .arole{font-size:12px;color:var(--text3);font-weight:300;}
      `}</style>

      {/* ── CURSOR ELEMENTS ── */}
      <div id="cur"></div>
      <div id="cur-ring"></div>
      <div id="spotlight"></div>

      {/* ── NAV ── */}
      <nav>
        <div className="logo">
          <div className="logo-mark">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12M10 4l6 6-6 6" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className="logo-name">TalentIQ</div>
            <div className="logo-sub">Code Together</div>
          </div>
        </div>
        <div className="nav-links">
          <span className="nav-link" onClick={scrollToProblems}>Problems</span>
          <span className="nav-link">Sessions</span>
          <span className="nav-link">About</span>
        </div>
        <div className="nav-btns">
          <button className="btn-ghost" onClick={() => navigate("/signin")}>Sign in</button>
          <button className="btn-green" onClick={() => navigate("/register")}>Get started free</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div className="hero">
        <div className="hero-grid-bg"></div>
        <div className="hero-orb"></div>
        <div className="particles" id="particles"></div>

        {/* LEFT */}
        <div className="hero-left">
          <div className="pill">
            <div className="pill-dot"></div>
            AI-powered hints • Live 1-on-1 sessions
          </div>

          <h1>
            Crack every<br/>
            coding interview<br/>
            with{" "}
            <em>
              live peers
              <svg viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 6 Q50 2 100 6 Q150 10 198 4" stroke="#00E5A0" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6"/>
              </svg>
            </em>
          </h1>

          <p className="hero-sub" ref={subRef}></p>

          <div className="hero-actions">
            <button className="btn-hero btn-hp" onClick={() => navigate("/register")}>Start practicing free →</button>
            <button className="btn-hero btn-hs">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M6 5.5l5 2.5-5 2.5V5.5z" fill="currentColor"/>
              </svg>
              Watch demo
            </button>
          </div>

          <div className="hero-section-tag">
            {[
              "No credit card required",
              "50+ problems free",
              "Join in 30 seconds",
            ].map((label, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                {i > 0 && <div className="hst-div"></div>}
                <div className="hst-item">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 8l4 4 8-8" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {label}
                </div>
              </div>
            ))}
          </div>

          <div className="hero-stats">
            {[
              { key: "users",        label: "Active users"   },
              { key: "problems",     label: "Problems"       },
              { key: "sessions",     label: "Sessions done"  },
              { key: "satisfaction", label: "Satisfaction"   },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "32px" }}>
                {i > 0 && <div className="hstat-div"></div>}
                <div>
                  <div className="hstat-num" data-counter={s.key}>{counters[s.key]}</div>
                  <div className="hstat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — terminal */}
        <div className="hero-right">
          <div className="terminal">
            <div className="term-header">
              <div className="term-dots">
                <div className="term-dot" style={{ background: "#FF5F57" }}></div>
                <div className="term-dot" style={{ background: "#FEBC2E" }}></div>
                <div className="term-dot" style={{ background: "#28C840" }}></div>
              </div>
              <div className="term-title">two_sum.py</div>
              <div className="term-badge">● Live session</div>
            </div>
            <div className="term-body">
              <div className="ln"><span className="lnum">1</span><span className="lc"><span className="cm"># Two Sum — LeetCode #1</span></span></div>
              <div className="ln"><span className="lnum">2</span><span className="lc"><span className="cm"># Session with: Priya S.</span></span></div>
              <div className="ln"><span className="lnum">3</span><span className="lc"></span></div>
              <div className="ln"><span className="lnum">4</span><span className="lc"><span className="kw">def </span><span className="fn">two_sum</span><span className="op">(</span>nums<span className="op">,</span> target<span className="op">):</span></span></div>

              <div className="ln hidden-code" data-hidden="true"><span className="lnum">5</span><span className="lc" style={{ paddingLeft: "20px" }}><span className="cm">  # Use hashmap for O(n)</span></span></div>
              <div className="ln hidden-code" data-hidden="true"><span className="lnum">6</span><span className="lc" style={{ paddingLeft: "20px" }}>  seen <span className="op">= </span><span className="op">{"{}"}</span></span></div>
              <div className="ln hidden-code" data-hidden="true"><span className="lnum">7</span><span className="lc" style={{ paddingLeft: "20px" }}><span className="kw">  for </span>i<span className="op">,</span> num <span className="kw">in </span><span className="fn">enumerate</span><span className="op">(</span>nums<span className="op">):</span></span></div>
              <div className="ln hidden-code" data-hidden="true"><span className="lnum">8</span><span className="lc" style={{ paddingLeft: "40px" }}>comp <span className="op">= </span>target <span className="op">-</span> num</span></div>
              <div className="ln hidden-code" data-hidden="true"><span className="lnum">9</span><span className="lc" style={{ paddingLeft: "40px" }}><span className="kw">if </span>comp <span className="kw">in </span>seen<span className="op">:</span></span></div>
              <div className="ln hidden-code" data-hidden="true"><span className="lnum">10</span><span className="lc" style={{ paddingLeft: "60px" }}><span className="kw">return </span><span className="op">[</span>seen<span className="op">[</span>comp<span className="op">]</span><span className="op">,</span> i<span className="op">]</span></span></div>
              <div className="ln hidden-code" data-hidden="true"><span className="lnum">11</span><span className="lc" style={{ paddingLeft: "40px" }}>seen<span className="op">[</span>num<span className="op">] = </span>i</span></div>
              <div className="ln hidden-code" data-hidden="true"><span className="lnum">12</span><span className="lc" style={{ paddingLeft: "20px" }}><span className="kw">return </span><span className="op">[]</span></span></div>
              <div className="ln hidden-code" data-hidden="true"><span className="lnum">13</span><span className="lc"></span></div>
              <div className="ln hidden-code" data-hidden="true"><span className="lnum">14</span><span className="lc"><span className="cm"># Test</span></span></div>
              <div className="ln hidden-code" data-hidden="true"><span className="lnum">15</span><span className="lc"><span className="fn">print</span><span className="op">(</span>two_sum<span className="op">([</span><span className="num">2</span><span className="op">,</span><span className="num">7</span><span className="op">,</span><span className="num">11</span><span className="op">,</span><span className="num">15</span><span className="op">],</span> <span className="num">9</span><span className="op">))</span></span></div>

              <div className="term-output hidden-code" data-hidden="true" style={{ opacity: 0.05 }}>
                <div className="out-label">OUTPUT</div>
                <div className="out-line">▶ [0, 1]</div>
                <div className="out-line" style={{ color: "var(--text3)", fontSize: "11px" }}>Runtime: 48ms • Memory: 17.2 MB</div>
              </div>
            </div>

            {/* AI Hint */}
            <div style={{ padding: "0 20px 20px" }} className="hidden-code" data-hidden="true">
              <div style={{ background: "var(--green-glow)", border: "1px solid var(--green-border)", borderRadius: "10px", padding: "14px 16px" }}>
                <div style={{ fontSize: "10px", color: "var(--green)", fontWeight: 500, letterSpacing: ".05em", marginBottom: "6px" }}>AI HINT</div>
                <div style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.7, fontWeight: 300 }}>Think about what you need to check for each number. What's its "complement"?</div>
              </div>
            </div>
          </div>

          {/* Floating badges */}
          <div style={{ display: "flex", gap: "10px", marginTop: "14px", flexWrap: "wrap" }}>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: "8px", padding: "10px 16px", display: "flex", alignItems: "center", gap: "10px", flex: 1, animation: "float 3s ease-in-out infinite" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 8px #22C55E60" }}></div>
              <div style={{ fontSize: "12px", color: "var(--text2)" }}>Priya S. is typing...</div>
            </div>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: "8px", padding: "10px 16px", display: "flex", alignItems: "center", gap: "10px", flex: 1, animation: "float 3s ease-in-out infinite", animationDelay: ".6s" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="var(--purple)" strokeWidth="1.2"/>
                <path d="M5 4.5l4 2.5-4 2.5V4.5z" fill="var(--purple)"/>
              </svg>
              <div style={{ fontSize: "12px", color: "var(--text2)" }}>Video call • 12:34</div>
            </div>
          </div>
        </div>
      </div>

      <div className="hr"></div>

      {/* ── FEATURES ── */}
      <section className="section">
        <div className="fu">
          <div className="sec-eyebrow">Features</div>
          <div className="sec-title">Everything for<br/>interview success</div>
          <div className="sec-sub">All the tools you need to simulate a real technical interview, in one place.</div>
        </div>
        <div className="feat-grid fu">
          {[
            { bg: "#00E5A010", icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="3" width="16" height="14" rx="2" stroke="#00E5A0" strokeWidth="1.5"/><path d="M6 8l3 2-3 2M11 12h3" stroke="#00E5A0" strokeWidth="1.5" strokeLinecap="round"/></svg>, title: "Monaco code editor", desc: "VS Code-powered editor with syntax highlighting, autocomplete, and real-time code execution.", tags: ["Python","Java","C++","JS","Go","Rust"] },
            { bg: "#8B7CF610", icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2l2.4 5 5.6.8-4 3.9.9 5.5L10 14.5l-4.9 2.7.9-5.5L2 7.8l5.6-.8L10 2z" stroke="#8B7CF6" strokeWidth="1.5" strokeLinejoin="round"/></svg>, title: "AI-powered hints", desc: "Get progressive nudges without spoiling the solution. Learn the problem-solving thought process." },
            { bg: "#60A5FA10", icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="#60A5FA" strokeWidth="1.5"/><path d="M7 8c0-1.7 1.3-3 3-3s3 1.3 3 3c0 1.2-.7 2.2-1.8 2.7V13H9v-2.3C7.7 10.2 7 9.2 7 8z" stroke="#60A5FA" strokeWidth="1.2"/></svg>, title: "Video + live chat", desc: "HD video calls and real-time messaging powered by Stream — collaborate like in the same room." },
            { bg: "#F59E0B10", icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 14l4-4 3 3 5-6 4 4" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: "Progress tracking", desc: "Dashboard with stats on sessions, streaks, problems solved, and skill growth over time." },
            { bg: "#00E5A010", icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3" stroke="#00E5A0" strokeWidth="1.5"/><path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#00E5A0" strokeWidth="1.5" strokeLinecap="round"/></svg>, title: "1-on-1 sessions", desc: "Match with a peer and solve problems in a real pressure-cooker interview environment." },
            { bg: "#8B7CF610", icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4h5v5H4zM11 4h5v5h-5zM4 11h5v5H4zM11 11h5v5h-5z" stroke="#8B7CF6" strokeWidth="1.5" strokeLinejoin="round"/></svg>, title: "50+ curated problems", desc: "Arrays, trees, graphs, DP, system design — hand-picked from real FAANG interviews." },
          ].map((f, i) => (
            <div className="feat" key={i}>
              <div className="feat-ico" style={{ background: f.bg }}>{f.icon}</div>
              <div className="feat-title">{f.title}</div>
              <div className="feat-desc">{f.desc}</div>
              {f.tags && <div className="feat-tags">{f.tags.map(t => <span className="tag" key={t}>{t}</span>)}</div>}
            </div>
          ))}
        </div>
      </section>

      <div className="hr"></div>

      {/* ── HOW IT WORKS ── */}
      <section className="section">
        <div className="fu" style={{ textAlign: "center" }}>
          <div className="sec-eyebrow">How it works</div>
          <div className="sec-title">Ready in 4 steps</div>
        </div>
        <div className="steps fu">
          {[
            { n: "01", t: "Create account",  d: "Sign up with email or GitHub. Free forever, no card needed." },
            { n: "02", t: "Pick a problem",  d: "Filter by difficulty, topic, or company tag." },
            { n: "03", t: "Start a session", d: "Create a room and wait for a peer to join your session." },
            { n: "04", t: "Code together",   d: "Collaborate live with video, chat, and a shared editor." },
          ].map((s) => (
            <div className="step" key={s.n}>
              <div className="step-num">{s.n}</div>
              <div className="step-title">{s.t}</div>
              <div className="step-desc">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="hr"></div>

      {/* ── COMPANY PROBLEMS ── */}
      <section className="section" id="problems-section">
        <div className="fu" style={{ textAlign: "center" }}>
          <div className="sec-eyebrow">Company-specific prep</div>
          <div className="sec-title">Practice problems asked<br/>at top companies</div>
          <div className="sec-sub" style={{ margin: "0 auto 52px", textAlign: "center", maxWidth: "520px" }}>
            Every problem is tagged with the real companies that asked it. Filter by your target company and prepare with laser focus.
          </div>
        </div>

        {/* Company filter */}
        <div className="fu" style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap", marginBottom: "40px" }}>
          {[
            { key: "all",       label: "All Companies" },
            { key: "google",    label: "Google",    icon: <GoogleIcon size={12}/>    },
            { key: "amazon",    label: "Amazon",    icon: <AmazonIcon size={12}/>    },
            { key: "microsoft", label: "Microsoft", icon: <MicrosoftIcon size={12}/> },
            { key: "meta",      label: "Meta",      icon: <MetaIcon size={12}/>      },
            { key: "apple",     label: "Apple",     icon: <AppleIcon size={12}/>     },
          ].map(c => (
            <button
              key={c.key}
              className={`ctab${activeCompany === c.key ? " active" : ""}`}
              onClick={() => setActiveCompany(c.key)}
            >
              {c.icon && <span style={{ marginRight: "5px", verticalAlign: "middle" }}>{c.icon}</span>}
              {c.label}
            </button>
          ))}
        </div>

        {/* Problems grid */}
        <div className="prob-grid fu">
          {filteredProblems.map(p => (
            <div
              className="prob-card"
              key={p.id}
              onClick={() => window.open("https://www.talentiq.live/problems", "_blank")}
            >
              <div className="prob-top">
                <div className={`prob-diff ${p.diff}`}>{p.diff.charAt(0).toUpperCase() + p.diff.slice(1)}</div>
                <div className="prob-num">{p.num}</div>
              </div>
              <div className="prob-title">{p.title}</div>
              <div className="prob-tags">{p.tags.map(t => <span className="ptag" key={t}>{t}</span>)}</div>
              <div className="prob-companies-row">
                {p.icons.map((icon, i) => <span key={i}>{icon}</span>)}
                <span style={{ fontSize: "11px", color: "var(--text3)", marginLeft: "4px" }}>{p.extra}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="fu" style={{ textAlign: "center", marginTop: "44px" }}>
          <button className="btn-hero btn-hp" style={{ margin: "0 auto" }} onClick={() => window.open("https://www.talentiq.live/problems", "_blank")}>
            Browse all 50+ problems →
          </button>
          <p style={{ fontSize: "13px", color: "var(--text3)", marginTop: "16px" }}>Problems tagged with Google, Amazon, Microsoft, Meta, Apple & more</p>
        </div>
      </section>

      <div className="hr"></div>

      {/* ── RESUME SECTION ── */}
      <section className="section" id="resume-section">
        <div className="fu" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
          <div>
            <div className="sec-eyebrow">AI-powered resume tools</div>
            <div className="sec-title">Your resume.<br/>Supercharged by AI.</div>
            <div className="sec-sub" style={{ marginBottom: "32px" }}>
              Upload your resume and get personalized interview questions, role-specific prep, and actionable enhancement advice — all in one 1-on-1 session.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "40px" }}>
              {[
                { bg: "#00E5A010", bc: "#00E5A025", icon: <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M10 2l2.4 5 5.6.8-4 3.9.9 5.5L10 14.5l-4.9 2.7.9-5.5L2 7.8l5.6-.8L10 2z" stroke="#00E5A0" strokeWidth="1.5" strokeLinejoin="round"/></svg>, t: "Resume-based questions", d: "AI reads your resume and generates role-specific technical + behavioral questions tailored to your exact experience." },
                { bg: "#8B7CF610", bc: "#8B7CF625", icon: <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M4 6h12M4 10h8M4 14h10" stroke="#8B7CF6" strokeWidth="1.5" strokeLinecap="round"/></svg>, t: "Resume enhancement advice", d: "Get actionable suggestions on keywords, impact metrics, formatting, and what recruiters at top companies look for." },
                { bg: "#60A5FA10", bc: "#60A5FA25", icon: <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="#60A5FA" strokeWidth="1.5"/><path d="M7 10l2 2 4-4" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>, t: "1-on-1 mock interview", d: "Practice your answers live with a peer. Get real feedback on communication, clarity, and technical depth." },
              ].map((f, i) => (
                <div className="resume-feature" key={i}>
                  <div className="rf-icon" style={{ background: f.bg, borderColor: f.bc }}>{f.icon}</div>
                  <div>
                    <div className="rf-title">{f.t}</div>
                    <div className="rf-desc">{f.d}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-hero btn-hp">Try resume prep →</button>
          </div>

          {/* Resume mockup card */}
          <div style={{ position: "relative" }}>
            <div className="resume-card fu">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "var(--green-glow)", border: "1px solid var(--green-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 2h8l4 4v12H4V2z" stroke="#00E5A0" strokeWidth="1.5" strokeLinejoin="round"/><path d="M12 2v4h4M7 9h6M7 12h4" stroke="#00E5A0" strokeWidth="1.3" strokeLinecap="round"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 500, fontFamily: "'Syne',sans-serif" }}>resume.pdf</div>
                    <div style={{ fontSize: "11px", color: "var(--text3)" }}>Uploaded just now</div>
                  </div>
                </div>
                <div style={{ fontSize: "11px", color: "var(--green)", background: "var(--green-glow)", border: "1px solid var(--green-border)", padding: "3px 10px", borderRadius: "100px" }}>Analyzing...</div>
              </div>

              <div style={{ fontSize: "11px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "12px", fontWeight: 500 }}>Generated interview questions</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  ["Q1", "You mentioned building a REST API at your internship. How did you handle rate limiting?"],
                  ["Q2", "Walk me through the React architecture you used in your final year project."],
                  ["Q3", "You list Node.js as a skill — describe a performance bottleneck you solved."],
                ].map(([num, text]) => (
                  <div className="rq-item" key={num}><div className="rq-num">{num}</div><div className="rq-text">{text}</div></div>
                ))}
              </div>

              <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
                <div style={{ fontSize: "11px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: "12px", fontWeight: 500 }}>Enhancement suggestions</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {[
                    ["#F59E0B", `Add quantified impact — "reduced load time by 40%" beats "improved performance"`],
                    ["#00E5A0", `Include keywords: "distributed systems", "CI/CD", "microservices"`],
                    ["#8B7CF6", "Move GitHub link to top — recruiters scan for it in first 6 seconds"],
                  ].map(([color, text]) => (
                    <div className="sugg-item" key={text}>
                      <div className="sugg-dot" style={{ background: color }}></div>
                      <div style={{ fontSize: "12px", color: "var(--text2)" }}>{text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Score badge */}
            <div style={{ position: "absolute", top: "-16px", right: "-16px", background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: "12px", padding: "12px 16px", textAlign: "center", animation: "float 3s ease-in-out infinite" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "22px", fontWeight: 800, color: "var(--green)" }}>82</div>
              <div style={{ fontSize: "10px", color: "var(--text3)" }}>Resume score</div>
            </div>
          </div>
        </div>
      </section>

      <div className="hr"></div>

      {/* ── TRENDS + NEWSLETTER ── */}
      <section className="section trend-section" id="newsletter-section">
        <div className="fu" style={{ textAlign: "center" }}>
          <div className="sec-eyebrow">Stay ahead of the curve</div>
          <div className="sec-title">Coding trends, job alerts<br/>&amp; weekly newsletter</div>
          <div className="sec-sub" style={{ margin: "0 auto 52px", textAlign: "center", maxWidth: "540px" }}>
            Get personalized weekly insights on trending technologies, curated job listings matching your skills, and interview tips — delivered to your inbox every Monday.
          </div>
        </div>

        <div className="fu" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginBottom: "56px" }}>

          {/* Trending */}
          <div className="trend-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
              <div style={{ fontSize: "10px", color: "var(--green)", fontFamily: "'JetBrains Mono',monospace", fontWeight: 500, textTransform: "uppercase", letterSpacing: ".06em" }}>Trending this week</div>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 6px #22C55E60" }}></div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { rank: "01", color: "var(--green)", name: "Rust for Systems",         pct: "+24%", w: "88%" },
                { rank: "02", color: "#8B7CF6",      name: "LLM Engineering",           pct: "+19%", w: "76%" },
                { rank: "03", color: "#60A5FA",      name: "Go Microservices",           pct: "+15%", w: "62%" },
                { rank: "04", color: "#F59E0B",      name: "React Server Components",   pct: "+11%", w: "55%" },
              ].map(t => (
                <div className="trend-item" key={t.rank}>
                  <div className="trend-rank" style={{ color: t.color }}>{t.rank}</div>
                  <div style={{ flex: 1 }}>
                    <div className="trend-name">{t.name}</div>
                    <div className="trend-bar-wrap">
                      <div className="trend-bar" style={{ width: trendBars ? t.w : "0%", background: t.color }}></div>
                    </div>
                  </div>
                  <div className="trend-pct" style={{ color: t.color }}>{t.pct}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hot Jobs */}
          <div className="trend-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
              <div style={{ fontSize: "10px", color: "#60A5FA", fontFamily: "'JetBrains Mono',monospace", fontWeight: 500, textTransform: "uppercase", letterSpacing: ".06em" }}>Hot job alerts</div>
              <div style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "'JetBrains Mono',monospace" }}>this week</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { bg: "#4285F415", color: "#4285F4", init: "G", title: "SDE-2 Frontend",   meta: "Google • Bangalore • ₹45-65L",   badge: "new" },
                { bg: "#FF990015", color: "#FF9900", init: "A", title: "Backend Engineer", meta: "Amazon • Remote • ₹38-55L",      badge: "hot" },
                { bg: "#00A4EF15", color: "#00A4EF", init: "M", title: "Full Stack Dev",   meta: "Microsoft • Hyderabad • ₹40-58L", badge: ""    },
                { bg: "#1877F215", color: "#1877F2", init: "F", title: "ML Engineer",      meta: "Meta • Remote • ₹55-80L",        badge: "new" },
              ].map(j => (
                <div className="job-item" key={j.title}>
                  <div className="job-logo" style={{ background: j.bg, color: j.color }}>{j.init}</div>
                  <div style={{ flex: 1 }}>
                    <div className="job-title-text">{j.title}</div>
                    <div className="job-meta">{j.meta}</div>
                  </div>
                  <div className={`job-badge${j.badge ? " " + j.badge : ""}`}>{j.badge || "Open"}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter signup */}
          <div className="trend-card" style={{ borderColor: "var(--green-border)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "var(--green)" }}></div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: "var(--green-glow)", border: "1px solid var(--green-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M2 4h16v12H2z" stroke="var(--green)" strokeWidth="1.5" strokeLinejoin="round"/><path d="M2 4l8 7 8-7" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 500, fontFamily: "'Syne',sans-serif" }}>Weekly Newsletter</div>
                <div style={{ fontSize: "11px", color: "var(--text3)" }}>Every Monday • Free forever</div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
              {["Trending tech stacks & languages","Curated job listings for your role","Interview questions from real rounds","AI-curated based on your profile"].map(f => (
                <div className="nl-feature" key={f}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span>{f}</span>
                </div>
              ))}
            </div>

            {!nlSuccess ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <input className="nl-input" type="text" placeholder="Your name" value={nlName} onChange={e => setNlName(e.target.value)} />
                <input
                  className="nl-input" type="email"
                  placeholder={emailError ? "Please enter a valid email" : "you@gmail.com"}
                  value={nlEmail}
                  onChange={e => setNlEmail(e.target.value)}
                  style={emailError ? { borderColor: "#F87171" } : {}}
                />
                <select className="nl-select" value={nlRole} onChange={e => setNlRole(e.target.value)}>
                  <option value="" disabled>Your target role</option>
                  {["Frontend Developer","Backend Developer","Full Stack Developer","ML / AI Engineer","DevOps / SRE","Mobile Developer"].map(r => <option key={r}>{r}</option>)}
                </select>
                <button className="nl-btn" onClick={handleNewsletterSubmit}>Subscribe free →</button>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>🎉</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: "15px", fontWeight: 600, color: "var(--green)", marginBottom: "4px" }}>You're subscribed!</div>
                <div style={{ fontSize: "12px", color: "var(--text3)" }}>First edition lands Monday in your inbox.</div>
              </div>
            )}
            <div style={{ fontSize: "11px", color: "var(--text3)", marginTop: "10px", textAlign: "center" }}>2,400+ developers already subscribed • Unsubscribe anytime</div>
          </div>
        </div>

        {/* Newsletter preview */}
        <div className="fu">
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ fontSize: "12px", color: "var(--text3)", fontFamily: "'JetBrains Mono',monospace" }}>sample newsletter preview</div>
          </div>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: "16px", overflow: "hidden", maxWidth: "700px", margin: "0 auto" }}>
            <div style={{ background: "var(--surface2)", padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "28px", height: "28px", background: "var(--green)", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M10 4l6 6-6 6" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 500, fontFamily: "'Syne',sans-serif" }}>TalentIQ Weekly</div>
                  <div style={{ fontSize: "11px", color: "var(--text3)" }}>newsletter@talentiq.live</div>
                </div>
              </div>
              <div style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "'JetBrains Mono',monospace" }}>Mon, Mar 18 · Issue #42</div>
            </div>
            <div style={{ padding: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {[
                { color: "var(--green)", label: "This week in tech",   text: "Rust overtakes Python in systems programming surveys. LLM fine-tuning costs drop 60% with new LoRA variants. React 20 RC drops with compiler optimizations..." },
                { color: "#60A5FA",      label: "Jobs for you",        jobs: ["Google SDE-2 · Bangalore", "Stripe Backend · Remote", "Vercel Frontend · Remote"] },
                { color: "#8B7CF6",      label: "Interview tip",       text: `When asked "design a URL shortener" — start with capacity estimation. 100M URLs/day = 1157 writes/sec. Always impress with numbers first.` },
                { color: "#F59E0B",      label: "Problem of the week", text: "LRU Cache (Hard) — asked at Google, Meta, Amazon this week. 3,412 attempts.", link: "Try it on TalentIQ →" },
              ].map((card, i) => (
                <div key={i} style={{ border: "1px solid var(--border)", borderRadius: "10px", padding: "14px" }}>
                  <div style={{ fontSize: "10px", color: card.color, textTransform: "uppercase", letterSpacing: ".06em", fontFamily: "'JetBrains Mono',monospace", marginBottom: "8px" }}>{card.label}</div>
                  {card.jobs ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {card.jobs.map(j => <div key={j} style={{ fontSize: "12px", color: "var(--text2)" }}>→ {j}</div>)}
                    </div>
                  ) : (
                    <div style={{ fontSize: "12px", color: "var(--text2)", lineHeight: 1.7, fontWeight: 300 }}>
                      {card.text}{card.link && <span style={{ color: "var(--green)" }}> {card.link}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="cta-wrap fu">
        <div className="cta-orb"></div>
        <div className="pill" style={{ marginBottom: "24px" }}><div className="pill-dot"></div>Free to get started • No card needed</div>
        <h2>Ready to ace your<br/>next interview?</h2>
        <p>Join 2,400+ developers practicing real problems every day.</p>
        <div className="cta-btns">
          <button className="btn-hero btn-hp" onClick={() => navigate("/register")}>Get started free →</button>
          <button className="btn-hero btn-hs" onClick={scrollToProblems}>Browse problems</button>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer>
        <div className="logo">
          <div className="logo-mark" style={{ width: "30px", height: "30px" }}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M10 4l6 6-6 6" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="logo-name" style={{ fontSize: "16px" }}>TalentIQ</div>
        </div>
        <div className="foot-copy">© 2026 Talent IQ. All rights reserved.</div>
        <div className="foot-links">
          {["Privacy","Terms","GitHub","Contact"].map(l => <span className="foot-link" key={l}>{l}</span>)}
        </div>
      </footer>
    </>
  );
}