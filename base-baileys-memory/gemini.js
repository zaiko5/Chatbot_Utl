import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCrmfXdTT-NPotAjQAR4Oe1Xyo_5xOf5HE");

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function responderGemini(prompt, mensaje) {
  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      },
      {
        role: "user",
        parts: [{ text: mensaje }]
      }
    ]
  });
  const response = await result.response;
  return response.text();
}