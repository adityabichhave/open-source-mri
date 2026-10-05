import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export async function analyzeRepositoryWithAI(repositoryData) {
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
}