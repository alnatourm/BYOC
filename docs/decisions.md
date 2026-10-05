# Architectural Decision Records (ADRs) - BYOC Platform

## ADR 1: Fail-Closed `NODE_ENV` Configuration & Production Refusal

### Context
Previous configuration defaulted to permissive development settings if `NODE_ENV` was unset or unrecognized, allowing production instances to inadvertently start with hardcoded master keys or unencrypted fallback values.

### Decision
Treat any `NODE_ENV` string other than **exactly** `"development"` or `"test"` (including `undefined` or empty string) strictly as **`production`**.

When executing in `production` mode:
- `VAULT_MASTER_KEY` MUST be present and base64-decode to **EXACTLY 32 bytes**.
- `SESSION_SECRET` MUST be present and at least **32 bytes** long.
- `APP_URL` MUST be explicitly defined.
- `ALLOWED_ORIGINS` MUST be explicitly configured (no localhost defaults permitted).

If any of these conditions fail, the server immediately logs a `FATAL_CONFIG_ERROR` and exits non-zero (`process.exit(1)`).

---

## ADR 2: Separation of Duties Enforcement for Gate 5 Release Approval

### Context
Solo founders or small tenant teams need the ability to approve final release deployments themselves, whereas enterprise governance requires strict separation of duties (preventing the creator of a run/dispatch from approving its final Gate 5 deployment).

### Decision
Add a `separation_of_duties` boolean setting on the `tenants` table (defaulting to `TRUE`).
- When `separation_of_duties = TRUE`, Gate 5 approval rejects any attempt by the run creator or dispatch starter to approve their own Gate 5 release.
- Tenant owners can explicitly toggle `separation_of_duties` via `PUT /v1/tenant/settings`.
- Every change to `separation_of_duties` writes a hash-chained audit event.

---

## ADR 3: Platform Super Admin Verified Price Quotes Engine

### Context
Gate 5 (Release & Deployment Plan) requires hosting monthly cost estimates. To prevent fabricated or hardcoded cost metrics, prices must originate strictly from platform database records.

### Decision
- Create `price_quotes` database table starting **EMPTY**.
- Super Admins manage quotes via `/v1/admin/quotes` (`GET`, `POST`, `DELETE`), specifying `provider`, `plan_label`, `amount_usd`, `currency`, `source_url`, and `quoted_at`.
- When `price_quotes` contains no entry for a provider, Gate 5 displays **"No quote loaded"**.
- Quotes older than 30 days are automatically tagged with `stale: true` and flagged with a warning banner.

---

## ADR 4: Railway PaaS Integration & Verification Findings

### Context
Section 1.4 requires verifying Railway connection tokens against live Railway APIs.

### Findings & Decision
- **Endpoint**: Railway GraphQL API at `https://backboard.railway.app/graphql`.
- **Authentication**: Header `Authorization: Bearer <token>`.
- **Read-Only Verification Query**: `query { me { id email } }`.
- Verification succeeds if HTTP status is 200 and `data.me.id` is present in the response body.
