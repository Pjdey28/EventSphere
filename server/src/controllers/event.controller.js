import Event from "../models/event.model.js";

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