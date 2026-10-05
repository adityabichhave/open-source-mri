export function analyzeFiles(files) {
  const extensions = {};
  const importantFiles = [];

  const importantNames = [
    "package.json",
    "README.md",
    "Dockerfile",
    "docker-compose.yml",
    "vite.config.js",
    "next.config.js",
    "tsconfig.json"
  ];

  files.forEach((file) => {
    const parts = file.path.split(".");

    if (parts.length > 1) {
      const extension = parts.pop().toLowerCase();

      extensions[extension] =
        (extensions[extension] || 0) + 1;
    }

    const fileName = file.path.split("/").pop();

    if (importantNames.includes(fileName)) {
      importantFiles.push(file.path);
    }
  });

  return {
    extensions,
    importantFiles
  };
}