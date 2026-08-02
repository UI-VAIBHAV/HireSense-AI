import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;
const MAX_SIZE = 5 * 1024 * 1024; // 5MB, matches the backend limit

function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setError("");
    setAnalysis("");

    if (!selected) {
      setFile(null);
      return;
    }
    if (selected.type !== "application/pdf") {
      setError("Please select a PDF file.");
      setFile(null);
      return;
    }
    if (selected.size > MAX_SIZE) {
      setError("File is too large. Max size is 5MB.");
      setFile(null);
      return;
    }
    setFile(selected);
  };

  const analyzeResume = async () => {
    if (!file) {
      setError("Please select a PDF first.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await fetch(`${API_URL}/api/resume/analyze`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to analyze resume.");
        return;
      }
      setAnalysis(data.analysis);
    } catch (err) {
      console.error(err);
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-blue-400" />
        <h2 className="text-lg font-bold text-white">ATS Resume Analyzer</h2>
      </div>

      {error && <p className="text-red-400 text-sm bg-red-950/40 rounded-md px-3 py-2 mb-3">{error}</p>}

      <input type="file" accept=".pdf,application/pdf" onChange={handleFileChange}
        className="text-sm text-gray-300 w-full mb-3 file:bg-gray-800 file:border file:border-gray-700 file:text-gray-200 file:rounded-lg file:px-3 file:py-1.5 file:mr-3" />

      <button onClick={analyzeResume} disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold py-2.5 rounded-lg transition-colors">
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      {analysis && (
        <pre className="mt-4 whitespace-pre-wrap text-xs bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-300 max-h-64 overflow-y-auto">
          {analysis}
        </pre>
      )}
    </div>
  );
}

export default ResumeAnalyzer;