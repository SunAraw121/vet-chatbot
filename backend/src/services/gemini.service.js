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
  const systemPrompt = `You are "Dr. Paw", a virtual veterinary assistant.

ROLE & OBJECTIVE:
- Provide helpful, accurate, and concise advice on generic veterinary topics (pet care, nutrition, vaccinations, common symptoms).
- If a user asks about appointment booking, guide them to use the "Book Appointment" feature or say "I can help via the booking flow".

CONSTRAINTS (STRICT):
- Answer ONLY veterinary-related questions.
- If the question is unrelated to pets/animals (e.g., coding, math, movies), politely refuse: "I can only help with veterinary questions."
- KEEP RESPONSES SHORT AND CONCISE (max 2-3 paragraphs). Do not ramble.
- Use formatting (bullet points, bold text) for readability.
- DISCLAIMER: Always imply you are an AI assistant, not a real doctor. For medical emergencies, advise seeing a real vet immediately.

CONTEXT:
The following is the conversation history. Use it to maintain continuity.
`;

  // Format history for the prompt
  // Limit history to last 10 messages to avoid token limits
  const recentHistory = conversationHistory.slice(-10).map(msg => `${msg.role === 'user' ? 'User' : 'Dr. Paw'}: ${msg.content}`).join("\n");

  const fullPrompt = `${systemPrompt}\n\nCONVERSATION HISTORY:\n${recentHistory}\n\nCURRENT USER REQUEST:\n${userMessage}\n\nDr. Paw:`;

  // DIRECT REST API CASCADE (Bypassing SDK issues)
  // Structure: [ModelName, API_Version]
  // Based on verified 'list-models' output
  const strategies = [
    ["gemini-1.5-flash", "v1beta"],      // Standard
    ["gemini-1.5-flash-latest", "v1beta"], // Latest alias
    ["gemini-1.5-flash-001", "v1beta"],  // Specific version
    ["gemini-flash-latest", "v1beta"],   // General latest
    ["gemini-1.5-pro", "v1beta"],
    ["gemini-1.5-pro-latest", "v1beta"],
    ["gemini-pro", "v1"]                 // Legacy fallback
  ];

  let lastError;

  for (const [modelName, version] of strategies) {
    try {
      const url = `https://generativelanguage.googleapis.com/${version}/models/${modelName}:generateContent?key=${key}`;

      const payload = {
        contents: [
          { role: "user", parts: [{ text: fullPrompt }] }
        ]
      };

      console.log(`📡 Sending REST request to ${modelName} (${version})...`);
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`${modelName} [${version}] Error ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) throw new Error("No text returned from Gemini REST API");
      return text; // Success!

    } catch (e) {
      console.warn(`⚠️ REST Model ${modelName} (${version}) failed:`, e.message);
      lastError = e;
    }
  }

  // If we get here, all failed
  console.error("❌ All REST models failed.");

  // Check if it was a quota issue (common with free tier)
  if (lastError?.message?.includes("429") || lastError?.message?.includes("Quota")) {
    return "Dr. Paw is currently experiencing very high traffic (AI Quota Exceeded). However, I can still help you book an appointment! Just say **'Book an appointment'**.";
  }

  // Generic fallback
  return "Dr. Paw is having trouble connecting to the brain. Please try again later, or say **'Book an appointment'** to schedule a visit directly.";
}

/**
 * Detect if a user wants to book an appointment using AI for better precision
 */
export async function detectIntentWithAI(message) {
  const lower = (message || "").toLowerCase();

  // 1. FAST PATH: Strong Regex Check
  // Save API tokens for the actual conversation
  if (lower.includes("book") || lower.includes("appointment") || lower.includes("schedule") || lower.includes("visit")) {
    console.log("⚡ Intent Auto-Detected via Keywords: BOOK_APPOINTMENT");
    return "BOOK_APPOINTMENT";
  }

  if (!process.env.GEMINI_API_KEY) return "GENERAL_QUERY";

  const key = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;

  const prompt = `Classify into ONE: "BOOK_APPOINTMENT" or "GENERAL_QUERY". 
  Choose "BOOK_APPOINTMENT" only if they want a new appointment.
  Message: "${message}"`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await response.json();
    const text = (data.candidates?.[0]?.content?.parts?.[0]?.text || "").trim().toUpperCase();

    if (text.includes("BOOK_APPOINTMENT")) return "BOOK_APPOINTMENT";
    return "GENERAL_QUERY";
  } catch (error) {
    console.warn("⚠️ Intent Detection Fallback (API Error):", error.message);
    return "GENERAL_QUERY";
  }
}
