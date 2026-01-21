export function getNextAppointmentQuestion(draft) {
  if (!draft.ownerName) {
    return "What is your name?";
  }

  if (!draft.petName) {
    return "What is your pet’s name?";
  }

  if (!draft.phone) {
    return "Please share your phone number.";
  }

  if (!draft.datetime) {
    return "What date and time would you prefer for the appointment?";
  }

  return null; // all slots filled
}
