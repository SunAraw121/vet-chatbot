import Session from "../models/Session.js";
import Appointment from "../models/Appointment.js";

import { detectIntent } from "../utils/intentDetector.js";
import { getNextAppointmentQuestion } from "../utils/appointmentFlow.js";

import { getVetAIResponse } from "../services/gemini.service.js";

/**
 * Main chat handler
 * Responsibility:
 * - Maintain conversation state
 * - Detect intent
 * - Handle appointment booking flow
 * - Persist messages and appointments
 */
export async function handleChat(req, res) {
  const { sessionId, message, context } = req.body;

  /* --------------------------------------------------
   * 1️⃣ Basic request validation
   * --------------------------------------------------
   * We cannot process a chat message without:
   * - sessionId → identifies the conversation
   * - message   → user input
   */
  if (!sessionId || !message) {
    return res.status(400).json({
      error: "sessionId and message required"
    });
  }

  /* --------------------------------------------------
   * 2️⃣ Fetch or create session
   * --------------------------------------------------
   * A session represents ONE conversation.
   * If it does not exist, this is the first message.
   */
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

  /* --------------------------------------------------
   * 3️⃣ Persist user message immediately
   * --------------------------------------------------
   * This guarantees:
   * - no data loss
   * - correct conversation history
   * - reliable debugging/audit trail
   */
  session.messages.push({
    role: "user",
    content: message
  });

  /* --------------------------------------------------
   * 4️⃣ Intent detection (state-aware)
   * --------------------------------------------------
   * If we are already in BOOK_APPOINTMENT,
   * we DO NOT re-detect intent.
   */
  let intent = session.lastIntent;
  let intentJustChanged = false;

  // Detect intent change and immediately ask for the first piece of info
  if (intent === "GENERAL_QUERY") {
    const newIntent = detectIntent(message);
    if (newIntent === "BOOK_APPOINTMENT") {
      intent = "BOOK_APPOINTMENT";
      session.lastIntent = intent;
      intentJustChanged = true;

      // Reset any stale draft and ask for the owner's name
      session.appointmentDraft = {};
    }
  }

  let botReply = "";

  /* --------------------------------------------------
   * 5️⃣ Confirmation handling (YES / NO)
   * --------------------------------------------------
   */
  if (
    intent === "BOOK_APPOINTMENT" &&
    session.appointmentDraft?.datetime &&
    !intentJustChanged // If we just shifted to BOOK_APPOINTMENT, it can't be a confirmation yet
  ) {
    if (message.toLowerCase() === "yes") {
      const draft = session.appointmentDraft;

      // Create final appointment record
      await Appointment.create({
        sessionId,
        ownerName: draft.ownerName,
        petName: draft.petName,
        phone: draft.phone,
        datetime: draft.datetime
      });

      // Reset conversation state
      session.appointmentDraft = {};
      session.lastIntent = "GENERAL_QUERY";

      botReply = "✅ Your appointment has been booked successfully! Is there anything else I can help you with?";
    } else if (message.toLowerCase() === "no" || message.toLowerCase() === "restart") {
      // Reset draft and restart
      session.appointmentDraft = {};
      botReply = "No problem! Let's restart the booking. What is your name?";
    }
  }

  /* --------------------------------------------------
   * 6️⃣ Appointment slot-filling flow
   * --------------------------------------------------
   */
  else if (intent === "BOOK_APPOINTMENT") {
    const draft = session.appointmentDraft || {};

    // Basic restart detection at any point
    if (message.toLowerCase() === "restart") {
      session.appointmentDraft = {};
      botReply = "Let's start over. What is your name?";
    } else if (intentJustChanged) {
      // If we just switched to booking mode, ask for the first piece of info
      botReply = "Sure! Let's get your appointment set up. What is your name?";
    } else {
      // Fill the next missing slot
      if (!draft.ownerName) {
        draft.ownerName = message;
      } else if (!draft.petName) {
        draft.petName = message;
      } else if (!draft.phone) {
        // Basic phone validation (just check length for simplicity)
        if (message.length < 10) {
          botReply = "That doesn't look like a valid phone number. Please provide a 10-digit number.";
        } else {
          draft.phone = message;
        }
      } else if (!draft.datetime) {
        draft.datetime = message;
      }
    }

    session.appointmentDraft = draft;

    // Only decide next question if we haven't already set a botReply (e.g. for validation error)
    if (!botReply) {
      const nextQuestion = getNextAppointmentQuestion(draft);

      if (nextQuestion) {
        botReply = nextQuestion;
      } else {
        // All slots filled → ask for confirmation
        botReply = `Please confirm your appointment details:
  
- **Owner**: ${draft.ownerName}
- **Pet**: ${draft.petName}
- **Phone**: ${draft.phone}
- **Date & Time**: ${draft.datetime}

Reply **YES** to confirm or **NO** to restart.`;
      }
    }
  }

  /* --------------------------------------------------
   * 7️⃣ Default response (non-booking)
   * --------------------------------------------------
   * Temporary placeholder.
   * This will be replaced by Gemini AI in Phase 4.
   */
  else {
    botReply = await getVetAIResponse(
      message,
      session.messages
    );
  }

  /* --------------------------------------------------
   * 8️⃣ Store bot response
   * --------------------------------------------------
   * We store bot messages for:
   * - chat history replay
   * - AI context
   */
  session.messages.push({
    role: "bot",
    content: botReply
  });

  /* --------------------------------------------------
   * 9️⃣ Update session timestamp & persist
   * --------------------------------------------------
   */
  session.updatedAt = new Date();
  await session.save();

  /* --------------------------------------------------
   * 🔟 Respond to frontend
   * --------------------------------------------------
   */
  return res.json({
    reply: botReply,
    sessionId
  });
}
/**
 * Get conversation history for a session
 */
export async function getConversationHistory(req, res) {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required" });
    }

    const session = await Session.findOne({ sessionId });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    return res.json({
      sessionId: session.sessionId,
      messages: session.messages,
      context: session.context,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt
    });
  } catch (error) {
    console.error("Error fetching conversation history:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Get all appointments (Admin)
 */
export async function getAppointments(req, res) {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    return res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

