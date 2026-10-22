import React from "react";

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-2">Commercial Agreement</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Terms and Conditions</h1>
          <p className="text-xs text-slate-400 mt-1">Last Updated: April 2026</p>
        </div>

        <div className="prose prose-slate max-w-none text-slate-600 text-xs sm:text-sm space-y-6 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">1. Agreement to Terms</h2>
            <p>
              By accessing or using any division of Adverty X (Agency Services, Adverty X Academy, and Adverty X Subscriptions), you agree to be bound by these Terms and Conditions. If you disagree with any part, you may not use our services.
            </p>
          </section>

          <section className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950">
            <h2 className="text-base font-bold text-amber-950 mb-1">2. Agency Services & Video Editing Policy</h2>
            <p className="text-xs leading-relaxed">
              <strong>CRITICAL NOTICE:</strong> Standard social media account management packages DO NOT include video editing by default. Clients are solely responsible for supplying their own finished videos or engaging our dedicated Video Editing Add-On as a separate, paid contract item. Video editing services are subject to specified delivery turnarounds and a cap of 2 revision rounds per asset.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">3. Adverty X Academy & Lifetime Course Access</h2>
            <p>
              Purchased courses in Adverty X Academy are provided on a one-time fixed payment model granting permanent lifetime access to the purchased curriculum. Course access is independent of tool subscriptions and will not expire upon subscription termination. Course access is non-transferable and may not be shared across multiple user accounts.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">4. Subscriptions & Billing Models</h2>
            <p>
              Adverty X Subscriptions operates under two transparent structures:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Fixed-Duration Access:</strong> Provides access for an explicit window (7, 30, 90, or 365 days). No automatic card rebilling occurs upon expiration.</li>
              <li><strong>Recurring Billing:</strong> Billed weekly, monthly, or yearly with automated renewal until explicitly cancelled by the customer in their dashboard.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">5. Client Account Security & Anti-IDOR Protections</h2>
            <p>
              You are responsible for safeguarding your account credentials. Attempting to bypass authorization barriers or access another customer&apos;s orders, courses, or projects is strictly prohibited and results in immediate account termination.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
