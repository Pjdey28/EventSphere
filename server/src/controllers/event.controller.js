import Event from "../models/event.model.js";
import Booking from "../models/booking.model.js";
import User from "../models/user.model.js";
import QRCode from "qrcode";
import Razorpay from "razorpay";
import crypto from "node:crypto";
import Review from "../models/review.model.js";

export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      city,
      venue,
      mode,
      banner,
      startDate,
      endDate,
      ticketTypes,
      agenda,
      speakers,
      faqs,
      discountCodes,
      sessions,
    } = req.body;

    if (!title || !description || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Title, description, startDate and endDate are required",
      });
    }

    const event = await Event.create({
      organiser: req.user?._id || null,
      title,
      description,
      category,
      city,
      venue,
      mode,
      banner,
      startDate,
      endDate,
      ticketTypes,
      agenda,
      speakers,
      faqs,
      discountCodes,
      sessions,
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create event",
      error: error.message,
    });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("organiser", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: error.message,
    });
  }
};

export const getSingleEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organiser", "name email")
      .populate("attendees", "name email")
      

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch event",
      error: error.message,
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update event",
      error: error.message,
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete event",
      error: error.message,
    });
  }
};


export const registerForEvent = async (req, res) => {
  try {
    const { ticketName, quantity } = req.body;

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const ticket = event.ticketTypes.find(
      (t) => t.name.toLowerCase() === ticketName.toLowerCase()
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket type not found",
      });
    }

    const availableSeats = ticket.capacity - ticket.sold;

    if (availableSeats < quantity) {
      return res.status(400).json({
        success: false,
        message: "Not enough seats available",
      });
    }

    ticket.sold += quantity;
    event.totalRevenue += ticket.price * quantity;

    await event.save();

    return res.status(200).json({
      success: true,
      message: "Registered successfully",
      event,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

const getDiscount = (event, code, subtotal) => {
  if (!code) return 0;
  const discount = event.discountCodes?.find((item) => item.code.toLowerCase() === code.toLowerCase());
  if (!discount || (discount.expiresAt && new Date(discount.expiresAt) < new Date()) || (discount.usageLimit && discount.used >= discount.usageLimit)) return 0;
  return Math.min(subtotal, discount.amount || subtotal * ((discount.percent || 0) / 100));
};

export const createCheckout = async (req, res) => {
  try {
    const { tickets = [], discountCode } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    let subtotal = 0;
    const normalized = tickets.map(({ ticketName, quantity }) => {
      const ticket = event.ticketTypes.find((item) => item.name.toLowerCase() === ticketName.toLowerCase());
      if (!ticket || quantity < 1 || ticket.capacity - ticket.sold < quantity) throw new Error(`Ticket unavailable: ${ticketName}`);
      const activeEarlyBird = ticket.earlyBirdPrice > 0 && ticket.earlyBirdDeadline && new Date(ticket.earlyBirdDeadline) >= new Date();
      const price = activeEarlyBird ? ticket.earlyBirdPrice : ticket.price;
      subtotal += price * quantity;
      return { ticketType: ticket.name, quantity, price };
    });
    const discount = getDiscount(event, discountCode, subtotal);
    const totalAmount = Math.max(0, subtotal - discount);
    let order = { id: `demo_${crypto.randomUUID()}`, amount: totalAmount * 100, currency: "INR" };
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && totalAmount > 0) {
      const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
      order = await razorpay.orders.create({ amount: Math.round(totalAmount * 100), currency: "INR", receipt: `event_${event._id}` });
    }
    return res.json({ success: true, order, keyId: process.env.RAZORPAY_KEY_ID || "demo", subtotal, discount, totalAmount, tickets: normalized });
  } catch (error) {
    return res.status(400).json({ message: error.message || "Checkout failed" });
  }
};

export const completeCheckout = async (req, res) => {
  try {
    const { tickets = [], totalAmount, paymentId = "demo_payment", attendee = {} } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    for (const item of tickets) {
      const ticket = event.ticketTypes.find((entry) => entry.name === item.ticketType);
      if (!ticket || ticket.capacity - ticket.sold < item.quantity) return res.status(400).json({ message: "Ticket capacity changed. Please retry." });
      ticket.sold += item.quantity;
    }
    event.totalRevenue += totalAmount;
    await event.save();
    const booking = await Booking.create({ event: event._id, tickets, totalAmount, paymentStatus: "paid", paymentId, attendeeName: attendee.name, attendeeEmail: attendee.email });
    booking.qrCode = await QRCode.toDataURL(`EVENTSPHERE:${booking._id}`);
    await booking.save();
    return res.status(201).json({ success: true, booking, event });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Payment completion failed" });
  }
};

export const checkIn = async (req, res) => {
  try {
    const bookingId = req.body.bookingId || req.body.code?.replace("EVENTSPHERE:", "");
    const booking = await Booking.findById(bookingId).populate("event");
    if (!booking) return res.status(404).json({ message: "Ticket not found" });
    if (booking.checkedIn) return res.status(400).json({ message: "Ticket already checked in", booking });
    booking.checkedIn = true;
    await booking.save();
    return res.json({ success: true, message: "Attendee checked in", booking });
  } catch (error) {
    return res.status(400).json({ message: "Invalid ticket code" });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    const bookings = await Booking.find({ event: event._id }).sort({ createdAt: -1 });
    const registered = bookings.reduce((total, booking) => total + booking.tickets.reduce((sum, ticket) => sum + ticket.quantity, 0), 0);
    const checkedIn = bookings.filter((booking) => booking.checkedIn).length;
    return res.json({ success: true, event, bookings, stats: { registered, checkedIn, revenue: event.totalRevenue } });
  } catch (error) {
    return res.status(500).json({ message: "Dashboard unavailable" });
  }
};

export const toggleWishlist = async (req, res) => {
  const { userId, saved } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  const exists = user.wishlist.some((id) => id.toString() === req.params.id);
  if (saved ?? !exists) user.wishlist.addToSet(req.params.id);
  else user.wishlist.pull(req.params.id);
  await user.save();
  return res.json({ success: true, saved: user.wishlist.some((id) => id.toString() === req.params.id) });
};

export const generateDescription = async (req, res) => {
  const { bullets = [], sessions = [] } = req.body;
  if (!bullets.length) return res.status(400).json({ message: "Add at least one event bullet" });
  if (process.env.GROQ_API_KEY) {
    const { default: Groq } = await import("groq-sdk");
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await client.chat.completions.create({ model: "llama-3.1-8b-instant", messages: [{ role: "user", content: `Write a polished event description from these points: ${bullets.join("; ")}` }], temperature: 0.7 });
    return res.json({ success: true, description: completion.choices[0]?.message?.content || bullets.join(" ") });
  }
  return res.json({ success: true, description: `${bullets.join(". ")}. Join us for a thoughtfully curated experience with practical takeaways, meaningful connections, and a welcoming community.` , schedule: sessions.slice().sort((a, b) => String(a.startTime).localeCompare(String(b.startTime))) });
};

export const suggestSchedule = async (req, res) => {
  const sessions = Array.isArray(req.body.sessions) ? req.body.sessions : [];
  return res.json({ success: true, sessions: sessions.slice().sort((a, b) => String(a.startTime).localeCompare(String(b.startTime))), reason: "Sessions are ordered by start time to preserve speaker availability and audience flow." });
};

export const createReview = async (req, res) => {
  const { rating, comment, userId } = req.body;
  const review = await Review.create({ event: req.params.id, rating, comment, user: userId || undefined });
  await Event.findByIdAndUpdate(req.params.id, { $push: { reviews: review._id } });
  return res.status(201).json({ success: true, review });
};

export const requestRefund = async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(req.params.bookingId, { refundStatus: "requested" }, { new: true });
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  return res.json({ success: true, message: "Refund request sent to organiser", booking });
};

export const decideRefund = async (req, res) => {
  const status = ["approved", "rejected"].includes(req.body.status) ? req.body.status : "rejected";
  const booking = await Booking.findByIdAndUpdate(req.params.bookingId, { refundStatus: status, paymentStatus: status === "approved" ? "failed" : "paid" }, { new: true });
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  return res.json({ success: true, booking, payout: status === "approved" ? "reversed in sandbox" : "retained" });
};

export const networkingOptIn = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.body.userId, { linkedin: req.body.linkedin, networkingOptIn: req.body.optIn !== false }, { new: true });
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json({ success: true, message: "Networking preference saved" });
};

export const getRecommendations = async (req, res) => {
  const events = await Event.find({ _id: { $ne: req.body.excludeId } }).sort({ createdAt: -1 }).limit(6);
  return res.json({ success: true, recommendations: events, basis: "recent categories and attended events" });
};