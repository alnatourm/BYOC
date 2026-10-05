import React from 'react';
import { useBYOK } from '../context/BYOKContext';

export const DashboardView: React.FC = () => {
  const { runs, projects, setIsCreateProjectOpen, setActiveTab } = useBYOK();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-[#1f242e] font-display">OGroup Governed Software Factory</h1>
          <p className="text-xs text-stone-500 mt-1">Multi-tenant, AES-256 vault encrypted, hash-chained audit pipeline.</p>
        </div>
        <button
          onClick={() => setIsCreateProjectOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#d97706] hover:bg-amber-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Create New Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 font-bold uppercase tracking-wider">Active Projects</span>
          <span className="block text-2xl font-bold text-[#1f242e] mt-1 font-mono">{projects.length}</span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 font-bold uppercase tracking-wider">Active Software Runs</span>
          <span className="block text-2xl font-bold text-[#d97706] mt-1 font-mono">{runs.length}</span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <span className="text-xs text-stone-500 font-bold uppercase tracking-wider">Human Gate Enforcement</span>
          <span className="block text-2xl font-bold text-emerald-700 mt-1 font-mono">100% Locked</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-[#1f242e]">Recent Software Assembly Runs</h3>
        <div className="space-y-3">
          {runs.map((r) => (
            <div key={r.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-[#1f242e] block">{r.title}</span>
                <p className="text-xs text-stone-500">{r.intent}</p>
              </div>
              <button
                onClick={() => setActiveTab('build')}
                className="px-3.5 py-1.5 rounded-lg bg-[#d97706] text-white font-bold text-xs"
              >
                Inspect Pipeline →
              </button>
            </div>
          ))}
          {runs.length === 0 && (
            <div className="p-8 text-center text-xs text-stone-400">
              No runs active. Click "Create New Project" to start software assembly.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
