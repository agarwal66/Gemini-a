const express = require("express");
const bodyParser = require("body-parser");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config({ path: "./config.env" });

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Ensure API key is available
const api_key = process.env.API_KEY;
if (!api_key) {
  console.error("❌ Please set the API_KEY environment variable.");
  process.exit(1);
}

// ✅ Initialize Gemini
const genAI = new GoogleGenerativeAI(api_key);

// 🏠 Base route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    data: "Welcome to Gemini API by Prateek Agarwal",
  });
});

// 🤖 AI Text Generator Route
app.post("/generate-text", async (req, res) => {
  try {
    const prompt = req.body.prompt || "Write a story about a magic backpack.";

    // const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    // const model = genAI.getGenerativeModel({ model: "models/gemini-pro" });
  const model = genAI.getGenerativeModel({ model: "models/text-bison-001" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({
      status: "success",
      generatedText: text,
      by: "Prateek Agarwal",
    });
  } catch (error) {
    // Optional: Handle Gemini-specific safety filters
    if (
      error.name === "GoogleGenerativeAIResponseError" &&
      error.response?.promptFeedback?.safetyRatings?.some(
        (rating) => rating.label === "LIKELY" || rating.label === "VERY_LIKELY"
      )
    ) {
      console.error("🚫 Safety-related error:", error);
      return res.status(403).json({
        success: false,
        error: "Content blocked due to safety concerns",
      });
    }

    // Generic fallback
    console.error("❌ Internal Error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// ✅ Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
