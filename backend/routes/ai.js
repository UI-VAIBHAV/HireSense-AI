import express from "express";
import { model } from "../gemini.js";

const router = express.Router();

// Test Gemini API
router.get("/test", async (req, res) => {
  try {
    const result = await model.generateContent(
      "Generate 3 MERN Stack interview questions"
    );

    res.send(result.response.text());
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// Generate Interview Questions
router.post("/generate-question", async (req, res) => {
  try {
    const { role } = req.body;

    const prompt = `
Generate 10 interview questions for a ${role}.

Requirements:
- 3 Easy Questions
- 4 Medium Questions
- 3 Hard Questions

Return only the questions.
`;

    const result = await model.generateContent(prompt);

    res.json({
      success: true,
      questions: result.response.text(),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to generate questions",
    });
  }
});

// Evaluate Candidate Answer
router.post("/evaluate-answer", async (req, res) => {
  try {
    const { question, answer } = req.body;

    const prompt = `
You are a senior software engineering interviewer.

Question:
${question}

Candidate Answer:
${answer}

Evaluate the answer.

Return response in the following format:

Score: X/10

Strengths:
- Point 1
- Point 2

Weaknesses:
- Point 1
- Point 2

Suggested Improvement:
- Point 1
- Point 2
`;

    const result = await model.generateContent(prompt);

    res.json({
      success: true,
      feedback: result.response.text(),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Evaluation failed",
    });
  }
});

// Demo Evaluation Route
router.get("/demo-evaluation", async (req, res) => {
  try {
    const prompt = `
Question:
What is JWT?

Candidate Answer:
JWT is used for authentication between client and server.

Evaluate this answer.
`;

    const result = await model.generateContent(prompt);

    res.send(result.response.text());
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

export default router;