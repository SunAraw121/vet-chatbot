import Session from "../models/Session.js";
import Appointment from "../models/Appointment.js";

import { getNextAppointmentQuestion } from "../utils/appointmentFlow.js";
import { getVetAIResponse, detectIntentWithAI } from "../services/gemini.service.js";

/**
 * Main chat handler
 */
export async function handleChat(req, res) {
  try {
    const { sessionId, message, context } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ error: "sessionId and message required" });
    }

    // 1. Fetch or create session
    let session = await Session.findOne({ sessionId });
    if (!session) {
      session = await Session.create({
        sessionId,
        context: context || {},
        messages: [],
        appointmentDraft: {},
        lastIntent: "GENERAL_QUERY"
      });
    }

    // 2. Global Reset Logic
    if (["reset", "clear", "restart", "cancel"].includes(message.toLowerCase())) {
      session.appointmentDraft = {};
      session.lastIntent = "GENERAL_QUERY";
      console.log(`🧹 Session ${sessionId} reset by user.`);
      await session.save();
      return res.json({ reply: "I've reset our conversation. I am Dr. Paw, your AI Vet assistant. How can I help you today?", sessionId });
    }

    // 3. Persist user message
    session.messages.push({ role: "user", content: message });

    let botReply = "";
    let aiIntent = null;

    /* --------------------------------------------------
     * 4️⃣ OPTIMIZED Intent Detection
     * -------------------------------------------------- */

    // If ALREADY in booking flow, skip AI detection (saves quota)
    if (session.lastIntent === "BOOK_APPOINTMENT") {
      console.log("⚡ Skipping AI detection - already in booking flow");
      aiIntent = "BOOK_APPOINTMENT"; // Force booking flow continuation
    } else {
      // Only detect intent if NOT in booking flow
      aiIntent = await detectIntentWithAI(message);
      console.log(`🤖 AI Detected Intent: ${aiIntent}`);
    }

    /* --------------------------------------------------
     * 5️⃣ Handle Intent & Response
     * -------------------------------------------------- */

    // CASE A: User is in booking flow OR wants to start one
    if (aiIntent === "BOOK_APPOINTMENT" || session.lastIntent === "BOOK_APPOINTMENT") {

      // SUB-CASE 1: Starting a FRESH booking flow
      if (session.lastIntent !== "BOOK_APPOINTMENT") {
        session.lastIntent = "BOOK_APPOINTMENT";
        session.appointmentDraft = {};
        botReply = "I can help you schedule an appointment. First, what is your name?";
      }

      // SUB-CASE 2: Already in booking flow - handle slot filling
      else {
        const draft = session.appointmentDraft || {};

        // Handle explicit cancellation
        if (["cancel", "reset", "restart"].includes(message.toLowerCase())) {
          session.appointmentDraft = {};
          session.lastIntent = "GENERAL_QUERY";
          botReply = "Appointment booking cancelled. How else can I help you?";
        }
        // Handle Confirmation (all slots filled)
        else if (draft.datetime && message.toLowerCase() === "yes") {
          await Appointment.create({
            sessionId,
            ownerName: draft.ownerName,
            petName: draft.petName,
            phone: draft.phone,
            datetime: draft.datetime
          });
          session.appointmentDraft = {};
          session.lastIntent = "GENERAL_QUERY";
          botReply = "✅ Your appointment is booked! You'll receive a confirmation soon. Do you have any other questions for Dr. Paw?";
        }
        else if (draft.datetime && message.toLowerCase() === "no") {
          session.appointmentDraft = {};
          session.lastIntent = "GENERAL_QUERY";
          botReply = "Appointment booking cancelled. How else can I help you?";
        }
        // Fill slots progressively
        else {
          session.lastIntent = "BOOK_APPOINTMENT";

          // Fill slots: name -> pet -> phone -> time
          if (!draft.ownerName) draft.ownerName = message;
          else if (!draft.petName) draft.petName = message;
          else if (!draft.phone) draft.phone = message;
          else if (!draft.datetime) draft.datetime = message;

          session.appointmentDraft = draft;
          const nextQuestion = getNextAppointmentQuestion(draft);

          if (nextQuestion) {
            botReply = nextQuestion;
          } else {
            botReply = `Got it! Please confirm these details:\n- **Owner**: ${draft.ownerName}\n- **Pet**: ${draft.petName}\n- **Phone**: ${draft.phone}\n- **Time**: ${draft.datetime}\n\nType **YES** to confirm or **CANCEL** to start over.`;
          }
        }
      }
    }
    // CASE B: General query - use AI
    else {
      session.lastIntent = "GENERAL_QUERY";
      session.appointmentDraft = {};
      botReply = await getVetAIResponse(message, session.messages);
    }

    // 6. Final Persist & Respond
    session.messages.push({ role: "bot", content: botReply });
    session.updatedAt = new Date();
    await session.save();

    return res.json({ reply: botReply, sessionId });
  } catch (error) {
    console.error("❌ Chat Controller Error:", error);
    return res.status(500).json({ error: "Dr. Paw is a bit overwhelmed. Please try again in a moment!" });
  }
}

export async function getConversationHistory(req, res) {
  const session = await Session.findOne({ sessionId: req.params.sessionId });
  if (!session) return res.status(404).json({ error: "Session not found" });
  return res.json(session);
}

export async function getAppointments(req, res) {
  const appointments = await Appointment.find().sort({ createdAt: -1 });
  return res.json(appointments);
}
