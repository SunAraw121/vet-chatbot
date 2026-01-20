import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Generate a veterinary-only AI response
 * @param {string} userMessage
 * @param {Array} conversationHistory
 */
export async function getVetAIResponse(userMessage, conversationHistory) {
  // Initialize inside the function to ensure process.env.GEMINI_API_KEY is loaded
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const systemPrompt = `You are a veterinary assistant chatbot.

You are allowed to answer ONLY generic veterinary-related questions such as:
- pet care
- vaccination schedules
- diet and nutrition
- common illnesses
- preventive care

You must NOT:
- answer non-veterinary questions
- give medical diagnoses
- prescribe medication

If a question is unrelated to veterinary care, politely say that you cannot help with that topic.`;

  try {
    const chat = model.startChat({
      history: conversationHistory.map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      })),
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      }
    });

    const result = await chat.sendMessage(userMessage);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error Full Details:", JSON.stringify(error, null, 2));
    console.error("Stack:", error.stack);
    if (error.message?.includes("API_KEY_INVALID")) {
      return "I'm having trouble connecting to my AI brain (invalid API key). Please check the backend configuration.";
    }
    return "I'm sorry, I'm having a bit of trouble answering that right now. Could you please try again?";
  }
}
