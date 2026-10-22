# ADVERTY X — PROJECT CONTEXT & MASTER SPECIFICATION

> **Permanent Source of Truth**  
> *Last Updated:* Phase 0 — Initial Project Planning & Specification Baseline  
> *Status:* Active Specification

---

## 1. Executive Summary & Brand Identity

**Adverty X** is a high-end, production-grade digital platform operating three distinct, independent commercial divisions under a unified, cohesive brand identity:

1. **Agency Services**: High-impact digital marketing, custom website design & redesign, workflow automation, paid advertising campaigns, and social media management, featuring a strict and transparent policy on video editing (offered exclusively as a separate paid add-on).
2. **Adverty X Academy**: An e-learning platform delivering premium digital courses with one-time purchases, guaranteed lifetime access, modular curriculums, lesson progress tracking, and protected video streaming.
3. **Adverty X Subscriptions**: A dedicated digital tools, services, and software subscription marketplace supporting both fixed-duration access (e.g., 7, 30, 90, 365 days) and recurring billing, with secure order fulfillment workflows and confidential internal supplier cost/margin tracking for administrators.

### Brand Personality & Visual Direction
- **Brand Personality**: Modern, professional, trustworthy, creative, and technology-focused. Built for business owners, startups, creators, and ambitious students.
- **Visual Palette**: 
  - Canvas: Clean white background (`#FFFFFF` / `#F8FAFC`) with subtle cool-neutral contrasts.
  - Typography: Dark navy / charcoal (`#0F172A`, `#1E293B`, `#334155`).
  - Brand Accents: Royal Purple (`#7C3AED` / `#6D28D9`) and Electric Blue (`#2563EB` / `#1D4ED8`) with harmonious gradient accents for badges, buttons, and high-impact hero elements.
  - Success / Alert / State Accents: Emerald (`#059669`), Amber (`#D97706`), Rose (`#E11D48`).
- **Design Philosophy**:
  - Crisp cards with hairline borders (`#E2E8F0`), soft ambient shadows, and glassmorphic elevated overlays.
  - Modern typography using clean Google Fonts (Inter / Outfit / Plus Jakarta Sans).
  - Clear visual hierarchy, generous whitespace, accessible contrast (WCAG AAA/AA compliant).
  - Absolutely NO childish illustrations, generic AI-style bloated 3D graphics, or messy neon clutter.
  - Authentic digital agency aesthetic with verified demo data, realistic portfolios, and real-world package definitions.

---

## 2. Business Divisions & Commercial Rules

### Division 1: Agency Services

The agency wing serves businesses, founders, and creators seeking bespoke digital growth.

#### Service Catalog & Scope
1. **Frontend Website Design**:
   - Modern business websites, landing pages, interactive portfolios, and responsive web apps.
   - Built with Next.js, HTML5/CSS3, Tailwind CSS, TypeScript, and modern accessibility standards.
   - Deliverables clearly scoped: Frontend UI, responsiveness, performance optimization, SEO setup, and usability. Backend integrations are clearly excluded unless explicitly scoped.
2. **Website Redesign**:
   - Comprehensive audit and transformation of existing slow, outdated, or low-converting websites.
   - Dedicated intake questionnaire: Current URL, business type, core friction points, target references, budget range, deadline, and asset availability.
3. **Business & Workflow Automation**:
   - Automated lead capture pipelines, customer follow-up sequences, CRM integrations, and webhook-driven notifications.
   - Explicit rule: Third-party integrations (e.g., WhatsApp Business API, Zapier, Make, HubSpot) are only advertised once tested and verified with appropriate credentials.
4. **Social Media Account Management**:
   - Dedicated management for Facebook, Instagram, TikTok, LinkedIn, and custom platforms.
   - Scope includes: Content calendar planning, caption copywriting, hashtag strategy, post scheduling, community engagement coordination, and monthly analytics reporting.
   - **CRITICAL VIDEO EDITING POLICY**:
     - Standard social media management packages **DO NOT include video editing** by default. Clients must supply their own finished videos or hire video editing separately.
     - Video editing is strictly offered as a **separate paid add-on** with independent pricing, defined turnarounds, revision caps, and delivery scopes.
     - This policy must be prominently displayed across the public services page, pricing tables, inquiry forms, checkout, and terms of service.
5. **Paid Advertising**:
   - Meta Ads (Facebook & Instagram), TikTok Ads, and Google Ads management.
   - Strict separation of agency campaign management fees and client ad spend.
   - Clear client intake: Campaign objectives, target audience, budget, platforms, creative assets, landing page URLs.
   - Strict compliance: No client social media passwords requested; access is handled via Meta Business Manager / TikTok Partner Center / Google MCC delegations.
   - Legal disclaimer: No fabricated or guaranteed ROI promises; performance expectations are tied to data-backed optimizations.

#### Client Service Lifecycle
- Inquiry submission -> Admin / Manager review & triage -> Quote & Scope confirmation -> Order & Payment -> Project creation -> Team assignment -> Deliverable milestones & client review -> Revision rounds -> Project sign-off.

---

### Division 2: Adverty X Academy

A dedicated learning ecosystem designed to upskill students and professionals.

#### Course Architecture & Rules
- **Course Metadata**: Title, slug, subtitle, comprehensive description, thumbnail/preview media, instructor credentials, difficulty level, prerequisites, syllabus overview, and fixed one-time purchase price.
- **Curriculum Hierarchy**: Course -> Modules -> Lessons (video, downloadable resources, text notes, quizzes).
- **Payment & Enrollment Rules**:
  - Fixed one-time purchase via checkout.
  - **Lifetime Access Guarantee**: Once a student purchases a course, access to that course is permanently granted to their user account.
  - **Strict Access Independence**: Course access **never** expires when an unrelated tool subscription ends. Buying Course A does not unlock Course B.
  - **No Unpaid Access**: Lessons (except designated preview lessons) require server-verified enrollment.
  - **Video Protection**: Lesson videos utilize signed URLs, private video storage (e.g., Cloudflare Stream / Vimeo OTT / Mux / AWS CloudFront signed URLs), preventing unauthorized downloads or public hotlinking.

---

### Division 3: Adverty X Subscriptions

An independent digital tools and software subscription catalog.

#### Product Catalog & Capabilities
- **Product Metadata**: Name, slug, description, branding logo, feature matrix, selling price, internal supplier cost (ADMIN ONLY), currency, access duration model, fulfillment method.
- **Billing & Duration Models**:
  - **Model A: Fixed-Duration Access**: 7-day, 30-day, 90-day, or 365-day access windows. Access automatically terminates at the end of the duration unless manually repurchased. No unexpected auto-debits.
  - **Model B: Recurring Billing**: Weekly, monthly, yearly automatic renewal where payment gateway and card eligibility support recurring subscriptions.
- **Fulfillment Workflows**:
  - **Automatic Fulfillment**: System-generated license keys, automated invite links, or API-provisioned seats.
  - **Authorized Manual Fulfillment**: Admin or Support Agent provides authorized access credentials/seats within SLA (e.g., within 2-4 hours), tracking status in client dashboard.
  - **Compliance & Anti-Piracy Policy**: Only authorized reseller licenses, official API integrations, and legal partner arrangements are offered. No cracked software, shared unauthorized personal credentials, or terms violations.
- **Internal Gross Profit & Margin Management**:
  - System captures: `sellingPrice`, `internalCost` (supplier/wholesale cost), `grossProfit = sellingPrice - internalCost`, `marginPercentage`.
  - **Confidentiality Rule**: Internal cost and margin fields are strictly scrubbed on the server and NEVER exposed via client API payloads, HTML templates, or frontend bundles.

---

## 3. Technology Stack & Architecture

```
+-------------------------------------------------------------------------------+
|                                  CLIENT LAYER                                 |
| Next.js App Router (React Server Components + Interactive Client Components) |
| Tailwind CSS | Radix UI / Accessible Primitives | Lucide React Icons          |
+-------------------------------------------------------------------------------+
                                       |
                                       v
+-------------------------------------------------------------------------------+
|                               APPLICATION LAYER                               |
| Next.js Route Handlers & Server Actions (Node.js v24 Runtime)                |
| Zod Schema Validation | Session & RBAC Auth Middleware | Security Headers     |
+-------------------------------------------------------------------------------+
                                       |
                                       v
+-------------------------------------------------------------------------------+
|                                DATA ACCESS LAYER                              |
| Prisma ORM (Type-Safe Client, Connection Pooling, Prepared Statements)       |
+-------------------------------------------------------------------------------+
                                       |
                                       v
+-------------------------------------------------------------------------------+
|                                DATABASE LAYER                                 |
| PostgreSQL (Production) / Configurable Local DB Adapter                      |
+-------------------------------------------------------------------------------+
```

### Detailed Tech Stack
- **Framework**: Next.js 14+ / 15 with App Router (React Server Components for fast SEO and minimal bundle sizes; Client Components for interactivity).
- **Language**: TypeScript with strict mode enabled (`"strict": true`, no implicit any).
- **Styling**: Tailwind CSS with CSS Variables for consistent theming and design tokens.
- **Icons**: Lucide React.
- **Database & ORM**: PostgreSQL with Prisma ORM.
- **Validation**: Zod for client-side form validation and mandatory server-side payload validation.
- **Authentication**: Secure server-managed session authentication with HttpOnly, Secure, SameSite cookies, bcrypt/Argon2 password hashing, and role-based access control.
- **Payment Abstraction**: Pluggable Payment Provider Interface (`IPaymentGateway`) supporting Sandbox/Dev Mock mode, Stripe / LemonSqueezy / local Pakistan-compatible gateways (JazzCash / EasyPaisa / Safepay / Paymob) with webhook signature verification and idempotency keys.
- **Media & Private Video Delivery**: Abstracted storage provider with signed URL verification for protected course lessons.

---

## 4. Route Map & Navigation Architecture

### Public Routes
- `/` — Homepage (Hero, Agency Services, Academy highlights, Subscription features, Social proof, CTA)
- `/services` — Agency Services Hub
- `/services/website-design` — Custom Website Design
- `/services/website-redesign` — Website Redesign & Audit
- `/services/automation` — Workflow & Lead Automation
- `/services/social-media-management` — Social Media Handling (with clear Video Editing Policy)
- `/services/paid-advertising` — Meta & TikTok Paid Ads
- `/services/video-editing` — Standalone Paid Video Editing Add-On & Pricing
- `/pricing` — Comprehensive Pricing & Add-on Matrix
- `/portfolio` — Case Studies & Client Results
- `/academy` — Course Catalog & Filtering
- `/academy/[slug]` — Course Syllabus, Details & Enrollment Checkout
- `/subscriptions` — Subscription Catalog & Plan Selection
- `/about` — About Adverty X (Mission, Team, Values)
- `/contact` — Contact Form & Location / Inquiries
- `/login` — Account Login
- `/signup` — Account Registration
- `/forgot-password` — Password Recovery
- `/reset-password` — Password Reset via Token
- `/privacy-policy` — Legal Privacy Policy
- `/terms` — General Terms & Conditions
- `/refund-policy` — Service, Course & Subscription Refund Policy

### Protected Client Dashboard (`/dashboard`)
- `/dashboard` — Overview (Active services, enrolled courses, active subscriptions, pending orders)
- `/dashboard/profile` — User profile, contact information, avatar
- `/dashboard/orders` — Complete order history, receipts, payment status
- `/dashboard/projects` — Active agency projects, milestones, deliverables, revision requests
- `/dashboard/courses` — Enrolled courses with lifetime access, lesson progress, resume learning
- `/dashboard/courses/[courseSlug]/learn/[lessonId]` — Secure Course Classroom & Video Player
- `/dashboard/subscriptions` — Active and historical subscriptions, access keys, renewal dates
- `/dashboard/billing` — Invoices, payment methods, transaction receipts
- `/dashboard/support` — Support ticket management & messaging
- `/dashboard/security` — Password change, active sessions, 2FA settings

### Protected Admin Panel (`/admin`)
- `/admin` — High-level KPI overview (Gross Revenue, Net Margin, Users, Courses sold, Subscriptions active, Open service requests)
- `/admin/users` — User management, role assignment, account status (Active/Suspended)
- `/admin/services` — Agency service packages, inquiry triage, project assignments, deliverable approvals
- `/admin/courses` — Course creation, curriculum editor, lesson uploads, one-time pricing, publishing status
- `/admin/subscriptions` — Subscription product management, duration rules, internal supplier costs, retail pricing, fulfillment management
- `/admin/orders` — Master transaction ledger, payment verification, manual fulfillment, refund processing
- `/admin/reports` — Gross profit margin reports, revenue breakdown by division, expiry forecasts
- `/admin/content` — Homepage, portfolio, testimonials, and FAQ management
- `/admin/audit-logs` — Immutable audit log of administrative and financial operations
- `/admin/settings` — Gateway settings, system email configurations, platform toggles

---

## 5. User Roles & Permission Matrix

| Permission Area | Super Admin | Admin | Manager | Support Agent | Content Manager | Client / Student |
|---|---|---|---|---|---|---|
| View Public Pages | Yes | Yes | Yes | Yes | Yes | Yes |
| Own Profile & Dashboard | Yes | Yes | Yes | Yes | Yes | Yes |
| Access Enrolled Courses | Yes | Yes | Yes | Yes | Yes | Enrolled Only |
| Access Active Subscriptions | Yes | Yes | Yes | Yes | Yes | Active Only |
| View All Users & Edit Roles | Yes | Yes (Non-Super) | No | No | No | No |
| View Financials & Profit Margins | Yes | Yes | No | No | No | No |
| Manage Service Inquiries & Projects| Yes | Yes | Yes | View Only | No | No |
| Manage Courses & Curriculum | Yes | Yes | Yes | No | Yes | No |
| Manage Subscriptions & Fulfillment | Yes | Yes | Yes | Fulfillment Only | No | No |
| Issue Refunds & Overwrite Status | Yes | Yes | No | No | No | No |
| View Audit Logs | Yes | Yes | No | No | No | No |

---

## 6. Payment Architecture & Verification Protocol

```
[ Customer Browser ]
       |
       | 1. Selects Course or Subscription Plan
       v
[ Server Route / Action ]
       |
       | 2. Fetches authoritative price from Database (NEVER trusts client payload)
       | 3. Creates pending Order & unique Idempotency Key
       v
[ Payment Gateway Adapter ]
       |
       | 4. Generates checkout session / direct payment payload
       v
[ Gateway Payment Interface ]
       |
       | 5. Customer completes payment
       +-------------------------------+
       |                               |
  (Redirect)                      (Webhook)
       v                               v
[ /checkout/return ]            [ /api/webhooks/payment ]
- Displays "Verifying..."       - Verifies cryptographic signature
- Polls order status from DB    - Validates transaction ID & amount
- NEVER activates on redirect!  - Transitions Order to PAID
                                - Provisions Lifetime Course Access
                                  OR Activates Subscription duration
```

### Mandatory Payment Safeguards
1. **Server-Side Price Authority**: The frontend transmits only `productId` / `planId`. The server queries the database for active prices and computes totals.
2. **Webhook Verification**: Payment fulfillment occurs exclusively upon verified webhook receipts with cryptographic HMAC signature validation.
3. **Idempotency**: Webhook events check against processed transaction records to prevent double-crediting or duplicate course enrollments.
4. **Zero Card Storage**: Adverty X servers never touch, process, or store raw credit/debit card numbers.

---

## 7. Security & Compliance Baseline

1. **Authentication Security**:
   - Passwords hashed using bcrypt (cost factor >= 12) or Argon2id.
   - Brute-force rate limiting on `/api/auth/login`, `/api/auth/register`, and `/api/auth/forgot-password`.
   - Short-lived, cryptographic password reset tokens (15-minute expiration, invalidated upon single use).
   - Sessions stored in secure, HttpOnly, SameSite=Lax/Strict cookies.
2. **Server-Side Authorization (Anti-IDOR)**:
   - Every route and database query verifies that `order.userId === session.userId` or `session.user.role in ['ADMIN', 'SUPER_ADMIN']`.
   - Changing an ID in an API request or URL will immediately return 403 Forbidden.
3. **Input Sanitization & Injection Defense**:
   - All parameters validated via Zod schemas.
   - All database queries executed through Prisma's parameterized engine (zero raw string SQL concatenation).
   - Strict Content Security Policy (CSP) headers, X-Frame-Options: DENY, X-Content-Type-Options: nosniff.
4. **Data Isolation**:
   - Internal supplier costs (`internalCost`), wholesale margins, and commercial vendor notes are omitted from all public GraphQL/REST serializers and Server Component props returned to non-admin users.
