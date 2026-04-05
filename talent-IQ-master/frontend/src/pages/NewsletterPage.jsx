import { useState } from "react";
import Navbar from "../components/Navbar";
import axiosInstance from "../lib/axios";
import { toast } from "react-hot-toast";

function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setIsLoading(true);
      const res = await axiosInstance.post("/newsletter/subscribe", { email });
      
      // Axios success (react-hot-toast handles notifications generally but we show explicitly)
      toast.success(res.data?.message || "Successfully subscribed!");
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.error || "Subscription failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .news-root { min-height: 100vh; background: #0A0C0F; color: #EEF2FF; font-family: 'DM Sans', sans-serif; padding-bottom: 80px; }
        .hero-section { max-width: 800px; margin: 60px auto 40px; text-align: center; }
        .hero-title { font-family: 'Syne', sans-serif; font-size: 3rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 16px; color: #EEF2FF; }
        .hero-subtitle { font-size: 1.1rem; color: #7A8499; margin-bottom: 40px; max-width: 600px; margin-inline: auto; line-height: 1.6; }
        
        .sub-container { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 40px; max-width: 500px; margin: 0 auto; box-shadow: 0 8px 32px rgba(0,0,0,0.4); backdrop-filter: blur(10px); }
        .sub-input-group { display: flex; flex-direction: column; gap: 12px; }
        .sub-input { width: 100%; background: #0D1117; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 14px 16px; color: #EEF2FF; font-size: 15px; outline: none; transition: all 0.2s; }
        .sub-input:focus { border-color: #00E5A0; background: #161C28; }
        .sub-btn { width: 100%; background: #00E5A0; color: #0A0C0F; border: none; padding: 14px; border-radius: 8px; font-weight: 700; font-size: 15px; cursor: pointer; transition: all 0.2s; display: flex; justify-content: center; align-items: center; }
        .sub-btn:hover { background: #00faaf; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0, 229, 160, 0.2); }
        .sub-btn:disabled { background: #161C28; color: #7A8499; cursor: not-allowed; transform: none; box-shadow: none; }
        
        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 900px; margin: 60px auto 0; padding: 0 24px; }
        .feat-card { text-align: center; padding: 24px; border: 1px solid rgba(255, 255, 255, 0.03); border-radius: 12px; background: rgba(255, 255, 255, 0.01); }
        .feat-icon { font-size: 24px; margin-bottom: 12px; display: inline-block; }
        .feat-title { font-weight: 700; font-size: 15px; color: #EEF2FF; margin-bottom: 8px; }
        .feat-desc { font-size: 13px; color: #7A8499; line-height: 1.5; }
        
        @media (max-width: 768px) {
          .features-grid { grid-template-columns: 1fr; }
          .hero-title { font-size: 2rem; }
        }
      `}</style>

      <div className="news-root">
        <Navbar />
        
        <div className="hero-section px-4">
          <h1 className="hero-title">The Daily <span style={{ color: '#00E5A0' }}>Algorithm</span></h1>
          <p className="hero-subtitle">
            A premium daily dispatch of the highest-rated Artificial Intelligence insights and hand-picked remote software engineering opportunities.
          </p>

          <div className="sub-container">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px', color: '#EEF2FF' }}>Join the developer elite.</h2>
            <form onSubmit={handleSubscribe} className="sub-input-group">
              <input
                type="email"
                required
                className="sub-input"
                placeholder="developer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              <button type="submit" className="sub-btn" disabled={isLoading}>
                {isLoading ? "Subscribing..." : "Subscribe to Updates"}
              </button>
            </form>
            <p style={{ marginTop: '16px', fontSize: '12px', color: '#7A8499' }}>100% free. No spam. One daily dispatch.</p>
          </div>
        </div>

        <div className="features-grid">
          <div className="feat-card">
            <span className="feat-icon">🔥</span>
            <div className="feat-title">AI & Tech Pulse</div>
            <div className="feat-desc">Hand-curated software engineering and artificial intelligence topics straight from DEV.to.</div>
          </div>
          <div className="feat-card">
            <span className="feat-icon">💼</span>
            <div className="feat-title">Remote Opportunities</div>
            <div className="feat-desc">The freshest remote developer positions aggregated directly into your inbox.</div>
          </div>
          <div className="feat-card">
            <span className="feat-icon">⚡</span>
            <div className="feat-title">Zero Friction</div>
            <div className="feat-desc">Read everything from your inbox without leaving your IDE or workflow.</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NewsletterPage;
