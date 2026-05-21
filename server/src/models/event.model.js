import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  name: String,

  price: {
    type: Number,
    default: 0
  },

  capacity: Number,

  sold: {
    type: Number,
    default: 0
  },

  earlyBirdDeadline: Date
});

const speakerSchema = new mongoose.Schema({
  name: String,
  designation: String,
  image: String
});

const faqSchema = new mongoose.Schema({
  question: String,
  answer: String
});

const agendaSchema = new mongoose.Schema({
  time: String,
  title: String,
  speaker: String
});

const eventSchema = new mongoose.Schema(
  {
    organiser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    category: String,

    city: String,

    venue: String,

    mode: {
      type: String,
      enum: ["online", "offline"]
    },

    banner: String,

    startDate: Date,

    endDate: Date,

    ticketTypes: [ticketSchema],

    agenda: [agendaSchema],

    speakers: [speakerSchema],

    faqs: [faqSchema],

    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    totalRevenue: {
      type: Number,
      default: 0
    },

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
      }
    ]
  },
  {
    timestamps: true
  }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;