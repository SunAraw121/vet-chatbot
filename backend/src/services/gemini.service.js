import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Generate a veterinary-only AI response
 * @param {string} userMessage
 * @param {Array} conversationHistory
 */
export async function getVetAIResponse(userMessage, conversationHistory) {
  // Initialize inside the function to ensure process.env.GEMINI_API_KEY is loaded
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const systemPrompt = `You are "Dr. Paw", a friendly and highly knowledgeable veterinary assistant. 

Your goal is to help pet owners with generic veterinary advice and pet care tips. 
You should be empathetic, professional, and detailed in your responses.

GUIDELINES:
- Answer ONLY generic veterinary-related questions (pet care, vaccines, nutrition, illnesses, etc.).
- Be conversational. Don't just give a list; explain why.
- If a user shares a pet's symptom, remind them that you are an AI and they should see a vet for a diagnosis, but provide helpful general info.
- Do NOT answer non-veterinary questions (e.g., math, coding, general news). Politely steer the conversation back to pets.
- If the user wants to book an appointment, let the system handle the booking flow, but you can say "I can help you with that! Just say 'Book Appointment'."`;

  try {
    console.log(`🤖 Requesting Gemini for: "${userMessage.substring(0, 50)}..."`);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // Use 1.5 flash for better reliability and performance
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      }
    });

    const chat = model.startChat({
      history: conversationHistory.map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      }))
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("❌ Gemini API Service Error:", error);
    if (error.message?.includes("API_KEY_INVALID")) {
      return "I'm having trouble connecting to my AI brain (invalid API key). Please check the backend configuration.";
    }
    return "I'm sorry, I'm having a bit of trouble answering that right now. Could you please try again?";
  }
}
