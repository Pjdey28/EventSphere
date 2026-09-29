import express from "express";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.middleware.js";

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
  getReviews,
  createFeedback,
  requestRefund,
  decideRefund,
  networkingOptIn,
  getNetworkingAttendees,
  getRecommendations,
} from "../controllers/event.controller.js";

const router = express.Router();

router.post("/", isAuthenticated, authorizeRoles("organiser", "admin"), createEvent);
router.post("/ai/description", generateDescription);
router.post("/ai/schedule", suggestSchedule);
router.post("/recommendations", getRecommendations);
router.post("/:id/review", createReview);
router.get("/:id/reviews", getReviews);
router.post("/:id/feedback", createFeedback);
router.post("/bookings/:bookingId/refund", isAuthenticated, requestRefund);
router.patch("/bookings/:bookingId/refund", isAuthenticated, authorizeRoles("organiser", "admin"), decideRefund);
router.post("/:id/networking", isAuthenticated, networkingOptIn);
router.get("/:id/networking", getNetworkingAttendees);
router.get("/", getAllEvents);
router.get("/:id", getSingleEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);
router.post("/:id/register", registerForEvent);
router.post("/:id/checkout", createCheckout);
router.post("/:id/checkout/complete", completeCheckout);
router.post("/:id/checkout/verify", verifyCheckout);
router.post("/:id/check-in", isAuthenticated, authorizeRoles("organiser", "admin"), checkIn);
router.get("/:id/dashboard", isAuthenticated, authorizeRoles("organiser", "admin"), getDashboard);
router.post("/:id/wishlist", toggleWishlist);

export default router;