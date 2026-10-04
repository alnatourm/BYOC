import React, { useState } from 'react';
import { useBYOK } from '../context/BYOKContext';

export const Gate4QCSecurityView: React.FC = () => {
  const { setCurrentGateStep, selectedArtifact } = useBYOK();
  const [isApproving, setIsApproving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [extraAuditInput, setExtraAuditInput] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  const handleApproveGate4 = () => {
    setIsApproving(true);
    showToast('✅ Gate 4 Approved! Transitioning to Stage 05 (Release & Cloud Deployment)...');
    setTimeout(() => {
      setIsApproving(false);
      setCurrentGateStep('gate5' as any);
    }, 600);
  };

  const handleRunExtraAudit = () => {
    if (!extraAuditInput.trim()) {
      showToast('Please type an extra security or QA test command.');
      return;
    }
    showToast(`Faris is executing extra audit: "${extraAuditInput}"... All assertions passed in 1.2s.`);
    setExtraAuditInput('');
  };

  return (
    <div className="flex flex-col w-full pb-32 font-sans text-[#27272a] bg-[#f9f8f6] min-h-screen">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-8 bg-white border-2 border-[#ea580c] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-[#27272a] z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="material-symbols-outlined text-[#ea580c] text-[24px]">verified</span>
          <div>
            <p className="font-display font-bold text-sm text-[#ea580c]">Gate 4 Update</p>
            <p className="text-xs text-[#52525b]">{toastMsg}</p>
          </div>
        </div>
      )}

      {/* Top Breadcrumb & Metadata Banner */}
      <div className="pt-4 pb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#e5e4de] shadow-xs">
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-[#f4f3ef] font-bold text-[#18181b] border border-[#e5e4de]">
              PRJ-8842
            </span>
            <span className="text-[#a1a1aa]">/</span>
            <span className="font-display text-base text-[#ea580c] font-bold">
              {selectedArtifact?.title || 'VaultSign OS'}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 font-bold">
              Bilingual v1.2
            </span>
            <span className="text-[#a1a1aa]">•</span>
            <span className="font-mono bg-[#f4f3ef] px-2 py-0.5 rounded text-[#52525b] border border-[#e5e4de] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-emerald-600">lock</span>
              Codebase Locked from Gate 3 (Commit <strong className="text-[#ea580c]">c8f1e29</strong>)
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold">
              <span className="material-symbols-outlined text-[16px] text-[#ea580c]">verified_user</span>
              <span>Gate 4 Mandatory Sign-Off • اعتماد بشري إلزامي للأمان والجودة</span>
            </div>
          </div>
        </div>

        {/* 5-Stage Stepper Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="bg-white p-3 rounded-xl border border-[#e5e4de] shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold text-xs">✓</div>
              <div className="flex flex-col truncate">
                <span className="text-[10px] text-[#71717a] font-bold uppercase">01. Spec Agent</span>
                <span className="text-xs text-[#18181b] font-semibold truncate">Passed in 32s</span>
              </div>
            </div>
            <span className="text-emerald-700 text-xs font-bold">PRD ✓</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-[#e5e4de] shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold text-xs">✓</div>
              <div className="flex flex-col truncate">
                <span className="text-[10px] text-[#71717a] font-bold uppercase">02. Design Agent</span>
                <span className="text-xs text-[#18181b] font-semibold truncate">Passed in 41s</span>
              </div>
            </div>
            <span className="text-emerald-700 text-xs font-bold">Figma ✓</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-[#e5e4de] shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold text-xs">✓</div>
              <div className="flex flex-col truncate">
                <span className="text-[10px] text-[#71717a] font-bold uppercase">03. Dev Agent</span>
                <span className="text-xs text-[#18181b] font-semibold truncate">Passed in 58s</span>
              </div>
            </div>
            <span className="text-emerald-700 text-xs font-bold">Build ✓</span>
          </div>

          <div className="bg-orange-50/70 p-3 rounded-xl border-2 border-[#ea580c] shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[#ea580c] text-white flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[16px] animate-pulse">security</span>
              </div>
              <div className="flex flex-col truncate">
                <span className="text-[10px] text-orange-900 uppercase font-extrabold flex items-center gap-1">
                  04. QC & Security
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] animate-ping"></span>
                </span>
                <span className="text-xs text-orange-950 font-bold truncate">Gate 4 Review • فحص الجودة</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-white text-[#ea580c] border border-orange-300 text-[10px] font-extrabold uppercase shadow-xs">Active</span>
          </div>

          <div className="bg-[#f4f3ef] p-3 rounded-xl border border-[#e5e4de] opacity-60 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[#e5e4de] text-[#71717a] flex items-center justify-center text-xs">
                <span className="material-symbols-outlined text-[16px]">lock</span>
              </div>
              <div className="flex flex-col truncate">
                <span className="text-[10px] text-[#71717a] font-bold uppercase">05. Release</span>
                <span className="text-xs text-[#71717a] truncate">Pending Gate 4</span>
              </div>
            </div>
            <span className="text-[#a1a1aa] text-xs">مغلق</span>
          </div>
        </div>
      </div>

      {/* Agent 04 Profile Hero & KPI Chips */}
      <section className="bg-white p-6 rounded-2xl border border-[#e5e4de] shadow-xs flex flex-col gap-5 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#ea580c] to-amber-500 flex items-center justify-center text-white shadow-md">
                <span className="material-symbols-outlined text-[28px]">verified</span>
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[12px] font-bold">done</span>
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-xl font-bold text-[#18181b]">Faris • Lead QC & Security Sentinel Agent</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-xs text-orange-700 font-bold">وكيل الجودة والأمان السيبراني</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 mt-1 font-mono text-xs text-[#71717a]">
                <span className="px-2 py-0.5 rounded bg-[#f4f3ef] border border-[#e5e4de] text-[#4b5563]">Playwright v1.42</span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded bg-[#f4f3ef] border border-[#e5e4de] text-[#4b5563]">OWASP ZAP 2.14</span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded bg-[#f4f3ef] border border-[#e5e4de] text-[#4b5563]">SonarCloud SAST</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Scorecard KPI Chips */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-white border border-[#e5e4de] shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-emerald-600 text-[22px]">checklist</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#71717a] font-semibold uppercase">E2E Tests</span>
              <span className="font-display text-base text-emerald-700 font-bold">38 / 38 Passed</span>
              <span className="text-[11px] text-emerald-600 font-medium">100% Assertion Success</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#e5e4de] shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#ea580c] text-[22px]">shield</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#71717a] font-semibold uppercase">Security Grade</span>
              <span className="font-display text-base text-[#ea580c] font-bold">A+ (Zero Vulns)</span>
              <span className="text-[11px] text-orange-700 font-medium">OWASP Top 10 Sanitized</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#e5e4de] shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f4f3ef] border border-[#e5e4de] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#27272a] text-[22px]">speed</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#71717a] font-semibold uppercase">Perf & A11y</span>
              <span className="font-display text-base text-[#18181b] font-bold">99 / 100</span>
              <span className="text-[11px] text-[#71717a] font-medium">Lighthouse CI Clean</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#e5e4de] shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#ea580c] text-[22px]">verified</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#71717a] font-semibold uppercase">Confidence Index</span>
              <span className="font-display text-base text-[#ea580c] font-bold">99.8% Ready</span>
              <span className="text-[11px] text-orange-700 font-medium">Production Cleared</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main 2-Column Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Left Column (8 Cols): Security Audit Cards */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          <section className="bg-white rounded-2xl border border-[#e5e4de] shadow-xs p-6 space-y-4">
            <h2 className="font-display font-bold text-base text-[#18181b] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ea580c]">security</span>
              <span>Security & Penetration Testing Audit Report</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#f9f8f6] border border-[#e5e4de] space-y-2">
                <strong className="text-sm text-[#18181b] block">OWASP Top 10 & SQLi Fuzzing</strong>
                <p className="text-xs text-[#4b5563]">Zero injection flaws detected across all 8 REST endpoints. Strict Zod schema parameter validation blocked 100% of malicious fuzz payloads.</p>
                <span className="text-emerald-700 text-xs font-bold block pt-1 border-t border-[#e5e4de]">1,420 Vectors Tested • 0 Breaches ✓</span>
              </div>

              <div className="p-4 rounded-xl bg-[#f9f8f6] border border-[#e5e4de] space-y-2">
                <strong className="text-sm text-[#18181b] block">Supabase RLS Tenant Isolation Test</strong>
                <p className="text-xs text-[#4b5563]">Unauthorized query attempt by Tenant B rejected with HTTP 403 Forbidden. Row-Level Security 100% intact.</p>
                <span className="text-emerald-700 text-xs font-bold block pt-1 border-t border-[#e5e4de]">RLS Policy Verified ✓</span>
              </div>
            </div>
          </section>

          {/* Extra Test Assistant */}
          <div className="bg-white p-6 rounded-2xl border border-[#e5e4de] shadow-xs space-y-3">
            <h4 className="font-display font-bold text-sm text-[#18181b]">Want Faris to run an additional test suite before approving?</h4>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={extraAuditInput}
                onChange={(e) => setExtraAuditInput(e.target.value)}
                placeholder="Ask Faris for extra security or QA tests (e.g. 'Test iOS 17 biometric prompt')..."
                className="w-full bg-[#f9f8f6] border border-[#e5e4de] rounded-xl px-3.5 py-2 text-xs text-[#18181b] outline-none"
              />
              <button
                onClick={handleRunExtraAudit}
                className="px-4 py-2 bg-[#ea580c] text-white font-bold text-xs rounded-xl shadow-xs shrink-0 hover:bg-orange-700 cursor-pointer"
              >
                Run Extra Audit with Faris
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (4 Cols): Compliance Matrix */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white p-5 rounded-2xl border border-[#e5e4de] shadow-xs space-y-3 text-xs">
            <h2 className="font-display font-bold text-sm text-[#18181b]">Compliance Matrix</h2>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-[#f9f8f6] border border-[#e5e4de]">
                <strong className="text-[#18181b] block">ZATCA Phase 2 E-Invoicing</strong>
                <span className="text-[#52525b]">ECDSA secp256k1 stamps verified ✓</span>
              </div>
              <div className="p-3 rounded-xl bg-[#f9f8f6] border border-[#e5e4de]">
                <strong className="text-[#18181b] block">Saudi PDPL (حماية البيانات)</strong>
                <span className="text-[#52525b]">AES-256 encryption at rest ✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Mandatory Approval Gate 4 Bar */}
      <div className="fixed bottom-0 left-0 md:left-72 right-0 bg-white/95 backdrop-blur-xl p-4 z-40 border-t border-stone-200 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200 text-[#ea580c] flex items-center justify-center font-bold">
              04
            </div>
            <div>
              <span className="font-display text-sm font-bold text-[#18181b]">
                Human Approval Gate 4: Approve Quality & Security Audit
              </span>
              <p className="text-xs text-[#52525b]">
                Certifies Playwright E2E suites & penetration reports. Unlocks Stage 05 (Badr - Autonomous DevOps Agent).
              </p>
            </div>
          </div>

          <button
            onClick={handleApproveGate4}
            disabled={isApproving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ea580c] to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-extrabold text-xs shadow-lg transition cursor-pointer flex items-center gap-2"
          >
            {isApproving ? 'Unlocking Stage 05...' : 'Approve QC & Unlock Stage 05 (اعتماد الجودة) ➔'}
          </button>
        </div>
      </div>
    </div>
  );
};
