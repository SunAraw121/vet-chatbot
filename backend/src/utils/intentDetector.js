export function detectIntent(message) {
  const text = message.toLowerCase();

  if (
    text.includes("book") ||
    text.includes("appointment") ||
    text.includes("schedule") ||
    text.includes("vet visit") ||
    text.includes("see a vet") ||
    text.includes("checkup")
  ) {
    return "BOOK_APPOINTMENT";
  }

  return "GENERAL_QUERY";
}
