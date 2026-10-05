import {
  getRepository,
  getRepositoryTree,
  getLanguages,
  getFileContent
} from "./githubService.js";

import { analyzeStructure } from "../analyzers/structureAnalyzer.js";
import { analyzeFiles } from "../analyzers/fileAnalyzer.js";
import { detectArchitecture } from "./architectureService.js";
import { analyzeCodeFlow } from "../analyzers/codeFlowAnalyzer.js";

function parseGitHubUrl(url) {
  const parsed = new URL(url);

  if (parsed.hostname !== "github.com") {
    throw new Error("Only GitHub repositories are supported");
  }

  const parts = parsed.pathname.split("/").filter(Boolean);

  if (parts.length < 2) {
    throw new Error("Invalid GitHub repository URL");
  }

  return {
    owner: parts[0],
    repo: parts[1].replace(".git", "")
  };
}

function isCodeFile(path) {
  return /\.(js|jsx|ts|tsx|mjs|cjs|py|java)$/.test(
    path.toLowerCase()
  );
}

export async function analyzeRepository(url) {
  const { owner, repo } = parseGitHubUrl(url);

  const repository = await getRepository(owner, repo);

  const [tree, languages] = await Promise.all([
    getRepositoryTree(
      owner,
      repo,
      repository.default_branch
    ),
    getLanguages(owner, repo)
  ]);

  const files = (tree.tree || []).filter(
    (item) => item.type === "blob"
  );

  const structure = analyzeStructure(files);
  const fileAnalysis = analyzeFiles(files);
  const architecture = detectArchitecture(files);

  /*
   * Select actual source-code files.
   *
   * Supports:
   * - src/
   * - app/
   * - pages/
   * - components/
   * - services/
   * - lib/
   * - utils/
   * - hooks/
   */

  const sourceCandidates = files.filter((file) => {
    const path = file.path.toLowerCase();

    if (!isCodeFile(path)) {
      return false;
    }

    if (
      path.includes("node_modules/") ||
      path.includes(".next/") ||
      path.includes("dist/") ||
      path.includes("build/")
    ) {
      return false;
    }

    return (
      path.startsWith("src/") ||
      path.startsWith("app/") ||
      path.startsWith("pages/") ||
      path.startsWith("components/") ||
      path.startsWith("services/") ||
      path.startsWith("lib/") ||
      path.startsWith("utils/") ||
      path.startsWith("hooks/") ||
      path === "app.tsx" ||
      path === "app.jsx" ||
      path === "app.ts" ||
      path === "app.js" ||
      path === "main.tsx" ||
      path === "main.jsx" ||
      path === "main.ts" ||
      path === "main.js"
    );
  });

  /*
   * Limit downloaded files so large repositories
   * don't become extremely slow.
   */

  const selectedFiles = sourceCandidates.slice(0, 30);

  const sourceFiles = [];

  for (const file of selectedFiles) {
    try {
      const content = await getFileContent(
        owner,
        repo,
        file.path,
        repository.default_branch
      );

      sourceFiles.push({
        path: file.path,
        content: content.slice(0, 12000)
      });
    } catch (error) {
      console.log(
        `Could not read ${file.path}: ${error.message}`
      );
    }
  }

  /*
   * IMPORTANT:
   * Code flow must be analyzed AFTER sourceFiles
   * have been downloaded.
   */

  const codeFlow = analyzeCodeFlow(
    files,
    sourceFiles
  );

  return {
    repository: {
      name: repository.name,
      fullName: repository.full_name,
      description: repository.description,
      stars: repository.stargazers_count,
      forks: repository.forks_count,
      branch: repository.default_branch
    },

    stats: {
      files: files.length,
      directories: Object.keys(structure).length,
      languages: Object.keys(languages).length
    },

    languages,
    fileTypes: fileAnalysis.extensions,
    importantFiles: fileAnalysis.importantFiles,
    architecture,
    structure,

    sourceFiles,

    codeFlow
  };
}