-- Migration 002: Governed 5-Role Pipeline & Hosting Schema

CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(64) PRIMARY KEY,
  tenant_id VARCHAR(64) REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(256) NOT NULL,
  mode VARCHAR(32) NOT NULL DEFAULT 'byok',
  repo_full_name VARCHAR(256) DEFAULT NULL,
  default_branch VARCHAR(128) DEFAULT 'main',
  created_by VARCHAR(64) REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS instruction_versions (
  id VARCHAR(64) PRIMARY KEY,
  tenant_id VARCHAR(64) REFERENCES tenants(id) ON DELETE CASCADE,
  role VARCHAR(32) NOT NULL,
  version INT NOT NULL DEFAULT 1,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS role_slots (
  project_id VARCHAR(64) REFERENCES projects(id) ON DELETE CASCADE,
  role VARCHAR(32) NOT NULL,
  connection_id VARCHAR(64) DEFAULT NULL,
  model VARCHAR(128) NOT NULL DEFAULT 'gemini-2.5-flash',
  instruction_version_id VARCHAR(64) REFERENCES instruction_versions(id),
  constraints_json TEXT DEFAULT '{}',
  PRIMARY KEY (project_id, role)
);

CREATE TABLE IF NOT EXISTS runs (
  id VARCHAR(64) PRIMARY KEY,
  tenant_id VARCHAR(64) REFERENCES tenants(id) ON DELETE CASCADE,
  project_id VARCHAR(64) REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(256) NOT NULL,
  intent TEXT NOT NULL,
  acceptance_json TEXT DEFAULT '[]',
  current_stage INT NOT NULL DEFAULT 1,
  status VARCHAR(32) NOT NULL DEFAULT 'draft',
  created_by VARCHAR(64) REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stage_runs (
  id VARCHAR(64) PRIMARY KEY,
  run_id VARCHAR(64) REFERENCES runs(id) ON DELETE CASCADE,
  stage INT NOT NULL,
  state VARCHAR(32) NOT NULL DEFAULT 'draft',
  attempt INT NOT NULL DEFAULT 1,
  CONSTRAINT unique_run_stage_attempt UNIQUE (run_id, stage, attempt)
);

CREATE TABLE IF NOT EXISTS dispatches (
  id VARCHAR(64) PRIMARY KEY,
  stage_run_id VARCHAR(64) REFERENCES stage_runs(id) ON DELETE CASCADE,
  role VARCHAR(32) NOT NULL,
  connection_id VARCHAR(64) DEFAULT NULL,
  idempotency_key VARCHAR(128) UNIQUE NOT NULL,
  started_by VARCHAR(64) REFERENCES users(id),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  preflight_snapshot_json TEXT NOT NULL,
  preflight_hash VARCHAR(64) NOT NULL,
  state VARCHAR(32) NOT NULL DEFAULT 'dispatched',
  usage_json TEXT DEFAULT '{}',
  error TEXT DEFAULT NULL
);

-- Enforce one active dispatch per run-stage
CREATE UNIQUE INDEX IF NOT EXISTS idx_active_dispatch_per_run_stage ON dispatches (stage_run_id) WHERE state IN ('dispatched', 'running');

CREATE TABLE IF NOT EXISTS artifacts (
  id VARCHAR(64) PRIMARY KEY,
  run_id VARCHAR(64) REFERENCES runs(id) ON DELETE CASCADE,
  stage_run_id VARCHAR(64) REFERENCES stage_runs(id) ON DELETE CASCADE,
  dispatch_id VARCHAR(64) REFERENCES dispatches(id) ON DELETE SET NULL,
  kind VARCHAR(64) NOT NULL,
  version INT NOT NULL DEFAULT 1,
  content TEXT NOT NULL,
  mime VARCHAR(128) NOT NULL DEFAULT 'application/json',
  size INT NOT NULL,
  sha256 VARCHAR(64) NOT NULL,
  created_by VARCHAR(64) REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS evidence (
  id VARCHAR(64) PRIMARY KEY,
  dispatch_id VARCHAR(64) REFERENCES dispatches(id) ON DELETE CASCADE,
  check_name VARCHAR(128) NOT NULL,
  required BOOLEAN NOT NULL DEFAULT TRUE,
  executed BOOLEAN NOT NULL DEFAULT FALSE,
  result VARCHAR(32) NOT NULL DEFAULT 'na',
  details_json TEXT DEFAULT '{}',
  collected_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gates (
  id VARCHAR(64) PRIMARY KEY,
  stage_run_id VARCHAR(64) REFERENCES stage_runs(id) ON DELETE CASCADE,
  gate_no INT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'pending',
  decided_by VARCHAR(64) REFERENCES users(id),
  decided_at TIMESTAMPTZ DEFAULT NULL,
  comment TEXT DEFAULT NULL,
  artifact_sha_list_json TEXT DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS documents (
  id VARCHAR(64) PRIMARY KEY,
  project_id VARCHAR(64) REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(256) NOT NULL,
  type VARCHAR(64) NOT NULL
);

CREATE TABLE IF NOT EXISTS document_versions (
  id VARCHAR(64) PRIMARY KEY,
  document_id VARCHAR(64) REFERENCES documents(id) ON DELETE CASCADE,
  version INT NOT NULL DEFAULT 1,
  status VARCHAR(32) DEFAULT 'draft',
  artifact_id VARCHAR(64) REFERENCES artifacts(id),
  sha256 VARCHAR(64) NOT NULL
);

CREATE TABLE IF NOT EXISTS hosting_connections (
  id VARCHAR(64) PRIMARY KEY,
  tenant_id VARCHAR(64) REFERENCES tenants(id) ON DELETE CASCADE,
  type VARCHAR(32) NOT NULL,
  label VARCHAR(128) NOT NULL,
  ciphertext TEXT NOT NULL,
  iv TEXT NOT NULL,
  tag TEXT NOT NULL,
  key_version INT NOT NULL DEFAULT 1,
  fingerprint VARCHAR(64) NOT NULL,
  last4 VARCHAR(8) NOT NULL,
  meta_json TEXT DEFAULT '{}',
  status VARCHAR(32) DEFAULT 'unverified',
  last_verified_at TIMESTAMPTZ DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS price_quotes (
  id VARCHAR(64) PRIMARY KEY,
  provider VARCHAR(64) NOT NULL,
  plan_label VARCHAR(128) NOT NULL,
  amount_usd NUMERIC(10,2) DEFAULT NULL,
  currency VARCHAR(8) DEFAULT 'USD',
  source_url TEXT NOT NULL,
  quoted_at TIMESTAMPTZ NOT NULL,
  entered_by VARCHAR(64) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS deployments (
  id VARCHAR(64) PRIMARY KEY,
  run_id VARCHAR(64) REFERENCES runs(id) ON DELETE CASCADE,
  hosting_connection_id VARCHAR(64) REFERENCES hosting_connections(id) ON DELETE RESTRICT,
  plan_json TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'planned',
  approved_by VARCHAR(64) REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS jobs (
  id VARCHAR(64) PRIMARY KEY,
  kind VARCHAR(64) NOT NULL,
  payload_json TEXT NOT NULL,
  state VARCHAR(32) NOT NULL DEFAULT 'pending',
  attempts INT NOT NULL DEFAULT 0,
  run_at TIMESTAMPTZ DEFAULT NOW(),
  locked_at TIMESTAMPTZ DEFAULT NULL
);

-- Seed Default Instruction Versions (Roles 01 to 05)
INSERT INTO instruction_versions (id, tenant_id, role, version, body)
VALUES
  ('inst_spec_v1', NULL, 'spec', 1, 'You are Role 01 Product & Spec Agent. Generate a valid PRD, Epics, and PostgreSQL Schema JSON.'),
  ('inst_design_v1', NULL, 'design', 1, 'You are Role 02 Designer Agent. Generate a valid Google Stitch layout, visual palette, and component hierarchy JSON.'),
  ('inst_dev_v1', NULL, 'dev', 1, 'You are Role 03 Developer Agent. Output clean production-grade TSX code.'),
  ('inst_qc_v1', NULL, 'qc', 1, 'You are Role 04 QC & Security Agent. Evaluate static code analysis and output security diagnostic JSON.'),
  ('inst_release_v1', NULL, 'release', 1, 'You are Role 05 Release Agent. Generate a release dossier JSON.')
ON CONFLICT (id) DO NOTHING;
