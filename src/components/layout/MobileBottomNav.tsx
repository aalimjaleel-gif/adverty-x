"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Layers, 
  GraduationCap, 
  Sparkles, 
  User,
  ShieldCheck 
} from "lucide-react";
import { getAuthenticatedUser, isAdminAuthenticated, UserProfile } from "@/lib/store";

interface MobileNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  badge?: string;
}

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const syncAuth = () => {
      setCurrentUser(getAuthenticatedUser());
    };
    syncAuth();

    window.addEventListener("advertyx_auth_changed", syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("advertyx_auth_changed", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, [pathname]);

  const isAdmin = currentUser?.isAdmin || isAdminAuthenticated();

  const accountTabItem: MobileNavItem = isAdmin
    ? {
        label: "Admin",
        href: "/admin",
        icon: ShieldCheck,
        isActive: pathname.startsWith("/admin") || pathname.startsWith("/dashboard"),
      }
    : currentUser
    ? {
        label: "Profile",
        href: "/profile",
        icon: User,
        isActive: pathname.startsWith("/profile"),
      }
    : {
        label: "Login",
        href: "/login",
        icon: User,
        isActive: pathname.startsWith("/login") || pathname.startsWith("/signup"),
      };

  const navItems: MobileNavItem[] = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Services",
      href: "/services",
      icon: Layers,
      badge: "Soon",
      isActive: pathname.startsWith("/services"),
    },
    {
      label: "Academy",
      href: "/academy",
      icon: GraduationCap,
      badge: "Learn",
      isActive: pathname.startsWith("/academy"),
    },
    {
      label: "Apps",
      href: "/subscriptions",
      icon: Sparkles,
      badge: "Hot",
      isActive: pathname.startsWith("/subscriptions"),
    },
    accountTabItem,
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] px-2 py-1.5 transition-all">
      <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <a
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative ${
                active 
                  ? "text-brand-600 font-bold" 
                  : "text-slate-500 hover:text-slate-900 font-medium"
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                active 
                  ? "bg-brand-50 text-brand-600 shadow-xs scale-105" 
                  : "text-slate-500 hover:bg-slate-50"
              }`}>
                <Icon className={`w-5 h-5 ${active ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
              </div>
              
              <span className={`text-[10px] tracking-tight mt-0.5 ${active ? "font-bold text-brand-600" : "font-medium"}`}>
                {item.label}
              </span>

              {item.badge && !active && (
                <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}
