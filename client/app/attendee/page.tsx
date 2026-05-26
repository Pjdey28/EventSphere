"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllEvents } from "@/lib/eventApi";
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

export default function EventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getAllEvents();
        setEvents(data.events || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const getLowestPrice = (tickets: TicketType[]) => {
    if (!tickets || tickets.length === 0) return "Free";

    const prices = tickets.map((ticket) => ticket.price);
    const minPrice = Math.min(...prices);

    return minPrice === 0 ? "Free" : `₹${minPrice}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b0f19] text-slate-300">
        Loading events...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] px-4 py-12 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <span className="tech-label text-blue-400">Attendee Panel</span>

          <h1 className="heading-font mt-2 bg-gradient-to-r from-white via-blue-100 to-blue-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
            Explore Events
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
            Browse upcoming events, view details, and register for your preferred
            ticket tier.
          </p>
        </motion.div>

        {events.length === 0 ? (
          <div className="rounded-2xl border border-slate-800/60 bg-[#131926]/60 p-10 text-center">
            <h2 className="text-xl font-semibold text-white">No events found</h2>
            <p className="mt-2 text-sm text-slate-400">
              Events created by organisers will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="group overflow-hidden rounded-2xl border border-slate-800/70 bg-[#131926]/70 shadow-xl shadow-black/30 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-blue-500/10"
              >
                <div className="h-40 w-full overflow-hidden bg-[#182032]">
                  {event.banner ? (
                    <img
                      src={event.banner}
                      alt={event.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-900/40 to-black">
                      <span className="text-sm text-slate-500">No Banner</span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                      {event.category || "General"}
                    </span>

                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                      {event.mode || "offline"}
                    </span>
                  </div>

                  <h2 className="heading-font line-clamp-1 text-2xl font-semibold text-white">
                    {event.title}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-400">
                    {event.description}
                  </p>

                  <div className="mt-5 space-y-2 text-sm text-slate-300">
                    <p>
                      <span className="text-slate-500">City:</span>{" "}
                      {event.city || "Not specified"}
                    </p>

                    <p>
                      <span className="text-slate-500">Starts:</span>{" "}
                      {event.startDate
                        ? new Date(event.startDate).toLocaleString()
                        : "Not specified"}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500">Starting from</p>
                      <p className="text-lg font-semibold text-white">
                        {getLowestPrice(event.ticketTypes)}
                      </p>
                    </div>

                    <Link
                      href={`/attendee/${event._id}`}
                      className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-500 active:scale-95"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}