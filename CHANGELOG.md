# ADVERTY X — PROJECT CHANGELOG

> **Permanent Source of Truth**  
> *Format:* Standard Keep a Changelog & Phase History  
> *Rule:* Every phase completion records files created/modified, database changes, environment variables, tests executed, known issues, and the exact next step.

---

## [Phase 3: Custom Lectures Builder, Clean Real Orders, On-Site Web Video Playback & Services Admin] — 2026-10-17

### Added & Upgraded
- **Clean Lecture Builder (User Adds Lectures Personally)**:
  - Removed all fake pre-filled demo lectures from the Course Modal.
  - The lectures builder now starts completely clean with an intuitive `+ Add Lecture` button where the admin specifies Lecture Title, Video URL, and Duration themselves.
- **100% In-Platform On-Site Video Player (No Downloads)**:
  - Removed all "Download Video" buttons and MP4 download triggers.
  - In `/academy/[slug]`, lectures now stream directly inside the website's built-in interactive classroom video player.
- **Navbar Admin Profile State**:
  - Top header now dynamically displays the Admin Profile Badge (`AX Admin Panel`) and Logout button when logged in, eliminating the static "Login" button.
- **Zero Demo Customers (Clean Real Order Queue)**:
  - Removed all hardcoded fake customers (e.g. Farhan Ali, Bilal Traders, 0300 numbers) from the Orders table.
  - Orders tab now defaults to a clean empty state with support for real store orders and `+ Record Manual Order`.
- **Services & Packages Admin Management Tab**:
  - Added dedicated **"Services & Packages"** tab in the admin sidebar.
  - Full access to adjust agency starting rates ($299, $399, $99 Video Add-on, etc.) and inspect deliverables.
- **Streamlined Sidebar**:
  - Removed confusing wholesale margin tab in favor of a clean, focused admin workflow.

---

## [Phase 2: Master Admin Control, Free Courses & 1-by-1 Video Downloads] — 2026-10-17

### Added & Upgraded
- **Admin Panel Isolation & Gatekeeper Security**:
  - Completely removed "Admin Panel" button from public navigation (`Navbar.tsx`) and `Footer.tsx`.
  - Removed all admin banners and switcher buttons from the client dashboard (`/dashboard`) so clients never see or access admin tools.
  - `/admin` is locked by default with an Administrative Sign-In portal requiring Email (`admin@advertyx.com`) and Password (`AdminPassword123!`).
  - Added session locking ("Lock Panel") to safely log out.

- **Interactive Admin Control Panel Features**:
  - **Courses & Academy Manager**:
    - Dedicated tab with full table view of all existing courses.
    - Interactive **`+ Add New Course` Modal**: Allows adding courses 1-by-1 with Title, Category, Free vs Paid toggle, Price, Thumbnail URL (with quick photography presets + live preview), Duration, and Lesson-by-lesson video curriculum builder.
    - Inline course editor and delete course handler.
  - **App Subscriptions & Price Editor**:
    - Interactive **Inline Price Editor**: Click "Change Price" on any subscription (e.g. CapCut Pro, Netflix, YouTube) to adjust Retail Price (PKR) and Internal Wholesale Cost with instant "Save Price" confirmation.
    - Live **Stock Status Toggle**: Mark apps in-stock or out-of-stock instantly.
  - **Client Store Synchronization (`src/lib/store.ts`)**:
    - Browser `localStorage` and reactive event bus synchronization so price changes and new courses added in `/admin` immediately reflect on the public `/academy` and `/subscriptions` pages.

- **Academy Upgrades (Free Courses & 1-by-1 Video Downloads)**:
  - Added dedicated **"Free Courses"** category filter in `/academy`.
  - Free courses feature vibrant **100% FREE** badge, zero payment barrier, and instant **Start Free** access.
  - **Lesson-by-Lesson Video Downloads**: In `/academy/[slug]`, every single lesson includes a direct **"Download Video (MP4)"** button allowing students to download video files individually.

- **Fluid Modern Theme & Container Widths**:
  - Replaced restrictive `max-w-7xl` (1280px) across all pages (`/`, `/academy`, `/subscriptions`, `/services`, `/pricing`, `/portfolio`, `/contact`, `/about`) with fluid modern `max-w-[1600px] w-full px-4 sm:px-8 lg:px-12`.
  - Eliminated the squeezed center appearance and blank side borders on wide monitors.

---

## [Phase 1: Design System & Public Agency Website] — 2026-10-17

### Added
- **Full Next.js 15 & Tailwind Architecture**:
  - `package.json`, `tsconfig.json`, `postcss.config.mjs`, `tailwind.config.ts`, `next.config.mjs`.
  - Design system with custom brand color tokens (`#7C3AED` royal purple, `#2563EB` blue, `#0B132B` deep navy, `#FFFFFF` crisp canvas, subtle box shadows).
  - `src/app/globals.css` with responsive utilities, glassmorphism, and custom scrollbars.
  - `src/components/layout/Navbar.tsx`: Responsive navigation with brand mark, services mega dropdown, division badges, mobile drawer, login and CTA buttons.
  - `src/components/layout/Footer.tsx`: 5-column deep navy footer with social links, quick links, services breakdown, and legal compliance links.
  - `src/data/mockData.ts`: Centralized data store for agency services, packages, courses, subscriptions, portfolio case studies, Ahmed Khan's client dashboard preview, and FAQs.

- **All Public Pages Implemented (Matching Reference Preview Image)**:
  - `/` (`src/app/page.tsx`): Hero section with headline *"Build Your Brand. Grow Your Business. With Adverty X."*, 6-pill category feature strip, Our Services grid with **Video Editing (Paid Add-on)** badge, Academy showcase, Subscriptions showcase with weekly/monthly/yearly toggles, interactive FAQ accordion, and dark CTA card.
  - `/services` (`src/app/services/page.tsx`): Comprehensive services hub with 6 service cards, deliverables breakdown, and prominent video editing policy banner.
  - `/services/website-design` (`src/app/services/website-design/page.tsx`): 3 scoped frontend packages ($299, $499, $899).
  - `/services/website-redesign` (`src/app/services/website-redesign/page.tsx`): Interactive redesign questionnaire capturing current URL, business type, pain points, budget, and target deadline.
  - `/services/automation` (`src/app/services/automation/page.tsx`): Workflow automation, CRM integrations, and lead capture.
  - `/services/social-media-management` (`src/app/services/social-media-management/page.tsx`): Packages with **MANDATORY VIDEO EDITING POLICY BANNER** explicitly clarifying that video editing is not included by default and requires the separate add-on.
  - `/services/paid-advertising` (`src/app/services/paid-advertising/page.tsx`): Meta & TikTok campaign management with strict separation of agency fees vs ad spend.
  - `/services/video-editing` (`src/app/services/video-editing/page.tsx`): Dedicated video editing add-on & standalone service page with turnaround times, capped 2-round revisions, and rates from $99.
  - `/pricing` (`src/app/pricing/page.tsx`): Dynamic agency package calculator allowing clients to pick a base package, toggle the video editing add-on, see the subtotal, and submit an order.
  - `/portfolio` (`src/app/portfolio/page.tsx`): Verified case studies with real growth metrics and category filter tabs.
  - `/academy` (`src/app/academy/page.tsx`): Course catalog matching the reference preview with search, category filtering, rating stars, and lifetime access guarantees.
  - `/academy/[slug]` (`src/app/academy/[slug]/page.tsx`): Individual course syllabus accordion, preview lesson streaming simulator, and one-time enrollment card.
  - `/subscriptions` (`src/app/subscriptions/page.tsx`): Tool & services subscription catalog with weekly/monthly/yearly tabs, fixed duration vs recurring access toggle, 3 plans (Basic $9, Pro $19, Business $39), and popular tools (Canva Pro, ChatGPT Plus, Adobe CC).
  - `/dashboard` (`src/app/dashboard/page.tsx`): Full client dashboard matching the bottom-left Ahmed Khan preview with 4 stat cards, recent orders table, and course progress bars.
  - `/admin` (`src/app/admin/page.tsx`): Full Master Admin Control Hub with interactive inventory controls (Add App, Edit Price, Toggle In-Stock/Out-of-Stock, Delete), Order Credential Delivery & Fulfillment Queue, Academy course manager, Agency services & Video add-on rate adjuster, User role permissions manager, Confidential profit margins tracker, and Site-wide CMS settings (hero text, WhatsApp contact, announcement banners).
  - `/dashboard` (`src/app/dashboard/page.tsx`): Client Dashboard (Ahmed Khan) enhanced with a top alert banner and sidebar switcher directly pointing to the Master Admin Panel (`/admin`).
  - `/login` (`src/app/login/page.tsx`): Enhanced with direct 1-click admin portal login button (`admin@advertyx.com`).
  - `Navbar.tsx`: Added direct `Admin Panel` button in top header bar.

### Tests Executed & Actual Results
- **Production Build Check**: `npm.cmd run build` executed successfully.
  - 24/24 static and dynamic routes compiled with zero errors.
- **Runtime Server Verification**: `npm.cmd run start` running on `http://localhost:3000`.
- **HTTP Endpoint Validation**: Executed PowerShell automated requests against all primary routes; all returned **HTTP 200 OK**.
- **Business Rule Enforcement**:
  - Video editing is clearly marked as a separate paid add-on on `/services`, `/services/social-media-management`, `/services/video-editing`, and `/pricing`.
  - Course lifetime access is displayed across `/academy`, `/academy/[slug]`, and `/dashboard`.
  - Fixed-duration vs recurring billing models are switchable on `/subscriptions`.

### Known Issues & Unfinished Features
- Database backend and live authentication sessions are scheduled for Phase 2.

### Next Step
- Phase 1 is complete. Await user review and authorization to proceed to **PHASE 2 — DATABASE, AUTHENTICATION, AND DASHBOARDS** (Prisma ORM schema migrations, secure session auth, RBAC, and server-side route protection).

---

## [Phase 0: Inspection, Architecture & Master Documentation] — 2026-10-17
- Initial baseline documentation established (`PROJECT_CONTEXT.md`, `IMPLEMENTATION_PLAN.md`, `FEATURE_STATUS.md`, `DATABASE_SCHEMA.md`, `SECURITY_CHECKLIST.md`, `CHANGELOG.md`, `.env.example`, `.gitignore`).
