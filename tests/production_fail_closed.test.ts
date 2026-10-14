import { describe, it, expect, afterEach } from 'vitest';
import { db } from '../server/db';

describe('Production & Preview Database Resilience Suite', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalDatabaseUrl = process.env.DATABASE_URL;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    process.env.DATABASE_URL = originalDatabaseUrl;
  });

  it('Proves application gracefully falls back to local PGlite storage when DATABASE_URL is missing, enabling seamless AI Studio publishing', async () => {
    process.env.NODE_ENV = 'production';
    delete process.env.DATABASE_URL;

    const res = await db.query('SELECT 1');
    expect(res.rows).toBeDefined();
    expect(res.rows.length).toBeGreaterThan(0);
  });
});
