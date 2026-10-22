import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-2">Legal Compliance</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-slate-400 mt-1">Last Updated: April 2026</p>
        </div>

        <div className="prose prose-slate max-w-none text-slate-600 text-xs sm:text-sm space-y-6 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">1. Overview & Scope</h2>
            <p>
              Adverty X (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates across three core divisions: Agency Services, Adverty X Academy, and Adverty X Subscriptions. This Privacy Policy outlines how we collect, store, and process personal and commercial data across our web applications.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">2. Information We Collect</h2>
            <p>We collect information provided directly by you when you:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Register an account, enroll in an Academy course, or purchase a subscription.</li>
              <li>Submit a service inquiry, website redesign audit request, or consultation form.</li>
              <li>Communicate with our team via support tickets, email, or client project portals.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">3. Zero Card Data Storage</h2>
            <p>
              Adverty X does NOT store, transmit, or process raw credit/debit card numbers on its servers. All financial transactions are processed securely through certified, PCI-DSS compliant third-party payment gateways.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">4. Third-Party Integrations & Advertising Access</h2>
            <p>
              When delivering Paid Advertising or Automation services, account permissions are granted exclusively through official platform partner delegations (e.g., Meta Business Manager, TikTok Partner Center). We never ask for or store your personal social media passwords.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">5. Data Retention & Security</h2>
            <p>
              We implement industry-standard cryptographic controls, HttpOnly SameSite cookie sessions, and server-side authorization checks to prevent unauthorized access or IDOR breaches.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
}
