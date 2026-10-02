import React from 'react';
import { useBYOK } from '../context/BYOKContext';
import { Plus, Bot, Terminal, Shield, Check, Trash2, Cpu, Wrench } from 'lucide-react';

export const AgentsView: React.FC = () => {
  const { agents, deleteAgent, setIsAddAgentOpen, roles } = useBYOK();

  return (
    <div className="space-y-8">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono mb-1">
            <span>Worker Directory</span>
            <span>·</span>
            <span>Independent Directives</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white font-display">
            Agents Studio
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
            <strong className="text-white">Agents are workers.</strong> They are not roles and they are not models. They execute instructions using tools and can be assigned to any stable role in your workspace.
          </p>
        </div>

        <button
          onClick={() => setIsAddAgentOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Agent</span>
        </button>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => {
          const mappedRoles = roles.filter((r) => r.assignedAgentId === agent.id);

          return (
            <div
              key={agent.id}
              className="p-6 bg-slate-900 rounded-xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-5 shadow-lg group"
            >
              <div className="space-y-4">
                {/* Agent Header Profile */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={agent.avatarUrl}
                      alt={agent.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-md"
                    />
                    <div>
                      <h3 className="text-base font-bold text-white font-display group-hover:text-indigo-300 transition">
                        {agent.name}
                      </h3>
                      <p className="text-xs text-slate-400">{agent.title}</p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 rounded border border-emerald-500/20">
                    {agent.status.toUpperCase()}
                  </span>
                </div>

                {/* Directives / System Prompt */}
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1">
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">System Directives</div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-3">
                    {agent.directives}
                  </p>
                </div>

                {/* Tool Access Badges */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                    <Wrench className="w-3 h-3 text-indigo-400" />
                    <span>Enabled Tools ({agent.tools.length})</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {agent.tools.map((tool, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[10px] font-mono text-slate-300 bg-slate-950 border border-slate-800 rounded"
                      >
                        {tool.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Currently Assigned Stable Roles */}
                <div className="p-2.5 bg-slate-950/60 rounded border border-slate-800/60 text-xs">
                  <span className="text-slate-400">Assigned Roles: </span>
                  {mappedRoles.length > 0 ? (
                    <span className="font-semibold text-indigo-300">
                      {mappedRoles.map((r) => r.roleTitle).join(', ')}
                    </span>
                  ) : (
                    <span className="text-slate-500 italic">Unassigned (Available worker)</span>
                  )}
                </div>
              </div>

              {/* Agent Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                <div>
                  <span className="text-white font-bold tabular-nums">{agent.totalRunsCompleted}</span> runs completed
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500">Temp: {agent.temperature}</span>

                  <button
                    onClick={() => deleteAgent(agent.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition"
                    title="Delete Agent"
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
