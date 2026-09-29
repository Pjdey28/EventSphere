import Reminder from "../models/reminder.model.js";
import Booking from "../models/booking.model.js";
import Event from "../models/event.model.js";

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) return false;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL, to: [to], subject, html }),
  });
  return response.ok;
};

export const runNotificationSweep = async () => {
  const now = new Date();
  const reminders = await Reminder.find({ sent: false, remindAt: { $lte: now } }).populate("event", "title startDate");
  for (const reminder of reminders) {
    const sent = await sendEmail({ to: reminder.email, subject: `Reminder: ${reminder.event.title}`, html: `<p>Your event <strong>${reminder.event.title}</strong> starts on ${new Date(reminder.event.startDate).toLocaleString()}.</p>` });
    if (sent) { reminder.sent = true; await reminder.save(); }
  }
  const feedbackBookings = await Booking.find({ feedbackEmailSent: false, attendeeEmail: { $exists: true, $ne: "" } }).populate("event", "title endDate");
  for (const booking of feedbackBookings) {
    if (!booking.event?.endDate || new Date(booking.event.endDate) > now) continue;
    const sent = await sendEmail({ to: booking.attendeeEmail, subject: `How was ${booking.event.title}?`, html: `<p>Thanks for attending ${booking.event.title}. Please share your feedback at ${process.env.CLIENT_URL || "http://localhost:3000"}/attendee/${booking.event._id}.</p>` });
    if (sent) { booking.feedbackEmailSent = true; await booking.save(); }
  }
};
