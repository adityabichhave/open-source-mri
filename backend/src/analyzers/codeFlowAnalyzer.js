function isSourceFile(path) {
  return /\.(js|jsx|ts|tsx|mjs|cjs)$/.test(path);
}

function normalizePath(path) {
  const parts = path.replace(/\\/g, "/").split("/");

  const result = [];

  for (const part of parts) {
    if (!part || part === ".") continue;

    if (part === "..") {
      result.pop();
    } else {
      result.push(part);
    }
  }

  return result.join("/");
}

function resolveImport(sourceFile, importPath, fileSet) {
  if (!importPath) {
    return null;
  }

  let basePath;

  // Next.js / TypeScript alias:
  // @/components/Hero
  if (importPath.startsWith("@/")) {
    basePath = importPath.slice(2);
  }

  // Relative import:
  // ./Hero
  // ../components/Navbar
  else if (importPath.startsWith(".")) {
    const sourceParts = sourceFile.split("/");

    sourceParts.pop();

    basePath = normalizePath(
      [...sourceParts, importPath].join("/")
    );
  }

  // Ignore external packages such as:
  // react
  // next/link
  // framer-motion
  else {
    return null;
  }

  const candidates = [
    basePath,

    `${basePath}.js`,
    `${basePath}.jsx`,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    `${basePath}.mjs`,
    `${basePath}.cjs`,

    `${basePath}/index.js`,
    `${basePath}/index.jsx`,
    `${basePath}/index.ts`,
    `${basePath}/index.tsx`
  ];

  return (
    candidates.find((candidate) =>
      fileSet.has(normalizePath(candidate))
    ) || null
  );
}

export function analyzeCodeFlow(
  files,
  sourceFiles = []
) {
  const sourcePaths = files
    .map((file) => normalizePath(file.path))
    .filter(isSourceFile);

  const fileSet = new Set(sourcePaths);

  const contentMap = new Map(
    sourceFiles.map((file) => [
      normalizePath(file.path),
      file.content || ""
    ])
  );

  const nodes = [];
  const edges = [];

  for (const path of sourcePaths) {
    nodes.push({
      id: path,

      type: "default",

      data: {
        label: path
      },

      position: {
        x: 0,
        y: 0
      }
    });

    const content = contentMap.get(path);

    if (!content) {
      continue;
    }

    /*
     * Detect:
     *
     * import x from "./file"
     * import { x } from "../services/api"
     * import "./styles.css"
     * require("./file")
     */

    const importRegex =
      /(?:import\s+(?:[\s\S]*?\s+from\s+)?|require\s*\(\s*)["']([^"']+)["']/g;

    let match;

    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];

      const target = resolveImport(
        path,
        importPath,
        fileSet
      );

      if (!target) {
        continue;
      }

      const edgeId = `${path}->${target}`;

      // Prevent duplicate edges
      if (
        edges.some((edge) => edge.id === edgeId)
      ) {
        continue;
      }

      edges.push({
        id: edgeId,

        source: path,

        target,

        type: "smoothstep",

        animated: false
      });
    }
  }

  return {
    nodes,
    edges
  };
}