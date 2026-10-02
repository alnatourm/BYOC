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
    id: 'prov-factory',
    name: 'Platform Factory Managed Engine',
    type: 'factory',
    baseUrl: 'https://api.aifactory.internal/v1',
    vaultKeyId: 'vault_platform_managed',
    maskedSecret: 'MANAGED_PLATFORM_CREDITS',
    isSecretInVault: true,
    status: 'active',
    rateLimitRpm: 1200,
    totalCallsMonth: 58200,
    createdDate: '2026-03-20'
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
  },
  {
    id: 'prov-ollama',
    name: 'Local Ollama Cluster',
    type: 'ollama',
    baseUrl: 'http://localhost:11434',
    vaultKeyId: 'vault_sec_ollama_local',
    maskedSecret: 'NO_SECRET_REQUIRED_LOCAL',
    isSecretInVault: true,
    status: 'active',
    rateLimitRpm: 1200,
    totalCallsMonth: 6500,
    createdDate: '2026-03-12'
  }
];

export const INITIAL_MODELS: Model[] = [
  {
    id: 'mod-gemini-2.5-flash',
    providerId: 'prov-gemini',
    providerName: 'Google Gemini AI',
    name: 'Gemini 2.5 Flash',
    modelIdentifier: 'gemini-2.5-flash',
    capabilities: ['code', 'vision', 'function_calling', 'fast_inference', 'multimodal'],
    contextWindow: 1000000,
    maxOutputTokens: 8192,
    costPer1kInputUsd: 0.00015,
    costPer1kOutputUsd: 0.0006,
    latencyMs: 180,
    status: 'available'
  },
  {
    id: 'mod-gemini-2.5-pro',
    providerId: 'prov-gemini',
    providerName: 'Google Gemini AI',
    name: 'Gemini 2.5 Pro',
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
    name: 'DeepSeek R1 Reasoning',
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
  },
  {
    id: 'mod-stitch-design-flash',
    providerId: 'prov-stitch',
    providerName: 'Google Stitch AI',
    name: 'Stitch Vision-Design Flash',
    modelIdentifier: 'google-stitch-design-flash',
    capabilities: ['code', 'vision', 'fast_inference'],
    contextWindow: 500000,
    maxOutputTokens: 4096,
    costPer1kInputUsd: 0.0001,
    costPer1kOutputUsd: 0.0004,
    latencyMs: 110,
    status: 'available'
  },
  {
    id: 'mod-llama-3.3-70b',
    providerId: 'prov-groq',
    providerName: 'Groq LPU Acceleration',
    name: 'Llama 3.3 70B Versatile',
    modelIdentifier: 'llama-3.3-70b-versatile',
    capabilities: ['code', 'fast_inference', 'function_calling'],
    contextWindow: 128000,
    maxOutputTokens: 4096,
    costPer1kInputUsd: 0.00059,
    costPer1kOutputUsd: 0.00079,
    latencyMs: 95,
    status: 'available'
  }
];

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'agt-docuguard-dc',
    name: 'DocuGuard-DC',
    title: 'Document Control & Release Dossier Signoff Agent',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    directives: 'Generates immutable release dossiers, verifies checksums (SHA-256), enforces version increments, and compiles compliance records.',
    temperature: 0.1,
    tools: ['doc_generator', 'checksum_signer', 'dossier_exporter'],
    maxRunsPerDay: 1000,
    totalRunsCompleted: 512,
    status: 'idle',
    createdAt: '2026-03-20'
  },
  {
    id: 'agt-stitchcrafter-ui',
    name: 'StitchCrafter-UI',
    title: 'Google Stitch Design & Layout Engine Specialist',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    directives: 'Specialized in Google Stitch UI/UX design synthesis, auto-generating design tokens, spatial layout math, responsive wireframe frames, and Figma canvas sync.',
    temperature: 0.3,
    tools: ['google_stitch_canvas', 'google_stitch_figma', 'figma_exporter', 'gemini_vision'],
    maxRunsPerDay: 800,
    totalRunsCompleted: 310,
    status: 'idle',
    createdAt: '2026-03-15'
  },
  {
    id: 'agt-aura-ui',
    name: 'Aura-UI',
    title: 'Design System & Component Architect',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    directives: 'Specialized in modern Tailwind CSS, Cabinet Grotesk typography, zero-pill discipline, WCAG color contrast, and micro-interaction design specifications.',
    temperature: 0.4,
    tools: ['google_stitch_canvas', 'figma_exporter', 'gemini_vision'],
    maxRunsPerDay: 500,
    totalRunsCompleted: 142,
    status: 'idle',
    createdAt: '2026-02-01'
  },
  {
    id: 'agt-codeforge-ts',
    name: 'CodeForge-TS',
    title: 'Production React & TypeScript Specialist',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    directives: 'Writes pristine, type-safe React 19 / TypeScript components using Lucide icons, Motion animations, responsive grid layouts, and zero external dependency hacks.',
    temperature: 0.2,
    tools: ['git_commit', 'code_executor', 'eslint_linter'],
    maxRunsPerDay: 800,
    totalRunsCompleted: 389,
    status: 'idle',
    createdAt: '2026-02-01'
  },
  {
    id: 'agt-veritas-qc',
    name: 'Veritas-QC',
    title: 'Quality, Security & Accessibility Auditor',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    directives: 'Strict Q/C worker. Audits generated code for syntax correctness, accessibility contrast, edge cases, responsive layout shifts, and missing handlers.',
    temperature: 0.1,
    tools: ['cypress_tester', 'eslint_linter'],
    maxRunsPerDay: 1000,
    totalRunsCompleted: 412,
    status: 'idle',
    createdAt: '2026-02-05'
  },
  {
    id: 'agt-nova-planner',
    name: 'Nova-Planner',
    title: 'Product Requirements & User Story Specifier',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    directives: 'Breaks down vague user briefs into actionable component taxonomies, data models, and feature acceptance criteria.',
    temperature: 0.5,
    tools: ['git_commit'],
    maxRunsPerDay: 300,
    totalRunsCompleted: 98,
    status: 'idle',
    createdAt: '2026-02-12'
  },
  {
    id: 'agt-apex-devops',
    name: 'Apex-DevOps',
    title: 'Infrastructure & Container Release Manager',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    directives: 'Manages build environment configs, linting rules, deployment verification, and environment variable sanitation.',
    temperature: 0.1,
    tools: ['git_commit', 'db_migrator', 'code_executor'],
    maxRunsPerDay: 400,
    totalRunsCompleted: 156,
    status: 'idle',
    createdAt: '2026-02-18'
  }
];

export const INITIAL_ROLES: Role[] = [
  {
    id: 'role-designer',
    roleTitle: 'Designer',
    category: 'design',
    description: 'Responsible for component wireframing, color hierarchy, spatial math, and visual design system specs.',
    assignedAgentId: 'agt-stitchcrafter-ui',
    assignedModelId: 'mod-stitch-design-pro',
    fallbackModelId: 'mod-gemini-2.5-flash',
    executionOrder: 1,
    customMandate: 'Utilize Google Stitch AI layout canvas and design tokens: unboxed metadata, Cabinet Grotesk headings, 60-30-10 color budget, and dark slate backgrounds.',
    status: 'active',
    updatedAt: '2026-03-28'
  },
  {
    id: 'role-developer',
    roleTitle: 'Developer',
    category: 'dev',
    description: 'Responsible for turning design specs into fully functional React / TSX components with state handlers and motion animations.',
    assignedAgentId: 'agt-codeforge-ts',
    assignedModelId: 'mod-gemini-2.5-flash',
    fallbackModelId: 'mod-claude-3-5-sonnet',
    executionOrder: 2,
    customMandate: 'Write complete, drop-in TSX React code. Use Lucide icons, handle all loading and empty states, and enforce tabular-nums for numeric data.',
    status: 'active',
    updatedAt: '2026-03-28'
  },
  {
    id: 'role-qc',
    roleTitle: 'Q/C',
    category: 'qc',
    description: 'Responsible for verifying code functionality, accessibility compliance, layout integrity, and absence of dead clicks.',
    assignedAgentId: 'agt-veritas-qc',
    assignedModelId: 'mod-deepseek-r1',
    fallbackModelId: 'mod-gemini-2.5-pro',
    executionOrder: 3,
    customMandate: 'Perform 12-point quality check including WCAG AA contrast, responsive layout limits, error boundaries, and single-line control truncation.',
    status: 'active',
    updatedAt: '2026-03-29'
  },
  {
    id: 'role-doc-control',
    roleTitle: 'Document Control',
    category: 'doc_control',
    description: 'Responsible for compiling versioned release dossiers, signing SHA-256 checksums, and enforcing gate compliance.',
    assignedAgentId: 'agt-docuguard-dc',
    assignedModelId: 'mod-gemini-2.5-flash',
    fallbackModelId: 'mod-claude-3-5-sonnet',
    executionOrder: 4,
    customMandate: 'Sign release dossier with SHA-256 checksum, document version history, and human gate signoffs.',
    status: 'active',
    updatedAt: '2026-03-30'
  },
  {
    id: 'role-product-owner',
    roleTitle: 'Product Manager',
    category: 'product',
    description: 'Defines project scope, user goal to feature mapping, and component taxonomy prior to design generation.',
    assignedAgentId: 'agt-nova-planner',
    assignedModelId: 'mod-llama-3.3-70b',
    fallbackModelId: 'mod-gemini-2.5-flash',
    executionOrder: 0,
    customMandate: 'Provide 3 core feature pillars and 1 primary call to action for every brief.',
    status: 'active',
    updatedAt: '2026-03-25'
  }
];

export const INITIAL_ARTIFACTS: ProjectArtifact[] = [
  {
    id: 'art-nova-saas-billing',
    title: 'Nova Analytics SaaS Billing & Usage Portal',
    slug: 'nova-saas-billing',
    description: 'Enterprise tier selection, usage bar meter, payment method vault, and downloadable invoice ledger built by assigned Designer, Developer, and Q/C agents.',
    type: 'full_pipeline',
    category: 'SaaS Dashboard',
    date: '2026-03-29',
    status: 'Approved',
    assignedRoles: {
      designerAgentId: 'agt-aura-ui',
      designerModelId: 'mod-gemini-2.5-flash',
      developerAgentId: 'agt-codeforge-ts',
      developerModelId: 'mod-gemini-2.5-flash',
      qcAgentId: 'agt-veritas-qc',
      qcModelId: 'mod-deepseek-r1'
    },
    designSpec: {
      colorPalette: [
        { name: 'Canvas Dark Slate', hex: '#0F172A' },
        { name: 'Card Surface', hex: '#1E293B' },
        { name: 'Indigo Accent', hex: '#6366F1' },
        { name: 'Emerald Active', hex: '#10B981' }
      ],
      typographyHeading: 'Cabinet Grotesk',
      typographyBody: 'Plus Jakarta Sans',
      layoutStructure: '240px Left Navigation + Header Breadcrumbs + Metric Grid + Invoice Data Table',
      componentHierarchy: [
        'BillingHeader (Breadcrumbs & Plan Upgrade CTA)',
        'UsageOverviewCards (Active API Calls, Storage, Seats)',
        'SubscriptionPlanTierSelector (Monthly vs Annual Toggle)',
        'InvoiceHistoryTable (Tabular Numerals & Download PDF Action)'
      ]
    },
    codeContent: `import React, { useState } from 'react';
import { CreditCard, Download, ShieldCheck, Zap, ArrowUpRight, Check } from 'lucide-react';

export default function SaaSBillingPortal() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'enterprise'>('enterprise');

  const invoices = [
    { id: 'INV-2026-089', date: 'March 1, 2026', amount: '$490.00', status: 'Paid', method: 'Visa •••• 4242' },
    { id: 'INV-2026-054', date: 'Feb 1, 2026', amount: '$490.00', status: 'Paid', method: 'Visa •••• 4242' },
    { id: 'INV-2026-012', date: 'Jan 1, 2026', amount: '$490.00', status: 'Paid', method: 'Visa •••• 4242' },
  ];

  return (
    <div className="p-6 bg-slate-900 rounded-xl text-slate-100 border border-slate-800 font-sans space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>Workspace</span>
            <span>/</span>
            <span className="text-indigo-400 font-medium">Billing & Quotas</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-display">Enterprise Subscription</h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition">
            Payment Methods
          </button>
          <button className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            Upgrade Capacity
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-950/60 rounded-lg border border-slate-800/80">
          <div className="text-xs text-slate-400 mb-1">Monthly API Calls</div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">1,420,890 / 2,000,000</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: '71%' }}></div>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">71% consumed · 12 days remaining</div>
        </div>

        <div className="p-4 bg-slate-950/60 rounded-lg border border-slate-800/80">
          <div className="text-xs text-slate-400 mb-1">Encrypted Vault Storage</div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">18.4 GB / 50 GB</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '36.8%' }}></div>
          </div>
          <div className="text-[11px] text-slate-500 mt-2">36.8% consumed · Isolated KMS</div>
        </div>

        <div className="p-4 bg-slate-950/60 rounded-lg border border-slate-800/80">
          <div className="text-xs text-slate-400 mb-1">Active Worker Agents</div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">8 Agents Online</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-3 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Policy Compliant</span>
          </div>
        </div>
      </div>

      {/* Plan Switcher */}
      <div className="p-5 bg-slate-950/40 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Current Active Plan</h3>
          <div className="flex items-center p-1 bg-slate-900 rounded-lg border border-slate-800">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={\`px-3 py-1 text-xs font-medium rounded-md transition \${billingCycle === 'monthly' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}\`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={\`px-3 py-1 text-xs font-medium rounded-md transition \${billingCycle === 'annual' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}\`}
            >
              Annual (Save 20%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            onClick={() => setSelectedPlan('pro')}
            className={\`p-4 rounded-xl border cursor-pointer transition \${selectedPlan === 'pro' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'}\`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-semibold text-white">Growth Team</span>
                <p className="text-xs text-slate-400">For scaling startups with up to 10 agents</p>
              </div>
              <span className="text-lg font-bold text-white font-mono">$149<span className="text-xs text-slate-400 font-sans">/mo</span></span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 mt-3">
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-400" /> 500k API Tokens / mo</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-400" /> Standard Vault Secrets</li>
            </ul>
          </div>

          <div 
            onClick={() => setSelectedPlan('enterprise')}
            className={\`p-4 rounded-xl border cursor-pointer transition \${selectedPlan === 'enterprise' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'}\`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">Enterprise BYOK</span>
                <span className="px-2 py-0.5 text-[10px] bg-indigo-500/20 text-indigo-300 rounded font-medium border border-indigo-500/30">CURRENT</span>
              </div>
              <span className="text-lg font-bold text-white font-mono">$490<span className="text-xs text-slate-400 font-sans">/mo</span></span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 mt-3">
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-400" /> 2,000k API Tokens / mo</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-indigo-400" /> Unlimited Swappable Roles & Agents</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-slate-950/40 rounded-xl border border-slate-800 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Recent Payment History</h3>
          <span className="text-xs text-slate-400">Showing last 3 statements</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 text-slate-400 font-medium">
              <tr>
                <th className="py-2.5 px-3">Invoice Ref</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Payment Method</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3 px-3 font-medium text-white">{inv.id}</td>
                  <td className="py-3 px-3 font-sans text-slate-400">{inv.date}</td>
                  <td className="py-3 px-3 font-sans text-slate-300">{inv.method}</td>
                  <td className="py-3 px-3 text-right text-white font-bold">{inv.amount}</td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 text-[10px] font-sans font-medium text-emerald-400 bg-emerald-500/10 rounded">
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-sans">
                    <button className="text-indigo-400 hover:text-indigo-300 transition flex items-center justify-end gap-1 ml-auto">
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}`,
    qcReport: {
      overallScore: 98,
      passStatus: 'PASSED',
      checksPassed: [
        'WCAG AA contrast verified across dark slate background (#0F172A vs #FFFFFF)',
        'Tabular numerals applied to API tokens and financial amounts',
        'No dead click handlers on billing toggle or plan selectors',
        'Responsive layout scaling verified at 1440px desktop baseline'
      ],
      warnings: ['Consider adding pagination when invoice history exceeds 20 rows.'],
      recommendations: ['Enable automatic PDF receipt email dispatch for annual renewals.'],
      accessibilityScore: 100,
      securityScore: 97,
      codeQualityScore: 98
    },
    metrics: {
      latencySeconds: 2.4,
      tokensUsed: 4120,
      estimatedCostUsd: 0.0028
    }
  },
  {
    id: 'art-cybervault-security-portal',
    title: 'CyberVault Real-Time Security Command Console',
    slug: 'cybervault-security-portal',
    description: 'Threat monitor, zero-trust endpoint table, and secret vault status monitor created by Aura-UI (Designer) and CodeForge-TS (Developer).',
    type: 'development',
    category: 'Security Console',
    date: '2026-03-27',
    status: 'Approved',
    assignedRoles: {
      designerAgentId: 'agt-aura-ui',
      designerModelId: 'mod-gemini-2.5-flash',
      developerAgentId: 'agt-codeforge-ts',
      developerModelId: 'mod-gemini-2.5-flash',
      qcAgentId: 'agt-veritas-qc',
      qcModelId: 'mod-deepseek-r1'
    },
    designSpec: {
      colorPalette: [
        { name: 'Dark Void', hex: '#020617' },
        { name: 'Slate Surface', hex: '#0F172A' },
        { name: 'Cyan Security', hex: '#06B6D4' },
        { name: 'Emerald Shield', hex: '#10B981' }
      ],
      typographyHeading: 'Cabinet Grotesk',
      typographyBody: 'Plus Jakarta Sans',
      layoutStructure: 'Top Security Metrics + Realtime Threat Feed + Endpoint Guard Table',
      componentHierarchy: ['ThreatSummaryBar', 'VaultKeysGrid', 'EncryptedAuditLog']
    },
    codeContent: `import React from 'react';
import { ShieldAlert, KeyRound, Lock, Server, CheckCircle2 } from 'lucide-react';

export default function SecurityConsole() {
  const keys = [
    { name: 'Google Gemini Pro Key', provider: 'Google AI Studio', masked: 'AIzaSyD-••••••••4k2M', status: 'Sealed & Active', calls: '14,200' },
    { name: 'OpenAI Prod Master', provider: 'OpenAI Vault', masked: 'sk-proj-••••••••88f0', status: 'Sealed & Active', calls: '28,400' },
    { name: 'Anthropic Claude Tier 4', provider: 'Anthropic', masked: 'sk-ant-••••••••12xQ', status: 'Sealed & Active', calls: '9,150' },
  ];

  return (
    <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 font-sans space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Vault Security & KMS Monitor</h2>
          <p className="text-xs text-slate-400 mt-0.5">Encrypted server vault isolation · Zero client-side API key leaks</p>
        </div>
        <span className="px-3 py-1 text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5" /> HSM Hardware Sealed
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {keys.map((k, idx) => (
          <div key={idx} className="p-4 bg-slate-900/60 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-slate-400">{k.provider}</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">{k.status}</span>
            </div>
            <div className="text-sm font-semibold text-white">{k.name}</div>
            <div className="text-xs font-mono text-indigo-300 mt-2 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">{k.masked}</div>
            <div className="text-[11px] text-slate-500 mt-2 font-mono">Total Monthly Proxied Requests: {k.calls}</div>
          </div>
        ))}
      </div>
    </div>
  );
}`,
    qcReport: {
      overallScore: 96,
      passStatus: 'PASSED',
      checksPassed: [
        'API Keys sanitized using masked string signatures',
        'Monospace tabular numerals used for request counts',
        'Semantic HTML layout structure verified'
      ],
      warnings: [],
      recommendations: ['Integrate automated token rotation alert triggers.'],
      accessibilityScore: 98,
      securityScore: 100,
      codeQualityScore: 95
    },
    metrics: {
      latencySeconds: 1.8,
      tokensUsed: 2890,
      estimatedCostUsd: 0.0019
    }
  }
];
