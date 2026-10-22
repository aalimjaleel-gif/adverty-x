# ADVERTY X — IMPLEMENTATION PLAN

> **Permanent Source of Truth**  
> *Last Updated:* Phase 0 — Baseline Architecture & Phased Roadmap  
> *Status:* Phase 0 in Progress | Phase 1 Pending Review & Approval

---

## 1. Roadmap Overview & Phase Sequence

The implementation follows a disciplined, 8-phase lifecycle (Phase 0 through Phase 7). Each phase builds strictly on the validated foundation of preceding phases, maintaining working code, zero regressions, and full documentation sync.

```
[ Phase 0: Inspect & Plan ]  <-- CURRENT PHASE
          |
          v
[ Phase 1: Design System & Public Agency Website ]
          |
          v
[ Phase 2: Database, Authentication & Dashboards ]
          |
          v
[ Phase 3: Service Orders & Project Management ]
          |
          v
[ Phase 4: Academy & Lifetime Course Access ]
          |
          v
[ Phase 5: Subscriptions & Fulfillment ]
          |
          v
[ Phase 6: Integration & Security Hardening ]
          |
          v
[ Phase 7: Production Readiness ]
```

---

## 2. Detailed Phase Specifications

### PHASE 0 — INSPECT AND PLAN (Current)

- **Objective**: Assess workspace environment, establish master architecture, define data models and security protocols, establish living project documentation files, and prepare Phase 1 setup.
- **Key Deliverables**:
  - Environment toolchain assessment (Node.js, npm, Windows shell compatibility).
  - 6 Master Documentation Files:
    - `PROJECT_CONTEXT.md`
    - `IMPLEMENTATION_PLAN.md`
    - `FEATURE_STATUS.md`
    - `DATABASE_SCHEMA.md`
    - `SECURITY_CHECKLIST.md`
    - `CHANGELOG.md`
  - `.env.example` with safe placeholder variable names.
  - `.gitignore` configured for Node, Next.js, and Prisma.
- **Acceptance Criteria**:
  - [x] Repository inspected; zero accidental deletions of existing files.
  - [x] All 6 master documentation files created with thorough specifications.
  - [x] Architectural decisions, technology stack, and database relations formally documented.
  - [x] Phase 1 scope and acceptance criteria clearly defined.
  - [x] Awaiting user review and authorization before proceeding to Phase 1.

---

### PHASE 1 — DESIGN SYSTEM AND PUBLIC AGENCY WEBSITE (Completed 🟢)

- **Objective**: Establish the modern white/navy/purple agency design system and build out all 20 public pages with working navigation, responsive layouts, interactive cards, pricing calculators, contact/inquiry forms, and strict video-editing policy disclosures.
- **Dependencies**: Phase 0 documentation sign-off.
- **Scope & Deliverables**:
  1. **Next.js & Tailwind Foundation**:
     - Modern Next.js App Router project initialized with TypeScript (`strict: true`), Tailwind CSS, and Lucide React.
     - Custom design system tokens (`globals.css`): White canvas (`#FFFFFF`/`#F8FAFC`), Slate/Navy typography (`#0F172A`/`#1E293B`), Electric Purple (`#7C3AED`) and Vibrant Blue (`#2563EB`) accents, refined shadows, accessible focus rings.
     - Global components: Responsive Header/Navigation with mobile drawer, Mega Menu for Services, Division Switcher, and Footer with complete legal/service links.
  2. **Public Pages (20+ Routes Implemented & Verified)**:
     - `/` — High-converting Agency Homepage matching reference preview.
     - `/services` — Agency Services Hub with 6 cards and video editing banner.
     - `/services/website-design` — Custom Web Design service page with 3 pricing tiers.
     - `/services/website-redesign` — Website Redesign audit request form.
     - `/services/automation` — Business Automation & CRM pipelines showcase.
     - `/services/social-media-management` — Social media handling with **PROMINENT VIDEO EDITING POLICY NOTICE**.
     - `/services/paid-advertising` — Meta & TikTok Paid Ads campaign management page.
     - `/services/video-editing` — Standalone Paid Video Editing service & add-on page ($99+).
     - `/pricing` — Interactive Agency Packages & Video Add-on Calculator.
     - `/portfolio` — Case Studies with realistic client metrics & category filters.
     - `/academy` — Course Catalog matching reference preview with search & filters.
     - `/academy/[slug]` — Course overview page with curriculum accordion & preview player.
     - `/subscriptions` — Subscription Marketplace with duration selector (Fixed vs Recurring).
     - `/dashboard` — Client Dashboard matching Ahmed Khan preview.
     - `/about` — About Adverty X (Mission, Leadership, Agency Philosophy).
     - `/contact` — Interactive contact and project inquiry form with validation.
     - `/login` — Accessible login interface with demo toggle.
     - `/signup` — Registration interface with client/student role options.
     - `/forgot-password` — Password recovery request page.
     - `/privacy-policy`, `/terms`, `/refund-policy` — Complete legal policies.
     - `not-found.tsx`, `error.tsx` — Custom branded error pages.
- **Acceptance Criteria**:
  - [x] All 20+ public routes load without console errors or layout shifts (HTTP 200 verified).
  - [x] Video editing is unmistakably marked as a separate paid add-on on all service and pricing sections.
  - [x] Forms validate user input (required fields, email format, budget ranges) with visual feedback.
  - [x] Mobile menu and interactive filters work smoothly with zero horizontal scroll overflow.
  - [x] Production build passes cleanly with 24/24 static and dynamic routes compiled.

---

### PHASE 2 — DATABASE, AUTHENTICATION, AND DASHBOARDS

- **Objective**: Establish the database schema with Prisma ORM, implement secure authentication with role-based access control, and build out client and administrator dashboard foundations.
- **Dependencies**: Phase 1 design system and routing.
- **Scope & Deliverables**:
  1. **Database Schema & Migrations**:
     - Prisma schema with PostgreSQL support (with connection fallback configuration for local dev).
     - Tables: Users, Roles, Sessions, Inquiries, Projects, Courses, Lessons, Enrollments, SubscriptionProducts, SubscriptionPlans, CustomerSubscriptions, Orders, OrderItems, Payments, SupportTickets, AuditLogs.
     - Seeding script with realistic demo data, roles, and a test admin account (with clearly isolated test credentials).
  2. **Authentication & Session System**:
     - Secure registration, login, logout, password reset flow with cryptographic tokens.
     - HttpOnly SameSite cookie sessions.
     - Password hashing with bcrypt/Argon2.
     - API route rate limiting for auth endpoints.
  3. **Dashboard Shells**:
     - Client Dashboard layout (`/dashboard/*`): Sidebar, user menu, stats overview, quick actions.
     - Admin Dashboard layout (`/admin/*`): Multi-tier navigation, financial KPI cards, role badges.
     - Middleware enforcing route protection and role-based access control.
- **Acceptance Criteria**:
  - Secure auth flow tested (registration, login, invalid attempts rate limited).
  - Client users cannot access `/admin/*` routes (returns 403 / redirect).
  - Unauthenticated users cannot access `/dashboard/*` routes (redirects to `/login`).
  - Database seed succeeds with complete relation integrity.

---

### PHASE 3 — SERVICE ORDERS AND PROJECT MANAGEMENT

- **Objective**: Build the end-to-end agency service order lifecycle, client project tracking, admin project management, and video-editing add-on selection.
- **Dependencies**: Phase 2 database and auth.
- **Scope & Deliverables**:
  - Client service inquiry and quote generation workflow.
  - Selection of base packages (Web Design, Redesign, Automation, Social Media) and optional Video Editing Add-on.
  - Client dashboard `/dashboard/projects`: Project milestones, timeline, assigned manager, deliverable file downloads, revision request submissions.
  - Admin dashboard `/admin/services` & `/admin/projects`: Status transitions (Inquiry -> Quoted -> In Progress -> Review -> Completed), internal notes, team member assignment.
- **Acceptance Criteria**:
  - Clients can submit detailed inquiries and track status in real-time.
  - Video editing add-on can be selected and billed as a distinct item.
  - Client/admin permission boundaries tested (clients only see their own projects).

---

### PHASE 4 — ACADEMY AND LIFETIME COURSE ACCESS

- **Objective**: Implement the complete learning management system, course catalog, modular curriculum, admin course editor, test checkout, verified enrollment, and video player with signed URL simulation.
- **Dependencies**: Phase 2 database and auth.
- **Scope & Deliverables**:
  - Public course catalog with category filters, difficulty tags, and preview badges.
  - Course details page with curriculum accordion and preview lesson playback.
  - Admin course manager: Create course, add modules, create lessons, attach resources, set one-time fixed price, publish/unpublish.
  - Test checkout for one-time course purchase.
  - Enrollment engine: Verified purchase creates permanent Enrollment record (`lifetimeAccess: true`).
  - Student classroom (`/dashboard/courses/[slug]/learn/[lessonId]`): Video player, lesson checkoff, progress percentage, resource download links.
  - **Lifetime Access Verification**: Expiring a subscription does not alter course enrollment status.
- **Acceptance Criteria**:
  - Enrolled student can watch lessons and track progress.
  - Non-enrolled user cannot access private lesson URLs (returns 403 Forbidden).
  - Course access persists indefinitely and is verified independent of subscription status.

---

### PHASE 5 — SUBSCRIPTIONS AND FULFILLMENT

- **Objective**: Build the digital subscription catalog, fixed-duration vs recurring billing logic, manual/automated fulfillment tracker, and admin-only gross margin financial reporting.
- **Dependencies**: Phase 2 database and auth.
- **Scope & Deliverables**:
  - Subscription marketplace: Products, weekly/monthly/yearly plans, and fixed-duration access (7, 30, 90, 365 days).
  - Checkout flow with plan duration confirmation and auto-renew disclaimers.
  - Order verification and CustomerSubscription record activation.
  - Client dashboard `/dashboard/subscriptions`: Active subscriptions, remaining days countdown, license/access credentials, renewal options.
  - Admin dashboard `/admin/subscriptions`:
    - Manage retail selling prices and private internal supplier costs.
    - Gross margin & gross profit dashboard (Admin only).
    - Fulfillment pipeline: Awaiting fulfillment, Provisioned, Active, Suspended, Expired.
- **Acceptance Criteria**:
  - Fixed-duration subscriptions calculate exact expiration timestamp and expire cleanly without auto-charging.
  - Customer cannot view internal supplier costs or gross margins via frontend code or network payloads.
  - Admin can update fulfillment state and deliver access instructions to client securely.

---

### PHASE 6 — INTEGRATION AND SECURITY HARDENING

- **Objective**: Conduct rigorous end-to-end testing, security penetration audit, anti-IDOR checks, rate-limiting verification, responsive polishing, and production build checks.
- **Dependencies**: Phases 1 through 5.
- **Scope & Deliverables**:
  - Unit and integration tests for critical business rules (payment verification, lifetime access, subscription expiry).
  - Authorization audit: Attempt IDOR attacks on orders, projects, courses, and subscriptions.
  - Webhook simulation tests: Verify HMAC signatures, reject forged payloads, test idempotency.
  - Accessibility (a11y) audit: Keyboard navigation, ARIA labels, focus traps.
  - Performance audit: Next.js bundle analysis, image optimization, dynamic imports.
  - Production build execution: `npm run build` must compile cleanly with zero TypeScript or linting errors.
- **Acceptance Criteria**:
  - Zero high or critical security vulnerabilities.
  - All test suites pass.
  - Production build passes with exit code 0.

---

### PHASE 7 — PRODUCTION READINESS

- **Objective**: Prepare production configuration guidelines, deployment documentation, database migration procedures, environment variable verification, and operational runbooks.
- **Dependencies**: Phase 6 sign-off.
- **Scope & Deliverables**:
  - Production deployment runbook (Vercel / AWS / VPS with Docker).
  - Database backup and recovery documentation.
  - Production environment checklist (HTTPS, real gateway keys, webhook secrets, SMTP provider).
  - Admin operational handover guide.
- **Acceptance Criteria**:
  - Ready for deployment without code modifications.
  - User authorization required before public go-live.
