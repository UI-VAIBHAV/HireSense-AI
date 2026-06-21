import express from "express";
import multer from "multer";
import fs from "fs";
import { PDFParse } from "pdf-parse";
import { model } from "../gemini.js";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    const dataBuffer = fs.readFileSync(req.file.path);

    const parser = new PDFParse({
      data: dataBuffer,
    });

    const pdfData = await parser.getText();

    const resumeText = pdfData.text.slice(0, 5000);

    const prompt = `
You are an ATS Resume Analyzer.

Return:

ATS Score: X/100

Strengths:
- ...

Weaknesses:
- ...

Missing Skills:
- ...

Interview Readiness: X/10

Suggestions:
- ...

Resume:
${resumeText}
`;

    let result;

for (let i = 0; i < 3; i++) {
  try {
    result = await model.generateContent(prompt);
    break;
  } catch (error) {
    if (i === 2) throw error;

    await new Promise((resolve) =>
      setTimeout(resolve, 2000)
    );
  }
}

    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      analysis: result.response.text(),
    });
  } catch (error) {
    console.error("RESUME ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;