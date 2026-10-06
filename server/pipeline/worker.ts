import crypto from 'node:crypto';
import { db } from '../db';
import { decryptTenantSecret } from '../vault/crypto';
import { executeLlmRole } from '../adapters/llm';
import { evaluateEvidenceForStage } from '../evidence';
import { voidDownstream } from './voiding';
import { logAuditEvent } from '../audit/chain';
import { env } from '../config';

export interface DispatchJobPayload {
  tenantId: string;
  userId: string;
  runId: string;
  stageNo: number;
  stageRunId: string;
  dispatchId: string;
  roleName: string;
  connectionId?: string;
  modificationPrompt?: string;
  kind?: string;
}

export async function executeStageDispatchJob(payload: DispatchJobPayload) {
  const { tenantId, userId, runId, stageNo, stageRunId, dispatchId, roleName, connectionId, modificationPrompt, kind } = payload;

  try {
    // 1. Fetch Instruction Body
    const { rows: instRows } = await db.query(
      'SELECT body FROM instruction_versions WHERE role = $1 ORDER BY version DESC LIMIT 1',
      [roleName]
    );
    const instructionBody = instRows[0]?.body || `You are Role 0${stageNo} ${roleName} Agent. Produce strict JSON output.`;

    // 2. Load Upstream Artifacts and verify SHAs
    let upstreamArtifactsPrompt = '';
    if (stageNo > 1) {
      for (let prev = 1; prev < stageNo; prev++) {
        const { rows: prevArts } = await db.query(
          `SELECT a.* FROM artifacts a
           JOIN stage_runs sr ON sr.id = a.stage_run_id
           WHERE sr.run_id = $1 AND sr.stage = $2 ORDER BY a.version DESC LIMIT 1`,
          [runId, prev]
        );

        if (prevArts.length > 0) {
          const art = prevArts[0];
          const computedSha = crypto.createHash('sha256').update(art.content).digest('hex');
          if (computedSha !== art.sha256) {
            await db.query('UPDATE dispatches SET state = $1, error = $2 WHERE id = $3', [
              'failed',
              `ARTIFACT_CHECKSUM_MISMATCH: Upstream Stage ${prev} artifact sha256 mismatch.`,
              dispatchId,
            ]);
            await db.query('UPDATE stage_runs SET state = $1 WHERE id = $2', ['failed', stageRunId]);
            return;
          }

          upstreamArtifactsPrompt += `\n\n--- UNTRUSTED ARTIFACT Stage ${prev} (Kind: ${art.kind}, SHA-256: ${art.sha256}) ---\n${art.content}\n--- END UNTRUSTED ARTIFACT ---`;
        }
      }
    }

    const { rows: runRows } = await db.query('SELECT intent FROM runs WHERE id = $1', [runId]);
    const userIntent = runRows[0]?.intent || 'Build application';

    let fullPromptBrief = `Primary Run Intent:\n${userIntent}${upstreamArtifactsPrompt}`;

    if (kind === 'refine' && modificationPrompt) {
      fullPromptBrief += `\n\n--- UNTRUSTED USER REFINEMENT PROMPT ---\n${modificationPrompt}\n--- END UNTRUSTED USER REFINEMENT PROMPT ---`;

      const { rows: prevVerArts } = await db.query(
        'SELECT * FROM artifacts WHERE stage_run_id = $1 ORDER BY version DESC LIMIT 1',
        [stageRunId]
      );
      if (prevVerArts.length > 0) {
        fullPromptBrief += `\n\n--- PREVIOUS STAGE ARTIFACT (v${prevVerArts[0].version}, SHA: ${prevVerArts[0].sha256}) ---\n${prevVerArts[0].content}\n--- END PREVIOUS STAGE ARTIFACT ---`;
      }
    }

    // 3. Re-load Connection & Decrypt Key IN MEMORY at execution time
    let apiKey = '';
    if (connectionId) {
      const { rows: connRows } = await db.query(
        'SELECT * FROM provider_connections WHERE id = $1 AND tenant_id = $2',
        [connectionId, tenantId]
      );
      const conn = connRows[0];
      if (!conn || conn.status !== 'active') {
        await db.query('UPDATE dispatches SET state = $1, error = $2 WHERE id = $3', [
          'failed',
          'BYOK_CONNECTION_INACTIVE: Provider connection is inactive or missing.',
          dispatchId,
        ]);
        await db.query('UPDATE stage_runs SET state = $1 WHERE id = $2', ['failed', stageRunId]);
        return;
      }

      apiKey = await decryptTenantSecret(tenantId, conn.id, conn.ciphertext, conn.iv, conn.tag, conn.key_version);
    } else {
      apiKey = process.env.GEMINI_API_KEY || '';
      if (!apiKey && env.NODE_ENV === 'production') {
        await db.query('UPDATE dispatches SET state = $1, error = $2 WHERE id = $3', [
          'failed',
          'MANAGED_KEY_UNAVAILABLE: Platform GEMINI_API_KEY environment variable is not configured.',
          dispatchId,
        ]);
        await db.query('UPDATE stage_runs SET state = $1 WHERE id = $2', ['failed', stageRunId]);
        return;
      }
    }

    // Mark dispatch & stage_run state as running
    await db.query("UPDATE dispatches SET state = 'running' WHERE id = $1", [dispatchId]);
    await db.query("UPDATE stage_runs SET state = 'running' WHERE id = $1", [stageRunId]);

    // 4. Call LLM Role Adapter
    const res = await executeLlmRole(roleName as any, apiKey, fullPromptBrief, instructionBody, 'gemini-2.5-flash', modificationPrompt);

    // Drop decrypted apiKey reference
    apiKey = '';

    if (!res.valid) {
      await db.query('UPDATE dispatches SET state = $1, error = $2 WHERE id = $3', ['failed', res.validationError || 'INVALID_LLM_OUTPUT', dispatchId]);
      await db.query('UPDATE stage_runs SET state = $1 WHERE id = $2', ['failed', stageRunId]);
      return;
    }

    const artifactContent = typeof res.parsedContent === 'string' ? res.parsedContent : JSON.stringify(res.parsedContent, null, 2);
    const artifactSha = crypto.createHash('sha256').update(artifactContent).digest('hex');
    const artifactId = `art_${crypto.randomBytes(12).toString('hex')}`;

    const { rows: maxVerRows } = await db.query(
      'SELECT COALESCE(MAX(version), 0)::int as max_version FROM artifacts WHERE stage_run_id = $1',
      [stageRunId]
    );
    const nextVersion = (maxVerRows[0]?.max_version || 0) + 1;

    await db.query(
      `INSERT INTO artifacts (id, run_id, stage_run_id, dispatch_id, kind, version, content, mime, size, sha256, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        artifactId,
        runId,
        stageRunId,
        dispatchId,
        `${roleName}_output`,
        nextVersion,
        artifactContent,
        'application/json',
        Buffer.from(artifactContent).length,
        artifactSha,
        userId,
      ]
    );

    // Run Role-Specific Evidence Collector
    const stageChecks = evaluateEvidenceForStage(stageNo, roleName, artifactContent);
    for (const check of stageChecks) {
      const evidenceId = `ev_${crypto.randomBytes(12).toString('hex')}`;
      await db.query(
        `INSERT INTO evidence (id, dispatch_id, check_name, required, executed, result, details_json)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          evidenceId,
          dispatchId,
          check.checkName,
          check.required,
          check.executed,
          check.result,
          JSON.stringify(check.details || {}),
        ]
      );
    }

    // Void downstream stages if this is a refine dispatch
    if (kind === 'refine') {
      await voidDownstream(runId, stageNo, 'Stage output refined', userId);
    }

    const usageJson = JSON.stringify({ tokens: 500, model: 'gemini-2.5-flash' });
    await db.query("UPDATE dispatches SET state = 'completed', usage_json = $1 WHERE id = $2", [usageJson, dispatchId]);
    await db.query("UPDATE stage_runs SET state = 'awaiting_review' WHERE id = $1", [stageRunId]);

    await logAuditEvent(tenantId, userId, 'dispatch.completed', `dispatch:${dispatchId}`, { stageNo, roleName, version: nextVersion, kind: kind || 'start' });
  } catch (err: any) {
    await db.query('UPDATE dispatches SET state = $1, error = $2 WHERE id = $3', ['failed', err.message || 'DISPATCH_EXECUTION_ERROR', dispatchId]);
    await db.query('UPDATE stage_runs SET state = $1 WHERE id = $2', ['failed', stageRunId]);
  }
}

export async function processNextPendingJob(): Promise<boolean> {
  // Check global running jobs limit (max 3)
  const { rows: globalRunningRows } = await db.query("SELECT COUNT(*)::int as count FROM jobs WHERE state = 'running'");
  if ((globalRunningRows[0]?.count || 0) >= 3) {
    return false;
  }

  // Find next pending job
  const { rows: pendingJobs } = await db.query(
    "SELECT id, payload_json FROM jobs WHERE state = 'pending' ORDER BY run_at, id LIMIT 1"
  );

  if (pendingJobs.length === 0) {
    return false;
  }

  const candidate = pendingJobs[0];
  let payload: DispatchJobPayload;
  try {
    payload = JSON.parse(candidate.payload_json);
  } catch {
    await db.query("UPDATE jobs SET state = 'failed' WHERE id = $1", [candidate.id]);
    return false;
  }

  // Check tenant running jobs limit (max 1)
  const { rows: tenantRunningRows } = await db.query(
    "SELECT COUNT(*)::int as count FROM jobs WHERE state = 'running' AND (payload_json::json->>'tenantId') = $1",
    [payload.tenantId]
  );

  if ((tenantRunningRows[0]?.count || 0) >= 1) {
    return false;
  }

  // Claim job atomically
  const { rows: claimed } = await db.query(
    "UPDATE jobs SET state = 'running', locked_at = NOW() WHERE id = $1 AND state = 'pending' RETURNING id",
    [candidate.id]
  );

  if (claimed.length === 0) {
    return false;
  }

  try {
    await executeStageDispatchJob(payload);
    await db.query("UPDATE jobs SET state = 'completed' WHERE id = $1", [candidate.id]);
  } catch (err) {
    await db.query("UPDATE jobs SET state = 'failed' WHERE id = $1", [candidate.id]);
  }

  return true;
}

let workerTimer: NodeJS.Timeout | null = null;

export function startBackgroundWorker() {
  if (workerTimer) return workerTimer;
  workerTimer = setInterval(async () => {
    try {
      await processNextPendingJob();
    } catch {
      // Ignore background loop error
    }
  }, 1000);
  workerTimer.unref();
  return workerTimer;
}

export function stopBackgroundWorker() {
  if (workerTimer) {
    clearInterval(workerTimer);
    workerTimer = null;
  }
}
