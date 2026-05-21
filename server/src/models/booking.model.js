import mongoose from "mongoose";

const purchasedTicketSchema = new mongoose.Schema({
  ticketType: String,

  quantity: Number,

  price: Number
});

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event"
    },

    tickets: [purchasedTicketSchema],

    totalAmount: Number,

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending"
    },

    qrCode: String,

    checkedIn: {
      type: Boolean,
      default: false
    },

    refundStatus: {
      type: String,
      enum: ["none", "requested", "approved", "rejected"],
      default: "none"
    }
  },
  {
    timestamps: true
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;