"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function SiteHeader() {
  const [user, setUser] = useState<{ name?: string; role?: string } | null>(null);
  useEffect(() => { const stored = localStorage.getItem("eventsphere-user"); if (stored) setUser(JSON.parse(stored)); }, []);
  const logout = () => { localStorage.removeItem("eventsphere-token"); localStorage.removeItem("eventsphere-user"); window.location.href = "/"; };
  return <header className="border-b border-slate-800/80 bg-[#0b0f19]/95"><nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4"><Link href="/" className="heading-font text-xl font-semibold text-white">Event<span className="text-blue-400">Sphere</span></Link><div className="flex flex-wrap items-center gap-1 text-sm"><Link href="/attendee" className="rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white">Explore</Link><Link href="/event" className="rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white">Create event</Link><Link href="/attendee/dashboard" className="rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white">My tickets</Link><Link href="/dashboard" className="rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white">Organizer</Link>{user ? <button type="button" onClick={logout} className="rounded-lg border border-slate-700 px-3 py-2 text-slate-300 hover:border-blue-400">Sign out</button> : <Link href="/auth" className="rounded-lg bg-blue-600 px-3 py-2 font-semibold text-white hover:bg-blue-500">Sign in</Link>}</div></nav></header>;
}
