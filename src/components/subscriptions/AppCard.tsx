"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  Star, 
  Info, 
  Check, 
  X, 
  CheckCircle2, 
  Zap, 
  Lock,
  ArrowRight
} from "lucide-react";
import { AppSubscriptionItem } from "@/data/mockData";

export function AppLogoIcon({ type }: { type: AppSubscriptionItem["iconType"] }) {
  if (type === "capcut") {
    return (
      <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center p-2.5">
        <svg viewBox="0 0 100 100" className="w-10 h-10 fill-slate-900">
          <path d="M20,35 L40,35 L55,50 L40,65 L20,65 L35,50 Z" />
          <path d="M80,35 L60,35 L45,50 L60,65 L80,65 L65,50 Z" />
        </svg>
      </div>
    );
  }

  if (type === "netflix") {
    return (
      <div className="w-16 h-16 rounded-2xl bg-black shadow-xs flex items-center justify-center">
        <span className="text-red-600 font-black text-3xl tracking-tighter">N</span>
      </div>
    );
  }

  if (type === "youtube") {
    return (
      <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center">
        <div className="w-10 h-7 bg-red-600 rounded-lg flex items-center justify-center">
          <div className="w-0 h-0 border-y-[5px] border-y-transparent border-l-[9px] border-l-white ml-0.5"></div>
        </div>
      </div>
    );
  }

  if (type === "surfshark") {
    return (
      <div className="w-16 h-16 rounded-2xl bg-[#E6F9F7] border border-teal-200 shadow-xs flex items-center justify-center">
        <div className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center text-white font-black text-xl">
          S
        </div>
      </div>
    );
  }

  if (type === "canva") {
    return (
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-xs">
        C
      </div>
    );
  }

  if (type === "chatgpt") {
    return (
      <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-bold flex items-center justify-center shadow-xs">
        <Zap className="w-8 h-8" />
      </div>
    );
  }

  if (type === "spotify") {
    return (
      <div className="w-16 h-16 rounded-2xl bg-green-500 text-white font-bold flex items-center justify-center shadow-xs">
        <span className="text-2xl font-black">((•))</span>
      </div>
    );
  }

  if (type === "prime") {
    return (
      <div className="w-16 h-16 rounded-2xl bg-[#00A8E1] text-white shadow-xs flex flex-col items-center justify-center p-1 font-bold">
        <span className="text-[13px] font-extrabold tracking-tight leading-none text-white">prime</span>
        <span className="text-[10px] text-white/90 leading-tight">video</span>
        <div className="w-6 h-1 bg-white/80 rounded-full mt-0.5"></div>
      </div>
    );
  }

  if (type === "adobe") {
    return (
      <div className="w-16 h-16 rounded-2xl bg-red-600 text-white font-black text-2xl flex items-center justify-center shadow-xs">
        A
      </div>
    );
  }

  return (
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-xs">
      ★
    </div>
  );
}

export default function AppCard({ 
  item, 
  currency, 
  onOrder 
}: { 
  item: AppSubscriptionItem; 
  currency: "PKR" | "USD"; 
  onOrder: (item: AppSubscriptionItem) => void; 
}) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 flex flex-col justify-between hover:shadow-card transition-all duration-200 relative group">
      
      {/* Top Right Info (i) Button */}
      <button
        onClick={() => setShowInfo(!showInfo)}
        className="absolute top-4 right-4 w-7 h-7 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-600 flex items-center justify-center transition-colors z-10"
        title="View product details & fulfillment terms"
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      {/* Info Overlay Modal if clicked */}
      {showInfo && (
        <div className="absolute inset-0 bg-white/98 rounded-3xl p-5 z-20 flex flex-col justify-between animate-in fade-in duration-150 border border-brand-200 shadow-lg">
          <div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-3">
              <span className="font-bold text-xs text-slate-900">Subscription Terms</span>
              <button onClick={() => setShowInfo(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              {item.description}
            </p>
            <div className="space-y-1.5 text-[11px] text-slate-700">
              <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{item.warrantyBadge.toLowerCase().includes("warranty") ? item.warrantyBadge : `${item.warrantyBadge} replacement warranty`}</span>
              </div>
              <div className="flex items-center gap-1.5 text-brand-600 font-semibold">
                <Lock className="w-3.5 h-3.5" />
                <span>Fulfillment: {item.fulfillmentType}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowInfo(false)}
            className="w-full py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
          >
            Close Details
          </button>
        </div>
      )}

      {/* Top Section: App Logo + Name + Pill */}
      <div>
        <div className="flex justify-center mb-4">
          <AppLogoIcon type={item.iconType} />
        </div>

        <div className="text-center space-y-1.5 mb-3">
          <h3 className="font-bold text-slate-900 text-base leading-snug">
            {item.name}
          </h3>
          <span className="inline-block text-[11px] font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {item.typeBadge}
          </span>
        </div>

        {/* Warranty Badge */}
        <div className="flex justify-center mb-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{item.warrantyBadge}</span>
          </span>
        </div>

        {/* Stars Rating */}
        <div className="flex items-center justify-center gap-1 text-amber-500 text-xs font-bold mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-slate-800 ml-1">{item.rating}</span>
          <span className="text-slate-400 font-normal">({item.reviewsCount})</span>
        </div>
      </div>

      {/* Bottom Section: Price & Order Action */}
      <div className="space-y-3 pt-2 text-center">
        <div className="text-2xl font-black text-slate-900 tracking-tight">
          {currency === "PKR" ? `Rs ${item.pricePKR.toLocaleString()}` : `$${item.priceUSD.toFixed(2)}`}
        </div>

        {item.inStock ? (
          <button
            onClick={() => onOrder(item)}
            className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow-brand-500/25"
          >
            Order Now
          </button>
        ) : (
          <button
            disabled
            className="w-full py-3 rounded-2xl bg-brand-200/70 text-brand-700 text-xs font-bold uppercase tracking-wider cursor-not-allowed opacity-90"
          >
            Out of Stock
          </button>
        )}
      </div>

    </div>
  );
}
