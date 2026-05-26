"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSingleEvent, registerForEvent } from "@/lib/eventApi";
import { motion } from "framer-motion";

type TicketType = {
  name: string;
  price: number;
  capacity: number;
  sold: number;
  earlyBirdDeadline?: string;
};

type EventType = {
  _id: string;
  title: string;
  description: string;
  category: string;
  city: string;
  venue: string;
  mode: string;
  banner: string;
  startDate: string;
  endDate: string;
  ticketTypes: TicketType[];
};

export default function EventDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
  const loadEvent = async () => {
    try {
      if (!id) {
        console.log("No event ID found");
        return;
      }

      console.log("Fetching event with ID:", id);

      const data = await getSingleEvent(id);

      console.log("Fetched event:", data);

      setEvent(data.event);

      if (data.event?.ticketTypes?.length > 0) {
        setSelectedTicket(data.event.ticketTypes[0].name);
      }
    } catch (error) {
      console.error("Failed to fetch single event:", error);
    } finally {
      setLoading(false);
    }
  };

  loadEvent();
}, [id]);

  const selectedTicketData = event?.ticketTypes.find(
    (ticket) => ticket.name === selectedTicket
  );

  const totalAmount = selectedTicketData
    ? selectedTicketData.price * quantity
    : 0;

  const handleRegister = async () => {
    try {
      const data = await registerForEvent(id, {
        ticketName: selectedTicket,
        quantity,
      });

      alert(data.message || "Registered successfully");
      setEvent(data.event);
    } catch (error: any) {
      alert(error.message || "Registration failed");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0f19] text-slate-300">
        Loading event details...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0f19] text-slate-300">
        Event not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] px-4 py-12 text-slate-100 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-slate-800/60 bg-[#131926]/70 shadow-2xl shadow-black/40 backdrop-blur-xl"
      >
        <div className="h-64 w-full bg-[#182032]">
          {event.banner ? (
            <img
              src={event.banner}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-900/40 to-black">
              <span className="text-slate-500">No Banner Image</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 p-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <span className="tech-label text-blue-400">Event Details</span>

            <h1 className="heading-font mt-2 bg-gradient-to-r from-white via-blue-100 to-blue-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
              {event.title}
            </h1>

            <p className="mt-5 text-sm leading-7 text-slate-400">
              {event.description}
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-800/60 bg-[#161e2e]/60 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Category
                </p>
                <p className="mt-1 font-medium text-white">
                  {event.category || "General"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800/60 bg-[#161e2e]/60 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Mode
                </p>
                <p className="mt-1 font-medium text-white">
                  {event.mode || "Offline"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800/60 bg-[#161e2e]/60 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  City
                </p>
                <p className="mt-1 font-medium text-white">
                  {event.city || "Not specified"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800/60 bg-[#161e2e]/60 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Venue
                </p>
                <p className="mt-1 font-medium text-white">
                  {event.venue || "Not specified"}
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-slate-800/60 bg-[#161e2e]/60 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Schedule
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Starts:{" "}
                {event.startDate
                  ? new Date(event.startDate).toLocaleString()
                  : "Not specified"}
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Ends:{" "}
                {event.endDate
                  ? new Date(event.endDate).toLocaleString()
                  : "Not specified"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-[#161e2e]/80 p-5 shadow-lg shadow-blue-500/5">
            <h2 className="heading-font text-2xl font-semibold text-white">
              Register
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Select your ticket tier and quantity.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Ticket Type
                </label>

                <select
                  value={selectedTicket}
                  onChange={(e) => setSelectedTicket(e.target.value)}
                  className="w-full rounded-xl border border-slate-700/70 bg-[#182032] px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none"
                >
                  {event.ticketTypes.map((ticket) => (
                    <option key={ticket.name} value={ticket.name}>
                      {ticket.name} — ₹{ticket.price}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Quantity
                </label>

                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-700/70 bg-[#182032] px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              {selectedTicketData && (
                <div className="rounded-xl border border-slate-800/60 bg-black/20 p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Available</span>
                    <span className="text-white">
                      {selectedTicketData.capacity - selectedTicketData.sold}
                    </span>
                  </div>

                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-slate-400">Price</span>
                    <span className="text-white">
                      ₹{selectedTicketData.price}
                    </span>
                  </div>

                  <div className="mt-2 flex justify-between text-base font-semibold">
                    <span className="text-slate-300">Total</span>
                    <span className="text-blue-400">₹{totalAmount}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleRegister}
                className="heading-font w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 text-base font-medium tracking-wide text-white shadow-lg shadow-blue-600/20 transition-all hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99]"
              >
                Register for Event
              </button>

              <p className="text-center text-xs text-slate-500">
                Payment and QR ticket generation can be connected later.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}