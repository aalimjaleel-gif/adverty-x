"use client";

import React, { useEffect } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Adverty X Application Error:", error);
  }, [error]);

  return (
    <div className="bg-white min-h-[70vh] flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-2xl font-black border border-rose-200">
          <AlertCircle className="w-8 h-8" />
        </div>
        
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Something Went Wrong</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            An unexpected error occurred while loading this view. Our engineering team has been notified.
          </p>
        </div>

        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <a
            href="/"
            className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Homepage</span>
          </a>
        </div>
      </div>
    </div>
  );
}
