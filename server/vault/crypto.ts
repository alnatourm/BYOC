import crypto from 'node:crypto';
import { env } from '../config';
import { db } from '../db';

const ALGORITHM = 'aes-256-gcm';

function getMasterKeyBuffer(): Buffer {
  const masterKey = env.VAULT_MASTER_KEY;
  if (Buffer.from(masterKey, 'base64').length === 32) {
    return Buffer.from(masterKey, 'base64');
  }
  return crypto.createHash('sha256').update(masterKey).digest();
}

export function computeFingerprint(secret: string): string {
  const masterKey = getMasterKeyBuffer();
  const hmac = crypto.createHmac('sha256', masterKey).update(secret).digest('hex');
  return hmac.slice(0, 12);
}

export async function getOrCreateTenantDek(tenantId: string, keyVersion = 1): Promise<Buffer> {
  const { rows } = await db.query(
    'SELECT wrapped_dek FROM tenant_keys WHERE tenant_id = $1 AND key_version = $2',
    [tenantId, keyVersion]
  );

  const masterKey = getMasterKeyBuffer();

  if (rows.length > 0) {
    const wrappedJson = JSON.parse(rows[0].wrapped_dek);
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      masterKey,
      Buffer.from(wrappedJson.iv, 'hex')
    );
    decipher.setAuthTag(Buffer.from(wrappedJson.tag, 'hex'));
    decipher.setAAD(Buffer.from(`tenant_dek_${tenantId}_v${keyVersion}`));
    const dek = Buffer.concat([
      decipher.update(Buffer.from(wrappedJson.ciphertext, 'hex')),
      decipher.final(),
    ]);
    return dek;
  } else {
    // Create new DEK
    const dek = crypto.randomBytes(32);
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, masterKey, iv);
    cipher.setAAD(Buffer.from(`tenant_dek_${tenantId}_v${keyVersion}`));
    const ciphertext = Buffer.concat([cipher.update(dek), cipher.final()]);
    const tag = cipher.getAuthTag();

    const wrappedJson = JSON.stringify({
      ciphertext: ciphertext.toString('hex'),
      iv: iv.toString('hex'),
      tag: tag.toString('hex'),
    });

    await db.query(
      'INSERT INTO tenant_keys (tenant_id, key_version, wrapped_dek) VALUES ($1, $2, $3)',
      [tenantId, keyVersion, wrappedJson]
    );

    return dek;
  }
}

export async function encryptTenantSecret(
  tenantId: string,
  connectionId: string,
  secret: string,
  keyVersion = 1
): Promise<{ ciphertext: string; iv: string; tag: string }> {
  const dek = await getOrCreateTenantDek(tenantId, keyVersion);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, dek, iv);
  cipher.setAAD(Buffer.from(`${tenantId}|${connectionId}|v${keyVersion}`));

  const ciphertext = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    ciphertext: ciphertext.toString('hex'),
    iv: iv.toString('hex'),
    tag: tag.toString('hex'),
  };
}

export async function decryptTenantSecret(
  tenantId: string,
  connectionId: string,
  ciphertext: string,
  iv: string,
  tag: string,
  keyVersion = 1
): Promise<string> {
  const dek = await getOrCreateTenantDek(tenantId, keyVersion);
  const decipher = crypto.createDecipheriv(ALGORITHM, dek, Buffer.from(iv, 'hex'));
  decipher.setAuthTag(Buffer.from(tag, 'hex'));
  decipher.setAAD(Buffer.from(`${tenantId}|${connectionId}|v${keyVersion}`));

  const secretBuf = Buffer.concat([
    decipher.update(Buffer.from(ciphertext, 'hex')),
    decipher.final(),
  ]);

  return secretBuf.toString('utf8');
}
