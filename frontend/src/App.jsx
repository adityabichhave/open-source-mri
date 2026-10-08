import { useState } from "react";

import {
  ScanLine,
  Network,
  FolderSearch,
  BarChart3,
  Star,
  GitBranch,
  Brain,
  Activity
} from "lucide-react";

import RepoInput from "./components/RepoInput";
import ReportDashboard from "./components/ReportDashboard";
import AnalyzePanel from "./components/AnalyzePanel";
import ExplorePanel from "./components/ExplorePanel";
import InsightsPanel from "./components/InsightsPanel";

function App() {
  const [activeSection, setActiveSection] = useState("scan");
  const [result, setResult] = useState(null);

  function handleScanComplete(data) {
    setResult(data);
    setActiveSection("scan");
  }

  function navigate(section) {
    if (!result && section !== "scan") {
      setActiveSection("scan");
      return;
    }

    setActiveSection(section);
  }

  return (
    <div className="app">

      {/* TOPBAR */}
      <header className="topbar">

        <div className="brand">
          <div className="brand-mark">
            <Brain size={22} strokeWidth={2.5} />
          </div>

          <div>
            <h1>
              OPEN SOURCE <span>MRI</span>
            </h1>
            <p>SEE INSIDE. UNDERSTAND FASTER.</p>
          </div>
        </div>

        <nav className="top-nav">

          <div
            className={`top-nav-item ${
              activeSection === "scan" ? "active" : ""
            }`}
            onClick={() => navigate("scan")}
          >
            <ScanLine size={16} />
            <span>Scan</span>
          </div>

          <div
            className={`top-nav-item ${
              activeSection === "explore" ? "active" : ""
            }`}
            onClick={() => navigate("explore")}
          >
            <Network size={16} />
            <span>Explore</span>
          </div>

          <div
            className={`top-nav-item ${
              activeSection === "insights" ? "active" : ""
            }`}
            onClick={() => navigate("insights")}
          >
            <BarChart3 size={16} />
            <span>Insights</span>
          </div>

          <div
            className={`top-nav-item ${
              activeSection === "activity" ? "active" : ""
            }`}
            onClick={() => navigate("activity")}
          >
            <Activity size={16} />
            <span>Activity</span>
          </div>

        </nav>

        <div className="top-status">
          <span className="status-dot" />
          <span>
            {result ? "MRI LOADED" : "SYSTEM ONLINE"}
          </span>
        </div>

      </header>

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="sidebar-section">

          <div className="sidebar-label">
            MRI TOOLS
          </div>

          <div
            className={`side-item ${
              activeSection === "scan" ? "active" : ""
            }`}
            onClick={() => navigate("scan")}
          >
            <ScanLine size={20} />
            <span>Scan</span>
          </div>

          <div
            className={`side-item ${
              activeSection === "analyze" ? "active" : ""
            }`}
            onClick={() => navigate("analyze")}
          >
            <Brain size={20} />
            <span>Analyze</span>
          </div>

          <div
            className={`side-item ${
              activeSection === "explore" ? "active" : ""
            }`}
            onClick={() => navigate("explore")}
          >
            <FolderSearch size={20} />
            <span>Explore</span>
          </div>

          <div
            className={`side-item ${
              activeSection === "insights" ? "active" : ""
            }`}
            onClick={() => navigate("insights")}
          >
            <BarChart3 size={20} />
            <span>Insights</span>
          </div>

          <div
            className={`side-item ${
              activeSection === "favorites" ? "active" : ""
            }`}
            onClick={() => navigate("favorites")}
          >
            <Star size={20} />
            <span>Favorites</span>
          </div>

        </div>

        <div className="sidebar-bottom">

          <div className="github-badge">
            <GitBranch size={18} />
          </div>

          <span>OPEN SOURCE MRI</span>

          <small>Developer Intelligence</small>

        </div>

      </aside>

      {/* MAIN */}
      <main className="main-content">

        {/* ================= SCAN ================= */}

        {activeSection === "scan" && (
          <>
            <div className="page-heading">

              <div>
                <span className="eyebrow">
                  REPOSITORY INTELLIGENCE
                </span>

                <h2>
                  Repository Scanner
                </h2>

                <p>
                  Turn any GitHub repository into a visual map
                  of how the code works.
                </p>
              </div>

              <div className="scan-indicator">
                <span />
                {result ? "MRI READY" : "READY TO SCAN"}
              </div>

            </div>

            <RepoInput
              onScanComplete={handleScanComplete}
            />

            {/* KEEP THE REPORT */}
            {result && (
              <ReportDashboard result={result} />
            )}
          </>
        )}

        {/* ================= ANALYZE ================= */}

        {activeSection === "analyze" && result && (
          <AnalyzePanel result={result} />
        )}

        {/* ================= EXPLORE ================= */}

        {activeSection === "explore" && result && (
          <ExplorePanel result={result} />
        )}

        

        {/* ================= INSIGHTS ================= */}

        {/* ================ INSIGHTS ================ */}
{activeSection === "insights" && result && (
  <InsightsPanel result={result} />
)}

        {/* ================= ACTIVITY ================= */}

        {activeSection === "activity" && result && (
          <div className="page-heading">
            <div>
              <span className="eyebrow">
                SCAN ACTIVITY
              </span>

              <h2>
                Repository Activity
              </h2>

              <p>
                Current MRI scan and analysis status.
              </p>
            </div>
          </div>
        )}

        {/* ================= FAVORITES ================= */}

        {activeSection === "favorites" && (
          <div className="page-heading">
            <div>
              <span className="eyebrow">
                SAVED REPOSITORIES
              </span>

              <h2>
                Favorites
              </h2>

              <p>
                Save repositories for quick analysis.
              </p>
            </div>
          </div>
        )}

        {/* ================= NO SCAN ================= */}

        {!result &&
          activeSection !== "scan" &&
          activeSection !== "favorites" && (
            <div className="page-heading">
              <div>
                <span className="eyebrow">
                  MRI
                </span>

                <h2>
                  Scan a Repository First
                </h2>

                <p>
                  Return to Scan and generate the repository MRI.
                </p>
              </div>
            </div>
          )}

      </main>

    </div>
  );
}

export default App;