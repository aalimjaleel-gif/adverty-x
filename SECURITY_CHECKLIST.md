# ADVERTY X — SECURITY CHECKLIST & COMPLIANCE MATRIX

> **Permanent Source of Truth**  
> *Last Updated:* Phase 0 — Baseline Security Architecture  
> *Standard:* OWASP Top 10, Least Privilege, Zero Trust Server-Side Authorization

---

## 1. Security Architecture Principles

1. **Never Trust the Client**: Every price, quantity, role, permission, status, enrollment, and duration is authoritatively validated, computed, and written on the server.
2. **Strict Object Ownership (Anti-IDOR)**: Direct Object References (e.g., `/dashboard/orders/[id]`, `/api/projects/[id]`) must verify that the requesting user owns the object or possesses an administrative role.
3. **Data Scrubbing & Confidentiality**: Internal supplier costs (`internalCost`), profit margins, raw webhook secrets, and customer credentials must never leak into client-side bundles, HTML responses, or API serializers.
4. **Defense in Depth**: Layered protections across transport (HTTPS/TLS), headers (CSP/HSTS), network (Rate limiting), application (Zod validation, session auth), and database (Prisma prepared statements).

---

## 2. Security Controls & Implementation Matrix

| Security Area | Control Item | Status | Verification Mechanism |
|---|---|---|---|
| **Authentication** | Passwords hashed with bcrypt (cost >= 12) or Argon2id | Planned | Unit test: check hash structure & cost factor |
| **Authentication** | Rate limiting on `/login`, `/signup`, `/forgot-password` | Planned | Automated test: 6+ rapid attempts return HTTP 429 |
| **Authentication** | Cryptographic, short-lived (15 min) password reset tokens | Planned | Token expiry & single-use invalidation tests |
| **Authentication** | HttpOnly, Secure, SameSite=Lax/Strict session cookies | Planned | Verify Set-Cookie header directives |
| **Authentication** | Session revocation on password change or logout | Planned | Invalidation check against active session records |
| **Authorization** | Server-side RBAC middleware for `/admin/*` and `/api/admin/*` | Planned | Request test with Client token returns 403 Forbidden |
| **Authorization** | Strict IDOR check on Orders, Projects, Invoices, Tickets | Planned | Requesting another user's `orderId` returns 403/404 |
| **Authorization** | Role immutability: Users cannot escalate own role | Planned | Server rejects payload containing modified `role` |
| **Payments** | Server-side authoritative price lookup from DB | Planned | Client-submitted amounts completely ignored |
| **Payments** | Cryptographic HMAC webhook signature verification | Planned | Invalid/tampered webhook signature returns 400/401 |
| **Payments** | Webhook idempotency guard preventing duplicate credit | Planned | Duplicate transaction webhook returns cached 200 OK |
| **Payments** | Zero raw credit/debit card storage on platform | Planned | Code audit confirms zero PAN/CVV database fields |
| **Payments** | Zero fulfillment on unverified browser redirect | Planned | `/checkout/return` only checks verified DB status |
| **Content Security** | Private video URLs for Academy lessons (signed/token) | Planned | Direct video URLs expire and cannot be hotlinked |
| **Data Protection** | Internal supplier cost & gross margin hidden from client | Planned | API payload audit: `internalCost` absent in client DTO |
| **Input Validation** | Strict Zod schema validation on all API routes & actions | Planned | Invalid payload types trigger structured 422 errors |
| **Injection Defense** | 100% Parameterized queries via Prisma ORM | Planned | Zero raw SQL string interpolation in application code |
| **HTTP Headers** | Strict CSP, X-Frame-Options: DENY, X-Content-Type-Options | Planned | Security header inspection on all responses |
| **File Uploads** | Strict MIME whitelist, magic number verification, size caps | Planned | Reject executable extensions & MIME spoofing |
| **Auditing** | Immutable audit logs for sensitive admin actions | Planned | Verified log created upon role, refund, or status change |
| **Secret Management**| `.env.example` placeholder only; `.env` in `.gitignore` | Implemented | Verify `.gitignore` contains `.env*` |
| **Error Handling** | Sanitized error responses (no stack traces or DB credentials)| Planned | 500 error returns generic user message |

---

## 3. IDOR Defense Specification (Insecure Direct Object Reference)

Every route handler or server action that accesses user-specific records must implement this pattern:

```typescript
// Pattern: Server-Side Authorization Guard
export async function getClientOrder(orderId: string, session: Session) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  // Strict ownership check or administrative privilege
  const isOwner = order.userId === session.userId;
  const isAdmin = ["SUPER_ADMIN", "ADMIN"].includes(session.user.role);

  if (!isOwner && !isAdmin) {
    // Log suspicious access attempt
    await logSecurityAlert({
      actorId: session.userId,
      action: "UNAUTHORIZED_IDOR_ATTEMPT",
      targetEntity: "Order",
      targetId: orderId,
    });
    throw new ForbiddenError("Access denied");
  }

  return order;
}
```

---

## 4. Payment Security & Webhook Protocol

1. **Pre-Payment**:
   - Client specifies item ID (Course ID or Subscription Plan ID).
   - Server fetches current price from `Course.price` or `SubscriptionPlan.sellingPrice`.
   - Server creates `Order` with `status: PENDING` and a cryptographic `idempotencyKey`.
2. **Processing**:
   - Order sent to payment provider with server-calculated amount.
3. **Webhook Reception**:
   - Webhook route reads raw request body buffer.
   - Computes HMAC SHA-256 signature using provider secret.
   - Compares with header signature using constant-time comparison (`crypto.timingSafeEqual`).
   - Checks if `Payment` with `transactionReference` already processed. If yes, exits immediately.
   - Transitions `Order.status` to `PAID`.
   - Provisions lifetime course enrollment or activates subscription.
4. **Post-Payment Return**:
   - Client returns to `/checkout/success?orderId=XYZ`.
   - Server fetches order from DB and displays verified state. Never marks order as paid based on client redirect query parameters!

---

## 5. Audit Logging Policy

The following sensitive operations MUST generate an entry in the `AuditLog` table:
- Administrative role modification or user suspension.
- Manual subscription fulfillment or license key provisioning.
- Issuance of refunds or manual order status overrides.
- Creation, price modification, or deletion of courses, packages, or subscription plans.
- Internal cost adjustments.
- System setting updates.
