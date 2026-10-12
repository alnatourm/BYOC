import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { PGlite } from '@electric-sql/pglite';
import { resetPgLiteInstance } from '../server/db/index';

describe('TEST 1: Database Data-Loss Protection Suite', () => {
  const testDataDir = path.resolve(process.cwd(), '.test_dataloss_pgdata');

  beforeEach(() => {
    if (fs.existsSync(testDataDir)) {
      fs.rmSync(testDataDir, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    if (fs.existsSync(testDataDir)) {
      fs.rmSync(testDataDir, { recursive: true, force: true });
    }
  });

  it('preserves user, tenant, project, and stage run data across simulated crashes and restarts without destructive deletion', async () => {
    // 1. Initialize disposable PGlite database instance
    let db = new PGlite(testDataDir);
    await db.waitReady;

    // Create schema tables
    await db.exec(`
      CREATE TABLE IF NOT EXISTS tenants (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        tenant_id VARCHAR(255) REFERENCES tenants(id),
        email VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(50) NOT NULL
      );
      CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(255) PRIMARY KEY,
        tenant_id VARCHAR(255) REFERENCES tenants(id),
        name VARCHAR(255) NOT NULL,
        intent TEXT
      );
      CREATE TABLE IF NOT EXISTS stage_runs (
        id VARCHAR(255) PRIMARY KEY,
        project_id VARCHAR(255) REFERENCES projects(id),
        stage_name VARCHAR(100) NOT NULL,
        status VARCHAR(50) NOT NULL
      );
    `);

    // 2. Insert test tenants
    await db.query(`INSERT INTO tenants (id, name) VALUES ('t1', 'Acme Corp'), ('t2', 'Beta Inc')`);

    // Insert test users
    await db.query(`
      INSERT INTO users (id, tenant_id, email, role) VALUES 
      ('u1', 't1', 'alice@acme.com', 'owner'),
      ('u2', 't2', 'bob@beta.com', 'owner')
    `);

    // Insert project and stage runs
    await db.query(`
      INSERT INTO projects (id, tenant_id, name, intent) VALUES 
      ('p1', 't1', 'TaskFlow App', 'Build task management application')
    `);

    await db.query(`
      INSERT INTO stage_runs (id, project_id, stage_name, status) VALUES 
      ('s1', 'p1', 'product', 'approved'),
      ('s2', 'p1', 'design', 'approved')
    `);

    // Verify records exist before crash
    const tenantsBefore = await db.query('SELECT * FROM tenants');
    const usersBefore = await db.query('SELECT * FROM users');
    const projectsBefore = await db.query('SELECT * FROM projects');
    const stageRunsBefore = await db.query('SELECT * FROM stage_runs');

    expect(tenantsBefore.rows.length).toBe(2);
    expect(usersBefore.rows.length).toBe(2);
    expect(projectsBefore.rows.length).toBe(1);
    expect(stageRunsBefore.rows.length).toBe(2);

    // 3. Simulate process crash / database disconnection
    await db.close();

    // Verify .test_dataloss_pgdata directory still exists on disk and was NOT deleted
    expect(fs.existsSync(testDataDir)).toBe(true);

    // Call resetPgLiteInstance() to verify that resetPgLiteInstance does NOT delete the directory
    resetPgLiteInstance();
    expect(fs.existsSync(testDataDir)).toBe(true);

    // 4. Restart application / restore database connection against same directory
    db = new PGlite(testDataDir);
    await db.waitReady;

    // 5. Query and confirm all records remain 100% intact
    const tenantsAfter = await db.query('SELECT * FROM tenants');
    const usersAfter = await db.query('SELECT * FROM users');
    const projectsAfter = await db.query('SELECT * FROM projects');
    const stageRunsAfter = await db.query('SELECT * FROM stage_runs');

    expect(tenantsAfter.rows.length).toBe(2);
    expect(usersAfter.rows.length).toBe(2);
    expect(projectsAfter.rows.length).toBe(1);
    expect(stageRunsAfter.rows.length).toBe(2);

    expect((tenantsAfter.rows[0] as any).name).toBe('Acme Corp');
    expect((usersAfter.rows[0] as any).email).toBe('alice@acme.com');
    expect((projectsAfter.rows[0] as any).name).toBe('TaskFlow App');
    expect((stageRunsAfter.rows[0] as any).stage_name).toBe('product');

    await db.close();
  }, 30000);
});
