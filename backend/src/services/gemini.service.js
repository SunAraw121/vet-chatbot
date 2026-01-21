import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Generate a veterinary-only AI response
 */
export async function getVetAIResponse(userMessage, conversationHistory) {
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
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
      systemInstruction: { parts: [{ text: systemPrompt }] }
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
    console.error("❌ Gemini AI Error:", error.message || error);
    const errText = (error.message || "Unknown").substring(0, 50);
    return `Dr. Paw is resting (Error: ${errText}...). Please try again!`;
  }
}

/**
 * Detect if a user wants to book an appointment using AI for better precision
 */
export async function detectIntentWithAI(message) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const prompt = `Classify the following user message into ONE of two categories: "BOOK_APPOINTMENT" or "GENERAL_QUERY".
  "BOOK_APPOINTMENT" is for when the user EXPLICITLY wants to schedule, book, or make an appointment for a vet visit.
  "GENERAL_QUERY" is for everything else, including greetings, generic vet questions, or talk about past visits.

  Message: "${message}"
  Category:`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim().toUpperCase();

    if (text.includes("BOOK_APPOINTMENT")) return "BOOK_APPOINTMENT";
    return "GENERAL_QUERY";
  } catch (error) {
    console.error("❌ Intent AI Error:", error.message || error);
    // Fallback to basic keywords
    const lower = message.toLowerCase();
    if (lower.includes("book") || lower.includes("appointment") || lower.includes("schedule")) {
      return "BOOK_APPOINTMENT";
    }
    return "GENERAL_QUERY";
  }
}
