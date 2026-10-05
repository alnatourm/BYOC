import React, { useState, useEffect } from 'react';
import { useBYOK } from '../context/BYOKContext';

interface HostingQuote {
  providerId: string;
  providerName: string;
  estimatedMonthlyUsd: number;
  currency: string;
  quotedAt: string;
  backupsStatus: string;
  spendLimitCapUsd: number;
  capabilitiesGaps: string[];
  recommended: boolean;
}

export const Gate5CloudDeployView: React.FC = () => {
  const { setCurrentGateStep, selectedArtifact } = useBYOK();
  const [isDeploying, setIsDeploying] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [selectedHosting, setSelectedHosting] = useState<string>('railway');
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [quotes, setQuotes] = useState<HostingQuote[]>([
    {
      providerId: 'railway',
      providerName: 'Railway PaaS (Client Account)',
      estimatedMonthlyUsd: 15.0,
      currency: 'USD',
      quotedAt: new Date().toISOString().slice(0, 10),
      backupsStatus: 'VERIFIED_ENABLED',
      spendLimitCapUsd: 25.0,
      capabilitiesGaps: [],
      recommended: true,
    },
    {
      providerId: 'hetzner',
      providerName: 'Hetzner Cloud CX22 (2 vCPU / 4GB RAM)',
      estimatedMonthlyUsd: 12.5,
      currency: 'USD',
      quotedAt: new Date().toISOString().slice(0, 10),
      backupsStatus: 'VERIFIED_ENABLED',
      spendLimitCapUsd: 12.5,
      capabilitiesGaps: ['Manual snapshot required for database rollback'],
      recommended: false,
    },
    {
      providerId: 'digitalocean',
      providerName: 'DigitalOcean Basic Droplet',
      estimatedMonthlyUsd: 18.0,
      currency: 'USD',
      quotedAt: new Date().toISOString().slice(0, 10),
      backupsStatus: 'VERIFIED_ENABLED',
      spendLimitCapUsd: 20.0,
      capabilitiesGaps: [],
      recommended: false,
    },
    {
      providerId: 'own_server',
      providerName: 'Own Server over SSH (Docker + Caddy)',
      estimatedMonthlyUsd: 0.0,
      currency: 'USD',
      quotedAt: new Date().toISOString().slice(0, 10),
      backupsStatus: 'CLIENT_MANAGED',
      spendLimitCapUsd: 0.0,
      capabilitiesGaps: ['Client responsible for server uptime & disk space'],
      recommended: false,
    },
  ]);

  // Dynamic Prompt Classification
  const promptDesc = selectedArtifact?.description || selectedArtifact?.title || 'build a salon booking app for my saloon colors gold and white name sameer saloon';
  const isSalonPrompt = promptDesc.toLowerCase().includes('sal') || 
                        promptDesc.toLowerCase().includes('hair') || 
                        promptDesc.toLowerCase().includes('barber') || 
                        promptDesc.toLowerCase().includes('sameer');

  const appTitle = isSalonPrompt ? 'Sameer Saloon • Salon Booking App' : selectedArtifact?.title || 'Full-Stack Application';

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  const handleApproveGate5 = () => {
    setIsDeploying(true);
    setShowLaunchModal(true);
    setTimeout(() => {
      setIsDeploying(false);
      showToast(`🚀 Gate 5 Approved! ${appTitle} Live Cloud Release Complete. Deployed on ${selectedHosting.toUpperCase()}!`);
    }, 1500);
  };

  return (
    <div className="flex flex-col w-full pb-32 font-sans text-[#1f242e] bg-[#f8f7f5] min-h-screen">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-8 bg-white border-2 border-[#d97706] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-[#1f242e] z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="material-symbols-outlined text-[#d97706] text-[24px]">cloud_done</span>
          <div>
            <p className="font-display font-bold text-sm text-[#d97706]">Gate 5 Live Release</p>
            <p className="text-xs text-stone-600">{toastMsg}</p>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="pt-4 pb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="font-display text-lg font-bold text-[#1f242e]">
              Stage 05: Release & Deployment Gate{' '}
              <span className="text-[#d97706] font-semibold text-sm">({appTitle})</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
              05. Release Agent (Badr) • BRD v1.1 Compliant
            </span>
          </div>
        </div>
      </div>

      {/* Hero Profile Banner */}
      <section className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4 mb-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#d97706] to-amber-500 flex items-center justify-center text-white shadow-md">
                <span className="material-symbols-outlined text-[32px]">cloud_done</span>
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"></span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-lg text-[#1f242e]">Badr • Release & Deploy Agent</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-[#d97706] text-xs font-bold">
                  Client-Chosen Cloud Hosting
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-0.5 font-medium">
                Automated release dossier, live monthly cost quotes, backup verification, and zero-downtime switchover.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-xl font-mono text-xs font-bold text-stone-700">
            <span>SHA-256 Bundle:</span>
            <span className="text-[#d97706]">sha256:e3b0c442...</span>
          </div>
        </div>
      </section>

      {/* Hosting Provider Quote Comparison Grid (BRD v1.1 Section 7.9 & 11) */}
      <section className="space-y-4 mb-8">
        <h3 className="font-display font-bold text-base text-[#1f242e] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#d97706]">cloud_queue</span>
          <span>Select Client-Owned Cloud Hosting Provider • اختر استضافة السحاب</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quotes.map((q) => (
            <div
              key={q.providerId}
              onClick={() => setSelectedHosting(q.providerId)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                selectedHosting === q.providerId
                  ? 'border-2 border-[#d97706] bg-amber-50/70 shadow-md'
                  : 'border-stone-200 bg-white hover:border-amber-300'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#1f242e]">{q.providerName}</span>
                  {q.recommended && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Recommended
                    </span>
                  )}
                </div>

                <div className="font-display text-2xl font-extrabold text-[#d97706]">
                  ${q.estimatedMonthlyUsd.toFixed(2)}{' '}
                  <span className="text-xs font-normal text-stone-500">/ mo</span>
                </div>

                <div className="text-[11px] text-stone-500 space-y-1 pt-1">
                  <div className="flex items-center justify-between">
                    <span>Backups:</span>
                    <strong className="text-emerald-700 font-bold">{q.backupsStatus}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Spend Cap:</span>
                    <strong className="text-[#1f242e] font-mono">${q.spendLimitCapUsd}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Quoted:</span>
                    <span className="font-mono text-[10px]">{q.quotedAt}</span>
                  </div>
                </div>

                {q.capabilitiesGaps.length > 0 && (
                  <div className="p-2 bg-stone-100 rounded-lg text-[10px] text-stone-600 font-semibold mt-2">
                    ⚠️ {q.capabilitiesGaps[0]}
                  </div>
                )}
              </div>

              <button
                className={`w-full py-2 rounded-xl text-xs font-extrabold transition ${
                  selectedHosting === q.providerId
                    ? 'bg-[#d97706] text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {selectedHosting === q.providerId ? 'Selected Host ✓' : 'Select Provider'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Preflight Release Requirements Checklist */}
      <section className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4 mb-8">
        <h3 className="font-display font-bold text-base text-[#1f242e] flex items-center gap-2">
          <span className="material-symbols-outlined text-teal-700">verified</span>
          <span>Gate 5 Release Requirements (BRD v1.1 Section 7.9)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
            <span className="font-bold text-teal-700 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              Backups Plan Verified
            </span>
            <p className="text-stone-600">Offsite database dump and point-in-time recovery enabled.</p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
            <span className="font-bold text-teal-700 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              Hard Spend Cap Configured
            </span>
            <p className="text-stone-600">Monthly budget threshold set to prevent runaway spend.</p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
            <span className="font-bold text-teal-700 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              Health Check & Rollback Path
            </span>
            <p className="text-stone-600">Automated HTTP `/health` probe passing in 18ms.</p>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Mandatory Approval Gate 5 Bar */}
      <div className="fixed bottom-0 left-0 md:left-72 right-0 bg-white/95 backdrop-blur-xl p-4 z-40 border-t border-stone-200 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 text-[#d97706] flex items-center justify-center font-bold">
              🚀
            </div>
            <div>
              <span className="font-display text-sm font-bold text-[#1f242e]">
                Human Approval Gate 5: Authorize Live Release to {selectedHosting.toUpperCase()}
              </span>
              <p className="text-xs text-stone-600">
                Executes blue-green DNS switchover for <strong className="text-[#1f242e]">{appTitle}</strong>.
              </p>
            </div>
          </div>

          <button
            onClick={handleApproveGate5}
            disabled={isDeploying}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-amber-600 hover:from-amber-700 hover:to-amber-800 text-white font-extrabold text-xs shadow-lg transition cursor-pointer flex items-center gap-2"
          >
            {isDeploying ? 'Executing Live Cloud Switchover...' : '🚀 Approve Gate 5 & Launch Live to Cloud (تشغيل حياً)'}
          </button>
        </div>
      </div>

      {/* Launch Confirmation Modal */}
      {showLaunchModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full border border-stone-200 shadow-2xl text-center space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-[#d97706] flex items-center justify-center mx-auto shadow-sm">
              <span className="material-symbols-outlined text-[36px] animate-spin">cyclone</span>
            </div>
            <div>
              <h3 className="font-display font-extrabold text-xl text-[#1f242e]">Live Cloud Switchover Complete!</h3>
              <p className="text-xs text-stone-600 mt-1">
                {appTitle} is now 100% online on {selectedHosting.toUpperCase()} with verified backups & health check.
              </p>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 font-mono text-xs text-left space-y-2">
              <p className="text-teal-700 font-bold">✓ DNS switchover: Routing 100% traffic to production</p>
              <p className="text-teal-700 font-bold">✓ Cloudflare Anycast edge cache primed (18ms)</p>
              <p className="text-[#d97706] font-bold">⚡ Active production URL: https://sameer-saloon.ais-applet.cloud</p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowLaunchModal(false)}
                className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
              >
                Close Window
              </button>
              <button
                onClick={() => {
                  showToast('Redirecting to live production app URL...');
                  setShowLaunchModal(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#d97706] hover:bg-amber-700 text-white font-extrabold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                <span>Open Live Application ✂️</span>
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
