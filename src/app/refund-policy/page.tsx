import React from "react";

export default function RefundPolicyPage() {
  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-2">Customer Protection</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Refund Policy</h1>
          <p className="text-xs text-slate-400 mt-1">Last Updated: April 2026</p>
        </div>

        <div className="prose prose-slate max-w-none text-slate-600 text-xs sm:text-sm space-y-6 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">1. Division-Specific Refund Standards</h2>
            <p>
              Due to the distinct nature of digital agency deliverables, educational media, and licensed software seats, refunds are governed by specific division policies:
            </p>
          </section>

          <section className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">A. Agency Services</h3>
            <p className="text-xs leading-relaxed">
              Custom design, website redesign, and automation projects require significant human labor from our senior engineering team. Deposits are non-refundable once project kickoff and wireframing begin. Revisions are provided in accordance with your contracted package.
            </p>
          </section>

          <section className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">B. Adverty X Academy Courses</h3>
            <p className="text-xs leading-relaxed">
              We offer a 7-day satisfaction review window on all courses, provided that less than 20% of the course curriculum has been watched. Once verified, refunds are processed to your original payment method, and course access is revoked.
            </p>
          </section>

          <section className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">C. Digital Tool Subscriptions</h3>
            <p className="text-xs leading-relaxed">
              For authorized third-party digital tools, refunds are permitted if the allocated credentials fail to provision within our stated SLA. Once an active license key or team seat is fulfilled and activated, subscriptions are non-refundable for that active billing cycle.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">2. How to Request a Refund</h2>
            <p>
              To initiate a refund review, open a ticket inside your Client Dashboard under <a href="/dashboard" className="text-brand-600 underline">Billing & Support</a> or email support@advertyx.com with your verified Order Reference ID.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
