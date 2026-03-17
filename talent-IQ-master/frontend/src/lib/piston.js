import axiosInstance from "./axios";

const LANGUAGE_VERSIONS = {
  javascript: "nodejs",
  python: "python",
  java: "java",
  cpp: "cpp",
  csharp: "csharp",
  go: "go",
  rust: "rust",
};

export async function executeCode(language, code) {
  try {
    const languageConfig = LANGUAGE_VERSIONS[language];
    if (!languageConfig) {
      return { success: false, error: `Unsupported language: ${language}` };
    }

    const response = await axiosInstance.post("/execute", {
      language: languageConfig,
      code,
    });

    const data = response.data;

    if (data.status === "failed") {
      return {
        success: false,
        error: data.exception || "Execution failed",
      };
    }

    return {
      success: true,
      output: data.stdout || "",
      stderr: data.stderr || "",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Code execution failed",
    };
  }
}

