import { Router } from 'express';
import { z } from 'zod';
import crypto from 'node:crypto';
import { db } from '../db';
import { requireAuth, requireTenantRole, AuthRequest } from '../middleware/auth';
import { TenantRepository } from '../db/repository';
import { transitionStageState, isTransitionAllowed } from '../pipeline/stateMachine';
import { runPipelinePreflight } from '../pipeline/preflight';
import { executeLlmRole } from '../adapters/llm';
import { evaluateDevEvidence } from '../evidence';
import { logAuditEvent } from '../audit/chain';
import { env } from '../config';

export const pipelineRouter = Router();

const createProjectSchema = z.object({
  name: z.string().min(2, 'Project name is required'),
  mode: z.enum(['byok', 'managed']).default('byok'),
  repoFullName: z.string().optional(),
});

const createRunSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().min(2),
  intent: z.string().min(5),
  acceptanceCriteria: z.array(z.string()).optional(),
});

const gateDecisionSchema = z.object({
  decision: z.enum(['approved', 'changes_requested', 'rejected']),
  comment: z.string().optional(),
});

const updateTenantSettingsSchema = z.object({
  separationOfDuties: z.boolean(),
});

// GET /v1/projects
pipelineRouter.get('/projects', requireAuth, requireTenantRole('owner', 'admin', 'requester', 'viewer'), async (req: AuthRequest, res) => {
  try {
    const repo = new TenantRepository(req.membership!.tenantId);
    const projects = await repo.findMany('projects', {}, 'created_at DESC');
    res.json({ projects });
  } catch {
    res.status(500).json({ error: 'GENERIC_SERVER_ERROR' });
  }
});

// POST /v1/projects
pipelineRouter.post('/projects', requireAuth, requireTenantRole('owner', 'admin'), async (req: AuthRequest, res) => {
  try {
    const { name, mode, repoFullName } = createProjectSchema.parse(req.body);

    const { rows: tenantRows } = await db.query(
      `SELECT t.*, p.projects as max_projects FROM tenants t JOIN plans p ON p.id = t.plan_id WHERE t.id = $1`,
      [req.membership!.tenantId]
    );
    const { rows: projCountRows } = await db.query(
      'SELECT COUNT(*)::int as count FROM projects WHERE tenant_id = $1',
      [req.membership!.tenantId]
    );

    const currentCount = projCountRows[0]?.count || 0;
    const maxProjects = tenantRows[0]?.max_projects || 10;

    if (currentCount >= maxProjects) {
      return res.status(409).json({ error: `QUOTA_EXCEEDED: Project limit (${maxProjects}) reached for current plan.` });
    }

    const projectId = `proj_${crypto.randomBytes(12).toString('hex')}`;
    await db.query(
      `INSERT INTO projects (id, tenant_id, name, mode, repo_full_name, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [projectId, req.membership!.tenantId, name, mode, repoFullName || null, req.user!.id]
    );

    const roles = ['spec', 'design', 'dev', 'qc', 'release'];
    for (const r of roles) {
      await db.query(
        `INSERT INTO role_slots (project_id, role, model, constraints_json)
         VALUES ($1, $2, $3, $4)`,
        [projectId, r, 'gemini-2.5-flash', '{}']
      );
    }

    await logAuditEvent(
      req.membership!.tenantId,
      req.user!.id,
      'project.created',
      `project:${projectId}`,
      { name, mode }
    );

    res.status(201).json({
      project: { id: projectId, name, mode, repoFullName },
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'INVALID_INPUT: ' + err.issues.map((e: any) => e.message).join(', ') });
    }
    res.status(500).json({ error: 'GENERIC_SERVER_ERROR' });
  }
});

// GET /v1/runs
pipelineRouter.get('/runs', requireAuth, requireTenantRole('owner', 'admin', 'requester', 'viewer'), async (req: AuthRequest, res) => {
  try {
    const repo = new TenantRepository(req.membership!.tenantId);
    const runs = await repo.findMany('runs', {}, 'created_at DESC');
    res.json({ runs });
  } catch {
    res.status(500).json({ error: 'GENERIC_SERVER_ERROR' });
  }
});

// GET /v1/runs/:id
pipelineRouter.get('/runs/:id', requireAuth, requireTenantRole('owner', 'admin', 'requester', 'viewer'), async (req: AuthRequest, res) => {
  try {
    const repo = new TenantRepository(req.membership!.tenantId);
    const run = await repo.findOne('runs', { id: req.params.id });

    if (!run) {
      return res.status(404).json({ error: 'NOT_FOUND: Run not found or cross-tenant access denied.' });
    }

    const { rows: stageRuns } = await db.query(
      'SELECT * FROM stage_runs WHERE run_id = $1 ORDER BY stage ASC',
      [run.id]
    );

    const { rows: gates } = await db.query(
      `SELECT g.*, sr.stage
       FROM gates g
       JOIN stage_runs sr ON sr.id = g.stage_run_id
       WHERE sr.run_id = $1 ORDER BY g.gate_no ASC`,
      [run.id]
    );

    const { rows: artifacts } = await db.query(
      'SELECT * FROM artifacts WHERE run_id = $1 ORDER BY created_at DESC',
      [run.id]
    );

    const { rows: evidenceRows } = await db.query(
      `SELECT e.*, d.stage_run_id
       FROM evidence e
       JOIN dispatches d ON d.id = e.dispatch_id
       JOIN stage_runs sr ON sr.id = d.stage_run_id
       WHERE sr.run_id = $1`,
      [run.id]
    );

    res.json({
      run,
      stageRuns,
      gates,
      artifacts,
      evidence: evidenceRows,
    });
  } catch {
    res.status(500).json({ error: 'GENERIC_SERVER_ERROR' });
  }
});

// POST /v1/runs
pipelineRouter.post('/runs', requireAuth, requireTenantRole('owner', 'admin', 'requester'), async (req: AuthRequest, res) => {
  try {
    const { projectId, title, intent, acceptanceCriteria } = createRunSchema.parse(req.body);

    const repo = new TenantRepository(req.membership!.tenantId);
    const project = await repo.findOne('projects', { id: projectId });
    if (!project) {
      return res.status(404).json({ error: 'NOT_FOUND: Project not found or cross-tenant access denied.' });
    }

    const runId = `run_${crypto.randomBytes(12).toString('hex')}`;
    await db.query(
      `INSERT INTO runs (id, tenant_id, project_id, title, intent, acceptance_json, current_stage, status, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        runId,
        req.membership!.tenantId,
        projectId,
        title,
        intent,
        JSON.stringify(acceptanceCriteria || []),
        1,
        'draft',
        req.user!.id,
      ]
    );

    for (let s = 1; s <= 5; s++) {
      const stageRunId = `sr_${runId}_s${s}`;
      const initialState = s === 1 ? 'awaiting_start' : 'draft';
      await db.query(
        `INSERT INTO stage_runs (id, run_id, stage, state, attempt)
         VALUES ($1, $2, $3, $4, 1)`,
        [stageRunId, runId, s, initialState]
      );

      const gateId = `gate_${runId}_g${s}`;
      await db.query(
        `INSERT INTO gates (id, stage_run_id, gate_no, status)
         VALUES ($1, $2, $3, $4)`,
        [gateId, stageRunId, s, 'pending']
      );
    }

    await logAuditEvent(
      req.membership!.tenantId,
      req.user!.id,
      'run.created',
      `run:${runId}`,
      { projectId, title }
    );

    res.status(201).json({
      run: { id: runId, projectId, title, currentStage: 1, status: 'draft' },
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'INVALID_INPUT: ' + err.issues.map((e: any) => e.message).join(', ') });
    }
    res.status(500).json({ error: 'GENERIC_SERVER_ERROR' });
  }
});

// POST /v1/runs/:id/stages/:stage/preflight
pipelineRouter.post('/runs/:id/stages/:stage/preflight', requireAuth, requireTenantRole('owner', 'admin', 'requester'), async (req: AuthRequest, res) => {
  try {
    const stageNo = parseInt(req.params.stage, 10);
    const hostingConnectionId = req.body.hostingConnectionId;

    const preflight = await runPipelinePreflight(
      req.membership!.tenantId,
      req.user!.id,
      req.params.id,
      stageNo,
      hostingConnectionId
    );

    if (!preflight.passed) {
      return res.status(409).json({
        success: false,
        error: 'PREFLIGHT_FAILED: Preflight check failed.',
        checks: preflight.checks,
      });
    }

    res.json({
      success: true,
      checks: preflight.checks,
      hash: preflight.hash,
    });
  } catch {
    res.status(500).json({ error: 'GENERIC_SERVER_ERROR' });
  }
});

// POST /v1/runs/:id/stages/:stage/start
pipelineRouter.post('/runs/:id/stages/:stage/start', requireAuth, requireTenantRole('owner', 'admin', 'requester'), async (req: AuthRequest, res) => {
  try {
    const idempotencyKey = (req.headers['idempotency-key'] || req.headers['Idempotency-Key']) as string;
    if (!idempotencyKey) {
      return res.status(400).json({ error: 'IDEMPOTENCY_KEY_REQUIRED: Header Idempotency-Key is mandatory.' });
    }

    const { rows: existingDispatches } = await db.query(
      'SELECT * FROM dispatches WHERE idempotency_key = $1',
      [idempotencyKey]
    );

    if (existingDispatches.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Idempotent request already processed.',
        dispatch: existingDispatches[0],
      });
    }

    const stageNo = parseInt(req.params.stage, 10);
    const hostingConnectionId = req.body.hostingConnectionId;

    const preflight = await runPipelinePreflight(
      req.membership!.tenantId,
      req.user!.id,
      req.params.id,
      stageNo,
      hostingConnectionId
    );

    const { rows: stageRuns } = await db.query(
      'SELECT * FROM stage_runs WHERE run_id = $1 AND stage = $2',
      [req.params.id, stageNo]
    );
    const stageRun = stageRuns[0];

    if (!stageRun) {
      return res.status(404).json({ error: 'NOT_FOUND: Stage run not found.' });
    }

    if (!preflight.passed) {
      await db.query('UPDATE stage_runs SET state = $1 WHERE id = $2', ['blocked', stageRun.id]);
      await logAuditEvent(
        req.membership!.tenantId,
        req.user!.id,
        'pipeline.preflight_blocked',
        `stage_run:${stageRun.id}`,
        { failedChecks: preflight.checks.filter(c => !c.passed) }
      );

      return res.status(409).json({
        error: 'PREFLIGHT_BLOCKED: Stage dispatch blocked due to failed preflight checks.',
        checks: preflight.checks,
      });
    }

    await transitionStageState(req.membership!.tenantId, req.user!.id, 'user', stageRun.id, stageRun.state as any, 'verifying');
    await transitionStageState(req.membership!.tenantId, req.user!.id, 'system', stageRun.id, 'verifying', 'dispatched');

    const dispatchId = `disp_${crypto.randomBytes(12).toString('hex')}`;
    const roles = ['spec', 'design', 'dev', 'qc', 'release'];
    const roleName = roles[stageNo - 1] || 'spec';

    await db.query(
      `INSERT INTO dispatches (id, stage_run_id, role, connection_id, idempotency_key, started_by, preflight_snapshot_json, preflight_hash, state)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        dispatchId,
        stageRun.id,
        roleName,
        preflight.connectionId || null,
        idempotencyKey,
        req.user!.id,
        JSON.stringify(preflight.snapshot),
        preflight.hash,
        'running',
      ]
    );

    await db.query('UPDATE stage_runs SET state = $1 WHERE id = $2', ['running', stageRun.id]);

    const jobId = `job_${crypto.randomBytes(12).toString('hex')}`;
    await db.query(
      `INSERT INTO jobs (id, kind, payload_json, state)
       VALUES ($1, $2, $3, $4)`,
      [
        jobId,
        'execute_stage_dispatch',
        JSON.stringify({
          tenantId: req.membership!.tenantId,
          userId: req.user!.id,
          runId: req.params.id,
          stageNo,
          stageRunId: stageRun.id,
          dispatchId,
          roleName,
          apiKey: preflight.decryptedKey,
        }),
        'pending',
      ]
    );

    await processDispatchJob({
      tenantId: req.membership!.tenantId,
      userId: req.user!.id,
      runId: req.params.id,
      stageNo,
      stageRunId: stageRun.id,
      dispatchId,
      roleName,
      apiKey: preflight.decryptedKey!,
    });

    await logAuditEvent(
      req.membership!.tenantId,
      req.user!.id,
      'pipeline.stage_started',
      `dispatch:${dispatchId}`,
      { stageNo, roleName, idempotencyKey }
    );

    res.status(201).json({
      success: true,
      dispatchId,
      stageRunId: stageRun.id,
      status: 'running',
    });
  } catch (err: any) {
    console.error('Start stage error:', err);
    res.status(500).json({ error: 'GENERIC_SERVER_ERROR' });
  }
});

// POST /v1/gates/:id/decision
pipelineRouter.post('/gates/:id/decision', requireAuth, requireTenantRole('owner', 'admin', 'requester'), async (req: AuthRequest, res) => {
  try {
    const { decision, comment } = gateDecisionSchema.parse(req.body);

    if ((decision === 'changes_requested' || decision === 'rejected') && (!comment || comment.trim().length === 0)) {
      return res.status(400).json({ error: 'COMMENT_REQUIRED: A comment is mandatory when requesting changes or rejecting a gate.' });
    }

    const { rows: gateRows } = await db.query(
      `SELECT g.*, sr.run_id, sr.stage, r.tenant_id, r.created_by as run_creator
       FROM gates g
       JOIN stage_runs sr ON sr.id = g.stage_run_id
       JOIN runs r ON r.id = sr.run_id
       WHERE g.id = $1 AND r.tenant_id = $2`,
      [req.params.id, req.membership!.tenantId]
    );

    const gate = gateRows[0];
    if (!gate) {
      return res.status(404).json({ error: 'NOT_FOUND: Gate not found or cross-tenant access denied.' });
    }

    const { rows: tenantRows } = await db.query('SELECT separation_of_duties FROM tenants WHERE id = $1', [req.membership!.tenantId]);
    const separationOfDuties = tenantRows[0]?.separation_of_duties ?? true;

    if (gate.gate_no === 5 && separationOfDuties && gate.run_creator === req.user!.id) {
      return res.status(403).json({
        error: 'SEPARATION_OF_DUTIES_VIOLATION: Gate 5 approval requires an independent reviewer when separation of duties is enabled.',
      });
    }

    const { rows: artRows } = await db.query('SELECT sha256 FROM artifacts WHERE stage_run_id = $1', [gate.stage_run_id]);
    const shaList = artRows.map(a => a.sha256);

    const targetState = decision === 'approved' ? 'approved' : decision === 'changes_requested' ? 'changes_requested' : 'rejected';

    await db.query(
      `UPDATE gates
       SET status = $1, decided_by = $2, decided_at = NOW(), comment = $3, artifact_sha_list_json = $4
       WHERE id = $5`,
      [decision, req.user!.id, comment || null, JSON.stringify(shaList), gate.id]
    );

    await transitionStageState(req.membership!.tenantId, req.user!.id, 'user', gate.stage_run_id, 'awaiting_review', targetState as any);

    if (decision === 'approved' && gate.gate_no < 5) {
      const nextStage = gate.gate_no + 1;
      const { rows: nextStageRows } = await db.query(
        'SELECT id, state FROM stage_runs WHERE run_id = $1 AND stage = $2',
        [gate.run_id, nextStage]
      );
      if (nextStageRows.length > 0) {
        await transitionStageState(req.membership!.tenantId, req.user!.id, 'system', nextStageRows[0].id, nextStageRows[0].state as any, 'awaiting_start');
        await db.query('UPDATE runs SET current_stage = $1 WHERE id = $2', [nextStage, gate.run_id]);
      }
    }

    await logAuditEvent(
      req.membership!.tenantId,
      req.user!.id,
      'gate.decided',
      `gate:${gate.id}`,
      { decision, gateNo: gate.gate_no, comment }
    );

    res.json({
      success: true,
      gateId: gate.id,
      decision,
      status: decision,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'INVALID_INPUT: ' + err.issues.map((e: any) => e.message).join(', ') });
    }
    res.status(500).json({ error: 'GENERIC_SERVER_ERROR' });
  }
});

// PUT /v1/tenant/settings
pipelineRouter.put('/tenant/settings', requireAuth, requireTenantRole('owner'), async (req: AuthRequest, res) => {
  try {
    const { separationOfDuties } = updateTenantSettingsSchema.parse(req.body);

    await db.query('UPDATE tenants SET separation_of_duties = $1 WHERE id = $2', [
      separationOfDuties,
      req.membership!.tenantId,
    ]);

    await logAuditEvent(
      req.membership!.tenantId,
      req.user!.id,
      'tenant.settings_updated',
      `tenant:${req.membership!.tenantId}`,
      { separationOfDuties }
    );

    res.json({ success: true, separationOfDuties });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'INVALID_INPUT: ' + err.issues.map((e: any) => e.message).join(', ') });
    }
    res.status(500).json({ error: 'GENERIC_SERVER_ERROR' });
  }
});

export async function processDispatchJob(payload: {
  tenantId: string;
  userId: string;
  runId: string;
  stageNo: number;
  stageRunId: string;
  dispatchId: string;
  roleName: string;
  apiKey: string;
}) {
  const { tenantId, userId, runId, stageNo, stageRunId, dispatchId, roleName, apiKey } = payload;

  const { rows: instRows } = await db.query(
    'SELECT body FROM instruction_versions WHERE role = $1 ORDER BY version DESC LIMIT 1',
    [roleName]
  );
  const instructionBody = instRows[0]?.body || `You are Role 0${stageNo} ${roleName} Agent. Produce strict JSON output.`;

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
  const fullPromptBrief = `Primary Run Intent:\n${userIntent}${upstreamArtifactsPrompt}`;

  try {
    const res = await executeLlmRole(roleName as any, apiKey, fullPromptBrief, instructionBody, 'gemini-2.5-flash');

    if (!res.valid) {
      await db.query('UPDATE dispatches SET state = $1, error = $2 WHERE id = $3', ['failed', res.validationError, dispatchId]);
      await db.query('UPDATE stage_runs SET state = $1 WHERE id = $2', ['failed', stageRunId]);
      return;
    }

    const artifactContent = typeof res.parsedContent === 'string' ? res.parsedContent : JSON.stringify(res.parsedContent, null, 2);
    const artifactSha = crypto.createHash('sha256').update(artifactContent).digest('hex');
    const artifactId = `art_${crypto.randomBytes(12).toString('hex')}`;

    await db.query(
      `INSERT INTO artifacts (id, run_id, stage_run_id, dispatch_id, kind, version, content, mime, size, sha256, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        artifactId,
        runId,
        stageRunId,
        dispatchId,
        `${roleName}_output`,
        1,
        artifactContent,
        'application/json',
        Buffer.from(artifactContent).length,
        artifactSha,
        userId,
      ]
    );

    const devChecks = evaluateDevEvidence('generated_output.ts', artifactContent);
    for (const check of devChecks) {
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

    const testExecId = `ev_${crypto.randomBytes(12).toString('hex')}`;
    const requireTestExec = env.REQUIRE_TEST_EXECUTION === 'true';
    await db.query(
      `INSERT INTO evidence (id, dispatch_id, check_name, required, executed, result, details_json)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        testExecId,
        dispatchId,
        'qc_dynamic_test_execution',
        requireTestExec,
        false,
        requireTestExec ? 'fail' : 'pass',
        JSON.stringify({ reason: 'no sandbox until Phase 2', qcStatus: 'PASSED_STATIC_ONLY' }),
      ]
    );

    await db.query('UPDATE dispatches SET state = $1 WHERE id = $2', ['completed', dispatchId]);
    await db.query('UPDATE stage_runs SET state = $1 WHERE id = $2', ['awaiting_review', stageRunId]);
  } catch (err: any) {
    await db.query('UPDATE dispatches SET state = $1, error = $2 WHERE id = $3', ['failed', err.message, dispatchId]);
    await db.query('UPDATE stage_runs SET state = $1 WHERE id = $2', ['failed', stageRunId]);
  }
}
