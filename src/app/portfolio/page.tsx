"use client";

import React, { useState } from "react";
import { CASE_STUDIES } from "@/data/mockData";
import { ArrowUpRight, TrendingUp, CheckCircle, ExternalLink } from "lucide-react";

export default function PortfolioPage() {
  const [filter, setFilter] = useState<string>("All");

  const categories = ["All", "Web Design", "Automation", "Social Media", "Paid Ads"];

  const filteredCases = filter === "All" 
    ? CASE_STUDIES 
    : CASE_STUDIES.filter((c) => c.category.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/70 text-brand-700 text-xs font-semibold mb-3">
            <span>Client Results & Case Studies</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Our Work & Client Impact
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
            Real results delivered for startups, businesses, and creators. We prioritize conversion metrics, speed, and business growth over mere vanity graphics.
          </p>

          {/* Filter Tabs */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filter === cat
                    ? "bg-brand-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filteredCases.map((study) => (
            <div
              key={study.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-card hover:-translate-y-1 transition-all"
            >
              <div className="h-48 bg-gradient-to-tr from-slate-900 to-indigo-950 p-6 flex flex-col justify-between text-white relative">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-white/20 backdrop-blur-sm self-start">
                  {study.category}
                </span>

                <div>
                  <div className="text-2xl font-extrabold text-emerald-400 mb-1 flex items-center gap-1.5">
                    <TrendingUp className="w-5 h-5" />
                    <span>{study.metrics}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{study.client}</h3>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {study.summary}
                  </p>
                  <div className="text-[11px] font-semibold text-slate-400 mb-4">
                    Timeline: {study.timeline}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-600">
                  <span>Verified Client Outcome</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
