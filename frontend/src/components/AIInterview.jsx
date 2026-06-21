import { useState } from "react";

function AIInterview() {
  const [role, setRole] = useState("MERN Stack Developer");
  const [questions, setQuestions] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
const API_URL = import.meta.env.VITE_API_URL;


  const generateQuestions = async () => {
    const res = await fetch(`${API_URL}/api/ai/generate-question`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      }
    );

    const data = await res.json();
    setQuestions(data.questions);
  };

  const evaluateAnswer = async () => {
    const res = await fetch(`${API_URL}/api/ai/evaluate-answer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: questions,
          answer,
        }),
      }
    );

    const data = await res.json();
    setFeedback(data.feedback);
  };

  return (
    <div>
      <h2>AI Interviewer</h2>

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option>MERN Stack Developer</option>
        <option>Frontend Developer</option>
        <option>Backend Developer</option>
        <option>Java Developer</option>
      </select>

      <button onClick={generateQuestions}>
        Generate Questions
      </button>

      <pre>{questions}</pre>

      <textarea
        rows="6"
        cols="50"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Write your answer..."
      />

      <br />

      <button onClick={evaluateAnswer}>
        Evaluate Answer
      </button>

      <pre>{feedback}</pre>
    </div>
  );
}

export default AIInterview;