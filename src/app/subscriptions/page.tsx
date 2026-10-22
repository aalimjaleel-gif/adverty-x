"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Key, 
  RefreshCw, 
  Info,
  CheckCircle2,
  X,
  Send,
  MessageCircle,
  Copy,
  Building,
  Smartphone,
  UploadCloud
} from "lucide-react";
import { getStoredSubscriptions, fetchSubscriptionsFromServer, addOrder } from "@/lib/store";
import { AppSubscriptionItem, APP_SUBSCRIPTIONS } from "@/data/mockData";
import AppCard from "@/components/subscriptions/AppCard";

export default function SubscriptionsPage() {
  const [products, setProducts] = useState<AppSubscriptionItem[]>(APP_SUBSCRIPTIONS);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL PRODUCTS");
  const [currency, setCurrency] = useState<"PKR" | "USD">("PKR");
  
  // Order Modal State
  const [orderingItem, setOrderingItem] = useState<AppSubscriptionItem | null>(null);
  const [customerContact, setCustomerContact] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"JazzCash" | "OPay" | "Easypaisa" | "Bank Transfer">("JazzCash");
  const [tid, setTid] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState<string>("");
  const [screenshotName, setScreenshotName] = useState<string>("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshotName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setScreenshotUrl(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const initial = getStoredSubscriptions();
    if (initial && initial.length > 0) setProducts(initial);
    fetchSubscriptionsFromServer().then((list) => {
      if (list && list.length > 0) setProducts(list);
    });

    const handleUpdate = () => {
      const updated = getStoredSubscriptions();
      if (updated && updated.length > 0) setProducts(updated);
    };
    window.addEventListener("advertyx_subscriptions_updated", handleUpdate);
    return () => window.removeEventListener("advertyx_subscriptions_updated", handleUpdate);
  }, []);

  const defaultCategories = ["ALL PRODUCTS", "DESIGN & EDIT", "ENTERTAINMENT", "VPN", "AI & PRODUCTIVITY", "STREAMING"];
  const categories = Array.from(new Set([
    ...defaultCategories,
    ...products.map(p => (p.category || "").toUpperCase().trim()).filter(Boolean)
  ]));

  const filteredItems = selectedCategory === "ALL PRODUCTS"
    ? products
    : products.filter((item) => (item.category || "").toUpperCase().trim() === selectedCategory.toUpperCase().trim());

  const paymentAccounts = {
    JazzCash: { number: "03034581115", formattedNumber: "0303-4581115", title: "Ali Ahmed", type: "JazzCash Mobile Account" },
    OPay: { number: "03244973465", formattedNumber: "0324-4973465", title: "Shazia Khalil", type: "OPay Wallet Account" },
    Easypaisa: { number: "03034581115", formattedNumber: "0303-4581115", title: "Ali Ahmed", type: "Easypaisa Account" },
    "Bank Transfer": { number: "PK92MEZN01020105892100", formattedNumber: "PK92 MEZN 0102 0105 8921 00", title: "Adverty X Digital Services", type: "Meezan Bank IBAN" },
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderingItem || !customerContact) return;
    setSubmitting(true);

    // Save order into persistent real store
    addOrder({
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: customerContact,
      product: `${orderingItem.name} (${orderingItem.typeBadge})`,
      amount: currency === "PKR" ? `Rs ${orderingItem.pricePKR}` : `$${orderingItem.priceUSD}`,
      date: "Just now",
      status: "Awaiting Delivery",
      type: "subscription",
      tid: tid || `TRX-${Date.now().toString().slice(-6)}`,
      paymentMethod: paymentMethod,
      screenshotUrl: screenshotUrl || undefined,
      screenshotName: screenshotName || undefined,
      deliveryGuaranteedWithin: "12 Hours"
    });

    setTimeout(() => {
      setSubmitting(false);
      setOrderComplete(true);
    }, 600);
  };

  return (
    <div className="bg-slate-50/50 min-h-screen py-12 lg:py-16">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Category Filter Header */}
        <div className="flex flex-col items-center justify-center mb-12 space-y-4">
          <div className="text-center max-w-xl mx-auto mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-brand-600 px-3 py-1 bg-brand-50 rounded-full inline-block mb-2">
              Official Licensed Subscriptions
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Premium App Subscriptions
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Guaranteed private profiles, instant WhatsApp activation & full warranty coverage.
            </p>
          </div>

          <div className="w-full max-w-2xl mx-auto overflow-x-auto no-scrollbar py-1">
            <div className="inline-flex sm:flex items-center gap-1.5 p-1.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs min-w-full sm:min-w-0 sm:justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 sm:px-6 py-2 rounded-xl text-xs font-black tracking-wider whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                    selectedCategory === cat
                      ? "bg-brand-600 text-white shadow-sm shadow-brand-500/30 scale-100"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Currency Toggle (PKR / USD) */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-500 pt-1 text-center">
            <span>Currency:</span>
            <button
              onClick={() => setCurrency(currency === "PKR" ? "USD" : "PKR")}
              className="px-3 py-1 rounded-lg border border-slate-200 bg-white font-bold text-slate-900 hover:bg-slate-50 shadow-xs"
            >
              {currency === "PKR" ? "PKR (Rs)" : "USD ($)"}
            </button>
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              JazzCash & OPay Instant Delivery (Easypaisa & Meezan Coming Soon)
            </span>
          </div>
        </div>

        {/* 4-Column Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {filteredItems.map((item) => (
            <AppCard
              key={item.id}
              item={item}
              currency={currency}
              onOrder={(selected) => {
                setOrderingItem(selected);
                setOrderComplete(false);
                setCustomerContact("");
                setTid("");
              }}
            />
          ))}
        </div>

        {/* Customer Trust Footer Banner */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-xs">
          <div className="space-y-1">
            <h4 className="font-extrabold text-slate-900 text-lg flex items-center justify-center sm:justify-start gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>100% Guaranteed Replacement Warranty</span>
            </h4>
            <p className="text-xs text-slate-600 max-w-lg leading-relaxed">
              All app subscriptions are fully covered by our stated warranty period. If you ever experience any downtime or profile issues, get instant resolution via our 24/7 WhatsApp team.
            </p>
          </div>

          <a
            href="/contact"
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs whitespace-nowrap shadow-sm"
          >
            Ask Support Questions
          </a>
        </div>

      </div>

      {/* =========================================================================
          ORDER & EASYPAISA / JAZZCASH PAYMENT MODAL
      ========================================================================= */}
      {orderingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative my-6">
            <button
              onClick={() => setOrderingItem(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            {orderComplete ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Payment Proof Submitted!</h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                  Thank you! Your order for <strong className="text-slate-900">{orderingItem.name}</strong> has been received. Your TID (<strong className="font-mono text-brand-600">{tid || "Recorded"}</strong>) is being verified. Your login credentials will be delivered to <strong className="text-slate-900">{customerContact}</strong> within 5-15 minutes.
                </p>
                <div className="pt-3 flex flex-col gap-2.5">
                  <a
                    href={`https://wa.me/255613735391?text=${encodeURIComponent(`Assalam o Alaikum! I have submitted payment for ${orderingItem.name}. My WhatsApp is ${customerContact} and TID is ${tid}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Open WhatsApp for Faster Handover</span>
                  </a>
                  <button
                    onClick={() => setOrderingItem(null)}
                    className="w-full py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleOrderSubmit} className="space-y-4">
                
                {/* Header */}
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
                    Step 1: Order Details
                  </span>
                  <div className="flex items-center justify-between mt-1">
                    <h3 className="text-lg font-bold text-slate-900">{orderingItem.name}</h3>
                    <span className="text-lg font-black text-brand-600">
                      {currency === "PKR" ? `Rs ${orderingItem.pricePKR}` : `$${orderingItem.priceUSD}`}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">{orderingItem.typeBadge} • {orderingItem.warrantyBadge}</span>
                </div>

                {/* Step 2: Payment Method Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700">
                      Step 2: Choose Payment Account
                    </span>
                    <span className="text-[10px] text-slate-400">
                      JazzCash & OPay Active
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { key: "JazzCash" as const, label: "JazzCash", isComingSoon: false },
                      { key: "OPay" as const, label: "OPay", isComingSoon: false },
                      { key: "Easypaisa" as const, label: "Easypaisa", isComingSoon: true },
                      { key: "Bank Transfer" as const, label: "Meezan Bank", isComingSoon: true }
                    ].map((m) => {
                      const isSelected = paymentMethod === m.key;
                      if (m.isComingSoon) {
                        return (
                          <div
                            key={m.key}
                            className="p-2 sm:p-2.5 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 text-center text-xs opacity-75 cursor-not-allowed select-none flex flex-col items-center justify-center"
                            title={`${m.label} is coming soon! Please pay via JazzCash or OPay.`}
                          >
                            <span className="font-semibold text-slate-400">{m.label}</span>
                            <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 mt-1">
                              Coming Soon
                            </span>
                          </div>
                        );
                      }
                      return (
                        <button
                          key={m.key}
                          type="button"
                          onClick={() => setPaymentMethod(m.key)}
                          className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${
                            isSelected
                              ? "border-brand-600 bg-brand-50/70 text-brand-700 shadow-xs ring-1 ring-brand-500"
                              : "border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <span>{m.label}</span>
                          <span className="text-[9px] font-bold text-emerald-600 mt-0.5">● Instant</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Account Details Box */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between items-center text-slate-500 text-[11px]">
                    <span>Account Type: <strong className="text-slate-800">{paymentAccounts[paymentMethod].type}</strong></span>
                    <span>Title: <strong className="text-slate-900 font-bold">{paymentAccounts[paymentMethod].title}</strong></span>
                  </div>
                  <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 font-mono text-slate-900 font-bold">
                    <span>{paymentAccounts[paymentMethod].formattedNumber || paymentAccounts[paymentMethod].number}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(paymentAccounts[paymentMethod].number, paymentMethod)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-brand-600 text-[11px] font-sans font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedKey === paymentMethod ? "Copied!" : "Copy"}</span>
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    Send exact {currency === "PKR" ? `Rs ${orderingItem.pricePKR}` : `$${orderingItem.priceUSD}`} to this account.
                  </span>
                </div>

                {/* Step 3: Customer Proof Inputs */}
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your WhatsApp Number (for instant credential delivery) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 0300-1234567"
                      value={customerContact}
                      onChange={(e) => setCustomerContact(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Payment Transaction ID (TID) from SMS *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 28941049219 (TID from JazzCash/OPay/Easypaisa)"
                      value={tid}
                      onChange={(e) => setTid(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  {/* Payment Screenshot (SS) Upload */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Upload Payment Slip Screenshot (SS) *
                    </label>
                    <input
                      type="file"
                      id="sub-order-ss"
                      accept="image/*"
                      onChange={handleScreenshotChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="sub-order-ss"
                      className="flex items-center justify-between p-3 rounded-xl border border-dashed border-slate-300 hover:border-brand-500 bg-slate-50 hover:bg-brand-50/20 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <UploadCloud className="w-4 h-4 text-brand-600 flex-shrink-0" />
                        <span className="text-xs font-medium text-slate-700 truncate">
                          {screenshotName ? screenshotName : "Click to select Payment Receipt Screenshot (SS)"}
                        </span>
                      </div>
                      {screenshotName && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex-shrink-0">
                          Uploaded ✓
                        </span>
                      )}
                    </label>
                  </div>
                </div>

                {/* 12-Hour SLA Delivery Guarantee Notice */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-semibold">
                  <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>
                    <strong>12-Hour SLA Guarantee:</strong> Delivered within 12 hours (or sooner) directly to your WhatsApp / Profile dashboard after payment verification.
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md mt-2"
                >
                  {submitting ? "Submitting Proof..." : "Submit Payment Proof & Confirm Order"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
