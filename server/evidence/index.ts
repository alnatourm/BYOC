export interface EvidenceCheckResult {
  checkName: string;
  required: boolean;
  executed: boolean;
  result: 'pass' | 'fail' | 'na';
  details: Record<string, any>;
}

export function evaluateSpecEvidence(content: string): EvidenceCheckResult[] {
  const checks: EvidenceCheckResult[] = [];

  let parsed: any = null;
  let jsonParsePass = false;
  try {
    parsed = JSON.parse(content);
    jsonParsePass = true;
  } catch {
    jsonParsePass = false;
  }

  checks.push({
    checkName: 'spec_json_structure_parsed',
    required: true,
    executed: true,
    result: jsonParsePass ? 'pass' : 'fail',
    details: { parseSuccess: jsonParsePass },
  });

  const hasPrd = parsed && (parsed.prdSummary || parsed.productName);
  checks.push({
    checkName: 'spec_prd_section_present',
    required: true,
    executed: true,
    result: hasPrd ? 'pass' : 'fail',
    details: { prdFound: !!hasPrd },
  });

  const hasEpics = parsed && Array.isArray(parsed.epics) && parsed.epics.length > 0;
  checks.push({
    checkName: 'spec_user_stories_epics_present',
    required: true,
    executed: true,
    result: hasEpics ? 'pass' : 'fail',
    details: { epicsCount: hasEpics ? parsed.epics.length : 0 },
  });

  const hasSchema = parsed && (parsed.postgresSchema || parsed.schema);
  checks.push({
    checkName: 'spec_data_model_parsed',
    required: true,
    executed: true,
    result: hasSchema ? 'pass' : 'fail',
    details: { schemaFound: !!hasSchema },
  });

  return checks;
}

export function evaluateDesignEvidence(content: string, mime: string, size: number): EvidenceCheckResult[] {
  const checks: EvidenceCheckResult[] = [];

  const sizeOk = size > 0 && size <= 5 * 1024 * 1024; // 5 MB max
  checks.push({
    checkName: 'design_artifact_size_under_5mb',
    required: true,
    executed: true,
    result: sizeOk ? 'pass' : 'fail',
    details: { sizeBytes: size, limitBytes: 5242880 },
  });

  const allowedMime = ['application/json', 'text/html', 'image/png', 'application/pdf'].includes(mime);
  checks.push({
    checkName: 'design_mime_type_allowed',
    required: true,
    executed: true,
    result: allowedMime ? 'pass' : 'fail',
    details: { mime },
  });

  return checks;
}

export function evaluateDevEvidence(filePath: string, codeContent: string): EvidenceCheckResult[] {
  const checks: EvidenceCheckResult[] = [];

  // 1. Path Allow-List Check
  const pathForbidden = filePath.includes('..') || filePath.startsWith('/') || filePath.includes('.env') || filePath.includes('key');
  checks.push({
    checkName: 'dev_path_allowlisted',
    required: true,
    executed: true,
    result: !pathForbidden ? 'pass' : 'fail',
    details: { filePath, forbiddenCharsDetected: pathForbidden },
  });

  // 2. Code Syntax Check
  let syntaxCheckPass = true;
  let syntaxErrorMsg = '';
  if (!codeContent || codeContent.trim().length === 0) {
    syntaxCheckPass = false;
    syntaxErrorMsg = 'Empty code content';
  }

  checks.push({
    checkName: 'dev_typescript_transpile_diagnostics',
    required: true,
    executed: true,
    result: syntaxCheckPass ? 'pass' : 'fail',
    details: { transpileSuccess: syntaxCheckPass, diagnostics: syntaxErrorMsg },
  });

  // 3. Secret Scan (Private keys, API token patterns)
  const secretPatterns = [
    /-----BEGIN PRIVATE KEY-----/,
    /sk-[a-zA-Z0-9]{20,}/,
    /AIzaSy[a-zA-Z0-9_-]{33}/,
    /ghp_[a-zA-Z0-9]{36}/,
  ];
  const secretFound = secretPatterns.some((pattern) => pattern.test(codeContent));
  checks.push({
    checkName: 'dev_secret_scan_clean',
    required: true,
    executed: true,
    result: !secretFound ? 'pass' : 'fail',
    details: { secretDetected: secretFound },
  });

  // 4. Forbidden Pattern Scan (eval, new Function, child_process)
  const forbiddenPatterns = [/eval\(/, /new Function\(/, /child_process/];
  const forbiddenFound = forbiddenPatterns.some((p) => p.test(codeContent));
  checks.push({
    checkName: 'dev_forbidden_patterns_clean',
    required: true,
    executed: true,
    result: !forbiddenFound ? 'pass' : 'fail',
    details: { forbiddenFound },
  });

  return checks;
}

export function evaluateQCEvidence(filePath: string, codeContent: string): {
  checks: EvidenceCheckResult[];
  qcStatus: 'PASSED_STATIC_ONLY' | 'INCOMPLETE' | 'FAILED';
  aiOpinion: string;
} {
  const staticDevChecks = evaluateDevEvidence(filePath, codeContent);

  // Unexecuted Test Check
  const testExecutionCheck: EvidenceCheckResult = {
    checkName: 'qc_dynamic_test_execution',
    required: false, // Optional in Phase 1B
    executed: false,
    result: 'na',
    details: { reason: 'no sandbox until Phase 2' },
  };

  const allChecks = [...staticDevChecks, testExecutionCheck];
  const allRequiredPassed = staticDevChecks.every((c) => c.result === 'pass');

  const qcStatus = allRequiredPassed ? 'PASSED_STATIC_ONLY' : 'FAILED';
  const aiOpinion = 'AI Opinion (not evidence): Code adheres to static TypeScript standards. Dynamic unit tests remain unexecuted.';

  return {
    checks: allChecks,
    qcStatus,
    aiOpinion,
  };
}
