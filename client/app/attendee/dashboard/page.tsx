"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllEvents } from "@/lib/eventApi";

type EventItem = { _id: string; title: string; startDate: string; city: string; banner?: string };

export default function AttendeeDashboardPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [reminders, setReminders] = useState<string[]>([]);
  const [ticket, setTicket] = useState<any>(null);

  useEffect(() => {
    setSavedIds(JSON.parse(localStorage.getItem("eventsphere-wishlist") || "[]"));
    setReminders(JSON.parse(localStorage.getItem("eventsphere-reminders") || "[]"));
    setTicket(JSON.parse(localStorage.getItem("eventsphere-last-ticket") || "null"));
    getAllEvents().then((data) => setEvents(data.events || [])).catch(() => undefined);
  }, []);

  const toggleReminder = (id: string) => {
    const next = reminders.includes(id) ? reminders.filter((item) => item !== id) : [...reminders, id];
    setReminders(next);
    localStorage.setItem("eventsphere-reminders", JSON.stringify(next));
  };

  const savedEvents = events.filter((event) => savedIds.includes(event._id));
  return <main className="min-h-screen bg-[#0b0f19] px-4 py-10 text-slate-100 sm:px-8"><div className="mx-auto max-w-5xl"><Link href="/attendee" className="text-sm text-blue-300">← Explore events</Link><div className="mt-8"><span className="tech-label text-blue-400">Attendee workspace</span><h1 className="heading-font mt-2 text-5xl font-bold text-white">Your event shelf</h1><p className="mt-2 text-sm text-slate-400">Saved events, reminders, and your latest ticket in one place.</p></div>{ticket ? <section className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs uppercase tracking-wider text-emerald-300">Latest ticket</p><p className="mt-1 text-lg font-semibold text-white">{ticket.attendeeName || "Demo attendee"}</p><p className="text-sm text-slate-400">Booking {ticket._id}</p></div>{ticket.qrCode ? <img src={ticket.qrCode} alt="Ticket QR code" className="h-28 w-28 bg-white p-2" /> : null}</div></section> : null}<section className="mt-8"><div className="flex items-center justify-between"><h2 className="heading-font text-2xl font-semibold text-white">Wishlist and reminders</h2><span className="text-sm text-slate-500">{savedEvents.length} saved</span></div>{savedEvents.length ? <div className="mt-4 grid gap-4 md:grid-cols-2">{savedEvents.map((event) => <article key={event._id} className="rounded-2xl border border-slate-800 bg-[#131926] p-5"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold text-white">{event.title}</h3><p className="mt-1 text-sm text-slate-400">{event.city} · {new Date(event.startDate).toLocaleString()}</p></div><button type="button" onClick={() => toggleReminder(event._id)} className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300">{reminders.includes(event._id) ? "Reminder on" : "Remind me"}</button></div><Link href={`/attendee/${event._id}`} className="mt-4 inline-block text-xs text-blue-300">View event →</Link></article>)}</div> : <div className="mt-4 rounded-2xl border border-dashed border-slate-800 p-8 text-center text-sm text-slate-500">Save an event from its detail page to see it here.</div>}</section></div></main>;
}
