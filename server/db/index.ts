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

async function getPgLite(): Promise<PGlite> {
  if (!pgliteInstance) {
    if (process.env.NODE_ENV === 'test' || env.NODE_ENV === 'test') {
      pgliteInstance = new PGlite('memory://');
    } else {
      cleanupStalePid();
      pgliteInstance = new PGlite('./.pglite_data');
    }
  }
  return pgliteInstance;
}

export async function resetPgLiteInstance() {
  if (pgliteInstance) {
    try {
      await pgliteInstance.close();
    } catch {}
  }
  pgliteInstance = null;
  cleanupStalePid();
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
      try {
        const res = await pool.query(sql, cleanParams);
        return { rows: res.rows };
      } catch (poolErr: any) {
        // If pool fails and we want robust fallback or fail-fast
        throw poolErr;
      }
    }

    return runInQueue(async () => {
      let pgInstance = await getPgLite();
      try {
        await pgInstance.waitReady;
      } catch (err: any) {
        const errMsg = String(err?.message || err || '');
        console.error('[DB] PGlite waitReady failed:', errMsg);
        if (errMsg.includes('Aborted') || errMsg.includes('WASM') || errMsg.includes('abort') || errMsg.includes('failed')) {
          console.warn('[DB] Attempting safe backup and recovery of corrupted database state without data deletion...');
          await resetPgLiteInstance();
          const dataDir = path.resolve(process.cwd(), '.pglite_data');
          if (fs.existsSync(dataDir)) {
            const backupDir = path.resolve(process.cwd(), `.pglite_data_backup_${Date.now()}`);
            try {
              fs.renameSync(dataDir, backupDir);
              console.warn(`[DB] Successfully preserved existing data by moving it to ${backupDir}`);
            } catch (backupErr) {
              console.error('[DB] Failed to backup .pglite_data:', backupErr);
            }
          }
          pgInstance = await getPgLite();
          await pgInstance.waitReady;
          const { runMigrations } = await import('./migrate');
          await runMigrations();
        } else {
          throw err;
        }
      }

      try {
        const res = cleanParams && cleanParams.length > 0
          ? await pgInstance.query(sql, cleanParams)
          : await pgInstance.query(sql);
        return { rows: res.rows as T[] };
      } catch (err: any) {
        const errMsg = String(err?.message || err || '');
        if (errMsg.includes('Aborted') || errMsg.includes('WASM') || errMsg.includes('abort')) {
          console.error('[DB] PGlite WASM aborted during query. Attempting safe recovery...', err);
          await resetPgLiteInstance();
          pgInstance = await getPgLite();
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
