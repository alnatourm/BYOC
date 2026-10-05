import pg from 'pg';
import { PGlite } from '@electric-sql/pglite';
import { env } from '../config';

const { Pool } = pg;

export interface DbClient {
  query<T = any>(sql: string, params?: any[]): Promise<{ rows: T[] }>;
}

let pool: pg.Pool | null = null;
let pgliteInstance: PGlite | null = null;

if (env.DATABASE_URL) {
  pool = new Pool({
    connectionString: env.DATABASE_URL,
    max: 20,
  });
} else {
  pgliteInstance = new PGlite('./.pglite_data');
}

export const db: DbClient = {
  async query<T = any>(sql: string, params?: any[]): Promise<{ rows: T[] }> {
    if (pool) {
      const res = await pool.query(sql, params);
      return { rows: res.rows };
    } else if (pgliteInstance) {
      const res = await pgliteInstance.query(sql, params);
      return { rows: res.rows as T[] };
    } else {
      throw new Error('No database client initialized');
    }
  },
};
