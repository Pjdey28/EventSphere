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
  checkIn,
  getDashboard,
  toggleWishlist,
} from "../controllers/event.controller.js";

const router = express.Router();

router.post("/", createEvent);
router.get("/", getAllEvents);
router.get("/:id", getSingleEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);
router.post("/:id/register", registerForEvent);
router.post("/:id/checkout", createCheckout);
router.post("/:id/checkout/complete", completeCheckout);
router.post("/:id/check-in", checkIn);
router.get("/:id/dashboard", getDashboard);
router.post("/:id/wishlist", toggleWishlist);

export default router;