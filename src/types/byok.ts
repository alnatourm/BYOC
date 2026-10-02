/**
 * Types for AI BYOK (Bring Your Own Key / Models / Agents) Platform
 */

export type ProviderType = 'openai' | 'anthropic' | 'gemini' | 'groq' | 'deepseek' | 'ollama' | 'stitch' | 'custom';

export interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  baseUrl: string;
  vaultKeyId: string; // Reference identifier to server encrypted vault
  maskedSecret: string; // e.g. "sk-proj-••••4a89"
  isSecretInVault: boolean;
  status: 'active' | 'degraded' | 'vault_locked';
  rateLimitRpm: number;
  totalCallsMonth: number;
  createdDate: string;
}

export type ModelCapability = 
  | 'code' 
  | 'vision' 
  | 'function_calling' 
  | 'reasoning' 
  | 'image_gen' 
  | 'multimodal'
  | 'fast_inference';

export interface Model {
  id: string;
  providerId: string;
  providerName: string;
  name: string;
  modelIdentifier: string; // e.g. "gemini-2.5-flash", "gpt-4o", "claude-3-5-sonnet"
  capabilities: ModelCapability[];
  contextWindow: number; // e.g. 1000000
  maxOutputTokens: number;
  costPer1kInputUsd: number;
  costPer1kOutputUsd: number;
  latencyMs: number;
  status: 'available' | 'deprecated' | 'rate_limited';
}

export type AgentTool = 
  | 'git_commit' 
  | 'figma_exporter' 
  | 'code_executor' 
  | 'cypress_tester' 
  | 'eslint_linter' 
  | 'db_migrator' 
  | 'gemini_vision'
  | 'google_stitch_canvas'
  | 'google_stitch_figma';

export interface Agent {
  id: string;
  name: string;
  avatarUrl: string;
  title: string;
  directives: string;
  temperature: number;
  tools: AgentTool[];
  maxRunsPerDay: number;
  totalRunsCompleted: number;
  status: 'idle' | 'working' | 'paused';
  createdAt: string;
}

export type RoleCategory = 'design' | 'dev' | 'qc' | 'product' | 'devops' | 'custom';

export interface Role {
  id: string;
  roleTitle: string; // e.g. "Designer", "Developer", "Q/C", "Product Manager"
  category: RoleCategory;
  description: string;
  assignedAgentId: string;
  assignedModelId: string;
  fallbackModelId?: string;
  executionOrder: number; // e.g. 1 for Designer, 2 for Developer, 3 for Q/C
  customMandate: string;
  status: 'active' | 'unmapped' | 'degraded';
  updatedAt: string;
}

export type ArtifactType = 'design' | 'development' | 'qc_audit' | 'full_pipeline';

export interface DesignSpec {
  colorPalette: { name: string; hex: string }[];
  typographyHeading: string;
  typographyBody: string;
  layoutStructure: string;
  componentHierarchy: string[];
  designTokensJson?: string;
}

export interface QCReport {
  overallScore: number; // 0 - 100
  passStatus: 'PASSED' | 'PASSED_WITH_WARNINGS' | 'FAILED';
  checksPassed: string[];
  warnings: string[];
  recommendations: string[];
  accessibilityScore: number;
  securityScore: number;
  codeQualityScore: number;
}

export interface ProjectArtifact {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: ArtifactType;
  category: string; // e.g. "SaaS Billing", "Analytics Dashboard", "E-Commerce Checkout"
  date: string;
  status: 'Approved' | 'In Review' | 'Draft' | 'Needs Revision';
  assignedRoles: {
    designerAgentId: string;
    designerModelId: string;
    developerAgentId: string;
    developerModelId: string;
    qcAgentId: string;
    qcModelId: string;
  };
  designSpec?: DesignSpec;
  codeContent?: string;
  qcReport?: QCReport;
  metrics: {
    latencySeconds: number;
    tokensUsed: number;
    estimatedCostUsd: number;
  };
  previewHtml?: string;
}

export interface OrchestrationRunRequest {
  briefTitle: string;
  briefPrompt: string;
  category: string;
  designerRoleId: string;
  developerRoleId: string;
  qcRoleId: string;
}

export interface OrchestrationStepLog {
  step: 'designer' | 'developer' | 'qc';
  roleTitle: string;
  agentName: string;
  modelName: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  outputSummary: string;
  rawResponse?: string;
  durationMs: number;
}
