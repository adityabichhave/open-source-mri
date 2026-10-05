import {
  getRepository,
  getRepositoryTree,
  getLanguages
} from "./githubService.js";

import { analyzeFiles } from "../analyzers/fileAnalyzer.js";
import { detectArchitecture } from "./architectureService.js";
import { analyzeStructure } from "../analyzers/structureAnalyzer.js";

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

  const fileAnalysis = analyzeFiles(files);
  const architecture = detectArchitecture(files);

const structure = analyzeStructure(files);

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
    structure
  };
}