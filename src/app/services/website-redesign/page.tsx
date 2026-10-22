"use client";

import React, { useState } from "react";
import { Palette, CheckCircle2, ArrowRight, AlertCircle, RefreshCw } from "lucide-react";

export default function WebsiteRedesignPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentUrl: "",
    businessType: "",
    requiredChanges: "",
    referenceWebsites: "",
    budgetRange: "$500 - $1,000",
    deadline: "Within 2-3 Weeks",
    additionalNotes: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate inquiry submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-semibold mb-3">
            <span>Website Redesign & Audit</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs font-bold mb-4 block mx-auto w-fit">
            <span>⏳ Coming Soon • Pre-Booking & Audits Open</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Transform Your Existing Website
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-3 max-w-2xl mx-auto">
            Is your website outdated, slow, or failing to convert? Submit your current website details below for a comprehensive UX, performance, and conversion audit.
          </p>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 sm:p-12 text-center space-y-4 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Redesign Audit Request Received!</h3>
            <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
              Thank you, <strong className="text-slate-900">{formData.name}</strong>. Our lead design architects will audit <strong className="text-slate-900">{formData.currentUrl}</strong> and prepare a detailed redesign proposal within 24 hours.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <a
                href="/dashboard"
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Track in Client Dashboard
              </a>
              <button
                onClick={() => setSubmitted(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-white"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          <form 
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-sm space-y-6"
          >
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Website Redesign Questionnaire</h3>
              <p className="text-xs text-slate-500">Provide accurate details to receive an exact quote and scope of work.</p>
            </div>

            {/* Row 1: Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="sarah@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>
            </div>

            {/* Row 2: Current URL & Business Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Current Website URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://mycurrentwebsite.com"
                  value={formData.currentUrl}
                  onChange={(e) => setFormData({ ...formData, currentUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Business / Industry Type *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. E-commerce, B2B SaaS, Agency"
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>
            </div>

            {/* Required Changes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                What are the main problems or required changes? *
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g., The site is slow, looks outdated on mobile phones, doesn't capture leads effectively, and needs a brand-new modern aesthetic."
                value={formData.requiredChanges}
                onChange={(e) => setFormData({ ...formData, requiredChanges: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>

            {/* Reference Websites */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Reference Websites (Websites you like the look & feel of)
              </label>
              <input
                type="text"
                placeholder="e.g., stripe.com, linear.app, vercel.com"
                value={formData.referenceWebsites}
                onChange={(e) => setFormData({ ...formData, referenceWebsites: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>

            {/* Budget & Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Budget Range
                </label>
                <select
                  value={formData.budgetRange}
                  onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm bg-white"
                >
                  <option>$399 - $500 (Basic Refresh)</option>
                  <option>$500 - $1,000 (Complete Overhaul)</option>
                  <option>$1,000 - $2,500 (Enterprise Custom)</option>
                  <option>$2,500+ (Complex Platform)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Target Deadline
                </label>
                <select
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm bg-white"
                >
                  <option>Urgent (Within 7-10 Days)</option>
                  <option>Within 2-3 Weeks</option>
                  <option>Flexible / Next Month</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Redesign Inquiry & Get Free Audit</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
