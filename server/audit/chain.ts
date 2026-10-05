import crypto from 'node:crypto';
import { db } from '../db';

export function canonicalJson(obj: any): string {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return '[' + obj.map(canonicalJson).join(',') + ']';
  }
  const keys = Object.keys(obj).sort();
  return '{' + keys.map((k) => JSON.stringify(k) + ':' + canonicalJson(obj[k])).join(',') + '}';
}

export async function logAuditEvent(
  tenantId: string,
  actorUserId: string | null,
  action: string,
  subject: string,
  payload: Record<string, any>
): Promise<{ id: string; hash: string }> {
  // Fetch latest event hash for this tenant
  const { rows } = await db.query(
    'SELECT hash FROM audit_events WHERE tenant_id = $1 ORDER BY seq DESC LIMIT 1',
    [tenantId]
  );

  const prevHash = rows.length > 0 ? rows[0].hash : '0000000000000000000000000000000000000000000000000000000000000000';
  const id = `aud_${crypto.randomBytes(12).toString('hex')}`;
  const payloadJson = canonicalJson(payload);

  const eventContent = `${prevHash}|${tenantId}|${actorUserId || 'system'}|${action}|${subject}|${payloadJson}`;
  const hash = crypto.createHash('sha256').update(eventContent).digest('hex');

  await db.query(
    `INSERT INTO audit_events (id, tenant_id, actor_user_id, action, subject, payload_json, prev_hash, hash)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [id, tenantId, actorUserId, action, subject, payloadJson, prevHash, hash]
  );

  return { id, hash };
}

export async function verifyAuditChain(tenantId: string): Promise<{ valid: boolean; brokenSeq?: number; totalEvents: number }> {
  const { rows } = await db.query(
    'SELECT seq, tenant_id, actor_user_id, action, subject, payload_json, prev_hash, hash FROM audit_events WHERE tenant_id = $1 ORDER BY seq ASC',
    [tenantId]
  );

  let expectedPrevHash = '0000000000000000000000000000000000000000000000000000000000000000';

  for (const event of rows) {
    if (event.prev_hash !== expectedPrevHash) {
      return { valid: false, brokenSeq: event.seq, totalEvents: rows.length };
    }

    const eventContent = `${event.prev_hash}|${event.tenant_id}|${event.actor_user_id || 'system'}|${event.action}|${event.subject}|${event.payload_json}`;
    const calculatedHash = crypto.createHash('sha256').update(eventContent).digest('hex');

    if (calculatedHash !== event.hash) {
      return { valid: false, brokenSeq: event.seq, totalEvents: rows.length };
    }

    expectedPrevHash = event.hash;
  }

  return { valid: true, totalEvents: rows.length };
}
