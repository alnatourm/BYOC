import { Provider, Model, Agent, Role, ProjectArtifact } from '../types/byok';

export const INITIAL_PROVIDERS: Provider[] = [
  {
    id: 'prov-gemini',
    name: 'Google Gemini AI',
    type: 'gemini',
    baseUrl: 'https://generativelanguage.googleapis.com',
    vaultKeyId: 'vault_sec_gemini_9a8f',
    maskedSecret: 'AIzaSyD-•••••••••••••4k2M',
    isSecretInVault: true,
    status: 'active',
    rateLimitRpm: 360,
    totalCallsMonth: 14200,
    createdDate: '2026-01-15'
  },
  {
    id: 'prov-openai',
    name: 'OpenAI Enterprise',
    type: 'openai',
    baseUrl: 'https://api.openai.com/v1',
    vaultKeyId: 'vault_sec_openai_31c4',
    maskedSecret: 'sk-proj-•••••••••••••88f0',
    isSecretInVault: true,
    status: 'active',
    rateLimitRpm: 500,
    totalCallsMonth: 28400,
    createdDate: '2026-02-01'
  },
  {
    id: 'prov-anthropic',
    name: 'Anthropic Claude',
    type: 'anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    vaultKeyId: 'vault_sec_anthropic_77e1',
    maskedSecret: 'sk-ant-api03-•••••••••••••12xQ',
    isSecretInVault: true,
    status: 'active',
    rateLimitRpm: 200,
    totalCallsMonth: 9150,
    createdDate: '2026-02-10'
  },
  {
    id: 'prov-groq',
    name: 'Groq LPU Acceleration',
    type: 'groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    vaultKeyId: 'vault_sec_groq_002a',
    maskedSecret: 'gsk_•••••••••••••99b1',
    isSecretInVault: true,
    status: 'active',
    rateLimitRpm: 1000,
    totalCallsMonth: 41200,
    createdDate: '2026-03-01'
  },
  {
    id: 'prov-deepseek',
    name: 'DeepSeek AI',
    type: 'deepseek',
    baseUrl: 'https://api.deepseek.com/v1',
    vaultKeyId: 'vault_sec_deepseek_55d8',
    maskedSecret: 'sk-ds-•••••••••••••33a1',
    isSecretInVault: true,
    status: 'active',
    rateLimitRpm: 300,
    totalCallsMonth: 18900,
    createdDate: '2026-03-05'
  },
  {
    id: 'prov-stitch',
    name: 'Google Stitch AI',
    type: 'stitch',
    baseUrl: 'https://stitch.google.com/api/v1',
    vaultKeyId: 'vault_sec_stitch_882a',
    maskedSecret: 'stitch-key-•••••••••••••991X',
    isSecretInVault: true,
    status: 'active',
    rateLimitRpm: 600,
    totalCallsMonth: 21500,
    createdDate: '2026-03-15'
  }
];

export const INITIAL_MODELS: Model[] = [
  {
    id: 'mod-gemini-2.5-pro',
    providerId: 'prov-gemini',
    providerName: 'Google Gemini AI',
    name: 'Gemini 1.5 / 2.5 Pro Multimodal',
    modelIdentifier: 'gemini-2.5-pro',
    capabilities: ['code', 'vision', 'reasoning', 'function_calling', 'multimodal'],
    contextWindow: 2000000,
    maxOutputTokens: 8192,
    costPer1kInputUsd: 0.00125,
    costPer1kOutputUsd: 0.005,
    latencyMs: 340,
    status: 'available'
  },
  {
    id: 'mod-gpt-4o',
    providerId: 'prov-openai',
    providerName: 'OpenAI Enterprise',
    name: 'GPT-4o Omnimodal',
    modelIdentifier: 'gpt-4o',
    capabilities: ['code', 'vision', 'function_calling', 'multimodal'],
    contextWindow: 128000,
    maxOutputTokens: 4096,
    costPer1kInputUsd: 0.0025,
    costPer1kOutputUsd: 0.01,
    latencyMs: 290,
    status: 'available'
  },
  {
    id: 'mod-claude-3-5-sonnet',
    providerId: 'prov-anthropic',
    providerName: 'Anthropic Claude',
    name: 'Claude 3.5 Sonnet',
    modelIdentifier: 'claude-3-5-sonnet-20241022',
    capabilities: ['code', 'reasoning', 'vision'],
    contextWindow: 200000,
    maxOutputTokens: 8192,
    costPer1kInputUsd: 0.003,
    costPer1kOutputUsd: 0.015,
    latencyMs: 310,
    status: 'available'
  },
  {
    id: 'mod-deepseek-r1',
    providerId: 'prov-deepseek',
    providerName: 'DeepSeek AI',
    name: 'DeepSeek-V3 / R1 Reasoning',
    modelIdentifier: 'deepseek-reasoner',
    capabilities: ['code', 'reasoning'],
    contextWindow: 64000,
    maxOutputTokens: 8192,
    costPer1kInputUsd: 0.00055,
    costPer1kOutputUsd: 0.00219,
    latencyMs: 420,
    status: 'available'
  },
  {
    id: 'mod-stitch-design-pro',
    providerId: 'prov-stitch',
    providerName: 'Google Stitch AI',
    name: 'Stitch Design 2.5 Pro',
    modelIdentifier: 'google-stitch-design-pro',
    capabilities: ['code', 'vision', 'image_gen', 'multimodal', 'fast_inference'],
    contextWindow: 1000000,
    maxOutputTokens: 8192,
    costPer1kInputUsd: 0.0002,
    costPer1kOutputUsd: 0.0008,
    latencyMs: 160,
    status: 'available'
  }
];

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'agt-01-spec',
    name: '01. Product & Spec Agent',
    title: 'PRD, Functional Spec & Architecture Specifier',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    directives: 'Merges Product Management, Functional Spec Analysis, and System Architecture. Drafts PRDs, functional boundaries, API contracts, and PostgreSQL data models.',
    temperature: 0.3,
    tools: ['doc_generator', 'git_commit'],
    maxRunsPerDay: 1000,
    totalRunsCompleted: 420,
    status: 'idle',
    createdAt: '2026-03-01'
  },
  {
    id: 'agt-02-designer',
    name: '02. Designer Agent',
    title: 'Google Stitch AI Canvas Adapter Specialist',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    directives: 'Connects with Google Stitch AI Canvas adapter to synthesize spatial design tokens, 60-30-10 color themes, typography scales, wireframe frames, and micro-interactions.',
    temperature: 0.3,
    tools: ['google_stitch_canvas', 'google_stitch_figma', 'gemini_vision'],
    maxRunsPerDay: 800,
    totalRunsCompleted: 380,
    status: 'idle',
    createdAt: '2026-03-01'
  },
  {
    id: 'agt-03-developer',
    name: '03. Developer Agent',
    title: 'Unified Full-Stack Code Specialist',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    directives: 'Merges Frontend, Backend, and Database engineering. Writes pristine, type-safe React 19 + TypeScript components, API route handlers, and database schemas into one repo branch.',
    temperature: 0.2,
    tools: ['git_commit', 'code_executor', 'eslint_linter', 'db_migrator'],
    maxRunsPerDay: 1200,
    totalRunsCompleted: 610,
    status: 'idle',
    createdAt: '2026-03-01'
  },
  {
    id: 'agt-04-qc',
    name: '04. QC Agent',
    title: 'Quality & Security Auditor',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    directives: 'Merges QA Testing and Security Auditing. Performs SAST code scanning, automated end-to-end verification, edge-case validation, secret leak checks, and issues Q/C scorecards.',
    temperature: 0.1,
    tools: ['cypress_tester', 'eslint_linter'],
    maxRunsPerDay: 1000,
    totalRunsCompleted: 490,
    status: 'idle',
    createdAt: '2026-03-01'
  },
  {
    id: 'agt-05-release',
    name: '05. Release Agent',
    title: 'DevOps & Release Dossier Manager',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    directives: 'Handles DevOps packaging, Docker container builds, immutable SHA-256 release dossier checksum signing, and automated staging edge deployment.',
    temperature: 0.1,
    tools: ['checksum_signer', 'dossier_exporter', 'code_executor'],
    maxRunsPerDay: 1000,
    totalRunsCompleted: 310,
    status: 'idle',
    createdAt: '2026-03-01'
  }
];

export const INITIAL_ROLES: Role[] = [
  {
    id: 'role-01-spec',
    roleTitle: '01. Product & Spec',
    category: 'product',
    description: 'Merges PM + Spec Analyst + System Architect. Drafts functional PRDs and PostgreSQL data models.',
    assignedAgentId: 'agt-01-spec',
    assignedModelId: 'mod-claude-3-5-sonnet',
    fallbackModelId: 'mod-gpt-4o',
    executionOrder: 1,
    customMandate: 'Draft detailed user story epics, functional specs, and database entity relationship models.',
    status: 'active',
    updatedAt: '2026-03-28'
  },
  {
    id: 'role-02-designer',
    roleTitle: '02. Designer (Google Stitch)',
    category: 'design',
    description: 'Generates UI layouts, color themes, and component design tokens via Google Stitch AI Canvas.',
    assignedAgentId: 'agt-02-designer',
    assignedModelId: 'mod-stitch-design-pro',
    fallbackModelId: 'mod-gemini-2.5-pro',
    executionOrder: 2,
    customMandate: 'Utilize Google Stitch AI layout canvas and design tokens: 60-30-10 color budget and responsive frames.',
    status: 'active',
    updatedAt: '2026-03-28'
  },
  {
    id: 'role-03-developer',
    roleTitle: '03. Developer (Full-Stack)',
    category: 'dev',
    description: 'Merges Frontend + Backend + Database engineering into one unified repository branch.',
    assignedAgentId: 'agt-03-developer',
    assignedModelId: 'mod-claude-3-5-sonnet',
    fallbackModelId: 'mod-deepseek-r1',
    executionOrder: 3,
    customMandate: 'Write complete, drop-in TSX React 19 code, API route handlers, and database schemas.',
    status: 'active',
    updatedAt: '2026-03-28'
  },
  {
    id: 'role-04-qc',
    roleTitle: '04. QC (QA + Security)',
    category: 'qc',
    description: 'Merges QA Testing + Security Audits. Verifies code syntax, SAST leaks, and accessibility.',
    assignedAgentId: 'agt-04-qc',
    assignedModelId: 'mod-gpt-4o',
    fallbackModelId: 'mod-claude-3-5-sonnet',
    executionOrder: 4,
    customMandate: 'Audit code for syntax correctness, accessibility contrast, edge cases, and missing handlers.',
    status: 'active',
    updatedAt: '2026-03-28'
  },
  {
    id: 'role-05-release',
    roleTitle: '05. Release (DevOps)',
    category: 'devops',
    description: 'DevOps packaging, Docker builds, immutable SHA-256 release dossier signoff, and deployment.',
    assignedAgentId: 'agt-05-release',
    assignedModelId: 'mod-gemini-2.5-pro',
    fallbackModelId: 'mod-stitch-design-pro',
    executionOrder: 5,
    customMandate: 'Sign SHA-256 release dossier checksum and verify staging edge routing.',
    status: 'active',
    updatedAt: '2026-03-28'
  }
];

export const INITIAL_ARTIFACTS: ProjectArtifact[] = [
  {
    id: 'art-sample-portal',
    title: 'SAMPLE - NOT REAL • Customer Self-Service Portal',
    slug: 'sample-customer-portal',
    description: 'SAMPLE - NOT REAL • Full-stack customer portal with user profile management, service requests, and automated status notifications.',
    type: 'full_pipeline',
    category: 'Enterprise SaaS Portal',
    date: '2026-10-03',
    status: 'Approved',
    assignedRoles: {
      designerAgentId: 'agt-02-designer',
      designerModelId: 'mod-stitch-design-pro',
      developerAgentId: 'agt-03-developer',
      developerModelId: 'mod-claude-3-5-sonnet',
      qcAgentId: 'agt-04-qc',
      qcModelId: 'mod-gpt-4o'
    },
    metrics: {
      latencySeconds: 12.4,
      tokensUsed: 3820,
      estimatedCostUsd: 0.0028
    }
  }
];
