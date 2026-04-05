import mongoose from "mongoose";

const exampleSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  explanation: { type: String },
});

const problemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // e.g. "two-sum"
    title: { type: String, required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    category: { type: String }, 
    description: {
      text: { type: String, required: true },
      notes: [{ type: String }]
    },
    examples: [exampleSchema],
    constraints: [{ type: String }],
    starterCode: {
      javascript: String,
      python: String,
      java: String,
    },
    expectedOutput: {
      javascript: String,
      python: String,
      java: String,
    }
  },
  { timestamps: true }
);

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;
