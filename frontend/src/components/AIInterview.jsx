import { useState, useRef, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function AIInterview() {
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [error, setError] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        }
      }
      if (finalTranscript) {
        setAnswer((prev) => (prev ? prev + " " + finalTranscript.trim() : finalTranscript.trim()));
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
      if (event.error === "not-allowed") {
        setError("Microphone access is required for speech-to-text. Please allow it and try again.");
      }
    };

    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    setError("");
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const generateQuestions = async () => {
    if (!role.trim()) {
      setError('Please enter a role first (e.g. "Frontend Developer").');
      return;
    }
    setError("");
    setLoadingQuestions(true);
    try {
      const res = await fetch(`${API_URL}/api/ai/generate-question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role: role.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to generate questions.");
        return;
      }
      setQuestions(data.questions);
      setFeedback("");
      setAnswer("");
    } catch (err) {
      console.error(err);
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoadingQuestions(false);
    }
  };

  const evaluateAnswer = async () => {
    if (!answer.trim()) {
      setError("Write or speak an answer before requesting evaluation.");
      return;
    }
    setError("");
    setLoadingFeedback(true);
    try {
      const res = await fetch(`${API_URL}/api/ai/evaluate-answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ question: questions, answer }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to evaluate answer.");
        return;
      }
      setFeedback(data.feedback);
    } catch (err) {
      console.error(err);
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoadingFeedback(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2 h-2 rounded-full bg-amber-500" />
        <h2 className="text-lg font-bold text-white">AI Mock Interviewer</h2>
      </div>
      <p className="text-sm text-gray-400 mb-4">
        Generate questions & evaluate responses collaboratively
      </p>

      {error && (
        <p className="text-red-400 text-sm bg-red-950/40 rounded-md px-3 py-2 mb-3">{error}</p>
      )}

      <div className="mb-4">
        <label className="text-xs font-semibold text-gray-400">Position / Role</label>
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generateQuestions()}
          placeholder="e.g. Frontend Developer, DevOps Engineer, Data Analyst..."
          className="w-full mt-1 bg-gray-800 border border-gray-700 focus:border-amber-400 rounded-lg p-2 text-sm text-gray-100 outline-none transition-colors"
        />
      </div>

      <button
        onClick={generateQuestions}
        disabled={loadingQuestions}
        className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-gray-900 font-bold py-2.5 rounded-lg transition-colors mb-3"
      >
        {loadingQuestions ? "Generating..." : "Generate Questions"}
      </button>

      {questions && (
        <pre className="whitespace-pre-wrap text-xs bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-300 mb-3 max-h-40 overflow-y-auto">
          {questions}
        </pre>
      )}

      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-semibold text-gray-400">Your Answer</label>
        {speechSupported && (
          <button
            onClick={toggleRecording}
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
              isRecording
                ? "bg-red-500 text-white animate-pulse"
                : "bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isRecording ? "bg-white" : "bg-red-500"}`} />
            {isRecording ? "Stop Recording" : "Speak Answer"}
          </button>
        )}
      </div>

      <textarea
        rows="5"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder={
          speechSupported
            ? "Type your answer, or click \"Speak Answer\" to use your microphone..."
            : "Type your answer... (speech-to-text isn't supported in this browser)"
        }
        className="w-full bg-gray-800 border border-gray-700 focus:border-amber-400 outline-none rounded-lg p-2 text-sm text-gray-100 resize-none mb-3 transition-colors"
      />

      <button
        onClick={evaluateAnswer}
        disabled={loadingFeedback}
        className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
      >
        {loadingFeedback ? "Evaluating..." : "Evaluate Answer"}
      </button>

      {feedback && (
        <pre className="whitespace-pre-wrap text-xs bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-300 mt-3 max-h-64 overflow-y-auto">
          {feedback}
        </pre>
      )}
    </div>
  );
}

export default AIInterview;