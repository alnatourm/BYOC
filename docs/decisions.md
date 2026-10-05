# Architectural Decisions & Security Records

## Section A: Secrets Security & Key Scrubbing (Prompt 1D)
- **Plaintext Key Scrubbing**: Preflight no longer decrypts or returns raw API keys. `jobs.payload_json` contains IDs only (`tenantId`, `userId`, `runId`, `stageNo`, `stageRunId`, `dispatchId`, `roleName`, `connectionId`).
- **In-Memory Decryption**: The background worker re-loads the connection and decrypts the secret in memory strictly at execution time, passes it directly to the model adapter, and drops references immediately afterward.
- **Migration 003 Scrubbing**: Migration `003_scrub_legacy_keys_and_indexes.sql` strips any legacy `apiKey` properties from existing `jobs.payload_json` database records.
- **Security Notice & Key Rotation**: Any customer API key configured prior to Migration 003 must be considered exposed and should be rotated immediately by the customer in their respective provider console.

## Section B: In-Process Background Worker & Concurrency (Prompt 1D)
- **Asynchronous 202 Dispatch**: `POST /v1/runs/:id/stages/:stage/start` enqueues a job into the `jobs` table and immediately returns HTTP status `202 Accepted` with the `dispatchId`.
- **Worker Concurrency**: An in-process worker loop claims pending jobs using single-record queries with tenant-level (1 running job max per tenant) and global-level (3 running jobs max globally) concurrency limits.
- **No Auto-Retry**: Unhandled agent execution failures mark the dispatch and job state as `failed` without auto-retry.
- **Watchdog & Recovery**: `runWatchdogTimeoutCheck` runs every 60 seconds (10-minute default execution cap), and `recoverRunningDispatchesOnBoot` runs on server startup, failing abandoned active dispatches and writing audit events.

## Section C: Downstream Approval Voiding (Prompt 1D)
- **Voiding Transaction**: `voidDownstream(runId, stageNo, reason)` automatically marks all approved downstream gates for stages >= N as `void`, resets downstream stage runs back to `draft`, and resets `runs.current_stage` to N when a new artifact version is uploaded or a gate decision changes.
- **SHA Verification**: Preflight and deployment plan creation re-verify that every upstream gate is approved AND that its stored artifact SHA list matches current stage artifact SHAs.
