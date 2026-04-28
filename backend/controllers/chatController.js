import { asyncHandler } from "../middleware/asyncHandler.js";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const chatWithGroq = asyncHandler(async (req, res) => {
  const { message, language } = req.body;

  if (!message || !String(message).trim()) {
    res.status(400);
    throw new Error("message is required");
  }

  const locale = language === "Hindi" || language === "hi" ? "Hindi" : "English";

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are Setu, an eco-friendly AI assistant for the Eco Harmony platform. 
          Your goal is to help users with waste management, composting, village clean-ups, and sustainability.
          Respond in ${locale}. Keep your answers concise, helpful, and encouraging. 
          If the user speaks in Hindi, respond in Hindi (Devanagari script).`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama-3.1-8b-instant", // Updated to an available model
      temperature: 0.7,
      max_tokens: 512,
      top_p: 1,
      stream: false,
    });

    const reply = chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't process that.";
    res.json({ success: true, reply });
  } catch (error) {
    console.error("Groq API Error:", error);
    res.status(500);
    throw new Error("Failed to get response from AI");
  }
});
