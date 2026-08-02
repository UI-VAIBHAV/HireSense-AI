import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function Output({ language, version, value, socket, roomId }) {
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  const handleRun = async () => {
    if (!value?.trim()) {
      setError("Write some code before running.");
      return;
    }
    setError("");
    setRunning(true);

    try {
      const res = await fetch(`${API_URL}/api/compiler/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // this route now requires auth, per our middleware
        body: JSON.stringify({ code: value, language, input }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to run code.");
        return;
      }

      const result = data.stdout || data.stderr || data.compile_output || "No Output";
      setOutput(result);
      socket?.emit("output-change", { room: roomId, data: result });
    } catch (err) {
      console.error(err);
      setError("Could not reach the code execution server. Please try again.");
    } finally {
      setRunning(false);
    }
  };

  const handleChange = (event) => {
    const newValue = event.target.value;
    setInput(newValue);
    socket?.emit("input-change", { room: roomId, data: newValue });
  };

  useEffect(() => {
    if (!socket) return;

    const handleReceiveInput = (data) => setInput(data);
    const handleReceiveOutput = (data) => setOutput(data);

    socket.on("recieve-input", handleReceiveInput);
    socket.on("recieve-output", handleReceiveOutput);

    return () => {
      socket.off("recieve-input", handleReceiveInput);
      socket.off("recieve-output", handleReceiveOutput);
    };
  }, [socket]);

  return (
    <div className="mt-6 pt-6 border-t border-gray-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <h3 className="font-bold text-white">Execution Output</h3>
        </div>
        <button
          onClick={handleRun}
          disabled={running}
          className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-gray-900 text-sm font-bold px-4 py-2 rounded-lg transition-colors"
        >
          {running ? "Running..." : "▶ Run Code"}
        </button>
      </div>

      {error && (
        <p className="text-red-400 text-sm font-medium bg-red-950/40 rounded-md px-3 py-2 mb-3">{error}</p>
      )}

      <p className="text-sm font-semibold text-gray-400 mb-1">Input</p>
      <textarea
        className="h-20 w-full bg-gray-800 border border-gray-700 focus:border-blue-400 outline-none rounded-lg p-2 text-sm text-gray-100 transition-colors"
        value={input}
        onChange={handleChange}
        placeholder="Program input (stdin), if any"
      />

      <p className="text-sm font-semibold text-gray-400 mt-3 mb-1">Output</p>
      <div className="h-24 overflow-y-auto bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm text-gray-300 font-mono whitespace-pre-wrap">
        {output || <span className="text-gray-500">Click "Run Code" above to execute your solution.</span>}
      </div>
    </div>
  );
}

export default Output;