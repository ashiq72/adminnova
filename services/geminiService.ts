import { GoogleGenAI } from "@google/genai";

export const getAdminInsights = async (prompt: string, context: any) => {
  try {
    // Fix: Always use process.env.API_KEY directly for initialization as per GenAI guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a SuperAdmin Intelligence Assistant. Context: ${JSON.stringify(context)}. Question: ${prompt}`,
      config: {
        systemInstruction: "You are an expert systems administrator and data analyst. Provide concise, professional, and actionable insights based on the provided dashboard context. Do not use markdown headers; use bullet points or plain text.",
        temperature: 0.7,
      }
    });
    // Fix: Access the .text property directly instead of calling it as a method
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm sorry, I couldn't process that request right now. Please check system logs.";
  }
};