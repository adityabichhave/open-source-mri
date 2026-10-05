import { useState } from "react";
import { scanRepository } from "../services/api";

function RepoInput() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleScan() {
    if (!url.trim()) {
      alert("Please enter a GitHub repository URL");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const response = await scanRepository(url);
      setResult(response.data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "40px auto" }}>
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Paste a GitHub repository URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{
            flex: 1,
            padding: "14px",
            fontSize: "16px"
          }}
        />

        <button
          onClick={handleScan}
          disabled={loading}
          style={{
            padding: "14px 24px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Scanning..." : "Scan Repository"}
        </button>
      </div>

      {result && (
        <div style={{ marginTop: "40px" }}>

          <section>
            <h2>{result.repository.name}</h2>
            <p>{result.repository.description}</p>

            <p>
              ⭐ {result.repository.stars} &nbsp;
              🍴 {result.repository.forks} &nbsp;
              📁 {result.stats.files} files &nbsp;
              💻 {result.stats.languages} languages
            </p>
          </section>

          <hr />

          <section>
            <h3>Technology Stack</h3>

            {Object.entries(result.languages || {}).map(
              ([language, bytes]) => (
                <p key={language}>
                  {language} — {bytes} bytes
                </p>
              )
            )}
          </section>

          <section>
            <h3>Architecture</h3>

            {Object.entries(result.architecture || {}).map(
              ([key, value]) =>
                value && (
                  <p key={key}>
                    <strong>{key}:</strong> {String(value)}
                  </p>
                )
            )}
          </section>

          <section>
            <h3>Repository Structure</h3>

            {Object.entries(result.structure || {}).map(
              ([folder, count]) => (
                <p key={folder}>
                  📁 {folder} — {count} files
                </p>
              )
            )}
          </section>

          <section>
            <h3>Important Files</h3>

            {(result.importantFiles || []).map((file) => (
              <p key={file}>📄 {file}</p>
            ))}
          </section>

          {result.aiAnalysis && (
            <section>
              <h3>🤖 AI Understanding</h3>

              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.6",
                  fontFamily: "inherit"
                }}
              >
                {result.aiAnalysis}
              </pre>
            </section>
          )}

        </div>
      )}
    </div>
  );
}

export default RepoInput;