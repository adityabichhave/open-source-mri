import {
  FolderTree,
  GitBranch,
  FileCode2,
  Brain
} from "lucide-react";
import ArchitectureGraph from "./ArchitectureGraph";


function ReportDashboard({ result }) {
  const stats = [
    {
      label: "Files",
      value: result.stats.files,
      icon: FileCode2
    },
    {
      label: "Languages",
      value: result.stats.languages,
      icon: GitBranch
    },
    {
      label: "Directories",
      value: result.stats.directories,
      icon: FolderTree
    }
  ];

  return (
    <div className="report-dashboard">

      <section className="repo-header">
        <div>
          <p className="repo-label">REPOSITORY MRI</p>
          <h2>{result.repository.name}</h2>
          <p>{result.repository.description}</p>
        </div>

        <div className="repo-meta">
          ⭐ {result.repository.stars}
          <span>•</span>
          🍴 {result.repository.forks}
        </div>
      </section>

      <div className="stats-grid">
        {stats.map(({ label, value, icon: Icon }) => (
          <div className="stat-card" key={label}>
            <Icon size={20} />
            <div>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          </div>
        ))}
      </div>

        <ArchitectureGraph result={result} />
      <div className="dashboard-grid">

        <section>
          <div className="section-title">
            <GitBranch size={20} />
            <h3>Architecture</h3>
          </div>

          {Object.entries(result.architecture || {}).map(
            ([key, value]) =>
              value && (
                <div className="architecture-row" key={key}>
                  <span>{key}</span>
                  <strong>{String(value)}</strong>
                </div>
              )
          )}
        </section>

        <section>
          <div className="section-title">
            <FolderTree size={20} />
            <h3>Repository Structure</h3>
          </div>

          {Object.entries(result.structure || {}).map(
            ([folder, count]) => (
              <div className="architecture-row" key={folder}>
                <span>{folder}</span>
                <strong>{count} files</strong>
              </div>
            )
          )}
        </section>

        <section>
          <div className="section-title">
            <FileCode2 size={20} />
            <h3>Important Files</h3>
          </div>

          {(result.importantFiles || []).map((file) => (
            <div className="file-row" key={file}>
              <FileCode2 size={16} />
              <span>{file}</span>
            </div>
          ))}
        </section>

        <section className="ai-section">
          <div className="section-title">
            <Brain size={20} />
            <h3>AI Understanding</h3>
          </div>

          <div className="ai-response">
  <pre>{result.aiAnalysis}</pre>
</div>
        </section>

      </div>
    </div>
  );
}

export default ReportDashboard;