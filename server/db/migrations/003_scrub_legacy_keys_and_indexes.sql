-- Migration 003: Scrub legacy plaintext API keys from jobs payload and enforce partial unique active dispatch index

-- Scrub apiKey property from payload_json in jobs table if present
UPDATE jobs
SET payload_json = (payload_json::jsonb - 'apiKey')::text
WHERE payload_json LIKE '%apiKey%';

-- Enforce one active dispatch per stage run
CREATE UNIQUE INDEX IF NOT EXISTS idx_active_dispatch_per_run_stage
ON dispatches (stage_run_id)
WHERE state IN ('dispatched', 'running', 'pending');
