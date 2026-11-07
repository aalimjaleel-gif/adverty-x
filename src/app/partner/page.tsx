"use client";

import React, { useState, useEffect } from "react";
import {
  Store,
  Palette,
  CreditCard,
  Package,
  GraduationCap,
  ShoppingBag,
  LogOut,
  Save,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Phone,
  Video,
  X,
  Copy,
  ExternalLink,
  ShieldCheck,
  Check,
  Image as ImageIcon
} from "lucide-react";
import { 
  PartnerVendor, 
  getActivePartnerSession, 
  loginPartner,
  getStoredPartners,
  getAuthenticatedUser,
  savePartner, 
  logoutPartner,
  getStoredSubscriptions,
  addSubscriptionItem,
  updateSubscriptionItem,
  deleteSubscriptionItem,
  getStoredOrders,
  deliverOrderCredentials,
  getStoredCourses,
  saveCourse,
  deleteCourse,
  OrderItem
} from "@/lib/store";
import { AppSubscriptionItem, CourseItem } from "@/data/mockData";

export default function PartnerStudioPage() {
  const [partner, setPartner] = useState<PartnerVendor | null>(null);
  const [activeTab, setActiveTab] = useState<"branding" | "payments" | "products" | "courses" | "orders">("branding");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Products State
  const [partnerProducts, setPartnerProducts] = useState<AppSubscriptionItem[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AppSubscriptionItem | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    category: "ENTERTAINMENT",
    typeBadge: "1 Month • Private",
    warrantyBadge: "28-day warranty",
    pricePKR: 350,
    inStock: true,
    description: "",
    iconType: "prime"
  });

  // Courses State
  const [partnerCourses, setPartnerCourses] = useState<CourseItem[]>([]);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);
  const [courseForm, setCourseForm] = useState({
    title: "",
    category: "Marketing",
    price: 6,
    trialPriceUSD: 3,
    hasTrialPlan: true,
    videoUrl: "",
    description: ""
  });

  // Orders State
  const [partnerOrders, setPartnerOrders] = useState<OrderItem[]>([]);
  const [deliveryModalOrder, setDeliveryModalOrder] = useState<OrderItem | null>(null);
  const [deliveryCredentials, setDeliveryCredentials] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [viewingSlipUrl, setViewingSlipUrl] = useState<string | null>(null);

  // Branding Form State
  const [brandingForm, setBrandingForm] = useState({
    storeName: "",
    tagline: "",
    phone: "",
    themeColor: "purple" as "purple" | "emerald" | "blue" | "rose" | "amber" | "indigo",
    youtubeUrl: "",
    instagramUrl: "",
    facebookUrl: "",
    tiktokUrl: "",
    jazzCashNumber: "",
    jazzCashTitle: "",
    easypaisaNumber: "",
    easypaisaTitle: "",
    bankName: "",
    bankAccountTitle: "",
    bankAccountNumber: ""
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    let session = getActivePartnerSession();
    if (!session) {
      // Auto-fallback: check if active client user is a registered partner!
      const authUser = getAuthenticatedUser();
      if (authUser && authUser.email) {
        const partners = getStoredPartners();
        const found = partners.find(p => p.email.toLowerCase() === authUser.email.toLowerCase());
        if (found) {
          loginPartner(found);
          session = found;
        }
      }
    }
    if (!session) {
      window.location.href = "/login?redirect=/partner";
      return;
    }
    setPartner(session);

    setBrandingForm({
      storeName: session.storeName || session.name || "My Partner Store",
      tagline: session.tagline || "Official Digital Partner Store",
      phone: session.phone || "",
      themeColor: session.themeColor || "purple",
      youtubeUrl: session.youtubeUrl || "",
      instagramUrl: session.instagramUrl || "",
      facebookUrl: session.facebookUrl || "",
      tiktokUrl: session.tiktokUrl || "",
      jazzCashNumber: session.paymentDetails?.JazzCash?.number || "",
      jazzCashTitle: session.paymentDetails?.JazzCash?.title || "",
      easypaisaNumber: session.paymentDetails?.Easypaisa?.number || "",
      easypaisaTitle: session.paymentDetails?.Easypaisa?.title || "",
      bankName: session.paymentDetails?.BankTransfer?.bankName || "",
      bankAccountTitle: session.paymentDetails?.BankTransfer?.accountTitle || "",
      bankAccountNumber: session.paymentDetails?.BankTransfer?.accountNumber || ""
    });

    // Load items belonging to this partner
    const allSubs = getStoredSubscriptions();
    const mySubs = allSubs.filter(s => s.vendor?.vendorName === session.storeName || s.vendor?.vendorName === session.name);
    setPartnerProducts(mySubs);

    const allCourses = getStoredCourses();
    const myCourses = allCourses.filter(c => c.vendor?.vendorName === session.storeName || c.vendor?.vendorName === session.name);
    setPartnerCourses(myCourses);

    const allOrders = getStoredOrders();
    const myOrders = allOrders.filter(o => o.vendorName === session.storeName || o.vendorName === session.name);
    setPartnerOrders(myOrders);

    const handleUpdate = () => {
      const s = getActivePartnerSession();
      if (!s) return;
      const subs = getStoredSubscriptions().filter(item => item.vendor?.vendorName === s.storeName || item.vendor?.vendorName === s.name);
      setPartnerProducts(subs);
      const orders = getStoredOrders().filter(o => o.vendorName === s.storeName || o.vendorName === s.name);
      setPartnerOrders(orders);
    };

    window.addEventListener("advertyx_subscriptions_updated", handleUpdate);
    window.addEventListener("advertyx_orders_updated", handleUpdate);
    return () => {
      window.removeEventListener("advertyx_subscriptions_updated", handleUpdate);
      window.removeEventListener("advertyx_orders_updated", handleUpdate);
    };
  }, []);

  if (!partner) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-slate-400">Verifying Partner Vendor Credentials...</p>
        </div>
      </div>
    );
  }

  if (partner.status === "Suspended") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-red-500/30 rounded-3xl p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
            <X className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white">Account Access Suspended</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your partner vendor studio has been temporarily suspended by the Super Administrator. Please reach out to Adverty X support desk at 0327-5991628 to restore access.
          </p>
          <button
            onClick={() => {
              logoutPartner();
              window.location.href = "/login";
            }}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
          >
            Log Out
          </button>
        </div>
      </div>
    );
  }

  // Save Branding & Theme
  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PartnerVendor = {
      ...partner,
      storeName: brandingForm.storeName.trim() || partner.storeName,
      tagline: brandingForm.tagline.trim(),
      phone: brandingForm.phone.trim(),
      themeColor: brandingForm.themeColor,
      youtubeUrl: brandingForm.youtubeUrl.trim(),
      instagramUrl: brandingForm.instagramUrl.trim(),
      facebookUrl: brandingForm.facebookUrl.trim(),
      tiktokUrl: brandingForm.tiktokUrl.trim(),
      paymentDetails: {
        JazzCash: brandingForm.jazzCashNumber.trim() ? {
          number: brandingForm.jazzCashNumber.trim(),
          title: brandingForm.jazzCashTitle.trim() || brandingForm.storeName
        } : undefined,
        Easypaisa: brandingForm.easypaisaNumber.trim() ? {
          number: brandingForm.easypaisaNumber.trim(),
          title: brandingForm.easypaisaTitle.trim() || brandingForm.storeName
        } : undefined,
        BankTransfer: brandingForm.bankAccountNumber.trim() ? {
          bankName: brandingForm.bankName.trim() || "Bank",
          accountTitle: brandingForm.bankAccountTitle.trim(),
          accountNumber: brandingForm.bankAccountNumber.trim()
        } : undefined
      }
    };
    savePartner(updated);
    setPartner(updated);
    showToast("✅ Store branding, theme, and payment accounts saved successfully!");
  };

  // Save Partner Product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim()) return;

    const vendorDetails = {
      isPartner: true,
      vendorName: partner.storeName || partner.name,
      vendorWhatsApp: partner.phone,
      JazzCash: partner.paymentDetails?.JazzCash ? {
        number: partner.paymentDetails.JazzCash.number,
        formattedNumber: partner.paymentDetails.JazzCash.number,
        title: partner.paymentDetails.JazzCash.title || partner.storeName
      } : undefined,
      Easypaisa: partner.paymentDetails?.Easypaisa ? {
        number: partner.paymentDetails.Easypaisa.number,
        formattedNumber: partner.paymentDetails.Easypaisa.number,
        title: partner.paymentDetails.Easypaisa.title || partner.storeName
      } : undefined,
      BankTransfer: partner.paymentDetails?.BankTransfer ? {
        bankName: partner.paymentDetails.BankTransfer.bankName,
        accountTitle: partner.paymentDetails.BankTransfer.accountTitle,
        accountNumber: partner.paymentDetails.BankTransfer.accountNumber
      } : undefined
    };

    const cleanId = editingProduct ? editingProduct.id : `partner-app-${Date.now()}`;
    const cleanSlug = editingProduct ? editingProduct.slug : `${productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString().slice(-4)}`;

    const newItem: AppSubscriptionItem = {
      id: cleanId,
      name: productForm.name.trim(),
      slug: cleanSlug,
      category: productForm.category,
      typeBadge: productForm.typeBadge.trim() || "1 Month • Private",
      warrantyBadge: productForm.warrantyBadge.trim() || "28-day replacement warranty",
      rating: 5.0,
      reviewsCount: 42,
      pricePKR: Number(productForm.pricePKR) || 350,
      priceUSD: Number(((Number(productForm.pricePKR) || 350) / 278).toFixed(2)),
      internalCostPKR: 0,
      inStock: productForm.inStock,
      iconBg: "bg-white",
      iconType: productForm.iconType,
      description: productForm.description.trim() || `${productForm.name} subscription provided by ${partner.storeName}.`,
      fulfillmentType: "Instant Account Credentials",
      vendor: vendorDetails
    };

    if (editingProduct) {
      updateSubscriptionItem(newItem);
      showToast(`Updated "${newItem.name}" in your store catalog!`);
    } else {
      addSubscriptionItem(newItem);
      showToast(`Published "${newItem.name}" to live store under your name!`);
    }

    const updated = getStoredSubscriptions().filter(s => s.vendor?.vendorName === partner.storeName || s.vendor?.vendorName === partner.name);
    setPartnerProducts(updated);
    setIsProductModalOpen(false);
  };

  // Delete Partner Product
  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`Remove "${name}" from your catalog?`)) {
      deleteSubscriptionItem(id);
      setPartnerProducts(prev => prev.filter(p => p.id !== id));
      showToast(`Removed "${name}" from catalog.`);
    }
  };

  // Deliver Customer Order Credentials
  const handleConfirmDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryModalOrder || !deliveryCredentials.trim()) return;

    deliverOrderCredentials(
      deliveryModalOrder.id,
      deliveryCredentials.trim(),
      deliveryNote.trim() || "Thank you for purchasing! Here are your activation credentials."
    );

    setPartnerOrders(prev => prev.map(o => o.id === deliveryModalOrder.id ? {
      ...o,
      status: "Delivered & Active",
      deliveredCredentials: deliveryCredentials.trim()
    } : o));

    setDeliveryModalOrder(null);
    showToast(`✅ Delivered credentials to order #${deliveryModalOrder.id}!`);
  };

  const themeColorsMap: Record<string, string> = {
    purple: "from-purple-600 to-indigo-600",
    emerald: "from-emerald-600 to-teal-600",
    blue: "from-blue-600 to-cyan-600",
    rose: "from-rose-600 to-pink-600",
    amber: "from-amber-600 to-orange-600",
    indigo: "from-indigo-600 to-violet-600"
  };

  return (
    <div className="bg-[#0b101e] text-slate-100 min-h-screen">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl bg-slate-900 border border-emerald-500 text-white text-xs font-bold shadow-2xl flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-[#0e1424] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${themeColorsMap[brandingForm.themeColor] || "from-purple-600 to-indigo-600"} flex items-center justify-center font-black text-white text-lg shadow-md`}>
              {brandingForm.storeName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white">{brandingForm.storeName}</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Verified Partner
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Reseller & Multi-Vendor Control Studio • {partner.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/subscriptions"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Store</span>
            </a>
            <button
              onClick={() => {
                logoutPartner();
                window.location.href = "/login";
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs font-bold">
          {[
            { id: "branding" as const, label: "Store Branding & Theme", icon: Palette },
            { id: "payments" as const, label: "My Payment Accounts", icon: CreditCard },
            { id: "products" as const, label: `My Stock / Products (${partnerProducts.length})`, icon: Package },
            { id: "orders" as const, label: `My Customer Orders (${partnerOrders.length})`, icon: ShoppingBag },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-slate-800 text-white border border-slate-700 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            TAB 1: STORE BRANDING & THEME CUSTOMIZATION
        ========================================================================= */}
        {activeTab === "branding" && (
          <form onSubmit={handleSaveBranding} className="space-y-6 max-w-4xl">
            <div className="bg-[#11172a] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <h3 className="text-lg font-bold text-white">Store Identity & Theme Accent</h3>
                <p className="text-xs text-slate-400 mt-0.5">Customize your brand name, theme appearance, and official media channels.</p>
              </div>

              {/* Theme Color Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Theme Accent Color
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                  {[
                    { id: "purple" as const, label: "Royal Purple", color: "bg-purple-600" },
                    { id: "emerald" as const, label: "Emerald Green", color: "bg-emerald-600" },
                    { id: "blue" as const, label: "Electric Blue", color: "bg-blue-600" },
                    { id: "rose" as const, label: "Rose Pink", color: "bg-rose-600" },
                    { id: "amber" as const, label: "Amber Gold", color: "bg-amber-600" },
                    { id: "indigo" as const, label: "Deep Indigo", color: "bg-indigo-600" }
                  ].map((th) => (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => setBrandingForm({ ...brandingForm, themeColor: th.id })}
                      className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        brandingForm.themeColor === th.id
                          ? "border-white bg-slate-800 shadow-sm ring-2 ring-white/20"
                          : "border-slate-800 hover:border-slate-700 bg-slate-900/50"
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full ${th.color}`}></span>
                      <span className="text-[11px] font-semibold text-slate-300">{th.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Store Name & Tagline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Your Store / Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={brandingForm.storeName}
                    onChange={(e) => setBrandingForm({ ...brandingForm, storeName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs font-bold focus:ring-2 focus:ring-brand-500"
                    placeholder="e.g. Apex Digital Subscriptions"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Store Tagline / Slogan
                  </label>
                  <input
                    type="text"
                    value={brandingForm.tagline}
                    onChange={(e) => setBrandingForm({ ...brandingForm, tagline: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs font-semibold focus:ring-2 focus:ring-brand-500"
                    placeholder="e.g. Instant Delivery • 24/7 Verified Accounts"
                  />
                </div>
              </div>

              {/* Support Phone & WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Your Support WhatsApp Number *
                </label>
                <input
                  type="text"
                  required
                  value={brandingForm.phone}
                  onChange={(e) => setBrandingForm({ ...brandingForm, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs font-bold focus:ring-2 focus:ring-brand-500"
                  placeholder="e.g. 0321-1234567"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Customers who purchase your products will automatically send payment proof to this WhatsApp number.
                </span>
              </div>

              {/* Media Channels */}
              <div className="border-t border-slate-800 pt-5 space-y-4">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Your Official Media Channels (Links)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">YouTube Channel URL</label>
                    <input
                      type="url"
                      value={brandingForm.youtubeUrl}
                      onChange={(e) => setBrandingForm({ ...brandingForm, youtubeUrl: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs"
                      placeholder="https://youtube.com/@yourchannel"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Instagram URL</label>
                    <input
                      type="url"
                      value={brandingForm.instagramUrl}
                      onChange={(e) => setBrandingForm({ ...brandingForm, instagramUrl: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs"
                      placeholder="https://instagram.com/yourhandle"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer transition-transform hover:scale-102"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Brand Settings</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* =========================================================================
            TAB 2: PAYMENT ACCOUNTS CONFIGURATION
        ========================================================================= */}
        {activeTab === "payments" && (
          <form onSubmit={handleSaveBranding} className="space-y-6 max-w-4xl">
            <div className="bg-[#11172a] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <h3 className="text-lg font-bold text-white">Your Payment Receiving Accounts</h3>
                <p className="text-xs text-slate-400 mt-0.5">When customers order your products, money will go directly to these accounts.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* JazzCash */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">JazzCash Account</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Mobile Account</span>
                  </div>
                  <input
                    type="text"
                    placeholder="JazzCash Mobile Number (e.g. 03001234567)"
                    value={brandingForm.jazzCashNumber}
                    onChange={(e) => setBrandingForm({ ...brandingForm, jazzCashNumber: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-mono"
                  />
                  <input
                    type="text"
                    placeholder="Account Title (e.g. Muhammad Usman)"
                    value={brandingForm.jazzCashTitle}
                    onChange={(e) => setBrandingForm({ ...brandingForm, jazzCashTitle: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-bold"
                  />
                </div>

                {/* Easypaisa */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">Easypaisa Account</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Mobile Account</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Easypaisa Mobile Number (e.g. 03451234567)"
                    value={brandingForm.easypaisaNumber}
                    onChange={(e) => setBrandingForm({ ...brandingForm, easypaisaNumber: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-mono"
                  />
                  <input
                    type="text"
                    placeholder="Account Title (e.g. Muhammad Usman)"
                    value={brandingForm.easypaisaTitle}
                    onChange={(e) => setBrandingForm({ ...brandingForm, easypaisaTitle: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-bold"
                  />
                </div>
              </div>

              {/* Bank Account */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-blue-400 block">Bank Transfer (Optional)</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Bank Name (e.g. Meezan Bank)"
                    value={brandingForm.bankName}
                    onChange={(e) => setBrandingForm({ ...brandingForm, bankName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Account Title"
                    value={brandingForm.bankAccountTitle}
                    onChange={(e) => setBrandingForm({ ...brandingForm, bankAccountTitle: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Account / IBAN Number"
                    value={brandingForm.bankAccountNumber}
                    onChange={(e) => setBrandingForm({ ...brandingForm, bankAccountNumber: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer transition-transform hover:scale-102"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Payment Accounts</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* =========================================================================
            TAB 3: MY STOCK & PRODUCTS
        ========================================================================= */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">Your Products & Stock</h3>
                <p className="text-xs text-slate-400">Items listed here are published on the website store with your payment accounts.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({
                    name: "",
                    category: "ENTERTAINMENT",
                    typeBadge: "1 Month • Private",
                    warrantyBadge: "28-day replacement warranty",
                    pricePKR: 350,
                    inStock: true,
                    description: "",
                    iconType: "prime"
                  });
                  setIsProductModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Product to Store</span>
              </button>
            </div>

            {partnerProducts.length === 0 ? (
              <div className="bg-[#11172a] border border-slate-800 rounded-3xl p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                  <Package className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">No products added yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click the button above to publish your first subscription or app account. It will show your WhatsApp and your payment accounts!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {partnerProducts.map((p) => (
                  <div key={p.id} className="bg-[#11172a] border border-slate-800 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {p.category}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.inStock ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                      }`}>
                        {p.inStock ? "● In Stock" : "Out of Stock"}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white">{p.name}</h4>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{p.typeBadge} • {p.warrantyBadge}</span>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
                      <div>
                        <span className="text-base font-black text-brand-400">Rs {p.pricePKR}</span>
                        <span className="text-[10px] text-slate-500 ml-1">(${p.priceUSD})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProduct(p);
                            setProductForm({
                              name: p.name,
                              category: p.category,
                              typeBadge: p.typeBadge,
                              warrantyBadge: p.warrantyBadge || "28-day warranty",
                              pricePKR: p.pricePKR,
                              inStock: p.inStock,
                              description: p.description,
                              iconType: p.iconType || "prime"
                            });
                            setIsProductModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 4: MY CUSTOMER ORDERS
        ========================================================================= */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Your Orders & Fulfillments</h3>
              <p className="text-xs text-slate-400">Only orders for your products show here. Verify the TID/slip and deliver credentials.</p>
            </div>

            {partnerOrders.length === 0 ? (
              <div className="bg-[#11172a] border border-slate-800 rounded-3xl p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">No customer orders yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  When clients buy your products, their orders and payment receipts will appear here immediately.
                </p>
              </div>
            ) : (
              <div className="bg-[#11172a] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/60 border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                      <tr>
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Customer Contact</th>
                        <th className="p-4">Product</th>
                        <th className="p-4">Payment & TID</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {partnerOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-4 font-mono font-bold text-white">{o.id}</td>
                          <td className="p-4">
                            <span className="font-bold text-white block">{o.customer}</span>
                            {o.customerPhone && <span className="text-[11px] text-slate-400">{o.customerPhone}</span>}
                          </td>
                          <td className="p-4 font-bold text-white">{o.product}</td>
                          <td className="p-4 space-y-1">
                            <span className="text-slate-400 block text-[11px]">{o.paymentMethod || "Account"}</span>
                            {o.tid && (
                              <span className="text-[10px] font-mono text-brand-400 bg-brand-500/10 px-1.5 py-0.5 rounded border border-brand-500/20 font-bold block w-fit">
                                TID: {o.tid}
                              </span>
                            )}
                            {o.screenshotUrl && (
                              <button
                                type="button"
                                onClick={() => setViewingSlipUrl(o.screenshotUrl || null)}
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 hover:text-emerald-300"
                              >
                                <ImageIcon className="w-3 h-3" />
                                <span>View Slip SS 👁️</span>
                              </button>
                            )}
                          </td>
                          <td className="p-4 font-black text-white">{o.amount}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              o.status === "Delivered & Active"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            }`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            {o.status !== "Delivered & Active" ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setDeliveryModalOrder(o);
                                  setDeliveryCredentials(o.deliveredCredentials || "");
                                  setDeliveryNote("Thank you for your order! Here are your activation credentials.");
                                }}
                                className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs"
                              >
                                Deliver Account
                              </button>
                            ) : (
                              <span className="text-[11px] text-emerald-400 font-bold">✓ Delivered</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Deliver Account Credentials Modal */}
      {deliveryModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#11172a] border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Deliver Credentials for #{deliveryModalOrder.id}</h3>
              <button onClick={() => setDeliveryModalOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmDelivery} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Login Credentials (Email / Password / PIN / Link) *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Email: netflixuser@gmail.com&#10;Password: Pass123!&#10;Profile PIN: 4018"
                  value={deliveryCredentials}
                  onChange={(e) => setDeliveryCredentials(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs font-mono"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Customer Note / Warranty Terms</label>
                <input
                  type="text"
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs"
                  placeholder="e.g. Do not change email/password. Includes full warranty."
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryModalOrder(null)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                >
                  Confirm & Deliver to Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#11172a] border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl my-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingProduct ? `Edit "${editingProduct.name}"` : "+ Add Product to Store"}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Product / App Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CapCut Pro or Netflix 4K"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white font-semibold"
                  >
                    <option value="ENTERTAINMENT">Entertainment</option>
                    <option value="DESIGN & EDIT">Design & Edit</option>
                    <option value="VPN">VPN</option>
                    <option value="AI & PRODUCTIVITY">AI & Productivity</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Customer Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    placeholder="e.g. 450"
                    value={productForm.pricePKR}
                    onChange={(e) => setProductForm({ ...productForm, pricePKR: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Duration / Badge</label>
                  <input
                    type="text"
                    placeholder="e.g. 1 Month • Private Screen"
                    value={productForm.typeBadge}
                    onChange={(e) => setProductForm({ ...productForm, typeBadge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Warranty Badge</label>
                  <input
                    type="text"
                    placeholder="e.g. 28-day warranty"
                    value={productForm.warrantyBadge}
                    onChange={(e) => setProductForm({ ...productForm, warrantyBadge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Description / Perks</label>
                <textarea
                  rows={2}
                  placeholder="Key features, device limits, terms..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="partner-instock"
                  checked={productForm.inStock}
                  onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                  className="rounded text-brand-500"
                />
                <label htmlFor="partner-instock" className="font-bold text-slate-300 cursor-pointer">
                  Product is In Stock & Available for Order
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold"
                >
                  {editingProduct ? "Save Changes" : "Publish to Store"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Slip Screenshot Preview Modal */}
      {viewingSlipUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-slate-900 rounded-3xl p-4 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-white">Payment Receipt Proof</span>
              <button onClick={() => setViewingSlipUrl(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden max-h-[70vh] flex items-center justify-center bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={viewingSlipUrl} alt="Payment Proof" className="max-h-[70vh] w-auto object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
