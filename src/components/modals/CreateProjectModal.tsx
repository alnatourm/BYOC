import React, { useState } from 'react';
import { useBYOK } from '../../context/BYOKContext';
import { X, Sparkles, FolderPlus, Layers, Play, CheckCircle2, Loader2, Bot, Cpu } from 'lucide-react';

export const CreateProjectModal: React.FC = () => {
  const { isCreateProjectOpen, setIsCreateProjectOpen, roles, agents, models, runTeamOrchestration, isOrchestrating, addArtifact, setSelectedArtifact, setActiveTab } = useBYOK();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('SaaS Dashboard');
  const [prompt, setPrompt] = useState('');
  const [executionMode, setExecutionMode] = useState<'auto_run' | 'draft_shell'>('auto_run');

  const designerRole = roles.find((r) => r.category === 'design' || r.roleTitle === 'Designer') || roles[0];
  const developerRole = roles.find((r) => r.category === 'dev' || r.roleTitle === 'Developer') || roles[1] || roles[0];
  const qcRole = roles.find((r) => r.category === 'qc' || r.roleTitle === 'Q/C') || roles[2] || roles[0];

  const designerAgent = agents.find((a) => a.id === designerRole?.assignedAgentId);
  const developerAgent = agents.find((a) => a.id === developerRole?.assignedAgentId);
  const qcAgent = agents.find((a) => a.id === qcRole?.assignedAgentId);

  const categories = [
    'SaaS Dashboard',
    'Security Console',
    'E-Commerce Retail',
    'Mobile Touch App',
    'Developer Console',
    'Healthcare SaaS',
    'Custom Project',
  ];

  if (!isCreateProjectOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !prompt.trim() || isOrchestrating) return;

    if (executionMode === 'auto_run') {
      const artifact = await runTeamOrchestration(title, prompt, category);
      setIsCreateProjectOpen(false);
      if (artifact) {
        setSelectedArtifact(artifact);
        setActiveTab('dashboard');
      }
    } else {
      // Draft shell creation
      const draftArtifact = {
        id: `art-${Date.now()}`,
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: prompt,
        type: 'full_pipeline' as const,
        category,
        date: new Date().toISOString().split('T')[0],
        status: 'In Review' as const,
        assignedRoles: {
          designerAgentId: designerAgent?.id || agents[0]?.id,
          designerModelId: designerRole?.assignedModelId || models[0]?.id,
          developerAgentId: developerAgent?.id || agents[1]?.id,
          developerModelId: developerRole?.assignedModelId || models[0]?.id,
          qcAgentId: qcAgent?.id || agents[2]?.id,
          qcModelId: qcRole?.assignedModelId || models[0]?.id,
        },
        designSpec: {
          colorPalette: [
            { name: 'Dark Slate Canvas', hex: '#0F172A' },
            { name: 'Indigo Primary', hex: '#6366F1' },
            { name: 'Emerald Active', hex: '#10B981' },
          ],
          typographyHeading: 'Cabinet Grotesk',
          typographyBody: 'Plus Jakarta Sans',
          layoutStructure: 'Header + Main Content Workspace Frame',
          componentHierarchy: ['HeaderNav', 'MainContentArea'],
        },
        codeContent: `import React, { useState } from 'react';
import { Car, Zap, Shield, Search, ChevronRight, Check } from 'lucide-react';

export default function ${title.replace(/[^a-zA-Z0-9]/g, '') || 'CarWebsiteShowcase'}() {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  const vehicles = [
    { name: 'Apex Hyperion EV GT', hp: 1020, zero60: '1.98s', range: '420 mi', price: '$118,000' },
    { name: 'Vanguard V12 Supra-Sport', hp: 850, zero60: '2.7s', range: '380 mi', price: '$185,000' },
    { name: 'AeroStealth EV SUV', hp: 750, zero60: '3.4s', range: '360 mi', price: '$94,500' },
  ];

  return (
    <div className="p-6 bg-slate-950 text-slate-100 rounded-xl font-sans border border-slate-800 space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold font-display">${title}</h1>
        <div className="px-3 py-1 bg-indigo-600/20 text-indigo-400 text-xs rounded border border-indigo-500/30">
          Automotive Fleet Ready
        </div>
      </div>
      <p className="text-xs text-slate-300">${prompt}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {vehicles.map((v, i) => (
          <div key={i} className="p-4 bg-slate-900 rounded-lg border border-slate-800 space-y-2">
            <h3 className="font-bold text-white text-sm">{v.name}</h3>
            <div className="text-xs text-indigo-400 font-mono">{v.price} · {v.hp} HP</div>
          </div>
        ))}
      </div>
    </div>
  );
}`,
        qcReport: {
          overallScore: 92,
          passStatus: 'PASSED' as const,
          checksPassed: ['Draft project shell validated', 'Single-elevation container structure verified'],
          warnings: ['Awaiting team agent execution run'],
          recommendations: ['Trigger Live Studio orchestrator to generate full TSX implementation'],
          accessibilityScore: 95,
          securityScore: 95,
          codeQualityScore: 90,
        },
        metrics: {
          latencySeconds: 0.2,
          tokensUsed: 120,
          estimatedCostUsd: 0.0001,
        },
      };

      addArtifact(draftArtifact);
      setIsCreateProjectOpen(false);
      setSelectedArtifact(draftArtifact);
      setActiveTab('dashboard');
    }

    setTitle('');
    setPrompt('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5 my-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">Create New Project</h2>
              <p className="text-xs text-slate-400">Assign role agents & generate design and development deliverables</p>
            </div>
          </div>

          <button onClick={() => setIsCreateProjectOpen(false)} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Project Name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Apex Analytics Billing Portal, CyberGuard Mobile Console"
              required
              className="w-full bg-slate-950 text-white border border-slate-700 rounded-lg p-2.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 text-white border border-slate-700 rounded-lg p-2.5"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Execution Mode</label>
              <select
                value={executionMode}
                onChange={(e) => setExecutionMode(e.target.value as any)}
                className="w-full bg-slate-950 text-white border border-slate-700 rounded-lg p-2.5"
              >
                <option value="auto_run">🚀 Auto-Build via Mapped Role Agents</option>
                <option value="draft_shell">📝 Create Project Workspace Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Project Brief & Requirements</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="Describe what you want to build (e.g., dark mode dashboard with tier selector, live metric meters, and invoice table)..."
              required
              className="w-full bg-slate-950 text-white border border-slate-700 rounded-lg p-3 font-sans leading-relaxed focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Assigned Team Preview */}
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
            <div className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
              <span>Assigned Team Pipeline for this Project</span>
              <span className="text-[10px] text-indigo-400 font-mono">3 Roles Ready</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <div className="text-[10px] text-slate-500">Designer</div>
                <div className="font-semibold text-white truncate">{designerAgent?.name || 'Aura-UI'}</div>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <div className="text-[10px] text-slate-500">Developer</div>
                <div className="font-semibold text-white truncate">{developerAgent?.name || 'CodeForge-TS'}</div>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <div className="text-[10px] text-slate-500">Q/C Auditor</div>
                <div className="font-semibold text-emerald-400 truncate">{qcAgent?.name || 'Veritas-QC'}</div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 italic">
              Deliverables will appear instantly on the Dashboard.
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCreateProjectOpen(false)}
                className="px-4 py-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isOrchestrating}
                className="px-4 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition flex items-center gap-1.5 cursor-pointer disabled:bg-slate-800 disabled:text-slate-500"
              >
                {isOrchestrating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Create & Build Project</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
