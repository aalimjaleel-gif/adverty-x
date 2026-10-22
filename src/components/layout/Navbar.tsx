"use client";

import React, { useState, useEffect } from "react";
import Link from "next/navigation";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  User,
  ArrowRight,
  Layers,
  GraduationCap,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  LogOut,
  MessageCircle
} from "lucide-react";
import { isAdminAuthenticated, getAuthenticatedUser, logoutAll, UserProfile } from "@/lib/store";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const syncUser = () => {
      setCurrentUser(getAuthenticatedUser());
    };
    syncUser();

    window.addEventListener("advertyx_auth_changed", syncUser);
    window.addEventListener("storage", syncUser);

    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("advertyx_auth_changed", syncUser);
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services", hasDropdown: true, badge: "Soon" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Academy", href: "/academy", badge: "Learn" },
    { name: "Subscriptions", href: "/subscriptions" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const serviceLinks = [
    { name: "Frontend Design", href: "/services/website-design", desc: "Modern, high-converting websites" },
    { name: "Website Redesign", href: "/services/website-redesign", desc: "Audit and modernization" },
    { name: "Business Automation", href: "/services/automation", desc: "Workflow & lead capture pipelines" },
    { name: "Social Media Management", href: "/services/social-media-management", desc: "Audience growth & content" },
    { name: "Paid Advertising", href: "/services/paid-advertising", desc: "Meta & TikTok ad campaigns" },
    { name: "Video Editing (Paid Add-on)", href: "/services/video-editing", desc: "Shorts, reels & brand video edits", isAddon: true },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm"
          : "bg-white border-b border-slate-100"
        }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Brand Logo */}
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight">X</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                Adverty <span className="text-brand-600">X</span>
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              if (link.hasDropdown) {
                return (
                  <div
                    key={link.name}
                    className="relative group"
                    onMouseEnter={() => setServicesDropdown(true)}
                    onMouseLeave={() => setServicesDropdown(false)}
                  >
                    <a
                      href={link.href}
                      className={`flex items-center gap-1 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${isActive(link.href)
                          ? "text-brand-600 bg-brand-50/80 font-semibold"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        }`}
                    >
                      {link.name}
                      <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 text-slate-400" />
                    </a>

                    {/* Services Mega Dropdown */}
                    {servicesDropdown && (
                      <div className="absolute top-full left-0 w-80 pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="bg-white rounded-xl shadow-float border border-slate-200/80 p-2">
                          <div className="px-3 py-2 border-b border-slate-100 mb-1 flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                              Agency Services
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                              Coming Soon
                            </span>
                          </div>
                          {serviceLinks.map((item) => (
                            <a
                              key={item.name}
                              href={item.href}
                              className="flex flex-col p-2.5 rounded-lg hover:bg-slate-50 transition-colors group/item"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-800 group-hover/item:text-brand-600">
                                  {item.name}
                                </span>
                                {item.isAddon && (
                                  <span className="text-[10px] uppercase font-bold tracking-wide px-1.5 py-0.5 rounded bg-brand-100 text-brand-700">
                                    Add-on
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-slate-500 mt-0.5">{item.desc}</span>
                            </a>
                          ))}
                          <div className="mt-2 pt-2 border-t border-slate-100 px-2.5 py-1.5 flex justify-between items-center text-xs text-brand-600 font-medium">
                            <a href="/pricing" className="hover:underline flex items-center gap-1">
                              View Package Pricing <ArrowRight className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${isActive(link.href)
                      ? "text-brand-600 bg-brand-50/80 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                >
                  {link.name}
                  {link.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                      {link.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2.5">
                {currentUser.isAdmin ? (
                  <>
                    <a
                      href="/admin"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
                    >
                      <div className="w-6 h-6 rounded-lg bg-brand-600 flex items-center justify-center font-black text-xs text-white">
                        AX
                      </div>
                      <span className="text-xs font-bold">Admin Panel</span>
                    </a>
                    <a
                      href="/profile"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-slate-600" />
                      <span>Profile</span>
                    </a>
                  </>
                ) : (
                  <a
                    href="/profile"
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
                  >
                    <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center font-black text-xs text-white uppercase">
                      {currentUser.name ? currentUser.name.charAt(0) : "U"}
                    </div>
                    <span className="text-xs font-bold">{currentUser.name || "My Profile"}</span>
                  </a>
                )}
                <button
                  onClick={() => {
                    logoutAll();
                    window.location.href = "/";
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <a
                  href="/login"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Login</span>
                </a>

                <a
                  href="/contact"
                  className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 rounded-lg shadow-sm hover:shadow-brand-500/25 transition-all"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-brand-600" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Upgraded Mobile Slide-down Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white/98 backdrop-blur-xl px-4 pt-3 pb-8 space-y-4 shadow-2xl animate-in slide-in-from-top duration-200 max-h-[85vh] overflow-y-auto">
          {/* WhatsApp Support Strip on Mobile */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">WhatsApp Support</span>
                <span className="text-[10px] text-emerald-700 font-medium">Orders & Custom Inquiries</span>
              </div>
            </div>
            <a
              href="https://wa.me/255613735391"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-[11px] font-bold shadow-xs active:scale-95 transition-transform"
            >
              Chat Now
            </a>
          </div>

          {/* Quick Category Grid */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${pathname === "/" ? "bg-brand-50 border-brand-200 text-brand-700" : "bg-slate-50 border-slate-100 text-slate-700"
                }`}
            >
              <span>🏠 Home</span>
            </a>
            <a
              href="/academy"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between ${pathname.startsWith("/academy") ? "bg-brand-50 border-brand-200 text-brand-700" : "bg-slate-50 border-slate-100 text-slate-700"
                }`}
            >
              <span>🎓 Academy</span>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">Free</span>
            </a>
            <a
              href="/subscriptions"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between ${pathname.startsWith("/subscriptions") ? "bg-brand-50 border-brand-200 text-brand-700" : "bg-slate-50 border-slate-100 text-slate-700"
                }`}
            >
              <span>💎 Subscriptions</span>
              <span className="text-[9px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-bold">Hot</span>
            </a>
            <a
              href="/portfolio"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${pathname.startsWith("/portfolio") ? "bg-brand-50 border-brand-200 text-brand-700" : "bg-slate-50 border-slate-100 text-slate-700"
                }`}
            >
              <span>📁 Portfolio</span>
            </a>
          </div>

          {/* Agency Services Sub-List */}
          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between px-1 mb-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Agency Services
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800">
                  Soon
                </span>
              </div>
              <a href="/services" onClick={() => setMobileMenuOpen(false)} className="text-[11px] font-bold text-brand-600 hover:underline">
                View All →
              </a>
            </div>
            {serviceLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-700"
              >
                <span>{item.name}</span>
                {item.isAddon ? (
                  <span className="text-[9px] font-bold bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded">
                    Add-on
                  </span>
                ) : (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                )}
              </a>
            ))}
          </div>

          {/* Account Actions */}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {currentUser ? (
              <>
                {currentUser.isAdmin ? (
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl"
                    >
                      <ShieldCheck className="w-4 h-4 text-brand-400" />
                      <span>Admin Panel</span>
                    </a>
                    <a
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl"
                    >
                      <User className="w-4 h-4 text-slate-600" />
                      <span>Admin Profile</span>
                    </a>
                  </div>
                ) : (
                  <a
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl"
                  >
                    <User className="w-4 h-4 text-emerald-600" />
                    <span>My Profile ({currentUser.name})</span>
                  </a>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logoutAll();
                    window.location.href = "/";
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <a
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl"
              >
                <User className="w-4 h-4 text-slate-500" />
                <span>Login to Account</span>
              </a>
            )}
            <a
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm"
            >
              <span>Get Started / Contact Us</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
