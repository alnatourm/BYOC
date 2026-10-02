/**
 * Types for AI BYOK (Bring Your Own Key / Models / Agents) Platform
 */

export type ProviderType = 'openai' | 'anthropic' | 'gemini' | 'groq' | 'deepseek' | 'ollama' | 'stitch' | 'factory' | 'custom';

export type OperatingMode = 'byok' | 'managed_factory';

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
  | 'google_stitch_figma'
  | 'doc_generator'
  | 'checksum_signer'
  | 'dossier_exporter';

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

export type RoleCategory = 'design' | 'dev' | 'qc' | 'doc_control' | 'product' | 'devops' | 'custom';

export interface Role {
  id: string;
  roleTitle: string; // e.g. "Designer", "Developer", "Q/C", "Document Control"
  category: RoleCategory;
  description: string;
  assignedAgentId: string;
  assignedModelId: string;
  fallbackModelId?: string;
  executionOrder: number; // e.g. 1 for Designer, 2 for Developer, 3 for Q/C, 4 for Doc Control
  connectionMode?: 'byok' | 'managed_factory'; // Mode toggle per role slot
  customMandate: string;
  status: 'active' | 'unmapped' | 'degraded';
  updatedAt: string;
}

export interface DocumentVersion {
  version: number;
  title: string;
  checksumSha256: string;
  createdAt: string;
  createdBy: string;
  contentSummary: string;
}

export interface DocumentRecord {
  id: string;
  docNumber: string; // e.g. "DOC-2026-881"
  title: string;
  category: string;
  status: 'draft' | 'in_review' | 'approved' | 'superseded';
  latestVersion: number;
  versions: DocumentVersion[];
}

export interface StageGate {
  stage: 'intake' | 'design' | 'dev' | 'qc' | 'doc_control' | 'release';
  stageTitle: string;
  gateType: 'G0_StartDesign' | 'G1_DesignApproval' | 'G2_CodeReview' | 'G3_QCSignoff' | 'G4_DocControlRelease';
  status: 'awaiting_start' | 'running' | 'awaiting_human_approval' | 'approved' | 'changes_requested' | 'rejected';
  requiredRole: 'requester' | 'reviewer:designer' | 'reviewer:developer' | 'reviewer:qc' | 'reviewer:doc_control';
  decidedBy?: string;
  decidedAt?: string;
  comment?: string;
}

export interface ReleaseDossier {
  dossierId: string;
  projectName: string;
  repoFullName: string;
  releaseTag: string;
  generatedAt: string;
  checksumSha256: string;
  designApprovedBy: string;
  codeApprovedBy: string;
  qcPassedScore: number;
  docControlSignoffBy: string;
  documentCount: number;
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
  status: 'Approved' | 'In Review' | 'Draft' | 'Needs Revision' | 'In Progress';
  assignedRoles: {
    designerAgentId: string;
    designerModelId: string;
    developerAgentId: string;
    developerModelId: string;
    qcAgentId: string;
    qcModelId: string;
    docControlAgentId?: string;
    docControlModelId?: string;
  };
  designSpec?: DesignSpec;
  codeContent?: string;
  qcReport?: QCReport;
  releaseDossier?: ReleaseDossier;
  stageGates?: StageGate[];
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
