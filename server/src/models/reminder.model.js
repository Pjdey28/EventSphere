import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  email: { type: String, required: true },
  remindAt: { type: Date, required: true },
  sent: { type: Boolean, default: false },
}, { timestamps: true });

const Reminder = mongoose.model("Reminder", reminderSchema);
export default Reminder;
