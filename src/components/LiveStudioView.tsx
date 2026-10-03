import React, { useState } from 'react';
import { useBYOK } from '../context/BYOKContext';

export const LiveStudioView: React.FC = () => {
  const { roles, agents, runTeamOrchestration, isOrchestrating, orchestrationLogs, setActiveTab, setSelectedArtifact } = useBYOK();

  const [briefTitle, setBriefTitle] = useState('Pulse Health AI Patient Vital Dashboard');
  const [briefPrompt, setBriefPrompt] = useState('Design and develop a modern patient vitals monitoring portal for intensive care, including heart rate sparklines, oxygen saturation, encrypted vault key status, and active medical agent alerts.');
  const [category, setCategory] = useState('Healthcare SaaS');

  const designerRole = roles.find((r) => r.category === 'design' || r.roleTitle === 'Designer') || roles[0];
  const developerRole = roles.find((r) => r.category === 'dev' || r.roleTitle === 'Developer') || roles[1] || roles[0];
  const qcRole = roles.find((r) => r.category === 'qc' || r.roleTitle === 'Q/C') || roles[2] || roles[0];

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
    <div className="flex flex-col w-full pb-16 font-sans text-[#1c212c]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-100 font-bold text-xs text-[#ea580c]">
              🖥️ Advanced Engineering Console & Live Telemetry
            </span>
            <span className="text-[#948374]">•</span>
            <span className="text-xs text-[#576071] font-medium">غرفة التحكم الهندسي والتشغيل اللحظي</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-[#1c212c] tracking-tight">
            Advanced Engineering Console
          </h1>
          <p className="text-xs md:text-sm text-[#576071] mt-1 max-w-2xl font-medium">
            Inspect AST code generation, multi-agent step execution, live token telemetry, and pipeline diffs.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('build')}
          className="px-5 py-2.5 rounded-xl bg-[#ea580c] hover:bg-orange-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
          <span>Launch Build Suite / ابدأ البناء</span>
        </button>
      </div>

      {/* Preset Prompt Buttons */}
      <div className="bg-white rounded-2xl border border-[#e2d9d2]/70 p-6 shadow-sm mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-display text-sm font-bold text-[#1c212c] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ea580c] text-[18px]">lightbulb</span>
            Engineering Presets / النماذج الهندسية الجاهزة
          </span>
          <span className="text-xs text-[#948374] font-medium">Click to populate specification</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setBriefTitle(p.title);
                setCategory(p.category);
                setBriefPrompt(p.prompt);
              }}
              className="p-3.5 rounded-xl bg-[#f9f8f6] hover:bg-orange-50 border border-[#e2d9d2]/60 hover:border-orange-200 text-left transition-all cursor-pointer group"
            >
              <div className="text-xs font-bold text-[#1c212c] group-hover:text-[#ea580c] transition-colors">{p.title}</div>
              <div className="text-[10px] text-[#887364] mt-0.5">{p.category}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Form */}
      <div className="bg-white rounded-2xl border border-[#e2d9d2]/70 p-6 shadow-sm space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1c212c]">Project Name / اسم المشروع</label>
            <input
              type="text"
              value={briefTitle}
              onChange={(e) => setBriefTitle(e.target.value)}
              className="w-full bg-[#f9f8f6] border border-[#e2d9d2]/70 rounded-xl px-3.5 py-2.5 text-xs text-[#1c212c] font-semibold outline-none focus:border-[#ea580c]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1c212c]">Category / التصنيف</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#f9f8f6] border border-[#e2d9d2]/70 rounded-xl px-3.5 py-2.5 text-xs text-[#1c212c] font-semibold outline-none focus:border-[#ea580c]"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-[#1c212c]">Technical Specification / التفاصيل الهندسية</label>
          <textarea
            value={briefPrompt}
            onChange={(e) => setBriefPrompt(e.target.value)}
            rows={4}
            className="w-full bg-[#f9f8f6] border border-[#e2d9d2]/70 rounded-xl p-3.5 text-xs text-[#1c212c] font-medium outline-none focus:border-[#ea580c] resize-none"
          />
        </div>

        <button
          onClick={handleRun}
          disabled={isOrchestrating}
          className="w-full py-3 rounded-xl bg-[#ea580c] hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">play_arrow</span>
          <span>{isOrchestrating ? 'Synthesizing Engineering Pipeline...' : 'Execute Live Orchestration / تشغيل البناء اللحظي'}</span>
        </button>
      </div>

      {/* Live Logs Stream */}
      {orchestrationLogs.length > 0 && (
        <div className="bg-[#1c212c] rounded-2xl border border-stone-800 p-6 shadow-xl text-stone-100 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3 text-[#ea580c]">
            <span className="font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Live Pipeline Execution Stream
            </span>
            <span className="text-[10px] text-stone-400">Target SLA: Realtime Stream</span>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
            {orchestrationLogs.map((log, idx) => (
              <div key={idx} className="p-2.5 bg-stone-900/80 rounded-xl border border-stone-800 flex items-start gap-3">
                <span className="text-[#ea580c] font-bold shrink-0">[{log.roleTitle}]</span>
                <div className="flex-1">
                  <p className="text-stone-200">{log.outputSummary}</p>
                  <div className="text-[10px] text-stone-400 mt-0.5">
                    Agent: {log.agentName} | Model: {log.modelName} | Duration: {log.durationMs}ms
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
