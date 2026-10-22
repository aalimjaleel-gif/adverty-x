import React from "react";
import { 
  ArrowUpRight, 
  Heart,
  Globe
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0B132B] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Main Grid - 2 columns on mobile, 5 columns on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Mission (Spans 2 columns) */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <a href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
                <span className="font-extrabold text-xl tracking-tight">X</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Adverty <span className="text-brand-500">X</span>
              </span>
            </a>
            
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Your partner in digital success. We provide innovative solutions for businesses, creators and students — all in one unified platform.
            </p>

            {/* Social Links with Real Brand Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/advertyx_?utm_source=ig_web_button_share_sheet&xtok=ZDNlZDc0MzIxNw==" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] text-slate-300 hover:text-white flex items-center justify-center transition-all hover:scale-105 shadow-xs"
                aria-label="Instagram"
                title="Follow Adverty X on Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* TikTok */}
              <a 
                href="https://www.tiktok.com/@advertyx.info?_r=1&_t=ZS-9AhzdSk552D" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-black text-slate-300 hover:text-[#00f2fe] flex items-center justify-center transition-all hover:scale-105 shadow-xs"
                aria-label="TikTok"
                title="Follow Adverty X on TikTok"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a 
                href="https://youtube.com/@advertyx?si=ETYe4Cn61LFe5znA" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-[#FF0000] text-slate-300 hover:text-white flex items-center justify-center transition-all hover:scale-105 shadow-xs"
                aria-label="YouTube"
                title="Subscribe to Adverty X on YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              {/* Facebook */}
              <a 
                href="https://www.facebook.com/share/1Htm48bfdn/" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-[#1877F2] text-slate-300 hover:text-white flex items-center justify-center transition-all hover:scale-105 shadow-xs"
                aria-label="Facebook"
                title="Follow Adverty X on Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links (1 column on mobile) */}
          <div className="col-span-1 space-y-3">
            <h3 className="text-white text-xs sm:text-sm font-bold tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="/" className="hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="/services" className="hover:text-white transition-colors">Services</a>
              </li>
              <li>
                <a href="/portfolio" className="hover:text-white transition-colors">Portfolio</a>
              </li>
              <li>
                <a href="/academy" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Academy</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-900/80 text-indigo-300">
                    Courses
                  </span>
                </a>
              </li>
              <li>
                <a href="/subscriptions" className="hover:text-white transition-colors">Subscriptions</a>
              </li>
              <li>
                <a href="/about" className="hover:text-white transition-colors">About</a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition-colors">Contact</a>
              </li>
            </ul>
          </div>

          {/* Services (1 column on mobile) */}
          <div className="col-span-1 space-y-3">
            <h3 className="text-white text-xs sm:text-sm font-bold tracking-wider uppercase">
              Services
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="/services/website-design" className="hover:text-white transition-colors">
                  Web Development
                </a>
              </li>
              <li>
                <a href="/services/website-redesign" className="hover:text-white transition-colors">
                  Redesign
                </a>
              </li>
              <li>
                <a href="/services/automation" className="hover:text-white transition-colors">
                  Automation
                </a>
              </li>
              <li>
                <a href="/services/social-media-management" className="hover:text-white transition-colors">
                  Social Media
                </a>
              </li>
              <li>
                <a href="/services/paid-advertising" className="hover:text-white transition-colors">
                  Paid Ads
                </a>
              </li>
              <li>
                <a href="/services/video-editing" className="hover:text-white transition-colors flex items-center gap-1 text-brand-400 font-medium">
                  <span>Video Editing</span>
                  <span className="text-[9px] uppercase font-bold px-1 rounded bg-brand-900/80 text-brand-300">
                    Addon
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Policies (Spans 2 columns on mobile, 1 on desktop) */}
          <div className="col-span-2 md:col-span-1 space-y-3 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-800">
            <h3 className="text-white text-xs sm:text-sm font-bold tracking-wider uppercase">
              Legal & Trust
            </h3>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2 text-xs sm:text-sm">
              <li>
                <a href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/refund-policy" className="hover:text-white transition-colors">
                  Refund Policy
                </a>
              </li>
              <li>
                <a href="/pricing" className="hover:text-white transition-colors">
                  Agency Pricing
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Adverty X. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for a better digital future.
          </p>
        </div>

      </div>
    </footer>
  );
}
