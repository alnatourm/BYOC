-- Migration 005: System Factory Settings & Role Key Bindings

CREATE TABLE IF NOT EXISTS system_factory_settings (
  role VARCHAR(32) PRIMARY KEY,
  model VARCHAR(128) NOT NULL DEFAULT 'gemini-3.8-flash',
  connection_id VARCHAR(64) DEFAULT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default factory settings for all 5 pipeline roles
INSERT INTO system_factory_settings (role, model, connection_id)
VALUES
  ('spec', 'gemini-3.8-flash', NULL),
  ('design', 'gemini-3.8-flash', NULL),
  ('dev', 'gemini-3.8-flash', NULL),
  ('qc', 'gemini-3.8-flash', NULL),
  ('release', 'gemini-3.8-flash', NULL)
ON CONFLICT (role) DO NOTHING;
