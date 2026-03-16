const ONECOMPILER_API = "https://onecompiler.com/api/v1";
const ONECOMPILER_API_KEY = import.meta.env.VITE_ONECOMPILER_API_KEY;

const LANGUAGE_VERSIONS = {
  javascript: { language: "nodejs" },
  python: { language: "python" },
  java: { language: "java" },
  cpp: { language: "cpp" },
  csharp: { language: "csharp" },
  go: { language: "go" },
  rust: { language: "rust" },
};

export async function executeCode(language, code) {
  if (!ONECOMPILER_API_KEY) {
    return {
      success: false,
      error: "OneCompiler API key not configured. Set VITE_ONECOMPILER_API_KEY in .env",
    };
  }
  try {
    const languageConfig = LANGUAGE_VERSIONS[language];
    if (!languageConfig) {
      return { success: false, error: `Unsupported language: ${language}` };
    }

    const response = await fetch(
      `${ONECOMPILER_API}/run?access_token=${ONECOMPILER_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: languageConfig.language,
          files: [
            {
              name: `main.${getFileExtension(language)}`,
              content: code,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      return { success: false, error: `HTTP error! status: ${response.status}` };
    }

    const data = await response.json();

    if (data.status === "failed") {
      return { success: false, error: data.exception || "Execution failed" };
    }

    return {
      success: true,
      output: data.stdout || "",
      stderr: data.stderr || "",
    };
  } catch (error) {
    return { success: false, error: error.message || "Code execution failed" };
  }
}

function getFileExtension(language) {
  const extensions = {
    javascript: "js",
    python: "py",
    java: "java",
    cpp: "cpp",
    csharp: "cs",
    go: "go",
    rust: "rs",
  };
  return extensions[language] || language;
}