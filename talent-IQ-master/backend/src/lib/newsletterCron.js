import fetch from "node-fetch";
import nodemailer from "nodemailer";
import Subscriber from "../models/Subscriber.js";

// Fetch fresher software engineering jobs in India using Adzuna API
export const fetchJobs = async () => {
    try {
        const appId = process.env.ADZUNA_APP_ID;
        const appKey = process.env.ADZUNA_APP_KEY;
        
        if (!appId || !appKey) {
            console.log("⚠️ ADZUNA_APP_ID or ADZUNA_APP_KEY not set in .env. Skipping job fetch.");
            return [];
        }

        // Fetch jobs in India ('in'), max 3 days old, sort by date
        // 'what' = software developer fresher/junior/intern
        // 'what_exclude' = senior, lead, principal, manager
        const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${appId}&app_key=${appKey}&what_and=software&what_or=intern%20fresher%20junior%20analyst%20sde%20trainee&what_exclude=senior%20lead%20principal%20manager%20experience%20experienced%20ii%20iii%20iv&max_days_old=7&results_per_page=10&sort_by=date`;
        
        const res = await fetch(url);
        const data = await res.json();
        
        const jobs = data.results || [];

        // Adzuna maps fields differently from Remotive
        const formattedJobs = jobs.map(job => ({
            title: job.title,
            url: job.redirect_url,
            company_name: job.company?.display_name || "Unknown Company",
            job_type: job.contract_time || (job.contract_type === "contract" ? "Contract" : "Full Time")
        }));

        // Return top 5 freshest jobs
        return formattedJobs.slice(0, 5);
    } catch (e) {
        console.error("Failed fetching fresher jobs from Adzuna:", e);
        return [];
    }
};

// Fetch AI & Software articles using Dev.to API
export const fetchArticles = async () => {
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
