import readline from 'node:readline';
import crypto from 'node:crypto';
import { db } from '../db';
import { hashPassword } from '../auth/scrypt';
import { runMigrations } from '../db/migrate';

async function main() {
  await runMigrations();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (q: string) => new Promise<string>((resolve) => rl.question(q, resolve));

  const email = (process.argv[2] || (await question('Enter Super Admin Email: '))).trim().toLowerCase();
  const password = process.argv[3] || (await question('Enter Super Admin Password (min 12 chars): '));

  rl.close();

  if (!email || !password || password.length < 12) {
    console.error('Error: Email and password (at least 12 characters) are required.');
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);
  const userId = `usr_super_${crypto.randomBytes(8).toString('hex')}`;

  const { rows } = await db.query('SELECT id FROM users WHERE email = $1', [email]);
  if (rows.length > 0) {
    await db.query('UPDATE users SET platform_role = $1, password_hash = $2 WHERE email = $3', [
      'super_admin',
      passwordHash,
      email,
    ]);
    console.log(`✅ Promoted existing user ${email} to Super Admin.`);
  } else {
    await db.query(
      'INSERT INTO users (id, email, password_hash, email_verified_at, platform_role) VALUES ($1, $2, $3, NOW(), $4)',
      [userId, email, passwordHash, 'super_admin']
    );
    console.log(`✅ Created Super Admin user ${email}.`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error('Failed to create super admin:', err);
  process.exit(1);
});
