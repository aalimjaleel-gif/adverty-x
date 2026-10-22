"use client";

import React from "react";
import { ArrowLeft, Home, LifeBuoy } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-white min-h-[70vh] flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto text-2xl font-black border border-brand-200">
          404
        </div>
        
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Page Not Found</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            The page or resource you are looking for has been moved or does not exist.
          </p>
        </div>

        <div className="flex justify-center gap-3 pt-2">
          <a
            href="/"
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </a>
          <a
            href="/contact"
            className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-2"
          >
            <LifeBuoy className="w-4 h-4" />
            <span>Support</span>
          </a>
        </div>
      </div>
    </div>
  );
}
