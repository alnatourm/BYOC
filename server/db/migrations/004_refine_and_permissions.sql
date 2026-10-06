-- Migration 004: Refine Dispatches, Revision Limits & Gate Permissions Schema

ALTER TABLE dispatches ADD COLUMN IF NOT EXISTS kind VARCHAR(32) DEFAULT 'start';
ALTER TABLE dispatches ADD COLUMN IF NOT EXISTS modification_prompt TEXT DEFAULT NULL;

ALTER TABLE tenants ADD COLUMN IF NOT EXISTS max_revisions_per_stage INT DEFAULT 3;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS requesters_can_decide BOOLEAN DEFAULT FALSE;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS separation_of_duties_all_gates BOOLEAN DEFAULT FALSE;

ALTER TABLE plans ADD COLUMN IF NOT EXISTS max_revisions_per_stage INT DEFAULT 3;
