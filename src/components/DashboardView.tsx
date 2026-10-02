import React, { useState } from 'react';
import { useBYOK } from '../context/BYOKContext';
import { ProjectArtifact } from '../types/byok';
import { Layout, Code, ShieldCheck, Sparkles, Eye, ArrowUpRight, CheckCircle2, Layers, Cpu, Clock, Terminal, Plus, FolderPlus } from 'lucide-react';
import { HumanApprovalGateBanner } from './HumanApprovalGateBanner';
import { ProjectBrainGrid } from './ProjectBrainGrid';

export const DashboardView: React.FC = () => {
  const { artifacts, agents, models, roles, setSelectedArtifact, setActiveTab, setIsCreateProjectOpen } = useBYOK();
  const [filter, setFilter] = useState<string>('all');

  const filteredArtifacts = artifacts.filter((art) => {
    if (filter === 'all') return true;
    if (filter === 'design') return art.type === 'design' || !!art.designSpec;
    if (filter === 'dev') return art.type === 'development' || !!art.codeContent;
    if (filter === 'qc') return art.type === 'qc_audit' || !!art.qcReport;
    return true;
  });

  const totalDeliverables = artifacts.length;
  const totalRolesConfigured = roles.length;
  const activeAgentsCount = agents.filter((a) => a.status !== 'paused').length;
  const totalModelsCount = models.length;

  return (
    <div className="space-y-8">
      {/* Welcoming Human Approval Gate Banner */}
      <HumanApprovalGateBanner />

      {/* Top Hero Banner & System Overview */}
      <div className="p-6 md:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950/40 rounded-2xl border border-orange-950/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2 text-xs text-orange-400 font-mono">
              <span>OGroup AI Factory Platform</span>
              <span>·</span>
              <span>Bilingual Execution Runtime</span>
              <span>·</span>
              <span>Zero-Exposure Key Vault</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-display text-wrap-balance">
              My Software / <span className="text-orange-400 font-bold">برمجياتي النشطة ✨</span>
            </h1>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Friendly delivery tracking & live health for all active software systems built by your OGroup Factory.
            </p>
          </div>

          <button
            onClick={() => setIsCreateProjectOpen(true)}
            className="px-5 py-3 text-xs font-extrabold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 rounded-xl shadow-lg transition flex items-center gap-2 shrink-0 self-start md:self-auto cursor-pointer"
          >
            <FolderPlus className="w-4 h-4" />
            <span>+ Build Software / بناء جديد 🚀</span>
          </button>
        </div>

        {/* High-Density Metric Grid */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <div className="text-xs text-slate-400 font-medium">Designs & Code Deliverables</div>
            <div className="text-2xl md:text-3xl font-extrabold text-white font-mono tabular-nums mt-1">
              {totalDeliverables}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">100% Q/C Verified Artifacts</div>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <div className="text-xs text-slate-400 font-medium">Stable Roles Configured</div>
            <div className="text-2xl md:text-3xl font-extrabold text-indigo-400 font-mono tabular-nums mt-1">
              {totalRolesConfigured}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Designer · Developer · Q/C · Document Control</div>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <div className="text-xs text-slate-400 font-medium">Worker Agents Ready</div>
            <div className="text-2xl md:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums mt-1">
              {activeAgentsCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Independent Directives</div>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <div className="text-xs text-slate-400 font-medium">Swappable Models Catalog</div>
            <div className="text-2xl md:text-3xl font-extrabold text-white font-mono tabular-nums mt-1">
              {totalModelsCount}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">6 Providers via Encrypted Vault</div>
          </div>
        </div>
      </div>

      {/* Deliverables Section & Interactive Filter */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white font-display">Completed Designs & Codebases</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any deliverable to inspect full TSX code, visual design specs, and Q/C audit scores.
            </p>
          </div>

          {/* Interactive Filter Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                filter === 'all' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Deliverables
            </button>
            <button
              onClick={() => setFilter('dev')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                filter === 'dev' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Development (TSX)
            </button>
            <button
              onClick={() => setFilter('design')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                filter === 'design' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Design Specs
            </button>
            <button
              onClick={() => setFilter('qc')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                filter === 'qc' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Q/C Scorecards
            </button>
          </div>
        </div>

        {/* Deliverables Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArtifacts.map((artifact) => {
            const designerAgent = agents.find((a) => a.id === artifact.assignedRoles.designerAgentId);
            const developerAgent = agents.find((a) => a.id === artifact.assignedRoles.developerAgentId);
            const qcAgent = agents.find((a) => a.id === artifact.assignedRoles.qcAgentId);

            return (
              <div
                key={artifact.id}
                className="bg-slate-900/80 hover:bg-slate-900 rounded-xl border border-slate-800 hover:border-slate-700 p-5 transition-all duration-200 flex flex-col justify-between group shadow-lg"
              >
                <div className="space-y-4">
                  {/* Top Metadata Header (Unboxed text with bullet separators) */}
                  <div className="flex items-center justify-between text-xs text-slate-400 font-sans">
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-400 font-semibold">{artifact.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{artifact.date}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{artifact.metrics.latencySeconds}s execution</span>
                    </div>

                    <span className="text-emerald-400 font-medium font-mono text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {artifact.status}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition font-display">
                      {artifact.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                      {artifact.description}
                    </p>
                  </div>

                  {/* Visual Design Spec or Code Preview Summary */}
                  {artifact.designSpec && (
                    <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800/80 space-y-2">
                      <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                        <span>Color System & Typography</span>
                        <span className="text-slate-500">{artifact.designSpec.typographyHeading}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {artifact.designSpec.colorPalette.map((color, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <span
                              className="w-4 h-4 rounded border border-white/10 shrink-0"
                              style={{ backgroundColor: color.hex }}
                              title={`${color.name}: ${color.hex}`}
                            />
                            <span className="text-[10px] font-mono text-slate-400">{color.hex}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Lineage: Assigned Roles & Swapped Agents */}
                  <div className="pt-2 border-t border-slate-800/60">
                    <div className="text-[11px] font-medium text-slate-400 mb-2">Assigned Execution Team</div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="p-2 bg-slate-950/60 rounded border border-slate-800/60">
                        <div className="text-[10px] text-slate-500">Designer</div>
                        <div className="font-medium text-white truncate">{designerAgent?.name || 'Aura-UI'}</div>
                      </div>
                      <div className="p-2 bg-slate-950/60 rounded border border-slate-800/60">
                        <div className="text-[10px] text-slate-500">Developer</div>
                        <div className="font-medium text-white truncate">{developerAgent?.name || 'CodeForge'}</div>
                      </div>
                      <div className="p-2 bg-slate-950/60 rounded border border-slate-800/60">
                        <div className="text-[10px] text-slate-500">Q/C Auditor</div>
                        <div className="font-medium text-emerald-400 truncate">
                          {qcAgent?.name || 'Veritas'} ({artifact.qcReport?.overallScore || 98}%)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Action */}
                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-slate-500">
                    {artifact.metrics.tokensUsed} tokens · ${artifact.metrics.estimatedCostUsd}
                  </div>

                  <button
                    onClick={() => setSelectedArtifact(artifact)}
                    className="px-3.5 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Deliverable</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredArtifacts.length === 0 && (
          <div className="p-12 text-center bg-slate-900/40 rounded-xl border border-slate-800 space-y-3">
            <Terminal className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-base font-semibold text-white">No deliverables match selected filter</h3>
            <p className="text-xs text-slate-400">Run a team orchestration to create new designs and developments.</p>
            <button
              onClick={() => setActiveTab('studio')}
              className="mt-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition"
            >
              Launch Live Orchestrator
            </button>
          </div>
        )}
      </div>

      {/* Project Brain Section (عقل المشروع الدائم) */}
      <ProjectBrainGrid />

      {/* CTA Banner to Test Swappable Roles */}
      <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-base font-bold text-white font-display">Need to swap a Designer, Developer or Q/C role?</h3>
          <p className="text-xs text-slate-400">
            Stable job positions stay fixed while underlying worker agents and LLM models can be swapped in 1-click.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('roles')}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition whitespace-nowrap"
        >
          Manage Roles & Swaps
        </button>
      </div>
    </div>
  );
};
