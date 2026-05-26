"use client";

import { useState } from "react";
import { createEvent } from "@/lib/eventApi";
import { motion, AnimatePresence, type Variants } from "framer-motion";

export default function CreateEventPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    city: "",
    venue: "",
    mode: "offline",
    banner: "",
    startDate: "",
    endDate: "",
  });

  const [ticketTypes, setTicketTypes] = useState([
    {
      name: "",
      price: 0,
      capacity: 0,
      sold: 0,
      earlyBirdDeadline: "",
    },
  ]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTicketChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...ticketTypes];

    updated[index] = {
      ...updated[index],
      [field]:
        field === "price" || field === "capacity" || field === "sold"
          ? Number(value)
          : value,
    };

    setTicketTypes(updated);
  };

  const addTicketType = () => {
    setTicketTypes([
      ...ticketTypes,
      {
        name: "",
        price: 0,
        capacity: 0,
        sold: 0,
        earlyBirdDeadline: "",
      },
    ]);
  };

  const removeTicketType = (index: number) => {
    if (ticketTypes.length > 1) {
      setTicketTypes(ticketTypes.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const finalData = {
        ...formData,
        ticketTypes,
      };

      const data = await createEvent(finalData);
      alert(data.message || "Event Created Successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to create event");
    }
  };

  const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 15,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

  return (
    <div className="min-h-screen bg-[#0b0f19] px-4 py-12 font-sans text-slate-100 antialiased selection:bg-blue-500/30 selection:text-blue-200 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-3xl rounded-2xl border border-slate-800/60 bg-[#131926]/60 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl"
      >
        <motion.div variants={itemVariants} className="mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-400">
            Organizer Panel
          </span>

          <h1 className="heading-font mt-2 bg-gradient-to-r from-white via-blue-100 to-blue-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
            Event Creation
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Configure event details, venue, schedule and ticketing structure.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div variants={itemVariants} className="space-y-4">
            <input
              name="title"
              value={formData.title}
              placeholder="Event Title"
              className="w-full rounded-xl border border-slate-700/70 bg-[#182032] px-4 py-3.5 text-[15px] font-normal tracking-[0.01em] text-white placeholder-slate-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              onChange={handleChange}
              required
            />

            <textarea
              name="description"
              value={formData.description}
              placeholder="Event Description..."
              rows={4}
              className="w-full resize-none rounded-xl border border-slate-700/70 bg-[#182032] px-4 py-3.5 text-[15px] font-normal tracking-[0.01em] text-white placeholder-slate-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              onChange={handleChange}
              required
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <select
              name="category"
              value={formData.category}
              className="w-full rounded-xl border border-slate-700/70 bg-[#182032] px-4 py-3.5 text-[15px] font-normal tracking-[0.01em] text-slate-300 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option value="Technology">Technology</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Workshop">Workshop</option>
              <option value="Business">Business</option>
              <option value="Education">Education</option>
              <option value="Cultural">Cultural</option>
              <option value="Music">Music</option>
              <option value="Sports">Sports</option>
              <option value="Gaming">Gaming</option>
              <option value="Networking">Networking</option>
            </select>

            <select
              name="city"
              value={formData.city}
              className="w-full rounded-xl border border-slate-700/70 bg-[#182032] px-4 py-3.5 text-[15px] font-normal tracking-[0.01em] text-slate-300 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              onChange={handleChange}
            >
              <option value="">Select City</option>
              <option value="Delhi">Delhi</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Chennai">Chennai</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Pune">Pune</option>
              <option value="Bhubaneswar">Bhubaneswar</option>
              <option value="Rourkela">Rourkela</option>
              <option value="Jaipur">Jaipur</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Online">Online</option>
            </select>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            <div className="md:col-span-2">
              <input
                name="venue"
                value={formData.venue}
                placeholder="Venue / Meeting Link"
                className="w-full rounded-xl border border-slate-700/70 bg-[#182032] px-4 py-3.5 text-[15px] font-normal tracking-[0.01em] text-white placeholder-slate-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                onChange={handleChange}
              />
            </div>

            <select
              name="mode"
              value={formData.mode}
              className="w-full rounded-xl border border-slate-700/70 bg-[#182032] px-4 py-3.5 text-[15px] font-normal tracking-[0.01em] text-white transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              onChange={handleChange}
            >
              <option value="offline">Offline</option>
              <option value="online">Online</option>
            </select>
          </motion.div>

          <motion.div variants={itemVariants}>
            <input
              name="banner"
              value={formData.banner}
              placeholder="Banner Image URL"
              className="w-full rounded-xl border border-slate-700/70 bg-[#182032] px-4 py-3.5 text-[15px] font-normal tracking-[0.01em] text-white placeholder-slate-500 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              onChange={handleChange}
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 gap-4 rounded-xl border border-slate-800/40 bg-[#161e2e]/40 p-4 md:grid-cols-2"
          >
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Start Date
              </label>

              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                className="w-full rounded-lg border border-slate-700/50 bg-[#121824] px-3 py-2 text-sm text-slate-300 transition-all focus:border-blue-500 focus:outline-none"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                End Date
              </label>

              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                className="w-full rounded-lg border border-slate-700/50 bg-[#121824] px-3 py-2 text-sm text-slate-300 transition-all focus:border-blue-500 focus:outline-none"
                onChange={handleChange}
              />
            </div>
          </motion.div>

          <hr className="my-2 border-slate-800/80" />

          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="heading-font text-2xl font-semibold tracking-tight text-white">
                Ticket Tiers
              </h2>

              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-400">
                {ticketTypes.length}{" "}
                {ticketTypes.length > 1 ? "Tiers" : "Tier"}
              </span>
            </div>

            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {ticketTypes.map((ticket, index) => (
                  <motion.div
                    key={index}
                    initial={{
                      opacity: 0,
                      scale: 0.95,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.95,
                      y: -10,
                    }}
                    transition={{
                      duration: 0.25,
                    }}
                    className="group relative grid grid-cols-1 gap-3 rounded-xl border border-slate-800/60 bg-[#161e2e]/80 p-4 sm:grid-cols-4"
                  >
                    <input
                      placeholder="Tier Name"
                      value={ticket.name}
                      className="rounded-lg border border-slate-700/50 bg-[#1c263b] px-3 py-2.5 text-[15px] font-normal tracking-[0.01em] text-white transition-all placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                      onChange={(e) =>
                        handleTicketChange(index, "name", e.target.value)
                      }
                      required
                    />

                    <input
                      type="number"
                      placeholder="Price (INR)"
                      value={ticket.price || ""}
                      className="rounded-lg border border-slate-700/50 bg-[#1c263b] px-3 py-2.5 text-[15px] font-normal tracking-[0.01em] text-white transition-all placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                      onChange={(e) =>
                        handleTicketChange(index, "price", e.target.value)
                      }
                      required
                    />

                    <input
                      type="number"
                      placeholder="Capacity"
                      value={ticket.capacity || ""}
                      className="rounded-lg border border-slate-700/50 bg-[#1c263b] px-3 py-2.5 text-[15px] font-normal tracking-[0.01em] text-white transition-all placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                      onChange={(e) =>
                        handleTicketChange(index, "capacity", e.target.value)
                      }
                      required
                    />

                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={ticket.earlyBirdDeadline}
                        className="w-full rounded-lg border border-slate-700/50 bg-[#1c263b] px-2 py-2.5 text-xs text-slate-300 transition-all focus:border-blue-500 focus:outline-none"
                        onChange={(e) =>
                          handleTicketChange(
                            index,
                            "earlyBirdDeadline",
                            e.target.value
                          )
                        }
                      />

                      {ticketTypes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTicketType(index)}
                          className="rounded-lg p-2.5 text-slate-500 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
                          title="Remove tier"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <button
              type="button"
              className="inline-flex items-center rounded-lg border border-blue-500/20 bg-blue-500/5 px-4 py-2.5 text-xs font-semibold text-blue-400 transition-all hover:bg-blue-500/10 hover:text-blue-300"
              onClick={addTicketType}
            >
              + Add Custom Ticket Tier
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-4">
            <button
              type="submit"
              className="heading-font w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 text-base font-medium tracking-wide text-white shadow-lg shadow-blue-600/20 transition-all hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99]"
            >
              Publish Event Configuration
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}