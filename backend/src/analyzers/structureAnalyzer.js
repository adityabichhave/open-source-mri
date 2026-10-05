export function analyzeStructure(files) {
  const structure = {};

  files.forEach((file) => {
    const parts = file.path.split("/");

    if (parts.length === 1) {
      structure["(root)"] = (structure["(root)"] || 0) + 1;
      return;
    }

    const rootFolder = parts[0];

    structure[rootFolder] =
      (structure[rootFolder] || 0) + 1;
  });

  return structure;
}