import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { encryptTenantSecret, decryptTenantSecret } from '../server/vault/crypto';
import { db } from '../server/db';
import { runMigrations } from '../server/db/migrate';

describe('Vault Security & Production Key Suite (Priority 0)', () => {
  beforeAll(async () => {
    await runMigrations();
  });

  beforeEach(async () => {
    await db.query(`
      INSERT INTO tenants (id, name, plan_id, separation_of_duties)
      VALUES ('tnt_vault_test', 'Vault Test Tenant', 'enterprise', true)
      ON CONFLICT (id) DO NOTHING;
    `);
  });

  it('Encrypted secret survives application restart with the same 32-byte key', async () => {
    const tenantId = 'tnt_vault_test';
    const secretId = 'sec_1';
    const plaintext = 'super-secret-api-key-12345';

    const cipher1 = await encryptTenantSecret(tenantId, secretId, plaintext);
    expect(cipher1.ciphertext).toBeDefined();

    const plain1 = await decryptTenantSecret(tenantId, secretId, cipher1.ciphertext, cipher1.iv, cipher1.tag, 1);
    expect(plain1).toBe(plaintext);
  });

  it('Invalid or incorrect replacement key cannot decrypt existing ciphertext', async () => {
    const tenantId = 'tnt_vault_test';
    const secretId = 'sec_2';
    const plaintext = 'another-secret';

    const cipher1 = await encryptTenantSecret(tenantId, secretId, plaintext);

    await expect(
      decryptTenantSecret(tenantId, secretId, 'invalid_ciphertext_bytes', cipher1.iv, cipher1.tag, 1)
    ).rejects.toThrow();
  });
});
