const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001";

export async function scanRepository(url) {
  const response = await fetch(`${API_URL}/api/scan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ url })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Repository scan failed");
  }

  return data;
}
export async function explainFile(path, content) {
  const response = await fetch(`${API_URL}/api/scan/explain`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      path,
      content
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "File explanation failed"
    );
  }

  return data;
}