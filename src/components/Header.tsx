import React from 'react';
import { useBYOK } from '../context/BYOKContext';
import { ShieldCheck, Plus, RotateCcw, Cpu, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, setIsAddProviderOpen, setIsCreateProjectOpen, resetToDefaults } = useBYOK();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'roles', label: 'Roles & Pipeline' },
    { id: 'agents', label: 'Agents Studio' },
    { id: 'models', label: 'Models Catalog' },
    { id: 'providers', label: 'Providers & Vault' },
    { id: 'studio', label: 'Live Orchestrator' },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
      {/* Zone 1: Single text element Brand mark */}
      <div className="flex items-center gap-3">
        <a 
          href="#dashboard" 
          onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}
          className="text-xl font-extrabold tracking-tight text-white font-display flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600/30 transition">
            <Cpu className="w-4 h-4" />
          </div>
          <span className="bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            NexusBYOK
          </span>
        </a>

        {/* Vault Status Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-md text-[11px] font-mono text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Vault Sealed</span>
        </div>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-lg border border-slate-800/60">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsCreateProjectOpen(true)}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </button>

        <button
          onClick={() => setActiveTab('studio')}
          className="hidden sm:flex px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition items-center gap-1.5 whitespace-nowrap cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Quick Orchestrate</span>
        </button>

        <button
          onClick={() => setIsAddProviderOpen(true)}
          className="hidden sm:flex px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition items-center gap-1 whitespace-nowrap"
          title="Add new BYOK Provider"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Provider</span>
        </button>

        <button
          onClick={resetToDefaults}
          className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition"
          title="Reset to default preset data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
