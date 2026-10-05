const GITHUB_API = "https://api.github.com";

async function githubRequest(endpoint) {
  const response = await fetch(`${GITHUB_API}${endpoint}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "Open-Source-MRI"
    }
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json();
}

export async function getRepository(owner, repo) {
  return githubRequest(`/repos/${owner}/${repo}`);
}

export async function getRepositoryTree(owner, repo, branch) {
  return githubRequest(
    `/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
  );
}

export async function getLanguages(owner, repo) {
  return githubRequest(`/repos/${owner}/${repo}/languages`);
}

export async function getFileContent(owner, repo, path, branch) {
  const file = await githubRequest(
    `/repos/${owner}/${repo}/contents/${path}?ref=${branch}`
  );

  if (!file.content) {
    return "";
  }

  return Buffer.from(file.content, "base64").toString("utf-8");
}