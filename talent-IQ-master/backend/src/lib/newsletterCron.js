import fetch from "node-fetch";
import nodemailer from "nodemailer";
import Subscriber from "../models/Subscriber.js";

// Fetch remote software engineering jobs using Remotive zero-auth API
const fetchJobs = async () => {
    try {
        // Fetch a larger batch so we can aggressively filter them locally for freshers
        const res = await fetch("https://remotive.com/api/remote-jobs?category=software-dev&limit=100");
        const data = await res.json();
        
        const jobs = data.jobs || [];

        // Strict rejection list for experienced roles
        const seniorKeywords = ["senior", "lead", "sr", "principal", "staff", "manager", "director", "head", "architect", "experienced"];
        
        // Strict inclusion list for freshers
        const fresherKeywords = ["junior", "jr", "entry", "intern", "graduate", "fresher", "trainee", "associate"];

        const fresherJobs = jobs.filter(job => {
            const titleLower = job.title.toLowerCase();
            
            // 1. Instantly reject any role that contains a senior keyword
            const isSenior = seniorKeywords.some(keyword => titleLower.includes(keyword));
            if (isSenior) return false;

            // 2. Either explicitly require a fresher keyword OR just accept un-tagged standard roles 
            // (To strictly guarantee fresher jobs, we will force it to match our fresher inclusion list)
            const isFresher = fresherKeywords.some(keyword => titleLower.includes(keyword));
            
            return isFresher;
        });

        // Return only the top 5 freshest junior-level jobs
        return fresherJobs.slice(0, 5);
    } catch (e) {
        console.error("Failed fetching dev jobs:", e);
        return [];
    }
};

// Fetch AI & Software articles using Dev.to API
const fetchArticles = async () => {
    try {
        const res = await fetch("https://dev.to/api/articles?tag=ai&top=1&per_page=5");
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (e) {
        console.error("Failed fetching dev.to articles:", e);
        return [];
    }
};

export const dispatchDailyNewsletter = async () => {
    try {
        // If credentials are not completely configured, skip to avoid crashing
        const mailUser = process.env.EMAIL_USER;
        const mailPass = process.env.EMAIL_PASS;
        if (!mailUser || !mailPass) {
            console.log("⚠️ EMAIL_USER or EMAIL_PASS not set in .env. Skipping newsletter dispatch.");
            return;
        }

        console.log("📨 Starting daily tech newsletter generation...");

        const [jobs, articles] = await Promise.all([fetchJobs(), fetchArticles()]);

        if (jobs.length === 0 && articles.length === 0) {
            console.log("⚠️ No news found for today. Skipping newsletter.");
            return;
        }

        // Generate beautiful HTML markup
        let htmlBody = `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; color: #EEF2FF; background-color: #0A0C0F; padding: 32px; border-radius: 12px; border: 1px solid #161C28;">
            <h1 style="color: #00E5A0; font-size: 28px; text-align: center; margin-bottom: 8px;">The Daily Algorithm</h1>
            <p style="color: #7A8499; text-align: center; margin-bottom: 32px;">Your daily briefing on AI breakthroughs and remote engineering careers.</p>
        `;

        if (articles.length > 0) {
            htmlBody += `<h2 style="color: #FFFFFF; font-size: 18px; border-bottom: 1px solid #161C28; padding-bottom: 8px;">🔥 Today's Top AI & Software Articles</h2>`;
            articles.forEach(article => {
                htmlBody += `
                <div style="margin-bottom: 16px;">
                    <a href="${article.url}" style="color: #8B7CF6; text-decoration: none; font-size: 16px; font-weight: 600;">${article.title}</a>
                    <p style="color: #A0ABC0; font-size: 13px; margin-top: 4px;">By ${article.user.name} • ${article.reading_time_minutes} min read</p>
                </div>
                `;
            });
        }

        if (jobs.length > 0) {
            htmlBody += `<h2 style="color: #FFFFFF; font-size: 18px; border-bottom: 1px solid #161C28; padding-bottom: 8px; margin-top: 32px;">💼 Featured Remote Engineering Jobs</h2>`;
            jobs.forEach(job => {
                htmlBody += `
                <div style="margin-bottom: 16px; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 8px;">
                    <h3 style="margin: 0 0 4px 0; font-size: 15px;"><a href="${job.url}" style="color: #00E5A0; text-decoration: none;">${job.title}</a></h3>
                    <p style="color: #A0ABC0; font-size: 13px; margin: 0;">${job.company_name} • ${job.job_type}</p>
                </div>
                `;
            });
        }

        htmlBody += `
            <div style="margin-top: 48px; border-top: 1px solid #161C28; padding-top: 24px; text-align: center; color: #7A8499; font-size: 12px;">
                <p>You received this because you subscribed to TalentIQ's tech updates.</p>
            </div>
        </div>
        `;

        // Setup Nodemailer Config (Defaults to Gmail)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: mailUser,
                pass: mailPass
            }
        });

        // Query active subscribers safely
        const subscribers = await Subscriber.find({ isActive: true });
        
        if (subscribers.length === 0) {
            console.log("ℹ️ No active subscribers found. Newsletter generated but not sent.");
            return;
        }

        console.log(`📬 Dispatching newsletter to ${subscribers.length} subscribers...`);

        // Use BCA loop to dispatch individually to preserve privacy
        for (const sub of subscribers) {
            try {
                await transporter.sendMail({
                    from: `"The Daily Algorithm" <${mailUser}>`,
                    to: sub.email,
                    subject: '🔥 The Daily Algorithm: AI News & Top Dev Jobs',
                    html: htmlBody
                });
            } catch (err) {
                console.error(`Failed to send to ${sub.email}:`, err.message);
            }
        }

        console.log("✅ Daily newsletter dispatch completed successfully!");
    } catch (error) {
        console.error("⚠️ Newsletter cron error:", error);
    }
};
