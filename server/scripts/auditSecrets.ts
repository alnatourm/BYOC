import process from 'node:process';
process.env.NODE_ENV = process.env.NODE_ENV || 'test';

import request from 'supertest';

async function runSecretsAudit() {
  const { app } = await import('../../server');
  const { runMigrations } = await import('../db/migrate');
  const { db } = await import('../db');
  const { processNextPendingJob } = await import('../pipeline/worker');

  console.log('[AUDIT_SECRETS] Initializing database & running migrations...');
  await runMigrations();

  const SENTINEL = 'SENTINEL_SECRET_KEY_999_SUPER_SECRET';
  const logs: string[] = [];

  const originalLog = console.log;
  const originalError = console.error;
  console.log = (...args: any[]) => {
    logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    originalLog(...args);
  };
  console.error = (...args: any[]) => {
    logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    originalError(...args);
  };

  const capturedResponses: any[] = [];

  try {
    // 1. Signup Tenant
    const signupRes = await request(app).post('/v1/auth/signup').send({
      email: `audit_owner_${Date.now()}@secretstest.com`,
      password: 'StrongPassword123!',
      companyName: 'Secrets Audit Corp',
    });
    capturedResponses.push(signupRes.body);

    const csrf = signupRes.body.csrfToken;
    const cookie = signupRes.headers['set-cookie']?.[0];

    // Verify User Email
    await db.query('UPDATE users SET email_verified_at = NOW() WHERE id = $1', [signupRes.body.user.id]);

    // 2. Save Provider Connection with Sentinel Secret
    const connRes = await request(app)
      .post('/v1/connections')
      .set('Cookie', cookie)
      .set('x-csrf-token', csrf)
      .send({
        type: 'gemini',
        label: 'Sentinel Gemini Connection',
        secret: SENTINEL,
      });
    capturedResponses.push(connRes.body);

    const connId = connRes.body.connection.id;
    await db.query("UPDATE provider_connections SET status = 'active', last_verified_at = NOW() WHERE id = $1", [connId]);

    // 3. Create BYOK Project & Assign Role Slot
    const pRes = await request(app)
      .post('/v1/projects')
      .set('Cookie', cookie)
      .set('x-csrf-token', csrf)
      .send({ name: 'Sentinel Audit Project', mode: 'byok' });
    capturedResponses.push(pRes.body);

    const projectId = pRes.body.project.id;
    await db.query('UPDATE role_slots SET connection_id = $1 WHERE project_id = $2 AND role = $3', [connId, projectId, 'spec']);

    // 4. Create Run & Perform Start Stage 1
    const runRes = await request(app)
      .post('/v1/runs')
      .set('Cookie', cookie)
      .set('x-csrf-token', csrf)
      .send({ projectId, title: 'Sentinel Run', intent: 'Build audit app' });
    capturedResponses.push(runRes.body);

    const runId = runRes.body.run.id;

    const startRes = await request(app)
      .post(`/v1/runs/${runId}/stages/1/start`)
      .set('Cookie', cookie)
      .set('x-csrf-token', csrf)
      .set('Idempotency-Key', `idemp_audit_start_${Date.now()}`)
      .send({});
    capturedResponses.push(startRes.body);

    // Process worker job for stage start
    await processNextPendingJob();

    // 5. Perform Refine Dispatch on Stage 1
    const refineRes = await request(app)
      .post(`/v1/runs/${runId}/stages/1/refine`)
      .set('Cookie', cookie)
      .set('x-csrf-token', csrf)
      .set('Idempotency-Key', `idemp_audit_refine_${Date.now()}`)
      .send({ modificationPrompt: 'Sentinel refinement test prompt for audit' });
    capturedResponses.push(refineRes.body);

    // Process worker job for refine
    await processNextPendingJob();

    // 6. Query Gate
    const gateRes = await request(app)
      .get(`/v1/gates/gate_${runId}_g1`)
      .set('Cookie', cookie);
    capturedResponses.push(gateRes.body);

    // Assert (c): No API response body contains SENTINEL
    for (const resBody of capturedResponses) {
      const text = JSON.stringify(resBody);
      if (text.includes(SENTINEL)) {
        throw new Error(`SECRET_LEAK_IN_API_RESPONSE: Sentinel key found in API response body: ${text}`);
      }
    }

    // Assert (b): Captured logger output never contains SENTINEL
    const joinedLogs = logs.join('\n');
    if (joinedLogs.includes(SENTINEL)) {
      throw new Error('SECRET_LEAK_IN_LOGS: Sentinel key found in application log output.');
    }

    // Assert (a): Dump EVERY column of EVERY table as text and assert SENTINEL is absent
    const { rows: tables } = await db.query<{ table_name: string }>(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`
    );

    for (const t of tables) {
      const tableName = t.table_name;
      const { rows: tableRows } = await db.query(`SELECT * FROM "${tableName}"`);
      for (const row of tableRows) {
        for (const [colName, val] of Object.entries(row)) {
          if (colName === 'ciphertext') {
            // Ciphertext column stores encrypted AES-256-GCM data; raw SENTINEL string must not appear
            if (typeof val === 'string' && val.includes(SENTINEL)) {
              throw new Error(`SECRET_LEAK_IN_DB: Raw sentinel key found in ${tableName}.${colName}`);
            }
            continue;
          }

          const valStr = typeof val === 'object' ? JSON.stringify(val) : String(val);
          if (valStr.includes(SENTINEL)) {
            throw new Error(`SECRET_LEAK_IN_DB: Sentinel key found in plaintext in ${tableName}.${colName}: ${valStr}`);
          }
        }
      }
    }

    originalLog('✅ AUDIT SECRETS PASSED: Zero instances of plaintext secret leakage in database, logs, or API responses.');
    process.exit(0);
  } catch (err: any) {
    originalError('❌ AUDIT SECRETS FAILED:', err.message || err);
    process.exit(1);
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
}

runSecretsAudit();
