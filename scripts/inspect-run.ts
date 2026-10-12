import { db } from '../server/db';
import { runMigrations } from '../server/db/migrate';

async function inspectRun() {
  await runMigrations();
  const { rows: runs } = await db.query('SELECT * FROM runs ORDER BY created_at DESC LIMIT 1');
  console.log('RUN:', runs[0]);

  const { rows: dispatches } = await db.query('SELECT * FROM dispatches ORDER BY started_at DESC LIMIT 1');
  console.log('DISPATCH:', dispatches[0]);

  const { rows: artifacts } = await db.query('SELECT * FROM artifacts ORDER BY created_at DESC LIMIT 1');
  console.log('ARTIFACT:', artifacts[0]);

  process.exit(0);
}

inspectRun().catch((e) => {
  console.error(e);
  process.exit(1);
});
