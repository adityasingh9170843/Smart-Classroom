import { Router } from "express";
import { GoogleGenAI } from "@google/genai";

export const aiRouter = Router();
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,});

aiRouter.post("/chat", async (req, res) => {
  try {
    const { message, context } = req.body;

    const systemPrompt = `You are an AI assistant for a Smart Classroom Scheduler application. 
You help users with scheduling questions.

Current context: ${JSON.stringify(context || {})}

Provide helpful, accurate responses about scheduling, timetable management, and educational administration.`;

    const { text } = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [`${systemPrompt}\nUser: ${message}\nAI:`],
    });

    res.json({ response: text });
  } catch (error) {
    console.error("AI Chat error:", error);
    res.status(500).json({ error: "Failed to process AI request" });
  }
});
