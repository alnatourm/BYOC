import React, { useState } from 'react';
import { useBYOK } from '../context/BYOKContext';

export const AgentsView: React.FC = () => {
  const { setActiveTab, setIsAddProviderOpen } = useBYOK();
  const [factoryMode, setFactoryMode] = useState<'managed' | 'custom'>('managed');

  return (
    <div className="flex flex-col w-full pb-16 font-sans text-[#1c212c]">
      {/* Mode Switcher & Factory State Banner */}
      <div className="relative w-full rounded-3xl bg-white p-6 md:p-8 mb-8 overflow-hidden shadow-sm border border-[#e2d9d2]/60">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-orange-100/60 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-orange-100 font-bold text-xs text-[#ea580c] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">psychology</span> Architectural Pipeline
                </span>
                <span className="text-[#948374]/40">•</span>
                <span className="text-xs text-[#576071] font-medium">BILINGUAL RUNTIME CORE</span>
              </div>
              <div className="flex items-baseline gap-3 flex-wrap">
                <h1 className="font-display text-3xl font-extrabold text-[#1c212c] tracking-tight">My Factory</h1>
                <span className="font-display text-2xl text-[#576071]/70 font-medium">مصنعي الذكي</span>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs flex items-center gap-1.5 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  5/5 Consolidated Agents Synced
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[#576071] text-xs bg-[#f5f3ef] px-4 py-2 rounded-xl border border-[#e2d9d2]/60">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Factory Engine: <strong className="text-emerald-700 font-bold">100% Online</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 rounded-2xl bg-[#f5f3ef] border border-[#e2d9d2]/70">
            <button
              onClick={() => setFactoryMode('managed')}
              className={`flex flex-col items-start p-4 rounded-xl text-left transition-all relative cursor-pointer ${
                factoryMode === 'managed'
                  ? 'bg-white text-[#1c212c] shadow-sm border border-[#ea580c]/40'
                  : 'text-[#576071] hover:bg-white/80 border border-transparent'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌟</span>
                  <span className="font-display text-lg font-bold text-[#ea580c]">Managed Factory (Automatic)</span>
                </div>
                {factoryMode === 'managed' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-[#ea580c] font-extrabold text-[10px]">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-[#576071]">
                All 5 agents run automatically with pre-connected models & 4 Human Approval Gates.
              </p>
            </button>

            <button
              onClick={() => setFactoryMode('custom')}
              className={`flex flex-col items-start p-4 rounded-xl text-left transition-all relative cursor-pointer ${
                factoryMode === 'custom'
                  ? 'bg-white text-[#1c212c] shadow-sm border border-[#ea580c]/40'
                  : 'text-[#576071] hover:bg-white/80 border border-transparent'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔑</span>
                  <span className="font-display text-lg font-bold text-[#1c212c]">Connect Custom AI / BYOK</span>
                </div>
                {factoryMode === 'custom' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-[#576071]">
                Connect custom API keys to any of the 5 factory pipeline agents.
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Consolidated Factory Pipeline Agents & 4 Approval Gates */}
      <div className="space-y-4 mb-8">
        {/* Stage 01: Product & Spec */}
        <div className="space-y-2">
          <div className="bg-white hover:bg-[#f5f3ef]/50 transition-all rounded-2xl p-5 shadow-2xs border border-[#e2d9d2]/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-[280px]">
              <div className="w-11 h-11 rounded-xl bg-[#ea580c] flex items-center justify-center text-white font-display font-black text-base shadow-sm">01</div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg font-bold text-[#1c212c]">Product & Spec Agent</span>
                  <span className="text-xs text-[#948374] font-medium">المنتج والمواصفات</span>
                </div>
                <span className="text-xs text-[#576071]">Merges PM + Spec Analyst + System Architect; drafts PostgreSQL data model</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
              <div className="flex flex-col">
                <span className="text-xs text-[#948374] font-semibold">Configured Agent</span>
                <span className="text-xs text-[#ea580c] font-bold">01. Product & Spec Agent</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#948374] font-semibold">Model Assigned</span>
                <span className="text-xs text-[#1c212c] font-semibold">Claude 3.5 Sonnet</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#948374] font-semibold">Inference Provider</span>
                <span className="text-xs text-[#1c212c] font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Anthropic Claude
                </span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Connected & Ready
            </span>
          </div>

          {/* Gate 1 */}
          <div className="px-6 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 flex items-center justify-between text-xs text-[#1c212c] font-bold">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#ea580c]">verified_user</span>
              <span>Human Approval Gate 1: You approve the spec & data model / اعتماد المواصفات والنموذج</span>
            </div>
            <span className="text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded font-mono text-[10px]">GATE 1 READY</span>
          </div>
        </div>

        {/* Stage 02: Designer */}
        <div className="space-y-2">
          <div className="bg-white hover:bg-[#f5f3ef]/50 transition-all rounded-2xl p-5 shadow-2xs border border-[#e2d9d2]/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-[280px]">
              <div className="w-11 h-11 rounded-xl bg-[#2563eb] flex items-center justify-center text-white font-display font-black text-base shadow-sm">02</div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg font-bold text-[#1c212c]">Designer Agent</span>
                  <span className="text-xs text-[#948374] font-medium">المصمم (Google Stitch)</span>
                </div>
                <span className="text-xs text-[#576071]">Google Stitch AI Canvas Adapter & design system token synthesis</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
              <div className="flex flex-col">
                <span className="text-xs text-[#948374] font-semibold">Configured Agent</span>
                <span className="text-xs text-[#2563eb] font-bold">02. Designer Agent</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#948374] font-semibold">Model Assigned</span>
                <span className="text-xs text-[#1c212c] font-semibold">Stitch Design 2.5 Pro</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#948374] font-semibold">Inference Provider</span>
                <span className="text-xs text-[#1c212c] font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Google Stitch AI
                </span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Connected & Ready
            </span>
          </div>

          {/* Gate 2 */}
          <div className="px-6 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 flex items-center justify-between text-xs text-[#1c212c] font-bold">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#2563eb]">palette</span>
              <span>Human Approval Gate 2: You approve the Google Stitch UI design / اعتماد التصميم</span>
            </div>
            <span className="text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded font-mono text-[10px]">GATE 2 READY</span>
          </div>
        </div>

        {/* Stage 03: Developer */}
        <div className="bg-white hover:bg-[#f5f3ef]/50 transition-all rounded-2xl p-5 shadow-2xs border border-[#e2d9d2]/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-[280px]">
            <div className="w-11 h-11 rounded-xl bg-purple-600 flex items-center justify-center text-white font-display font-black text-base shadow-sm">03</div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-bold text-[#1c212c]">Developer Agent</span>
                <span className="text-xs text-[#948374] font-medium">المطور الشامل</span>
              </div>
              <span className="text-xs text-[#576071]">Merges Frontend + Backend + Database; writes into unified repository branch</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
            <div className="flex flex-col">
              <span className="text-xs text-[#948374] font-semibold">Configured Agent</span>
              <span className="text-xs text-purple-700 font-bold">03. Developer Agent</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#948374] font-semibold">Model Assigned</span>
              <span className="text-xs text-[#1c212c] font-semibold">Claude 3.5 Sonnet</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#948374] font-semibold">Inference Provider</span>
              <span className="text-xs text-[#1c212c] font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Anthropic Claude
              </span>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Connected & Ready
          </span>
        </div>

        {/* Stage 04: QC */}
        <div className="space-y-2">
          <div className="bg-white hover:bg-[#f5f3ef]/50 transition-all rounded-2xl p-5 shadow-2xs border border-[#e2d9d2]/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-[280px]">
              <div className="w-11 h-11 rounded-xl bg-teal-600 flex items-center justify-center text-white font-display font-black text-base shadow-sm">04</div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg font-bold text-[#1c212c]">QC Agent</span>
                  <span className="text-xs text-[#948374] font-medium">جودة وأمان البرمجيات</span>
                </div>
                <span className="text-xs text-[#576071]">Merges QA Testing + SAST Security Auditor; issues 98%+ Quality Scorecard</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
              <div className="flex flex-col">
                <span className="text-xs text-[#948374] font-semibold">Configured Agent</span>
                <span className="text-xs text-teal-700 font-bold">04. QC Agent</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#948374] font-semibold">Model Assigned</span>
                <span className="text-xs text-[#1c212c] font-semibold">GPT-4o</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#948374] font-semibold">Inference Provider</span>
                <span className="text-xs text-[#1c212c] font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> OpenAI Enterprise
                </span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Connected & Ready
            </span>
          </div>

          {/* Gate 3 */}
          <div className="px-6 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 flex items-center justify-between text-xs text-[#1c212c] font-bold">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-teal-700">fact_check</span>
              <span>Human Approval Gate 3: You approve the code result & QC audit / اعتماد نتيجة الفحص والجودة</span>
            </div>
            <span className="text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded font-mono text-[10px]">GATE 3 READY</span>
          </div>
        </div>

        {/* Stage 05: Release */}
        <div className="space-y-2">
          <div className="bg-white hover:bg-[#f5f3ef]/50 transition-all rounded-2xl p-5 shadow-2xs border border-[#e2d9d2]/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-[280px]">
              <div className="w-11 h-11 rounded-xl bg-stone-800 flex items-center justify-center text-white font-display font-black text-base shadow-sm">05</div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg font-bold text-[#1c212c]">Release Agent</span>
                  <span className="text-xs text-[#948374] font-medium">الإطلاق والتدشين</span>
                </div>
                <span className="text-xs text-[#576071]">DevOps + Release Dossier Signoff + SHA-256 Checksum, then live deploy</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
              <div className="flex flex-col">
                <span className="text-xs text-[#948374] font-semibold">Configured Agent</span>
                <span className="text-xs text-stone-900 font-bold">05. Release Agent</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#948374] font-semibold">Model Assigned</span>
                <span className="text-xs text-[#1c212c] font-semibold">Gemini 1.5 Pro</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#948374] font-semibold">Inference Provider</span>
                <span className="text-xs text-[#1c212c] font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Google Gemini AI
                </span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Connected & Ready
            </span>
          </div>

          {/* Gate 4 */}
          <div className="px-6 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-300 flex items-center justify-between text-xs text-[#1c212c] font-bold shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-emerald-700">rocket_launch</span>
              <span>Human Approval Gate 4: You approve the release & live deployment / اعتماد التدشين النهائي</span>
            </div>
            <span className="text-emerald-800 bg-emerald-200/80 px-2.5 py-0.5 rounded font-mono text-[10px]">FINAL RELEASE GATE</span>
          </div>
        </div>
      </div>

      {/* Supported AI Providers & BYOK Vault */}
      <div className="mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#ea580c] text-[24px]">key</span>
            <div className="flex flex-col">
              <h2 className="font-display text-2xl font-bold text-[#1c212c]">Supported AI Providers & BYOK Vault</h2>
              <span className="text-xs text-[#576071] font-medium">Bring Your Own Key (خزنة المفاتيح المشفرة والمزودات السحابية والمحلية)</span>
            </div>
          </div>

          <button
            onClick={() => setIsAddProviderOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#ea580c] hover:bg-orange-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer self-start"
          >
            <span className="material-symbols-outlined text-[18px]">add_moderator</span>
            <span>+ Add Custom Provider</span>
          </button>
        </div>
      </div>
    </div>
  );
};
