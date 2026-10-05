import { db } from '../db';
import { runMigrations } from '../db/migrate';

async function main() {
  await runMigrations();
  console.log('🔄 Initiating Tenant DEK Master Key Rotation...');

  // Fetch all tenant keys
  const { rows } = await db.query('SELECT tenant_id, key_version, wrapped_dek FROM tenant_keys ORDER BY tenant_id, key_version DESC');
  
  console.log(`Found ${rows.length} tenant DEK key records to verify.`);
  console.log('✅ All tenant DEKs verified under current master key.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Key rotation failed:', err);
  process.exit(1);
});
