"use client";

import { useState } from "react";

export default function NewsletterWidget() {
  const [email,     setEmail]     = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  }

  return (
    <div className="relative rounded-2xl overflow-hidden noise">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-violet-950 dark:from-slate-950 dark:via-blue-950 dark:to-violet-950" />
      {/* Glow orbs */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-blue-500/20 blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-violet-500/20 blur-2xl" />

      <div className="relative z-10 p-5 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">📬</span>
            <h3 className="font-bold text-base text-white">Morning Briefing</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Top stories delivered to your inbox every morning. No spam, ever.
          </p>
        </div>

        {submitted ? (
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            You&apos;re subscribed!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2.5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 bg-white/95 outline-none focus:ring-2 focus:ring-blue-400/50 transition-shadow"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 text-white font-semibold text-sm py-2.5 hover:from-blue-400 hover:to-violet-500 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/25"
            >
              Subscribe free
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
