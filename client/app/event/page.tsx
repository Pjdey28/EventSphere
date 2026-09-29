"use client";

import { useState } from "react";
import { createEvent, generateEventDescription, suggestEventSchedule } from "@/lib/eventApi";
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
      earlyBirdPrice: 0,
      capacity: 0,
      sold: 0,
      earlyBirdDeadline: "",
    },
  ]);
  const [discountCodes, setDiscountCodes] = useState([{ code: "", percent: 0, amount: 0, expiresAt: "", usageLimit: 0 }]);
  const [agenda, setAgenda] = useState([{ time: "", title: "", speaker: "" }]);
  const [speakers, setSpeakers] = useState([{ name: "", designation: "", image: "" }]);
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);
  const [aiBullets, setAiBullets] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const [scheduleBusy, setScheduleBusy] = useState(false);

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
        field === "price" || field === "earlyBirdPrice" || field === "capacity" || field === "sold"
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
        earlyBirdPrice: 0,
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
        discountCodes: discountCodes.filter((item) => item.code),
        agenda: agenda.filter((item) => item.title),
        speakers: speakers.filter((item) => item.name),
        faqs: faqs.filter((item) => item.question),
      };

      const data = await createEvent(finalData);
      alert(data.message || "Event Created Successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to create event");
    }
  };

  const draftDescription = async () => {
    const bullets = aiBullets.split("\n").map((item) => item.trim()).filter(Boolean);
    if (!bullets.length) return;
    setAiBusy(true);
    try {
      const data = await generateEventDescription(bullets);
      setFormData((current) => ({ ...current, description: data.description }));
    } catch (error) {
      console.error(error);
    } finally {
      setAiBusy(false);
    }
  };

  const optimizeSchedule = async () => {
    setScheduleBusy(true);
    try {
      const data = await suggestEventSchedule(agenda);
      setAgenda(data.sessions || agenda);
    } catch (error) {
      console.error(error);
    } finally {
      setScheduleBusy(false);
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
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-300">AI description draft</p>
              <textarea value={aiBullets} onChange={(e) => setAiBullets(e.target.value)} placeholder="One bullet per line: hands-on React workshop\nMeet senior engineers" rows={2} className="mt-3 w-full rounded-lg border border-slate-700 bg-[#101722] px-3 py-2 text-sm text-white placeholder-slate-600" />
              <button type="button" onClick={draftDescription} disabled={aiBusy} className="mt-2 rounded-lg border border-blue-400/30 px-3 py-2 text-xs font-semibold text-blue-300">{aiBusy ? "Drafting..." : "Draft description"}</button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-3 rounded-xl border border-slate-800/60 bg-[#161e2e]/50 p-4">
            <h2 className="heading-font text-2xl font-semibold text-white">Discount codes</h2>
            {discountCodes.map((discount, index) => <div key={index} className="grid gap-2 sm:grid-cols-4"><input placeholder="Code" value={discount.code} onChange={(e) => setDiscountCodes(discountCodes.map((item, i) => i === index ? { ...item, code: e.target.value.toUpperCase() } : item))} className="rounded-lg border border-slate-700 bg-[#182032] px-3 py-2 text-sm text-white" /><input type="number" placeholder="Percent" value={discount.percent || ""} onChange={(e) => setDiscountCodes(discountCodes.map((item, i) => i === index ? { ...item, percent: Number(e.target.value) } : item))} className="rounded-lg border border-slate-700 bg-[#182032] px-3 py-2 text-sm text-white" /><input type="date" value={discount.expiresAt} onChange={(e) => setDiscountCodes(discountCodes.map((item, i) => i === index ? { ...item, expiresAt: e.target.value } : item))} className="rounded-lg border border-slate-700 bg-[#182032] px-3 py-2 text-sm text-white" /><input type="number" placeholder="Uses" value={discount.usageLimit || ""} onChange={(e) => setDiscountCodes(discountCodes.map((item, i) => i === index ? { ...item, usageLimit: Number(e.target.value) } : item))} className="rounded-lg border border-slate-700 bg-[#182032] px-3 py-2 text-sm text-white" /></div>)}
            <button type="button" onClick={() => setDiscountCodes([...discountCodes, { code: "", percent: 0, amount: 0, expiresAt: "", usageLimit: 0 }])} className="text-xs font-semibold text-blue-300">+ Add discount code</button>
          </motion.div>

          <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2"><div className="flex items-center justify-between"><h2 className="heading-font text-xl font-semibold text-white">Agenda</h2><button type="button" onClick={optimizeSchedule} disabled={scheduleBusy} className="text-xs font-semibold text-blue-300">{scheduleBusy ? "Optimizing..." : "Optimize schedule"}</button></div>{agenda.map((item, index) => <div key={index} className="space-y-2"><input placeholder="Session title" value={item.title} onChange={(e) => setAgenda(agenda.map((row, i) => i === index ? { ...row, title: e.target.value } : row))} className="w-full rounded-lg border border-slate-700 bg-[#182032] px-3 py-2 text-sm text-white" /><div className="grid grid-cols-2 gap-2"><input placeholder="Time" value={item.time} onChange={(e) => setAgenda(agenda.map((row, i) => i === index ? { ...row, time: e.target.value } : row))} className="w-full rounded-lg border border-slate-700 bg-[#182032] px-3 py-2 text-sm text-white" /><input placeholder="Speaker" value={item.speaker} onChange={(e) => setAgenda(agenda.map((row, i) => i === index ? { ...row, speaker: e.target.value } : row))} className="w-full rounded-lg border border-slate-700 bg-[#182032] px-3 py-2 text-sm text-white" /></div></div>)}<button type="button" onClick={() => setAgenda([...agenda, { time: "", title: "", speaker: "" }])} className="text-xs text-blue-300">+ Add session</button></div>
            <div className="space-y-2"><h2 className="heading-font text-xl font-semibold text-white">Speakers</h2>{speakers.map((item, index) => <div key={index} className="space-y-2"><input placeholder="Name" value={item.name} onChange={(e) => setSpeakers(speakers.map((row, i) => i === index ? { ...row, name: e.target.value } : row))} className="w-full rounded-lg border border-slate-700 bg-[#182032] px-3 py-2 text-sm text-white" /><input placeholder="Role / designation" value={item.designation} onChange={(e) => setSpeakers(speakers.map((row, i) => i === index ? { ...row, designation: e.target.value } : row))} className="w-full rounded-lg border border-slate-700 bg-[#182032] px-3 py-2 text-sm text-white" /></div>)}<button type="button" onClick={() => setSpeakers([...speakers, { name: "", designation: "", image: "" }])} className="text-xs text-blue-300">+ Add speaker</button></div>
            <div className="space-y-2"><h2 className="heading-font text-xl font-semibold text-white">FAQs</h2>{faqs.map((item, index) => <div key={index} className="space-y-2"><input placeholder="Question" value={item.question} onChange={(e) => setFaqs(faqs.map((row, i) => i === index ? { ...row, question: e.target.value } : row))} className="w-full rounded-lg border border-slate-700 bg-[#182032] px-3 py-2 text-sm text-white" /><textarea placeholder="Answer" value={item.answer} onChange={(e) => setFaqs(faqs.map((row, i) => i === index ? { ...row, answer: e.target.value } : row))} className="w-full rounded-lg border border-slate-700 bg-[#182032] px-3 py-2 text-sm text-white" /></div>)}<button type="button" onClick={() => setFaqs([...faqs, { question: "", answer: "" }])} className="text-xs text-blue-300">+ Add FAQ</button></div>
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

                    <input
                      type="number"
                      placeholder="Early bird price"
                      value={ticket.earlyBirdPrice || ""}
                      className="rounded-lg border border-slate-700/50 bg-[#1c263b] px-3 py-2.5 text-[15px] text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                      onChange={(e) =>
                        handleTicketChange(index, "earlyBirdPrice", e.target.value)
                      }
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