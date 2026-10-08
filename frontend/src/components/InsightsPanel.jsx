import {
  BarChart3,
  TrendingUp,
  Files,
  Code2,
  FolderTree,
  GitBranch,
  Activity,
  Zap,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Gauge,
  Lightbulb
} from "lucide-react";

function InsightsPanel({ result }) {
  const stats = result?.stats || {};
  const languages = result?.languages || {};
  const structure = result?.structure || {};
  const files = result?.importantFiles || [];

  /* -----------------------------
     LANGUAGE ANALYSIS
  ----------------------------- */

  const languageEntries = Object.entries(languages)
    .sort((a, b) => Number(b[1]) - Number(a[1]));

  const totalBytes = languageEntries.reduce(
    (sum, [, bytes]) => sum + Number(bytes || 0),
    0
  );

  const topLanguage = languageEntries[0]?.[0] || "Unknown";

  /* -----------------------------
     DIRECTORY HOTSPOTS
  ----------------------------- */

  const directoryEntries = Object.entries(structure)
    .map(([name, count]) => ({
      name,
      count: Number(count || 0)
    }))
    .sort((a, b) => b.count - a.count);

  const largestDirectory = directoryEntries[0];

  /* -----------------------------
     RISK CALCULATION
  ----------------------------- */

  let riskScore = 0;

  // Large repository
  if (Number(stats.files) > 500) {
    riskScore += 30;
  } else if (Number(stats.files) > 250) {
    riskScore += 20;
  } else if (Number(stats.files) > 100) {
    riskScore += 10;
  }

  // Large directory concentration
  if (largestDirectory?.count > 200) {
    riskScore += 25;
  } else if (largestDirectory?.count > 100) {
    riskScore += 15;
  } else if (largestDirectory?.count > 50) {
    riskScore += 10;
  }

  // Technology diversity
  if (Number(stats.languages) >= 6) {
    riskScore += 20;
  } else if (Number(stats.languages) >= 4) {
    riskScore += 10;
  }

  // Important files
  if (files.length >= 10) {
    riskScore += 15;
  } else if (files.length >= 5) {
    riskScore += 8;
  }

  riskScore = Math.min(riskScore, 100);

  let riskLevel = "LOW";
  let riskDescription = "Repository structure appears manageable.";
  let RiskIcon = CheckCircle2;

  if (riskScore >= 60) {
    riskLevel = "HIGH";
    riskDescription =
      "Repository contains structural hotspots that deserve review.";
    RiskIcon = ShieldAlert;
  } else if (riskScore >= 30) {
    riskLevel = "MEDIUM";
    riskDescription =
      "Some structural areas may increase maintenance complexity.";
    RiskIcon = AlertTriangle;
  }

  /* -----------------------------
     RECOMMENDATIONS
  ----------------------------- */

  const recommendations = [];

  if (largestDirectory?.count > 100) {
    recommendations.push({
      title: `Review ${largestDirectory.name}`,
      description: `${largestDirectory.count} files are concentrated in this directory.`,
      type: "HOTSPOT"
    });
  }

  if (Number(stats.files) > 250) {
    recommendations.push({
      title: "Review repository size",
      description:
        "The codebase is large enough to benefit from stronger module boundaries.",
      type: "STRUCTURE"
    });
  }

  if (Number(stats.languages) > 3) {
    recommendations.push({
      title: "Check technology boundaries",
      description:
        "Multiple languages are present. Verify responsibilities between them.",
      type: "ARCHITECTURE"
    });
  }

  if (files.length > 0) {
    recommendations.push({
      title: "Inspect critical files",
      description:
        "Use Code Flow to trace dependencies around important entry points.",
      type: "CODE FLOW"
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      title: "Continue dependency analysis",
      description:
        "Repository structure currently shows no major deterministic hotspots.",
      type: "NEXT STEP"
    });
  }

  return (
    <section className="mri-panel-page insights-panel-page">

      {/* HEADER */}
      <div className="panel-page-header insights-header">
        <div>
          <span className="panel-kicker">
            REPOSITORY INSIGHTS
          </span>

          <h2>Engineering Insights</h2>

          <p>
            Deep metrics, hotspots and repository intelligence.
          </p>
        </div>

        <div className="insights-header-icon">
          <BarChart3 size={28} />
        </div>
      </div>

      {/* TOP METRICS */}
      <div className="insights-metrics-grid">

        <div className="insight-metric-card">
          <div className="insight-metric-icon">
            <Files size={20} />
          </div>

          <div>
            <span>REPOSITORY FILES</span>
            <strong>{stats.files || 0}</strong>
            <small>Total files analyzed</small>
          </div>
        </div>

        <div className="insight-metric-card">
          <div className="insight-metric-icon">
            <Code2 size={20} />
          </div>

          <div>
            <span>PRIMARY LANGUAGE</span>
            <strong>{topLanguage}</strong>
            <small>Main technology detected</small>
          </div>
        </div>

        <div className="insight-metric-card">
          <div className="insight-metric-icon">
            <FolderTree size={20} />
          </div>

          <div>
            <span>LARGEST HOTSPOT</span>
            <strong>
              {largestDirectory?.name || "N/A"}
            </strong>
            <small>
              {largestDirectory
                ? `${largestDirectory.count} files`
                : "No data"}
            </small>
          </div>
        </div>

        <div className="insight-metric-card">
          <div className="insight-metric-icon">
            <Gauge size={20} />
          </div>

          <div>
            <span>ENGINEERING RISK</span>
            <strong>{riskLevel}</strong>
            <small>Deterministic risk assessment</small>
          </div>
        </div>

      </div>

      {/* RISK + LANGUAGE */}
      <div className="insights-content-grid">

        {/* ENGINEERING HEALTH */}
        <div className="mri-detail-card insights-card">

          <div className="insights-card-header">
            <div className="insights-title">
              <Gauge size={19} />

              <div>
                <h3>ENGINEERING HEALTH</h3>
                <span>Structural repository assessment</span>
              </div>
            </div>

            <span
              className={`insight-badge ${
                riskLevel === "HIGH"
                  ? "danger"
                  : riskLevel === "MEDIUM"
                  ? "warning"
                  : "success"
              }`}
            >
              {riskLevel}
            </span>
          </div>

          <div className="health-score-section">

            <div className="health-score">
              <strong>{riskScore}</strong>
              <span>/ 100</span>
            </div>

            <div className="health-score-label">
              <span>RISK SCORE</span>
              <p>{riskDescription}</p>
            </div>

          </div>

          <div className="health-progress">
            <div
              className={`health-progress-fill ${riskLevel.toLowerCase()}`}
              style={{
                width: `${Math.max(riskScore, 4)}%`
              }}
            />
          </div>

          <div className="health-signals">

            <div>
              <span>FILES</span>
              <strong>{stats.files || 0}</strong>
            </div>

            <div>
              <span>LANGUAGES</span>
              <strong>{stats.languages || 0}</strong>
            </div>

            <div>
              <span>DIRECTORIES</span>
              <strong>{stats.directories || 0}</strong>
            </div>

          </div>

        </div>

        {/* LANGUAGE DISTRIBUTION */}
        <div className="mri-detail-card insights-card">

          <div className="insights-card-header">
            <div className="insights-title">
              <BarChart3 size={19} />

              <div>
                <h3>LANGUAGE DISTRIBUTION</h3>
                <span>Technology footprint</span>
              </div>
            </div>

            <span className="insight-badge">
              {languageEntries.length} detected
            </span>
          </div>

          <div className="language-insights-list">

            {languageEntries.map(([language, bytes]) => {
              const percentage =
                totalBytes > 0
                  ? (Number(bytes) / totalBytes) * 100
                  : 0;

              return (
                <div
                  className="language-insight-row"
                  key={language}
                >
                  <div className="language-insight-top">
                    <span>{language}</span>

                    <strong>
                      {percentage.toFixed(1)}%
                    </strong>
                  </div>

                  <div className="language-bar">
                    <div
                      className="language-bar-fill"
                      style={{
                        width: `${percentage}%`
                      }}
                    />
                  </div>

                  <small>
                    {Number(bytes).toLocaleString()} bytes
                  </small>
                </div>
              );
            })}

          </div>
        </div>

      </div>

      {/* HOTSPOTS */}
      <div className="mri-detail-card insights-hotspots-card">

        <div className="insights-card-header">
          <div className="insights-title">
            <TrendingUp size={19} />

            <div>
              <h3>REPOSITORY HOTSPOTS</h3>
              <span>
                Directories with the highest file concentration
              </span>
            </div>
          </div>

          <span className="insight-badge warning">
            HOTSPOTS
          </span>
        </div>

        <div className="hotspot-list">

          {directoryEntries.slice(0, 5).map((directory, index) => {

            const maxCount =
              directoryEntries[0]?.count || 1;

            const percentage =
              (directory.count / maxCount) * 100;

            const isHot =
              index === 0 && directory.count > 100;

            return (
              <div
                className="hotspot-row"
                key={directory.name}
              >

                <div className="hotspot-rank">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="hotspot-main">

                  <div className="hotspot-name">
                    <FolderTree size={15} />

                    <strong>{directory.name}</strong>

                    {isHot && (
                      <span className="hotspot-tag">
                        HIGH
                      </span>
                    )}
                  </div>

                  <div className="hotspot-bar">
                    <div
                      style={{
                        width: `${percentage}%`
                      }}
                    />
                  </div>

                </div>

                <div className="hotspot-count">
                  <strong>{directory.count}</strong>
                  <span>files</span>
                </div>

              </div>
            );
          })}

        </div>
      </div>

      {/* RECOMMENDATIONS */}
      <div className="mri-detail-card insights-recommendations-card">

        <div className="insights-card-header">
          <div className="insights-title">
            <Lightbulb size={19} />

            <div>
              <h3>ENGINEERING RECOMMENDATIONS</h3>
              <span>
                Actions generated from repository signals
              </span>
            </div>
          </div>

          <span className="insight-badge success">
            {recommendations.length} actions
          </span>
        </div>

        <div className="recommendation-list">

          {recommendations.map((recommendation, index) => (
            <div
              className="recommendation-row"
              key={`${recommendation.title}-${index}`}
            >

              <div className="recommendation-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="recommendation-icon">
                <Zap size={16} />
              </div>

              <div className="recommendation-content">
                <div>
                  <strong>{recommendation.title}</strong>

                  <span className="recommendation-type">
                    {recommendation.type}
                  </span>
                </div>

                <p>{recommendation.description}</p>
              </div>

            </div>
          ))}

        </div>
      </div>

      {/* KEY FILES */}
      <div className="mri-detail-card insights-files-card">

        <div className="insights-card-header">
          <div className="insights-title">
            <Files size={19} />

            <div>
              <h3>KEY REPOSITORY FILES</h3>
              <span>
                Important files identified during scanning
              </span>
            </div>
          </div>

          <span className="insight-badge">
            {files.length} files
          </span>
        </div>

        <div className="insights-files-grid">

          {files.map((file, index) => (
            <div
              className="insights-file-chip"
              key={file}
            >
              <span>
                {String(index + 1).padStart(2, "0")}
              </span>

              <Code2 size={15} />

              <strong>{file}</strong>
            </div>
          ))}

        </div>
      </div>

      {/* FOOTER */}
      <div className="insights-footer">

        <div className="insights-footer-icon">
          <Activity size={18} />
        </div>

        <div>
          <strong>
            MRI ENGINEERING INTELLIGENCE
          </strong>

          <p>
            Risk and hotspot signals are derived from the
            repository structure currently scanned by Open
            Source MRI. Use Code Flow for deeper dependency
            and change-impact analysis.
          </p>
        </div>

      </div>

    </section>
  );
}

export default InsightsPanel;