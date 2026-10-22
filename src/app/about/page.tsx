"use client";

import React from "react";
import { ShieldCheck, Award, Users, Target, CheckCircle2, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/70 text-brand-700 text-xs font-semibold mb-3">
            <span>About Adverty X</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Empowering Growth Through Technology & Education
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
            Adverty X was founded with a singular mission: to provide high-calibre digital agency services, actionable technology education, and genuine software subscriptions under one trusted, professional ecosystem.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Agency Excellence</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We build fast, conversion-driven digital products using modern web frameworks. Every service is transparently scoped with honest deliverable definitions and zero bloated agency retainers.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Lifetime Academy</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We reject predatory recurring course subscriptions. Every course in Adverty X Academy is a one-time purchase with permanent lifetime access, ensuring students can learn and refresh their skills anytime.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Verified Subscriptions</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We exclusively offer authorized tools and licenses. Our clients enjoy both fixed-duration access (no surprise renewals) and traditional recurring models, backed by rapid fulfillment.
            </p>
          </div>
        </div>

        {/* Core Principles */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 mb-20">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-8 text-center">
            Our Core Operating Principles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white font-semibold mb-0.5">Absolute Transparency</strong>
                Deliverables, add-on policies (like our separate video editing policy), and costs are explicitly communicated before any payment is collected.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white font-semibold mb-0.5">Zero Vanity Metrics</strong>
                We focus on metrics that directly impact your bottom line: inbound leads, verified conversions, page speed, and clean code maintainability.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white font-semibold mb-0.5">Continuous Innovation</strong>
                Our agency and courses constantly evolve to incorporate the latest advancements in AI, Next.js, and automated business workflows.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white font-semibold mb-0.5">Client Accountability</strong>
                You receive direct access to your project milestones and active subscriptions via your centralized Client Dashboard.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
