import crypto from 'node:crypto';
import { db } from '../server/db';
import { hashPassword } from '../server/auth/scrypt';
import { runMigrations } from '../server/db/migrate';

async function seedAdmin() {
  await runMigrations();
  const pass = await hashPassword('AdminPassword123!');

  // 1. Promote existing user(s) to super_admin
  await db.query("UPDATE users SET platform_role = 'super_admin'");

  // 2. Create default super_admin account admin@factory.com
  const { rows } = await db.query('SELECT id FROM users WHERE email = $1', ['admin@factory.com']);
  if (rows.length === 0) {
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

    console.log('✅ Created super_admin user: admin@factory.com / AdminPassword123!');
  } else {
    await db.query('UPDATE users SET platform_role = $1, password_hash = $2 WHERE email = $3', ['super_admin', pass, 'admin@factory.com']);
    console.log('✅ Updated super_admin user: admin@factory.com / AdminPassword123!');
  }

  process.exit(0);
}

seedAdmin().catch((e) => {
  console.error(e);
  process.exit(1);
});
