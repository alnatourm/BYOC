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
        await resetPgLiteInstance();
        pgInstance = await getPgLite();
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
          console.error('[DB] PGlite query aborted. Re-initializing instance without deleting data...', err);
          await resetPgLiteInstance();
          pgInstance = await getPgLite();
          await pgInstance.waitReady;

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
