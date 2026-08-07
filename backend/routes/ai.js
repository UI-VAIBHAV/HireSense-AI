import express from "express";
import { model } from "../gemini.js";

const router = express.Router();

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

router.post("/generate-question", async (req, res) => {
  try {
    const { role } = req.body;
    if (!role || typeof role !== "string") {
      return res.status(400).json({ success: false, message: "role is required" });
    }

    const prompt = `
Generate 10 interview questions for a ${role}.

Requirements:
- 3 Easy Questions
- 4 Medium Questions
- 3 Hard Questions

Return only the questions.
`;
    const result = await model.generateContent(prompt);
    res.json({ success: true, questions: result.response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to generate questions" });
  }
});

router.post("/evaluate-answer", async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ success: false, message: "question and answer are required" });
    }

    const prompt = `
You are a senior technical interviewer evaluating a candidate's SPOKEN answer
(transcribed from speech-to-text, so minor transcription artifacts are expected
and should not be penalized as grammar mistakes).

Question:
${question}

Candidate's Answer (transcribed from speech):
${answer}

Evaluate the answer across three dimensions and return your response in
EXACTLY this format:

Overall Rating: X/10

Technical Accuracy:
- Correctness: <are the technical claims accurate?>
- Mistakes: <list specific technical errors or misconceptions, or "None found">
- Depth: <did they cover the topic thoroughly or stay surface-level?>

Communication & Clarity:
- Grammar/Language: <note only genuine grammatical issues, ignore normal speech
  transcription quirks like missing punctuation or filler words>
- Structure: <was the answer well-organized, or rambling/hard to follow?>
- Conciseness: <too verbose, too brief, or appropriate?>

Strengths:
- Point 1
- Point 2

Areas to Improve:
- Point 1
- Point 2

Suggested Model Answer Outline:
- Point 1
- Point 2
`;

    const result = await model.generateContent(prompt);
    res.json({ success: true, feedback: result.response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Evaluation failed" });
  }
});

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