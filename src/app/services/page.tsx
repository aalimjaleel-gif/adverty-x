"use client";

import React from "react";
import { 
  Monitor, 
  Palette, 
  Cog, 
  Share2, 
  Megaphone, 
  Video, 
  ArrowRight, 
  Check, 
  Info, 
  ShieldCheck,
  Clock,
  Sparkles
} from "lucide-react";
import { AGENCY_SERVICES } from "@/data/mockData";

export default function ServicesPage() {
  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Header with Coming Soon Badge */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs font-bold mb-4 animate-pulse">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Official Launch Coming Soon • Pre-Booking Open</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Agency Client Services
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
            High-performance web development, business automation, and growth marketing. We are currently preparing our official public rollout — early access and pre-bookings are open today!
          </p>
        </div>

        {/* Coming Soon Announcement Callout */}
        <div className="mb-12 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-brand-500/30 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center flex-shrink-0 text-amber-300">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-bold text-white">Agency Services Are Coming Soon!</h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-400 text-slate-950">
                  Pre-Launch
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                We are finalizing our dedicated delivery pipelines to deliver unbeatable turnaround times. Need a custom project or want to be first in line? Talk to our founders directly on WhatsApp.
              </p>
            </div>
          </div>
          <a
            href="https://wa.me/255613735391?text=Assalam%20o%20Alaikum!%20I%20am%20interested%20in%20pre-booking%20an%20Adverty%20X%20Agency%20Service."
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 flex-shrink-0"
          >
            <span>Pre-Book on WhatsApp</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* 6 Large Service Cards (2 Columns x 3 Rows) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {AGENCY_SERVICES.map((service) => {
            const IconComponent = 
              service.id === "serv-1" ? Monitor :
              service.id === "serv-2" ? Palette :
              service.id === "serv-3" ? Cog :
              service.id === "serv-4" ? Share2 :
              service.id === "serv-5" ? Megaphone : Video;

            const waLink = `https://wa.me/255613735391?text=Assalam%20o%20Alaikum!%20I%20want%20to%20pre-book%20the%20${encodeURIComponent(service.title)}%20service.`;

            return (
              <div
                key={service.id}
                className="flex flex-col justify-between bg-white rounded-3xl p-7 border border-slate-200 transition-all duration-200 hover:shadow-card hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Coming Soon Top Ribbon */}
                <div className="absolute top-4 right-4">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Coming Soon</span>
                  </span>
                </div>

                <div>
                  <div className="flex items-start mb-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      service.color === "purple" ? "bg-purple-50 text-purple-600" :
                      service.color === "cyan" ? "bg-cyan-50 text-cyan-600" :
                      service.color === "blue" ? "bg-blue-50 text-blue-600" :
                      service.color === "pink" ? "bg-pink-50 text-pink-600" :
                      service.color === "rose" ? "bg-rose-50 text-rose-600" : "bg-purple-50 text-purple-600"
                    }`}>
                      <IconComponent className="w-7 h-7" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed mb-6">{service.fullDesc}</p>

                  <div className="space-y-2 mb-8">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Planned Deliverables
                    </span>
                    {service.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Estimated Pricing</span>
                      <span className="text-xl font-extrabold text-slate-900">${service.startingPrice}</span>
                    </div>

                    <a
                      href={`/services/${service.slug}`}
                      className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <a
                    href={waLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-black text-xs transition-all shadow-xs flex items-center justify-center gap-2"
                  >
                    <span>Coming Soon • Pre-Book on WhatsApp</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-slate-50 border border-slate-200 rounded-3xl p-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold mb-3">
            <span>Early Access Waitlist</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Need a Custom Agency Solution Today?</h3>
          <p className="text-slate-600 text-sm mb-6 max-w-xl mx-auto">
            While official automated checkout is coming soon, we are actively taking select high-growth projects manually.
          </p>
          <a
            href="https://wa.me/255613735391?text=Assalam%20o%20Alaikum!%20I%20have%20a%20custom%20agency%20project%20inquiry."
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs inline-flex items-center gap-2 shadow-sm"
          >
            <span>Request Custom Consultation via WhatsApp</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
}
