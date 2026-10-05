import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';

process.env.NODE_ENV = 'test';

import { app } from '../server';
import { runMigrations } from '../server/db/migrate';
import { db } from '../server/db';
import { isPrivateOrReservedIp, validateUrlSsrf } from '../server/utils/ssrfGuard';
import { computeFingerprint, encryptTenantSecret, decryptTenantSecret } from '../server/vault/crypto';

describe('2. Vault, Secrets & SSRF Guard Suite', () => {
  let cookie: string;
  let csrf: string;
  let tenantId: string;

  beforeAll(async () => {
    await runMigrations();

    const signupRes = await request(app).post('/v1/auth/signup').send({
      email: `vault_owner_${Date.now()}@example.com`,
      password: 'StrongPassword123!',
      companyName: 'Vault Testing Corp',
    });

    csrf = signupRes.body.csrfToken;
    cookie = signupRes.headers['set-cookie'][0];
    tenantId = signupRes.body.tenant.id;

    // Verify Email so hosting connections can be added
    const meRes = await request(app).get('/v1/me').set('Cookie', cookie);
    const userId = meRes.body.user.id;
    await db.query('UPDATE users SET email_verified_at = NOW() WHERE id = $1', [userId]);
  });

  describe('Vault AES-256-GCM Cryptography & Fingerprint', () => {
    it('Derives fingerprint with HKDF and encrypts/decrypts secret', async () => {
      const plainSecret = 'hetzner_sec_token_987654321_secret';
      const fp = computeFingerprint(plainSecret);
      expect(fp).toBeDefined();
      expect(fp.length).toBe(12);

      const enc = await encryptTenantSecret(tenantId, 'conn_123', plainSecret, 1);
      expect(enc.ciphertext).not.toContain(plainSecret);

      const dec = await decryptTenantSecret(tenantId, 'conn_123', enc.ciphertext, enc.iv, enc.tag, 1);
      expect(dec).toBe(plainSecret);
    });

    it('Fails decryption on wrong AAD context', async () => {
      const enc = await encryptTenantSecret(tenantId, 'conn_correct', 'my_secret_token', 1);
      await expect(
        decryptTenantSecret(tenantId, 'conn_WRONG_ID', enc.ciphertext, enc.iv, enc.tag, 1)
      ).rejects.toThrow();
    });
  });

  describe('SSRF Guard Range Enforcement (Section 1.5)', () => {
    it('Blocks all private and reserved IPv4 CIDR ranges', () => {
      const blockedIps = [
        '0.0.0.0',
        '0.1.2.3',
        '10.0.0.1',
        '10.255.255.255',
        '100.64.0.1',
        '100.127.255.255',
        '127.0.0.1',
        '127.0.0.254',
        '169.254.169.254',
        '172.16.0.1',
        '172.31.255.255',
        '192.0.0.1',
        '192.168.1.1',
        '192.168.255.254',
        '198.18.0.1',
        '224.0.0.1',
        '240.0.0.1',
      ];

      for (const ip of blockedIps) {
        expect(isPrivateOrReservedIp(ip)).toBe(true);
      }
    });

    it('Blocks all private and reserved IPv6 ranges', () => {
      const blockedIpv6 = [
        '::',
        '::1',
        '0:0:0:0:0:0:0:1',
        'fc00::1',
        'fd12:3456:789a:1::1',
        'fe80::1',
        'ff02::1',
        '::ffff:192.168.1.1',
        '::ffff:10.0.0.1',
      ];

      for (const ip of blockedIpv6) {
        expect(isPrivateOrReservedIp(ip)).toBe(true);
      }
    });

    it('Allows public internet IPv4 addresses', () => {
      expect(isPrivateOrReservedIp('8.8.8.8')).toBe(false);
      expect(isPrivateOrReservedIp('1.1.1.1')).toBe(false);
    });

    it('Rejects non-HTTPS protocols in URL validation', async () => {
      await expect(validateUrlSsrf('http://example.com/webhook')).rejects.toThrow('HTTPS');
      await expect(validateUrlSsrf('ftp://example.com')).rejects.toThrow();
    });
  });

  describe('Real Hosting Connections & Write-Only Secrets (Section 1.4)', () => {
    it('POST /v1/hosting-connections adds connection and never exposes secret in GET/POST response', async () => {
      const secret = 'hetzner_token_test_12345';
      const res = await request(app)
        .post('/v1/hosting-connections')
        .set('Cookie', cookie)
        .set('x-csrf-token', csrf)
        .send({
          type: 'hetzner_token',
          label: 'Production Hetzner CX22',
          secret,
        });

      expect(res.status).toBe(201);
      expect(res.body.connection.secret).toBeUndefined();
      expect(res.body.connection.ciphertext).toBeUndefined();
      expect(res.body.connection.fingerprint).toBeDefined();

      const getRes = await request(app)
        .get('/v1/hosting-connections')
        .set('Cookie', cookie);

      expect(getRes.status).toBe(200);
      expect(JSON.stringify(getRes.body)).not.toContain(secret);
    });
  });
});
