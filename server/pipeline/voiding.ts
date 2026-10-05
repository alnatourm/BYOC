import { db } from '../db';
import { logAuditEvent } from '../audit/chain';

export async function voidDownstream(runId: string, stageNo: number, reason: string, userId = 'system') {
  const { rows: runRows } = await db.query('SELECT tenant_id FROM runs WHERE id = $1', [runId]);
  const tenantId = runRows[0]?.tenant_id || 'unknown';

  // Find all approved gates for stages >= stageNo
  const { rows: gatesToVoid } = await db.query(
    `SELECT g.id, g.gate_no, g.status
     FROM gates g
     JOIN stage_runs sr ON sr.id = g.stage_run_id
     WHERE sr.run_id = $1 AND sr.stage >= $2 AND g.status = 'approved'`,
    [runId, stageNo]
  );

  for (const gate of gatesToVoid) {
    await db.query("UPDATE gates SET status = 'void', comment = $1 WHERE id = $2", [`VOID: ${reason}`, gate.id]);
  }

  // Reset stage_runs > stageNo back to 'draft'
  await db.query(
    `UPDATE stage_runs SET state = 'draft' WHERE run_id = $1 AND stage > $2`,
    [runId, stageNo]
  );

  // Reset runs.current_stage back to stageNo
  await db.query('UPDATE runs SET current_stage = $1 WHERE id = $2', [stageNo, runId]);

  if (gatesToVoid.length > 0) {
    await logAuditEvent(tenantId, userId, 'gate.voided_downstream', `run:${runId}`, {
      stageNo,
      reason,
      voidedGatesCount: gatesToVoid.length,
    });
  }
}
