"use client";

import React, { useState } from "react";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-sm font-bold text-xl">
              X
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Adverty <span className="text-brand-600">X</span>
            </span>
          </a>
          <h1 className="text-2xl font-bold text-slate-900">Reset Password</h1>
          <p className="text-xs text-slate-500 mt-1">Enter your registered email address and we will send you a password recovery link.</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-card space-y-6">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Recovery Link Sent</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                If an account exists for <strong className="text-slate-900">{email}</strong>, we have dispatched a single-use, 15-minute password reset link.
              </p>
              <a
                href="/login"
                className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 hover:underline pt-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Login</span>
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
              >
                Send Password Reset Link
              </button>

              <div className="text-center pt-2">
                <a
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Login</span>
                </a>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
