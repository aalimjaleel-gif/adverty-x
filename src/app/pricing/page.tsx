"use client";

import React, { useState } from "react";
import { Check, Plus, ArrowRight, ShieldCheck, HelpCircle, Video } from "lucide-react";

export default function PricingPage() {
  const [selectedBaseService, setSelectedBaseService] = useState<string>("web-design");
  const [includeVideoAddon, setIncludeVideoAddon] = useState<boolean>(false);
  const [videoAddonTier, setVideoAddonTier] = useState<number>(99);

  const baseServices = [
    {
      id: "web-design",
      name: "Frontend Website Design",
      basePrice: 499,
      duration: "7-10 Business Days",
      category: "Development",
      deliverables: ["Up to 5 Custom Pages", "Next.js / Tailwind CSS", "100% Mobile Responsive", "Fast Core Web Vitals", "Contact Form Integration"],
    },
    {
      id: "web-redesign",
      name: "Website Redesign & Audit",
      basePrice: 399,
      duration: "10-14 Business Days",
      category: "Design",
      deliverables: ["Full Visual & UX Overhaul", "Speed & Performance Acceleration", "Conversion Rate Optimization", "Mobile Responsiveness", "Content Migration"],
    },
    {
      id: "automation",
      name: "Workflow & Lead Automation",
      basePrice: 299,
      duration: "5-7 Business Days",
      category: "Technology",
      deliverables: ["Lead Capture Webhook", "WhatsApp / Email Notifications", "CRM Integration (HubSpot / Sheets)", "Error Monitoring", "Staff Handover Call"],
    },
    {
      id: "social-media",
      name: "Social Media Management",
      basePrice: 199,
      duration: "Monthly Retainer",
      category: "Marketing",
      deliverables: ["12 Custom Static Posts & Carousels", "Caption Copywriting & Research", "Multi-Platform Scheduling", "Engagement & Monthly Analytics", "Note: Video editing separate"],
    },
    {
      id: "paid-ads",
      name: "Paid Advertising Management",
      basePrice: 299,
      duration: "Monthly Retainer",
      category: "Growth",
      deliverables: ["Meta & TikTok Campaign Setup", "Audience Segmentation & Copy", "A/B Testing & Optimization", "ROAS & Performance Reporting", "Client ad spend billed directly"],
    },
  ];

  const currentService = baseServices.find((s) => s.id === selectedBaseService) || baseServices[0];
  const totalPrice = currentService.basePrice + (includeVideoAddon ? videoAddonTier : 0);

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/70 text-brand-700 text-xs font-semibold mb-3">
            <span>Transparent Pricing Matrix</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Agency Packages & Add-on Calculator
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
            Select your core service package, configure optional video editing add-ons, and calculate your exact transparent agency investment.
          </p>
        </div>

        {/* Interactive Calculator Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          
          {/* Step 1: Base Service Selection (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">1. Select Core Agency Package</h3>
              <p className="text-xs text-slate-500 mb-4">Choose the primary digital service you want Adverty X to execute.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {baseServices.map((service) => {
                  const isSelected = service.id === selectedBaseService;
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setSelectedBaseService(service.id)}
                      className={`p-5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? "border-brand-600 ring-2 ring-brand-600/20 bg-brand-50/30 shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          {service.category}
                        </span>
                        <span className="text-lg font-extrabold text-slate-900">
                          ${service.basePrice}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">{service.name}</h4>
                      <span className="text-[11px] text-slate-500 block mb-3">Timeline: {service.duration}</span>

                      <ul className="space-y-1">
                        {service.deliverables.slice(0, 3).map((d, i) => (
                          <li key={i} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-brand-600 flex-shrink-0" />
                            <span className="line-clamp-1">{d}</span>
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Separate Video Editing Add-on (CRITICAL REQUIREMENT) */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/70">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-brand-700 flex items-center justify-center flex-shrink-0">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>2. Optional Video Editing Add-On</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-brand-100 text-brand-700">
                        Separate Add-on
                      </span>
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                      Need high-retention vertical reels, shorts, or promotional edits? Add our professional video editing service to your order.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeVideoAddon}
                    onChange={(e) => setIncludeVideoAddon(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                </label>
              </div>

              {includeVideoAddon && (
                <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-200">
                  <button
                    type="button"
                    onClick={() => setVideoAddonTier(99)}
                    className={`p-3 rounded-xl border text-left text-xs ${
                      videoAddonTier === 99
                        ? "border-brand-600 bg-white ring-1 ring-brand-500 font-bold"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>4 Short-Form Videos</span>
                      <span className="font-extrabold text-slate-900">+$99</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal">Includes captions, music, 2 revision rounds</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVideoAddonTier(189)}
                    className={`p-3 rounded-xl border text-left text-xs ${
                      videoAddonTier === 189
                        ? "border-brand-600 bg-white ring-1 ring-brand-500 font-bold"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>8 Short-Form Videos</span>
                      <span className="font-extrabold text-slate-900">+$189</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal">Kinetic typography, fast 3-day turnaround</span>
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Step 3: Summary & Order Summary (4 Cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-white rounded-2xl border border-slate-200 p-6 shadow-card space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Selected Package Summary
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">{currentService.name}</span>
                  <span className="font-bold text-slate-900">${currentService.basePrice}</span>
                </div>

                {includeVideoAddon && (
                  <div className="flex justify-between items-center text-brand-600">
                    <span>Video Editing Add-On ({videoAddonTier === 99 ? "4 Videos" : "8 Videos"})</span>
                    <span className="font-bold">+${videoAddonTier}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">Total Investment</span>
                  <div className="text-right">
                    <span className="text-3xl font-extrabold text-slate-900">${totalPrice}</span>
                    <span className="text-slate-400 block text-[10px]">USD (Zero hidden fees)</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 text-[11px] text-slate-600 space-y-1">
                <div className="font-semibold text-slate-900">Included in this quote:</div>
                <div>• Scoped timeline: {currentService.duration}</div>
                <div>• Written agreement & defined deliverables</div>
                <div>• Direct access to project lead in Client Dashboard</div>
              </div>

              <a
                href={`/contact?service=${currentService.id}&videoAddon=${includeVideoAddon ? "yes" : "no"}&amount=${totalPrice}`}
                className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider text-center block transition-all shadow-sm"
              >
                Proceed With This Package
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
