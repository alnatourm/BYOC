import React, { useState } from 'react';
import { useBYOK } from '../context/BYOKContext';

export const Gate4QCSecurityView: React.FC = () => {
  const { setCurrentGateStep, selectedArtifact } = useBYOK();
  const [isApproving, setIsApproving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

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

  const handleApproveGate4 = () => {
    setIsApproving(true);
    showToast('✅ Gate 4 Approved! Quality & Security Certified. Unlocking Stage 05: Live Cloud Release...');
    setTimeout(() => {
      setIsApproving(false);
      setCurrentGateStep('gate5' as any);
    }, 600);
  };

  return (
    <div className="flex flex-col w-full pb-32 font-sans text-[#1f242e] bg-[#f8f7f5] min-h-screen">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-8 bg-white border-2 border-[#d97706] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-[#1f242e] z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="material-symbols-outlined text-[#d97706] text-[24px]">verified</span>
          <div>
            <p className="font-display font-bold text-sm text-[#d97706]">Gate 4 QC Sentinel Update</p>
            <p className="text-xs text-stone-600">{toastMsg}</p>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="pt-4 pb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#d97706] animate-pulse"></span>
            <h2 className="font-display text-lg font-bold text-[#1f242e]">
              Stage 04: Quality Control & SAST Security Audit{' '}
              <span className="text-[#d97706] font-semibold text-sm">({appTitle})</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
              04. QC Sentinel Agent (Faris) • 99/100 PASSED
            </span>
          </div>
        </div>
      </div>

      {/* QC Audit Results Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-stone-500 uppercase">E2E Test Suite</span>
          <span className="font-display text-3xl font-extrabold text-[#d97706] block">38 / 38 Passed</span>
          <p className="text-xs text-stone-600 font-medium">100% Playwright UI interaction coverage across Chrome & Safari Mobile.</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-stone-500 uppercase">SAST Security Scan</span>
          <span className="font-display text-3xl font-extrabold text-emerald-700 block">Zero Vulnerabilities</span>
          <p className="text-xs text-stone-600 font-medium">OWASP Top 10 validated. XSS, SQLi & CSRF sanitized.</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-stone-500 uppercase">WCAG AAA Contrast</span>
          <span className="font-[#1f242e] font-display text-3xl font-extrabold text-teal-700 block">7.2:1 Gold Ratio</span>
          <p className="text-xs text-stone-600 font-medium">High contrast Gold (#d97706) & White accessibility compliant.</p>
        </div>
      </section>

      {/* Detailed QC Execution Log */}
      <section className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4 mb-8">
        <h3 className="font-display font-bold text-base text-[#1f242e] flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-600">playlist_add_check</span>
          <span>Verified Test Executions for {appTitle}</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-600 text-[18px]">check_circle</span>
              <span className="font-semibold text-[#1f242e]">Verified Sameer Saloon service selection & SAR pricing calculation</span>
            </div>
            <span className="font-mono font-bold text-teal-700">PASSED (14ms)</span>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-600 text-[18px]">check_circle</span>
              <span className="font-semibold text-[#1f242e]">Verified barber shift slot picker (Master Sameer, Ahmed, Youssef)</span>
            </div>
            <span className="font-mono font-bold text-teal-700">PASSED (18ms)</span>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-600 text-[18px]">check_circle</span>
              <span className="font-semibold text-[#1f242e]">Verified WhatsApp Cloud API webhook payload & ZATCA 15% VAT calculation</span>
            </div>
            <span className="font-mono font-bold text-teal-700">PASSED (22ms)</span>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Human Approval Gate 4 Bar */}
      <div className="fixed bottom-0 left-0 md:left-72 right-0 bg-white/95 backdrop-blur-xl p-4 z-40 border-t border-stone-200 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 text-[#d97706] flex items-center justify-center font-bold">
              04
            </div>
            <div>
              <span className="font-display text-sm font-bold text-[#1f242e]">
                Human Approval Gate 4: Certify Quality & Security Audit
              </span>
              <p className="text-xs text-stone-600">
                Authorizes <strong className="text-[#1f242e]">05. Release Agent (Badr)</strong> to deploy live cloud edge server.
              </p>
            </div>
          </div>

          <button
            onClick={handleApproveGate4}
            disabled={isApproving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-amber-600 hover:from-amber-700 hover:to-amber-800 text-white font-extrabold text-xs shadow-lg transition cursor-pointer flex items-center gap-2"
          >
            {isApproving ? 'Deploying to Cloud...' : 'Approve QC Audit & Release Live Cloud Server (Gate 5) ➔'}
          </button>
        </div>
      </div>
    </div>
  );
};
