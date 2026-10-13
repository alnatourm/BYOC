import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { db } from '../server/db';

describe('Production Fail-Closed & Database Guard Suite', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalDatabaseUrl = process.env.DATABASE_URL;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    process.env.DATABASE_URL = originalDatabaseUrl;
  });

  it('Proves production strictly fails closed when DATABASE_URL is missing and prohibits PGlite fallback', async () => {
    process.env.NODE_ENV = 'production';
    delete process.env.DATABASE_URL;

    // Attempting query in production without DATABASE_URL must throw fatal error
    await expect(db.query('SELECT 1')).rejects.toThrow(/FATAL_DATABASE_ERROR/);
  });
});
