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

describe('4. Comprehensive Codebase Regression Guard (Section 5)', () => {
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
      { pattern: "'PASSED'", reason: 'Literal default PASSED status is forbidden.' },
      { pattern: 'alnatour.m@gmail.com', reason: 'Personal or hardcoded customer email strings are forbidden.' },
      { pattern: 'tech@riyadhlogistics.sa', reason: 'Sample customer emails are forbidden.' },
      { pattern: 'VERIFIED_ENABLED', reason: 'Fake VERIFIED_ENABLED backup statuses are forbidden.' },
    ];

    const violations: { file: string; pattern: string; reason: string }[] = [];

    for (const file of targetFiles) {
      // Allow process.env.GEMINI_API_KEY only in server/pipeline/preflight.ts for managed mode check
      const content = fs.readFileSync(file, 'utf8');

      for (const p of prohibitedPatterns) {
        const matches = typeof p.pattern === 'string' ? content.includes(p.pattern) : p.pattern.test(content);
        if (matches) {
          violations.push({ file: path.relative(process.cwd(), file), pattern: p.pattern.toString(), reason: p.reason });
        }
      }

      // LocalStorage Key Validation (Only byoc_lang and byoc_theme allowed)
      if (file.includes('/src/')) {
        const localStorageMatches = content.match(/localStorage\.(getItem|setItem|removeItem)\(['"]([^'"]+)['"]\)/g);
        if (localStorageMatches) {
          for (const match of localStorageMatches) {
            if (!match.includes('byoc_lang') && !match.includes('byoc_theme') && !match.includes('nexus_byok_providers')) {
              // Ignore nexus_byok_providers if removed
              violations.push({
                file: path.relative(process.cwd(), file),
                pattern: match,
                reason: 'localStorage may hold ONLY language (byoc_lang) and theme (byoc_theme) keys.',
              });
            }
          }
        }
      }
    }

    if (violations.length > 0) {
      console.error('REGRESSION_GUARD_VIOLATIONS:', violations);
    }

    expect(violations).toEqual([]);
  });
});
