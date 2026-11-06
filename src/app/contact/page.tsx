"use client";

import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, CheckCircle2, ArrowRight, RefreshCw, MessageSquare, Sparkles, MessageCircle } from "lucide-react";
import { getStoredSubscriptions, fetchSubscriptionsFromServer, getAuthenticatedUser } from "@/lib/store";
import { APP_SUBSCRIPTIONS, AppSubscriptionItem } from "@/data/mockData";

export default function ContactPage() {
  const [subscriptionsList, setSubscriptionsList] = useState<AppSubscriptionItem[]>(APP_SUBSCRIPTIONS);
  const [selectedTool, setSelectedTool] = useState<string>("Canva Pro (Lifetime / Team)");
  const [quantity, setQuantity] = useState<string>("10");
  const [customQuantity, setCustomQuantity] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // 1. Preload authenticated user info if logged in
    const auth = getAuthenticatedUser();
    if (auth) {
      if (auth.name) setName(auth.name);
      if (auth.email) setEmail(auth.email);
      if (auth.phone) setWhatsapp(auth.phone);
    }

    // 2. Load live authoritative subscriptions from store and server
    const local = getStoredSubscriptions();
    if (local && local.length > 0) {
      setSubscriptionsList(local);
      if (local[0]?.name) {
        setSelectedTool(`${local[0].name} (${local[0].typeBadge || "Subscription"})`);
      }
    }
    fetchSubscriptionsFromServer().then((srv) => {
      if (srv && srv.length > 0) {
        setSubscriptionsList(srv);
      }
    });
  }, []);

  const effectiveQty = customQuantity.trim() ? customQuantity.trim() : quantity;

  const buildWhatsAppUrl = (phoneTarget: string) => {
    const text = `Assalam o Alaikum! Mujhe Adverty X se Bulk Stock lena hai:\n\n📦 *Product:* ${selectedTool}\n🔢 *Quantity:* ${effectiveQty} Accounts\n👤 *Client Name:* ${name.trim() || "Reseller"}\n📱 *Contact:* ${whatsapp.trim() || "N/A"}\n✉️ *Email:* ${email.trim() || "N/A"}${notes.trim() ? `\n📝 *Notes:* ${notes.trim()}` : ""}\n\nPlease bulk stock wholesale rate aur availability confirm karein.`;
    return `https://wa.me/${phoneTarget}?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Reseller & Wholesale Desk Active</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Bulk Stock & Wholesale Orders
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
            Directly select from our active subscriptions stock, enter your required account quantity, and receive instant wholesale pricing directly on WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Information & Channels (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-7 space-y-6">
              <h3 className="text-xl font-bold text-slate-900">Direct Contact Details</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect directly with our operations desk for instant stock confirmation, custom wholesale pricing, and 24/7 delivery support.
              </p>

              <div className="space-y-4 text-xs text-slate-700">
                {/* WhatsApp Line 1 */}
                <a 
                  href="https://wa.me/923275991628?text=Assalam%20o%20Alaikum!%20I%20have%20an%20inquiry%20regarding%20bulk%20subscriptions." 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-3 p-2.5 -mx-2 rounded-xl hover:bg-emerald-50/80 transition-colors group border border-slate-200/60 bg-white"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-emerald-700 font-bold uppercase block">Primary WhatsApp Support</span>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">Online 24/7</span>
                    </div>
                    <span className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors text-sm">0327-5991628</span>
                  </div>
                </a>

                {/* WhatsApp Line 2 */}
                <a 
                  href="https://wa.me/923034581115?text=Assalam%20o%20Alaikum!%20I%20have%20an%20inquiry%20regarding%20bulk%20subscriptions." 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-3 p-2.5 -mx-2 rounded-xl hover:bg-emerald-50/80 transition-colors group border border-slate-200/60 bg-white"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-emerald-700 font-bold uppercase block">Secondary WhatsApp / Reseller Desk</span>
                      <span className="text-[9px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">Bulk Orders</span>
                    </div>
                    <span className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors text-sm">0303-4581115</span>
                  </div>
                </a>

                {/* Email */}
                <a 
                  href="mailto:advertyx.info@gmail.com"
                  className="flex items-center gap-3 p-2.5 -mx-2 rounded-xl hover:bg-slate-100 transition-colors group border border-slate-200/60 bg-white"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Official Email</span>
                    <span className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors text-sm">advertyx.info@gmail.com</span>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-2">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-brand-600">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Business Hours</span>
                    <span className="font-semibold text-slate-900">Monday - Sunday: 9am - 12am PKT</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-brand-600">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Operations Headquarters</span>
                    <span className="font-semibold text-slate-900">Pakistan & Remote Digital Delivery</span>
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
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
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
                  className="p-3 rounded-xl bg-white border border-slate-200 hover:border-black hover:bg-slate-100 flex items-center gap-2.5 transition-all text-xs font-semibold text-slate-700 group"
                >
                  <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center flex-shrink-0">
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
          </div>

          {/* Dedicated Bulk Stock Order & Wholesale Calculator (7 cols) */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 sm:p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Bulk Request Received!</h3>
                <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-slate-900">{name || "Reseller"}</strong>. Your inquiry for <strong className="text-slate-900">{effectiveQty} accounts</strong> of <strong className="text-slate-900">{selectedTool}</strong> has been logged.
                </p>
                <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={buildWhatsAppUrl("923275991628")}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Open WhatsApp (0327-5991628) for Instant Quote</span>
                  </a>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="w-full sm:w-auto px-5 py-3.5 rounded-2xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-white"
                  >
                    Modify Request
                  </button>
                </div>
              </div>
            ) : (
              <form 
                onSubmit={handleSubmit}
                className="bg-white rounded-3xl border border-slate-200 p-7 sm:p-8 shadow-card space-y-6"
              >
                {/* Header */}
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-slate-900">Bulk Stock & Reseller Order Desk</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Select any subscription from our active stock, choose quantity, and get distributor rates.</p>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex-shrink-0">
                      Wholesale Desk
                    </span>
                  </div>
                </div>

                {/* 1. Tool Selection (DIRECTLY FROM OUR SUBSCRIPTIONS STOCK!) */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    1. Choose Tool / Subscription From Our Stock *
                  </label>
                  <select
                    value={selectedTool}
                    onChange={(e) => setSelectedTool(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    {/* Active subscriptions from our database */}
                    {subscriptionsList.map((item) => (
                      <option key={item.id} value={`${item.name} (${item.typeBadge || "Subscription"})`}>
                        {item.name} — ({item.typeBadge} • Retail Rs {item.pricePKR})
                      </option>
                    ))}
                    <option value="Mixed / Multiple Tools (Bulk Wholesale Package)">
                      📦 Mixed / Multiple Tools (Package Deal)
                    </option>
                    <option value="Custom Tool (Not Listed)">
                      🔍 Other App / Tool (Special Request)
                    </option>
                  </select>
                  <span className="text-[11px] text-slate-400 mt-1.5 block">
                    ✓ All accounts include guaranteed private profiles, instant WhatsApp handover & replacement warranty.
                  </span>
                </div>

                {/* 2. Custom Quantity (User apne marze se bole ga itna account!) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                      2. How Many Accounts Do You Need? (Quantity) *
                    </label>
                    <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      {effectiveQty} Accounts Selected
                    </span>
                  </div>

                  {/* Quick Click Quantity Pills */}
                  <div className="grid grid-cols-5 gap-2 mb-3">
                    {["5", "10", "25", "50", "100"].map((qty) => (
                      <button
                        key={qty}
                        type="button"
                        onClick={() => {
                          setQuantity(qty);
                          setCustomQuantity("");
                        }}
                        className={`py-2 rounded-xl text-xs font-black transition-all ${
                          quantity === qty && !customQuantity
                            ? "bg-brand-600 text-white shadow-sm ring-2 ring-brand-600 scale-102"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        }`}
                      >
                        {qty} Pcs
                      </button>
                    ))}
                  </div>

                  {/* Or Custom Exact Number Input */}
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      placeholder="Or type any exact quantity (e.g. 15, 30, 200...)"
                      value={customQuantity}
                      onChange={(e) => setCustomQuantity(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 bg-white"
                    />
                  </div>
                </div>

                {/* 3. Client Name & WhatsApp Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Muhammad Usman"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-brand-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                      Your WhatsApp Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 0327-5991628"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 bg-white"
                    />
                  </div>
                </div>

                {/* Optional Email & Note */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. usman.digital@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-brand-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                      Specific Requirements / Delivery Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Need private screens, customer email activation, or delivery in batches..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-brand-500 bg-white"
                    />
                  </div>
                </div>

                {/* ACTION BUTTONS (Super easy 1-click WhatsApp quote!) */}
                <div className="pt-2 space-y-2.5">
                  <a
                    href={buildWhatsAppUrl("923275991628")}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2.5 cursor-pointer text-center"
                  >
                    <MessageCircle className="w-5 h-5 flex-shrink-0" />
                    <span>Get Instant Wholesale Rate on WhatsApp (0327-5991628)</span>
                  </a>

                  <div className="flex items-center gap-2">
                    <a
                      href={buildWhatsAppUrl("923034581115")}
                      target="_blank"
                      rel="noreferrer"
                      className="w-1/2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 text-center"
                    >
                      <span>Line 2 (0303-4581115)</span>
                    </a>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-1/2 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                      <span>Submit Request Online</span>
                    </button>
                  </div>
                </div>

              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}