import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export async function analyzeRepositoryWithAI(repositoryData) {
  const prompt = `
You are the AI engine of Open Source MRI.

Analyze this GitHub repository and explain it to a developer.

Repository metadata:
${JSON.stringify({
  repository: repositoryData.repository,
  stats: repositoryData.stats,
  languages: repositoryData.languages,
  fileTypes: repositoryData.fileTypes,
  importantFiles: repositoryData.importantFiles,
  architecture: repositoryData.architecture,
  structure: repositoryData.structure
}, null, 2)}

Actual source files:
${JSON.stringify(repositoryData.sourceFiles, null, 2)}

Give the analysis in these sections:

1. Project Purpose
2. Technology Stack
3. Architecture
4. Important Files and Their Responsibilities
5. Code Flow
6. How the Main Components Work Together
7. Potential Risks or Issues
8. How a New Developer Should Understand This Project

For Code Flow, use the actual source code provided.

Explain:
- where execution starts
- which important files call or depend on each other
- how data/request flow moves through the application
- important functions or modules involved

Only claim relationships that can be supported by the provided source code.
Do not invent functions, files, dependencies, or behavior.

Be technically accurate.

Do not invent files, technologies, or functionality that are not present
in the provided repository data.
`;

  const interaction = await ai.interactions.create({
    model: "gemini-3.8-flash",
    input: prompt
  });

  return interaction.output_text;
}