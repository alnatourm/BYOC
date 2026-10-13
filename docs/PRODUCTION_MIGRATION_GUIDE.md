# NexusBYOK Production Database Migration & Rollback Guide

This guide outlines the production migration procedure from ephemeral local storage (PGlite) to durable Google Cloud SQL PostgreSQL, ensuring zero data loss, tenant integrity, vault security, and hash-chain audit verification.

---

## 1. Cloud SQL Connection Requirements & Setup

1. **Instance Specification**:
   - Engine: PostgreSQL 15+
   - Tier: `db-custom-1-3840` or higher (depending on workload)
   - High Availability: Recommended for production (Regional)
   - Database Name: `cloud_sql_production_database` (or equivalent)

2. **Network & Connectivity**:
   - Private IP connectivity via VPC Service Controls is strongly recommended.
   - Cloud SQL Auth Proxy or Unix Socket connection string via Cloud Run (`/cloudsql/PROJECT:REGION:INSTANCE`).

---

## 2. Google Cloud Secret Manager Configuration

Never hardcode database credentials in environment variables or container images.

1. Create a secret in Secret Manager:
   ```bash
   gcloud secrets create nexusbyok-database-url \
     --replication-policy="automatic"
   ```
2. Add the connection string version:
   ```bash
   echo -n "postgres://nexusbyok_user:SECURE_PASSWORD@localhost:5432/cloud_sql_production_database?sslmode=disable" | \
     gcloud secrets versions add nexusbyok-database-url --data-file=-
   ```
3. Grant Cloud Run service account access (`roles/secretmanager.secretAccessor`).

---

## 3. Cloud Run Service Account IAM Permissions

The Cloud Run service account requires the following minimal IAM roles:
- `roles/cloudsql.client` (Cloud SQL Client)
- `roles/secretmanager.secretAccessor` (Secret Accessor)

---

## 4. Non-Destructive Migration Procedure

1. **Pre-Flight Inspection**:
   - Verify existing record counts across tenants, users, projects, dispatches, and audit logs.
   - Run the admin diagnostics endpoint: `GET /v1/admin/db-diagnostics`.
2. **Data Export & Snapshot**:
   - Take a pg_dump snapshot of any existing staging data:
     ```bash
     pg_dump $SOURCE_DATABASE_URL > migration_snapshot_$(date +%s).sql
     ```
3. **Schema Application**:
   - Run automated migrations against the target Cloud SQL instance:
     ```bash
     NODE_ENV=production DATABASE_URL="..." npm run migrate
     ```
4. **Data Import & Verification**:
   - Import the snapshot and run row-count reconciliation.
   - Verify encrypted vault master keys (`VAULT_MASTER_KEY` must match across environment and tenant ciphertexts).
   - Verify hash-chain audit logs integrity (`server/audit/chain.ts`).

---

## 5. Rollback Procedure

If migration verification fails:
1. Revert Cloud Run service revision to the previous stable snapshot.
2. Ensure the rollback database URL points to the verified backup instance.
3. Validate tenant session tokens and vault decryption.

---

## 6. Automated Backup Requirements

- Enable automated daily backups in Cloud SQL.
- Configure point-in-time recovery (PITR) with a minimum 7-day retention window.
- Test restoration quarterly.
