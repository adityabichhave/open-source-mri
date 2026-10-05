import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateAIAnalysis(prompt) {
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Gemini attempt ${attempt}/${maxRetries}`);

      const interaction = await ai.interactions.create({
        model: "gemini-3.8-flash",
        input: prompt
      });

      return interaction.output_text;

    } catch (error) {
      console.error(
        `Gemini attempt ${attempt} failed:`,
        error.message
      );

      if (attempt === maxRetries) {
  if (
    error.message?.includes("429") ||
    error.message?.includes("Rate limit") ||
    error.message?.includes("quota")
  ) {
    return `
AI analysis is temporarily unavailable because the Gemini API
daily request limit has been reached.

The repository scan itself completed successfully.
Repository structure, architecture, files, and source analysis
are still available.

AI analysis will become available again when the API quota resets.
`;
  }

  throw error;
}

      const delay = 2000 * Math.pow(2, attempt - 1);

      console.log(
        `Retrying Gemini in ${delay / 1000} seconds...`
      );

      await sleep(delay);
    }
  }
}

export async function analyzeRepositoryWithAI(repositoryData) {
  const prompt = `
You are the AI engine of Open Source MRI.

Analyze this GitHub repository and explain it to a developer.

Repository metadata:
${JSON.stringify(
  {
    repository: repositoryData.repository,
    stats: repositoryData.stats,
    languages: repositoryData.languages,
    fileTypes: repositoryData.fileTypes,
    importantFiles: repositoryData.importantFiles,
    architecture: repositoryData.architecture,
    structure: repositoryData.structure
  },
  null,
  2
)}

Actual source files:
${JSON.stringify(
  repositoryData.sourceFiles,
  null,
  2
)}

Give the analysis in these sections:

1. Project Purpose
2. Technology Stack
3. Architecture
4. Important Files and Their Responsibilities
5. Code Flow
6. How the Main Components Work Together
7. Potential Risks or Issues
8. How a New Developer Should Understand This Project

For Code Flow:

- Use the actual source code provided.
- Explain where execution starts.
- Explain important functions and modules.
- Explain how data or requests move through the application.
- Explain important relationships between files.

For "How the Main Components Work Together":

- Explain how important files/modules interact.
- Mention actual file names when supported by the source code.
- Do not invent relationships that cannot be verified.

Rules:

- Only use information supported by the repository data and source code.
- Do not invent files.
- Do not invent functions.
- Do not invent dependencies.
- Do not invent architecture.
- Clearly distinguish documented behavior from inferred behavior.
- Be technically accurate.
- Prefer concrete file names and code references.
`;

  return generateAIAnalysis(prompt);
}