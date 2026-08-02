import express from "express";
import axios from "axios";

const router = express.Router();

const languageMap = {
  cpp: 54,
  c: 50,
  java: 62,
  python: 71,
  javascript: 63,
  typescript: 74,
};

const JUDGE0_URL = "https://ce.judge0.com/submissions?base64_encoded=false&wait=true";

router.post("/run", async (req, res) => {
  try {
    const { code, language, input } = req.body;

    if (!code || typeof code !== "string") {
      return res.status(400).json({ success: false, message: "code is required" });
    }
    if (code.length > 20000) {
      return res.status(400).json({ success: false, message: "code too long" });
    }
    const language_id = languageMap[language];
    if (!language_id) {
      return res.status(400).json({
        success: false,
        message: `Unsupported language "${language}". Supported: ${Object.keys(languageMap).join(", ")}`,
      });
    }

    const response = await axios.post(
      JUDGE0_URL,
      { source_code: code, language_id, stdin: input || "" },
      { timeout: 15000 }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);

    const status = error.response?.status;
    if (status === 429) {
      return res.status(429).json({
        success: false,
        message: "Code execution service is rate-limited. Please wait a moment and try again.",
      });
    }

    const isTimeout = error.code === "ECONNABORTED";
    res.status(isTimeout ? 504 : 500).json({
      success: false,
      message: isTimeout ? "Execution timed out" : "Execution failed",
    });
  }
});

export default router;