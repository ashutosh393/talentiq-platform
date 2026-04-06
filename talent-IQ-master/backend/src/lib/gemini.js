import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV } from "./env.js";

const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

/**
 * Parse resume text and generate tailored interview questions + extract skills
 */
export async function generateInterviewQuestions(resumeText) {
  const prompt = `You are an expert technical interviewer. Analyze the following resume and:
1. Extract all technical and soft skills mentioned
2. Generate exactly 8 thoughtful, tailored interview questions based on their actual experience, projects, and skills

Resume:
"""
${resumeText}
"""

Respond ONLY with valid JSON in this exact format (no markdown fences):
{
  "skills": ["skill1", "skill2", ...],
  "questions": [
    { "id": 1, "question": "...", "category": "Technical|Behavioral|Project", "difficulty": "Easy|Medium|Hard" },
    ...
  ],
  "resumeScore": 72
}

resumeScore is a number 0-100 rating the strength of the resume.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // Strip markdown code fences if present
  const cleaned = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // Try to extract JSON from the text
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Failed to parse Gemini response as JSON");
  }
}

/**
 * Generate a brief follow-up or acknowledgment after a user's answer
 */
export async function generateFollowUp(question, answer, isSkipped = false) {
  if (isSkipped) {
    return { followUp: "Alright, let's move to the next question.", skipped: true };
  }

  const prompt = `You are an AI technical interviewer conducting a mock interview.
The candidate answered a question. Provide a brief, professional 1-2 sentence acknowledgment or follow-up.
Be encouraging but honest. If the answer is vague, ask for one specific clarification.

Question: "${question}"
Candidate's Answer: "${answer}"

Respond ONLY with valid JSON (no markdown):
{ "followUp": "..." }`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const cleaned = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    return { followUp: "Thank you for your answer. Let's continue." };
  }
}

/**
 * Evaluate all Q&A pairs and return a detailed scorecard
 */
export async function evaluateInterview(qaList, resumeText) {
  const qaFormatted = qaList
    .map((qa, i) =>
      qa.skipped
        ? `Q${i + 1}: ${qa.question}\nAnswer: [SKIPPED]`
        : `Q${i + 1}: ${qa.question}\nAnswer: ${qa.answer}`
    )
    .join("\n\n");

  const prompt = `You are an expert technical interviewer. Evaluate the following mock interview for a software developer.

Resume context:
"""
${resumeText.substring(0, 1500)}
"""

Interview Q&A:
${qaFormatted}

Provide a comprehensive evaluation. Respond ONLY with valid JSON (no markdown fences):
{
  "overallScore": 78,
  "grade": "B+",
  "summary": "Overall 2-3 sentence summary of the candidate's performance",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["area for improvement 1", "area for improvement 2"],
  "questionScores": [
    {
      "questionId": 1,
      "score": 80,
      "feedback": "2-sentence feedback on this specific answer",
      "skipped": false
    }
  ],
  "hiringRecommendation": "Strong Consider|Consider|Needs Work|Not Ready"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const cleaned = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Failed to parse evaluation response");
  }
}
