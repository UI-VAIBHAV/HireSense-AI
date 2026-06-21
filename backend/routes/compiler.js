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

router.post("/run", async (req, res) => {
  try {
    const { code, language, input } = req.body;

    const response = await axios.post(
      "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
      {
        source_code: code,
        language_id: languageMap[language],
        stdin: input || "",
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: "Execution failed",
    });
  }
});

export default router;