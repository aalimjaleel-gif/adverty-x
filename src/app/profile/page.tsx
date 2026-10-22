"use client";

import React, { useState, useEffect } from "react";
import { 
  User, 
  Package, 
  Clock, 
  DollarSign, 
  Share2, 
  Copy, 
  Check, 
  Upload, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  GraduationCap, 
  LogOut,
  Sparkles,
  Phone,
  CreditCard,
  Eye,
  FileText
} from "lucide-react";
import { 
  getStoredOrders, 
  OrderItem, 
  getReferralSettings, 
  ReferralCommissionSettings,
  getPayoutRequests,
  addPayoutRequest,
  PayoutRequest,
  getAuthenticatedUser,
  logoutAll,
  isAdminAuthenticated
} from "@/lib/store";

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState<"orders" | "earnings" | "courses">("orders");
  const [user, setUser] = useState({
    name: "Customer Account",
    email: "customer@example.com",
    joinedDate: "October 2026",
    role: "Verified Client & Partner",
    isAdmin: false
  });

  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [referralSettings, setReferralSettings] = useState<ReferralCommissionSettings>({
    courseEnrollmentPKR: 20,
    appSubscriptionPKR: 10,
    largeServicePKR: 20,
    smallProductPKR: 10
  });

  // Copied state
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Upload SS state
  const [uploadingOrderId, setUploadingOrderId] = useState<string | null>(null);

  // Payout request modal
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutForm, setPayoutForm] = useState({
    amount: "50",
    method: "JazzCash" as "JazzCash" | "OPay" | "Easypaisa" | "Bank Transfer",
    accountNumber: "",
    accountTitle: ""
  });
  const [payoutHistory, setPayoutHistory] = useState<PayoutRequest[]>([]);

  // Wallet balance based on referrals
  const [walletBalance, setWalletBalance] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [referralsCount, setReferralsCount] = useState(0);

  useEffect(() => {
    // 1. Load user session - Unified SSO Check
    const authUser = getAuthenticatedUser();
    if (!authUser) {
      window.location.href = "/login";
      return;
    }
    setUser({
      name: authUser.name,
      email: authUser.email,
      joinedDate: authUser.joinedDate || "October 2026",
      role: authUser.role || (authUser.isAdmin ? "Master Administrator" : "Verified Client & Partner"),
      isAdmin: !!authUser.isAdmin
    });

    // 2. Load orders
    const allOrders = getStoredOrders();
    setOrders(allOrders);

    // 3. Load referral commission rates set by admin
    setReferralSettings(getReferralSettings());

    // 4. Load payouts
    setPayoutHistory(getPayoutRequests());

    // Listen to updates
    const handleOrderUpdate = () => setOrders(getStoredOrders());
    const handleRefUpdate = () => setReferralSettings(getReferralSettings());
    const handlePayoutUpdate = () => setPayoutHistory(getPayoutRequests());

    window.addEventListener("advertyx_orders_updated", handleOrderUpdate);
    window.addEventListener("advertyx_referral_updated", handleRefUpdate);
    window.addEventListener("advertyx_payouts_updated", handlePayoutUpdate);

    return () => {
      window.removeEventListener("advertyx_orders_updated", handleOrderUpdate);
      window.removeEventListener("advertyx_referral_updated", handleRefUpdate);
      window.removeEventListener("advertyx_payouts_updated", handlePayoutUpdate);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const referralCode = `ADV-${user.name.toUpperCase().replace(/\s+/g, "").slice(0, 6) || "PARTNER"}`;
  const referralLink = typeof window !== "undefined" 
    ? `${window.location.origin}?ref=${referralCode}`
    : `https://advertyx.com?ref=${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    showToast("Referral link copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Upload payment screenshot for an order
  const handleScreenshotUpload = (orderId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image (JPG, PNG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const currentOrders = getStoredOrders();
      const updated = currentOrders.map(o => o.id === orderId ? {
        ...o,
        screenshotUrl: dataUrl,
        screenshotName: file.name
      } : o);

      if (typeof window !== "undefined") {
        localStorage.setItem("advertyx_orders_data", JSON.stringify(updated));
        window.dispatchEvent(new Event("advertyx_orders_updated"));
      }
      setOrders(updated);
      showToast(`Payment screenshot uploaded for Order ${orderId}! Admin will verify within 12 hours.`);
      setUploadingOrderId(null);
    };
    reader.readAsDataURL(file);
  };

  const handlePayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reqAmount = Number(payoutForm.amount);
    if (reqAmount <= 0 || reqAmount > walletBalance) {
      alert("Invalid withdrawal amount or insufficient balance.");
      return;
    }
    if (!payoutForm.accountNumber || !payoutForm.accountTitle) {
      alert("Please enter your account number and title.");
      return;
    }

    const newReq: PayoutRequest = {
      id: `PAY-${Date.now().toString().slice(-4)}`,
      userEmail: user.email,
      amountPKR: reqAmount,
      method: payoutForm.method,
      accountNumber: payoutForm.accountNumber,
      accountTitle: payoutForm.accountTitle,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "Pending"
    };

    const updated = addPayoutRequest(newReq);
    setPayoutHistory(updated);
    setWalletBalance(prev => prev - reqAmount);
    setIsPayoutModalOpen(false);
    showToast(`Payout request of Rs ${reqAmount} submitted to Admin!`);
  };

  const handleLogout = () => {
    logoutAll();
    window.location.href = "/login";
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 lg:py-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Toast */}
        {toastMessage && (
          <div className="fixed top-24 right-5 z-50 bg-slate-950 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-800 text-xs font-bold flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Master Administrator Switcher Banner */}
        {(user.isAdmin || isAdminAuthenticated()) && (
          <div className="mb-6 p-4 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-950 border border-brand-500/40 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-300 flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-brand-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-black text-white">Master Administrator Active</h2>
                  <span className="px-2 py-0.5 rounded-full bg-brand-500/30 text-brand-300 text-[10px] font-bold border border-brand-500/40">
                    Owner Session
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  You are logged into the Master Admin account with full store privileges.
                </p>
              </div>
            </div>
            <a
              href="/admin"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 transition-all flex-shrink-0 active:scale-95"
            >
              <span>Open Master Control Panel</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* Profile Header Card */}
        <div className="bg-gradient-to-br from-slate-950 via-[#0f172a] to-[#1e1b4b] rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-slate-800 mb-8 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-brand-600/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-lg text-2xl font-black">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white capitalize">
                    {user.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                    Active
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-mono">{user.email}</p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                  <span>Joined {user.joinedDate}</span>
                  <span>•</span>
                  <span className="text-brand-300 font-semibold">{user.role}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab("earnings")}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 text-xs font-bold text-white transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Wallet: Rs {walletBalance}</span>
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Guaranteed Delivery Notice Strip */}
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse flex-shrink-0" />
              <span>
                <strong className="text-white">Delivery Policy:</strong> Every order is delivered <strong className="text-emerald-400">within 12 Hours</strong> after payment confirmation (often much faster!).
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a 
                href="https://wa.me/255613735391?text=Assalam%20o%20Alaikum!%20I%20have%20an%20order%20inquiry."
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Priority Support WhatsApp</span>
              </a>

              <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
                <a
                  href="https://www.instagram.com/advertyx_?utm_source=ig_web_button_share_sheet&xtok=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-pink-600 text-slate-300 hover:text-white transition-all text-xs"
                  title="Follow Adverty X on Instagram"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162z"/>
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@advertyx.info?_r=1&_t=ZS-9AhzdSk552D"
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-black text-slate-300 hover:text-[#00f2fe] transition-all text-xs"
                  title="Follow Adverty X on TikTok"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
                <a
                  href="https://youtube.com/@advertyx?si=ETYe4Cn61LFe5znA"
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-red-600 text-slate-300 hover:text-white transition-all text-xs"
                  title="Subscribe to Adverty X on YouTube"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/share/1Htm48bfdn/"
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-[#1877F2] text-slate-300 hover:text-white transition-all text-xs"
                  title="Follow Adverty X on Facebook"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-6 pb-1">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "orders"
                ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders & Delivery Tracking</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === "orders" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("earnings")}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === "earnings"
                ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <span>Reseller & Affiliate Earnings</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
              Rs 20 / Rs 10
            </span>
          </button>
        </div>

        {/* ==================================================================== */}
        {/* TAB 1: MY ORDERS & DELIVERY TRACKING */}
        {/* ==================================================================== */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            
            {/* Delivery Guarantee Banner */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-3 shadow-xs">
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  12-Hour Guaranteed Delivery Policy
                </h4>
                <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                  Once your payment TID and screenshot are verified, your digital account credentials, private login details, or masterclass access will be fulfilled within 12 hours max.
                </p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No Orders Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
                  You haven&apos;t placed any orders yet. Explore our premium subscriptions, digital agency services, or free video masterclasses.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a
                    href="/subscriptions"
                    className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    Browse App Subscriptions
                  </a>
                  <a
                    href="/academy"
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                  >
                    View Academy Courses
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {orders.map((order) => {
                  const isDelivered = order.status === "Delivered & Active" || order.status === "Completed";
                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                              {order.id}
                            </span>
                            <span className="text-xs text-slate-400">• {order.date}</span>
                          </div>
                          <h3 className="text-base font-black text-slate-900 mt-1">{order.product}</h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-base sm:text-lg font-black text-slate-900">{order.amount}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                            isDelivered 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}>
                            {isDelivered ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Active & Delivered</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                                <span>Awaiting Delivery (Max 12h)</span>
                              </>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Payment Verification & Proof Screenshot Section */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                            Payment Details
                          </span>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Method:</span>
                            <span className="font-semibold text-slate-800">{order.paymentMethod || "Easypaisa / JazzCash"}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Transaction ID (TID):</span>
                            <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                              {order.tid || "Pending Submission"}
                            </span>
                          </div>
                        </div>

                        {/* Screenshot Proof Box */}
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-1.5">
                            Payment Slip Screenshot
                          </span>
                          
                          {order.screenshotUrl ? (
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2 overflow-hidden">
                                <img 
                                  src={order.screenshotUrl} 
                                  alt="Receipt SS" 
                                  className="w-10 h-10 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                                />
                                <span className="text-xs text-slate-700 font-medium truncate">
                                  {order.screenshotName || "Receipt uploaded"}
                                </span>
                              </div>
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                                Verified Proof
                              </span>
                            </div>
                          ) : (
                            <div>
                              <p className="text-[11px] text-slate-500 mb-2">
                                Upload your payment screenshot for instant 12-hour verification:
                              </p>
                              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-[11px] font-bold cursor-pointer transition-all shadow-xs">
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload Payment SS</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleScreenshotUpload(order.id, e)}
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Delivered Credentials Box */}
                      {isDelivered && order.deliveredCredentials && (
                        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4 text-emerald-600" />
                              <span>Delivered Account Login Credentials</span>
                            </span>
                            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded">
                              Private to you
                            </span>
                          </div>
                          <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs font-mono text-emerald-950 whitespace-pre-wrap select-all">
                            {order.deliveredCredentials}
                          </div>
                          {order.deliveryNote && (
                            <p className="text-[11px] text-emerald-800 italic">
                              Note: {order.deliveryNote}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: RESELLER & AFFILIATE EARNINGS */}
        {/* ==================================================================== */}
        {activeTab === "earnings" && (
          <div className="space-y-6">
            
            {/* Wallet Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Available for Payout
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">Rs {walletBalance}</span>
                  <span className="text-xs text-emerald-600 font-bold">Ready</span>
                </div>
                <button
                  onClick={() => setIsPayoutModalOpen(true)}
                  disabled={walletBalance < 10}
                  className="mt-3 w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Withdraw to Easypaisa / JazzCash</span>
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Total Earned To Date
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-brand-600">Rs {totalEarned}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Earned from successful referrals & client sales.
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Successful Referrals
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-indigo-600">{referralsCount}</span>
                  <span className="text-xs text-slate-400 font-medium">Clients</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Users who placed orders using your link.
                </p>
              </div>
            </div>

            {/* Earning Commission Rules Callout */}
            <div className="bg-gradient-to-br from-indigo-950 via-[#172554] to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-indigo-900">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[11px] font-bold tracking-wide">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Adverty X Partner Earning Program</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    Share Courses & Apps to Earn Instant Profit
                  </h3>
                  <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                    Whenever anyone uses your link to enroll in an Academy course or buy an app subscription, commission is automatically added to your wallet:
                  </p>
                  
                  {/* Commission Rates Display */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                      <span className="text-[10px] uppercase font-bold text-amber-300 block">
                        🎓 Academy Courses
                      </span>
                      <span className="text-2xl font-black text-white">
                        Rs {referralSettings.courseEnrollmentPKR ?? referralSettings.largeServicePKR ?? 20}{" "}
                        <span className="text-xs font-normal text-slate-300">per course sale</span>
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                      <span className="text-[10px] uppercase font-bold text-emerald-300 block">
                        📱 Apps & Subscriptions (CapCut, Netflix, VPN)
                      </span>
                      <span className="text-2xl font-black text-white">
                        Rs {referralSettings.appSubscriptionPKR ?? referralSettings.smallProductPKR ?? 10}{" "}
                        <span className="text-xs font-normal text-slate-300">per app sale</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Referral Link Box */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-3 max-w-sm w-full">
                  <span className="text-xs font-bold text-white block">Your Unique Partner Link</span>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/20 text-xs font-mono text-brand-200 truncate select-all">
                    {referralLink}
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? "Link Copied!" : "Copy Partner Link"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Payout History */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-brand-600" />
                <span>Withdrawal & Payout History</span>
              </h3>

              {payoutHistory.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  No withdrawal requests yet. Earn by sharing your link and request payouts anytime!
                </p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {payoutHistory.map((p) => (
                    <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-800">{p.id}</span>
                          <span className="text-slate-400">• {p.date}</span>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          {p.method}: {p.accountNumber} ({p.accountTitle})
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-slate-900 block">Rs {p.amountPKR}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.status === "Approved & Paid"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}>
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* Payout Withdrawal Modal */}
        {isPayoutModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-slate-900">Withdraw Earnings</h3>
                <button onClick={() => setIsPayoutModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">✕</button>
              </div>

              <form onSubmit={handlePayoutSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Withdrawal Amount (Available: Rs {walletBalance})
                  </label>
                  <input
                    type="number"
                    min="10"
                    max={walletBalance}
                    required
                    value={payoutForm.amount}
                    onChange={(e) => setPayoutForm({ ...payoutForm, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Payout Method</label>
                  <select
                    value={payoutForm.method}
                    onChange={(e) => setPayoutForm({ ...payoutForm, method: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white"
                  >
                    <option value="JazzCash">JazzCash (Instant)</option>
                    <option value="OPay">OPay Wallet (Instant)</option>
                    <option value="Easypaisa" disabled>Easypaisa (Coming Soon)</option>
                    <option value="Bank Transfer" disabled>Meezan Bank (Coming Soon)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Account Number / Mobile</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 0300 1234567"
                    value={payoutForm.accountNumber}
                    onChange={(e) => setPayoutForm({ ...payoutForm, accountNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Account Holder Name (Title)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muhammad Ali"
                    value={payoutForm.accountTitle}
                    onChange={(e) => setPayoutForm({ ...payoutForm, accountTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPayoutModalOpen(false)}
                    className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md"
                  >
                    Confirm Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
