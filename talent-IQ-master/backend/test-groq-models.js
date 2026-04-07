import { Groq } from "groq-sdk";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function test() {
  try {
    // Generate 1 second of empty audio (fake) or use an existing file
    // Actually just see if the model exists by querying models list
    const models = await groq.models.list();
    const whisperModels = models.data.filter(m => m.id.includes("whisper"));
    console.log("Available Whisper Models:", whisperModels.map(m => m.id));
  } catch (e) {
    console.error(e);
  }
}
test();
