import React, { useState } from 'react';
import { useBYOK } from '../context/BYOKContext';

export const Gate4ReleaseView: React.FC = () => {
  const { setCurrentGateStep, selectedArtifact } = useBYOK();
  const [isDeploying, setIsDeploying] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  const handleApproveGate4 = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      showToast('🚀 Gate 4 Release Approved! Live application deployed to Global Edge CDN.');
      setTimeout(() => {
        setCurrentGateStep('completed');
      }, 1000);
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full pb-32 font-sans text-[#1f242e] bg-[#f8f7f5] min-h-screen">
      {toastMsg && (
        <div className="fixed top-20 right-8 bg-white border-2 border-emerald-500 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-[#1f242e] z-50 animate-in fade-in duration-200">
          <span className="material-symbols-outlined text-emerald-600 text-[24px]">verified</span>
          <div>
            <p className="font-display font-bold text-sm text-emerald-700">Gate 4 Release</p>
            <p className="text-xs text-[#554336]">{toastMsg}</p>
          </div>
        </div>
      )}

      {/* Stepper Header */}
      <div className="pt-4 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-200/80 text-[#1f242e]">
              <span className="text-[11px] font-mono text-[#887364] font-bold">PROJECT</span>
              <span className="font-display text-sm font-bold text-[#ea580c]">
                {selectedArtifact?.title ? selectedArtifact.title.substring(0, 20) : 'PRJ-8842'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-100 text-emerald-800 shadow-2xs border border-emerald-200 font-bold text-xs">
            <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
            <span>Final Gate 4: Live Staging Release Signoff</span>
          </div>
        </div>

        {/* Stepper */}
        <div className="w-full bg-white p-4 rounded-2xl shadow-xs border border-stone-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-emerald-200">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">✓</div>
              <span className="text-xs font-bold text-teal-800">01. SPEC PASSED</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-emerald-200">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">✓</div>
              <span className="text-xs font-bold text-teal-800">02. DESIGN PASSED</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-emerald-200">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">✓</div>
              <span className="text-xs font-bold text-teal-800">03. CODE PASSED</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-emerald-200">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">✓</div>
              <span className="text-xs font-bold text-teal-800">04. QC PASSED</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border-2 border-emerald-500 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">05</div>
              <span className="text-xs font-extrabold text-emerald-800">05. DEPLOY ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Release Dossier Box */}
      <section className="space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-emerald-600 text-[28px]">verified</span>
              <div>
                <h2 className="font-display text-xl font-bold text-[#1f242e]">05. Release Agent Dossier Signoff</h2>
                <p className="text-xs text-[#554336]">Immutable SHA-256 release checksum generated for staging edge deployment.</p>
              </div>
            </div>
          </div>

          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 font-mono text-xs space-y-2">
            <p className="text-[#887364]">SHA-256 Checksum: <strong className="text-emerald-700">#4f98a12c88f9901bd81a00288f</strong></p>
            <p className="text-[#887364]">Container Image: <strong className="text-[#1f242e]">registry.ogroup.sa/vaultsign:v1.2-latest</strong></p>
            <p className="text-[#887364]">Edge Domain: <strong className="text-[#ea580c]">https://vaultsign.ogroup.app</strong></p>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 md:left-72 right-0 bg-white/95 backdrop-blur-xl p-4 z-40 border-t border-stone-200 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              🚀
            </div>
            <div>
              <span className="font-display text-sm font-bold text-[#1f242e]">Final Gate 4: Approve Live Release & Launch App</span>
              <p className="text-xs text-[#554336]">Deploys live application to edge servers & opens interactive preview.</p>
            </div>
          </div>

          <button
            onClick={handleApproveGate4}
            disabled={isDeploying}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg transition cursor-pointer flex items-center gap-2"
          >
            {isDeploying ? 'Deploying to Edge CDN...' : '🚀 Approve Gate 4 & Launch Live Application'}
          </button>
        </div>
      </div>
    </div>
  );
};
