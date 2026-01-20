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

    // 2. Global Reset Logic (Force clear stuck states)
    if (["reset", "clear", "restart", "start over"].includes(message.toLowerCase())) {
      session.appointmentDraft = {};
      session.lastIntent = "GENERAL_QUERY";
      session.messages = [];
      await session.save();
      return res.json({ reply: "Session reset! I'm ready for your questions. How can I help you and your pet today?", sessionId });
    }

    // 3. Persist user message
    session.messages.push({ role: "user", content: message });

    let botReply = "";

    // 4. SMART Intent Detection
    // We check intent EVERY TIME if we haven't finished the booking, 
    // to allow users to switch back to medical questions.
    const intent = await detectIntentWithAI(message);

    // 5. Handle Booking Flow
    if (intent === "BOOK_APPOINTMENT" || session.lastIntent === "BOOK_APPOINTMENT") {
      const draft = session.appointmentDraft || {};

      // If they were in booking but asked something else (and the AI detected GENERAL_QUERY),
      // we should respect that and switch back.
      if (intent === "GENERAL_QUERY" && session.lastIntent === "BOOK_APPOINTMENT") {
        // Only switch back if they aren't answering a specific question
        // But for safety, let's just let AI take over
        session.lastIntent = "GENERAL_QUERY";
        botReply = await getVetAIResponse(message, session.messages);
      }
      // Handle cancellation
      else if (["cancel", "stop", "exit", "no"].includes(message.toLowerCase())) {
        session.appointmentDraft = {};
        session.lastIntent = "GENERAL_QUERY";
        botReply = "Booking cancelled. What else can I help you with?";
      }
      // Handle confirmation
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
        botReply = "✅ Your appointment is booked! I've sent the details to our team. Do you have any pet health questions for me?";
      }
      // Filling Slots
      else {
        session.lastIntent = "BOOK_APPOINTMENT";

        // Very basic slot filler - just takes whatever they sent next
        if (!draft.ownerName) draft.ownerName = message;
        else if (!draft.petName) draft.petName = message;
        else if (!draft.phone) draft.phone = message;
        else if (!draft.datetime) draft.datetime = message;

        session.appointmentDraft = draft;
        const nextQuestion = getNextAppointmentQuestion(draft);

        if (nextQuestion) {
          botReply = nextQuestion;
        } else {
          botReply = `Got it! Please confirm:\n- **Owner**: ${draft.ownerName}\n- **Pet**: ${draft.petName}\n- **Phone**: ${draft.phone}\n- **Time**: ${draft.datetime}\n\nType **YES** to confirm or **CANCEL** to start over.`;
        }
      }
    }
    // 6. Handle General Medical/Pet Care Query
    else {
      session.lastIntent = "GENERAL_QUERY";
      botReply = await getVetAIResponse(message, session.messages);
    }

    // 7. Persist and Respond
    session.messages.push({ role: "bot", content: botReply });
    session.updatedAt = new Date();
    await session.save();

    return res.json({ reply: botReply, sessionId });
  } catch (error) {
    console.error("Critical Chat Handler Error:", error);
    return res.status(500).json({ error: "Sorry, I had a momentary brain freeze. Could you try that again?" });
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
