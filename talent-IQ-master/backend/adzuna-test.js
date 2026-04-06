import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const check = async (q) => {
    const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${process.env.ADZUNA_APP_ID}&app_key=${process.env.ADZUNA_APP_KEY}&${q}`;
    try {
        const res = await fetch(url);
        const d = await res.json();
        console.log("Query:", q);
        console.log("Count:", d.count);
        console.log("First Result:", d.results && d.results[0] ? d.results[0].title : "None");
        console.log("---");
    } catch(e) {
        console.error(q, e.message);
    }
};

(async () => {
    await check('what=intern%20OR%20analyst%20OR%20fresher%20OR%20"SDE%201"&what_exclude=senior%20lead%20principal%20manager%20experience');
    await check('what=intern%20OR%20fresher%20OR%20"software%20engineer"&what_exclude=senior%20lead%20principal%20manager');
    await check('what_and=software&what_or=intern%20fresher%20sde%20analyst&what_exclude=senior%20lead%20principal%20manager');
})();
