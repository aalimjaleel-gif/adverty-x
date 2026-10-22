"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, CheckCircle2, ArrowRight, RefreshCw, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    division: "Agency Services",
    serviceInterest: "Website Design",
    budget: "$500 - $1,000",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/70 text-brand-700 text-xs font-semibold mb-3">
            <span>Get in Touch</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Contact & Service Inquiries
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
            Have a project in mind, need guidance on a course, or looking for a custom tool subscription? Our team responds within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Information & Channels (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-7 space-y-6">
              <h3 className="text-xl font-bold text-slate-900">Direct Contact Details</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reach our team directly through our official agency channels. For active clients, support tickets can also be filed inside your Client Dashboard.
              </p>

              <div className="space-y-4 text-xs text-slate-700">
                <a 
                  href="https://wa.me/255613735391" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-emerald-50/80 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-700 font-bold uppercase block">WhatsApp Support</span>
                    <span className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">+255 613 735 391</span>
                  </div>
                </a>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-brand-600">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Email Inquiries</span>
                    <span className="font-semibold text-slate-900">contact@advertyx.com</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-brand-600">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Business Inquiries</span>
                    <span className="font-semibold text-slate-900">Monday - Friday: 9am - 6pm PKT</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-brand-600">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Global Operations</span>
                    <span className="font-semibold text-slate-900">Islamabad, Pakistan & International Remote</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Social Media Channels */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Official Adverty X Channels</span>
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Connect with our community, watch masterclasses, and explore daily agency updates across our official social handles:
              </p>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <a
                  href="https://www.instagram.com/advertyx_?utm_source=ig_web_button_share_sheet&xtok=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-white border border-slate-200 hover:border-pink-300 hover:bg-pink-50/30 flex items-center gap-2.5 transition-all text-xs font-semibold text-slate-700 group"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162z"/>
                    </svg>
                  </div>
                  <div className="truncate">
                    <div className="text-[10px] text-slate-400">Instagram</div>
                    <div className="truncate text-slate-900 group-hover:text-pink-600">@advertyx_</div>
                  </div>
                </a>

                <a
                  href="https://www.tiktok.com/@advertyx.info?_r=1&_t=ZS-9AhzdSk552D"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-400 hover:bg-slate-100 flex items-center gap-2.5 transition-all text-xs font-semibold text-slate-700 group"
                >
                  <div className="w-7 h-7 rounded-lg bg-black text-[#00f2fe] flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                  </div>
                  <div className="truncate">
                    <div className="text-[10px] text-slate-400">TikTok</div>
                    <div className="truncate text-slate-900 group-hover:text-black">@advertyx.info</div>
                  </div>
                </a>

                <a
                  href="https://youtube.com/@advertyx?si=ETYe4Cn61LFe5znA"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-white border border-slate-200 hover:border-red-300 hover:bg-red-50/30 flex items-center gap-2.5 transition-all text-xs font-semibold text-slate-700 group"
                >
                  <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                  <div className="truncate">
                    <div className="text-[10px] text-slate-400">YouTube</div>
                    <div className="truncate text-slate-900 group-hover:text-red-600">@advertyx</div>
                  </div>
                </a>

                <a
                  href="https://www.facebook.com/share/1Htm48bfdn/"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 flex items-center gap-2.5 transition-all text-xs font-semibold text-slate-700 group"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#1877F2] text-white flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <div className="truncate">
                    <div className="text-[10px] text-slate-400">Facebook</div>
                    <div className="truncate text-slate-900 group-hover:text-blue-600">Official Page</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Quick Policy Reminder */}
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <span className="font-bold block">Video Editing Policy Reminder</span>
              <p className="text-amber-800 leading-relaxed">
                If you are inquiring about social media management, please note that video editing is an optional paid add-on and can be bundled into your proposal upon request.
              </p>
            </div>
          </div>

          {/* Interactive Inquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 sm:p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Message Dispatched Successfully!</h3>
                <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-slate-900">{formData.name}</strong>. Your inquiry has been routed to our <strong className="text-slate-900">{formData.division}</strong> team. We will review your requirements and reach out within 24 hours.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-white"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form 
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl border border-slate-200 p-8 shadow-card space-y-5"
              >
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold text-slate-900">Send an Inquiry</h3>
                  <p className="text-xs text-slate-500">Fill in the fields below and we will prepare a personalized scope.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Michael Scott"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="michael@dundermifflin.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Division of Interest</label>
                    <select
                      value={formData.division}
                      onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                    >
                      <option>Agency Services</option>
                      <option>Adverty X Academy</option>
                      <option>Adverty X Subscriptions</option>
                      <option>Partnerships & General Inquiries</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Planned Budget</label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                    >
                      <option>Under $300</option>
                      <option>$300 - $500</option>
                      <option>$500 - $1,000</option>
                      <option>$1,000 - $3,000</option>
                      <option>$3,000+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Project Details & Requirements *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your brand, what you need built, timelines, and specific objectives..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Dispatching Message...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Project Inquiry</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
