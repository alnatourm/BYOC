# NexusBYOK Production Database Migration & Rollback Guide

This guide outlines the non-destructive production migration procedure from ephemeral local storage (PGlite) to durable Google Cloud SQL PostgreSQL.

---

## 1. Pre-Migration Inventory & Record Counts
- Execute inventory queries across all tables (`users`, `tenants`, `projects`, `runs`, `stage_runs`, `dispatches`, `artifacts`, `provider_connections`, `audit_events`, `vault_secrets`) to establish baseline record counts before migration.

## 2. Source PGlite Database Identification
- Locate the active embedded PGlite storage directory at `./.pglite_data`.

## 3. Consistent, Non-Destructive Source Backup
- Create a safe snapshot of the data folder without deleting or mutating source files:
  ```bash
  cp -r .pglite_data .pglite_data_migration_backup_$(date +%s)
  ```

## 4. Export Compatible with PGlite Format & Schema
- Extract relational records and schema definitions into standard SQL INSERT statements or JSON dump format compatible with PostgreSQL 15+.

## 5. PostgreSQL Schema Migrations
- Apply versioned schema migrations (`server/db/migrations/*.sql`) to the target Cloud SQL database using the migration runner (`npm run migrate`).

## 6. Controlled Import into Designated Cloud SQL Database
- Import verified data records into the destination Cloud SQL instance via secure connection strings or Cloud SQL Auth Proxy.

## 7. Transactional Import Where Feasible
- Execute bulk imports within explicit SQL transactions (`BEGIN; ... COMMIT;`) to guarantee atomicity.

## 8. Idempotency & Safe Retry Behavior
- Ensure all import scripts and migration statements use `ON CONFLICT (id) DO NOTHING` or equivalent idempotent upsert logic.

## 9. Tenant & Workspace Integrity Verification
- Reconcile membership mappings, owner roles, and workspace boundaries across tenants.

## 10. Record Reconciliation
- Verify parity between source and destination row counts for users, projects, runs, provider connections, audit logs, and vault secrets.

## 11. Audit Hash-Chain Verification
- Validate the cryptographic continuity and SHA-256 integrity of the hash-chain audit log (`server/audit/chain.ts`).

## 12. Encryption-Key Compatibility Checks
- Ensure `VAULT_MASTER_KEY` base64-decodes to exactly 32 bytes on both source and destination environments to maintain secret decryption capability.

## 13. Rollback Preparation & Recovery Instructions
- In case of import failure, retain the local PGlite backup and fall back to the previous Cloud Run revision while investigating error logs.

## 14. Backup & Point-In-Time Recovery (PITR) Requirements
- Enable automated daily backups and PITR with a minimum 7-day retention window on Cloud SQL.
