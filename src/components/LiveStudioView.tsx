import React, { useState } from 'react';
import { useBYOK } from '../context/BYOKContext';
import { Sparkles, Play, CheckCircle2, Loader2, ArrowRight, Layers, Eye, Cpu, ShieldCheck, Terminal } from 'lucide-react';

export const LiveStudioView: React.FC = () => {
  const { roles, agents, models, runTeamOrchestration, isOrchestrating, orchestrationLogs, setActiveTab, setSelectedArtifact } = useBYOK();

  const [briefTitle, setBriefTitle] = useState('Pulse Health AI Patient Vital Dashboard');
  const [briefPrompt, setBriefPrompt] = useState('Design and develop a modern patient vitals monitoring portal for intensive care, including heart rate sparklines, oxygen saturation, encrypted vault key status, and active medical agent alerts.');
  const [category, setCategory] = useState('Healthcare SaaS');

  const designerRole = roles.find((r) => r.category === 'design' || r.roleTitle === 'Designer') || roles[0];
  const developerRole = roles.find((r) => r.category === 'dev' || r.roleTitle === 'Developer') || roles[1] || roles[0];
  const qcRole = roles.find((r) => r.category === 'qc' || r.roleTitle === 'Q/C') || roles[2] || roles[0];
  const docRole = roles.find((r) => r.category === 'doc_control' || r.roleTitle === 'Document Control') || roles[3] || roles[0];

  const designerAgent = agents.find((a) => a.id === designerRole?.assignedAgentId);
  const developerAgent = agents.find((a) => a.id === developerRole?.assignedAgentId);
  const qcAgent = agents.find((a) => a.id === qcRole?.assignedAgentId);
  const docAgent = agents.find((a) => a.id === docRole?.assignedAgentId);

  const presets = [
    {
      title: 'Dark Mode SaaS Subscription Matrix',
      category: 'SaaS Billing',
      prompt: 'Create a dark slate SaaS tier comparison table with monthly/annual billing switch, active quota bar, and downloadable invoice ledger.',
    },
    {
      title: 'Zero-Trust Security Incident Dashboard',
      category: 'Security Console',
      prompt: 'Design a real-time threat detection panel with KMS vault status, live audit log feed, and zero-trust endpoint guard table.',
    },
    {
      title: 'E-Commerce AI Recommendation Drawer',
      category: 'E-Commerce Retail',
      prompt: 'Build a slide-over cart drawer with AI recommended accessories, instant checkout button, and tabular currency formatting.',
    },
  ];

  const handleRun = async () => {
    if (!briefPrompt.trim() || isOrchestrating) return;
    const newArtifact = await runTeamOrchestration(briefTitle, briefPrompt, category);
    if (newArtifact) {
      setSelectedArtifact(newArtifact);
      setActiveTab('dashboard');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono mb-1">
          <span>Live Execution Engine</span>
          <span>·</span>
          <span>Multi-Agent Pipeline</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white font-display">
          Live Team Role Orchestrator
        </h1>
        <p className="text-xs md:text-sm text-slate-300 mt-1">
          Test your mapped Designer, Developer, and Q/C roles live. The workflow executes sequentially and publishes the output directly to the Dashboard.
        </p>
      </div>

      {/* Preset Prompts Selector */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-400">Quick Prompt Presets:</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setBriefTitle(preset.title);
                setCategory(preset.category);
                setBriefPrompt(preset.prompt);
              }}
              className="p-3 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-xl text-left transition space-y-1 group"
            >
              <div className="text-xs font-bold text-white group-hover:text-indigo-300">{preset.title}</div>
              <div className="text-[11px] text-slate-400 line-clamp-2">{preset.prompt}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Brief Form */}
      <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 space-y-5 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Deliverable Title</label>
            <input
              type="text"
              value={briefTitle}
              onChange={(e) => setBriefTitle(e.target.value)}
              className="w-full bg-slate-950 text-xs text-white border border-slate-700 rounded-lg p-2.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Category Taxonomy</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 text-xs text-white border border-slate-700 rounded-lg p-2.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Brief & Requirements</label>
          <textarea
            value={briefPrompt}
            onChange={(e) => setBriefPrompt(e.target.value)}
            rows={3}
            className="w-full bg-slate-950 text-xs text-white border border-slate-700 rounded-lg p-3 focus:ring-1 focus:ring-indigo-500 focus:outline-none font-sans leading-relaxed"
          />
        </div>

        {/* Assigned Team Summary */}
        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3">
          <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Currently Mapped Role Pipeline</span>
            <button
              onClick={() => setActiveTab('roles')}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 underline"
            >
              Swap Roles or Models
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 bg-slate-900 rounded border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-500 font-mono">1. Designer Role</div>
              <div className="font-bold text-white">{designerAgent?.name || 'StitchCrafter-UI'}</div>
              <div className="text-[10px] text-indigo-300 font-mono">Stitch Design 2.5 Pro</div>
            </div>

            <div className="p-2.5 bg-slate-900 rounded border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-500 font-mono">2. Developer Role</div>
              <div className="font-bold text-white">{developerAgent?.name || 'CodeForge-TS'}</div>
              <div className="text-[10px] text-indigo-300 font-mono">Gemini 2.5 Flash</div>
            </div>

            <div className="p-2.5 bg-slate-900 rounded border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-500 font-mono">3. Q/C Auditor Role</div>
              <div className="font-bold text-emerald-400">{qcAgent?.name || 'Veritas-QC'}</div>
              <div className="text-[10px] text-indigo-300 font-mono">DeepSeek R1 Reasoning</div>
            </div>

            <div className="p-2.5 bg-slate-900 rounded border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-500 font-mono">4. Document Control</div>
              <div className="font-bold text-indigo-300">{docAgent?.name || 'DocuGuard-DC'}</div>
              <div className="text-[10px] text-indigo-300 font-mono">Release Dossier Signoff</div>
            </div>
          </div>
        </div>

        {/* Submit Execution Button */}
        <button
          onClick={handleRun}
          disabled={isOrchestrating || !briefPrompt.trim()}
          className="w-full py-3 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
        >
          {isOrchestrating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Executing Team Role Pipeline...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Run Team Role Orchestration</span>
            </>
          )}
        </button>
      </div>

      {/* Realtime Execution Logs */}
      {orchestrationLogs.length > 0 && (
        <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span>Execution Terminal Logs</span>
          </h3>

          <div className="space-y-3">
            {orchestrationLogs.map((log, idx) => (
              <div key={idx} className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1 text-xs">
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-white flex items-center gap-2">
                    {log.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    {log.status === 'running' && <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin" />}
                    <span>{log.roleTitle} ({log.agentName})</span>
                  </span>

                  <span className="text-slate-400">{log.modelName}</span>
                </div>
                <p className="text-slate-300 font-sans text-xs">{log.outputSummary}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
