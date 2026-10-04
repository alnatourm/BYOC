import React from 'react';
import { BYOKProvider, useBYOK } from './context/BYOKContext';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { DashboardView } from './components/DashboardView';
import { RolesView } from './components/RolesView';
import { AgentsView } from './components/AgentsView';
import { ModelsView } from './components/ModelsView';
import { ProvidersView } from './components/ProvidersView';
import { LiveStudioView } from './components/LiveStudioView';
import { BuildSuiteView } from './components/BuildSuiteView';
import { AdminPanelView } from './components/AdminPanelView';
import { ArtifactInspectorModal } from './components/ArtifactInspectorModal';
import { AddProviderModal } from './components/modals/AddProviderModal';
import { AddModelModal } from './components/modals/AddModelModal';
import { AddAgentModal } from './components/modals/AddAgentModal';
import { AddRoleModal } from './components/modals/AddRoleModal';
import { CreateProjectModal } from './components/modals/CreateProjectModal';

function MainLayout() {
  const { activeTab } = useBYOK();

  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#231a10] font-sans antialiased">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Top Header */}
      <TopHeader />

      {/* Main Content Area Offset by Sidebar (pl-72) and Header (pt-20) */}
      <div className="pl-72">
        <main className="w-full pt-20 px-8 pb-12 max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'build' && <BuildSuiteView />}
          {activeTab === 'roles' && <RolesView />}
          {activeTab === 'agents' && <AgentsView />}
          {activeTab === 'models' && <ModelsView />}
          {activeTab === 'providers' && <ProvidersView />}
          {activeTab === 'studio' && <LiveStudioView />}
          {activeTab === 'admin' && <AdminPanelView />}
        </main>
      </div>

      {/* Global Modals */}
      <CreateProjectModal />
      <AddProviderModal />
      <AddModelModal />
      <AddAgentModal />
      <AddRoleModal />
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
