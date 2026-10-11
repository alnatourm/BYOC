import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { PGlite } from '@electric-sql/pglite';
import { env } from '../config';

const { Pool } = pg;

export interface DbClient {
  query<T = any>(sql: string, params?: any[]): Promise<{ rows: T[] }>;
}

let pool: pg.Pool | null = null;
let pgliteInstance: PGlite | null = null;

function cleanupStalePid() {
  try {
    const pidPath = path.resolve(process.cwd(), '.pglite_data/postmaster.pid');
    if (fs.existsSync(pidPath)) {
      fs.unlinkSync(pidPath);
    }
  } catch {
    // Ignore cleanup errors
  }
}

function getPgLite(): PGlite {
  if (!pgliteInstance) {
    if (process.env.NODE_ENV === 'test' || env.NODE_ENV === 'test') {
      pgliteInstance = new PGlite('memory://');
    } else {
      try {
        cleanupStalePid();
        pgliteInstance = new PGlite('./.pglite_data');
      } catch {
        pgliteInstance = new PGlite('memory://');
      }
    }
  }
  return pgliteInstance;
}

export function resetPgLiteInstance() {
  pgliteInstance = null;
  cleanupStalePid();
  try {
    const dataDir = path.resolve(process.cwd(), '.pglite_data');
    if (fs.existsSync(dataDir)) {
      fs.rmSync(dataDir, { recursive: true, force: true });
    }
  } catch {
    // ignore deletion errors
  }
}

if (env.DATABASE_URL) {
  pool = new Pool({
    connectionString: env.DATABASE_URL,
    max: 20,
  });
}

function sanitizeParams(params?: any[]): any[] | undefined {
  if (!params || !Array.isArray(params)) return undefined;
  return params.map((p) => {
    if (p === undefined) return null;
    if (p instanceof Date) return p.toISOString();
    return p;
  });
}

let queueTail: Promise<any> = Promise.resolve();

async function runInQueue<T>(task: () => Promise<T>): Promise<T> {
  let resResolver!: (val: T) => void;
  let rejResolver!: (err: any) => void;
  const resultPromise = new Promise<T>((resolve, reject) => {
    resResolver = resolve;
    rejResolver = reject;
  });

  queueTail = queueTail.then(
    async () => {
      try {
        const res = await task();
        resResolver(res);
      } catch (err) {
        rejResolver(err);
      }
    },
    async () => {
      try {
        const res = await task();
        resResolver(res);
      } catch (err) {
        rejResolver(err);
      }
    }
  );

  return resultPromise;
}

export const db: DbClient = {
  async query<T = any>(sql: string, params?: any[]): Promise<{ rows: T[] }> {
    const cleanParams = sanitizeParams(params);

    if (pool) {
      const res = await pool.query(sql, cleanParams);
      return { rows: res.rows };
    }

    return runInQueue(async () => {
      let pgInstance = getPgLite();
      try {
        await pgInstance.waitReady;
      } catch (err: any) {
        console.warn('[DB] PGlite waitReady failed. Resetting database...');
        resetPgLiteInstance();
        pgInstance = getPgLite();
        await pgInstance.waitReady;
      }

      try {
        const res = cleanParams && cleanParams.length > 0
          ? await pgInstance.query(sql, cleanParams)
          : await pgInstance.query(sql);
        return { rows: res.rows as T[] };
      } catch (err: any) {
        const errMsg = String(err?.message || err || '');
        if (errMsg.includes('Aborted') || errMsg.includes('WASM') || errMsg.includes('abort')) {
          console.warn('[DB] PGlite WASM aborted during query. Auto-recovering database instance...');
          resetPgLiteInstance();
          pgInstance = getPgLite();
          await pgInstance.waitReady;

          const { runMigrations } = await import('./migrate');
          await runMigrations();

          const res = cleanParams && cleanParams.length > 0
            ? await pgInstance.query(sql, cleanParams)
            : await pgInstance.query(sql);
          return { rows: res.rows as T[] };
        }
        throw err;
      }
    });
  },
};
