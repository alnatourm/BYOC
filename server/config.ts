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
let vaultMasterKey = process.env.VAULT_MASTER_KEY;
if (nodeEnv === 'production') {
  if (!vaultMasterKey || Buffer.from(vaultMasterKey, 'base64').length !== 32) {
    console.error('FATAL_CONFIG_ERROR: Production requires VAULT_MASTER_KEY that base64-decodes to exactly 32 bytes.');
    process.exit(1);
  }
} else {
  // Development / Test Random Secret Generation & Persistence
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
}

let sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret || Buffer.from(sessionSecret, 'utf8').length < 32) {
  const devSecretPath = path.resolve(process.cwd(), '.dev-session-secret');
  if (fs.existsSync(devSecretPath)) {
    const saved = fs.readFileSync(devSecretPath, 'utf8').trim();
    if (Buffer.from(saved, 'utf8').length >= 32) {
      sessionSecret = saved;
    }
  }
  if (!sessionSecret || Buffer.from(sessionSecret, 'utf8').length < 32) {
    sessionSecret = crypto.randomBytes(32).toString('hex');
    try {
      fs.writeFileSync(devSecretPath, sessionSecret, 'utf8');
    } catch {}
  }
}

const appUrl = process.env.APP_URL || process.env.URL || 'http://localhost:3000';
const allowedOrigins = process.env.ALLOWED_ORIGINS || '*';
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
