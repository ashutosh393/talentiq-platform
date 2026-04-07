import fetch from "node-fetch";
import Problem from "../models/Problem.js";

// --- CONFIGURATION --- //
const FETCH_LIMIT = process.env.FETCH_LIMIT || 10;          // How many problems to fetch per cycle
const RATE_DELAY_MS = process.env.RATE_DELAY_MS || 3000;    // Delay between each request (in milliseconds)
// --------------------- //

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const autoFetchLeetCodeProblems = async () => {
    try {
        console.log(`🔄 Starting Auto-Fetch cycle. (Targeting ${FETCH_LIMIT} problems with a ${RATE_DELAY_MS}ms rate-limit gap)`);

        // Use Official LeetCode GraphQL to fetch the raw list.
        // This avoids the 429 'Too Many Requests' IP ban from free Alfa-Render instances
        const listQuery = {
            query: `query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) { 
              questionList( categorySlug: $categorySlug limit: $limit skip: $skip filters: $filters ) { 
                data { titleSlug difficulty } 
              } 
            }`,
            variables: { categorySlug: "", skip: 0, limit: FETCH_LIMIT, filters: {} }
        };

        const listResponse = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            },
            body: JSON.stringify(listQuery)
        });
        
        if (!listResponse.ok) {
            const text = await listResponse.text();
            console.error(`[Auto-Fetch] LeetCode List API returned ${listResponse.status}: ${text.substring(0, 100)}`);
            return;
        }

        let listData;
        try {
            listData = await listResponse.json();
        } catch (err) {
            console.error("[Auto-Fetch] Failed to parse JSON from problem list response.");
            return;
        }

        const problems = listData?.data?.questionList?.data;
        if (!problems || !Array.isArray(problems)) {
            console.error("Failed to fetch the problem index. Invalid response format from LeetCode.");
            return;
        }

        let addedCount = 0;

        for (const meta of problems) {
            const slug = meta.titleSlug || meta.id;

            // Skip if it already exists
            const exists = await Problem.findOne({ id: slug });
            if (exists) continue;

            console.log(`[Auto-Fetch] Extracting details for: ${slug}...`);
            await delay(RATE_DELAY_MS);

            // Use Official LeetCode GraphQL directly for reliable, rate-limit-evading extraction
            const graphQLQuery = {
                operationName: "questionData",
                variables: { titleSlug: slug },
                query: `query questionData($titleSlug: String!) {
                  question(titleSlug: $titleSlug) {
                    title
                    titleSlug
                    content
                    difficulty
                    topicTags { name }
                    codeSnippets { langSlug code }
                  }
                }`
            };

            const detailResponse = await fetch("https://leetcode.com/graphql", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
                },
                body: JSON.stringify(graphQLQuery)
            });

            let gqlData = null;
            try {
                gqlData = await detailResponse.json();
            } catch (err) {
                console.warn(`[Auto-Fetch] Failed to parse response for ${slug}`);
                continue;
            }
            
            const detailData = gqlData?.data?.question;
            if (!detailData || !detailData.content) continue;

            const snippets = detailData.codeSnippets || [];
            const jsSnippet = snippets.find(s => s.langSlug === "javascript")?.code || "/* Write your JavaScript solution here */";
            const pySnippet = snippets.find(s => s.langSlug === "python3")?.code || snippets.find(s => s.langSlug === "python")?.code || "# Write your Python solution here";
            const javaSnippet = snippets.find(s => s.langSlug === "java")?.code || "class Solution {\n    // Write your Java solution here \n}";

            const newProblem = new Problem({
                id: detailData.titleSlug,
                title: detailData.title,
                difficulty: detailData.difficulty || meta.difficulty,
                category: (detailData.topicTags || []).map(t => t.name).join(" • "),
                description: {
                    text: detailData.content,
                    notes: []
                },
                examples: [], 
                constraints: [], 
                starterCode: {
                    javascript: jsSnippet,
                    python: pySnippet,
                    java: javaSnippet
                }
            });

            await newProblem.save();
            addedCount++;
            console.log(`✅ [Auto-Fetch] Stored: ${newProblem.title}`);
        }

        console.log(`✅ Auto-Fetch cycle completed. Added ${addedCount} new problems.`);

    } catch (e) {
        console.error("⚠️ Error in auto-fetch:", e.message);
    }
};
