import { analyzeRepository } from "../services/repositoryService.js";
import { analyzeRepositoryWithAI } from "../services/aiService.js";

export async function scanRepository(req, res) {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "Repository URL is required"
      });
    }

    console.log("Scanning repository...");

    const repositoryData = await analyzeRepository(url);

    console.log("Running AI analysis...");

    const aiAnalysis =
      await analyzeRepositoryWithAI(repositoryData);

    res.json({
      success: true,
      data: {
        ...repositoryData,
        aiAnalysis
      }
    });

  } catch (error) {
    console.error("Scan error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Repository scan failed"
    });
  }
}

export async function explainFile(req, res) {
  try {
    const { path, content } = req.body;

    if (!path || !content) {
      return res.status(400).json({
        success: false,
        message: "File path and content are required"
      });
    }

    const { analyzeFileWithAI } =
      await import("../services/aiService.js");

    const explanation =
      await analyzeFileWithAI(path, content);

    res.json({
      success: true,
      explanation
    });

  } catch (error) {
    console.error("File explanation error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "File explanation failed"
    });
  }
}