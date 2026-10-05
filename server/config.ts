import { z } from 'zod';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import crypto from 'node:crypto';

dotenv.config();

const rawEnv = process.env.NODE_ENV;
const isDevOrTest = rawEnv === 'development' || rawEnv === 'test';
const nodeEnv = isDevOrTest ? (rawEnv as 'development' | 'test') : 'production';

// Production Fail-Closed Rules
if (nodeEnv === 'production') {
  const masterKey = process.env.VAULT_MASTER_KEY;
  if (!masterKey || Buffer.from(masterKey, 'base64').length !== 32) {
    console.error('FATAL_CONFIG_ERROR: Production requires VAULT_MASTER_KEY that base64-decodes to exactly 32 bytes.');
    process.exit(1);
  }

  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret || Buffer.from(sessionSecret, 'utf8').length < 32) {
    console.error('FATAL_CONFIG_ERROR: Production requires SESSION_SECRET of at least 32 bytes.');
    process.exit(1);
  }

  if (!process.env.APP_URL || process.env.APP_URL.trim().length === 0) {
    console.error('FATAL_CONFIG_ERROR: Production requires explicit APP_URL.');
    process.exit(1);
  }

  if (!process.env.ALLOWED_ORIGINS || process.env.ALLOWED_ORIGINS.trim().length === 0) {
    console.error('FATAL_CONFIG_ERROR: Production requires explicit ALLOWED_ORIGINS without localhost default.');
    process.exit(1);
  }
}

// Development / Test Random Secret Generation & Persistence
let vaultMasterKey = process.env.VAULT_MASTER_KEY;
if (!vaultMasterKey || Buffer.from(vaultMasterKey, 'base64').length !== 32) {
  const devKeyPath = path.resolve(process.cwd(), '.dev-vault-key');
  if (fs.existsSync(devKeyPath)) {
    const saved = fs.readFileSync(devKeyPath, 'utf8').trim();
    if (Buffer.from(saved, 'base64').length === 32) {
      vaultMasterKey = saved;
    }
  }
  if (!vaultMasterKey || Buffer.from(vaultMasterKey, 'base64').length !== 32) {
    vaultMasterKey = crypto.randomBytes(32).toString('base64');
    try {
      fs.writeFileSync(devKeyPath, vaultMasterKey, 'utf8');
    } catch {}
  }
}

let sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  const devSecretPath = path.resolve(process.cwd(), '.dev-session-secret');
  if (fs.existsSync(devSecretPath)) {
    sessionSecret = fs.readFileSync(devSecretPath, 'utf8').trim();
  } else {
    sessionSecret = crypto.randomBytes(32).toString('hex');
    try {
      fs.writeFileSync(devSecretPath, sessionSecret, 'utf8');
    } catch {}
  }
}

const appUrl = process.env.APP_URL || 'http://localhost:3000';
const allowedOrigins = process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000';
const trustProxy = process.env.TRUST_PROXY !== undefined ? parseInt(process.env.TRUST_PROXY, 10) : 0;

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().optional(),
  VAULT_MASTER_KEY: z.string(),
  SESSION_SECRET: z.string(),
  APP_URL: z.string(),
  ALLOWED_ORIGINS: z.string(),
  TRUST_PROXY: z.number().default(0),
  SMTP_URL: z.string().optional(),
  REQUIRE_TEST_EXECUTION: z.string().optional(),
});

export const env = configSchema.parse({
  NODE_ENV: nodeEnv,
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL,
  VAULT_MASTER_KEY: vaultMasterKey,
  SESSION_SECRET: sessionSecret,
  APP_URL: appUrl,
  ALLOWED_ORIGINS: allowedOrigins,
  TRUST_PROXY: trustProxy,
  SMTP_URL: process.env.SMTP_URL,
  REQUIRE_TEST_EXECUTION: process.env.REQUIRE_TEST_EXECUTION,
});
