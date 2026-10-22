"use client";

import React, { useState } from "react";
import { Megaphone, Check, ArrowRight, ShieldCheck, AlertCircle, BarChart3, Target } from "lucide-react";

export default function PaidAdvertisingPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    objective: "Lead Generation",
    platforms: ["Meta (Facebook & Instagram)"],
    monthlyAdSpend: "$1,000 - $3,000",
    landingPageUrl: "",
    targetAudience: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 mb-3">
            <a href="/services" className="hover:underline">Services</a>
            <span>/</span>
            <span className="text-slate-500">Paid Advertising</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs font-bold mb-4">
            <span>⏳ Coming Soon • Pre-Booking & Retainers Open</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Data-Driven Paid Advertising
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
            Reach high-intent customers through targeted Meta (Facebook & Instagram) and TikTok ad campaigns. We separate agency management fees from client ad spend and optimize for measurable ROI.
          </p>
        </div>

        {/* Legal & Compliance Disclaimers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-14">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-900 block font-semibold mb-0.5">Secure Platform Delegations Only</strong>
              We never ask for your personal social media passwords. Account access is managed securely through official Meta Business Manager and TikTok Partner Center partner delegations.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-900 block font-semibold mb-0.5">Transparent Ad Spend Separation</strong>
              Client ad budget is billed directly by Meta/TikTok to your payment method. Agency fees cover campaign architecture, copywriting, targeting, creative direction, and A/B testing.
            </div>
          </div>
        </div>

        {/* Campaign Inquiry Form */}
        <div className="max-w-3xl bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Request Paid Campaign Management</h3>
          <p className="text-xs text-slate-500 mb-6">Tell us about your campaign goals and expected monthly ad budget.</p>

          {submitted ? (
            <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-2">
              <h4 className="font-bold text-base">Campaign Inquiry Submitted!</h4>
              <p className="text-xs">Our advertising director will review your metrics and contact you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Ross"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="david@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-500"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Primary Campaign Objective</label>
                  <select
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                    onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                  >
                    <option>Lead Generation (Inquiries & Calls)</option>
                    <option>E-Commerce Sales & Conversions</option>
                    <option>App Installs & Sign-ups</option>
                    <option>Brand Awareness & Video Views</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Planned Monthly Ad Spend</label>
                  <select
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                    onChange={(e) => setFormData({ ...formData, monthlyAdSpend: e.target.value })}
                  >
                    <option>$500 - $1,000 / month</option>
                    <option>$1,000 - $3,000 / month</option>
                    <option>$3,000 - $10,000 / month</option>
                    <option>$10,000+ / month</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Landing Page URL</label>
                <input
                  type="url"
                  placeholder="https://mybrand.com/offer"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  onChange={(e) => setFormData({ ...formData, landingPageUrl: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
              >
                Submit Campaign Details
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
