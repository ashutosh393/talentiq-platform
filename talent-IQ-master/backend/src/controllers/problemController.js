import Problem from "../models/Problem.js";

// Get all problems 
export const getProblems = async (req, res) => {
  try {
    const problems = await Problem.find().select("-description -examples -starterCode -expectedOutput").sort({ createdAt: 1 });
    res.status(200).json(problems);
  } catch (error) {
    console.error("Error in getProblems controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a single problem by ID (slug)
export const getProblemById = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await Problem.findOne({ id });
    
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }
    
    res.status(200).json(problem);
  } catch (error) {
    console.error("Error in getProblemById controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
