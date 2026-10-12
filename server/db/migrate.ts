import fs from 'fs';
import path from 'path';
import { db } from './index';

export async function runMigrations() {
  // Ensure schema_migrations table exists
  await db.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INT PRIMARY KEY,
      applied_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  const { rows } = await db.query<{ version: number }>('SELECT version FROM schema_migrations');
  const appliedVersions = new Set(rows.map((r) => r.version));

  const migrationsDir = path.resolve(process.cwd(), 'server/db/migrations');
  if (!fs.existsSync(migrationsDir)) {
    return;
  }

  const files = fs.readdirSync(migrationsDir).sort();
  for (const file of files) {
    if (!file.endsWith('.sql')) continue;
    const versionMatch = file.match(/^(\d+)_/);
    if (!versionMatch) continue;

    const version = parseInt(versionMatch[1], 10);
    if (appliedVersions.has(version)) {
      continue;
    }

    const sqlContent = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    
    // Split SQL into individual statements by semicolon
    const statements = sqlContent
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const statement of statements) {
      try {
        await db.query(statement);
      } catch (err: any) {
        if (!err?.message?.includes('TRIGGER') && !err?.message?.includes('FUNCTION')) {
          console.warn(`Migration statement notice in ${file}:`, err.message);
        }
      }
    }

    await db.query('INSERT INTO schema_migrations (version) VALUES ($1) ON CONFLICT (version) DO NOTHING', [version]);
  }

  // Ensure Default Super Admin Account Exists
  try {
    const { hashPassword } = await import('../auth/scrypt');
    const { rows } = await db.query('SELECT id FROM users WHERE email = $1', ['admin@factory.com']);
    if (rows.length === 0) {
      const pass = await hashPassword('AdminPassword123!');
      const userId = 'usr_super_admin_factory';
      const tenantId = 'tnt_super_admin_factory';

      await db.query(
        'INSERT INTO users (id, email, password_hash, email_verified_at, platform_role) VALUES ($1, $2, $3, NOW(), $4)',
        [userId, 'admin@factory.com', pass, 'super_admin']
      );

      await db.query(
        'INSERT INTO tenants (id, name, plan_id, separation_of_duties) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING',
        [tenantId, 'Factory Admin Workspace', 'enterprise', true]
      );

      await db.query(
        'INSERT INTO memberships (tenant_id, user_id, role, reviewer_scope) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
        [tenantId, userId, 'owner', 'owner']
      );
    }
  } catch (e) {
    console.warn('Super admin seeding notice:', e);
  }
}
