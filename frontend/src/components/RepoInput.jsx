import { useState } from "react";
import { scanRepository } from "../services/api";
import ReportDashboard from "./ReportDashboard";

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
      <div
        style={{
          display: "flex",
          gap: "10px"
        }}
      >
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

      {result && <ReportDashboard result={result} />}
    </div>
  );
}

export default RepoInput;