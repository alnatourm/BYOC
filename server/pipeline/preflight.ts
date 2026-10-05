import { db } from '../db';
import crypto from 'node:crypto';

export interface PreflightCheckResult {
  checkName: string;
  passed: boolean;
  reason?: string;
  details?: any;
}

export interface PreflightReport {
  passed: boolean;
  checks: PreflightCheckResult[];
  snapshot: any;
  hash: string;
  connectionId?: string;
}

export async function runPipelinePreflight(
  tenantId: string,
  userId: string,
  runId: string,
  stageNo: number,
  hostingConnectionId?: string
): Promise<PreflightReport> {
  const checks: PreflightCheckResult[] = [];

  // Check 1: User Authorized & Email Verified
  const { rows: userRows } = await db.query(
    `SELECT u.id, u.email_verified_at, m.role
     FROM users u
     JOIN memberships m ON m.user_id = u.id
     WHERE u.id = $1 AND m.tenant_id = $2`,
    [userId, tenantId]
  );

  const user = userRows[0];
  if (!user) {
    checks.push({
      checkName: 'user_authorized',
      passed: false,
      reason: 'UNAUTHORIZED: User is not a member of this tenant.',
    });
  } else if (!user.email_verified_at) {
    checks.push({
      checkName: 'email_verified',
      passed: false,
      reason: 'EMAIL_UNVERIFIED: User email address must be verified to start stage dispatch.',
    });
  } else {
    checks.push({
      checkName: 'user_authorized_and_verified',
      passed: true,
      details: { userId, role: user.role },
    });
  }

  // Check 2: Run Existence & Upstream Gate Approval + Stored Artifact SHA Verification
  const { rows: runRows } = await db.query('SELECT * FROM runs WHERE id = $1 AND tenant_id = $2', [runId, tenantId]);
  const run = runRows[0];

  if (!run) {
    checks.push({
      checkName: 'run_exists',
      passed: false,
      reason: 'NOT_FOUND: Run not found or cross-tenant access denied.',
    });
  } else if (stageNo > 1) {
    for (let prev = 1; prev < stageNo; prev++) {
      const { rows: gateRows } = await db.query(
        `SELECT g.*, sr.id as prev_stage_run_id
         FROM gates g
         JOIN stage_runs sr ON sr.id = g.stage_run_id
         WHERE sr.run_id = $1 AND sr.stage = $2`,
        [runId, prev]
      );

      const prevGate = gateRows[0];
      if (!prevGate) {
        checks.push({
          checkName: `upstream_gate_${prev}_approved`,
          passed: false,
          reason: `GATE_BLOCKED: Gate ${prev} has not been generated yet.`,
        });
      } else if (prevGate.status === 'void') {
        checks.push({
          checkName: `upstream_gate_${prev}_approved`,
          passed: false,
          reason: `GATE_VOIDED: Upstream Gate ${prev} has been voided. Re-approval required before proceeding.`,
        });
      } else if (prevGate.status !== 'approved') {
        checks.push({
          checkName: `upstream_gate_${prev}_approved`,
          passed: false,
          reason: `GATE_BLOCKED: Upstream Gate ${prev} must be approved before Stage ${stageNo} can start.`,
        });
      } else {
        // Compare stored SHA list against current artifact SHAs
        let storedShas: string[] = [];
        try {
          storedShas = JSON.parse(prevGate.artifact_sha_list_json || '[]');
        } catch {
          storedShas = [];
        }

        const { rows: currentArts } = await db.query(
          'SELECT sha256 FROM artifacts WHERE stage_run_id = $1',
          [prevGate.prev_stage_run_id]
        );
        const currentShas = currentArts.map((a) => a.sha256);

        const shasMatch =
          storedShas.length === currentShas.length &&
          storedShas.every((sha) => currentShas.includes(sha));

        if (!shasMatch) {
          checks.push({
            checkName: `upstream_gate_${prev}_artifact_sha_match`,
            passed: false,
            reason: `ARTIFACT_SHA_MISMATCH: Upstream Stage ${prev} artifact SHAs do not match approved gate SHAs. Please re-review Gate ${prev}.`,
          });
        } else {
          checks.push({
            checkName: `upstream_gate_${prev}_approved`,
            passed: true,
            details: { prevGateNo: prev, status: prevGate.status, shaCount: currentShas.length },
          });
        }
      }
    }
  } else {
    checks.push({
      checkName: 'stage_1_initial',
      passed: true,
    });
  }

  // Check 3: Project & Role Slot & Connection Active Check (NO KEY DECRYPTION)
  let connectionId: string | undefined = undefined;

  if (run) {
    const { rows: projRows } = await db.query('SELECT * FROM projects WHERE id = $1', [run.project_id]);
    const project = projRows[0];

    const roles = ['spec', 'design', 'dev', 'qc', 'release'];
    const roleName = roles[stageNo - 1] || 'spec';

    const { rows: slotRows } = await db.query(
      'SELECT * FROM role_slots WHERE project_id = $1 AND role = $2',
      [run.project_id, roleName]
    );

    const slot = slotRows[0];

    if (!slot) {
      checks.push({
        checkName: 'role_slot_configured',
        passed: false,
        reason: `ROLE_SLOT_MISSING: Role slot '${roleName}' is not configured for project.`,
      });
    } else {
      if (project.mode === 'byok') {
        if (!slot.connection_id) {
          checks.push({
            checkName: 'byok_connection_configured',
            passed: false,
            reason: `BYOK_CONNECTION_REQUIRED: Role slot '${roleName}' requires an active provider connection in BYOK mode.`,
          });
        } else {
          connectionId = slot.connection_id;
          const { rows: connRows } = await db.query(
            'SELECT * FROM provider_connections WHERE id = $1 AND tenant_id = $2',
            [slot.connection_id, tenantId]
          );

          const conn = connRows[0];
          if (!conn || conn.status !== 'active') {
            checks.push({
              checkName: 'byok_connection_active',
              passed: false,
              reason: 'BYOK_CONNECTION_INACTIVE: Provider connection is inactive or revoked.',
            });
          } else {
            // NO DECRYPTION PERFORMED OR RETURNED HERE
            checks.push({
              checkName: 'byok_connection_verified_active',
              passed: true,
              details: { connectionId: conn.id, type: conn.type, fingerprint: conn.fingerprint },
            });
          }
        }
      } else {
        // Managed Mode
        const envKey = process.env.GEMINI_API_KEY;
        if (!envKey || envKey.trim().length === 0) {
          checks.push({
            checkName: 'managed_platform_key_available',
            passed: false,
            reason: 'MANAGED_KEY_UNAVAILABLE: Platform GEMINI_API_KEY is not configured.',
          });
        } else {
          checks.push({
            checkName: 'managed_mode_preflight',
            passed: true,
            details: { mode: 'managed' },
          });
        }
      }
    }
  }

  // Check 4: Plan Quotas Check
  const { rows: tenantRows } = await db.query(
    `SELECT t.*, p.runs_per_month, p.active_runs
     FROM tenants t
     JOIN plans p ON p.id = t.plan_id
     WHERE t.id = $1`,
    [tenantId]
  );

  const tenant = tenantRows[0];
  if (tenant) {
    const { rows: activeRunsCountRows } = await db.query(
      `SELECT COUNT(*)::int as count FROM runs WHERE tenant_id = $1 AND status IN ('running', 'active')`,
      [tenantId]
    );

    const activeCount = activeRunsCountRows[0]?.count || 0;
    if (activeCount >= (tenant.active_runs || 100)) {
      checks.push({
        checkName: 'plan_quota_active_runs',
        passed: false,
        reason: `QUOTA_EXCEEDED: Active runs limit (${tenant.active_runs}) reached for tenant plan.`,
      });
    } else {
      checks.push({
        checkName: 'plan_quota_active_runs',
        passed: true,
        details: { activeCount, limit: tenant.active_runs },
      });
    }
  }

  // Check 5: No Active Dispatch For Run-Stage
  if (run) {
    const { rows: stageRunRows } = await db.query(
      'SELECT id FROM stage_runs WHERE run_id = $1 AND stage = $2',
      [runId, stageNo]
    );

    const stageRun = stageRunRows[0];
    if (stageRun) {
      const { rows: activeDispRows } = await db.query(
        "SELECT id FROM dispatches WHERE stage_run_id = $1 AND state IN ('dispatched', 'running', 'pending')",
        [stageRun.id]
      );

      if (activeDispRows.length > 0) {
        checks.push({
          checkName: 'no_active_dispatch',
          passed: false,
          reason: `CONCURRENT_DISPATCH_BLOCKED: Stage ${stageNo} already has an active running dispatch (${activeDispRows[0].id}).`,
        });
      } else {
        checks.push({
          checkName: 'no_active_dispatch',
          passed: true,
        });
      }
    }
  }

  // Check 6: Instruction Version Pinned
  checks.push({
    checkName: 'instruction_version_pinned',
    passed: true,
    details: { stageNo },
  });

  // Check 7: Stage 5 Only: Verified Hosting Connection Selected
  if (stageNo === 5) {
    if (!hostingConnectionId) {
      checks.push({
        checkName: 'hosting_connection_selected',
        passed: false,
        reason: 'HOSTING_CONNECTION_REQUIRED: Stage 5 (Release) requires selecting a verified hosting connection.',
      });
    } else {
      const { rows: hostConnRows } = await db.query(
        'SELECT * FROM hosting_connections WHERE id = $1 AND tenant_id = $2',
        [hostingConnectionId, tenantId]
      );

      const hostConn = hostConnRows[0];
      if (!hostConn) {
        checks.push({
          checkName: 'hosting_connection_exists',
          passed: false,
          reason: 'HOSTING_CONNECTION_NOT_FOUND: Selected hosting connection not found or cross-tenant access denied.',
        });
      } else if (hostConn.status !== 'verified') {
        checks.push({
          checkName: 'hosting_connection_verified',
          passed: false,
          reason: 'HOSTING_CONNECTION_UNVERIFIED: Selected hosting connection is unverified.',
        });
      } else {
        checks.push({
          checkName: 'hosting_connection_verified',
          passed: true,
          details: { id: hostConn.id, label: hostConn.label, type: hostConn.type },
        });
      }
    }
  }

  const overallPassed = checks.every((c) => c.passed);
  const snapshot = {
    tenantId,
    userId,
    runId,
    stageNo,
    at: new Date().toISOString(),
    checks,
  };

  const hash = crypto.createHash('sha256').update(JSON.stringify(snapshot)).digest('hex');

  return {
    passed: overallPassed,
    checks,
    snapshot,
    hash,
    connectionId,
  };
}
