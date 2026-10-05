import crypto from 'node:crypto';

const SCRYPT_N = 65536; // 2^16
const SCRYPT_R = 8;
const SCRYPT_P = 2;
const KEY_LEN = 64;

// Precomputed Dummy Salt & Hash for Timing Attack Neutralization
const DUMMY_SALT = crypto.randomBytes(16).toString('hex');
const dummyBuf = crypto.scryptSync('dummy_password_for_timing', DUMMY_SALT, KEY_LEN, {
  N: SCRYPT_N,
  r: SCRYPT_R,
  p: SCRYPT_P,
  maxmem: 128 * 1024 * 1024,
});
const DUMMY_HASH = `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${DUMMY_SALT}$${dummyBuf.toString('hex')}`;

export async function hashPassword(password: string): Promise<string> {
  if (!password || password.length < 12) {
    throw new Error('Password must be at least 12 characters long.');
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, KEY_LEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
    maxmem: 128 * 1024 * 1024,
  });

  return `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt}$${derivedKey.toString('hex')}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const targetHash = storedHash || DUMMY_HASH;
  const parts = targetHash.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') {
    return false;
  }

  const [, nStr, rStr, pStr, salt, hashHex] = parts;
  const N = parseInt(nStr, 10);
  const r = parseInt(rStr, 10);
  const p = parseInt(pStr, 10);

  const derivedKey = crypto.scryptSync(password || '', salt, KEY_LEN, {
    N,
    r,
    p,
    maxmem: 128 * 1024 * 1024,
  });

  const keyBuffer = Buffer.from(hashHex, 'hex');
  if (derivedKey.length !== keyBuffer.length) {
    return false;
  }

  const matches = crypto.timingSafeEqual(derivedKey, keyBuffer);
  return storedHash ? matches : false;
}
