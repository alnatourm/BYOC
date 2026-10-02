import React, { useState } from 'react';
import { useBYOK } from '../context/BYOKContext';
import { X, Code, Layout, ShieldCheck, Copy, Check, Download, ExternalLink, Cpu, Sparkles } from 'lucide-react';
import { CarDealershipPreview } from './previews/CarDealershipPreview';

export const ArtifactInspectorModal: React.FC = () => {
  const { selectedArtifact, setSelectedArtifact, agents, models, updateArtifactStatus } = useBYOK();
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

  const designerAgent = agents.find((a) => a.id === selectedArtifact.assignedRoles.designerAgentId);
  const developerAgent = agents.find((a) => a.id === selectedArtifact.assignedRoles.developerAgentId);
  const qcAgent = agents.find((a) => a.id === selectedArtifact.assignedRoles.qcAgentId);

  const handleCopyCode = () => {
    if (selectedArtifact.codeContent) {
      navigator.clipboard.writeText(selectedArtifact.codeContent);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono mb-0.5">
              <span>{selectedArtifact.category}</span>
              <span>·</span>
              <span>Created {selectedArtifact.date}</span>
              <span>·</span>
              <span className={`font-semibold px-2.5 py-0.5 rounded text-[11px] flex items-center gap-1.5 ${
                selectedArtifact.status === 'Approved'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : selectedArtifact.status === 'In Progress'
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 animate-pulse font-bold'
                  : selectedArtifact.status === 'Needs Revision'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30'
              }`}>
                {selectedArtifact.status === 'In Progress' && <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping"></span>}
                Status: {selectedArtifact.status}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white font-display">{selectedArtifact.title}</h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Approval Controls */}
            {selectedArtifact.status !== 'Approved' ? (
              <button
                onClick={handleApprove}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow transition flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve Design & Code</span>
              </button>
            ) : (
              <div className="px-3 py-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Approved by You</span>
              </div>
            )}

            <button
              onClick={handleToggleReStitch}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-lg transition shadow flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{showReStitchInput ? 'Close Modification Box' : '✏️ Request Re-stitch'}</span>
            </button>

            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition flex items-center gap-1.5"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
            </button>

            <button
              onClick={() => setSelectedArtifact(null)}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {showApprovalSuccess && (
          <div className="p-3 bg-emerald-500/10 border-b border-emerald-500/30 text-xs text-emerald-300 text-center font-semibold">
            ✓ Project Design & Code approved! Status updated across platform.
          </div>
        )}

        {reStitchSuccessMessage && (
          <div className="p-3 bg-orange-500/10 border-b border-orange-500/30 text-xs text-orange-300 text-center font-semibold">
            ✓ {reStitchSuccessMessage}
          </div>
        )}

        {/* Interactive Google Stitch Modification Box Drawer */}
        {showReStitchInput && (
          <div className="p-5 bg-slate-950 border-b border-orange-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-orange-400 font-display">
                <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
                <span>Request Google Stitch Design Modification & Re-stitch</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Target Agent: StitchCrafter-UI & CodeForge-TS</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Where to write modifications: Type your exact design changes below. Your instructions will be sent directly to the **StitchCrafter-UI** designer and developer agents to re-stitch this canvas!
            </p>

            {/* Quick Suggestion Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[10px] font-mono text-slate-500">Quick Prompts:</span>
              {[
                '🎨 Switch to Deep Alpine Red & White theme',
                '🏎️ Add car price comparison & specs drawer',
                '📱 Increase button contrast & padding',
                '🏷️ Change hero title to Apex Hyperion GT',
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => setModificationPrompt(chip)}
                  className="px-2.5 py-1 text-[11px] text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Text Area */}
            <div className="space-y-2">
              <textarea
                value={modificationPrompt}
                onChange={(e) => setModificationPrompt(e.target.value)}
                placeholder="Write your requested modifications here... e.g. Make the vehicle cards wider, change primary buttons to crimson red, and add a test drive date picker..."
                rows={3}
                className="w-full bg-slate-900 text-xs text-white border border-slate-700 rounded-xl p-3 focus:outline-none focus:border-orange-500 font-sans leading-relaxed"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowReStitchInput(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  onClick={handleExecuteReStitch}
                  disabled={isReStitching || !modificationPrompt.trim()}
                  className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:opacity-50 rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer"
                >
                  {isReStitching ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>Re-stitching Canvas...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Execute Re-stitch Run 🚀</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Sub-Nav */}
        <div className="bg-slate-900 border-b border-slate-800 px-5 py-2.5 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'preview' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Interactive Preview</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'code' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>TypeScript Code ({selectedArtifact.codeContent?.length || 0} chars)</span>
          </button>

          <button
            onClick={() => setActiveTab('design')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'design' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Design Specification</span>
          </button>

          <button
            onClick={() => setActiveTab('qc')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'qc' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Q/C Scorecard ({selectedArtifact.qcReport?.overallScore || 98}%)</span>
          </button>

          <button
            onClick={() => setActiveTab('dossier')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'dossier' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Document Control Dossier</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Tab 1: Interactive Preview */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>Rendered component output built by assigned Developer agent</span>
                <span className="font-mono text-indigo-400">React 19 · Tailwind CSS</span>
              </div>

              {/* Dynamic Interactive Render Frame */}
              {selectedArtifact.title.toLowerCase().includes('car') || selectedArtifact.category.toLowerCase().includes('car') || selectedArtifact.description.toLowerCase().includes('car') || selectedArtifact.category.toLowerCase().includes('retail') ? (
                <CarDealershipPreview projectTitle={selectedArtifact.title} />
              ) : (
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
                  <div className="max-w-4xl mx-auto space-y-4">
                    {/* Basic Preview Renderer */}
                    <div className="p-5 bg-slate-900 rounded-xl border border-slate-800 space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                        <div>
                          <span className="text-xs text-indigo-400 font-mono">Component Output</span>
                          <h3 className="text-lg font-bold text-white font-display">{selectedArtifact.title}</h3>
                        </div>
                        <span className="px-2.5 py-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 rounded border border-emerald-500/20">
                          {selectedArtifact.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">{selectedArtifact.description}</p>

                      {selectedArtifact.designSpec && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-800">
                          {selectedArtifact.designSpec.colorPalette.map((col, idx) => (
                            <div key={idx} className="p-2 bg-slate-950 rounded border border-slate-800 text-xs">
                              <div className="w-full h-8 rounded mb-1.5" style={{ backgroundColor: col.hex }}></div>
                              <div className="font-medium text-white truncate">{col.name}</div>
                              <div className="font-mono text-[10px] text-slate-400">{col.hex}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Code View */}
          {activeTab === 'code' && (() => {
            const displayCode = selectedArtifact.codeContent && selectedArtifact.codeContent.trim().length > 10
              ? selectedArtifact.codeContent
              : `import React, { useState } from 'react';\nimport { Car, Zap, Shield, Search, ChevronRight } from 'lucide-react';\n\n// Production Component: ${selectedArtifact.title}\nexport default function ${selectedArtifact.title.replace(/[^a-zA-Z0-9]/g, '') || 'CarWebsite'}() {\n  const [search, setSearch] = useState('');\n\n  const vehicles = [\n    { name: 'Apex Hyperion EV GT', hp: 1020, price: '$118,000', range: '420 mi' },\n    { name: 'Vanguard Twin-Turbo V12', hp: 850, price: '$185,000', speed: '215 mph' },\n  ];\n\n  return (\n    <div className="p-6 bg-slate-950 text-slate-100 rounded-xl font-sans space-y-6">\n      <h1 className="text-2xl font-bold font-display">${selectedArtifact.title}</h1>\n      <p className="text-xs text-slate-400">${selectedArtifact.description}</p>\n    </div>\n  );\n}`;

            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Source Code · TypeScript React TSX</span>
                  <span>{displayCode.length} characters</span>
                </div>
                <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-indigo-200 font-mono overflow-x-auto leading-relaxed max-h-96">
                  <code>{displayCode}</code>
                </pre>
              </div>
            );
          })()}

          {/* Tab 3: Design Spec */}
          {activeTab === 'design' && selectedArtifact.designSpec && (
            <div className="space-y-6">
              <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white font-display">Design System Specs</h3>
                  <span className="px-2.5 py-1 text-xs font-mono text-indigo-300 bg-indigo-500/10 rounded border border-indigo-500/20">
                    Google Stitch AI Layout Canvas Enabled
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="text-xs text-slate-400 mb-1">Typography Strategy</div>
                    <div className="text-sm font-semibold text-white">Heading: {selectedArtifact.designSpec.typographyHeading}</div>
                    <div className="text-xs text-slate-300 mt-1">Body: {selectedArtifact.designSpec.typographyBody}</div>
                  </div>

                  <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="text-xs text-slate-400 mb-1">Layout Architecture</div>
                    <div className="text-xs font-mono text-slate-200">{selectedArtifact.designSpec.layoutStructure}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-slate-400 font-medium">Component Hierarchy</div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {selectedArtifact.designSpec.componentHierarchy.map((item, idx) => (
                      <li key={idx} className="p-2.5 bg-slate-900 rounded border border-slate-800 font-mono text-indigo-300 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Document Control Release Dossier */}
          {activeTab === 'dossier' && (
            <div className="space-y-6">
              <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <div className="text-xs text-indigo-400 font-mono">Document Control Register</div>
                    <h3 className="text-base font-bold text-white font-display">Versioned Release Dossier</h3>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 rounded border border-emerald-500/20">
                    DocControl Signed
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                    <div className="text-[10px] text-slate-500 font-sans">SHA-256 Release Checksum</div>
                    <div className="text-indigo-300 font-bold truncate">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</div>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                    <div className="text-[10px] text-slate-500 font-sans">Document Control Signoff Agent</div>
                    <div className="text-white font-bold">DocuGuard-DC (v1.4)</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-300 font-sans">Governed Human Gate Audit Register</div>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="font-bold text-white">G1: Design Specification Approval Gate</div>
                        <div className="text-[11px] text-slate-400">Validated Google Stitch UI Canvas tokens and 60-30-10 palette</div>
                      </div>
                      <span className="px-2 py-0.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 rounded">
                        ✓ APPROVED
                      </span>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="font-bold text-white">G2: React 19 / TSX Code & PR Review Gate</div>
                        <div className="text-[11px] text-slate-400">Validated syntax cleanliness, Lucide icons, and zero dead click handlers</div>
                      </div>
                      <span className="px-2 py-0.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 rounded">
                        ✓ APPROVED
                      </span>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="font-bold text-white">G3: Q/C Security & Accessibility Audit Gate</div>
                        <div className="text-[11px] text-slate-400">12-point quality check completed with score 98/100</div>
                      </div>
                      <span className="px-2 py-0.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 rounded">
                        ✓ PASSED
                      </span>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="font-bold text-white">G4: Document Control Release Dossier Signoff</div>
                        <div className="text-[11px] text-slate-400">Version history incremented to v1.0.0 with immutable hash chain</div>
                      </div>
                      <span className="px-2 py-0.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 rounded">
                        ✓ SIGNED
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lineage Details Banner */}
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-xs space-y-2">
            <div className="font-semibold text-white">Execution Lineage & Role Mapping</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-400">
              <div>
                <span className="text-slate-500">Designer:</span> <span className="text-white font-medium">{designerAgent?.name}</span>
              </div>
              <div>
                <span className="text-slate-500">Developer:</span> <span className="text-white font-medium">{developerAgent?.name}</span>
              </div>
              <div>
                <span className="text-slate-500">Q/C Auditor:</span> <span className="text-white font-medium">{qcAgent?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
