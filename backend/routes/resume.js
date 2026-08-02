import express from "express";
import multer from "multer";
import fs from "fs";
import { PDFParse } from "pdf-parse";
import { model } from "../gemini.js";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB cap
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
});

router.post("/analyze", upload.single("resume"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No resume file uploaded" });
  }

  const filePath = req.file.path;

  try {
    const dataBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    const pdfData = await parser.getText();
    const resumeText = pdfData.text.slice(0, 5000);

    if (!resumeText.trim()) {
      return res.status(400).json({ success: false, message: "Could not extract text from PDF" });
    }

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
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    res.json({ success: true, analysis: result.response.text() });
  } catch (error) {
    console.error("RESUME ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    // Always clean up the temp file, whether we succeeded or failed
    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete temp file:", err);
    });
  }
});

// Handle multer errors (file too big, wrong type) cleanly
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message === "Only PDF files are allowed") {
    return res.status(400).json({ success: false, message: err.message });
  }
  next(err);
});

export default router;