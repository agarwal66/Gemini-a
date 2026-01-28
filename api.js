const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.post("/generate-text", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile", // ✅ WORKING MODEL
        messages: [
          { role: "user", content: prompt }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      status: "success",
      generatedText: response.data.choices[0].message.content
    });

  } catch (error) {
    console.error("❌ Groq Error:", error.response?.data || error.message);
    res.status(500).json({
      status: "error",
      message: error.response?.data || error.message
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Groq API running at http://localhost:${PORT}`);
});
