import Groq from "groq-sdk";
import fs from "fs";
import { ENV } from "./env.js";

const groq = new Groq({ apiKey: ENV.GROQ_API_KEY });
const MODEL = "llama-3.3-70b-versatile"; // High performance, extremely fast on Groq

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
  "skills": ["skill1", "skill2"],
  "questions": [
    { "id": 1, "question": "...", "category": "Technical|Behavioral|Project", "difficulty": "Easy|Medium|Hard" }
  ],
  "resumeScore": 72
}

resumeScore is a number 0-100 rating the strength of the resume.`;

  const result = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: MODEL,
    temperature: 0.3,
    response_format: { type: "json_object" }
  });

  const text = result.choices[0]?.message?.content || "{}";
  
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Failed to parse AI response as JSON");
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

  try {
    const result = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: MODEL,
      temperature: 0.7,
      response_format: { type: "json_object" },
      max_tokens: 150
    });
    
    return JSON.parse(result.choices[0]?.message?.content || '{"followUp": ""}');
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

  const result = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: MODEL,
    temperature: 0.3,
    response_format: { type: "json_object" }
  });
  
  const text = result.choices[0]?.message?.content || "{}";
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Failed to parse evaluation response");
  }
}

/**
 * Transcribe an audio file using Groq Whisper
 */
export async function transcribeAudio(audioFilePath) {
  try {
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(audioFilePath),
      model: "whisper-large-v3-turbo",
      response_format: "json",
      language: "en"
    });
    return transcription.text;
  } catch (err) {
    console.error("Groq Whisper error:", err);
    throw new Error("Failed to transcribe audio.");
  }
}
