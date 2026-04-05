import mongoose from "mongoose";
import dotenv from "dotenv";
import fetch from "node-fetch";
import Problem from "../models/Problem.js";

dotenv.config();

// The definitive "Blind 75" list covering all major frontend DSA topics efficiently
const POPULAR_SLUGS = [
  // Array
  "two-sum", "best-time-to-buy-and-sell-stock", "contains-duplicate", "product-of-array-except-self", 
  "maximum-subarray", "maximum-product-subarray", "find-minimum-in-rotated-sorted-array", 
  "search-in-rotated-sorted-array", "3sum", "container-with-most-water",
  
  // Binary / Bitwise
  "sum-of-two-integers", "number-of-1-bits", "counting-bits", "missing-number", "reverse-bits",
  
  // Dynamic Programming
  "climbing-stairs", "coin-change", "longest-increasing-subsequence", "longest-common-subsequence", 
  "word-break", "combination-sum-iv", "house-robber", "house-robber-ii", "decode-ways", 
  "unique-paths", "jump-game",
  
  // Graph
  "clone-graph", "course-schedule", "pacific-atlantic-water-flow", "number-of-islands", 
  "longest-consecutive-sequence",
  
  // Intervals
  "insert-interval", "merge-intervals", "non-overlapping-intervals",
  
  // Linked List
  "reverse-linked-list", "linked-list-cycle", "merge-two-sorted-lists", "merge-k-sorted-lists", 
  "remove-nth-node-from-end-of-list", "reorder-list",
  
  // Matrix
  "set-matrix-zeroes", "spiral-matrix", "rotate-image", "word-search",
  
  // String
  "longest-substring-without-repeating-characters", "longest-repeating-character-replacement", 
  "minimum-window-substring", "valid-anagram", "group-anagrams", "valid-parentheses", 
  "valid-palindrome", "longest-palindromic-substring", "palindromic-substrings",
  
  // Tree & Trie
  "maximum-depth-of-binary-tree", "same-tree", "invert-binary-tree", "binary-tree-maximum-path-sum", 
  "binary-tree-level-order-traversal", "serialize-and-deserialize-binary-tree", "subtree-of-another-tree", 
  "construct-binary-tree-from-preorder-and-inorder-traversal", "validate-binary-search-tree", 
  "kth-smallest-element-in-a-bst", "lowest-common-ancestor-of-a-binary-search-tree",
  "implement-trie-prefix-tree", "design-add-and-search-words-data-structure", "word-search-ii",
  
  // Heap
  "top-k-frequent-elements", "find-median-from-data-stream"
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const seedPopularProblems = async () => {
    try {
        console.log("Connecting to MongoDB Atlas for Popular Sync...");
        await mongoose.connect(process.env.DB_URL);
        console.log("Connected to MongoDB successfully");

        let savedCount = 0;

        for (const slug of POPULAR_SLUGS) {
            // Check if already in database
            const exists = await Problem.findOne({ id: slug });
            if (exists) {
                console.log(`Skipping ${slug} (already exists)`);
                continue;
            }

            console.log(`Extracting details for: ${slug}...`);
            await delay(3000); // 3-second delay to evade ALFA API rate limits rendering HTML errors

            const graphQLQuery = {
                operationName: "questionData",
                variables: { titleSlug: slug },
                query: `query questionData($titleSlug: String!) {
                  question(titleSlug: $titleSlug) {
                    title
                    titleSlug
                    content
                    difficulty
                    topicTags {
                      name
                    }
                    codeSnippets {
                      langSlug
                      code
                    }
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
                console.warn(`Failed to parse response for ${slug}`);
                continue;
            }
            
            const detailData = gqlData?.data?.question;

            if (!detailData || !detailData.content) {
                console.warn(`Could not extract problem details for: ${slug}. It might be premium-locked.`);
                continue;
            }

            // Extract snippets
            const snippets = detailData.codeSnippets || [];
            const jsSnippet = snippets.find(s => s.langSlug === "javascript")?.code || "/* Write your JavaScript solution here */";
            const pySnippet = snippets.find(s => s.langSlug === "python3")?.code || snippets.find(s => s.langSlug === "python")?.code || "# Write your Python solution here";
            const javaSnippet = snippets.find(s => s.langSlug === "java")?.code || "class Solution {\n    // Write your Java solution here \n}";

            const newProblem = new Problem({
                id: detailData.titleSlug,
                title: detailData.title,
                difficulty: detailData.difficulty,
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
            savedCount++;
            console.log(`✅ Saved: ${newProblem.title} [${newProblem.category}]`);
        }

        console.log(`\n🎉 Popular Problems Extraction Complete! Successfully extracted and saved ${savedCount} new problems.`);

    } catch (e) {
        console.error("Database sync failed:", e);
    } finally {
        await mongoose.disconnect();
    }
};

if (process.argv[1].includes("seedPopularProblems.js")) {
    seedPopularProblems();
}
