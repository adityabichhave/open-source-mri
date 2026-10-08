import {
  FolderTree,
  GitBranch,
  FileCode2,
  Brain,
  Star,
  GitFork,
  Layers3,
  Code2
} from "lucide-react";

import ArchitectureGraph from "./ArchitectureGraph";

function getLanguageColor(language) {
  const colors = {
    TypeScript: "#3178c6",
    JavaScript: "#f0db4f",
    CSS: "#8b5cf6",
    HTML: "#e44d26",
    Python: "#3776ab",
    Java: "#e76f00",
    C: "#555555",
    "C++": "#00599c"
  };

  return colors[language] || "#64748b";
}

function ReportDashboard({ result }) {
  const stats = [
    {
      label: "Files",
      value: result.stats.files,
      icon: FileCode2,
      color: "#00b894"
    },
    {
      label: "Languages",
      value: result.stats.languages,
      icon: GitBranch,
      color: "#4169ff"
    },
    {
      label: "Directories",
      value: result.stats.directories,
      icon: FolderTree,
      color: "#925cff"
    }
  ];

  const languages = Object.entries(result.languages || {})
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="report-dashboard">

      {/* =================================================
          REPOSITORY IDENTITY
      ================================================= */}

      <section className="repo-identity">

        <div className="repo-identity-main">

          <div className="repo-kicker">
            <span className="live-pulse" />
            REPOSITORY MRI
          </div>

          <h2>{result.repository.name}</h2>

          <div className="repo-full-name">
            {result.repository.fullName}
          </div>

          {result.repository.description && (
            <p className="repo-description">
              {result.repository.description}
            </p>
          )}

          <div className="repo-tags">

            {languages.slice(0, 5).map(([language]) => (
              <span
                className="language-badge"
                key={language}
              >
                <i
                  style={{
                    background: getLanguageColor(language)
                  }}
                />

                {language}
              </span>
            ))}

            {languages.length > 5 && (
              <span className="language-badge more">
                +{languages.length - 5} MORE
              </span>
            )}

          </div>

        </div>

        <div className="repo-identity-side">

          <div className="repo-score">
            <span>BRANCH</span>

            <strong>
              {result.repository.branch}
            </strong>
          </div>

          <div className="repo-social-stats">

            <div>
              <Star size={15} />
              <strong>
                {result.repository.stars}
              </strong>
              <span>STARS</span>
            </div>

            <div>
              <GitFork size={15} />
              <strong>
                {result.repository.forks}
              </strong>
              <span>FORKS</span>
            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          QUICK STATS
      ================================================= */}

      <div className="stats-grid">

        {stats.map(
          ({ label, value, icon: Icon, color }) => (
            <div
              className="stat-card"
              key={label}
              style={{
                "--stat-color": color
              }}
            >
              <Icon size={21} />

              <div>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            </div>
          )
        )}

      </div>

      {/* =================================================
          TECHNOLOGY DNA
      ================================================= */}

      <section className="technology-section">

        <div className="section-title">
          <Code2 size={18} />
          <h3>TECHNOLOGY DNA</h3>
        </div>

        <div className="technology-grid">

          {languages.map(([language, bytes]) => {

            const total = languages.reduce(
              (sum, [, value]) => sum + value,
              0
            );

            const percentage =
              total > 0
                ? ((bytes / total) * 100).toFixed(1)
                : 0;

            return (
              <div
  className="technology-card"
  key={language}
>
  <div className="technology-card-header">

    <div className="technology-name">
      <span
        className="technology-dot"
        style={{
          background: getLanguageColor(language)
        }}
      />

      <strong>{language}</strong>
    </div>

    <span className="technology-percent">
      {percentage}%
    </span>

  </div>

  <div className="technology-meta">
    {bytes.toLocaleString()} bytes detected
  </div>

  <div className="technology-bar">
    <span
      style={{
        width: `${percentage}%`,
        background: getLanguageColor(language)
      }}
    />
  </div>
</div>
            );
          })}

        </div>

      </section>

      {/* =================================================
          CODE FLOW
      ================================================= */}

      <ArchitectureGraph result={result} />

      {/* =================================================
          LOWER INFORMATION GRID
      ================================================= */}

      <div className="dashboard-grid">

        {/* ARCHITECTURE */}

        <section>

          <div className="section-title">
            <Layers3 size={18} />
            <h3>ARCHITECTURE</h3>
          </div>

          {Object.entries(
            result.architecture || {}
          ).map(([key, value]) => (

            <div
              className="architecture-row"
              key={key}
            >
              <span>
                {key}
              </span>

              <strong>
                {value === true
                  ? "Detected"
                  : value === false
                  ? "Not detected"
                  : value || "Not detected"}
              </strong>
            </div>

          ))}

        </section>

        {/* REPOSITORY STRUCTURE */}

        <section>

          <div className="section-title">
            <FolderTree size={18} />
            <h3>REPOSITORY STRUCTURE</h3>
          </div>

          {Object.entries(
            result.structure || {}
          )
            .slice(0, 8)
            .map(([folder, count]) => (

              <div
                className="architecture-row"
                key={folder}
              >
                <span>{folder}</span>

                <strong>
                  {count} files
                </strong>
              </div>

            ))}

        </section>

        {/* IMPORTANT FILES */}

        <section>

          <div className="section-title">
            <FileCode2 size={18} />
            <h3>IMPORTANT FILES</h3>
          </div>

          {(result.importantFiles || []).map(
            (file) => (

              <div
                className="file-row"
                key={file}
              >
                <FileCode2 size={15} />
                <span>{file}</span>
              </div>

            )
          )}

        </section>

        {/* AI */}

        <section className="ai-section">

          <div className="section-title">
            <Brain size={18} />
            <h3>AI UNDERSTANDING</h3>
          </div>

          <div className="ai-response">
            <pre>
              {result.aiAnalysis}
            </pre>
          </div>

        </section>

      </div>

    </div>
  );
}

export default ReportDashboard;