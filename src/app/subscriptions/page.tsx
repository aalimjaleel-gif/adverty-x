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
import { 
  getStoredSubscriptions, 
  fetchSubscriptionsFromServer, 
  addOrder,
  getAuthenticatedUser,
  saveRegisteredUser,
  loginClient,
  authenticateWithGoogle,
  UserProfile
} from "@/lib/store";
import { AppSubscriptionItem, APP_SUBSCRIPTIONS } from "@/data/mockData";
import AppCard from "@/components/subscriptions/AppCard";

export default function SubscriptionsPage() {
  const [products, setProducts] = useState<AppSubscriptionItem[]>(APP_SUBSCRIPTIONS);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL PRODUCTS");
  const [currency, setCurrency] = useState<"PKR" | "USD">("PKR");
  
  // Auth state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Order Modal State
  const [orderingItem, setOrderingItem] = useState<AppSubscriptionItem | null>(null);
  const [customerContact, setCustomerContact] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPassword, setCustomerPassword] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"JazzCash" | "OPay" | "Easypaisa" | "Bank Transfer">("JazzCash");
  const [orderQty, setOrderQty] = useState<number>(1);
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
    const auth = getAuthenticatedUser();
    if (auth) {
      setCurrentUser(auth);
      setCustomerName(auth.name || "");
      setCustomerEmail(auth.email || "");
      if (auth.phone) setCustomerContact(auth.phone);
    }

    const initial = getStoredSubscriptions();
    if (initial && initial.length > 0) setProducts(initial);
    fetchSubscriptionsFromServer().then((list) => {
      if (list && list.length > 0) setProducts(list);
    });

    const handleUpdate = () => {
      const updated = getStoredSubscriptions();
      if (updated && updated.length > 0) setProducts(updated);
    };
    const handleAuth = () => {
      const u = getAuthenticatedUser();
      setCurrentUser(u);
      if (u) {
        setCustomerName(u.name || "");
        setCustomerEmail(u.email || "");
        if (u.phone) setCustomerContact(u.phone);
      }
    };

    window.addEventListener("advertyx_subscriptions_updated", handleUpdate);
    window.addEventListener("advertyx_auth_changed", handleAuth);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("advertyx_subscriptions_updated", handleUpdate);
      window.removeEventListener("advertyx_auth_changed", handleAuth);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const defaultCategories = ["ALL PRODUCTS", "DESIGN & EDIT", "ENTERTAINMENT", "VPN", "AI & PRODUCTIVITY", "STREAMING"];
  const categories = Array.from(new Set([
    ...defaultCategories,
    ...products.map(p => (p.category || "").toUpperCase().trim()).filter(Boolean)
  ]));

  const filteredItems = selectedCategory === "ALL PRODUCTS"
    ? products
    : products.filter((item) => (item.category || "").toUpperCase().trim() === selectedCategory.toUpperCase().trim());

  const officialPaymentAccounts = {
    JazzCash: { number: "03034581115", formattedNumber: "0303-4581115", title: "Ali Ahmed", type: "JazzCash Mobile Account" },
    OPay: { number: "03244973465", formattedNumber: "0324-4973465", title: "Shazia Khalil", type: "OPay Wallet Account" },
    Easypaisa: { number: "03034581115", formattedNumber: "0303-4581115", title: "Ali Ahmed", type: "Easypaisa Account" },
    "Bank Transfer": { number: "PK92MEZN01020105892100", formattedNumber: "PK92 MEZN 0102 0105 8921 00", title: "Adverty X Digital Services", type: "Meezan Bank IBAN" },
  };

  const isPartnerProduct = Boolean(
    orderingItem?.vendor?.isPartner || 
    (orderingItem?.vendor?.vendorName && orderingItem.vendor.vendorName !== "Adverty X (Official)")
  );

  const paymentAccounts = {
    JazzCash: (isPartnerProduct && orderingItem?.vendor?.JazzCash?.number)
      ? {
          number: orderingItem.vendor.JazzCash.number,
          formattedNumber: orderingItem.vendor.JazzCash.formattedNumber || orderingItem.vendor.JazzCash.number,
          title: orderingItem.vendor.JazzCash.title || orderingItem.vendor.vendorName,
          type: "JazzCash Mobile Account"
        }
      : officialPaymentAccounts.JazzCash,
    OPay: (isPartnerProduct && orderingItem?.vendor?.OPay?.number)
      ? {
          number: orderingItem.vendor.OPay.number,
          formattedNumber: orderingItem.vendor.OPay.formattedNumber || orderingItem.vendor.OPay.number,
          title: orderingItem.vendor.OPay.title || orderingItem.vendor.vendorName,
          type: "OPay Wallet Account"
        }
      : officialPaymentAccounts.OPay,
    Easypaisa: (isPartnerProduct && orderingItem?.vendor?.Easypaisa?.number)
      ? {
          number: orderingItem.vendor.Easypaisa.number,
          formattedNumber: orderingItem.vendor.Easypaisa.formattedNumber || orderingItem.vendor.Easypaisa.number,
          title: orderingItem.vendor.Easypaisa.title || orderingItem.vendor.vendorName,
          type: "Easypaisa Account"
        }
      : officialPaymentAccounts.Easypaisa,
    "Bank Transfer": (isPartnerProduct && orderingItem?.vendor?.BankTransfer?.accountNumber)
      ? {
          number: orderingItem.vendor.BankTransfer.accountNumber,
          formattedNumber: orderingItem.vendor.BankTransfer.accountNumber,
          title: orderingItem.vendor.BankTransfer.accountTitle,
          type: `${orderingItem.vendor.BankTransfer.bankName || "Bank"} Account`
        }
      : officialPaymentAccounts["Bank Transfer"],
  };

  const hasPartnerEasypaisa = Boolean(isPartnerProduct && orderingItem?.vendor?.Easypaisa?.number);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderingItem || !customerContact) return;
    setSubmitting(true);

    const isFree = orderingItem.pricePKR === 0;

    // Ensure user account exists and user is logged in
    let activeUser = currentUser || getAuthenticatedUser();
    let finalEmail = activeUser?.email;
    let finalName = activeUser?.name;

    if (!activeUser) {
      const cleanEmail = customerEmail.trim().toLowerCase() || `${customerContact.replace(/\D/g, "")}@customer.advertyx.com`;
      const cleanName = customerName.trim() || `Client ${customerContact.slice(-4)}`;
      const newUser: UserProfile = {
        name: cleanName,
        email: cleanEmail,
        joinedDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        role: "Client & Subscriber",
        isAdmin: false,
        phone: customerContact
      };
      saveRegisteredUser({ ...newUser, password: customerPassword.trim() || "pass123" });
      loginClient(newUser);
      setCurrentUser(newUser);
      activeUser = newUser;
      finalEmail = cleanEmail;
      finalName = cleanName;
    }

    const totalAmount = isFree 
      ? "Rs 0 (100% FREE)" 
      : (currency === "PKR" ? `Rs ${orderingItem.pricePKR * orderQty}` : `$${orderingItem.priceUSD * orderQty}`);

    // Save order into persistent real store linked to this customer's account
    addOrder({
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: `${finalName || "Customer"} (${customerContact})`,
      customerEmail: finalEmail,
      customerPhone: customerContact,
      product: orderQty > 1 ? `${orderingItem.name} x${orderQty} (${orderingItem.typeBadge})` : `${orderingItem.name} (${orderingItem.typeBadge})`,
      amount: totalAmount,
      date: "Just now",
      status: "Awaiting Delivery",
      type: "subscription",
      tid: isFree ? "FREE-ACCESS" : (tid || `TRX-${Date.now().toString().slice(-6)}`),
      paymentMethod: isFree ? "100% Free Promotion" : paymentMethod,
      vendorName: isPartnerProduct ? orderingItem.vendor?.vendorName : "Adverty X Official",
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
    <div className="bg-slate-50/50 min-h-screen py-12 lg:py-16 overflow-x-hidden">
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

          {/* Wholesale & Reseller Rates Banner (Fully Responsive, Zero Overflow) */}
          <div className="w-full max-w-3xl mx-auto p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-brand-500/40 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-xs font-bold text-white">Need Bulk Accounts at Wholesale Rates?</span>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950">
                    Reseller Desk
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Are you an agency or reseller buying in bulk (10, 50, 100+ accounts)? Get lowest wholesale rates instantly on WhatsApp.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 w-full sm:w-auto">
              <a
                href="https://wa.me/923275991628?text=Assalam%20o%20Alaikum!%20I%20am%20a%20reseller%20and%20need%20wholesale%20rates%20for%20bulk%20subscriptions."
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold whitespace-nowrap shadow-md flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>0327-5991628</span>
              </a>
              <a
                href="https://wa.me/923034581115?text=Assalam%20o%20Alaikum!%20I%20am%20a%20reseller%20and%20need%20wholesale%20rates%20for%20bulk%20subscriptions."
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold whitespace-nowrap border border-slate-700 flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>0303-4581115</span>
              </a>
            </div>
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
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center max-w-md mx-auto mb-20 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
              ★
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No Subscriptions Found</h3>
            <p className="text-xs text-slate-500 mb-4">
              There are no products listed under &quot;{selectedCategory}&quot;.
            </p>
            <button
              onClick={() => setSelectedCategory("ALL PRODUCTS")}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              View All Subscriptions
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {filteredItems.map((item) => (
              <AppCard
                key={item.id}
                item={item}
                currency={currency}
                onOrder={(selected) => {
                  setOrderingItem(selected);
                  setOrderQty(1);
                  setOrderComplete(false);
                  setCustomerContact("");
                  setTid("");
                }}
              />
            ))}
          </div>
        )}

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
          ORDER & EASYPAISA / JAZZCASH PAYMENT MODAL (COMPACT, STICKY FOOTER, Z-INDEX 100)
      ========================================================================= */}
      {orderingItem && (
        <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-hidden animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] border border-slate-200 shadow-2xl relative flex flex-col overflow-hidden">
            
            {/* STICKY TOP HEADER */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0 z-10">
              <div className="pr-4">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${orderingItem.pricePKR === 0 ? "text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md" : "text-brand-600"}`}>
                  {orderingItem.pricePKR === 0 ? "🎁 100% Free Promotion" : "Instant Order Checkout"}
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight mt-0.5">
                  {orderingItem.name}
                </h3>
                <span className="text-[11px] text-slate-500 block truncate">
                  {orderingItem.typeBadge} • {orderingItem.warrantyBadge}
                </span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <span className="text-base sm:text-lg font-black text-brand-600 block">
                    {orderingItem.pricePKR === 0 
                      ? "FREE" 
                      : (currency === "PKR" ? `Rs ${(orderingItem.pricePKR * orderQty).toLocaleString()}` : `$${orderingItem.priceUSD * orderQty}`)}
                  </span>
                  {orderQty > 1 && orderingItem.pricePKR > 0 && (
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      ({orderQty} × {currency === "PKR" ? `Rs ${orderingItem.pricePKR}` : `$${orderingItem.priceUSD}`})
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setOrderingItem(null)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {orderComplete ? (
              <div className="p-6 text-center py-8 space-y-4 flex-1 overflow-y-auto">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Payment Proof Submitted!</h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                  Thank you! Your order for <strong className="text-slate-900">{orderQty > 1 ? `${orderingItem.name} (${orderQty} Screens/Accounts)` : orderingItem.name}</strong> has been received and saved to your account. Your TID (<strong className="font-mono text-brand-600">{tid || "Recorded"}</strong>) is being verified. Your login credentials will be delivered to <strong className="text-slate-900">{customerContact}</strong> within 5-15 minutes.
                </p>
                <div className="pt-3 flex flex-col gap-2.5 max-w-sm mx-auto">
                  <a
                    href={`https://wa.me/${(isPartnerProduct && orderingItem?.vendor?.vendorWhatsApp) ? orderingItem.vendor.vendorWhatsApp.replace(/\D/g, "") : "923275991628"}?text=${encodeURIComponent(
                      orderingItem.pricePKR === 0
                        ? `Assalam o Alaikum! I claimed 100% FREE access for ${orderingItem.name}. My WhatsApp is ${customerContact}. Please share my credentials.`
                        : `Assalam o Alaikum! I submitted payment for ${orderQty > 1 ? `${orderQty} screens/accounts of ` : ""}${orderingItem.name}. My WhatsApp is ${customerContact} and TID is ${tid}.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>
                      {isPartnerProduct && orderingItem?.vendor?.vendorWhatsApp
                        ? `Open Partner WhatsApp (${orderingItem.vendor.vendorWhatsApp})`
                        : "Open WhatsApp (0327-5991628) for Instant Delivery"}
                    </span>
                  </a>
                  <a
                    href="/profile"
                    className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold text-center"
                  >
                    View Order in My Profile Dashboard →
                  </a>
                  <button
                    onClick={() => setOrderingItem(null)}
                    className="w-full py-2 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleOrderSubmit} className="flex flex-col flex-1 overflow-hidden">
                
                {/* SCROLLABLE FORM BODY */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
                  
                  {orderingItem.pricePKR === 0 ? (
                    /* 100% FREE SUBSCRIPTION FORM */
                    <div className="space-y-3.5">
                      <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                        <div className="flex items-center gap-2 font-black text-xs">
                          <span>🎉</span>
                          <span>100% Free Access Granted!</span>
                        </div>
                        <p className="text-[11px] text-emerald-800 leading-relaxed">
                          No payment receipt needed. Provide your account & WhatsApp details below to receive your credentials.
                        </p>
                      </div>

                      {currentUser ? (
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-emerald-700 block">Logged In Client</span>
                            <span className="font-bold text-emerald-950">{currentUser.name}</span>
                            <span className="text-emerald-700 text-[11px] block">{currentUser.email}</span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                            Active Session
                          </span>
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-amber-900">Your Account (Access Credentials Saved Here)</span>
                            <a href="/login?redirect=/subscriptions" className="text-[10px] font-bold text-blue-600 hover:underline">
                              Existing User? Login →
                            </a>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Your Full Name *</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Muhammad Usman"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-900"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Your Email Address *</label>
                              <input
                                type="email"
                                required
                                placeholder="e.g. usman@gmail.com"
                                value={customerEmail}
                                onChange={(e) => setCustomerEmail(e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-900"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Account Password *</label>
                            <input
                              type="password"
                              required
                              placeholder="Create a password to login anytime"
                              value={customerPassword}
                              onChange={(e) => setCustomerPassword(e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-900"
                            />
                          </div>
                        </div>
                      )}

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
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 bg-white"
                        />
                      </div>
                    </div>
                  ) : (
                    /* PAID SUBSCRIPTION FORM */
                    <div className="space-y-3.5">
                      
                      {/* Step 1: Screen / Account Quantity Selector */}
                      <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-800">
                            {orderingItem.typeBadge.toLowerCase().includes("screen") || orderingItem.name.toLowerCase().includes("netflix") || orderingItem.name.toLowerCase().includes("prime")
                              ? "Screens / Accounts (Choose Quantity)"
                              : "Account Quantity (Bulk Stock Available)"}
                          </span>
                          <span className="text-[11px] font-black text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-md border border-brand-200">
                            Total: {currency === "PKR" ? `Rs ${(orderingItem.pricePKR * orderQty).toLocaleString()}` : `$${orderingItem.priceUSD * orderQty}`}
                          </span>
                        </div>

                        {/* Stepper with - / + Controls */}
                        <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span className="text-xs font-bold text-slate-800">
                              {orderQty === 1 
                                ? (orderingItem.typeBadge.toLowerCase().includes("screen") ? "1 Screen Profile (Private)" : "1 Single Account")
                                : (orderingItem.typeBadge.toLowerCase().includes("screen") && orderQty <= 4 
                                    ? `${orderQty} Screens (${orderQty === 4 ? "Full 4-Screen Account" : "Private Profiles"})` 
                                    : `${orderQty} Accounts (Batch Order)`)}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setOrderQty(Math.max(1, orderQty - 1))}
                              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-sm flex items-center justify-center cursor-pointer transition-all active:scale-95"
                              title="Decrease"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              min="1"
                              max="500"
                              value={orderQty}
                              onChange={(e) => setOrderQty(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-12 text-center font-black text-xs text-brand-600 border border-slate-200 rounded-lg py-1 bg-white"
                            />
                            <button
                              type="button"
                              onClick={() => setOrderQty(orderQty + 1)}
                              className="w-7 h-7 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-black text-sm flex items-center justify-center cursor-pointer transition-all active:scale-95"
                              title="Increase"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Fast Click Presets */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          {[
                            { count: 1, label: orderingItem.typeBadge.toLowerCase().includes("screen") ? "1 Screen" : "1 Acc" },
                            { count: 2, label: orderingItem.typeBadge.toLowerCase().includes("screen") ? "2 Screens" : "2 Accs" },
                            { count: 4, label: orderingItem.typeBadge.toLowerCase().includes("screen") ? "4 Screens (Full)" : "4 Accs" },
                            { count: 5, label: "5 Batch" },
                            { count: 10, label: "10 Bulk" },
                            { count: 25, label: "25 Reseller" },
                          ].map((pill) => (
                            <button
                              key={pill.count}
                              type="button"
                              onClick={() => setOrderQty(pill.count)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                orderQty === pill.count
                                  ? "bg-brand-600 text-white shadow-xs"
                                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              {pill.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Partner vs Central Store Identifier */}
                      {isPartnerProduct ? (
                        <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-xs flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
                            <span className="font-bold text-purple-950 text-[11px]">Partner Store: {orderingItem.vendor?.vendorName}</span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-200 text-purple-900">
                            Partner Payment
                          </span>
                        </div>
                      ) : (
                        <div className="p-2 rounded-xl bg-blue-50/70 border border-blue-200 text-xs flex items-center justify-between">
                          <div className="flex items-center gap-2 text-blue-950 font-bold text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                            <span>Official Adverty X Central Store</span>
                          </div>
                          <span className="text-[10px] text-blue-700 font-bold">24/7 Delivery</span>
                        </div>
                      )}

                      {/* Step 2: Choose Payment Account */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-slate-700">
                            Step 2: Choose Payment Account
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {isPartnerProduct ? `${orderingItem.vendor?.vendorName} Account` : "JazzCash & OPay Active"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                          {[
                            { key: "JazzCash" as const, label: "JazzCash", isComingSoon: false },
                            { key: "OPay" as const, label: "OPay", isComingSoon: isPartnerProduct && !orderingItem?.vendor?.OPay?.number },
                            { key: "Easypaisa" as const, label: "Easypaisa", isComingSoon: !hasPartnerEasypaisa },
                            { key: "Bank Transfer" as const, label: "Meezan Bank", isComingSoon: !(isPartnerProduct && orderingItem?.vendor?.BankTransfer?.accountNumber) }
                          ].map((m) => {
                            const isSelected = paymentMethod === m.key;
                            if (m.isComingSoon) {
                              return (
                                <div
                                  key={m.key}
                                  className="p-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 text-center text-xs opacity-75 cursor-not-allowed select-none flex flex-col items-center justify-center"
                                  title={`${m.label} is coming soon!`}
                                >
                                  <span className="font-semibold text-slate-400 text-[11px]">{m.label}</span>
                                  <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1 py-0.2 rounded border border-amber-200 mt-0.5">
                                    Soon
                                  </span>
                                </div>
                              );
                            }
                            return (
                              <button
                                key={m.key}
                                type="button"
                                onClick={() => setPaymentMethod(m.key)}
                                className={`p-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${
                                  isSelected
                                    ? "border-brand-600 bg-brand-50/70 text-brand-700 shadow-xs ring-1 ring-brand-500"
                                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                                }`}
                              >
                                <span className="text-[11px]">{m.label}</span>
                                <span className="text-[9px] font-bold text-emerald-600 mt-0.5">● Instant</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Account Details Box */}
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                        <div className="flex justify-between items-center text-slate-500 text-[11px]">
                          <span>Type: <strong className="text-slate-800">{paymentAccounts[paymentMethod].type}</strong></span>
                          <span>Title: <strong className="text-slate-900 font-bold">{paymentAccounts[paymentMethod].title}</strong></span>
                        </div>
                        <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200 font-mono text-slate-900 font-bold">
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
                          Send exact <strong>{currency === "PKR" ? `Rs ${(orderingItem.pricePKR * orderQty).toLocaleString()}` : `$${orderingItem.priceUSD * orderQty}`}</strong> to this account.
                        </span>
                      </div>

                      {/* Step 3: Customer Proof Inputs */}
                      <div className="space-y-2.5">
                        {currentUser ? (
                          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs flex items-center justify-between">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Order Saved To Profile</span>
                              <span className="font-bold text-emerald-950 text-xs">{currentUser.name} ({currentUser.email})</span>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                              Verified
                            </span>
                          </div>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-amber-900">Your Account (Access Credentials Saved Here)</span>
                              <a href="/login?redirect=/subscriptions" className="text-[10px] font-bold text-blue-600 hover:underline">
                                Existing User? Login →
                              </a>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Your Full Name *</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="e.g. Muhammad Usman"
                                  value={customerName}
                                  onChange={(e) => setCustomerName(e.target.value)}
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-900"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Your Email Address *</label>
                                <input
                                  type="email"
                                  required
                                  placeholder="e.g. usman@gmail.com"
                                  value={customerEmail}
                                  onChange={(e) => setCustomerEmail(e.target.value)}
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-900"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Account Password (To login anytime) *</label>
                              <input
                                type="password"
                                required
                                placeholder="Create a password for your account"
                                value={customerPassword}
                                onChange={(e) => setCustomerPassword(e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-900"
                              />
                            </div>
                          </div>
                        )}

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
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-brand-500 bg-white"
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
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-brand-500 bg-white"
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
                            className="flex items-center justify-between p-2.5 rounded-xl border border-dashed border-slate-300 hover:border-brand-500 bg-slate-50 hover:bg-brand-50/20 cursor-pointer transition-all"
                          >
                            <div className="flex items-center gap-2 truncate">
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

                    </div>
                  )}

                </div>

                {/* STICKY BOTTOM SUBMIT FOOTER (NEVER CUT OFF, ALWAYS ABOVE BOTTOM NAV) */}
                <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex-shrink-0 z-10">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-brand-500/25 cursor-pointer active:scale-98 flex items-center justify-center gap-2"
                  >
                    <span>
                      {submitting 
                        ? "Verifying & Submitting..." 
                        : orderingItem.pricePKR === 0 
                          ? "🎁 Claim 100% Free Access Now" 
                          : `Submit Order (${currency === "PKR" ? `Rs ${(orderingItem.pricePKR * orderQty).toLocaleString()}` : `$${orderingItem.priceUSD * orderQty}`})`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-semibold text-slate-500 mt-1.5 text-center">
                    <Clock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    <span>5-15 Minute WhatsApp Delivery • 100% Replacement Warranty Guaranteed</span>
                  </div>
                </div>

              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
