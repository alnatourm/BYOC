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
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}
