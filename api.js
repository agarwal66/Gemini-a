const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");

// ✅ Load env variables
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Get from .env
const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.post("/generate-text", async (req, res) => {
  const prompt = req.body.prompt || "Tell me a joke";

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiReply = response.data.choices[0].message.content;

    res.status(200).json({
      status: "success",
      generatedText: aiReply,
    });
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Groq AI Server running at http://localhost:${PORT}`);
});
