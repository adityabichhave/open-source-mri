import {
  FolderTree,
  FileCode2,
  Search,
  Folder,
  Files,
  ChevronRight
} from "lucide-react";

function ExplorePanel({ result }) {
  const structure = result?.structure || {};
  const files = result?.importantFiles || [];

  const directoryEntries = Object.entries(structure);
  const totalFiles = directoryEntries.reduce(
    (sum, [, count]) => sum + Number(count || 0),
    0
  );

  return (
    <section className="mri-panel-page explore-panel-page">

      {/* HEADER */}
      <div className="panel-page-header explore-header">
        <div>
          <span className="panel-kicker">REPOSITORY EXPLORER</span>

          <h2>Explore Repository</h2>

          <p>
            Navigate the important parts discovered by Open Source MRI.
          </p>
        </div>

        <div className="explore-header-icon">
          <Search size={28} />
        </div>
      </div>

      {/* SUMMARY */}
      <div className="explore-summary-grid">

        <div className="explore-summary-card">
          <div className="explore-summary-icon">
            <FolderTree size={20} />
          </div>

          <div>
            <span>DIRECTORIES</span>
            <strong>{directoryEntries.length}</strong>
            <small>Detected in repository</small>
          </div>
        </div>

        <div className="explore-summary-card">
          <div className="explore-summary-icon">
            <Files size={20} />
          </div>

          <div>
            <span>FILES DISCOVERED</span>
            <strong>{totalFiles}</strong>
            <small>Across detected directories</small>
          </div>
        </div>

        <div className="explore-summary-card">
          <div className="explore-summary-icon">
            <FileCode2 size={20} />
          </div>

          <div>
            <span>IMPORTANT FILES</span>
            <strong>{files.length}</strong>
            <small>Key files identified by MRI</small>
          </div>
        </div>

      </div>

      {/* MAIN CONTENT */}
      <div className="explore-grid">

        {/* DIRECTORY STRUCTURE */}
        <div className="mri-detail-card explore-main-card">

          <div className="explore-card-header">
            <div className="explore-title">
              <FolderTree size={19} />

              <div>
                <h3>DIRECTORY STRUCTURE</h3>
                <span>Repository organization</span>
              </div>
            </div>

            <span className="explore-count">
              {directoryEntries.length} dirs
            </span>
          </div>

          <div className="explore-list">

            {directoryEntries.map(([folder, count]) => (
              <div className="explore-row" key={folder}>

                <div className="explore-row-left">
                  <div className="explore-folder-icon">
                    <Folder size={17} />
                  </div>

                  <div>
                    <span className="explore-folder-name">
                      {folder}
                    </span>

                    <small>
                      Repository directory
                    </small>
                  </div>
                </div>

                <div className="explore-row-right">
                  <strong>{count}</strong>
                  <span>files</span>
                  <ChevronRight size={15} />
                </div>

              </div>
            ))}

          </div>
        </div>

        {/* IMPORTANT FILES */}
        <div className="mri-detail-card explore-main-card">

          <div className="explore-card-header">
            <div className="explore-title">
              <FileCode2 size={19} />

              <div>
                <h3>IMPORTANT FILES</h3>
                <span>Key repository entry points</span>
              </div>
            </div>

            <span className="explore-count">
              {files.length} files
            </span>
          </div>

          <div className="explore-files-list">

            {files.map((file, index) => (
              <div className="explore-file" key={file}>

                <div className="explore-file-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="explore-file-icon">
                  <FileCode2 size={16} />
                </div>

                <div className="explore-file-info">
                  <span>{file}</span>
                  <small>Important repository file</small>
                </div>

                <ChevronRight
                  size={15}
                  className="explore-file-arrow"
                />

              </div>
            ))}

          </div>

        </div>

      </div>

      {/* FOOTER SIGNAL */}
      <div className="explore-footer">

        <div className="explore-footer-icon">
          <Search size={17} />
        </div>

        <div>
          <strong>REPOSITORY NAVIGATION READY</strong>
          <p>
            Open Source MRI has mapped the repository structure
            and identified the files most relevant for understanding
            the codebase.
          </p>
        </div>

      </div>

    </section>
  );
}

export default ExplorePanel;