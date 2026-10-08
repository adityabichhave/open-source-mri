import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});
function withTimeout(promise, ms = 15000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("Gemini request timed out")),
        ms
      )
    )
  ]);
}

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

    const interaction = await withTimeout(
  ai.interactions.create({
    model: "gemini-3.8-flash",
    input: prompt
  }),
  15000
);

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

export function buildRepositoryUnderstanding(repositoryData) {
  const {
    repository,
    stats,
    languages = {},
    architecture = {},
    importantFiles = [],
    structure = {}
  } = repositoryData;

  const sortedLanguages = Object.entries(languages)
    .sort((a, b) => b[1] - a[1]);

  const totalBytes = sortedLanguages.reduce(
    (sum, [, bytes]) => sum + bytes,
    0
  );

  const primaryLanguage =
    sortedLanguages.length > 0
      ? sortedLanguages[0][0]
      : "Unknown";

  const primaryBytes =
    sortedLanguages.length > 0
      ? sortedLanguages[0][1]
      : 0;

  const primaryPercentage =
    totalBytes > 0
      ? ((primaryBytes / totalBytes) * 100).toFixed(1)
      : "0.0";

  const detectedArchitecture = Object.entries(architecture)
    .filter(([, value]) => value)
    .map(([key, value]) => {
      if (value === true) {
        return key;
      }

      return `${key}: ${value}`;
    });

  const topDirectories = Object.entries(structure)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return `
REPOSITORY OVERVIEW

${repository.name} is a ${primaryLanguage}-based software repository.

The repository contains ${stats.files} files across ${
    stats.languages
  } detected languages and ${stats.directories} directories.


TECHNOLOGY PROFILE

Primary Language:
${primaryLanguage} (${primaryPercentage}%)

Detected Languages:
${sortedLanguages
  .map(([language, bytes]) => {
    const percentage =
      totalBytes > 0
        ? ((bytes / totalBytes) * 100).toFixed(1)
        : "0.0";

    return `• ${language}: ${percentage}%`;
  })
  .join("\n")}


ARCHITECTURE

${
  detectedArchitecture.length > 0
    ? detectedArchitecture
        .map((item) => `• ${item}`)
        .join("\n")
    : "• No specific architecture patterns detected."
}


IMPORTANT FILES

${
  importantFiles.length > 0
    ? importantFiles.map((file) => `• ${file}`).join("\n")
    : "• No important files detected."
}


REPOSITORY STRUCTURE

${
  topDirectories.length > 0
    ? topDirectories
        .map(([folder, count]) => `• ${folder}: ${count} files`)
        .join("\n")
    : "• Structure information unavailable."
  }


MRI STATUS

✓ Repository scanned
✓ File structure analyzed
✓ Technology profile detected
✓ Architecture analyzed
✓ Code flow analyzed
• Generative AI explanation: optional
`.trim();
}