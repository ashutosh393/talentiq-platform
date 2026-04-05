import mongoose from "mongoose";
import dotenv from "dotenv";
import Problem from "../models/Problem.js";

dotenv.config();

// Temporary mock problems to establish the MongoDB baseline
const mockProblems = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array • Hash Table",
    description: {
      text: "Given an array of integers nums and an integer target, return indices of the two numbers in the array such that they add up to target.",
      notes: [
        "You may assume that each input would have exactly one solution, and you may not use the same element twice.",
        "You can return the answer in any order.",
      ],
    },
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
      { input: "nums = [3,3], target = 6", output: "[0,1]" },
    ],
    constraints: ["2 ≤ nums.length ≤ 10⁴", "-10⁹ ≤ nums[i] ≤ 10⁹", "-10⁹ ≤ target ≤ 10⁹", "Only one valid answer exists"],
    starterCode: {
      javascript: `function twoSum(nums, target) {\n  // Write your solution here\n  \n}\n\n// Test cases\nconsole.log(twoSum([2, 7, 11, 15], 9)); // Expected: [0, 1]`,
      python: `def twoSum(nums, target):\n    # Write your solution here\n    pass\n\n# Test cases\nprint(twoSum([2, 7, 11, 15], 9))  # Expected: [0, 1]`,
      java: `import java.util.*;\n\nclass Solution {\n    public static int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        \n        return new int[0];\n    }\n}`,
    },
    expectedOutput: {
      javascript: "[0,1]\n[1,2]\n[0,1]",
    },
  },
  {
    id: "valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "Easy",
    category: "String • Two Pointers",
    description: {
      text: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
      notes: ["Given a string s, return true if it is a palindrome, or false otherwise."],
    },
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: "true", explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: 's = "race a car"', output: "false", explanation: '"raceacar" is not a palindrome.' },
    ],
    constraints: ["1 ≤ s.length ≤ 2 * 10⁵"],
    starterCode: {
      javascript: `function isPalindrome(s) {\n  // Write your solution here\n  \n}`,
    },
  },
  {
    id: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Array • Dynamic Programming",
    description: {
      text: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
    },
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴"],
    starterCode: {
      javascript: `function maxSubArray(nums) {\n  // Write your solution here\n  \n}`,
    },
  }
];

export const syncProblems = async () => {
    try {
        console.log("Connecting to MongoDB for sync...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB successfully");

        // We can add actual Leetcode API fetching logic here!
        // But for baseline safety, we'll sync standard mock problems directly to DB first

        for (const prob of mockProblems) {
            await Problem.findOneAndUpdate({ id: prob.id }, prob, { upsert: true, new: true });
        }

        console.log("Successfully seeded problems to the database.");
    } catch (e) {
        console.error("Database sync failed:", e);
    } finally {
        await mongoose.disconnect();
    }
};

if (process.argv[1].includes("seedProblems.js")) {
    syncProblems();
}
