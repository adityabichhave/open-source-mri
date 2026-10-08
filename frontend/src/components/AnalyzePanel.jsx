import {
  Brain,
  ShieldCheck,
  GitBranch,
  AlertTriangle,
  FileSearch,
  Layers3,
  CheckCircle2,
  XCircle,
  Code2,
  Activity
} from "lucide-react";

function formatBytes(bytes) {
  if (!bytes) return "0 bytes";

  if (bytes >= 1000000) {
    return `${(bytes / 1000000).toFixed(1)} MB`;
  }

  if (bytes >= 1000) {
    return `${(bytes / 1000).toFixed(1)} KB`;
  }

  return `${bytes.toLocaleString()} bytes`;
}

function getLanguagePercentage(bytes, languages) {
  const total = Object.values(languages).reduce(
    (sum, value) => sum + value,
    0
  );

  if (!total) return 0;

  return ((bytes / total) * 100).toFixed(1);
}

function AnalyzePanel({ result }) {
  const architecture = result?.architecture || {};
  const stats = result?.stats || {};
  const languages = result?.languages || {};

  const detected = Object.entries(architecture)
    .filter(([, value]) => value)
    .map(([key]) => key);

  return (
    <section className="mri-panel-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="panel-page-header">

        <div>
          <span className="panel-kicker">
            MRI ANALYSIS
          </span>

          <h2>
            Repository Intelligence
          </h2>

          <p>
            Structural analysis generated from the scanned repository.
          </p>
        </div>

        <div className="panel-header-icon">
          <Brain size={34} />
        </div>

      </div>


      {/* =====================================================
          METRICS
      ===================================================== */}

      <div className="analysis-grid">

        <div className="analysis-card files">

          <div className="analysis-card-top">
            <div className="analysis-icon">
              <FileSearch size={20} />
            </div>

            <span>
              FILES ANALYZED
            </span>
          </div>

          <strong>
            {stats.files || 0}
          </strong>

          <small>
            repository files scanned
          </small>

        </div>


        <div className="analysis-card languages">

          <div className="analysis-card-top">
            <div className="analysis-icon">
              <GitBranch size={20} />
            </div>

            <span>
              LANGUAGES
            </span>
          </div>

          <strong>
            {stats.languages || 0}
          </strong>

          <small>
            programming languages detected
          </small>

        </div>


        <div className="analysis-card architecture">

          <div className="analysis-card-top">
            <div className="analysis-icon">
              <Layers3 size={20} />
            </div>

            <span>
              ARCHITECTURE SIGNALS
            </span>
          </div>

          <strong>
            {detected.length}
          </strong>

          <small>
            technology signals detected
          </small>

        </div>


        <div className="analysis-card status">

          <div className="analysis-card-top">
            <div className="analysis-icon">
              <ShieldCheck size={20} />
            </div>

            <span>
              STRUCTURE STATUS
            </span>
          </div>

          <strong>
            ANALYZED
          </strong>

          <small>
            repository structure ready
          </small>

        </div>

      </div>


      {/* =====================================================
          DETAIL GRID
      ===================================================== */}

      <div className="mri-detail-grid">


        {/* ARCHITECTURE */}

        <div className="mri-detail-card">

          <div className="detail-card-header">

            <div>
              <span className="detail-kicker">
                STRUCTURE
              </span>

              <h3>
                DETECTED ARCHITECTURE
              </h3>
            </div>

            <Activity size={21} />

          </div>


          <div className="architecture-list">

            {Object.entries(architecture).map(
              ([key, value]) => {

                const isDetected = Boolean(value);

                return (
                  <div
                    className="architecture-item"
                    key={key}
                  >

                    <div className="architecture-name">

                      {isDetected ? (
                        <CheckCircle2
                          size={16}
                          className="detected-icon"
                        />
                      ) : (
                        <XCircle
                          size={16}
                          className="not-detected-icon"
                        />
                      )}

                      <span>
                        {key}
                      </span>

                    </div>


                    <strong
                      className={
                        isDetected
                          ? "detected"
                          : "not-detected"
                      }
                    >
                      {value === true
                        ? "Detected"
                        : value === false
                        ? "Not detected"
                        : value}
                    </strong>

                  </div>
                );
              }
            )}

          </div>

        </div>


        {/* LANGUAGES */}

        <div className="mri-detail-card">

          <div className="detail-card-header">

            <div>
              <span className="detail-kicker">
                CODEBASE
              </span>

              <h3>
                LANGUAGE DISTRIBUTION
              </h3>
            </div>

            <Code2 size={21} />

          </div>


          <div className="language-list">

            {Object.entries(languages).map(
              ([language, bytes]) => {

                const percentage =
                  getLanguagePercentage(
                    bytes,
                    languages
                  );

                return (
                  <div
                    className="language-item"
                    key={language}
                  >

                    <div className="language-info">

                      <strong>
                        {language}
                      </strong>

                      <span>
                        {formatBytes(bytes)}
                      </span>

                    </div>


                    <div className="language-track">

                      <div
                        className="language-fill"
                        style={{
                          width: `${percentage}%`
                        }}
                      />

                    </div>


                    <strong className="language-percent">
                      {percentage}%
                    </strong>

                  </div>
                );
              }
            )}

          </div>

        </div>

      </div>


      {/* =====================================================
          CHANGE IMPACT
      ===================================================== */}

      <div className="mri-insight-banner">

        <div className="impact-banner-icon">
          <AlertTriangle size={22} />
        </div>


        <div className="impact-banner-content">

          <div className="impact-banner-title">

            <span>
              CHANGE IMPACT ENGINE
            </span>

            <small>
              READY
            </small>

          </div>

          <strong>
            Understand the consequences before changing code.
          </strong>

          <p>
            Select a file from Code Flow to inspect its
            dependencies, dependents and estimated change risk.
          </p>

        </div>


        <div className="impact-banner-action">
          CODE FLOW →
        </div>

      </div>


      {/* =====================================================
          FOOTER SIGNAL
      ===================================================== */}

      <div className="mri-analysis-footer">

        <Brain size={17} />

        <span>
          MRI ENGINE
        </span>

        <i />

        <strong>
          STRUCTURAL ANALYSIS COMPLETE
        </strong>

      </div>

    </section>
  );
}

export default AnalyzePanel;