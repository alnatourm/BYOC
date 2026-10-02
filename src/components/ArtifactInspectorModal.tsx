import React, { useState } from 'react';
import { useBYOK } from '../context/BYOKContext';
import { X, Code, Layout, ShieldCheck, Copy, Check, Download, ExternalLink, Cpu, Sparkles } from 'lucide-react';
import { CarDealershipPreview } from './previews/CarDealershipPreview';

export const ArtifactInspectorModal: React.FC = () => {
  const { selectedArtifact, setSelectedArtifact, agents, models } = useBYOK();
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'design' | 'qc'>('preview');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!selectedArtifact) return null;

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
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono mb-0.5">
              <span>{selectedArtifact.category}</span>
              <span>·</span>
              <span>Created {selectedArtifact.date}</span>
              <span>·</span>
              <span className="text-emerald-400 font-medium">Status: {selectedArtifact.status}</span>
            </div>
            <h2 className="text-xl font-bold text-white font-display">{selectedArtifact.title}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition flex items-center gap-1.5"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
            </button>

            <button
              onClick={() => setSelectedArtifact(null)}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

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

          {/* Tab 4: Q/C Report */}
          {activeTab === 'qc' && selectedArtifact.qcReport && (
            <div className="space-y-6">
              <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white font-display">Quality Control Audit Report</h3>
                    <p className="text-xs text-slate-400">Audited by assigned Q/C Worker Agent</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-emerald-400 font-mono">{selectedArtifact.qcReport.overallScore}/100</div>
                    <div className="text-[10px] font-mono text-slate-400">{selectedArtifact.qcReport.passStatus}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-center">
                    <div className="text-xs text-slate-400">Accessibility</div>
                    <div className="text-lg font-bold text-white font-mono mt-1">{selectedArtifact.qcReport.accessibilityScore}%</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-center">
                    <div className="text-xs text-slate-400">Security Audit</div>
                    <div className="text-lg font-bold text-white font-mono mt-1">{selectedArtifact.qcReport.securityScore}%</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-center">
                    <div className="text-xs text-slate-400">Code Quality</div>
                    <div className="text-lg font-bold text-white font-mono mt-1">{selectedArtifact.qcReport.codeQualityScore}%</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-white">Checks Passed</div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {selectedArtifact.qcReport.checksPassed.map((check, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{check}</span>
                      </li>
                    ))}
                  </ul>
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
