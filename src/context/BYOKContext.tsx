import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api';

export interface Project {
  id: string;
  name: string;
  mode: 'byok' | 'managed';
  repoFullName?: string;
  createdBy?: string;
  createdAt?: string;
}

export interface Run {
  id: string;
  projectId: string;
  title: string;
  intent: string;
  currentStage: number;
  status: string;
  createdAt?: string;
}

export interface ProviderConnection {
  id: string;
  type: string;
  label: string;
  fingerprint: string;
  last4: string;
  status: string;
  lastVerifiedAt?: string;
}

export interface HostingConnection {
  id: string;
  type: string;
  label: string;
  fingerprint: string;
  last4: string;
  status: string;
  lastVerifiedAt?: string;
  capabilities?: any;
}

export interface Quote {
  id: string;
  provider: string;
  planLabel: string;
  amountUsd: number;
  currency: string;
  sourceUrl: string;
  quotedAt: string;
  stale: boolean;
}

export interface LegacyRole {
  id: string;
  roleNo: string;
  roleTitle: string;
  category: string;
  customMandate: string;
  status: string;
  assignedAgentId: string;
  assignedModelId: string;
  fallbackModelId: string;
  updatedAt: string;
}

export interface LegacyAgent {
  id: string;
  name: string;
  roleCategory: string;
  providerType: string;
  status: string;
  totalRunsCompleted: number;
  directives: string;
  createdAt: string;
}

export interface LegacyModel {
  id: string;
  name: string;
  providerId: string;
  modelIdentifier: string;
  capabilities: string[];
}

export interface LegacyProvider {
  id: string;
  name: string;
  type: string;
  status: string;
  createdDate: string;
  vaultKeyId: string;
  maskedSecret: string;
  isSecretInVault: boolean;
  totalCallsMonth: number;
}

interface BYOKContextType {
  projects: Project[];
  runs: Run[];
  connections: ProviderConnection[];
  hostingConnections: HostingConnection[];
  quotes: Quote[];
  activeTab: 'dashboard' | 'roles' | 'agents' | 'models' | 'providers' | 'studio' | 'build' | 'admin';
  setActiveTab: (tab: 'dashboard' | 'roles' | 'agents' | 'models' | 'providers' | 'studio' | 'build' | 'admin') => void;
  
  activeRunId: string | null;
  setActiveRunId: (id: string | null) => void;

  currentGateStep: 'gate1' | 'gate2' | 'gate3' | 'gate4' | 'gate5' | 'completed';
  setCurrentGateStep: (gate: 'gate1' | 'gate2' | 'gate3' | 'gate4' | 'gate5' | 'completed') => void;

  operatingMode: 'byok' | 'managed_factory';
  setOperatingMode: (mode: 'byok' | 'managed_factory') => void;

  selectedArtifact: any;
  setSelectedArtifact: (art: any) => void;
  artifacts: any[];

  roles: LegacyRole[];
  agents: LegacyAgent[];
  models: LegacyModel[];
  providers: LegacyProvider[];

  refreshData: () => Promise<void>;
  createProject: (name: string, mode: 'byok' | 'managed') => Promise<Project>;
  createRun: (projectId: string, title: string, intent: string) => Promise<Run>;
  addConnection: (type: string, label: string, secret: string) => Promise<void>;
  addHostingConnection: (type: string, label: string, secret: string) => Promise<void>;
  deleteProvider: (id: string) => void;
  deleteModel: (id: string) => void;
  deleteAgent: (id: string) => void;
  deleteRole: (id: string) => void;
  addAgent: (agent: any) => void;
  addModel: (model: any) => void;
  addRole: (role: any) => void;
  resetToDefaults: () => void;

  isAddProviderOpen: boolean;
  setIsAddProviderOpen: (open: boolean) => void;
  isAddModelOpen: boolean;
  setIsAddModelOpen: (open: boolean) => void;
  isAddAgentOpen: boolean;
  setIsAddAgentOpen: (open: boolean) => void;
  isAddRoleOpen: boolean;
  setIsAddRoleOpen: (open: boolean) => void;
  isCreateProjectOpen: boolean;
  setIsCreateProjectOpen: (open: boolean) => void;

  isOrchestrating: boolean;
  orchestrationLogs: any[];
}

const BYOKContext = createContext<BYOKContextType | undefined>(undefined);

export const BYOKProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [connections, setConnections] = useState<ProviderConnection[]>([]);
  const [hostingConnections, setHostingConnections] = useState<HostingConnection[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'roles' | 'agents' | 'models' | 'providers' | 'studio' | 'build' | 'admin'>('dashboard');
  const [activeRunId, setActiveRunId] = useState<string | null>(null);

  const [currentGateStep, setCurrentGateStep] = useState<'gate1' | 'gate2' | 'gate3' | 'gate4' | 'gate5' | 'completed'>('gate1');
  const [operatingMode, setOperatingMode] = useState<'byok' | 'managed_factory'>('managed_factory');
  const [selectedArtifact, setSelectedArtifact] = useState<any>(null);

  const [isAddProviderOpen, setIsAddProviderOpen] = useState(false);
  const [isAddModelOpen, setIsAddModelOpen] = useState(false);
  const [isAddAgentOpen, setIsAddAgentOpen] = useState(false);
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  const [roles] = useState<LegacyRole[]>([
    { id: 'role-01-spec', roleNo: '01', roleTitle: 'Product & Spec Agent', category: 'product', customMandate: 'PRD & PostgreSQL Schema', status: 'active', assignedAgentId: 'agt-1', assignedModelId: 'mod-1', fallbackModelId: 'mod-1', updatedAt: new Date().toISOString() },
    { id: 'role-02-designer', roleNo: '02', roleTitle: 'Google Stitch UI/UX Designer', category: 'design', customMandate: 'Gold & White Theme Wireframes', status: 'active', assignedAgentId: 'agt-2', assignedModelId: 'mod-1', fallbackModelId: 'mod-1', updatedAt: new Date().toISOString() },
    { id: 'role-03-dev', roleNo: '03', roleTitle: 'Full-Stack Developer Agent', category: 'dev', customMandate: 'React 19 & TypeScript Code', status: 'active', assignedAgentId: 'agt-3', assignedModelId: 'mod-1', fallbackModelId: 'mod-1', updatedAt: new Date().toISOString() },
    { id: 'role-04-qc', roleNo: '04', roleTitle: 'QC & Security Auditor Agent', category: 'qc', customMandate: 'Static Analysis & Audit', status: 'active', assignedAgentId: 'agt-4', assignedModelId: 'mod-1', fallbackModelId: 'mod-1', updatedAt: new Date().toISOString() },
    { id: 'role-05-release', roleNo: '05', roleTitle: 'Release & Deploy Agent', category: 'release', customMandate: 'Deployment Plan & Release Dossier', status: 'active', assignedAgentId: 'agt-5', assignedModelId: 'mod-1', fallbackModelId: 'mod-1', updatedAt: new Date().toISOString() },
  ]);

  const [agents] = useState<LegacyAgent[]>([
    { id: 'agt-1', name: 'Agent 01 (Product)', roleCategory: 'product', providerType: 'gemini', status: 'active', totalRunsCompleted: 12, directives: 'Generate PRD & PostgreSQL schema', createdAt: new Date().toISOString() },
    { id: 'agt-2', name: 'Agent 02 (Designer)', roleCategory: 'design', providerType: 'gemini', status: 'active', totalRunsCompleted: 10, directives: 'Generate Gold & White Stitch layout', createdAt: new Date().toISOString() },
    { id: 'agt-3', name: 'Agent 03 (Developer)', roleCategory: 'dev', providerType: 'gemini', status: 'active', totalRunsCompleted: 15, directives: 'Generate TSX React 19 component', createdAt: new Date().toISOString() },
    { id: 'agt-4', name: 'Agent 04 (QC Auditor)', roleCategory: 'qc', providerType: 'gemini', status: 'active', totalRunsCompleted: 14, directives: 'Evaluate static security rules', createdAt: new Date().toISOString() },
  ]);

  const [models] = useState<LegacyModel[]>([
    { id: 'mod-1', name: 'Gemini 2.5 Flash', providerId: 'prov-gemini', modelIdentifier: 'gemini-2.5-flash', capabilities: ['Text', 'JSON', 'Code'] },
  ]);

  const [providers] = useState<LegacyProvider[]>([
    { id: 'prov-gemini', name: 'Google Gemini AI', type: 'gemini', status: 'active', createdDate: new Date().toISOString(), vaultKeyId: 'vault_sec_1', maskedSecret: '••••1234', isSecretInVault: true, totalCallsMonth: 45 },
  ]);

  const refreshData = useCallback(async () => {
    try {
      const [pRes, rRes, cRes, hRes, qRes] = await Promise.all([
        api('/v1/projects').catch(() => ({ projects: [] })),
        api('/v1/runs').catch(() => ({ runs: [] })),
        api('/v1/connections').catch(() => ({ connections: [] })),
        api('/v1/hosting-connections').catch(() => ({ hostingConnections: [] })),
        api('/v1/quotes').catch(() => ({ quotes: [] })),
      ]);

      setProjects(pRes.projects || []);
      setRuns(rRes.runs || []);
      setConnections(cRes.connections || []);
      setHostingConnections(hRes.hostingConnections || []);
      setQuotes(qRes.quotes || []);

      if (rRes.runs && rRes.runs.length > 0 && !activeRunId) {
        setActiveRunId(rRes.runs[0].id);
      }
    } catch (e) {
      console.error('Failed to load context data from API:', e);
    }
  }, [activeRunId]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const createProject = async (name: string, mode: 'byok' | 'managed'): Promise<Project> => {
    const res = await api('/v1/projects', {
      method: 'POST',
      body: JSON.stringify({ name, mode }),
    });
    await refreshData();
    return res.project;
  };

  const createRun = async (projectId: string, title: string, intent: string): Promise<Run> => {
    const res = await api('/v1/runs', {
      method: 'POST',
      body: JSON.stringify({ projectId, title, intent }),
    });
    await refreshData();
    setActiveRunId(res.run.id);
    return res.run;
  };

  const addConnection = async (type: string, label: string, secret: string) => {
    await api('/v1/connections', {
      method: 'POST',
      body: JSON.stringify({ type, label, secret }),
    });
    await refreshData();
  };

  const addHostingConnection = async (type: string, label: string, secret: string) => {
    await api('/v1/hosting-connections', {
      method: 'POST',
      body: JSON.stringify({ type, label, secret }),
    });
    await refreshData();
  };

  const resetToDefaults = () => {};
  const deleteProvider = () => {};
  const deleteModel = () => {};
  const deleteAgent = () => {};
  const deleteRole = () => {};
  const addAgent = () => {};
  const addModel = () => {};
  const addRole = () => {};

  return (
    <BYOKContext.Provider
      value={{
        projects,
        runs,
        connections,
        hostingConnections,
        quotes,
        activeTab,
        setActiveTab,
        activeRunId,
        setActiveRunId,
        currentGateStep,
        setCurrentGateStep,
        operatingMode,
        setOperatingMode,
        selectedArtifact,
        setSelectedArtifact,
        artifacts: runs,
        roles,
        agents,
        models,
        providers,
        refreshData,
        createProject,
        createRun,
        addConnection,
        addHostingConnection,
        deleteProvider,
        deleteModel,
        deleteAgent,
        deleteRole,
        addAgent,
        addModel,
        addRole,
        resetToDefaults,
        isAddProviderOpen,
        setIsAddProviderOpen,
        isAddModelOpen,
        setIsAddModelOpen,
        isAddAgentOpen,
        setIsAddAgentOpen,
        isAddRoleOpen,
        setIsAddRoleOpen,
        isCreateProjectOpen,
        setIsCreateProjectOpen,
        isOrchestrating: false,
        orchestrationLogs: [],
      }}
    >
      {children}
    </BYOKContext.Provider>
  );
};

export const useBYOK = () => {
  const context = useContext(BYOKContext);
  if (!context) {
    throw new Error('useBYOK must be used within a BYOKProvider');
  }
  return context;
};
