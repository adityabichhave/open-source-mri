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
    <div>
      <input
        type="text"
        placeholder="Paste a GitHub repository URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button onClick={handleScan} disabled={loading}>
        {loading ? "Scanning..." : "Scan Repository"}
      </button>

      {result && (
        <div>
          <h2>{result.repository.name}</h2>

          <p>{result.repository.description}</p>

          <p>⭐ Stars: {result.repository.stars}</p>
          <p>🍴 Forks: {result.repository.forks}</p>
          <p>📁 Files: {result.stats.files}</p>
          <p>💻 Languages: {result.stats.languages}</p>
          <h3>Architecture</h3>

<ul>
  {result.architecture &&
    Object.entries(result.architecture).map(
      ([key, value]) =>
        value && (
          <li key={key}>
            {key}: {String(value)}
          </li>
        )
    )}
</ul>

          <h3>Repository Structure</h3>

<ul>
  {Object.entries(result.structure || {}).map(
    ([folder, count]) => (
      <li key={folder}>
        📁 {folder} — {count} files
      </li>
    )
  )}
</ul>
        </div>
      )}
    </div>
  );
}

export default RepoInput;