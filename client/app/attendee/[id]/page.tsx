"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { completeCheckout, createCheckout, getSingleEvent, saveNetworkingPreference, submitReview, toggleWishlist } from "@/lib/eventApi";
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
  agenda?: { time: string; title: string; speaker?: string }[];
  speakers?: { name: string; designation?: string }[];
  faqs?: { question: string; answer: string }[];
};

export default function EventDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [discountCode, setDiscountCode] = useState("");
  const [ticket, setTicket] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [networking, setNetworking] = useState(false);

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
      setIsWishlisted(JSON.parse(localStorage.getItem("eventsphere-wishlist") || "[]").includes(id));

      if (data.event?.ticketTypes?.length > 0) {
        setQuantities(Object.fromEntries(data.event.ticketTypes.map((item: TicketType) => [item.name, 0])));
      }
    } catch (error) {
      console.error("Failed to fetch single event:", error);
    } finally {
      setLoading(false);
    }
  };

  loadEvent();
}, [id]);

  const selectedTickets = event?.ticketTypes.filter((item) => (quantities[item.name] || 0) > 0).map((item) => ({ ticketName: item.name, quantity: quantities[item.name] })) || [];

  const handleRegister = async () => {
    try {
      if (!selectedTickets.length) throw new Error("Choose at least one ticket");
      setBusy(true);
      const order = await createCheckout(id, { tickets: selectedTickets, discountCode });
      const data = await completeCheckout(id, { tickets: order.tickets, totalAmount: order.totalAmount, paymentId: order.order.id, attendee: { name: "Demo attendee", email: "attendee@eventsphere.test" } });
      setTicket(data.booking);
      localStorage.setItem("eventsphere-last-ticket", JSON.stringify(data.booking));
    } catch (error: any) {
      alert(error.message || "Registration failed");
    } finally {
      setBusy(false);
    }
  };

  const handleWishlist = async () => {
    const next = !isWishlisted;
    const ids = JSON.parse(localStorage.getItem("eventsphere-wishlist") || "[]").filter((item: string) => item !== id);
    if (next) ids.push(id);
    localStorage.setItem("eventsphere-wishlist", JSON.stringify(ids));
    setIsWishlisted(next);
    try { await toggleWishlist(id, "", next); } catch { /* local demo wishlist remains available without auth */ }
  };

  const handleReview = async () => {
    if (!review.comment.trim()) return;
    await submitReview(id, review);
    setReview({ rating: 5, comment: "" });
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

            <div className="flex items-start justify-between gap-4"><h1 className="heading-font mt-2 bg-gradient-to-r from-white via-blue-100 to-blue-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent">{event.title}</h1><button type="button" onClick={handleWishlist} className="mt-3 rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300">{isWishlisted ? "Saved" : "Save event"}</button></div>

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

            {(event.agenda?.length || event.speakers?.length) ? <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div><h2 className="heading-font text-2xl font-semibold text-white">Agenda</h2><div className="mt-3 space-y-2">{event.agenda?.map((item) => <div key={`${item.time}-${item.title}`} className="border-l-2 border-blue-500/50 pl-3"><p className="text-xs text-blue-300">{item.time}</p><p className="text-sm text-white">{item.title}</p><p className="text-xs text-slate-500">{item.speaker}</p></div>)}</div></div>
              <div><h2 className="heading-font text-2xl font-semibold text-white">Speakers</h2><div className="mt-3 space-y-3">{event.speakers?.map((speaker) => <div key={speaker.name}><p className="text-sm font-medium text-white">{speaker.name}</p><p className="text-xs text-slate-500">{speaker.designation}</p></div>)}</div></div>
            </div> : null}

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

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-slate-800/60 bg-[#161e2e]/60 p-4"><h2 className="heading-font text-2xl font-semibold text-white">Venue map</h2><div className="mt-3 flex h-36 items-center justify-center rounded-lg bg-[radial-gradient(circle_at_30%_40%,#3b82f633,transparent_22%),linear-gradient(135deg,#182032,#101722)] text-sm text-slate-400">{event.mode === "online" ? "Online venue · link shared after booking" : `Map preview · ${event.venue || event.city}`}</div></div>
              <div className="rounded-xl border border-slate-800/60 bg-[#161e2e]/60 p-4"><h2 className="heading-font text-2xl font-semibold text-white">FAQs</h2><div className="mt-3 space-y-3">{event.faqs?.length ? event.faqs.map((faq) => <details key={faq.question} className="border-b border-slate-800 pb-2"><summary className="cursor-pointer text-sm text-white">{faq.question}</summary><p className="mt-2 text-sm text-slate-400">{faq.answer}</p></details>) : <p className="text-sm text-slate-500">The organiser has not added FAQs yet.</p>}</div></div>
            </div>

            <div className="mt-8 rounded-xl border border-slate-800/60 bg-[#161e2e]/60 p-4"><h2 className="heading-font text-2xl font-semibold text-white">Community</h2><div className="mt-3 flex flex-wrap items-center gap-3"><label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={networking} onChange={(e) => { setNetworking(e.target.checked); localStorage.setItem("eventsphere-networking", String(e.target.checked)); void saveNetworkingPreference({ userId: "", optIn: e.target.checked, linkedin: "" }).catch(() => undefined); }} /> Share my LinkedIn with attendees</label><span className="text-xs text-slate-500">You can change this anytime.</span></div><div className="mt-4 flex gap-2"><select value={review.rating} onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })} className="rounded-lg border border-slate-700 bg-[#182032] px-2 py-2 text-sm text-white"><option value="5">5 stars</option><option value="4">4 stars</option><option value="3">3 stars</option><option value="2">2 stars</option><option value="1">1 star</option></select><input value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} placeholder="Leave a review" className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-[#182032] px-3 py-2 text-sm text-white placeholder-slate-500" /><button type="button" onClick={handleReview} className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white">Review</button></div></div>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-[#161e2e]/80 p-5 shadow-lg shadow-blue-500/5">
            <h2 className="heading-font text-2xl font-semibold text-white">
              Register
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Select your ticket tier and quantity.
            </p>

            <div className="mt-6 space-y-4">
              <div className="space-y-3">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Tickets</label>
                {event.ticketTypes.map((item) => <div key={item.name} className="flex items-center justify-between rounded-xl border border-slate-700/70 bg-[#182032] px-3 py-3"><div><p className="text-sm font-medium text-white">{item.name}</p><p className="text-xs text-slate-500">₹{item.price} · {item.capacity - item.sold} left</p></div><input aria-label={`${item.name} quantity`} type="number" min="0" max={item.capacity - item.sold} value={quantities[item.name] || 0} onChange={(e) => setQuantities({ ...quantities, [item.name]: Math.max(0, Number(e.target.value)) })} className="w-16 rounded-lg border border-slate-700 bg-[#101722] px-2 py-2 text-center text-sm text-white" /></div>)}
              </div>

              <input value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} placeholder="Discount code (optional)" className="w-full rounded-xl border border-slate-700/70 bg-[#182032] px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none" />

              <button
                onClick={handleRegister}
                disabled={busy}
                className="heading-font w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 text-base font-medium tracking-wide text-white shadow-lg shadow-blue-600/20 transition-all hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99]"
              >
                {busy ? "Processing..." : "Pay securely / Register"}
              </button>

              <p className="text-center text-xs text-slate-500">Sandbox checkout is active. Razorpay is used automatically when server keys are configured.</p>
              {ticket ? <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center"><p className="font-semibold text-emerald-300">Ticket confirmed</p><img src={ticket.qrCode} alt="Ticket QR code" className="mx-auto mt-3 h-40 w-40 bg-white p-2" /><a href={ticket.qrCode} download="eventsphere-ticket.png" className="mt-3 inline-block text-xs text-emerald-200 underline">Download QR ticket</a></div> : null}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}