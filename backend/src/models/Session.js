import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "bot"],
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

const sessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true
    },
    context: {
      type: Object,
      default: {}
    },
    messages: {
      type: [messageSchema],
      default: []
    },
    appointmentDraft: {
      ownerName: String,
      petName: String,
      phone: String,
      datetime: String
    },
    lastIntent: {
      type: String,
      enum: ["GENERAL_QUERY", "BOOK_APPOINTMENT"],
      default: "GENERAL_QUERY"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Session", sessionSchema);
