# ADVERTY X — DATABASE SCHEMA SPECIFICATION

> **Permanent Source of Truth**  
> *Last Updated:* Phase 0 — Initial Architecture Baseline  
> *Target ORM:* Prisma ORM with PostgreSQL  
> *Precision Standard:* Currency stored as explicit ISO-4217 code (e.g., `USD`, `PKR`); Monetary amounts stored as integer cents / lowest currency unit or `Decimal(10, 2)` to eliminate floating-point drift.

---

## 1. Entity Relationship Diagram (High-Level Overview)

```
       +------------------+         1:N         +----------------------+
       |      User        |-------------------->|    AuditLog / Session|
       +------------------+                     +----------------------+
         | 1          | 1                         | 1
         |            |                           |
         | 1:N        | 1:N                       | 1:N
         v            v                           v
+----------------+  +----------------------+    +----------------------+
| ServiceInquiry |  | SupportTicket / Notif|    | Order                |
+----------------+  +----------------------+    +----------------------+
         | 1                                      | 1
         | 1:1                                    | 1:N
         v                                        v
+----------------+                              +----------------------+
|    Project     |                              | OrderItem            |
+----------------+                              +----------------------+
  | 1       | 1                                   |           |
  | 1:N     | 1:N                                 |           |
  v         v                                     v           v
Project-   Project-                           [Course]   [SubPlan]
Update     Assignment                             |           |
                                              1:N v       1:N v
                                              Enrollment  CustomerSub
                                                  |           |
                                              1:N v       1:N v
                                              Lesson-     Fulfillment-
                                              Progress    Record
```

---

## 2. Core Models Specification

### 2.1 Identity, Authentication & RBAC

#### `User`
Stores client, student, and administrative accounts.
- `id`: String (UUID / cuid), Primary Key
- `email`: String, Unique, Indexed
- `passwordHash`: String
- `name`: String
- `phone`: String? (Optional international contact number)
- `avatarUrl`: String?
- `role`: Enum `UserRole` (`SUPER_ADMIN`, `ADMIN`, `MANAGER`, `SUPPORT_AGENT`, `CONTENT_MANAGER`, `CLIENT`)
- `status`: Enum `AccountStatus` (`ACTIVE`, `SUSPENDED`, `PENDING_VERIFICATION`)
- `emailVerified`: DateTime?
- `createdAt`: DateTime (default: now)
- `updatedAt`: DateTime (updatedAt)
- *Relations*: `sessions`, `orders`, `enrollments`, `subscriptions`, `inquiries`, `projects`, `tickets`, `auditLogs`

#### `Session`
Stores server-side active user sessions.
- `id`: String, Primary Key
- `userId`: String, Foreign Key -> `User.id` (onDelete: Cascade)
- `token`: String, Unique, Indexed
- `ipAddress`: String?
- `userAgent`: String?
- `expiresAt`: DateTime
- `createdAt`: DateTime

#### `PasswordResetToken`
Short-lived tokens for self-service password recovery.
- `id`: String, Primary Key
- `email`: String, Indexed
- `tokenHash`: String, Unique
- `expiresAt`: DateTime (max 15 mins)
- `usedAt`: DateTime?
- `createdAt`: DateTime

---

### 2.2 Agency Services & Project Management

#### `ServicePackage`
Standard agency packages configured by admins.
- `id`: String, Primary Key
- `slug`: String, Unique (e.g., `web-design-starter`, `automation-pro`)
- `category`: Enum `ServiceCategory` (`WEBSITE_DESIGN`, `WEBSITE_REDESIGN`, `AUTOMATION`, `SOCIAL_MEDIA`, `PAID_ADS`, `VIDEO_EDITING`)
- `title`: String
- `description`: Text
- `startingPrice`: Decimal(10, 2)
- `currency`: String (default: `USD`)
- `deliverables`: Json (Array of strings)
- `estimatedDuration`: String (e.g., "7-10 business days")
- `isActive`: Boolean (default: true)
- `createdAt`: DateTime

#### `AddOn`
Configurable optional add-ons, prominently featuring Video Editing.
- `id`: String, Primary Key
- `slug`: String, Unique (e.g., `addon-video-editing-basic`, `addon-video-editing-pro`)
- `title`: String (e.g., "Video Editing Add-On: 4 Short-Form Videos")
- `description`: Text (Explicit scope, turnaround, and revision limits)
- `price`: Decimal(10, 2)
- `currency`: String (default: `USD`)
- `category`: Enum `ServiceCategory`
- `isActive`: Boolean (default: true)

#### `ServiceInquiry`
Client intake submissions for custom quotes or redesign audits.
- `id`: String, Primary Key
- `userId`: String?, Foreign Key -> `User.id` (Optional for guest inquiries)
- `name`: String
- `email`: String
- `phone`: String?
- `serviceType`: Enum `ServiceCategory`
- `currentWebsiteUrl`: String? (Mandatory for Redesign audits)
- `businessType`: String?
- `requiredChanges`: Text?
- `referenceWebsites`: Text?
- `budgetRange`: String?
- `deadline`: String?
- `message`: Text
- `status`: Enum `InquiryStatus` (`NEW`, `UNDER_REVIEW`, `QUOTED`, `CONVERTED`, `CLOSED`)
- `internalNotes`: Text?
- `createdAt`: DateTime

#### `Project`
Active agency client work contracted and tracked.
- `id`: String, Primary Key
- `orderId`: String?, Foreign Key -> `Order.id`
- `userId`: String, Foreign Key -> `User.id`
- `title`: String
- `serviceCategory`: Enum `ServiceCategory`
- `status`: Enum `ProjectStatus` (`ONBOARDING`, `IN_PROGRESS`, `CLIENT_REVIEW`, `REVISION`, `COMPLETED`, `ON_HOLD`)
- `hasVideoEditingAddon`: Boolean (default: false)
- `deadline`: DateTime?
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### `ProjectUpdate`
Timeline milestones, deliverables, and revision rounds.
- `id`: String, Primary Key
- `projectId`: String, Foreign Key -> `Project.id` (onDelete: Cascade)
- `authorId`: String, Foreign Key -> `User.id`
- `title`: String
- `message`: Text
- `deliverableUrls`: Json? (Array of secure file links)
- `isClientVisible`: Boolean (default: true)
- `createdAt`: DateTime

#### `ProjectAssignment`
Team members assigned to agency client projects.
- `id`: String, Primary Key
- `projectId`: String, Foreign Key -> `Project.id`
- `userId`: String, Foreign Key -> `User.id`
- `roleInProject`: String (e.g., "Lead Designer", "Automation Specialist")
- `assignedAt`: DateTime

---

### 2.3 Adverty X Academy (E-Learning & Lifetime Access)

#### `Course`
Course catalog items with one-time purchase rules.
- `id`: String, Primary Key
- `slug`: String, Unique, Indexed
- `title`: String
- `subtitle`: String?
- `description`: Text
- `thumbnailUrl`: String?
- `previewVideoUrl`: String? (Public teaser video)
- `instructorName`: String
- `instructorBio`: String?
- `level`: Enum `CourseLevel` (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`, `ALL_LEVELS`)
- `price`: Decimal(10, 2)
- `currency`: String (default: `USD`)
- `isPublished`: Boolean (default: false, Indexed)
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### `CourseModule`
Curriculum organizational unit.
- `id`: String, Primary Key
- `courseId`: String, Foreign Key -> `Course.id` (onDelete: Cascade)
- `title`: String
- `order`: Int
- `createdAt`: DateTime

#### `Lesson`
Individual learning unit within a module.
- `id`: String, Primary Key
- `moduleId`: String, Foreign Key -> `CourseModule.id` (onDelete: Cascade)
- `title`: String
- `slug`: String
- `durationSeconds`: Int (default: 0)
- `videoStreamId`: String? (Private storage ID / signed URL token)
- `content`: Text? (Markdown / HTML notes)
- `downloadableResources`: Json? (Array of resource objects `{ name, url, size }`)
- `isPreview`: Boolean (default: false — If true, accessible before purchase)
- `order`: Int
- `createdAt`: DateTime

#### `Enrollment`
Permanent student course enrollment record.
- `id`: String, Primary Key
- `userId`: String, Foreign Key -> `User.id` (Indexed)
- `courseId`: String, Foreign Key -> `Course.id` (Indexed)
- `orderId`: String?, Foreign Key -> `Order.id`
- `lifetimeAccess`: Boolean (default: true — Access **never expires**)
- `status`: Enum `EnrollmentStatus` (`ACTIVE`, `REVOKED`)
- `enrolledAt`: DateTime (default: now)
- *Unique Constraint*: `[userId, courseId]`

#### `LessonProgress`
Tracks student completion across course lessons.
- `id`: String, Primary Key
- `userId`: String, Foreign Key -> `User.id`
- `lessonId`: String, Foreign Key -> `Lesson.id`
- `completed`: Boolean (default: false)
- `lastPositionSeconds`: Int (default: 0)
- `completedAt`: DateTime?
- *Unique Constraint*: `[userId, lessonId]`

---

### 2.4 Adverty X Subscriptions (Independent Tool & Service Marketplace)

#### `SubscriptionProduct`
Digital software, tools, or recurring services offered.
- `id`: String, Primary Key
- `slug`: String, Unique, Indexed
- `name`: String
- `description`: Text
- `logoUrl`: String?
- `features`: Json (Array of feature strings)
- `fulfillmentType`: Enum `FulfillmentType` (`MANUAL`, `AUTOMATED_KEY`, `AUTOMATED_INVITE`)
- `isActive`: Boolean (default: true)
- `createdAt`: DateTime

#### `SubscriptionPlan`
Pricing, duration, and margin configurations for a product.
- `id`: String, Primary Key
- `productId`: String, Foreign Key -> `SubscriptionProduct.id` (onDelete: Cascade)
- `title`: String (e.g., "1-Month Pro Access", "Annual License")
- `billingModel`: Enum `BillingModel` (`FIXED_DURATION`, `RECURRING`)
- `durationDays`: Int (e.g., 7, 30, 90, 365)
- `sellingPrice`: Decimal(10, 2) (Customer retail price)
- `internalCost`: Decimal(10, 2) (**CONFIDENTIAL / ADMIN-ONLY** — wholesale cost)
- `currency`: String (default: `USD`)
- `isActive`: Boolean (default: true)
- `createdAt`: DateTime

#### `CustomerSubscription`
Customer subscription active/historical instances.
- `id`: String, Primary Key
- `userId`: String, Foreign Key -> `User.id` (Indexed)
- `planId`: String, Foreign Key -> `SubscriptionPlan.id`
- `orderId`: String, Foreign Key -> `Order.id`
- `status`: Enum `SubscriptionStatus` (`PENDING_PAYMENT`, `AWAITING_FULFILLMENT`, `ACTIVE`, `SUSPENDED`, `EXPIRED`, `CANCELLED`, `REFUNDED`)
- `startsAt`: DateTime?
- `expiresAt`: DateTime? (Authoritative timestamp for fixed-duration access)
- `autoRenew`: Boolean (default: false for fixed-duration; true only for verified recurring)
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### `FulfillmentRecord`
Access credentials or license keys provided for a subscription.
- `id`: String, Primary Key
- `customerSubscriptionId`: String, Foreign Key -> `CustomerSubscription.id` (onDelete: Cascade)
- `fulfilledById`: String?, Foreign Key -> `User.id` (Admin/Agent who fulfilled)
- `credentialsPayload`: Text? (Encrypted license key, invite link, or instructions)
- `status`: Enum `FulfillmentStatus` (`PENDING`, `DELIVERED`, `REVOKED`)
- `deliveredAt`: DateTime?
- `notes`: Text?

---

### 2.5 Orders, Transactions & Invoicing

#### `Order`
Authoritative master financial record.
- `id`: String, Primary Key (e.g., `ORD-2026-XXXXX`)
- `userId`: String, Foreign Key -> `User.id` (Indexed)
- `totalAmount`: Decimal(10, 2)
- `currency`: String (default: `USD`)
- `status`: Enum `OrderStatus` (`PENDING`, `PAID`, `FAILED`, `CANCELLED`, `REFUNDED`, `PARTIALLY_REFUNDED`)
- `paymentMethod`: String? (e.g., `stripe`, `jazzcash`, `easypaisa`, `sandbox`)
- `idempotencyKey`: String, Unique, Indexed
- `createdAt`: DateTime (default: now)
- `updatedAt`: DateTime

#### `OrderItem`
Itemized products within an order.
- `id`: String, Primary Key
- `orderId`: String, Foreign Key -> `Order.id` (onDelete: Cascade)
- `itemType`: Enum `OrderItemType` (`COURSE`, `SUBSCRIPTION_PLAN`, `SERVICE_PACKAGE`, `ADDON`)
- `itemId`: String (Reference to Course.id, Plan.id, Package.id, or AddOn.id)
- `title`: String
- `unitPrice`: Decimal(10, 2)
- `internalCost`: Decimal(10, 2)? (**ADMIN ONLY** — captured at time of sale for margin accuracy)
- `quantity`: Int (default: 1)

#### `Payment`
Payment transaction audit records.
- `id`: String, Primary Key
- `orderId`: String, Foreign Key -> `Order.id`
- `gateway`: String (e.g., `stripe`, `sandbox`, `paymob`)
- `transactionReference`: String, Unique, Indexed
- `gatewaySignature`: String?
- `amount`: Decimal(10, 2)
- `currency`: String
- `status`: Enum `PaymentStatus` (`INITIATED`, `SUCCESS`, `FAILED`, `REFUNDED`)
- `rawWebhookPayload`: Json? (Stored securely for financial dispute resolution)
- `createdAt`: DateTime

#### `RefundRecord`
- `id`: String, Primary Key
- `orderId`: String, Foreign Key -> `Order.id`
- `paymentId`: String, Foreign Key -> `Payment.id`
- `amount`: Decimal(10, 2)
- `reason`: String
- `processedById`: String, Foreign Key -> `User.id`
- `accessRevoked`: Boolean (default: true)
- `createdAt`: DateTime

---

### 2.6 Customer Support, Auditing & Configuration

#### `SupportTicket`
- `id`: String, Primary Key
- `ticketNumber`: String, Unique
- `userId`: String, Foreign Key -> `User.id`
- `division`: Enum `BusinessDivision` (`AGENCY`, `ACADEMY`, `SUBSCRIPTIONS`, `GENERAL`)
- `subject`: String
- `status`: Enum `TicketStatus` (`OPEN`, `WAITING_ON_CLIENT`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`)
- `priority`: Enum `TicketPriority` (`LOW`, `MEDIUM`, `HIGH`, `URGENT`)
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### `TicketMessage`
- `id`: String, Primary Key
- `ticketId`: String, Foreign Key -> `SupportTicket.id` (onDelete: Cascade)
- `senderId`: String, Foreign Key -> `User.id`
- `content`: Text
- `attachmentUrls`: Json?
- `createdAt`: DateTime

#### `AuditLog`
Immutable administrative activity ledger for security and compliance.
- `id`: String, Primary Key
- `actorId`: String?, Foreign Key -> `User.id` (Nullable if system action)
- `action`: String (e.g., `COURSE_CREATED`, `SUBSCRIPTION_FULFILLED`, `ROLE_MODIFIED`, `REFUND_ISSUED`)
- `entityType`: String (e.g., `Course`, `User`, `CustomerSubscription`)
- `entityId`: String
- `metadata`: Json? (Diff or parameters)
- `ipAddress`: String?
- `createdAt`: DateTime (default: now)

#### `SiteSetting`
Key-value platform configuration.
- `key`: String, Primary Key
- `value`: Json
- `description`: String?
- `updatedAt`: DateTime

---

## 3. Database Integrity & Access Rules

1. **Lifetime Course Access Guarantee**:
   - `Enrollment.lifetimeAccess = true` by default.
   - Database queries resolving student course access check:
     `SELECT id FROM Enrollment WHERE userId = :userId AND courseId = :courseId AND status = 'ACTIVE'`
   - There is NO expiration timestamp or subscription dependency in the enrollment check.
2. **Fixed-Duration vs Recurring Subscriptions**:
   - For `FIXED_DURATION`: `expiresAt = startsAt + interval(durationDays)` and `autoRenew = false`. Expired status triggers when `CURRENT_TIMESTAMP > expiresAt`.
   - For `RECURRING`: `autoRenew = true`. Renewals are extended upon receipt of verified recurring gateway webhooks.
3. **Admin-Only Internal Cost Isolation**:
   - Columns `SubscriptionPlan.internalCost` and `OrderItem.internalCost` must be explicitly omitted from public Prisma selection objects (`select: { internalCost: false }` or custom projection DTOs).
