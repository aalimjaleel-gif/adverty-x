"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowRight, 
  Monitor, 
  Palette, 
  Cog, 
  Share2, 
  Megaphone, 
  Video, 
  Sparkles, 
  GraduationCap, 
  CheckCircle2, 
  Star, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  ChevronDown,
  Layers,
  Zap,
  Award,
  Users,
  Smartphone,
  Check
} from "lucide-react";
import { 
  AGENCY_SERVICES, 
  CourseItem,
  ACADEMY_COURSES,
  APP_SUBSCRIPTIONS,
  CASE_STUDIES, 
  FAQS 
} from "@/data/mockData";
import { getStoredCourses, fetchCoursesFromServer } from "@/lib/store";

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [courses, setCourses] = useState<CourseItem[]>(ACADEMY_COURSES);

  useEffect(() => {
    const initial = getStoredCourses();
    if (initial && initial.length > 0) setCourses(initial);
    fetchCoursesFromServer().then(list => {
      if (list && list.length > 0) setCourses(list);
    });
    const handleUpdate = () => setCourses(getStoredCourses());
    window.addEventListener("advertyx_courses_updated", handleUpdate);
    return () => window.removeEventListener("advertyx_courses_updated", handleUpdate);
  }, []);

  return (
    <div className="flex flex-col w-full overflow-hidden bg-white">
      
      {/* =========================================================================
          HERO SECTION (Matches Top-Left of Reference Preview)
      ========================================================================= */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 bg-gradient-to-b from-white via-brand-50/20 to-white border-b border-slate-100">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Category Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/70 text-brand-700 text-xs font-semibold tracking-wide shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-pulse"></span>
                <span>Digital Agency</span>
                <span className="text-brand-300">•</span>
                <span>Academy</span>
                <span className="text-brand-300">•</span>
                <span>Subscriptions</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.18] sm:leading-[1.12]">
                Build Your Brand. <span className="hidden sm:inline"><br /></span>
                Grow Your Business. <span className="hidden sm:inline"><br /></span>
                With <span className="text-gradient">Adverty X.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                We provide modern digital solutions including web development, automation, social media management, paid ads, courses, and premium subscriptions — all in one place.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 w-full sm:w-auto">
                <a
                  href="/services"
                  className="w-full sm:w-auto text-center justify-center px-6 py-3.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 rounded-xl shadow-sm hover:shadow-brand-500/25 transition-all flex items-center gap-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="/services"
                  className="w-full sm:w-auto text-center justify-center px-6 py-3.5 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-xs"
                >
                  <span>Explore Services</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Verified Agency Standard</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Transparent Add-On Pricing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Lifetime Course Access</span>
                </div>
              </div>

            </div>

            {/* Hero Right Visual (Mockup with Floating Analytics) */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md lg:max-w-none">
                
                {/* Background Ambient Glow */}
                <div className="absolute -inset-4 bg-gradient-to-r from-brand-500/10 to-indigo-500/10 rounded-3xl blur-2xl -z-10"></div>

                {/* Laptop Graphic Mockup */}
                <div className="relative bg-slate-900 rounded-2xl p-3 shadow-2xl border border-slate-800">
                  <div className="flex items-center gap-1.5 mb-2 px-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <div className="mx-auto text-[10px] text-slate-400 font-mono">advertyx.com/dashboard</div>
                  </div>

                  <div className="bg-slate-950/90 backdrop-blur-md rounded-xl p-4 sm:p-5 space-y-4 border border-slate-800 text-white shadow-inner">
                    <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
                      <div>
                        <div className="text-[11px] text-slate-400 font-medium">Agency Client Revenue</div>
                        <div className="text-xl sm:text-2xl font-black text-white tracking-tight">$24,850.00</div>
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        +24.5% Growth
                      </span>
                    </div>

                    {/* High-Fidelity SVG Curve Chart with Glow */}
                    <div className="relative h-28 w-full bg-gradient-to-b from-brand-900/20 to-transparent rounded-lg p-2 overflow-hidden border border-slate-800/60">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.45" />
                            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0" />
                          </linearGradient>
                          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#818CF8" />
                            <stop offset="50%" stopColor="#8B5CF6" />
                            <stop offset="100%" stopColor="#EC4899" />
                          </linearGradient>
                        </defs>
                        {/* Area Fill */}
                        <path
                          d="M0,80 Q30,65 60,70 T120,40 T180,50 T240,25 T300,10 L300,100 L0,100 Z"
                          fill="url(#chartGradient)"
                        />
                        {/* Smooth Line */}
                        <path
                          d="M0,80 Q30,65 60,70 T120,40 T180,50 T240,25 T300,10"
                          fill="none"
                          stroke="url(#lineGradient)"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                      {/* Floating Data Point */}
                      <div className="absolute top-3 right-6 bg-brand-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-md animate-pulse">
                        Peak: $24.8k
                      </div>
                    </div>

                    {/* Live Performance Metrics Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">Lead Conversion</span>
                          <span className="font-extrabold text-emerald-400 text-xs">14.8% (Target: 10%)</span>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                      </div>
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">Meta & TikTok Ads</span>
                          <span className="font-extrabold text-indigo-300 text-xs">4.8x Active ROAS</span>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-brand-400"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Metric Badge - Hidden on small mobile screens to prevent screen overflow */}
                <div className="hidden sm:flex absolute -top-6 -left-6 bg-white rounded-xl p-3 shadow-float border border-slate-100 items-center gap-3 animate-bounce duration-1000">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Brand Growth</div>
                    <div className="text-sm font-bold text-emerald-600">+256% Clients</div>
                  </div>
                </div>

                {/* Floating Mobile Phone Preview */}
                <div className="hidden sm:block absolute -bottom-6 -right-6 w-32 bg-slate-950 p-1.5 rounded-2xl shadow-float border border-slate-800">
                  <div className="bg-white rounded-xl p-2 text-[8px] space-y-1">
                    <div className="w-8 h-1 bg-slate-200 rounded-full mx-auto mb-1"></div>
                    <div className="font-bold text-slate-900">Adverty X Mobile</div>
                    <div className="p-1 rounded bg-brand-50 text-brand-700 font-semibold">Active Projects: 3</div>
                    <div className="h-6 bg-slate-100 rounded"></div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURE ROW PILLS (Matches Hero Sub-strip in Reference Preview)
      ========================================================================= */}
      <section className="py-8 bg-white border-b border-slate-100">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { title: "Web Development", desc: "Modern & responsive websites", icon: Monitor, href: "/services/website-design" },
              { title: "Automation", desc: "Save time, work smarter", icon: Cog, href: "/services/automation" },
              { title: "Social Media", desc: "Grow your online presence", icon: Share2, href: "/services/social-media-management" },
              { title: "Paid Advertising", desc: "Get more leads & sales", icon: Megaphone, href: "/services/paid-advertising" },
              { title: "Courses", desc: "Learn new skills", icon: GraduationCap, href: "/academy" },
              { title: "Subscriptions", desc: "Premium digital tools", icon: Sparkles, href: "/subscriptions" },
            ].map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className="flex flex-col items-center text-center p-3.5 rounded-xl border border-slate-100 hover:border-brand-200 hover:bg-brand-50/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-brand-50 text-slate-700 group-hover:text-brand-600 flex items-center justify-center mb-2 transition-colors">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                  {item.title}
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  {item.desc}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          OUR SERVICES SECTION (Matches Section 2 & Top-Middle of Reference Preview)
      ========================================================================= */}
      <section className="py-16 md:py-24 bg-slate-50/50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600 block">
                  WHAT WE DO
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span>Coming Soon • Pre-Booking Open</span>
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Our Agency Services
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl">
                We offer a complete range of digital services to help your business grow and succeed online. Launching soon with full delivery pipelines.
              </p>
            </div>

            <a
              href="/services"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700"
            >
              <span>View All Services</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* 6 Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AGENCY_SERVICES.map((service) => {
              const IconComponent = 
                service.id === "serv-1" ? Monitor :
                service.id === "serv-2" ? Palette :
                service.id === "serv-3" ? Cog :
                service.id === "serv-4" ? Share2 :
                service.id === "serv-5" ? Megaphone : Video;

              return (
                <div
                  key={service.id}
                  className={`relative flex flex-col justify-between bg-white rounded-2xl p-6 sm:p-7 border transition-all duration-200 hover:shadow-card hover:-translate-y-1 ${
                    service.isAddon 
                      ? "border-brand-200/90 ring-1 ring-brand-100" 
                      : "border-slate-200/80"
                  }`}
                >
                  {/* Top Badges */}
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      service.color === "purple" ? "bg-purple-50 text-purple-600" :
                      service.color === "cyan" ? "bg-cyan-50 text-cyan-600" :
                      service.color === "blue" ? "bg-blue-50 text-blue-600" :
                      service.color === "pink" ? "bg-pink-50 text-pink-600" :
                      service.color === "rose" ? "bg-rose-50 text-rose-600" : "bg-purple-50 text-purple-600"
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1 shadow-2xs">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Coming Soon</span>
                      </span>
                      {service.isAddon ? (
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-100 text-brand-700">
                          Paid Add-on
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-5">
                      {service.shortDesc}
                    </p>

                    {/* Add-on Notice if applicable */}
                    {service.addonNotice && (
                      <div className="mb-4 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                        {service.addonNotice}
                      </div>
                    )}

                    {/* Deliverables snippet */}
                    <ul className="space-y-2 mb-6">
                      {service.deliverables.slice(0, 4).map((d, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                          <Check className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Availability</span>
                      <span className="text-xs font-black text-amber-700 uppercase tracking-wide bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80 inline-flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>Pre-Booking</span>
                      </span>
                    </div>

                    <a
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-brand-600 bg-slate-100 hover:bg-brand-50 px-3.5 py-2 rounded-xl transition-all group"
                    >
                      <span>Explore Service</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          ADVERTY X ACADEMY SHOWCASE (Matches Top-Right-Middle in Reference Preview)
      ========================================================================= */}
      <section className="py-16 md:py-24 bg-white border-t border-slate-100">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-3">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Adverty X Academy</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Learn. Build. Grow.
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl">
                Get access to expert-led courses and learn in-demand skills at your own pace. All courses include <strong className="text-slate-900">guaranteed lifetime access</strong>.
              </p>
            </div>

            <a
              href="/academy"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700"
            >
              <span>Explore All Courses</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Course Cards Grid or Coming Soon Banner */}
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.slice(0, 3).map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-card hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
                >
                  {/* Course Banner Mock */}
                  <div className="h-44 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 p-5 flex flex-col justify-between text-white relative">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white/20 backdrop-blur-sm">
                        {course.category}
                      </span>
                      <span className="text-xs text-slate-300">{course.duration}</span>
                    </div>
                    
                    <div>
                      <span className="text-xs text-brand-300 font-semibold uppercase tracking-wider block">
                        Lifetime Access
                      </span>
                      <h4 className="text-lg font-bold text-white line-clamp-1">{course.title}</h4>
                    </div>
                  </div>

                  {/* Course Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                        <span>Instructor: {course.instructor}</span>
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          <span>{course.rating}</span>
                          <span className="text-slate-400 font-normal">({course.reviewsCount})</span>
                        </div>
                      </div>

                      <p className="text-slate-600 text-xs leading-relaxed mb-4 line-clamp-2">
                        {course.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 block font-medium">One-Time Fee</span>
                        <span className="text-xl font-extrabold text-slate-900">${course.price}</span>
                      </div>

                      <a
                        href={`/academy/${course.slug}`}
                        className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-brand-600 text-white text-xs font-semibold transition-colors"
                      >
                        View Course
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-2 max-w-xl text-left">
                <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold border border-brand-500/30">
                  New Courses in Production
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Practical Digital Skills Masterclasses
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  High-converting video courses with lifetime in-browser streaming and direct instructor mentorship.
                </p>
              </div>
              <a
                href="/academy"
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-black text-xs uppercase tracking-wider shadow-lg flex-shrink-0 transition-all hover:scale-105"
              >
                Explore Academy Catalog →
              </a>
            </div>
          )}

        </div>
      </section>

      {/* =========================================================================
          ADVERTY X APP SUBSCRIPTIONS SHOWCASE (Matches User Screenshot 1)
      ========================================================================= */}
      <section className="py-16 md:py-24 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Adverty X Subscriptions</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Premium App Subscriptions & Accounts
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl">
                Verified digital subscriptions, private profiles, and warranty-backed licenses for CapCut Pro, Netflix 4K, YouTube Premium, Surfshark VPN, Canva Pro, and ChatGPT Plus.
              </p>
            </div>

            <a
              href="/subscriptions"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700"
            >
              <span>View All App Subscriptions</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* 4 Featured App Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                name: "Capcut Pro (Mobile)",
                desc: "1 Month • Private",
                warranty: "28-day warranty",
                rating: "4.8 (5078)",
                price: "Rs 450",
                type: "capcut",
                inStock: true,
              },
              {
                name: "Netflix Premium (4K)",
                desc: "1 Month • Private Screen",
                warranty: "25-day warranty",
                rating: "4.7 (815)",
                price: "Rs 300",
                type: "netflix",
                inStock: true,
              },
              {
                name: "YouTube Premium",
                desc: "1 Month • Customer Gmail",
                warranty: "30-day warranty",
                rating: "4.8 (22)",
                price: "Rs 300",
                type: "youtube",
                inStock: true,
              },
              {
                name: "Surfshark VPN",
                desc: "1 Month • User Login",
                warranty: "30-day warranty",
                rating: "4.6 (522)",
                price: "Rs 250",
                type: "surfshark",
                inStock: true,
              },
            ].map((app, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-card transition-all text-center"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 mx-auto flex items-center justify-center font-black text-xl text-slate-900 mb-3">
                    {app.type === "netflix" ? <span className="text-red-600 font-black">N</span> :
                     app.type === "youtube" ? <span className="text-red-600 font-black">▶</span> :
                     app.type === "surfshark" ? <span className="text-teal-500 font-black">S</span> :
                     <span className="text-slate-900 font-black">✂</span>}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">{app.name}</h3>
                  <span className="inline-block text-[10px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full mb-2">
                    {app.desc}
                  </span>
                  <div className="text-[11px] font-bold text-emerald-600 mb-2">
                    🛡️ {app.warranty}
                  </div>
                  <div className="text-amber-500 text-xs font-bold mb-4">
                    ★★★★★ <span className="text-slate-700">{app.rating}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="text-xl font-black text-slate-900 mb-3">{app.price}</div>
                  <a
                    href="/subscriptions"
                    className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold block"
                  >
                    Order Now
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          FAQ ACCORDION SECTION
      ========================================================================= */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-600 mb-2 block">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Clear Answers to Common Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div 
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex justify-between items-center bg-white hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === idx ? "rotate-180 text-brand-600" : ""}`} />
                </button>

                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          CALL TO ACTION (Matches Bottom-Right CTA Banner in Reference Preview)
      ========================================================================= */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl text-center md:text-left z-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Ready to Start Your Project?
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Let&apos;s turn your ideas into reality. Get in touch with our team today and take your business to the next level.
              </p>
            </div>

            <div className="flex items-center gap-4 z-10">
              <a
                href="/contact"
                className="px-7 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg hover:shadow-brand-500/25 transition-all"
              >
                Get Started
              </a>
              <a
                href="/services"
                className="px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-sm transition-colors"
              >
                Explore Services
              </a>
            </div>

            {/* Subtle glow circle */}
            <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>
          </div>
        </div>
      </section>

    </div>
  );
}
