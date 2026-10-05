import { z } from 'zod';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().optional(),
  VAULT_MASTER_KEY: z.string().optional(),
  SESSION_SECRET: z.string().optional(),
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000,http://127.0.0.1:3000'),
  TRUST_PROXY: z.coerce.number().default(1),
  SMTP_URL: z.string().optional(),
});

const parsedEnv = configSchema.parse(process.env);

// Dev Vault Master Key Fallback Handler
let vaultMasterKey = parsedEnv.VAULT_MASTER_KEY;
if (!vaultMasterKey) {
  if (parsedEnv.NODE_ENV === 'production') {
    throw new Error('FATAL: VAULT_MASTER_KEY is required in production environment.');
  }
  const devKeyPath = path.resolve(process.cwd(), '.dev-vault-key');
  if (fs.existsSync(devKeyPath)) {
    vaultMasterKey = fs.readFileSync(devKeyPath, 'utf8').trim();
  } else {
    vaultMasterKey = Buffer.from('dev_master_key_32_bytes_long_12345678').toString('base64');
    fs.writeFileSync(devKeyPath, vaultMasterKey, 'utf8');
    console.warn('⚠️ WARNING: Generated temporary .dev-vault-key for development.');
  }
}

// Session Secret Production Guard
let sessionSecret = parsedEnv.SESSION_SECRET;
if (!sessionSecret) {
  if (parsedEnv.NODE_ENV === 'production') {
    throw new Error('FATAL: SESSION_SECRET is required in production environment.');
  }
  sessionSecret = 'dev_session_secret_32_bytes_long_string_123';
}

export const env = {
  ...parsedEnv,
  VAULT_MASTER_KEY: vaultMasterKey,
  SESSION_SECRET: sessionSecret,
};
