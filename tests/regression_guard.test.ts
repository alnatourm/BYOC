import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist' && file !== 'tests' && file !== 'docs' && file !== '.pglite_data') {
        getAllFiles(fullPath, arrayOfFiles);
      }
    } else {
      if (
        fullPath.endsWith('.ts') ||
        fullPath.endsWith('.tsx') ||
        fullPath.endsWith('.js') ||
        fullPath.endsWith('.jsx')
      ) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

describe('4. Comprehensive Codebase Regression Guard (Section 5 & Prompt 1D)', () => {
  const targetFiles = [
    ...getAllFiles(path.resolve(process.cwd(), 'src')),
    ...getAllFiles(path.resolve(process.cwd(), 'server')),
  ];

  it('Codebase must contain zero instances of prohibited legacy/mock patterns', () => {
    const prohibitedPatterns: { pattern: string | RegExp; reason: string }[] = [
      { pattern: 'Math.random', reason: 'Math.random is prohibited in production code.' },
      { pattern: 'orchestrate-role', reason: 'Legacy open endpoint orchestrate-role must not be referenced.' },
      { pattern: 'secret_token_placeholder', reason: 'Hardcoded secret token placeholders are forbidden.' },
      { pattern: 'overallScore: 97', reason: 'Hardcoded QC score 97 is forbidden.' },
      { pattern: 'Sameer', reason: 'Hardcoded domain sample Sameer is forbidden.' },
      { pattern: 'salon', reason: 'Hardcoded domain sample salon is forbidden.' },
      { pattern: 'Certified', reason: 'Fake Certified toast/status is forbidden.' },
      { pattern: '38 / 38', reason: 'Hardcoded test count 38 / 38 is forbidden.' },
      { pattern: '99/100', reason: 'Hardcoded score 99/100 is forbidden.' },
      { pattern: 'Playwright', reason: 'Fake Playwright coverage claim is forbidden.' },
      { pattern: 'VERIFIED_ENABLED', reason: 'Fake VERIFIED_ENABLED backup statuses are forbidden.' },
    ];

    const violations: { file: string; pattern: string; reason: string }[] = [];

    for (const file of targetFiles) {
      const content = fs.readFileSync(file, 'utf8');

      for (const p of prohibitedPatterns) {
        const matches = typeof p.pattern === 'string' ? content.includes(p.pattern) : p.pattern.test(content);
        if (matches) {
          violations.push({ file: path.relative(process.cwd(), file), pattern: p.pattern.toString(), reason: p.reason });
        }
      }
    }

    if (violations.length > 0) {
      console.error('REGRESSION_GUARD_VIOLATIONS:', violations);
    }

    expect(violations).toEqual([]);
  });

  it('Gate Review components call /v1/gates and /v1/runs', () => {
    const gateReviewPath = path.resolve(process.cwd(), 'src/components/gates/GateReview.tsx');
    expect(fs.existsSync(gateReviewPath)).toBe(true);

    const content = fs.readFileSync(gateReviewPath, 'utf8');
    expect(content).toContain('/v1/gates/');
    expect(content).toContain('/v1/runs/');
  });
});
