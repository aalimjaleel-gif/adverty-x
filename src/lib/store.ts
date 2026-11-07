import { 
  ACADEMY_COURSES, 
  APP_SUBSCRIPTIONS, 
  AGENCY_SERVICES,
  CourseItem, 
  AppSubscriptionItem, 
  ServiceItem,
  VendorPaymentDetails,
  CoursePricingTier
} from "@/data/mockData";

export interface OrderItem {
  id: string;
  customer: string;
  customerEmail?: string;
  customerPhone?: string;
  product: string;
  amount: string;
  date: string;
  status: "Awaiting Delivery" | "Delivered & Active" | "Completed";
  type: "subscription" | "course" | "service";
  tid?: string;
  paymentMethod?: string;
  vendorName?: string;
  planDuration?: string; // e.g. "1 Month Access" or "Lifetime Access"
  screenshotUrl?: string; // Payment proof screenshot (ss)
  screenshotName?: string;
  deliveryGuaranteedWithin?: string; // e.g. "Within 12 Hours"
  deliveredCredentials?: string;
  deliveryNote?: string;
}

export interface ReferralCommissionSettings {
  courseEnrollmentPKR: number; // e.g. 20 (Course Referral Commission)
  appSubscriptionPKR: number;  // e.g. 10 (App Subscription Commission)
  largeServicePKR?: number;
  smallProductPKR?: number;
}

export interface PayoutRequest {
  id: string;
  userEmail: string;
  userName?: string;
  userPhone?: string;
  amountPKR: number;
  method: "JazzCash" | "OPay" | "Easypaisa" | "Bank Transfer";
  accountNumber: string;
  accountTitle: string;
  date: string;
  status: "Pending" | "Approved & Paid";
}

export interface PartnerVendor {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  storeName: string;
  tagline?: string;
  themeColor: "purple" | "emerald" | "blue" | "rose" | "amber" | "indigo";
  youtubeUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  status: "Active" | "Suspended";
  joinedDate: string;
  paymentDetails: {
    JazzCash?: { number: string; title: string };
    Easypaisa?: { number: string; title: string };
    BankTransfer?: { bankName: string; accountTitle: string; accountNumber: string };
  };
}

const COURSES_STORAGE_KEY = "advertyx_courses_data";
const SUBSCRIPTIONS_STORAGE_KEY = "advertyx_subscriptions_data";
const SERVICES_STORAGE_KEY = "advertyx_services_data";
const ORDERS_STORAGE_KEY = "advertyx_orders_data";
const AUTH_STORAGE_KEY = "advertyx_admin_logged_in";
const REGISTERED_USERS_KEY = "advertyx_registered_users";
const REFERRAL_SETTINGS_KEY = "advertyx_referral_settings";
const PAYOUTS_STORAGE_KEY = "advertyx_payout_requests";
const PARTNERS_STORAGE_KEY = "advertyx_partners_data";
const PARTNER_SESSION_KEY = "advertyx_active_partner";

// In-memory fallbacks
let inMemoryCourses: CourseItem[] = [...ACADEMY_COURSES];
let inMemorySubscriptions: AppSubscriptionItem[] = [...APP_SUBSCRIPTIONS];
let inMemoryServices: ServiceItem[] = [...AGENCY_SERVICES];
let inMemoryOrders: OrderItem[] = []; // ZERO demo customers by default
const DEFAULT_INITIAL_PARTNERS: PartnerVendor[] = [
  {
    id: "partner-1730940000000",
    name: "Muhammad Usama",
    email: "533884h@gmail.com",
    password: "Partner123!",
    phone: "03044481402",
    storeName: "Pro seller",
    tagline: "Verified Reseller Store",
    themeColor: "purple",
    status: "Active",
    joinedDate: "November 2026",
    paymentDetails: {
      JazzCash: { number: "03044481402", title: "Muhammad Usama" },
      Easypaisa: { number: "03044481402", title: "Muhammad Usama" }
    }
  }
];

let inMemoryPartners: PartnerVendor[] = [...DEFAULT_INITIAL_PARTNERS];
let inMemoryReferralSettings: ReferralCommissionSettings = {
  courseEnrollmentPKR: 20,
  appSubscriptionPKR: 10,
  largeServicePKR: 20,
  smallProductPKR: 10
};
let inMemoryPayouts: PayoutRequest[] = [];

// Demo course identifiers to permanently filter out demo content
const DEMO_COURSE_IDS = new Set([
  "course-free-1",
  "course-free-2",
  "course-1",
  "course-2",
  "course-3"
]);

const DEMO_COURSE_SLUGS = new Set([
  "canva-graphic-design-free",
  "instagram-reels-mobile-editing-free",
  "digital-marketing-mastery",
  "web-development-nextjs",
  "social-media-strategy"
]);

export function isDemoCourse(course?: { id?: string; slug?: string } | null): boolean {
  if (!course) return false;
  if (course.id && DEMO_COURSE_IDS.has(course.id)) return true;
  if (course.slug && DEMO_COURSE_SLUGS.has(course.slug)) return true;
  return false;
}

// ============================================================================
// 1. AUTHENTICATION & UNIFIED USER STORE
// ============================================================================
export interface UserProfile {
  name: string;
  email: string;
  joinedDate?: string;
  role: string;
  isAdmin?: boolean;
  isPartner?: boolean;
  provider?: string;
  phone?: string;
}

export interface RegisteredUser extends UserProfile {
  password?: string;
}

export function getRegisteredUsers(): RegisteredUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveRegisteredUser(user: RegisteredUser): void {
  if (typeof window === "undefined") return;
  const users = getRegisteredUsers();
  const existingIdx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
  if (existingIdx >= 0) {
    users[existingIdx] = { ...users[existingIdx], ...user };
  } else {
    users.push(user);
  }
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
}

export function authenticateWithPassword(email: string, password: string): { 
  success: boolean; 
  user?: UserProfile; 
  partner?: PartnerVendor;
  isPartner?: boolean;
  error?: string 
} {
  const cleanEmail = email.trim().toLowerCase();
  
  // Super Admin bypass (Adverty X Owner)
  const isSuperAdminEmail = cleanEmail === "admin@advertyx.com" || cleanEmail === "advertyx.info@gmail.com";
  const isSuperAdminPass = password === "AdminPassword123!" || password === "admin123";
  if (isSuperAdminEmail && isSuperAdminPass) {
    loginAdmin();
    return { 
      success: true, 
      user: {
        name: "Adverty X Super Admin",
        email: cleanEmail,
        joinedDate: "October 2026",
        role: "Master Administrator",
        isAdmin: true
      } 
    };
  }

  // Check if email belongs to a Registered Partner Vendor!
  const partners = getStoredPartners();
  const foundPartner = partners.find(p => p.email.toLowerCase() === cleanEmail);
  if (foundPartner) {
    if (foundPartner.status === "Suspended") {
      return { 
        success: false, 
        error: "Your partner vendor account is currently suspended by the Super Administrator. Please contact support." 
      };
    }
    if (foundPartner.password && foundPartner.password !== password) {
      return { 
        success: false, 
        error: "Incorrect password for partner studio. Please check and try again." 
      };
    }
    loginPartner(foundPartner);
    const partnerUser: UserProfile = {
      name: foundPartner.name,
      email: foundPartner.email,
      joinedDate: foundPartner.joinedDate || "October 2026",
      role: "Partner Vendor",
      isAdmin: false,
      phone: foundPartner.phone
    };
    loginClient(partnerUser);
    return { 
      success: true, 
      user: partnerUser, 
      partner: foundPartner, 
      isPartner: true 
    };
  }

  const users = getRegisteredUsers();
  const found = users.find(u => u.email.toLowerCase() === cleanEmail);

  if (found) {
    if (found.password && found.password !== password) {
      return { success: false, error: "Incorrect password. Please try again." };
    }
    const profile: UserProfile = {
      name: found.name,
      email: found.email,
      joinedDate: found.joinedDate || "October 2026",
      role: found.role || "Client & Student",
      isAdmin: false,
      provider: found.provider,
      phone: found.phone
    };
    loginClient(profile);
    return { success: true, user: profile };
  }

  // If user is logging in for the first time with new credentials, auto-register them
  const newUser: RegisteredUser = {
    name: cleanEmail.split("@")[0].replace(/[._]/g, " "),
    email: cleanEmail,
    password: password,
    joinedDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    role: "Client & Student",
    provider: "email",
    isAdmin: false
  };
  saveRegisteredUser(newUser);
  loginClient(newUser);
  return { success: true, user: newUser };
}

// ============================================================================
// PARTNER VENDOR STORAGE & PERMISSIONS ENGINE
// ============================================================================

let hasFetchedServerPartners = false;

export async function fetchPartnersFromServer(): Promise<PartnerVendor[]> {
  try {
    const res = await fetch("/api/partners", { cache: "no-store" });
    let serverPartners: PartnerVendor[] = [];
    if (res.ok) {
      try {
        serverPartners = await res.json();
      } catch (e) {}
    }
    let localPartners: PartnerVendor[] = [];
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(PARTNERS_STORAGE_KEY);
        if (raw) localPartners = JSON.parse(raw);
      } catch (e) {}
    }
    const map = new Map<string, PartnerVendor>();
    DEFAULT_INITIAL_PARTNERS.forEach(p => map.set(p.email.toLowerCase(), p));
    if (Array.isArray(serverPartners)) {
      serverPartners.forEach(p => map.set(p.email.toLowerCase(), p));
    }
    if (Array.isArray(localPartners)) {
      localPartners.forEach(p => map.set(p.email.toLowerCase(), p));
    }
    const merged = Array.from(map.values());
    inMemoryPartners = merged;
    if (typeof window !== "undefined") {
      localStorage.setItem(PARTNERS_STORAGE_KEY, JSON.stringify(merged));
      window.dispatchEvent(new Event("advertyx_partners_updated"));
    }
    return merged;
  } catch (err) {
    return inMemoryPartners;
  }
}

export function getStoredPartners(): PartnerVendor[] {
  if (typeof window === "undefined") return inMemoryPartners;
  if (!hasFetchedServerPartners) {
    hasFetchedServerPartners = true;
    fetchPartnersFromServer();
  }
  try {
    const raw = localStorage.getItem(PARTNERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PARTNERS_STORAGE_KEY, JSON.stringify(DEFAULT_INITIAL_PARTNERS));
      inMemoryPartners = DEFAULT_INITIAL_PARTNERS;
      return DEFAULT_INITIAL_PARTNERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const map = new Map<string, PartnerVendor>();
      DEFAULT_INITIAL_PARTNERS.forEach(p => map.set(p.email.toLowerCase(), p));
      parsed.forEach((p: PartnerVendor) => {
        if (p && p.email) map.set(p.email.toLowerCase(), p);
      });
      const combined = Array.from(map.values());
      inMemoryPartners = combined;
      return combined;
    }
    return inMemoryPartners;
  } catch (e) {
    return inMemoryPartners;
  }
}

export function savePartner(partner: PartnerVendor): PartnerVendor[] {
  const current = getStoredPartners();
  const existingIdx = current.findIndex(p => p.id === partner.id || p.email.toLowerCase() === partner.email.toLowerCase());
  let updated: PartnerVendor[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = { ...updated[existingIdx], ...partner };
  } else {
    updated = [partner, ...current];
  }
  inMemoryPartners = updated;
  if (typeof window !== "undefined") {
    localStorage.setItem(PARTNERS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("advertyx_partners_updated"));
    
    // Sync to Server API so it's permanently stored across all devices & Vercel
    fetch("/api/partners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partner)
    }).catch(e => console.error("Server partner sync error:", e));
  }
  return updated;
}

export function deletePartner(id: string): PartnerVendor[] {
  const current = getStoredPartners();
  const updated = current.filter(p => p.id !== id);
  inMemoryPartners = updated;
  if (typeof window !== "undefined") {
    localStorage.setItem(PARTNERS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("advertyx_partners_updated"));

    fetch(`/api/partners?id=${encodeURIComponent(id)}`, {
      method: "DELETE"
    }).catch(e => console.error("Server partner delete error:", e));
  }
  return updated;
}

export function updatePartnerStatus(id: string, status: "Active" | "Suspended"): PartnerVendor[] {
  const current = getStoredPartners();
  const updated = current.map(p => p.id === id ? { ...p, status } : p);
  inMemoryPartners = updated;
  if (typeof window !== "undefined") {
    localStorage.setItem(PARTNERS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("advertyx_partners_updated"));
    const updatedPartner = updated.find(p => p.id === id);
    if (updatedPartner) {
      fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPartner)
      }).catch(e => console.error("Server partner status error:", e));
    }
  }
  return updated;
}

export function getActivePartnerSession(): PartnerVendor | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PARTNER_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function loginPartner(partner: PartnerVendor): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(PARTNER_SESSION_KEY, JSON.stringify(partner));
    window.dispatchEvent(new Event("advertyx_partner_session_changed"));
    window.dispatchEvent(new Event("advertyx_auth_changed"));
  }
}

export function logoutPartner(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(PARTNER_SESSION_KEY);
    window.dispatchEvent(new Event("advertyx_partner_session_changed"));
    window.dispatchEvent(new Event("advertyx_auth_changed"));
  }
}

export function authenticateWithGoogle(email: string, name?: string): UserProfile {
  const cleanEmail = email.trim().toLowerCase();

  // 1. Super Admin bypass (Adverty X Owner)
  if (cleanEmail === "admin@advertyx.com" || cleanEmail === "advertyx.info@gmail.com") {
    loginAdmin();
    const adminUser: UserProfile = {
      name: "Adverty X Super Admin",
      email: cleanEmail,
      joinedDate: "October 2026",
      role: "Master Administrator",
      isAdmin: true
    };
    loginClient(adminUser);
    return adminUser;
  }

  // 2. Registered Partner Vendor bypass
  const partners = getStoredPartners();
  const foundPartner = partners.find(p => p.email.toLowerCase() === cleanEmail);
  if (foundPartner) {
    loginPartner(foundPartner);
    const partnerUser: UserProfile = {
      name: foundPartner.name,
      email: foundPartner.email,
      joinedDate: foundPartner.joinedDate || "October 2026",
      role: "Partner Vendor",
      isAdmin: false,
      isPartner: true,
      phone: foundPartner.phone
    };
    loginClient(partnerUser);
    return partnerUser;
  }

  // 3. Existing Registered Customer - retain past orders & history!
  const users = getRegisteredUsers();
  const found = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (found) {
    const profile: UserProfile = {
      name: found.name || name || cleanEmail.split("@")[0],
      email: found.email,
      joinedDate: found.joinedDate || "October 2026",
      role: found.role || "Verified Google Client",
      provider: "google",
      isAdmin: false,
      phone: found.phone
    };
    loginClient(profile);
    return profile;
  }

  // 4. Brand new Google client
  const newUser: RegisteredUser = {
    name: name?.trim() || cleanEmail.split("@")[0].replace(/[._]/g, " "),
    email: cleanEmail,
    joinedDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    role: "Verified Google Client",
    provider: "google",
    isAdmin: false
  };
  saveRegisteredUser(newUser);
  loginClient(newUser);
  return newUser;
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUTH_STORAGE_KEY) === "true";
}

export function getAuthenticatedUser(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("advertyx_client_user");
  const isAdmin = isAdminAuthenticated();

  if (isAdmin) {
    if (raw) {
      try {
        const parsed: UserProfile = JSON.parse(raw);
        if (parsed.isAdmin || parsed.email.toLowerCase() === "admin@advertyx.com") {
          return parsed;
        }
      } catch (e) {}
    }
    const adminUser: UserProfile = {
      name: "Adverty X Admin",
      email: "admin@advertyx.com",
      joinedDate: "October 2026",
      role: "Master Administrator",
      isAdmin: true,
    };
    localStorage.setItem("advertyx_client_user", JSON.stringify(adminUser));
    return adminUser;
  }

  // Check active partner session
  const activePartner = getActivePartnerSession();
  if (activePartner) {
    return {
      name: activePartner.name,
      email: activePartner.email,
      joinedDate: activePartner.joinedDate || "October 2026",
      role: "Partner Vendor",
      isAdmin: false,
      isPartner: true,
      phone: activePartner.phone
    };
  }

  if (!raw) return null;
  try {
    const parsed: UserProfile = JSON.parse(raw);
    const partners = getStoredPartners();
    const isPartnerUser = partners.find(p => p.email.toLowerCase() === parsed.email.toLowerCase());
    if (isPartnerUser) {
      loginPartner(isPartnerUser);
      return {
        ...parsed,
        role: "Partner Vendor",
        isPartner: true
      };
    }
    return parsed;
  } catch (e) {
    return null;
  }
}

export function loginAdmin(): void {
  if (typeof window !== "undefined") {
    const adminUser: UserProfile = {
      name: "Adverty X Admin",
      email: "admin@advertyx.com",
      joinedDate: "October 2026",
      role: "Master Administrator",
      isAdmin: true,
    };
    localStorage.setItem(AUTH_STORAGE_KEY, "true");
    localStorage.setItem("advertyx_client_user", JSON.stringify(adminUser));
    window.dispatchEvent(new Event("advertyx_auth_changed"));
  }
}

export function loginClient(user: UserProfile): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, "false");
    localStorage.setItem("advertyx_client_user", JSON.stringify({ ...user, isAdmin: false }));
    window.dispatchEvent(new Event("advertyx_auth_changed"));
  }
}

export function setAdminAuthenticated(status: boolean): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, status ? "true" : "false");
    if (!status) {
      localStorage.removeItem("advertyx_client_user");
    } else {
      const adminUser: UserProfile = {
        name: "Adverty X Admin",
        email: "admin@advertyx.com",
        joinedDate: "October 2026",
        role: "Master Administrator",
        isAdmin: true,
      };
      localStorage.setItem("advertyx_client_user", JSON.stringify(adminUser));
    }
    window.dispatchEvent(new Event("advertyx_auth_changed"));
  }
}

export function logoutAll(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem("advertyx_client_user");
    window.dispatchEvent(new Event("advertyx_auth_changed"));
  }
}

// ============================================================================
// 2. COURSES STORE (With Safe Merge & Server Sync)
// ============================================================================
let hasFetchedServerCourses = false;

export async function fetchCoursesFromServer(): Promise<CourseItem[]> {
  try {
    const res = await fetch("/api/courses");
    if (!res.ok) return inMemoryCourses.filter(c => !isDemoCourse(c));
    const serverCourses: CourseItem[] = await res.json();
    
    // Safely merge local and server courses, excluding any demo courses
    let localCourses: CourseItem[] = [];
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(COURSES_STORAGE_KEY);
        if (raw) localCourses = JSON.parse(raw);
      } catch (e) {}
    }

    const map = new Map<string, CourseItem>();

    // 1. Put server courses into map (filtering demo courses)
    if (Array.isArray(serverCourses)) {
      serverCourses.filter(c => !isDemoCourse(c)).forEach(c => map.set(c.id, c));
    }

    // 2. Local courses created by user take priority (filtering demo courses)
    if (Array.isArray(localCourses)) {
      localCourses.filter(c => !isDemoCourse(c)).forEach(localCourse => {
        if (!map.has(localCourse.id)) {
          map.set(localCourse.id, localCourse);
          // Persist user's local course to server immediately
          fetch("/api/courses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(localCourse)
          }).catch(() => {});
        }
      });
    }

    const merged = Array.from(map.values()).filter(c => !isDemoCourse(c));
    inMemoryCourses = merged;
    if (typeof window !== "undefined") {
      localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(merged));
      window.dispatchEvent(new Event("advertyx_courses_updated"));
    }
    return merged;
  } catch (err) {
    return inMemoryCourses.filter(c => !isDemoCourse(c));
  }
}

export function getStoredCourses(): CourseItem[] {
  if (typeof window === "undefined") {
    return inMemoryCourses.filter(c => !isDemoCourse(c));
  }
  
  // Trigger background server sync on first call
  if (!hasFetchedServerCourses) {
    hasFetchedServerCourses = true;
    fetchCoursesFromServer();
  }

  try {
    const raw = localStorage.getItem(COURSES_STORAGE_KEY);
    if (!raw) {
      const initial = ACADEMY_COURSES.filter(c => !isDemoCourse(c));
      localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(initial));
      inMemoryCourses = initial;
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const cleaned = parsed.filter(c => !isDemoCourse(c));
      inMemoryCourses = cleaned.length > 0 ? cleaned : ACADEMY_COURSES.filter(c => !isDemoCourse(c));
      return inMemoryCourses;
    }
    const defaultInitial = ACADEMY_COURSES.filter(c => !isDemoCourse(c));
    inMemoryCourses = defaultInitial;
    return defaultInitial;
  } catch (err) {
    return ACADEMY_COURSES.filter(c => !isDemoCourse(c));
  }
}

export function saveCourse(newCourse: CourseItem): CourseItem[] {
  const current = getStoredCourses();
  const existingIdx = current.findIndex(c => c.id === newCourse.id || c.slug === newCourse.slug);
  let updated: CourseItem[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = newCourse;
  } else {
    updated = [newCourse, ...current];
  }
  inMemoryCourses = updated;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("advertyx_courses_updated"));
      
      // Sync to Server API so it's permanently stored and visible on Mobile & all devices!
      fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCourse)
      }).catch(e => console.error("Server course sync error:", e));
    } catch (e) {
      console.error(e);
    }
  }
  return updated;
}

export function deleteCourse(courseId: string): CourseItem[] {
  const current = getStoredCourses();
  const updated = current.filter(c => c.id !== courseId);
  inMemoryCourses = updated;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("advertyx_courses_updated"));

      // Sync delete with server
      fetch(`/api/courses?id=${encodeURIComponent(courseId)}`, {
        method: "DELETE"
      }).catch(e => console.error("Server delete sync error:", e));
    } catch (e) {
      console.error(e);
    }
  }
  return updated;
}

// ============================================================================
// 3. SUBSCRIPTIONS STORE
// ============================================================================
let hasFetchedServerSubscriptions = false;

export async function fetchSubscriptionsFromServer(): Promise<AppSubscriptionItem[]> {
  try {
    const res = await fetch("/api/subscriptions", { cache: "no-store" });
    let serverSubs: AppSubscriptionItem[] = [];
    if (res.ok) {
      try {
        serverSubs = await res.json();
      } catch (e) {}
    }

    // Read user's local subscriptions so newly added custom items are NEVER lost
    let localSubs: AppSubscriptionItem[] = [];
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(SUBSCRIPTIONS_STORAGE_KEY);
        if (raw) localSubs = JSON.parse(raw);
      } catch (e) {}
    }

    const baseList = Array.isArray(serverSubs) && serverSubs.length > 0 ? serverSubs : APP_SUBSCRIPTIONS;
    const serverIdSet = new Set(baseList.map(s => s.id));
    const serverSlugSet = new Set(baseList.map(s => s.slug));

    // Identify brand-new items created by admin locally that are not yet on the server
    const newLocalOnlyItems: AppSubscriptionItem[] = [];
    if (Array.isArray(localSubs)) {
      localSubs.forEach(localItem => {
        if (localItem && localItem.id && !serverIdSet.has(localItem.id) && !serverSlugSet.has(localItem.slug)) {
          newLocalOnlyItems.push(localItem);
          // Persist user's newly created local item to server immediately
          fetch("/api/subscriptions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(localItem)
          }).catch(() => {});
        }
      });
    }

    // Merge: newly added local items first, followed by authoritative server items
    const mergedMap = new Map<string, AppSubscriptionItem>();
    newLocalOnlyItems.forEach(item => mergedMap.set(item.id, item));
    baseList.forEach(item => mergedMap.set(item.id, item));

    const merged = Array.from(mergedMap.values());
    inMemorySubscriptions = merged;
    if (typeof window !== "undefined") {
      localStorage.setItem(SUBSCRIPTIONS_STORAGE_KEY, JSON.stringify(merged));
      window.dispatchEvent(new Event("advertyx_subscriptions_updated"));
    }
    return merged;
  } catch (err) {
    const fallback = getStoredSubscriptions();
    return fallback.length > 0 ? fallback : APP_SUBSCRIPTIONS;
  }
}

export function getStoredSubscriptions(): AppSubscriptionItem[] {
  if (typeof window === "undefined") {
    return inMemorySubscriptions.length > 0 ? inMemorySubscriptions : APP_SUBSCRIPTIONS;
  }

  // Trigger background server sync on first call
  if (!hasFetchedServerSubscriptions) {
    hasFetchedServerSubscriptions = true;
    fetchSubscriptionsFromServer();
  }

  try {
    const raw = localStorage.getItem(SUBSCRIPTIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SUBSCRIPTIONS_STORAGE_KEY, JSON.stringify(APP_SUBSCRIPTIONS));
      inMemorySubscriptions = APP_SUBSCRIPTIONS;
      return APP_SUBSCRIPTIONS;
    }
    const parsed: AppSubscriptionItem[] = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Deduplicate by ID
      const dedupedMap = new Map<string, AppSubscriptionItem>();
      parsed.forEach(item => {
        if (item && item.id) {
          dedupedMap.set(item.id, item);
        }
      });
      const cleaned = Array.from(dedupedMap.values());
      inMemorySubscriptions = cleaned;
      return cleaned;
    }
    return inMemorySubscriptions.length > 0 ? inMemorySubscriptions : APP_SUBSCRIPTIONS;
  } catch (err) {
    return inMemorySubscriptions.length > 0 ? inMemorySubscriptions : APP_SUBSCRIPTIONS;
  }
}

export function addSubscriptionItem(newItem: AppSubscriptionItem): AppSubscriptionItem[] {
  const current = getStoredSubscriptions();
  const existsIndex = current.findIndex(item => item.id === newItem.id);
  let updated: AppSubscriptionItem[];
  if (existsIndex >= 0) {
    updated = [...current];
    updated[existsIndex] = { ...current[existsIndex], ...newItem };
  } else {
    updated = [newItem, ...current];
  }
  inMemorySubscriptions = updated;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(SUBSCRIPTIONS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("advertyx_subscriptions_updated"));

      // Sync to Server API
      fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem)
      }).catch(e => console.error("Server subscription sync error:", e));
    } catch (e) {
      console.error(e);
    }
  }
  return updated;
}

export function updateSubscriptionItem(updatedItem: AppSubscriptionItem): AppSubscriptionItem[] {
  const current = getStoredSubscriptions();
  const updated = current.map(item => (item.id === updatedItem.id || item.slug === updatedItem.slug) ? updatedItem : item);
  inMemorySubscriptions = updated;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(SUBSCRIPTIONS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("advertyx_subscriptions_updated"));

      // Sync to Server API
      fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem)
      }).catch(e => console.error("Server subscription update error:", e));
    } catch (e) {
      console.error(e);
    }
  }
  return updated;
}

export function deleteSubscriptionItem(id: string): AppSubscriptionItem[] {
  const current = getStoredSubscriptions();
  const updated = current.filter(item => item.id !== id);
  inMemorySubscriptions = updated;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(SUBSCRIPTIONS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("advertyx_subscriptions_updated"));

      // Sync delete with server
      fetch(`/api/subscriptions?id=${encodeURIComponent(id)}`, {
        method: "DELETE"
      }).catch(e => console.error("Server subscription delete error:", e));
    } catch (e) {
      console.error(e);
    }
  }
  return updated;
}

// ============================================================================
// 4. SERVICES STORE
// ============================================================================
export function getStoredServices(): ServiceItem[] {
  if (typeof window === "undefined") {
    return inMemoryServices;
  }
  try {
    const raw = localStorage.getItem(SERVICES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(AGENCY_SERVICES));
      return AGENCY_SERVICES;
    }
    const parsed = JSON.parse(raw);
    inMemoryServices = parsed;
    return parsed;
  } catch (err) {
    return inMemoryServices;
  }
}

export function updateServiceItem(updatedService: ServiceItem): ServiceItem[] {
  const current = getStoredServices();
  const updated = current.map(s => s.id === updatedService.id ? updatedService : s);
  inMemoryServices = updated;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("advertyx_services_updated"));
    } catch (e) {
      console.error(e);
    }
  }
  return updated;
}

// ============================================================================
// 5. ORDERS STORE (ZERO FAKE DEMO CUSTOMERS)
// ============================================================================
export function getStoredOrders(): OrderItem[] {
  if (typeof window === "undefined") {
    return inMemoryOrders;
  }
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      // Empty by default — NO fake demo customers!
      return [];
    }
    const parsed = JSON.parse(raw);
    inMemoryOrders = parsed;
    return parsed;
  } catch (err) {
    return inMemoryOrders;
  }
}

export function addOrder(newOrder: OrderItem): OrderItem[] {
  const current = getStoredOrders();
  const updated = [newOrder, ...current];
  inMemoryOrders = updated;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("advertyx_orders_updated"));
    } catch (e) {
      console.error(e);
    }
  }
  return updated;
}

export function fulfillOrder(orderId: string): OrderItem[] {
  const current = getStoredOrders();
  const updated = current.map(o => o.id === orderId ? { ...o, status: "Delivered & Active" as const } : o);
  inMemoryOrders = updated;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("advertyx_orders_updated"));
    } catch (e) {
      console.error(e);
    }
  }
  return updated;
}

export function deliverOrderCredentials(orderId: string, credentials: string, note?: string): OrderItem[] {
  const current = getStoredOrders();
  const updated = current.map(o => o.id === orderId ? { 
    ...o, 
    status: "Delivered & Active" as const,
    deliveredCredentials: credentials,
    deliveryNote: note
  } : o);
  inMemoryOrders = updated;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("advertyx_orders_updated"));
    } catch (e) {
      console.error(e);
    }
  }
  return updated;
}

export function clearAllOrders(): OrderItem[] {
  inMemoryOrders = [];
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(ORDERS_STORAGE_KEY);
      window.dispatchEvent(new Event("advertyx_orders_updated"));
    } catch (e) {
      console.error(e);
    }
  }
  return [];
}

// ============================================================================
// 6. REFERRAL / AFFILIATE EARNING & PAYOUTS STORE
// ============================================================================
export function getReferralSettings(): ReferralCommissionSettings {
  if (typeof window === "undefined") return inMemoryReferralSettings;
  try {
    const raw = localStorage.getItem(REFERRAL_SETTINGS_KEY);
    if (!raw) return inMemoryReferralSettings;
    const parsed = JSON.parse(raw);
    const course = parsed.courseEnrollmentPKR ?? parsed.largeServicePKR ?? 20;
    const app = parsed.appSubscriptionPKR ?? parsed.smallProductPKR ?? 10;
    return {
      courseEnrollmentPKR: course,
      appSubscriptionPKR: app,
      largeServicePKR: course,
      smallProductPKR: app
    };
  } catch (err) {
    return inMemoryReferralSettings;
  }
}

export function saveReferralSettings(settings: ReferralCommissionSettings): void {
  inMemoryReferralSettings = settings;
  if (typeof window !== "undefined") {
    localStorage.setItem(REFERRAL_SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event("advertyx_referral_updated"));
  }
}

export function getPayoutRequests(): PayoutRequest[] {
  if (typeof window === "undefined") return inMemoryPayouts;
  try {
    const raw = localStorage.getItem(PAYOUTS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

export function addPayoutRequest(req: PayoutRequest): PayoutRequest[] {
  const current = getPayoutRequests();
  const updated = [req, ...current];
  inMemoryPayouts = updated;
  if (typeof window !== "undefined") {
    localStorage.setItem(PAYOUTS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("advertyx_payouts_updated"));
  }
  return updated;
}

export function approvePayoutRequest(id: string): PayoutRequest[] {
  const current = getPayoutRequests();
  const updated = current.map(p => p.id === id ? { ...p, status: "Approved & Paid" as const } : p);
  inMemoryPayouts = updated;
  if (typeof window !== "undefined") {
    localStorage.setItem(PAYOUTS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("advertyx_payouts_updated"));
  }
  return updated;
}

