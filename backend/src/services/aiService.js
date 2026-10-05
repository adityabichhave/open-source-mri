import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

function isQuotaError(error) {
  const message = error?.message?.toLowerCase() || "";

  return (
    message.includes("429") ||
    message.includes("quota") ||
    message.includes("rate limit") ||
    message.includes("resource_exhausted")
  );
}

export async function analyzeRepositoryWithAI(repositoryData) {
  try {
    const prompt = `
You are the AI engine of Open Source MRI.

Analyze this GitHub repository and explain it to a developer.

Repository data:
${JSON.stringify(repositoryData, null, 2)}

Give the analysis in these sections:

1. Project Purpose
2. Technology Stack
3. Architecture
4. Important Parts
5. Repository Structure
6. Potential Risks or Issues
7. How a new developer should understand this project

Be technically accurate.

Do not invent files, technologies, or functionality that are not present
in the provided repository data.
`;

    const interaction = await ai.interactions.create({
      model: "gemini-3.8-flash",
      input: prompt
    });

    return interaction.output_text;

  } catch (error) {
    console.error("Gemini repository analysis failed:", error.message);

    if (isQuotaError(error)) {
      return `
AI analysis is temporarily unavailable because the Gemini API quota
has been reached.

The repository scan, file analysis, architecture detection and code flow
analysis are still available.

Please try AI analysis again after the Gemini quota resets.
`;
    }

    return `
AI analysis is temporarily unavailable.

The repository scan and structural analysis are still available.
`;
  }
}

export async function analyzeFileWithAI(filePath, content) {
  try {
    const prompt = `
You are the AI engine of Open Source MRI.

Explain this source file to a developer.

File:
${filePath}

Source code:
${content}

Explain:

1. What this file does
2. Its main responsibility
3. Important functions/components
4. Important imports and dependencies
5. How this file fits into the project
6. What a developer should understand before modifying it

Be technically accurate.
Do not invent functionality that is not present in the code.
`;

    const interaction = await ai.interactions.create({
      model: "gemini-3.8-flash",
      input: prompt
    });

    return interaction.output_text;

  } catch (error) {
    console.error("Gemini file explanation failed:", error.message);

    if (isQuotaError(error)) {
      return `
AI explanation is temporarily unavailable because the Gemini API quota
has been reached.

Try again after the quota resets.
`;
    }

    return `
AI explanation is temporarily unavailable right now.
`;
  }
}