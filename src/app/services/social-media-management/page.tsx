"use client";

import React from "react";
import { Share2, Check, AlertCircle, ArrowRight, Video, Calendar, BarChart2, ShieldCheck } from "lucide-react";

export default function SocialMediaManagementPage() {
  const packages = [
    {
      name: "Starter Growth",
      price: 199,
      platforms: "Facebook & Instagram",
      posts: "12 Custom Static Graphics & Carousels / Month",
      deliverables: [
        "Monthly content calendar & strategy",
        "12 Branded graphics & carousel slides",
        "High-converting caption copywriting",
        "Targeted hashtag & SEO research",
        "Scheduled publishing via Meta Business Suite",
        "End-of-month engagement report",
      ],
    },
    {
      name: "Omnichannel Pro",
      price: 349,
      popular: true,
      platforms: "Facebook, Instagram, TikTok & LinkedIn",
      posts: "20 Custom Posts & Content Pieces / Month",
      deliverables: [
        "Comprehensive cross-platform strategy",
        "20 Branded feed posts & carousels",
        "Community comment & DM triage support",
        "Story post design & engagement polls",
        "Bi-weekly performance review calls",
        "Dedicated social media strategist",
      ],
    },
  ];

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 mb-3">
            <a href="/services" className="hover:underline">Services</a>
            <span>/</span>
            <span className="text-slate-500">Social Media Management</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs font-bold mb-4">
            <span>⏳ Coming Soon • Pre-Booking & Retainers Open</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Social Media Account Management
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
            Build authority, grow an engaged following, and establish consistent brand presence across Facebook, Instagram, TikTok, and LinkedIn.
          </p>
        </div>

        {/* =========================================================================
            PROMINENT VIDEO EDITING POLICY BANNER (MANDATORY REQUIREMENT)
        ========================================================================= */}
        <div className="mb-12 p-6 rounded-2xl bg-amber-50/80 border-2 border-amber-300 text-slate-900 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-amber-950 flex items-center gap-2">
                  <span>Official Policy: Video Editing Is NOT Included by Default</span>
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-amber-300 text-amber-950">
                    Important
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed mt-1">
                  Standard social media packages include graphic post design, copy, scheduling, and management. <strong>Clients are responsible for supplying their own finished videos or hiring video editing separately.</strong> We offer a standalone or add-on <strong>Video Editing Add-On</strong> starting at $99.
                </p>
              </div>
            </div>

            <a
              href="/services/video-editing"
              className="px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold whitespace-nowrap flex items-center gap-1.5 shadow-xs"
            >
              <span>View Video Editing Add-On</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {packages.map((pkg, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-8 border flex flex-col justify-between ${
                pkg.popular
                  ? "border-brand-600 ring-2 ring-brand-600/20 bg-white shadow-card"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div>
                {pkg.popular && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-700 mb-3 inline-block">
                    Most Popular
                  </span>
                )}
                <h3 className="text-2xl font-bold text-slate-900">{pkg.name}</h3>
                <div className="text-xs text-brand-600 font-semibold mt-1 mb-4">
                  Platforms: {pkg.platforms}
                </div>

                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-extrabold text-slate-900">${pkg.price}</span>
                  <span className="text-xs text-slate-400"> /month</span>
                </div>
                <div className="text-xs text-slate-500 mb-6 font-medium">
                  Includes: {pkg.posts}
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.deliverables.map((d, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-xs text-slate-700">
                      <Check className="w-4 h-4 text-brand-600 flex-shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                  <li className="flex items-center gap-2.5 text-xs text-slate-400 italic pt-2 border-t border-slate-100">
                    <span>* Video editing add-on can be bundled at checkout.</span>
                  </li>
                </ul>
              </div>

              <a
                href={`https://wa.me/255613735391?text=Assalam%20o%20Alaikum!%20I%20want%20to%20pre-book%20the%20Social%20Media%20Management%20plan%20(${encodeURIComponent(pkg.name)}).`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-black text-xs text-center block transition-all shadow-sm"
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
