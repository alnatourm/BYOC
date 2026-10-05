import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execSync } from 'node:child_process';

function runVerifyInstall() {
  const rootDir = process.cwd();
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'byoc-verify-install-'));

  console.log(`[VERIFY_INSTALL] Copying workspace to temp directory: ${tmpDir}`);

  const items = fs.readdirSync(rootDir);
  for (const item of items) {
    if (item === 'node_modules' || item === '.git' || item === 'dist' || item === '.pglite_data') continue;
    const src = path.join(rootDir, item);
    const dest = path.join(tmpDir, item);
    fs.cpSync(src, dest, { recursive: true });
  }

  try {
    console.log('[VERIFY_INSTALL] Running npm ci (no flags)...');
    execSync('npm ci', { cwd: tmpDir, stdio: 'inherit' });

    console.log('[VERIFY_INSTALL] Running npm run lint...');
    execSync('npm run lint', { cwd: tmpDir, stdio: 'inherit' });

    console.log('[VERIFY_INSTALL] Running npm test...');
    execSync('npm test', { cwd: tmpDir, stdio: 'inherit' });

    console.log('[VERIFY_INSTALL] Running npm run build...');
    execSync('npm run build', { cwd: tmpDir, stdio: 'inherit' });

    console.log('✅ VERIFY INSTALL PASSED SUCCESSFULLY');
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

runVerifyInstall();
