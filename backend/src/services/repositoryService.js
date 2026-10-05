import {
  getRepository,
  getRepositoryTree,
  getLanguages,
  getFileContent
} from "./githubService.js";

import { analyzeStructure } from "../analyzers/structureAnalyzer.js";
import { analyzeFiles } from "../analyzers/fileAnalyzer.js";
import { detectArchitecture } from "./architectureService.js";

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

export async function analyzeRepository(url) {
  const { owner, repo } = parseGitHubUrl(url);

  const repository = await getRepository(owner, repo);

  const [tree, languages] = await Promise.all([
    getRepositoryTree(owner, repo, repository.default_branch),
    getLanguages(owner, repo)
  ]);

  const files = (tree.tree || []).filter(
    (item) => item.type === "blob"
  );

  const structure = analyzeStructure(files);
  const fileAnalysis = analyzeFiles(files);
  const architecture = detectArchitecture(files);

  const sourceCandidates = files.filter((file) => {
    const path = file.path.toLowerCase();

    return (
      path === "package.json" ||
      path === "readme.md" ||
      (
        path.includes("src/") &&
        (
          path.endsWith(".js") ||
          path.endsWith(".jsx") ||
          path.endsWith(".ts") ||
          path.endsWith(".tsx") ||
          path.endsWith(".py") ||
          path.endsWith(".java")
        )
      )
    );
  });

  const selectedFiles = sourceCandidates.slice(0, 8);

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
      console.log(`Could not read ${file.path}`);
    }
  }

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
    sourceFiles
  };
}