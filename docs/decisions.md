# Architectural Decision Log (ADR) - Phase 1A Foundations

## ADR 001: 5-Role Pipeline Consolidation
- **Context**: The original 10 agent roles were merged into 5 primary pipeline gates: Product & Spec, Designer, Developer, QC & Security, and Release & Deploy.
- **Decision**: Keep the 5 core roles as the active gate structure while retaining inner checklists for specialized tasks.

## ADR 002: Key Custody & Master Key Encryption
- **Context**: Railway PaaS does not provide an external KMS natively.
- **Decision**: Use AES-256-GCM with a per-tenant Data Encryption Key (DEK) wrapped by `VAULT_MASTER_KEY` (with versioning and rotation support via `npm run rotate-master-key`). Master key can be migrated to AWS KMS / GCP KMS in Phase 2.

## ADR 003: Embedded Database Engine for Local/Preview Runtimes
- **Context**: Development previews might run without a dedicated PostgreSQL server instance.
- **Decision**: Use `@electric-sql/pglite` (embedded Postgres-compatible engine) when `DATABASE_URL` is omitted, and standard `pg` Pool when `DATABASE_URL` is present.

## ADR 004: Write-Only Vault Connections
- **Context**: Prevent leakage of customer AI keys (Gemini, Anthropic, OpenAI).
- **Decision**: Provider keys are write-only. After saving, the API returns only `provider`, `label`, `last4`, `fingerprint` (HMAC-SHA256 derived from master key), `status`, and `last_verified_at`. Secrets are never logged or returned in responses.

## ADR 005: Hash-Chained Append-Only Audit Trail
- **Context**: Compliance requirements demand immutable event logs.
- **Decision**: Every audit event includes a SHA-256 hash calculated as `SHA-256(prev_hash | canonical_json_of_event)`. A database trigger blocks `UPDATE` and `DELETE` on the `audit_events` table.
