export function detectArchitecture(files) {
  const paths = files.map((file) => file.path);

  const hasReact =
    paths.some((path) =>
      path.endsWith(".jsx") || path.endsWith(".tsx")
    );

  const hasNode =
    paths.includes("package.json") ||
    paths.some((path) =>
      path.includes("server.js") ||
      path.includes("server.ts")
    );

  const hasPython =
    paths.some((path) => path.endsWith(".py"));

  const hasJava =
    paths.some((path) => path.endsWith(".java"));

  const hasDocker =
    paths.some((path) =>
      path.toLowerCase().includes("dockerfile")
    );

  return {
    frontend: hasReact ? "React-based" : null,
    backend: hasNode ? "Node.js-based" : null,
    python: hasPython,
    java: hasJava,
    docker: hasDocker
  };
}