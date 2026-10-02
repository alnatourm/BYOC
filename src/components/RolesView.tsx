import React, { useState } from 'react';
import { useBYOK } from '../context/BYOKContext';
import { Role } from '../types/byok';
import { Layers, RefreshCw, Plus, ArrowRight, UserCheck, Cpu, Sparkles, Check, Edit3, Trash2 } from 'lucide-react';

export const RolesView: React.FC = () => {
  const { roles, agents, models, assignRoleAgentAndModel, updateRole, deleteRole, setIsAddRoleOpen, setActiveTab } = useBYOK();
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [editingMandate, setEditingMandate] = useState<string>('');

  const handleStartEditMandate = (role: Role) => {
    setEditingRoleId(role.id);
    setEditingMandate(role.customMandate);
  };

  const handleSaveMandate = (roleId: string) => {
    updateRole(roleId, { customMandate: editingMandate });
    setEditingRoleId(null);
  };

  return (
    <div className="space-y-8">
      {/* View Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono mb-1">
            <span>Orchestration Layer</span>
            <span>·</span>
            <span>Stable Job Architecture</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white font-display">
            Roles & Swappable Mapping
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
            Stable job positions mapped to swappable agents and models. Keep your team pipeline constant while switching worker agents or LLM backends in 1-click.
          </p>
        </div>

        <button
          onClick={() => setIsAddRoleOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Role</span>
        </button>
      </div>

      {/* Role Pipeline Mapping Flow (4-Column Governance Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {roles
          .sort((a, b) => a.executionOrder - b.executionOrder)
          .map((role) => {
          const currentAgent = agents.find((a) => a.id === role.assignedAgentId);
          const currentModel = models.find((m) => m.id === role.assignedModelId);
          const fallbackModel = models.find((m) => m.id === role.fallbackModelId);
          const isManagedFactory = role.connectionMode === 'managed_factory';

          return (
            <div
              key={role.id}
              className="p-5 bg-slate-900 rounded-xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4 shadow-lg relative group"
            >
              <div className="space-y-3">
                {/* Role Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <h3 className="text-base font-bold text-white font-display">{role.roleTitle}</h3>
                  </div>

                  <span className="px-2 py-0.5 text-[10px] font-mono text-indigo-300 bg-indigo-500/10 rounded border border-indigo-500/20">
                    Step #{role.executionOrder}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed min-h-[32px]">{role.description}</p>

                {/* Connection Mode Toggle (BYOK Key vs Managed Platform Factory) */}
                <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Role Connection Type
                  </div>
                  <div className="grid grid-cols-2 gap-1 font-mono text-[11px]">
                    <button
                      onClick={() => updateRole(role.id, { connectionMode: 'byok' })}
                      className={`px-2 py-1 rounded text-center transition ${
                        !isManagedFactory
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      🔑 BYOK Key
                    </button>
                    <button
                      onClick={() => updateRole(role.id, { connectionMode: 'managed_factory' })}
                      className={`px-2 py-1 rounded text-center transition ${
                        isManagedFactory
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      ⚡ Managed
                    </button>
                  </div>
                </div>

                {/* Swappable Agent Mapping Dropdown */}
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                      Assigned Worker Agent
                    </span>
                    <span className="text-[10px] text-slate-500">Worker</span>
                  </div>

                  <select
                    value={role.assignedAgentId}
                    onChange={(e) => assignRoleAgentAndModel(role.id, e.target.value, role.assignedModelId, role.fallbackModelId)}
                    className="w-full bg-slate-900 text-xs font-semibold text-white border border-slate-700 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                  >
                    {agents.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name} — {agent.title}
                      </option>
                    ))}
                  </select>

                  {currentAgent && (
                    <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between pt-1">
                      <span>Temp: {currentAgent.temperature}</span>
                      <span>{currentAgent.tools.length} Tools Enabled</span>
                    </div>
                  )}
                </div>

                {/* Swappable Model Mapping Dropdown */}
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                      Primary Model Provider
                    </span>
                    <span className="text-[10px] text-slate-500">LLM Backend</span>
                  </div>

                  <select
                    value={role.assignedModelId}
                    onChange={(e) => assignRoleAgentAndModel(role.id, role.assignedAgentId, e.target.value, role.fallbackModelId)}
                    className="w-full bg-slate-900 text-xs font-semibold text-white border border-slate-700 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                  >
                    {models.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name} ({model.providerName})
                      </option>
                    ))}
                  </select>

                  {currentModel && (
                    <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between pt-1">
                      <span>Ctx: {(currentModel.contextWindow / 1000).toFixed(0)}k</span>
                      <span>{currentModel.latencyMs}ms avg</span>
                    </div>
                  )}
                </div>

                {/* Custom Role Directives Mandate */}
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-medium">Role Mandate & Directives</span>
                    {editingRoleId !== role.id ? (
                      <button
                        onClick={() => handleStartEditMandate(role)}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSaveMandate(role.id)}
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Save
                      </button>
                    )}
                  </div>

                  {editingRoleId === role.id ? (
                    <textarea
                      value={editingMandate}
                      onChange={(e) => setEditingMandate(e.target.value)}
                      className="w-full h-20 bg-slate-900 text-xs text-slate-200 border border-indigo-500/50 rounded p-2 focus:outline-none font-sans"
                    />
                  ) : (
                    <p className="text-xs text-slate-300 italic leading-relaxed">
                      "{role.customMandate}"
                    </p>
                  )}
                </div>
              </div>

              {/* Role Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="text-[11px] font-mono text-slate-500">
                  Updated {role.updatedAt}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('studio')}
                    className="px-3 py-1 text-xs font-medium text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded transition"
                  >
                    Test Role
                  </button>

                  <button
                    onClick={() => deleteRole(role.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition"
                    title="Delete role"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
