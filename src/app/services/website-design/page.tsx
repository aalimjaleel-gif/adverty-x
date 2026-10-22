"use client";

import React, { useState } from "react";
import { Monitor, Check, ArrowRight, ShieldCheck, Zap, Layers, Smartphone } from "lucide-react";

export default function WebsiteDesignPage() {
  const [selectedTier, setSelectedTier] = useState<"starter" | "growth" | "enterprise">("growth");

  const tiers = [
    {
      id: "starter",
      name: "Starter Landing Page",
      price: 299,
      duration: "5-7 Business Days",
      desc: "Ideal for early-stage startups and product launches needing high conversions.",
      deliverables: [
        "1 High-converting responsive landing page",
        "Mobile-first responsive design",
        "Fast Next.js / Tailwind CSS architecture",
        "Contact & lead capture form integration",
        "On-page basic SEO meta tags",
        "1 round of revisions",
      ],
    },
    {
      id: "growth",
      name: "Business Website",
      price: 499,
      duration: "7-10 Business Days",
      popular: true,
      desc: "Complete 5-page custom business website designed to elevate brand authority.",
      deliverables: [
        "Up to 5 custom designed pages (Home, About, Services, Portfolio, Contact)",
        "Interactive UI components & subtle animations",
        "Mobile, tablet & desktop optimization",
        "Next.js App Router for optimal SEO & speed",
        "Custom domain setup assistance",
        "2 rounds of revisions",
      ],
    },
    {
      id: "enterprise",
      name: "Custom Web Application",
      price: 899,
      duration: "14-20 Business Days",
      desc: "Advanced frontend implementation for SaaS platforms and complex products.",
      deliverables: [
        "Up to 10 custom pages / interactive dashboard views",
        "Design system & component library",
        "API & webhook integration readiness",
        "Performance optimization (95+ Google Lighthouse)",
        "Full accessibility & WCAG compliance",
        "3 rounds of revisions & post-launch support",
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
            <span className="text-slate-500">Website Design</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs font-bold mb-4">
            <span>⏳ Coming Soon • Pre-Booking & Custom Inquiries Open</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Frontend Website Design
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
            We design and build fast, modern, and high-converting websites tailored to your brand identity. Built strictly using modern web standards (Next.js, TypeScript, Tailwind CSS) for ultimate speed and SEO.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
            <Zap className="w-8 h-8 text-brand-600 mb-3" />
            <h4 className="font-bold text-slate-900 mb-1">Blazing Fast Speed</h4>
            <p className="text-xs text-slate-600 leading-relaxed">Built on Next.js App Router for instant page loads and high Google Core Web Vitals scores.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
            <Smartphone className="w-8 h-8 text-brand-600 mb-3" />
            <h4 className="font-bold text-slate-900 mb-1">100% Mobile Responsive</h4>
            <p className="text-xs text-slate-600 leading-relaxed">Pixel-perfect layouts across mobile phones, tablets, laptops, and ultra-wide desktop monitors.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
            <Layers className="w-8 h-8 text-brand-600 mb-3" />
            <h4 className="font-bold text-slate-900 mb-1">Conversion-Focused UI</h4>
            <p className="text-xs text-slate-600 leading-relaxed">Strategic layout hierarchy and frictionless calls-to-action designed to convert visitors into paying clients.</p>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Choose Your Web Design Package
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={`rounded-2xl p-7 border transition-all flex flex-col justify-between ${
                  tier.popular
                    ? "border-brand-600 shadow-card ring-2 ring-brand-600/20 bg-white"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div>
                  {tier.popular && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-700 mb-3 inline-block">
                      Most Popular
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 mb-4">{tier.desc}</p>
                  
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl font-extrabold text-slate-900">${tier.price}</span>
                    <span className="text-xs text-slate-400"> /one-time</span>
                  </div>
                  <div className="text-xs font-semibold text-brand-600 mb-6">
                    Estimated Delivery: {tier.duration}
                  </div>

                  <ul className="space-y-2.5 mb-8">
                    {tier.deliverables.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-slate-700">
                        <Check className="w-4 h-4 text-brand-600 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={`https://wa.me/255613735391?text=Assalam%20o%20Alaikum!%20I%20want%20to%20pre-book%20the%20Frontend%20Website%20Design%20package%20(${encodeURIComponent(tier.name)}).`}
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
    </div>
  );
}
