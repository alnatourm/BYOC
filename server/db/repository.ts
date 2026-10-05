import { db } from './index';

export class TenantRepository {
  constructor(public readonly tenantId: string) {
    if (!tenantId) {
      throw new Error('TenantRepository requires a valid tenant_id');
    }
  }

  async findOne<T = any>(tableName: string, whereClause: Record<string, any>): Promise<T | null> {
    const keys = Object.keys(whereClause);
    const conditions = ['tenant_id = $1'];
    const values: any[] = [this.tenantId];

    keys.forEach((k, idx) => {
      conditions.push(`${k} = $${idx + 2}`);
      values.push(whereClause[k]);
    });

    const sql = `SELECT * FROM ${tableName} WHERE ${conditions.join(' AND ')} LIMIT 1`;
    const { rows } = await db.query<T>(sql, values);
    return rows[0] || null;
  }

  async findMany<T = any>(tableName: string, whereClause: Record<string, any> = {}, orderBy?: string): Promise<T[]> {
    const keys = Object.keys(whereClause);
    const conditions = ['tenant_id = $1'];
    const values: any[] = [this.tenantId];

    keys.forEach((k, idx) => {
      conditions.push(`${k} = $${idx + 2}`);
      values.push(whereClause[k]);
    });

    let sql = `SELECT * FROM ${tableName} WHERE ${conditions.join(' AND ')}`;
    if (orderBy) {
      sql += ` ORDER BY ${orderBy}`;
    }

    const { rows } = await db.query<T>(sql, values);
    return rows;
  }

  async insert<T = any>(tableName: string, data: Record<string, any>): Promise<T> {
    const dataWithTenant: Record<string, any> = { ...data, tenant_id: this.tenantId };
    const keys = Object.keys(dataWithTenant);
    const cols = keys.join(', ');
    const placeholders = keys.map((_, idx) => `$${idx + 1}`).join(', ');
    const values = keys.map((k) => dataWithTenant[k]);

    const sql = `INSERT INTO ${tableName} (${cols}) VALUES (${placeholders}) RETURNING *`;
    const { rows } = await db.query<T>(sql, values);
    return rows[0];
  }

  async deleteOne(tableName: string, whereClause: Record<string, any>): Promise<boolean> {
    const keys = Object.keys(whereClause);
    const conditions = ['tenant_id = $1'];
    const values: any[] = [this.tenantId];

    keys.forEach((k, idx) => {
      conditions.push(`${k} = $${idx + 2}`);
      values.push(whereClause[k]);
    });

    const sql = `DELETE FROM ${tableName} WHERE ${conditions.join(' AND ')} RETURNING *`;
    const { rows } = await db.query(sql, values);
    return rows.length > 0;
  }
}
