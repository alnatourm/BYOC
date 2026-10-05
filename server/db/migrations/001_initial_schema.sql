-- Migration 001: Initial Schema for OGroup AI Factory Platform

CREATE TABLE IF NOT EXISTS schema_migrations (
  version INT PRIMARY KEY,
  applied_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plans Table
CREATE TABLE IF NOT EXISTS plans (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  price_monthly_usd NUMERIC(10, 2) DEFAULT NULL,
  runs_per_month INT DEFAULT 100,
  active_runs INT DEFAULT 5,
  projects INT DEFAULT 10,
  is_active BOOLEAN DEFAULT TRUE
);

-- Tenants Table
CREATE TABLE IF NOT EXISTS tenants (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(256) NOT NULL,
  plan_id VARCHAR(64) REFERENCES plans(id),
  status VARCHAR(32) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(256) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email_verified_at TIMESTAMPTZ,
  platform_role VARCHAR(32) DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Memberships Table
CREATE TABLE IF NOT EXISTS memberships (
  tenant_id VARCHAR(64) REFERENCES tenants(id) ON DELETE CASCADE,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(32) NOT NULL,
  reviewer_scope VARCHAR(32) DEFAULT NULL,
  PRIMARY KEY (tenant_id, user_id)
);

-- Sessions Table
CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  csrf_secret TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ
);

-- Email Tokens Table
CREATE TABLE IF NOT EXISTS email_tokens (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  kind VARCHAR(32) NOT NULL,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ
);

-- Tenant Keys Table (Wrapped DEKs)
CREATE TABLE IF NOT EXISTS tenant_keys (
  tenant_id VARCHAR(64) REFERENCES tenants(id) ON DELETE CASCADE,
  key_version INT NOT NULL,
  wrapped_dek TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (tenant_id, key_version)
);

-- Provider Connections Table
CREATE TABLE IF NOT EXISTS provider_connections (
  id VARCHAR(64) PRIMARY KEY,
  tenant_id VARCHAR(64) REFERENCES tenants(id) ON DELETE CASCADE,
  type VARCHAR(32) NOT NULL,
  label VARCHAR(128) NOT NULL,
  ciphertext TEXT NOT NULL,
  iv TEXT NOT NULL,
  tag TEXT NOT NULL,
  key_version INT NOT NULL,
  fingerprint VARCHAR(64) NOT NULL,
  last4 VARCHAR(8) NOT NULL,
  status VARCHAR(32) DEFAULT 'unverified',
  spend_cap_usd NUMERIC(10, 2) DEFAULT NULL,
  last_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Events Table (Hash-chained append-only log)
CREATE TABLE IF NOT EXISTS audit_events (
  id VARCHAR(64) PRIMARY KEY,
  tenant_id VARCHAR(64) REFERENCES tenants(id) ON DELETE CASCADE,
  seq BIGSERIAL,
  actor_user_id VARCHAR(64),
  action VARCHAR(128) NOT NULL,
  subject VARCHAR(128) NOT NULL,
  payload_json TEXT NOT NULL,
  prev_hash TEXT NOT NULL,
  hash TEXT NOT NULL,
  at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage Ledger Table
CREATE TABLE IF NOT EXISTS usage_ledger (
  id VARCHAR(64) PRIMARY KEY,
  tenant_id VARCHAR(64) REFERENCES tenants(id) ON DELETE CASCADE,
  period VARCHAR(32) NOT NULL,
  kind VARCHAR(64) NOT NULL,
  quantity INT DEFAULT 0
);

-- Seed Default Placeholder Plans (price_monthly_usd = NULL)
INSERT INTO plans (id, name, price_monthly_usd, runs_per_month, active_runs, projects, is_active)
VALUES 
  ('free', 'Free Tier', NULL, 20, 2, 3, TRUE),
  ('pro', 'Pro Tier', NULL, 200, 10, 25, TRUE),
  ('enterprise', 'Enterprise Tier', NULL, 2000, 50, 100, TRUE)
ON CONFLICT (id) DO NOTHING;
