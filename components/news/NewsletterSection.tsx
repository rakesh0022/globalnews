"use client";

import { useState } from "react";
import RippleButton from "@/components/ui/RippleButton";

export default function NewsletterSection() {
  const [email,     setEmail]     = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  }

  return (
    <section className="relative rounded-3xl overflow-hidden noise">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-violet-950" />
      {/* Glow orbs */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-violet-500/15 blur-3xl pointer-events-none" />
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

      <div className="relative z-10 px-6 sm:px-12 py-12 sm:py-16 flex flex-col lg:flex-row items-center gap-10">

        {/* Left copy */}
        <div className="flex-1 text-center lg:text-left space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/70 text-xs font-semibold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Free Newsletter
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight text-balance">
            The world&apos;s most important<br className="hidden sm:block" />
            <span className="gradient-text"> stories, daily.</span>
          </h2>
          <p className="text-base text-slate-300 leading-relaxed max-w-md mx-auto lg:mx-0">
            Join 250,000+ readers who get the most important news and analysis delivered to their inbox every morning.
          </p>

          {/* Social proof */}
          <div className="flex items-center gap-3 justify-center lg:justify-start">
            <div className="flex -space-x-2">
              {["photo-1494790108377-be9c29b29330", "photo-1507003211169-0a1dd7228f2d", "photo-1438761681033-6461ffad8d80", "photo-1500648767791-00dcc994a43e"].map((id) => (
                <div key={id} className="w-7 h-7 rounded-full border-2 border-slate-900 overflow-hidden bg-slate-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://images.unsplash.com/${id}?w=56&q=80`} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400">
              <span className="text-white font-semibold">250k+</span> subscribers
            </p>
          </div>
        </div>

        {/* Right form */}
        <div className="w-full lg:w-auto lg:min-w-[380px]">
          {submitted ? (
            <div className="flex flex-col items-center gap-3 p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-bold text-white text-lg">You&apos;re in!</p>
              <p className="text-sm text-slate-300">Check your inbox for a confirmation email.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 backdrop-blur-sm">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Your email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400
                    bg-white/95 outline-none focus:ring-2 focus:ring-blue-400/50 transition-shadow"
                />
              </div>

              <RippleButton
                type="submit"
                variant="primary"
                className="w-full rounded-xl py-3 text-sm font-bold bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-400 hover:to-violet-500 shadow-lg shadow-blue-500/25 border-0"
                rippleColor="rgba(255,255,255,0.3)"
              >
                Subscribe — it&apos;s free
              </RippleButton>

              <p className="text-[11px] text-slate-500 text-center">
                No spam. Unsubscribe anytime. We respect your privacy.
              </p>

              {/* Perks */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {[
                  ["📰", "Daily briefing"],
                  ["⚡", "Breaking alerts"],
                  ["🎯", "Personalised"],
                  ["🔒", "No spam ever"],
                ].map(([icon, label]) => (
                  <div key={label} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <span>{icon}</span>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
