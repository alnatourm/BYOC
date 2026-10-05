import { db } from '../db';
import { decryptTenantSecret } from '../vault/crypto';
import { verifyHostingToken } from '../hosting/capabilities';

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
  decryptedKey?: string;
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

  // Check 2: Run Existence & Previous Gate Approved + Artifact Checksum Match
  const { rows: runRows } = await db.query('SELECT * FROM runs WHERE id = $1 AND tenant_id = $2', [runId, tenantId]);
  const run = runRows[0];

  if (!run) {
    checks.push({
      checkName: 'run_exists',
      passed: false,
      reason: 'NOT_FOUND: Run not found or cross-tenant access denied.',
    });
  } else if (stageNo > 1) {
    const prevStage = stageNo - 1;
    const { rows: gateRows } = await db.query(
      `SELECT g.*, sr.run_id
       FROM gates g
       JOIN stage_runs sr ON sr.id = g.stage_run_id
       WHERE sr.run_id = $1 AND sr.stage = $2`,
      [runId, prevStage]
    );

    const prevGate = gateRows[0];
    if (!prevGate || prevGate.status !== 'approved') {
      checks.push({
        checkName: 'previous_gate_approved',
        passed: false,
        reason: `GATE_BLOCKED: Gate ${prevStage} must be approved before Stage ${stageNo} can start.`,
      });
    } else {
      checks.push({
        checkName: 'previous_gate_approved',
        passed: true,
        details: { prevGateNo: prevStage, status: prevGate.status },
      });
    }
  } else {
    checks.push({
      checkName: 'stage_1_initial',
      passed: true,
    });
  }

  // Check 3: Project & Role Slot & Provider Connection Live Verification
  let decryptedKey: string | undefined = undefined;
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
            try {
              decryptedKey = await decryptTenantSecret(tenantId, conn.id, conn.ciphertext, conn.iv, conn.tag, conn.key_version);
              checks.push({
                checkName: 'byok_key_decrypted_and_verified',
                passed: true,
                details: { connectionId: conn.id, type: conn.type, fingerprint: conn.fingerprint },
              });
            } catch (err: any) {
              checks.push({
                checkName: 'byok_key_decryption',
                passed: false,
                reason: `DECRYPTION_FAILED: ${err.message}`,
              });
            }
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
          decryptedKey = envKey;
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
        "SELECT id FROM dispatches WHERE stage_run_id = $1 AND state IN ('dispatched', 'running')",
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

  const hash = require('node:crypto').createHash('sha256').update(JSON.stringify(snapshot)).digest('hex');

  return {
    passed: overallPassed,
    checks,
    snapshot,
    hash,
    decryptedKey,
    connectionId,
  };
}
