import { useState } from "react";

function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState("");

  const analyzeResume = async () => {
    if (!file) {
      alert("Please select a PDF");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    const res = await fetch(
      "http://localhost:3000/api/resume/analyze",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    setAnalysis(data.analysis);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">
        Resume Analyzer
      </h2>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={analyzeResume}
        className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
      >
        Analyze Resume
      </button>

      <pre className="mt-4 whitespace-pre-wrap">
        {analysis}
      </pre>
    </div>
  );
}

export default ResumeAnalyzer;