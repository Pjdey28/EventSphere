import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["attendee", "organiser", "admin"],
      default: "attendee"
    },

    avatar: {
      type: String
    },

    bio: {
      type: String
    },

    linkedin: {
      type: String
    },

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
      }
    ],

    attendedEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
      }
    ]
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

export default User;