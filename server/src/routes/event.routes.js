import express from "express";

import {
  createEvent,
  getAllEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  createCheckout,
  completeCheckout,
  verifyCheckout,
  checkIn,
  getDashboard,
  toggleWishlist,
  generateDescription,
  suggestSchedule,
  createReview,
  requestRefund,
  decideRefund,
  networkingOptIn,
  getRecommendations,
} from "../controllers/event.controller.js";

const router = express.Router();

router.post("/", createEvent);
router.post("/ai/description", generateDescription);
router.post("/ai/schedule", suggestSchedule);
router.post("/recommendations", getRecommendations);
router.post("/:id/review", createReview);
router.post("/bookings/:bookingId/refund", requestRefund);
router.patch("/bookings/:bookingId/refund", decideRefund);
router.post("/networking", networkingOptIn);
router.get("/", getAllEvents);
router.get("/:id", getSingleEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);
router.post("/:id/register", registerForEvent);
router.post("/:id/checkout", createCheckout);
router.post("/:id/checkout/complete", completeCheckout);
router.post("/:id/checkout/verify", verifyCheckout);
router.post("/:id/check-in", checkIn);
router.get("/:id/dashboard", getDashboard);
router.post("/:id/wishlist", toggleWishlist);

export default router;