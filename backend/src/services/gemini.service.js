import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Generate a veterinary-only AI response
 */
export async function getVetAIResponse(userMessage, conversationHistory) {
  console.log(`🤖 AI Request: ${userMessage.substring(0, 20)}...`);

  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY is missing from environment!");
    return "Dr. Paw's office is closed (Missing API Key).";
  }

  const key = process.env.GEMINI_API_KEY;
  console.log(`🔑 Key check: ${key.substring(0, 4)}...${key.substring(key.length - 4)} (Length: ${key.length})`);

  const genAI = new GoogleGenerativeAI(key);

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
      model: "gemini-1.5-flash",
      systemInstruction: { parts: [{ text: systemPrompt }] }
    });

    const chat = model.startChat({
      history: (conversationHistory || []).map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      }))
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("❌ Gemini AI Error:", error.message || error);
    if (error.message?.includes("403")) {
      return "Dr. Paw is resting (Error: API Key Restricted or Invalid). Please check your Google Cloud Console.";
    }
    return `Dr. Paw is resting (Error: ${error.message?.substring(0, 50)}...). Try again!`;
  }
}

/**
 * Detect if a user wants to book an appointment using AI for better precision
 */
export async function detectIntentWithAI(message) {
  if (!process.env.GEMINI_API_KEY) return "GENERAL_QUERY";

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const prompt = `Classify into ONE: "BOOK_APPOINTMENT" or "GENERAL_QUERY". 
  Choose "BOOK_APPOINTMENT" only if they want a new appointment.
  Message: "${message}"`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim().toUpperCase();

    if (text.includes("BOOK_APPOINTMENT")) return "BOOK_APPOINTMENT";
    return "GENERAL_QUERY";
  } catch (error) {
    console.warn("⚠️ Intent Detection Fallback:", error.message);
    const lower = (message || "").toLowerCase();
    if (lower.includes("book") || lower.includes("appointment") || lower.includes("schedule")) {
      return "BOOK_APPOINTMENT";
    }
    return "GENERAL_QUERY";
  }
}
