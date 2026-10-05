# OGroup AI Factory Platform (BYOK + Managed Factory) - Phase 1A Foundations

Governed 5-role AI software delivery platform with Human-in-the-Loop Approval Gates.

## Vision
A SaaS where customers describe software and receive a governed build:
- **01 Product & Spec Agent**
- **02 Designer Agent (Google Stitch)**
- **03 Developer Agent (React 19 + TypeScript + Fastify)**
- **04 QC & Security Agent (SAST & Playwright E2E)**
- **05 Release & Deploy Agent (Client-Chosen Cloud Hosting)**

## Modes
1. **BYOK (Bring Your Own Key)**: Customers plug in their own Gemini / Anthropic / OpenAI keys.
2. **Managed Factory**: Customers use OGroup's managed factory runtime.

## Setup & Local Development

```bash
# 1. Install dependencies
npm ci

# 2. Configure environment variables
cp .env.example .env

# 3. Run SQL database migrations
npm run migrate

# 4. Start local development server (Vite + Express on Port 3000)
npm run dev

# 5. Create super admin user
npm run create-super-admin
```

## Architecture
- **Server Entrypoint**: `server.ts`
- **Config & Env Validation**: `server/config.ts` (Zod validation, production boot guards)
- **Database & Repositories**: `server/db/` (PostgreSQL / PGlite, versioned SQL migrations, tenant-scoped repository pattern)
- **Authentication**: `server/auth/` (scrypt password hashing, session tokens, CSRF tokens)
- **Encrypted Vault**: `server/vault/` (AES-256-GCM DEK wrapping, write-only keys, provider verification, SSRF guard)
- **Hash-Chained Audit Trail**: `server/audit/` (Immutable append-only audit events, SHA-256 hash chain)
- **REST API Routes**: `/v1/auth`, `/v1/me`, `/v1/connections`, `/v1/audit`, `/v1/admin`

## Running Tests & Checks
```bash
npm run lint
npm run test
npm run build
```
