import React from 'react';
import { BYOKProvider, useBYOK } from './context/BYOKContext';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { RolesView } from './components/RolesView';
import { AgentsView } from './components/AgentsView';
import { ModelsView } from './components/ModelsView';
import { ProvidersView } from './components/ProvidersView';
import { LiveStudioView } from './components/LiveStudioView';
import { ArtifactInspectorModal } from './components/ArtifactInspectorModal';
import { AddProviderModal } from './components/modals/AddProviderModal';
import { AddModelModal } from './components/modals/AddModelModal';
import { AddAgentModal } from './components/modals/AddAgentModal';
import { AddRoleModal } from './components/modals/AddRoleModal';
import { CreateProjectModal } from './components/modals/CreateProjectModal';

function MainLayout() {
  const { activeTab } = useBYOK();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'roles' && <RolesView />}
        {activeTab === 'agents' && <AgentsView />}
        {activeTab === 'models' && <ModelsView />}
        {activeTab === 'providers' && <ProvidersView />}
        {activeTab === 'studio' && <LiveStudioView />}
      </main>

      {/* Global Modals */}
      <ArtifactInspectorModal />
      <CreateProjectModal />
      <AddProviderModal />
      <AddModelModal />
      <AddAgentModal />
      <AddRoleModal />

      <footer className="border-t border-slate-900 py-6 px-4 md:px-8 text-center text-xs text-slate-500 font-sans">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            NexusBYOK Platform · Provider Secrets Encrypted in KMS Vault · Zero Client Key Storage
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>Google Gemini 2.5 Flash</span>
            <span>·</span>
            <span>React 19</span>
            <span>·</span>
            <span>Tailwind CSS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BYOKProvider>
      <MainLayout />
    </BYOKProvider>
  );
}
