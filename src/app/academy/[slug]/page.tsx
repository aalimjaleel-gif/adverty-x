"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { getStoredCourses, fetchCoursesFromServer, addOrder } from "@/lib/store";
import { ACADEMY_COURSES, CourseItem, LessonItem } from "@/data/mockData";
import { 
  PlayCircle, 
  Lock, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Star, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Share2,
  Copy,
  MessageCircle,
  X,
  UploadCloud,
  ThumbsUp,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Check,
  ListVideo
} from "lucide-react";

function getEmbedUrl(url?: string, category?: string, title?: string): string {
  if (url) {
    const trimmed = url.trim();
    // YouTube format
    const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`;
    }
    // Vimeo format
    const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    }
    if (trimmed.includes("embed") || trimmed.includes("player")) {
      return trimmed;
    }
    if (trimmed.endsWith(".mp4") || trimmed.endsWith(".webm")) {
      return trimmed;
    }
  }

  // Fallbacks based on category / title
  const cat = (category || "").toLowerCase();
  const t = (title || "").toLowerCase();

  if (cat.includes("design") || t.includes("canva") || t.includes("design")) {
    if (t.includes("typography") || t.includes("color")) return "https://www.youtube-nocookie.com/embed/v1y7Mh6vO3U?autoplay=1&rel=0&modestbranding=1";
    if (t.includes("carousel")) return "https://www.youtube-nocookie.com/embed/b_f4Zp1kQ4M?autoplay=1&rel=0&modestbranding=1";
    if (t.includes("thumbnail")) return "https://www.youtube-nocookie.com/embed/f1R_K2M9Wk8?autoplay=1&rel=0&modestbranding=1";
    if (t.includes("export")) return "https://www.youtube-nocookie.com/embed/M62i5k7-G4U?autoplay=1&rel=0&modestbranding=1";
    return "https://www.youtube-nocookie.com/embed/un50Mm6UdB4?autoplay=1&rel=0&modestbranding=1";
  }

  if (cat.includes("media") || cat.includes("market") || t.includes("reels") || t.includes("video") || t.includes("capcut")) {
    if (t.includes("hook") || t.includes("script")) return "https://www.youtube-nocookie.com/embed/hM39_3i2pZk?autoplay=1&rel=0&modestbranding=1";
    if (t.includes("caption") || t.includes("text")) return "https://www.youtube-nocookie.com/embed/9kX1d8pY4qE?autoplay=1&rel=0&modestbranding=1";
    if (t.includes("audio") || t.includes("sound")) return "https://www.youtube-nocookie.com/embed/Kq5k3_9zQ3s?autoplay=1&rel=0&modestbranding=1";
    return "https://www.youtube-nocookie.com/embed/4dpr4y2H_F4?autoplay=1&rel=0&modestbranding=1";
  }

  if (cat.includes("dev") || t.includes("web") || t.includes("next") || t.includes("code")) {
    if (t.includes("route") || t.includes("server")) return "https://www.youtube-nocookie.com/embed/843nec-IvW0?autoplay=1&rel=0&modestbranding=1";
    return "https://www.youtube-nocookie.com/embed/SqcY0GlETPk?autoplay=1&rel=0&modestbranding=1";
  }

  return "https://www.youtube-nocookie.com/embed/bixR-KIJKYM?autoplay=1&rel=0&modestbranding=1";
}

interface FlattenedLesson extends LessonItem {
  moduleName: string;
  globalIndex: number;
}

const FALLBACK_EMPTY_COURSE: CourseItem = {
  id: "not-found",
  slug: "not-found",
  title: "Course Catalog",
  category: "Academy",
  instructor: "Adverty X Team",
  rating: 5,
  reviewsCount: 0,
  price: 0,
  isFree: true,
  thumbnail: "course",
  thumbnailUrl: "",
  level: "All Levels",
  duration: "Self-Paced",
  lessonsCount: 0,
  description: "Browse our active masterclasses in the academy catalog.",
  curriculum: []
};

export default function CourseDetailsPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [course, setCourse] = useState<CourseItem>(() => {
    const list = getStoredCourses();
    return list.find((c) => c.slug === slug) || FALLBACK_EMPTY_COURSE;
  });

  const [activeLesson, setActiveLesson] = useState<FlattenedLesson | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(420);
  const [shareToast, setShareToast] = useState(false);

  // Enrollment Modal & Payment State
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"JazzCash" | "OPay" | "Easypaisa" | "Bank Transfer">("JazzCash");
  const [customerContact, setCustomerContact] = useState("");
  const [tid, setTid] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState<string>("");
  const [screenshotName, setScreenshotName] = useState<string>("");
  const [orderComplete, setOrderComplete] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Flatten curriculum lessons for easy linear YouTube playlist navigation
  const allLessons: FlattenedLesson[] = useMemo(() => {
    const list: FlattenedLesson[] = [];
    let idx = 0;
    course.curriculum?.forEach((mod) => {
      mod.lessons?.forEach((lesson) => {
        list.push({
          ...lesson,
          moduleName: mod.module,
          globalIndex: idx++,
        });
      });
    });
    return list;
  }, [course]);

  useEffect(() => {
    const list = getStoredCourses();
    const found = list.find((c) => c.slug === slug || c.id === slug);
    if (found) {
      setCourse(found);
      if (found.isFree || found.price === 0) {
        setIsEnrolled(true);
      }
    } else {
      fetchCoursesFromServer().then((serverList) => {
        const serverFound = serverList.find((c) => c.slug === slug || c.id === slug);
        if (serverFound) {
          setCourse(serverFound);
          if (serverFound.isFree || serverFound.price === 0) {
            setIsEnrolled(true);
          }
        } else {
          setCourse(FALLBACK_EMPTY_COURSE);
        }
      });
    }
  }, [slug]);

  useEffect(() => {
    if (allLessons.length > 0 && !activeLesson) {
      setActiveLesson(allLessons[0]);
    }
  }, [allLessons, activeLesson]);

  const pricePKR = Math.round((course.price || 0) * 278);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  const handleToggleLike = () => {
    if (hasLiked) {
      setHasLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setHasLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshotName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setScreenshotUrl(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerContact || !tid) {
      alert("Please enter your WhatsApp/Phone number and payment TID.");
      return;
    }

    addOrder({
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: customerContact,
      product: `Course: ${course.title}`,
      amount: `Rs ${pricePKR.toLocaleString()} ($${course.price})`,
      date: "Just now",
      status: "Awaiting Delivery",
      type: "course",
      tid: tid,
      paymentMethod: paymentMethod,
      screenshotUrl: screenshotUrl || undefined,
      screenshotName: screenshotName || undefined,
      deliveryGuaranteedWithin: "12 Hours",
    });

    setIsEnrolled(true);
    setOrderComplete(true);
  };

  const isFree = course.isFree || course.price === 0;
  // Lecture 1 or any lesson marked isPreview is free to watch
  const isLessonPreview = activeLesson?.isPreview || activeLesson?.globalIndex === 0;
  const canAccessActiveLesson = isFree || isEnrolled || isLessonPreview;
  if (course.id === "not-found") {
    return (
      <div className="bg-[#f9fafb] text-slate-900 min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Course Not Found</h2>
          <p className="text-xs text-slate-500 mb-6">
            This course is either not yet published or has been removed by the administrator.
          </p>
          <a
            href="/academy"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm"
          >
            <span>Back to Academy Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  const embedUrl = getEmbedUrl(activeLesson?.videoUrl, course.category, activeLesson?.title);

  return (
    <div className="bg-[#f9fafb] text-slate-900 min-h-screen py-4 sm:py-6 lg:py-8">
      <div className="max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-3 mb-4 text-xs">
          <div className="flex items-center gap-2 text-slate-500 font-semibold truncate">
            <a href="/academy" className="hover:text-brand-600 transition-colors">Academy Catalog</a>
            <span className="text-slate-300">/</span>
            <span className="text-slate-800 font-bold truncate">{course.title}</span>
          </div>

          {isFree ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Free Public Course
            </span>
          ) : isEnrolled ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex-shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Enrolled & Unlocked
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px] flex-shrink-0">
              <Lock className="w-3.5 h-3.5 text-amber-600" /> Lecture 1 Free Preview
            </span>
          )}
        </div>

        {/* YouTube Watch Layout: 8 Columns Player / 4 Columns Playlist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* =========================================================================
              LEFT COLUMN (8 COLS): YOUTUBE VIDEO STAGE + TITLE + ACTIONS + DESCRIPTION
          ========================================================================= */}
          <div className="lg:col-span-8 xl:col-span-8 space-y-4">
            
            {/* 16:9 Cinema Player */}
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl relative border border-slate-900">
              {canAccessActiveLesson ? (
                embedUrl.endsWith(".mp4") || embedUrl.endsWith(".webm") ? (
                  <video
                    src={embedUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain bg-black"
                  />
                ) : (
                  <iframe
                    src={embedUrl}
                    title={activeLesson?.title || course.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                )
              ) : (
                /* YouTube-style Locked Lecture Overlay */
                <div className="w-full h-full bg-gradient-to-br from-slate-950 via-[#0b1020] to-[#180b2c] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                  {course.thumbnailUrl && (
                    <div 
                      className="absolute inset-0 bg-cover bg-center opacity-20 blur-xl scale-110 pointer-events-none"
                      style={{ backgroundImage: `url(${course.thumbnailUrl})` }}
                    />
                  )}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

                  <div className="relative z-10 w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mb-3 shadow-[0_0_35px_rgba(245,158,11,0.25)]">
                    <Lock className="w-7 h-7" />
                  </div>

                  <div className="relative z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-300 text-xs font-semibold mb-3">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>Locked Lecture • Course Enrollment Required</span>
                  </div>

                  <h3 className="relative z-10 text-lg sm:text-xl font-black text-white max-w-md mb-2">
                    {activeLesson?.title || "Premium Lecture"}
                  </h3>

                  <p className="relative z-10 text-xs sm:text-sm text-slate-300 max-w-md mb-5 leading-relaxed">
                    Lecture 1 was a free preview. Unlock all {allLessons.length} structured masterclass lectures with permanent lifetime access.
                  </p>

                  <button
                    type="button"
                    onClick={() => setIsEnrollModalOpen(true)}
                    className="relative z-10 px-6 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-500 hover:from-brand-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-brand-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                    <span>Unlock Full Course • ${course.price} (Rs {pricePKR.toLocaleString()})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Video Title Header */}
            <div>
              {isLessonPreview && !isFree && (
                <div className="mb-2">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider">
                    🎁 Free Preview Lecture
                  </span>
                </div>
              )}

              <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                {activeLesson?.title || course.title}
              </h1>
            </div>

            {/* YouTube-style Channel Bar & Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
              
              {/* Channel Meta */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-md ring-2 ring-brand-100 flex-shrink-0">
                  AX
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <a 
                      href="https://youtube.com/@advertyx?si=ETYe4Cn61LFe5znA" 
                      target="_blank" 
                      rel="noreferrer"
                      className="font-extrabold text-sm text-slate-900 hover:text-brand-600 transition-colors"
                      title="Visit official YouTube channel"
                    >
                      Adverty X Academy
                    </a>
                    <CheckCircle2 className="w-4 h-4 text-brand-600 fill-brand-100" />
                  </div>
                </div>

                {isFree ? (
                  <span className="ml-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                    100% Free
                  </span>
                ) : isEnrolled ? (
                  <span className="ml-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                    ✓ Unlocked
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEnrollModalOpen(true)}
                    className="ml-2 px-4 py-1.5 rounded-full bg-slate-900 hover:bg-brand-600 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    Enroll • ${course.price}
                  </button>
                )}
              </div>

              {/* YouTube Action Buttons */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handleToggleLike}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
                    hasLiked
                      ? "bg-brand-50 text-brand-600 border border-brand-200"
                      : "bg-slate-100 hover:bg-slate-200/80 text-slate-700"
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? "fill-brand-600" : ""}`} />
                  <span>{likeCount}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold transition-all relative"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                  {shareToast && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-slate-900 text-white text-[10px] font-bold shadow-lg whitespace-nowrap">
                      Link copied!
                    </span>
                  )}
                </button>

                {!isEnrolled && !isFree && (
                  <button
                    type="button"
                    onClick={() => setIsEnrollModalOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-xs font-black shadow-sm transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Unlock All</span>
                  </button>
                )}
              </div>
            </div>

            {/* YouTube Expandable Description Box */}
            <div 
              onClick={() => setShowFullDesc(!showFullDesc)}
              className="bg-slate-100 hover:bg-slate-200/60 transition-colors rounded-2xl p-4 sm:p-5 text-xs text-slate-700 cursor-pointer space-y-2 border border-slate-200/60"
            >
              <div className="flex flex-wrap items-center gap-3 font-bold text-slate-900 text-[11px] sm:text-xs">
                <span>{allLessons.length} Video Lectures</span>
                <span>•</span>
                <span>Permanent Access</span>
              </div>

              <p className={`text-slate-600 leading-relaxed ${showFullDesc ? "" : "line-clamp-3"}`}>
                {course.description}
              </p>

              {course.description && course.description.length > 120 && (
                <div className="font-bold text-slate-900 flex items-center gap-1 text-[11px] pt-1">
                  <span>{showFullDesc ? "Show less" : "...more"}</span>
                  {showFullDesc ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </div>
              )}
            </div>

          </div>

          {/* =========================================================================
              RIGHT COLUMN (4 COLS): YOUTUBE PLAYLIST QUEUE SIDEBAR
          ========================================================================= */}
          <div className="lg:col-span-4 xl:col-span-4 space-y-4">
            
            {/* Playlist Container Box */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm sticky top-24">
              
              {/* Playlist Header (like YouTube playlist box) */}
              <div className="p-4 bg-slate-900 text-white space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ListVideo className="w-4 h-4 text-brand-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-400 font-mono">
                      Course Playlist
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {(activeLesson?.globalIndex ?? 0) + 1} / {allLessons.length}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-white line-clamp-1">
                  {course.title}
                </h3>

                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Adverty X Academy</span>
                  <span>{isFree ? "100% Free" : isEnrolled ? "Unlocked" : `$${course.price}`}</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-brand-500 h-full transition-all duration-300"
                    style={{ width: `${(((activeLesson?.globalIndex ?? 0) + 1) / allLessons.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Scrollable Playlist Lectures List */}
              <div className="max-h-[580px] overflow-y-auto divide-y divide-slate-100">
                {allLessons.map((lesson) => {
                  const isCurrent = activeLesson?.globalIndex === lesson.globalIndex;
                  const isUnlocked = isFree || isEnrolled || lesson.isPreview || lesson.globalIndex === 0;

                  return (
                    <div
                      key={lesson.globalIndex}
                      onClick={() => {
                        setActiveLesson(lesson);
                        if (!isUnlocked) {
                          setIsEnrollModalOpen(true);
                        }
                      }}
                      className={`p-3 sm:p-3.5 flex items-center gap-3 transition-colors cursor-pointer group ${
                        isCurrent
                          ? "bg-brand-50/90 font-bold"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      {/* Play State or Index */}
                      <div className="w-5 text-center flex-shrink-0 text-xs">
                        {isCurrent ? (
                          <span className="inline-block w-2.5 h-2.5 rounded-full bg-brand-600 animate-pulse" />
                        ) : (
                          <span className="text-slate-400 font-mono text-[11px]">
                            {lesson.globalIndex + 1}
                          </span>
                        )}
                      </div>

                      {/* Mini Thumbnail with Duration Overlay */}
                      <div className="w-24 h-14 sm:w-28 sm:h-16 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 relative border border-slate-200">
                        <img 
                          src={course.thumbnailUrl || "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=400&q=80"} 
                          alt={lesson.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                        />
                        <div className="absolute inset-0 bg-black/20" />

                        {/* Lock or Play Icon Center Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          {isUnlocked ? (
                            <PlayCircle className={`w-5 h-5 text-white/90 drop-shadow-md ${isCurrent ? "scale-110 text-brand-400" : ""}`} />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-amber-400">
                              <Lock className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>

                        {/* Duration Pill in bottom right */}
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white font-bold leading-none">
                          {lesson.duration}
                        </span>
                      </div>

                      {/* Lecture Details */}
                      <div className="min-w-0 flex-1">
                        <h4 className={`text-xs leading-snug line-clamp-2 ${isCurrent ? "text-brand-900 font-extrabold" : "text-slate-800 font-medium"}`}>
                          {lesson.title}
                        </h4>
                        
                        <div className="flex items-center gap-2 mt-1">
                          {lesson.globalIndex === 0 || lesson.isPreview ? (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase">
                              Free
                            </span>
                          ) : !isUnlocked ? (
                            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[9px] font-bold flex items-center gap-0.5">
                              <Lock className="w-2.5 h-2.5" /> Lock
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Quick-Enroll Action if paid & not unlocked */}
              {!isFree && !isEnrolled && (
                <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2.5">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Course Unlock</span>
                      <span className="text-base font-black text-slate-900">${course.price}</span>
                      <span className="text-xs text-slate-500 font-mono ml-1.5">≈ Rs {pricePKR.toLocaleString()}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Lifetime Access
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsEnrollModalOpen(true)}
                    className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black text-xs uppercase tracking-wider text-center shadow-sm flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Unlock All Lectures</span>
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* =========================================================================
          COURSE ENROLLMENT & PAYMENT MODAL (EASYPAISA / JAZZCASH / BANK)
      ========================================================================= */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative my-6">
            <button
              onClick={() => setIsEnrollModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            {orderComplete ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Enrollment Proof Submitted!</h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                  Thank you! Your enrollment request for <strong className="text-slate-900">{course.title}</strong> has been received. Your TID (<strong className="font-mono text-brand-600">{tid || "Recorded"}</strong>) is registered. All lectures have been unlocked for your session!
                </p>
                <div className="pt-3 flex flex-col gap-2.5">
                  <a
                    href={`https://wa.me/255613735391?text=${encodeURIComponent(`Assalam o Alaikum! I enrolled in "${course.title}". My WhatsApp is ${customerContact} and TID is ${tid}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Open WhatsApp for Instant Support</span>
                  </a>
                  <button
                    onClick={() => {
                      setIsEnrollModalOpen(false);
                      setOrderComplete(false);
                    }}
                    className="w-full py-2.5 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
                  >
                    Start Watching Lectures Now ✓
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEnrollSubmit} className="space-y-4">
                {/* Header */}
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 font-mono">
                    Course Enrollment Checkout
                  </span>
                  <div className="flex items-center justify-between mt-1">
                    <h3 className="text-lg font-bold text-slate-900 truncate max-w-xs">{course.title}</h3>
                    <div className="text-right">
                      <span className="text-lg font-black text-brand-600 block">
                        Rs {pricePKR.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">(${course.price} USD)</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">Permanent Lifetime Access • All {allLessons.length} Lectures Unlocked</span>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-2">
                    Step 1: Choose Payment Method
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { key: "JazzCash" as const, label: "JazzCash", isComingSoon: false },
                      { key: "OPay" as const, label: "OPay", isComingSoon: false },
                      { key: "Easypaisa" as const, label: "Easypaisa", isComingSoon: true },
                      { key: "Bank Transfer" as const, label: "Meezan Bank", isComingSoon: true }
                    ].map((m) => {
                      const isSelected = paymentMethod === m.key;
                      if (m.isComingSoon) {
                        return (
                          <div
                            key={m.key}
                            className="p-2 sm:p-2.5 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 text-center text-xs opacity-75 cursor-not-allowed select-none flex flex-col items-center justify-center"
                            title={`${m.label} is coming soon! Please pay via JazzCash or OPay.`}
                          >
                            <span className="font-semibold text-slate-400">{m.label}</span>
                            <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 mt-1">
                              Coming Soon
                            </span>
                          </div>
                        );
                      }
                      return (
                        <button
                          key={m.key}
                          type="button"
                          onClick={() => setPaymentMethod(m.key)}
                          className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${
                            isSelected
                              ? "border-brand-600 bg-brand-50/70 text-brand-700 shadow-xs ring-1 ring-brand-500"
                              : "border-slate-200 hover:border-slate-300 text-slate-700"
                          }`}
                        >
                          <span>{m.label}</span>
                          <span className="text-[9px] font-bold text-emerald-600 mt-0.5">● Instant</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Account Details Box */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Transfer exact amount (Rs {pricePKR.toLocaleString()}) to:
                    </span>
                    <span className="text-[10px] font-bold text-brand-600 uppercase">Official Account</span>
                  </div>

                  {paymentMethod === "JazzCash" && (
                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Account Title:</span>
                        <span className="font-bold text-slate-900">Ali Ahmed</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">JazzCash Number:</span>
                        <div className="flex items-center gap-1.5 font-mono font-bold text-brand-600">
                          <span>0303-4581115</span>
                          <button
                            type="button"
                            onClick={() => handleCopy("03034581115", "jazzcash")}
                            className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                            title="Copy number"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      {copiedKey === "jazzcash" && (
                        <span className="text-[10px] text-emerald-600 font-bold block text-right">Copied to clipboard!</span>
                      )}
                    </div>
                  )}

                  {paymentMethod === "OPay" && (
                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Account Title:</span>
                        <span className="font-bold text-slate-900">Shazia Khalil</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">OPay Number:</span>
                        <div className="flex items-center gap-1.5 font-mono font-bold text-brand-600">
                          <span>0324-4973465</span>
                          <button
                            type="button"
                            onClick={() => handleCopy("03244973465", "opay")}
                            className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                            title="Copy number"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      {copiedKey === "opay" && (
                        <span className="text-[10px] text-emerald-600 font-bold block text-right">Copied to clipboard!</span>
                      )}
                    </div>
                  )}

                  {paymentMethod === "Easypaisa" && (
                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Account Title:</span>
                        <span className="font-bold text-slate-900">Ali Ahmed</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Easypaisa Number:</span>
                        <div className="flex items-center gap-1.5 font-mono font-bold text-brand-600">
                          <span>0303-4581115</span>
                          <button
                            type="button"
                            onClick={() => handleCopy("03034581115", "easypaisa")}
                            className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                            title="Copy number"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      {copiedKey === "easypaisa" && (
                        <span className="text-[10px] text-emerald-600 font-bold block text-right">Copied to clipboard!</span>
                      )}
                    </div>
                  )}

                  {paymentMethod === "Bank Transfer" && (
                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Bank:</span>
                        <span className="font-bold text-slate-900">Meezan Bank</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Account Title:</span>
                        <span className="font-bold text-slate-900">Adverty X Digital Services</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">IBAN / Acc #:</span>
                        <div className="flex items-center gap-1.5 font-mono font-bold text-brand-600">
                          <span>02010108821992</span>
                          <button
                            type="button"
                            onClick={() => handleCopy("02010108821992", "bank")}
                            className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                            title="Copy IBAN"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      {copiedKey === "bank" && (
                        <span className="text-[10px] text-emerald-600 font-bold block text-right">Copied to clipboard!</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Verification */}
                <div className="space-y-3 pt-1">
                  <span className="text-xs font-bold text-slate-700 block">
                    Step 2: Enter WhatsApp & Transaction ID (TID)
                  </span>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Your WhatsApp Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 0300-1234567"
                      value={customerContact}
                      onChange={(e) => setCustomerContact(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Transaction ID (TID / Trx ID from SMS) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 9812401823"
                      value={tid}
                      onChange={(e) => setTid(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-brand-600 focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  {/* Payment Screenshot (SS) Upload */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Upload Payment Slip Screenshot (SS) *
                    </label>
                    <input
                      type="file"
                      id="course-enroll-ss"
                      accept="image/*"
                      onChange={handleScreenshotChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="course-enroll-ss"
                      className="flex items-center justify-between p-3 rounded-xl border border-dashed border-slate-300 hover:border-brand-500 bg-slate-50 hover:bg-brand-50/20 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <UploadCloud className="w-4 h-4 text-brand-600 flex-shrink-0" />
                        <span className="text-xs font-medium text-slate-700 truncate">
                          {screenshotName ? screenshotName : "Select Payment Slip Screenshot (SS)"}
                        </span>
                      </div>
                      {screenshotName && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex-shrink-0">
                          Uploaded ✓
                        </span>
                      )}
                    </label>
                  </div>
                </div>

                {/* 12-Hour SLA Delivery Guarantee Notice */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-semibold">
                  <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>
                    <strong>12-Hour SLA Guarantee:</strong> Verification and course unlock guaranteed within 12 hours (or earlier).
                  </span>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEnrollModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all"
                  >
                    Submit Proof & Unlock Course
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
