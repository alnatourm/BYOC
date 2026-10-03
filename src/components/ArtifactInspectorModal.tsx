import React, { useState } from 'react';
import { useBYOK } from '../context/BYOKContext';
import { LiveAppPreviewCanvas } from './previews/LiveAppPreviewCanvas';

export const ArtifactInspectorModal: React.FC = () => {
  const { selectedArtifact, setSelectedArtifact, agents, updateArtifactStatus } = useBYOK();
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'design' | 'qc' | 'dossier'>('preview');
  const [copiedCode, setCopiedCode] = useState(false);
  const [showApprovalSuccess, setShowApprovalSuccess] = useState(false);
  const [showReStitchInput, setShowReStitchInput] = useState(false);
  const [modificationPrompt, setModificationPrompt] = useState('');
  const [isReStitching, setIsReStitching] = useState(false);
  const [reStitchSuccessMessage, setReStitchSuccessMessage] = useState<string | null>(null);

  if (!selectedArtifact) return null;

  const handleApprove = () => {
    updateArtifactStatus(selectedArtifact.id, 'Approved');
    setShowApprovalSuccess(true);
    setTimeout(() => setShowApprovalSuccess(false), 3000);
  };

  const handleToggleReStitch = () => {
    setShowReStitchInput((prev) => !prev);
    updateArtifactStatus(selectedArtifact.id, 'Needs Revision');
  };

  const handleExecuteReStitch = () => {
    if (!modificationPrompt.trim()) return;
    setIsReStitching(true);
    updateArtifactStatus(selectedArtifact.id, 'In Progress');

    setTimeout(() => {
      setIsReStitching(false);
      setShowReStitchInput(false);
      updateArtifactStatus(selectedArtifact.id, 'In Review');
      setReStitchSuccessMessage(`Re-stitched with instructions: "${modificationPrompt.trim()}"`);
      setModificationPrompt('');
      setTimeout(() => setReStitchSuccessMessage(null), 5000);
    }, 2500);
  };

  const designerAgent = agents.find((a) => a.id === selectedArtifact.assignedRoles.designerAgentId) || { name: 'Aura-UI' };
  const developerAgent = agents.find((a) => a.id === selectedArtifact.assignedRoles.developerAgentId) || { name: 'CodeForge-TS' };
  const qcAgent = agents.find((a) => a.id === selectedArtifact.assignedRoles.qcAgentId) || { name: 'Veritas-QC' };

  const handleCopyCode = () => {
    const code = selectedArtifact.codeContent || 'export default function Component() { return <div>Nova Analytics</div>; }';
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1c212c]/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 overflow-y-auto font-sans text-[#1c212c]">
      <div className="bg-[#f8f7f5] border border-[#e2d9d2] w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="p-5 bg-white border-b border-[#e2d9d2] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#887364] font-medium mb-1">
              <span>{selectedArtifact.category || 'SaaS Custom'}</span>
              <span>·</span>
              <span>Created {selectedArtifact.date || '2026-10-03'}</span>
              <span>·</span>
              <span className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                selectedArtifact.status === 'Approved'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : selectedArtifact.status === 'In Progress'
                  ? 'bg-orange-50 text-[#ea580c] border border-orange-200 animate-pulse'
                  : selectedArtifact.status === 'Needs Revision'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-orange-50 text-[#ea580c] border border-orange-200'
              }`}>
                Status: {selectedArtifact.status || 'Approved'}
              </span>
            </div>
            <h2 className="text-xl font-bold font-display text-[#1c212c]">{selectedArtifact.title}</h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {selectedArtifact.status !== 'Approved' ? (
              <button
                onClick={handleApprove}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Approve Design & Code</span>
              </button>
            ) : (
              <div className="px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
                <span>Approved by You</span>
              </div>
            )}

            <button
              onClick={handleToggleReStitch}
              className="px-4 py-2 text-xs font-bold text-white bg-[#ea580c] hover:bg-orange-700 rounded-xl transition shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              <span>{showReStitchInput ? 'Close Box' : '✨ Request Re-stitch'}</span>
            </button>

            <button
              onClick={handleCopyCode}
              className="px-3.5 py-2 text-xs font-bold text-[#1c212c] bg-[#f5f3ef] hover:bg-[#e8e3dc] border border-[#e2d9d2] rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-[#576071]">content_copy</span>
              <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
            </button>

            <button
              onClick={() => setSelectedArtifact(null)}
              className="p-2 text-[#948374] hover:text-[#1c212c] bg-[#f5f3ef] rounded-xl transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        {showApprovalSuccess && (
          <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-xs text-emerald-800 text-center font-bold">
            ✓ Project Design & Code approved! Status updated across platform.
          </div>
        )}

        {reStitchSuccessMessage && (
          <div className="p-3 bg-orange-50 border-b border-orange-200 text-xs text-orange-800 text-center font-bold">
            ✓ {reStitchSuccessMessage}
          </div>
        )}

        {/* Re-stitch Modification Box */}
        {showReStitchInput && (
          <div className="p-5 bg-white border-b border-orange-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#ea580c] font-display">
                <span className="material-symbols-outlined text-[16px] animate-pulse">auto_awesome</span>
                <span>Request Design Modification & Re-stitch</span>
              </div>
              <span className="text-[10px] font-mono text-[#948374]">Target Agent: StitchCrafter-UI & CodeForge-TS</span>
            </div>

            <p className="text-xs text-[#576071] leading-relaxed">
              Type your exact design changes below. Your instructions will be sent directly to the AI agents to re-stitch this canvas!
            </p>

            <div className="space-y-2">
              <textarea
                value={modificationPrompt}
                onChange={(e) => setModificationPrompt(e.target.value)}
                placeholder="Write your requested modifications here... e.g. Add 2-factor authentication, change primary button color..."
                rows={3}
                className="w-full bg-[#f9f8f6] text-xs text-[#1c212c] border border-[#e2d9d2] rounded-xl p-3 focus:outline-none focus:border-[#ea580c] font-sans leading-relaxed"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowReStitchInput(false)}
                  className="px-3.5 py-1.5 text-xs text-[#948374] hover:text-[#1c212c]"
                >
                  Cancel
                </button>

                <button
                  onClick={handleExecuteReStitch}
                  disabled={isReStitching || !modificationPrompt.trim()}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#ea580c] hover:bg-orange-700 disabled:opacity-50 rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                  <span>{isReStitching ? 'Re-stitching Canvas...' : 'Execute Re-stitch Run 🚀'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white border-b border-[#e2d9d2] px-5 py-2.5 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-[#ea580c] text-white shadow-md'
                : 'text-[#576071] hover:text-[#1c212c] hover:bg-[#f5f3ef]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            <span>Interactive Preview</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'code'
                ? 'bg-[#ea580c] text-white shadow-md'
                : 'text-[#576071] hover:text-[#1c212c] hover:bg-[#f5f3ef]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">code</span>
            <span>TypeScript Code ({selectedArtifact.codeContent?.length || 9385} chars)</span>
          </button>

          <button
            onClick={() => setActiveTab('design')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'design'
                ? 'bg-[#ea580c] text-white shadow-md'
                : 'text-[#576071] hover:text-[#1c212c] hover:bg-[#f5f3ef]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">description</span>
            <span>Design Specification</span>
          </button>

          <button
            onClick={() => setActiveTab('qc')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'qc'
                ? 'bg-[#ea580c] text-white shadow-md'
                : 'text-[#576071] hover:text-[#1c212c] hover:bg-[#f5f3ef]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>Q/C Scorecard ({selectedArtifact.qcReport?.overallScore || 98}%)</span>
          </button>

          <button
            onClick={() => setActiveTab('dossier')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'dossier'
                ? 'bg-[#ea580c] text-white shadow-md'
                : 'text-[#576071] hover:text-[#1c212c] hover:bg-[#f5f3ef]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">memory</span>
            <span>Document Control Dossier</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-[#f8f7f5]">
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="p-3 bg-white rounded-xl border border-[#e2d9d2] text-xs text-[#576071] flex items-center justify-between shadow-2xs">
                <span className="font-semibold">Interactive Software Canvas built by OGroup Autonomous Developer Agent</span>
                <span className="font-mono text-[#ea580c] font-bold">React 19 · Tailwind CSS</span>
              </div>

              {/* LIVE INTERACTIVE APPLICATION CANVAS */}
              <LiveAppPreviewCanvas
                title={selectedArtifact.title}
                category={selectedArtifact.category}
                description={selectedArtifact.description}
              />
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#576071] font-mono">
                <span>Source Code · TypeScript React TSX</span>
                <span>{selectedArtifact.codeContent?.length || 9385} characters</span>
              </div>
              <pre className="p-4 bg-[#1c212c] rounded-xl border border-stone-800 text-xs text-amber-100 font-mono overflow-x-auto leading-relaxed max-h-96">
                <code>{selectedArtifact.codeContent || `import React from 'react';\n\nexport default function ${selectedArtifact.title.replace(/[^a-zA-Z0-9]/g, '')}() {\n  return (\n    <div className="p-6 bg-[#f8f7f5] text-[#1c212c] rounded-2xl border border-[#e2d9d2]">\n      <h1 className="text-xl font-bold text-[#ea580c]">${selectedArtifact.title}</h1>\n    </div>\n  );\n}`}</code>
              </pre>
            </div>
          )}

          {activeTab === 'design' && (
            <div className="p-5 bg-white rounded-2xl border border-[#e2d9d2] space-y-4">
              <h3 className="text-sm font-bold text-[#1c212c] font-display">Design System Specification</h3>
              <p className="text-xs text-[#576071]">OGroup Studio Warm Color System and typography rules applied.</p>
            </div>
          )}

          {activeTab === 'qc' && (
            <div className="p-5 bg-white rounded-2xl border border-[#e2d9d2] space-y-4">
              <h3 className="text-sm font-bold text-[#1c212c] font-display">Q/C Scorecard Audit</h3>
              <p className="text-xs text-emerald-700 font-bold">Overall Score: 98% (PASSED)</p>
            </div>
          )}

          {activeTab === 'dossier' && (
            <div className="p-5 bg-white rounded-2xl border border-[#e2d9d2] space-y-4">
              <h3 className="text-sm font-bold text-[#1c212c] font-display">Document Control Release Dossier</h3>
              <p className="text-xs text-[#576071] font-mono">SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</p>
            </div>
          )}

          {/* Footer Lineage Bar */}
          <div className="p-4 bg-white rounded-xl border border-[#e2d9d2] text-xs space-y-2 shadow-2xs">
            <div className="font-bold text-[#1c212c]">Execution Lineage & Role Mapping</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[#576071]">
              <div>
                <span className="text-[#948374]">Designer:</span> <strong className="text-[#1c212c]">{designerAgent.name}</strong>
              </div>
              <div>
                <span className="text-[#948374]">Developer:</span> <strong className="text-[#1c212c]">{developerAgent.name}</strong>
              </div>
              <div>
                <span className="text-[#948374]">Q/C Auditor:</span> <strong className="text-[#1c212c]">{qcAgent.name}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
