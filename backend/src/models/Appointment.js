import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true
  },
  ownerName: {
    type: String,
    required: true
  },
  petName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  datetime: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Appointment", AppointmentSchema);
