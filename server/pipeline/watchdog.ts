import { db } from '../db';
import { logAuditEvent } from '../audit/chain';

export async function recoverRunningDispatchesOnBoot() {
  try {
    const { rows: staleDispatches } = await db.query(
      `SELECT d.id, d.stage_run_id, sr.run_id, r.tenant_id
       FROM dispatches d
       JOIN stage_runs sr ON sr.id = d.stage_run_id
       JOIN runs r ON r.id = sr.run_id
       WHERE d.state IN ('dispatched', 'running')`
    );

    for (const disp of staleDispatches) {
      await db.query("UPDATE dispatches SET state = 'failed', error = 'BOOT_RECOVERY: Process restarted while dispatch was active.' WHERE id = $1", [disp.id]);
      await db.query("UPDATE stage_runs SET state = 'failed' WHERE id = $1", [disp.stage_run_id]);

      await logAuditEvent(
        disp.tenant_id,
        'system',
        'dispatch.boot_recovery_failed',
        `dispatch:${disp.id}`,
        { reason: 'Process rebooted during running dispatch' }
      );
    }

    if (staleDispatches.length > 0) {
      console.log(`[BOOT_RECOVERY] Recovered ${staleDispatches.length} stale active dispatches on boot.`);
    }
  } catch (err) {
    console.error('Boot recovery error:', err);
  }
}

export async function runWatchdogTimeoutCheck(timeoutMinutes = 10) {
  try {
    const cutoff = new Date(Date.now() - timeoutMinutes * 60 * 1000);
    const { rows: timedOutDispatches } = await db.query(
      `SELECT d.id, d.stage_run_id, r.tenant_id
       FROM dispatches d
       JOIN stage_runs sr ON sr.id = d.stage_run_id
       JOIN runs r ON r.id = sr.run_id
       WHERE d.state IN ('dispatched', 'running') AND d.started_at < $1`,
      [cutoff]
    );

    for (const disp of timedOutDispatches) {
      await db.query("UPDATE dispatches SET state = 'failed', error = 'WATCHDOG_TIMEOUT: Stage execution timed out.' WHERE id = $1", [disp.id]);
      await db.query("UPDATE stage_runs SET state = 'failed' WHERE id = $1", [disp.stage_run_id]);

      await logAuditEvent(
        disp.tenant_id,
        'system',
        'dispatch.watchdog_timeout',
        `dispatch:${disp.id}`,
        { timeoutMinutes }
      );
    }
  } catch (err) {
    console.error('Watchdog check error:', err);
  }
}
