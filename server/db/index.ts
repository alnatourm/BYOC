import pg from 'pg';
import { PGlite } from '@electric-sql/pglite';
import { env } from '../config';

const { Pool } = pg;

export interface DbClient {
  query<T = any>(sql: string, params?: any[]): Promise<{ rows: T[] }>;
}

let pool: pg.Pool | null = null;
let pgliteInstance: PGlite | null = null;

function getPgLite(): PGlite {
  if (!pgliteInstance) {
    if (process.env.NODE_ENV === 'test' || env.NODE_ENV === 'test') {
      pgliteInstance = new PGlite('memory://');
    } else {
      try {
        pgliteInstance = new PGlite('./.pglite_data');
      } catch {
        pgliteInstance = new PGlite('memory://');
      }
    }
  }
  return pgliteInstance;
}

if (env.DATABASE_URL) {
  pool = new Pool({
    connectionString: env.DATABASE_URL,
    max: 20,
  });
}

let queryQueue: Promise<any> = Promise.resolve();

export const db: DbClient = {
  async query<T = any>(sql: string, params?: any[]): Promise<{ rows: T[] }> {
    if (pool) {
      const res = await pool.query(sql, params);
      return { rows: res.rows };
    } else {
      const pgInstance = getPgLite();
      await pgInstance.waitReady;

      const res = await (queryQueue = queryQueue.then(async () => {
        return params && params.length > 0
          ? await pgInstance.query(sql, params)
          : await pgInstance.query(sql);
      }, async () => {
        return params && params.length > 0
          ? await pgInstance.query(sql, params)
          : await pgInstance.query(sql);
      }));

      return { rows: res.rows as T[] };
    }
  },
};
