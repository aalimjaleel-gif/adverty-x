import { 
  ACADEMY_COURSES, 
  APP_SUBSCRIPTIONS, 
  AGENCY_SERVICES,
  CourseItem, 
  AppSubscriptionItem, 
  ServiceItem 
} from "@/data/mockData";

export interface OrderItem {
  id: string;
  customer: string;
  customerEmail?: string;
  product: string;
  amount: string;
  date: string;
  status: "Awaiting Delivery" | "Delivered & Active" | "Completed";
  type: "subscription" | "course" | "service";
  tid?: string;
  paymentMethod?: string;
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

const COURSES_STORAGE_KEY = "advertyx_courses_data";
const SUBSCRIPTIONS_STORAGE_KEY = "advertyx_subscriptions_data";
const SERVICES_STORAGE_KEY = "advertyx_services_data";
const ORDERS_STORAGE_KEY = "advertyx_orders_data";
const AUTH_STORAGE_KEY = "advertyx_admin_logged_in";
const REFERRAL_SETTINGS_KEY = "advertyx_referral_settings";
const PAYOUTS_STORAGE_KEY = "advertyx_payout_requests";

// In-memory fallbacks
let inMemoryCourses: CourseItem[] = [...ACADEMY_COURSES];
let inMemorySubscriptions: AppSubscriptionItem[] = [...APP_SUBSCRIPTIONS];
let inMemoryServices: ServiceItem[] = [...AGENCY_SERVICES];
let inMemoryOrders: OrderItem[] = []; // ZERO demo customers by default
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
  provider?: string;
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

  if (!raw) return null;
  try {
    return JSON.parse(raw);
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

    // Read user's local subscriptions so newly added/edited items are NEVER lost
    let localSubs: AppSubscriptionItem[] = [];
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(SUBSCRIPTIONS_STORAGE_KEY);
        if (raw) localSubs = JSON.parse(raw);
      } catch (e) {}
    }

    const map = new Map<string, AppSubscriptionItem>();

    // 1. Populate base from server or default mockData
    const baseList = Array.isArray(serverSubs) && serverSubs.length > 0 ? serverSubs : APP_SUBSCRIPTIONS;
    baseList.forEach(s => map.set(s.id, s));

    // 2. User's local subscriptions take priority and are preserved
    if (Array.isArray(localSubs)) {
      localSubs.forEach(localItem => {
        if (!map.has(localItem.id)) {
          map.set(localItem.id, localItem);
          // Sync new local item to server
          fetch("/api/subscriptions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(localItem)
          }).catch(() => {});
        } else {
          // If local item has updated details (e.g. customized price/warranty), keep local
          map.set(localItem.id, localItem);
        }
      });
    }

    const merged = Array.from(map.values());
    inMemorySubscriptions = merged;
    if (typeof window !== "undefined") {
      localStorage.setItem(SUBSCRIPTIONS_STORAGE_KEY, JSON.stringify(merged));
      window.dispatchEvent(new Event("advertyx_subscriptions_updated"));
    }
    return merged;
  } catch (err) {
    return inMemorySubscriptions.length > 0 ? inMemorySubscriptions : APP_SUBSCRIPTIONS;
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
    
    // Deduplicate by slug and id
    const dedupedMap = new Map<string, AppSubscriptionItem>();
    const seenSlugs = new Set<string>();
    parsed.forEach(item => {
      const key = item.slug || item.id;
      if (!seenSlugs.has(key)) {
        seenSlugs.add(key);
        dedupedMap.set(item.id, item);
      }
    });

    const cleaned = Array.from(dedupedMap.values());
    inMemorySubscriptions = cleaned;
    return cleaned;
  } catch (err) {
    return inMemorySubscriptions.length > 0 ? inMemorySubscriptions : APP_SUBSCRIPTIONS;
  }
}

export function addSubscriptionItem(newItem: AppSubscriptionItem): AppSubscriptionItem[] {
  const current = getStoredSubscriptions();
  const existsIndex = current.findIndex(item => item.id === newItem.id || item.slug === newItem.slug);
  let updated: AppSubscriptionItem[];
  if (existsIndex >= 0) {
    updated = [...current];
    updated[existsIndex] = { ...newItem, id: current[existsIndex].id };
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

