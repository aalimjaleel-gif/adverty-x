"use client";

import React from "react";
import { Cog, Zap, Check, ArrowRight, MessageSquare, Database, RefreshCw } from "lucide-react";

export default function AutomationPage() {
  const automations = [
    {
      title: "Automated Lead Capture & Triage",
      desc: "Instant routing of new inquiries to your sales team with automated WhatsApp/email notifications.",
      deliverables: ["Form webhook integration", "Instant WhatsApp/SMS notification", "Automated email confirmation", "Google Sheets / Airtable syncing"],
    },
    {
      title: "CRM Pipeline Syncing",
      desc: "Synchronize client contacts, deal stages, and communications with HubSpot, Pipedrive, or Notion.",
      deliverables: ["Two-way CRM synchronization", "Deal stage auto-advancement", "Contact deduplication", "Activity logging"],
    },
    {
      title: "Customer Onboarding Sequences",
      desc: "Automate account provisioning, welcome sequences, and invoice generation upon payment receipt.",
      deliverables: ["Payment webhook trigger", "Automated invoice email", "Customer dashboard access invite", "Slack/Discord team notification"],
    },
  ];

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 mb-3">
            <a href="/services" className="hover:underline">Services</a>
            <span>/</span>
            <span className="text-slate-500">Business Automation</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs font-bold mb-4">
            <span>⏳ Coming Soon • Pre-Booking & Consultation Open</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Workflow & Business Automation
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
            Eliminate hours of manual busywork. We design and build seamless automation pipelines connecting your forms, CRMs, WhatsApp Business APIs, and databases so your operations run 24/7 without manual intervention.
          </p>
        </div>

        {/* Deliverables Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {automations.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-7 border border-slate-200 flex flex-col justify-between hover:shadow-card transition-all">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Cog className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 mb-6 leading-relaxed">{item.desc}</p>
                <div className="space-y-2 mb-6">
                  {item.deliverables.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
              <a
                href={`https://wa.me/255613735391?text=Assalam%20o%20Alaikum!%20I%20want%20to%20pre-book%20the%20Automation%20service%20(${encodeURIComponent(item.title)}).`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black text-center block transition-colors shadow-sm"
              >
                Coming Soon • Pre-Book on WhatsApp
              </a>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
