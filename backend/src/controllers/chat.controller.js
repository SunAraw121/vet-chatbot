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
    if (message.toLowerCase() === "reset" || message.toLowerCase() === "clear") {
      session.appointmentDraft = {};
      session.lastIntent = "GENERAL_QUERY";
      session.messages = [];
      await session.save();
      return res.json({ reply: "Session reset! How can I help you today?", sessionId });
    }

    // 3. User Message Persistence
    session.messages.push({ role: "user", content: message });

    let botReply = "";
    let intent = session.lastIntent;

    // 4. Intent Detection (Only if not already in deep booking)
    if (intent === "GENERAL_QUERY") {
      // Check for keywords first to avoid unnecessary AI calls
      const lowerMsg = message.toLowerCase();
      const hasBookingKeywords = ["book", "appointment", "schedule", "vet visit"].some(k => lowerMsg.includes(k));

      if (hasBookingKeywords) {
        intent = await detectIntentWithAI(message);
        if (intent === "BOOK_APPOINTMENT") {
          session.lastIntent = "BOOK_APPOINTMENT";
          session.appointmentDraft = {};
        }
      }
    }

    // 5. Booking Flow Logic
    if (intent === "BOOK_APPOINTMENT") {
      const draft = session.appointmentDraft || {};

      // Exit booking flow explicitly
      if (["cancel", "stop", "exit", "no"].includes(message.toLowerCase())) {
        session.appointmentDraft = {};
        session.lastIntent = "GENERAL_QUERY";
        // Handle as a general query instead of just stopping
        botReply = await getVetAIResponse(message, session.messages);
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
        botReply = "✅ Appointment booked! See you then. Is there anything else?";
      }
      // Slot Filling
      else {
        if (!draft.ownerName) draft.ownerName = message;
        else if (!draft.petName) draft.petName = message;
        else if (!draft.phone) draft.phone = message;
        else if (!draft.datetime) draft.datetime = message;

        session.appointmentDraft = draft;
        const nextQuestion = getNextAppointmentQuestion(draft);

        if (nextQuestion) {
          botReply = nextQuestion;
        } else {
          botReply = `Please confirm your details:\n- **Owner**: ${draft.ownerName}\n- **Pet**: ${draft.petName}\n- **Phone**: ${draft.phone}\n- **Date**: ${draft.datetime}\n\nReply **YES** to confirm or **CANCEL** to exit.`;
        }
      }
    }
    // 6. General AI Response
    else {
      botReply = await getVetAIResponse(message, session.messages);
    }

    // 7. Bot Message Persistence & Cleanup
    session.messages.push({ role: "bot", content: botReply });
    session.updatedAt = new Date();
    await session.save();

    return res.json({ reply: botReply, sessionId });
  } catch (error) {
    console.error("Critical Chat Handler Error:", error);
    return res.status(500).json({ error: "Internal server error" });
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
