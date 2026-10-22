"use client";

import React, { useState, useEffect } from "react";
import { 
  GraduationCap, 
  Search, 
  Star, 
  Clock, 
  BookOpen, 
  ArrowRight, 
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Download
} from "lucide-react";
import { getStoredCourses, fetchCoursesFromServer } from "@/lib/store";
import { ACADEMY_COURSES, CourseItem } from "@/data/mockData";

export default function AcademyPage() {
  const [courses, setCourses] = useState<CourseItem[]>(ACADEMY_COURSES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    // 1. Load locally stored courses immediately
    const initial = getStoredCourses();
    if (initial && initial.length > 0) {
      setCourses(initial);
    }

    // 2. Fetch from server API so any course added on PC shows up right away
    fetchCoursesFromServer().then((serverList) => {
      if (serverList && serverList.length > 0) {
        setCourses(serverList);
      }
    });

    // 3. Listen to local events
    const handleUpdate = () => {
      setCourses(getStoredCourses());
    };
    window.addEventListener("advertyx_courses_updated", handleUpdate);
    return () => window.removeEventListener("advertyx_courses_updated", handleUpdate);
  }, []);

  const categories = ["All", "Free Courses", "Marketing", "Development", "Design", "Business"];

  const filteredCourses = (courses || []).filter((course) => {
    if (!course) return false;
    const title = (course.title || "").toLowerCase();
    const desc = (course.description || "").toLowerCase();
    const query = (searchQuery || "").trim().toLowerCase();
    const matchesSearch = !query || title.includes(query) || desc.includes(query);
    
    let matchesCategory = true;
    if (selectedCategory === "Free Courses") {
      matchesCategory = !!course.isFree || (course.price === 0);
    } else if (selectedCategory !== "All") {
      matchesCategory = (course.category || "").toLowerCase() === selectedCategory.toLowerCase();
    }

    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    const priceA = Number(a.price) || 0;
    const priceB = Number(b.price) || 0;
    const ratingA = Number(a.rating) || 5;
    const ratingB = Number(b.rating) || 5;
    const reviewsA = Number(a.reviewsCount) || 0;
    const reviewsB = Number(b.reviewsCount) || 0;

    if (sortBy === "price-low") return priceA - priceB;
    if (sortBy === "price-high") return priceB - priceA;
    if (sortBy === "rating") return ratingB - ratingA;
    return reviewsB - reviewsA;
  });

  return (
    <div className="bg-slate-50/60 min-h-screen py-12 lg:py-16">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Hero Section */}
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-[#0f172a] to-[#1e1b4b] p-5 sm:p-10 lg:p-16 text-white overflow-hidden shadow-2xl border border-slate-800 mb-8 lg:mb-12">
          {/* Ambient Lighting Gradients */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4 sm:space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-brand-300 text-[11px] sm:text-xs font-bold tracking-wide">
                <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-400" />
                <span>Adverty X Academy</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-emerald-400 font-extrabold">Instant Web Classroom</span>
              </div>
              <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-snug sm:leading-tight">
                Master Modern Skills. <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-300 to-pink-400">
                  Build Real Businesses.
                </span>
              </h1>
              <p className="text-slate-300 text-xs sm:text-base leading-relaxed max-w-2xl font-normal">
                Hands-on video masterclasses taught by active digital practitioners. Every course includes <strong className="text-white font-semibold">Lecture 1 Free Preview</strong>, in-browser streaming player, and <strong className="text-white font-semibold">permanent lifetime access</strong> with JazzCash & OPay transfers.
              </p>

              {/* Social Proof & Feature Badges */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1 text-[11px] sm:text-xs font-semibold text-slate-300">
                <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                  <span>Zero Recurring Fees</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Lifetime Access</span>
                </div>
              </div>
            </div>

            {/* Right Banner Card (Hidden on mobile to save vertical space) */}
            <div className="hidden lg:block lg:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white text-center space-y-4 border border-white/15 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/30 border border-brand-400/40 text-brand-300 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-brand-300 block mb-1">
                  Adverty X Classroom Player
                </span>
                <h3 className="text-xl font-black text-white">Stream Videos In-Browser</h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  No downloads needed. Watch lectures directly in HD with full progress tracking on phone or PC.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>All Courses: Lecture 1 Free Preview</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lifetime Access & Free Courses Rule Callout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 flex items-center gap-3 text-xs text-indigo-950 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <span>
              <strong>Lifetime Access Policy:</strong> When you enroll in any course, it is unlocked permanently on your account.
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-center gap-3 text-xs text-emerald-950 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>
              <strong>100% Free Courses Available:</strong> Explore our free crash courses with complete video lessons without spending a rupee.
            </span>
          </div>
        </div>

        {/* Search, Filter & Sort Controls */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-5 shadow-xs mb-8">
          <div className="flex flex-col gap-3">
            
            {/* Search Input */}
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by course title or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Filter Pills & Sort Dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  const isFreeTab = cat === "Free Courses";
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                        isSelected
                          ? isFreeTab 
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "bg-brand-600 text-white shadow-sm"
                          : isFreeTab
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {isFreeTab && "🎁 "}
                      {cat}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0">
                <span className="text-[11px] text-slate-400 font-medium sm:hidden">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>


        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">
          {filteredCourses.length === 0 ? (
            <div className="col-span-full py-16 px-6 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3.5">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {courses.length === 0 ? "No Masterclasses Published Yet" : "No courses match your filter"}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5 leading-relaxed">
                {courses.length === 0 
                  ? "Our instructors are currently developing new practical video masterclasses. Check back shortly!" 
                  : "We couldn't find any courses matching your current search or category. Try clearing your filters."}
              </p>
              {courses.length > 0 && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-all shadow-md hover:scale-105 active:scale-95"
                >
                  Clear Filters & View All
                </button>
              )}
            </div>
          ) : (
            filteredCourses.map((course) => {
              const isFree = course.isFree || course.price === 0;

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-200 flex flex-col justify-between group"
                >
                  {/* Card Banner / Thumbnail */}
                  <div className="h-48 relative overflow-hidden bg-slate-900">
                    {course.thumbnailUrl ? (
                      <img 
                        src={course.thumbnailUrl} 
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-75"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-slate-950 via-indigo-950 to-brand-950"></div>
                    )}

                    {/* Gradient overlay for clear text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4 flex flex-col justify-between">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-black/60 text-white backdrop-blur-md border border-white/10">
                          {course.category}
                        </span>
                        {isFree ? (
                          <span className="text-[11px] font-black px-2.5 py-1 rounded-lg bg-emerald-500 text-white shadow-md uppercase tracking-wider">
                            100% FREE
                          </span>
                        ) : (
                          <span className="text-xs text-white/90 font-medium flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                            <Clock className="w-3 h-3 text-slate-300" />
                            <span>{course.duration}</span>
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] text-brand-300 font-bold uppercase tracking-wider block">
                          {course.level} Level
                        </span>
                        <h3 className="text-base font-bold text-white line-clamp-2 drop-shadow-sm mt-0.5">
                          {course.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5">
                        <span className="truncate max-w-[140px] font-medium text-slate-600">{course.instructor}</span>
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          <span>{course.rating}</span>
                          <span className="text-slate-400 font-normal">({course.reviewsCount})</span>
                        </div>
                      </div>

                      <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                        {course.description}
                      </p>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mt-3.5 pt-3 border-t border-slate-100 flex-wrap">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                          <span>{course.lessonsCount} Masterclasses</span>
                        </span>
                        <span className="text-slate-300">•</span>
                        {!isFree && (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                            🎁 Lecture 1 Free
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">
                          {isFree ? "Enrollment Fee" : "One-Time Lifetime Fee"}
                        </span>
                        {isFree ? (
                          <span className="text-2xl font-black text-emerald-600">FREE</span>
                        ) : (
                          <div className="flex flex-col">
                            <span className="text-2xl font-black text-slate-900 leading-tight">${course.price}</span>
                            <span className="text-[11px] font-bold text-slate-500 font-mono">
                              ≈ Rs {(course.price * 278).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>

                      <a
                        href={`/academy/${course.slug}`}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 ${
                          isFree 
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20" 
                            : "bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-brand-500/25"
                        }`}
                      >
                        <span>{isFree ? "Start Free" : "Preview & Enroll"}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
