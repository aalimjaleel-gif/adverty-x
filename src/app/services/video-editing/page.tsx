"use client";

import React, { useState } from "react";
import { Video, Check, ArrowRight, Sparkles, Clock, AlertCircle, Film, Scissors, Music } from "lucide-react";

export default function VideoEditingPage() {
  const [editingType, setEditingType] = useState<"standalone" | "addon">("addon");

  const addonTiers = [
    {
      name: "4 Short-Form Videos Add-On",
      price: 99,
      turnaround: "2-3 Business Days",
      bestFor: "Ideal for pairing with the Starter Social Media Package.",
      features: [
        "4 Edited Reels, TikToks, or YouTube Shorts",
        "Engaging animated captions & subtitles",
        "B-roll insertion & royalty-free background music",
        "Color correction & audio leveling",
        "Up to 2 revision rounds per video",
        "Delivered in 9:16 vertical MP4 format",
      ],
    },
    {
      name: "8 Short-Form Videos Add-On",
      price: 189,
      popular: true,
      turnaround: "3-4 Business Days",
      bestFor: "Ideal for the Omnichannel Pro Social Media Package.",
      features: [
        "8 Edited Reels, TikToks, or YouTube Shorts",
        "Custom kinetic typography & sound effects",
        "Hook optimization (first 3 seconds)",
        "Trendy transitions & viral pacing",
        "Up to 2 revision rounds per video",
        "Direct export & cloud deliverable link",
      ],
    },
    {
      name: "16 Short-Form Videos Add-On",
      price: 349,
      turnaround: "4-5 Business Days",
      bestFor: "High-volume creators and fast-growing personal brands.",
      features: [
        "16 Edited short-form videos per month",
        "Dedicated video editor assigned to your brand",
        "Fast-track 48-hour turnarounds",
        "Custom branding graphics, watermarks & lower thirds",
        "Up to 2 revision rounds per video",
        "Monthly asset drive organization",
      ],
    },
  ];

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 mb-3">
            <a href="/services" className="hover:underline">Services</a>
            <span>/</span>
            <span className="text-slate-500">Video Editing</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>⏳ Coming Soon • Pre-Booking & Retainers Open</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Professional Video Editing
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
            High-retention short-form video editing for Reels, TikToks, YouTube Shorts, and promotional video ads. Available as an optional paid add-on or independent production retainer.
          </p>
        </div>

        {/* Clear Policy Notice Banner */}
        <div className="mb-12 p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-brand-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            <strong className="text-slate-900 font-semibold block mb-0.5">Transparent Scope & Client Raw Footage Policy:</strong>
            Clients supply raw recorded footage or talking-head clips. Our editors craft dynamic pacing, kinetic captions, sound design, and color grading. Each video includes up to <strong>2 rounds of revisions</strong>. Video editing is strictly billed as a separate add-on or standalone package.
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {addonTiers.map((tier, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-7 border flex flex-col justify-between transition-all ${
                tier.popular
                  ? "border-brand-600 ring-2 ring-brand-600/20 bg-white shadow-card"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div>
                {tier.popular && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-700 mb-3 inline-block">
                    Recommended Add-on
                  </span>
                )}
                <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">{tier.bestFor}</p>

                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-extrabold text-slate-900">${tier.price}</span>
                  <span className="text-xs text-slate-400"> /batch</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-brand-600 font-semibold mb-6">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Turnaround: {tier.turnaround}</span>
                </div>

                <ul className="space-y-2.5 mb-8">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-700">
                      <Check className="w-4 h-4 text-brand-600 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={`https://wa.me/255613735391?text=Assalam%20o%20Alaikum!%20I%20want%20to%20pre-book%20the%20Video%20Editing%20package%20(${encodeURIComponent(tier.name)}).`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl text-xs font-black text-center block transition-all bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 shadow-sm"
              >
                Coming Soon • Pre-Book on WhatsApp
              </a>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
