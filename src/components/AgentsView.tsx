import React, { useState } from 'react';
import { useBYOK } from '../context/BYOKContext';

export const AgentsView: React.FC = () => {
  const { setActiveTab, setIsAddProviderOpen } = useBYOK();
  const [factoryMode, setFactoryMode] = useState<'managed' | 'custom'>('managed');
  const [backendAgent, setBackendAgent] = useState('opencode-custom');
  const [backendModel, setBackendModel] = useState('claude-3-5');
  const [backendProvider, setBackendProvider] = useState('anthropic-byok');

  return (
    <div className="flex flex-col w-full pb-16 font-sans text-[#1c212c]">
      {/* Friendly Mode Switcher & Factory State Banner */}
      <div className="relative w-full rounded-3xl bg-white p-6 md:p-8 mb-8 overflow-hidden shadow-sm border border-[#e2d9d2]/60">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-orange-100/60 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-amber-50/80 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col gap-6">
          {/* Header Title & Friendly Badges */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-orange-100 font-bold text-xs text-[#ea580c] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">psychology</span> Architectural Node
                </span>
                <span className="text-[#948374]/40">•</span>
                <span className="text-xs text-[#576071] font-medium">BILINGUAL RUNTIME CORE</span>
              </div>
              <div className="flex items-baseline gap-3 flex-wrap">
                <h1 className="font-display text-3xl font-extrabold text-[#1c212c] tracking-tight">My Factory</h1>
                <span className="font-display text-2xl text-[#576071]/70 font-medium">مصنعي الذكي</span>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs flex items-center gap-1.5 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  10/10 Synthetic Roles Synced
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[#576071] text-xs bg-[#f5f3ef] px-4 py-2 rounded-xl border border-[#e2d9d2]/60">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Factory Engine: <strong className="text-emerald-700 font-bold">100% Online</strong> (Healthy)</span>
            </div>
          </div>

          {/* Friendly Mode Selector: Managed vs Custom */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 rounded-2xl bg-[#f5f3ef] border border-[#e2d9d2]/70">
            <button
              onClick={() => setFactoryMode('managed')}
              className={`flex flex-col items-start p-4 rounded-xl text-left transition-all relative overflow-hidden cursor-pointer ${
                factoryMode === 'managed'
                  ? 'bg-white text-[#1c212c] shadow-sm border border-[#ea580c]/40'
                  : 'text-[#576071] hover:bg-white/80 border border-transparent'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌟</span>
                  <span className="font-display text-lg font-bold text-[#ea580c]">Managed Factory (Automatic)</span>
                  <span className="text-xs text-[#948374] font-medium">(المصنع المدار تلقائياً)</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#ea580c] text-white text-[11px] font-bold shadow-2xs">ACTIVE</span>
              </div>
              <p className="text-xs text-[#576071] leading-relaxed">
                OGroup automatically orchestrates all roles, smart agents, and infrastructure for you. Zero complicated configuration needed!
              </p>
            </button>

            <button
              onClick={() => setFactoryMode('custom')}
              className={`flex flex-col items-start p-4 rounded-xl text-left transition-all cursor-pointer ${
                factoryMode === 'custom'
                  ? 'bg-white text-[#1c212c] shadow-sm border border-[#ea580c]/40'
                  : 'text-[#576071] hover:bg-white/80 border border-transparent'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚙️</span>
                  <span className="font-display text-lg font-bold text-[#1c212c]">Custom Factory (Advanced)</span>
                  <span className="text-xs text-[#948374] font-medium">(المصنع المخصص)</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#eae1da] text-[#576071] text-[11px] font-semibold">Configurable</span>
              </div>
              <p className="text-xs text-[#576071] leading-relaxed">
                Configure custom specialized roles, autonomous agents, models, BYOK encrypted keys, and local air-gapped instances.
              </p>
            </button>
          </div>

          {/* Playful Visual Flow: ROLE -> AGENT -> MODEL -> PROVIDER */}
          <div className="flex flex-col gap-3 bg-[#f5f3ef]/60 rounded-2xl p-4 border border-[#e2d9d2]/60">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ea580c] text-[22px]">account_tree</span>
                <span className="font-bold text-[#1c212c] tracking-wider uppercase text-xs">Ontology Architecture Blueprint</span>
              </div>
              <button
                onClick={() => setActiveTab('studio')}
                className="flex items-center gap-1 text-[#ea580c] hover:text-orange-700 font-bold text-xs transition-colors cursor-pointer"
              >
                <span>Inspect Execution Graph & Telemetry</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            {/* Playful Flow Diagram */}
            <div className="flex items-center gap-2 font-bold text-xs flex-wrap py-1.5">
              <div className="px-3.5 py-2 rounded-xl bg-white border border-[#e2d9d2]/80 text-[#1c212c] flex items-center gap-2 shadow-2xs">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="material-symbols-outlined text-[16px] text-[#ea580c]">badge</span>
                <span>ROLE <span className="text-[#948374] font-normal text-xs">(الوظيفة)</span></span>
              </div>
              <span className="text-[#ea580c] font-bold text-lg">➜</span>
              <div className="px-3.5 py-2 rounded-xl bg-orange-50 border border-orange-200 text-[#ea580c] flex items-center gap-2 shadow-2xs">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                <span className="material-symbols-outlined text-[16px] text-[#ea580c]">smart_toy</span>
                <span>AGENT <span className="text-orange-800/80 font-normal text-xs">(الوكيل البرمجي)</span></span>
              </div>
              <span className="text-[#ea580c] font-bold text-lg">➜</span>
              <div className="px-3.5 py-2 rounded-xl bg-white border border-[#e2d9d2]/80 text-[#1c212c] flex items-center gap-2 shadow-2xs">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-600"></span>
                <span className="material-symbols-outlined text-[16px] text-[#f97316]">psychology</span>
                <span>MODEL <span className="text-[#948374] font-normal text-xs">(نموذج الذكاء)</span></span>
              </div>
              <span className="text-[#ea580c] font-bold text-lg">➜</span>
              <div className="px-3.5 py-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center gap-2 shadow-2xs">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                <span className="material-symbols-outlined text-[16px] text-[#0d9488]">cloud_sync</span>
                <span>PROVIDER / BYOK <span className="text-teal-900/80 font-normal text-xs">(المزود)</span></span>
              </div>
            </div>

            <p className="text-xs text-[#576071] border-t border-[#e2d9d2]/40 pt-2 mt-1">
              <strong className="text-[#1c212c] font-semibold">Strict Separation Architecture:</strong> Roles represent tasks, Agents execute them, Models provide intelligence, and Providers supply the connection.
            </p>
          </div>
        </div>
      </div>

      {/* Telemetry HUD & Cluster Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e2d9d2]/60 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase font-bold text-[#948374]">Factory State</span>
            <span className="font-display text-2xl font-bold text-[#1c212c] mt-1">Autonomous</span>
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 0 Failovers Past 24h
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <span className="material-symbols-outlined text-[24px]">memory</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e2d9d2]/60 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase font-bold text-[#948374]">Total Token Velocity</span>
            <span className="font-display text-2xl font-bold text-[#1c212c] mt-1">2,840 <span className="text-xs text-[#948374]">tok/s</span></span>
            <span className="text-xs text-[#f97316] font-medium">Groq & Anthropic pipelines</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#ea580c]">
            <span className="material-symbols-outlined text-[24px]">speed</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e2d9d2]/60 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase font-bold text-[#948374]">Spend / Monthly Cap</span>
            <span className="font-display text-2xl font-bold text-[#1c212c] mt-1">$48.30 <span className="text-xs text-[#948374]">/ $120</span></span>
            <span className="text-xs text-[#0d9488] font-medium">Circuit Breaker Armed</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#0d9488]">
            <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e2d9d2]/60 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase font-bold text-[#948374]">Active Key Vaults</span>
            <span className="font-display text-2xl font-bold text-[#1c212c] mt-1">6 Providers</span>
            <span className="text-xs text-[#576071] font-medium">AES-256 Air-Gapped + Local</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
            <span className="material-symbols-outlined text-[24px]">vpn_key</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: Configured Workforce Grid */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-[#ea580c]"></span>
          <h2 className="font-display text-2xl font-bold text-[#1c212c]">Configured Workforce Pipeline</h2>
          <span className="text-xs text-[#576071] font-medium">(فريق العمل الهندسي الذاتي)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#948374] font-semibold">10 Specialized Roles</span>
          <button className="px-4 py-1.5 rounded-xl bg-white hover:bg-[#f5f3ef] text-[#1c212c] text-xs font-semibold transition-colors flex items-center gap-1.5 border border-[#e2d9d2]/70 shadow-2xs cursor-pointer">
            <span className="material-symbols-outlined text-[16px] text-[#ea580c]">restart_alt</span>
            <span>Re-balance Workforce</span>
          </button>
        </div>
      </div>

      {/* Workforce Pipeline Rows */}
      <div className="space-y-3 mb-8">
        {/* 01. Product Manager */}
        <div className="bg-white hover:bg-[#f5f3ef]/50 transition-all rounded-2xl p-4 shadow-2xs border border-[#e2d9d2]/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-[260px]">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#ea580c] font-display font-bold text-sm">01</div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-bold text-[#1c212c]">Product Manager</span>
                <span className="text-xs text-[#948374] font-medium">مدير المنتج</span>
              </div>
              <span className="text-xs text-[#948374]">PRD Orchestration, User Story Genesis</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
            <div className="flex flex-col">
              <span className="text-xs text-[#948374] font-semibold">Configured Agent</span>
              <span className="text-xs text-[#ea580c] font-bold">OGroup PM Agent</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#948374] font-semibold">Model Assigned</span>
              <span className="text-xs text-[#1c212c] font-semibold">Claude 3.5 Sonnet</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#948374] font-semibold">Inference Provider</span>
              <span className="text-xs text-[#1c212c] font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Anthropic
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between lg:justify-end gap-4">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Connected & Ready
            </span>
          </div>
        </div>

        {/* 02. Business Analyst */}
        <div className="bg-white hover:bg-[#f5f3ef]/50 transition-all rounded-2xl p-4 shadow-2xs border border-[#e2d9d2]/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-[260px]">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#ea580c] font-display font-bold text-sm">02</div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-bold text-[#1c212c]">Business Analyst</span>
                <span className="text-xs text-[#948374] font-medium">محلل الأعمال</span>
              </div>
              <span className="text-xs text-[#948374]">Functional Spec & Gap Matrix</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
            <div className="flex flex-col">
              <span className="text-xs text-[#948374] font-semibold">Configured Agent</span>
              <span className="text-xs text-[#ea580c] font-bold">OGroup Spec Analyst</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#948374] font-semibold">Model Assigned</span>
              <span className="text-xs text-[#1c212c] font-semibold">GPT-4o</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#948374] font-semibold">Inference Provider</span>
              <span className="text-xs text-[#1c212c] font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> OpenAI
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between lg:justify-end gap-4">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Connected & Ready
            </span>
          </div>
        </div>

        {/* 03. System Architect */}
        <div className="bg-white hover:bg-[#f5f3ef]/50 transition-all rounded-2xl p-4 shadow-2xs border border-[#e2d9d2]/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-[260px]">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#ea580c] font-display font-bold text-sm">03</div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-bold text-[#1c212c]">System Architect</span>
                <span className="text-xs text-[#948374] font-medium">مهندس النظم</span>
              </div>
              <span className="text-xs text-[#948374]">Topology, Schema & Boundaries</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
            <div className="flex flex-col">
              <span className="text-xs text-[#948374] font-semibold">Configured Agent</span>
              <span className="text-xs text-[#ea580c] font-bold">OGroup Architect</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#948374] font-semibold">Model Assigned</span>
              <span className="text-xs text-[#1c212c] font-semibold">Claude 3.5 Sonnet</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#948374] font-semibold">Inference Provider</span>
              <span className="text-xs text-[#1c212c] font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Anthropic
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between lg:justify-end gap-4">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Connected & Ready
            </span>
          </div>
        </div>

        {/* 04. UI/UX Designer */}
        <div className="bg-white hover:bg-[#f5f3ef]/50 transition-all rounded-2xl p-4 shadow-2xs border border-[#e2d9d2]/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-[260px]">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#ea580c] font-display font-bold text-sm">04</div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-bold text-[#1c212c]">UI/UX Designer</span>
                <span className="text-xs text-[#948374] font-medium">مصمم واجهات الاستخدام</span>
              </div>
              <span className="text-xs text-[#948374]">Design Tokens & Component Hierarchies</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
            <div className="flex flex-col">
              <span className="text-xs text-[#948374] font-semibold">Configured Agent</span>
              <span className="text-xs text-[#ea580c] font-bold">OGroup UI Specialist</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#948374] font-semibold">Model Assigned</span>
              <span className="text-xs text-[#1c212c] font-semibold">Gemini 1.5 Pro</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#948374] font-semibold">Inference Provider</span>
              <span className="text-xs text-[#1c212c] font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Google Gemini
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between lg:justify-end gap-4">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Connected & Ready
            </span>
          </div>
        </div>

        {/* 05. Frontend Developer */}
        <div className="bg-white hover:bg-[#f5f3ef]/50 transition-all rounded-2xl p-4 shadow-2xs border border-[#e2d9d2]/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-[260px]">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#ea580c] font-display font-bold text-sm">05</div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-bold text-[#1c212c]">Frontend Developer</span>
                <span className="text-xs text-[#948374] font-medium">مطور الواجهات الأمامية</span>
              </div>
              <span className="text-xs text-[#948374]">Tailwind, React Component Architecture</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
            <div className="flex flex-col">
              <span className="text-xs text-[#948374] font-semibold">Configured Agent</span>
              <span className="text-xs text-[#ea580c] font-bold">OpenCode Agent</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#948374] font-semibold">Model Assigned</span>
              <span className="text-xs text-[#1c212c] font-semibold">Claude 3.5 Sonnet</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#948374] font-semibold">Inference Provider</span>
              <span className="text-xs text-[#1c212c] font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span> Anthropic (BYOK)
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between lg:justify-end gap-4">
            <span className="px-3 py-1 rounded-full bg-orange-50 text-[#ea580c] border border-orange-200 text-xs font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]"></span> Active BYOK
            </span>
          </div>
        </div>

        {/* 06. BACKEND DEVELOPER (EXPANDED HIGHLIGHT CARD) */}
        <div className="rounded-2xl bg-white p-6 shadow-md relative overflow-hidden transition-all border-2 border-orange-300">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#e2d9d2]/40">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#ea580c] text-white flex items-center justify-center font-display font-bold text-base shadow-sm">06</div>
              <div className="flex flex-col">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-display text-xl font-bold text-[#1c212c]">Backend Developer</span>
                  <span className="text-base text-[#576071] font-normal">مطور الخلفية البرمجية</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-[#ea580c] text-xs font-bold uppercase">Configured Sandbox</span>
                </div>
                <span className="text-xs text-[#576071]">API design, event queues, business logic, transaction safety & database routing.</span>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-200 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Dynamic Failover Armed
              </span>
              <span className="px-3 py-1 rounded-full bg-[#f5f3ef] text-[#1c212c] text-xs font-semibold border border-[#e2d9d2]/60">MCP Compliant</span>
            </div>
          </div>

          {/* Configurator Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 bg-[#f5f3ef]/70 rounded-2xl p-4 mt-4 border border-[#e2d9d2]/50">
            {/* Agent Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#ea580c] uppercase flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                1. Autonomous Agent Runtime
              </label>
              <select
                value={backendAgent}
                onChange={(e) => setBackendAgent(e.target.value)}
                className="w-full bg-white text-[#1c212c] font-semibold text-xs py-2.5 px-3.5 rounded-xl outline-none border border-[#e2d9d2]/70 shadow-2xs cursor-pointer"
              >
                <option value="opencode-custom">OpenCode Agent (Customized)</option>
                <option value="ogroup-agent">OGroup Agent</option>
                <option value="mcp-agent">MCP Agent</option>
              </select>
              <span className="text-[11px] text-[#948374]">Autonomous execution harness executing terminal and bash tool calls.</span>
            </div>

            {/* Model Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#f97316] uppercase flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">psychology</span>
                2. Underlying Intelligence Model
              </label>
              <select
                value={backendModel}
                onChange={(e) => setBackendModel(e.target.value)}
                className="w-full bg-white text-[#1c212c] font-semibold text-xs py-2.5 px-3.5 rounded-xl outline-none border border-[#e2d9d2]/70 shadow-2xs cursor-pointer"
              >
                <option value="claude-3-5">Claude 3.5 Sonnet (20241022)</option>
                <option value="gpt-4o">GPT-4o (Omni Native)</option>
                <option value="deepseek-v3">DeepSeek-V3 (671B MoE)</option>
              </select>
              <span className="text-[11px] text-[#948374]">LLM reasoning foundation tokenized per generation step.</span>
            </div>

            {/* Provider Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#0d9488] uppercase flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">cloud_sync</span>
                3. Inference Provider / BYOK
              </label>
              <select
                value={backendProvider}
                onChange={(e) => setBackendProvider(e.target.value)}
                className="w-full bg-white text-[#1c212c] font-semibold text-xs py-2.5 px-3.5 rounded-xl outline-none border border-[#e2d9d2]/70 shadow-2xs cursor-pointer"
              >
                <option value="anthropic-byok">Anthropic API (Direct BYOK Key)</option>
                <option value="groq-lpu">Groq LPU Engine (Sub-100ms)</option>
                <option value="openai-direct">OpenAI Direct Gateway</option>
              </select>
              <span className="text-[11px] text-[#948374]">Network transport layer with encrypted BYOK credential injection.</span>
            </div>
          </div>

          {/* Safeguards */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#e2d9d2]/60 shadow-2xs">
              <span className="material-symbols-outlined text-[#ea580c] text-[20px]">sync_alt</span>
              <div className="flex flex-col text-xs">
                <span className="font-bold text-[#948374]">Fallback Model Policy</span>
                <span className="text-[#1c212c]">If rate-limited, fallback to <strong className="text-teal-700 font-bold">DeepSeek-V3 on Groq</strong></span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#e2d9d2]/60 shadow-2xs">
              <div className="flex items-center gap-3 text-xs">
                <span className="material-symbols-outlined text-emerald-600 text-[20px]">shield</span>
                <div className="flex flex-col">
                  <span className="font-bold text-[#948374]">Spend Limit Safeguard</span>
                  <span className="text-[#1c212c]">$25.00 monthly cap (Auto-freeze circuit breaker)</span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">Auto-Freeze</span>
            </div>
          </div>
        </div>

        {/* 07. Database Engineer */}
        <div className="bg-white hover:bg-[#f5f3ef]/50 transition-all rounded-2xl p-4 shadow-2xs border border-[#e2d9d2]/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-[260px]">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#ea580c] font-display font-bold text-sm">07</div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-bold text-[#1c212c]">Database Engineer</span>
                <span className="text-xs text-[#948374] font-medium">مهندس قواعد البيانات</span>
              </div>
              <span className="text-xs text-[#948374]">PostgreSQL DDL, Vector Indexing & Migrations</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
            <div className="flex flex-col">
              <span className="text-xs text-[#948374] font-semibold">Configured Agent</span>
              <span className="text-xs text-[#ea580c] font-bold">OGroup DB Agent</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#948374] font-semibold">Model Assigned</span>
              <span className="text-xs text-[#1c212c] font-semibold">GPT-4o</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#948374] font-semibold">Inference Provider</span>
              <span className="text-xs text-[#1c212c] font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> OpenAI
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between lg:justify-end gap-4">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Connected & Ready
            </span>
          </div>
        </div>

        {/* 08. QA Engineer */}
        <div className="bg-white hover:bg-[#f5f3ef]/50 transition-all rounded-2xl p-4 shadow-2xs border border-[#e2d9d2]/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-[260px]">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#ea580c] font-display font-bold text-sm">08</div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-bold text-[#1c212c]">QA Engineer</span>
                <span className="text-xs text-[#948374] font-medium">مهندس الجودة والفحص</span>
              </div>
              <span className="text-xs text-[#948374]">E2E Playwright, Unit Tests & Boundary Scenarios</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
            <div className="flex flex-col">
              <span className="text-xs text-[#948374] font-semibold">Configured Agent</span>
              <span className="text-xs text-[#ea580c] font-bold">Sentinel QA Agent</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#948374] font-semibold">Model Assigned</span>
              <span className="text-xs text-[#1c212c] font-semibold">o3-mini</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#948374] font-semibold">Inference Provider</span>
              <span className="text-xs text-[#1c212c] font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> OpenAI
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between lg:justify-end gap-4">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Connected & Ready
            </span>
          </div>
        </div>

        {/* 09. Security Engineer */}
        <div className="bg-white hover:bg-[#f5f3ef]/50 transition-all rounded-2xl p-4 shadow-2xs border border-[#e2d9d2]/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-[260px]">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#ea580c] font-display font-bold text-sm">09</div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-bold text-[#1c212c]">Security Engineer</span>
                <span className="text-xs text-[#948374] font-medium">مهندس أمن المعلومات</span>
              </div>
              <span className="text-xs text-[#948374]">SAST, Secret Leaks, OWASP Top-10 Audit</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
            <div className="flex flex-col">
              <span className="text-xs text-[#948374] font-semibold">Configured Agent</span>
              <span className="text-xs text-[#ea580c] font-bold">OGroup SecOps Agent</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#948374] font-semibold">Model Assigned</span>
              <span className="text-xs text-[#1c212c] font-semibold">Claude 3.5 Sonnet</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#948374] font-semibold">Inference Provider</span>
              <span className="text-xs text-[#1c212c] font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Anthropic
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between lg:justify-end gap-4">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Connected & Ready
            </span>
          </div>
        </div>

        {/* 10. DevOps Engineer */}
        <div className="bg-white hover:bg-[#f5f3ef]/50 transition-all rounded-2xl p-4 shadow-2xs border border-[#e2d9d2]/60 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-[260px]">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#ea580c] font-display font-bold text-sm">10</div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-bold text-[#1c212c]">DevOps Engineer</span>
                <span className="text-xs text-[#948374] font-medium">مهندس النشر والعمليات</span>
              </div>
              <span className="text-xs text-[#948374]">Dockerfiles, CI/CD Actions, Edge CDN Routing</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
            <div className="flex flex-col">
              <span className="text-xs text-[#948374] font-semibold">Configured Agent</span>
              <span className="text-xs text-[#ea580c] font-bold">OGroup Deployer</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#948374] font-semibold">Model Assigned</span>
              <span className="text-xs text-[#1c212c] font-semibold">Gemini 1.5 Flash</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#948374] font-semibold">Inference Provider</span>
              <span className="text-xs text-[#1c212c] font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Google Gemini
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between lg:justify-end gap-4">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Connected & Ready
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: Supported AI Providers & BYOK Vault */}
      <div className="mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#ea580c] text-[24px]">key</span>
            <div className="flex flex-col">
              <h2 className="font-display text-2xl font-bold text-[#1c212c]">Supported AI Providers & BYOK Vault</h2>
              <span className="text-xs text-[#576071] font-medium">Bring Your Own Key (خزنة المفاتيح المشفرة والمزودات السحابية والمحلية)</span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-3 py-1.5 rounded-xl bg-white text-emerald-700 text-xs font-bold flex items-center gap-1.5 border border-[#e2d9d2]/70 shadow-2xs">
              <span>🔒 Encrypted & Safe</span> <span className="text-[#948374] font-normal">(AES-256)</span>
            </span>

            <button
              onClick={() => setIsAddProviderOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#ea580c] hover:bg-orange-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add_moderator</span>
              <span>+ Add Custom Provider / إضافة مزود جديد</span>
            </button>
          </div>
        </div>

        {/* Provider Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: OpenAI */}
          <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all border border-[#e2d9d2]/70 hover:border-orange-200">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f5f3ef] flex items-center justify-center text-[#1c212c] font-bold">
                    <span className="font-display text-sm">OA</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display text-lg font-bold text-[#1c212c]">OpenAI</span>
                    <span className="text-xs text-[#948374]">o3-mini, GPT-4o, GPT-4.5</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-[#ea580c] text-xs font-bold border border-orange-200">BYOK</span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="text-[#948374] font-semibold">Encrypted API Key</label>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">🔒 Safe</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f5f3ef] font-mono text-xs text-[#576071] border border-[#e2d9d2]/60">
                  <span>sk-proj-••••••••49a1</span>
                  <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 flex items-center justify-between text-[#576071] text-xs border-t border-[#e2d9d2]/40">
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Connected
              </span>
              <span className="text-[#948374]">Latency: ~340ms</span>
            </div>
          </div>

          {/* Card 2: Anthropic */}
          <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all border border-[#e2d9d2]/70 hover:border-orange-200">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f5f3ef] flex items-center justify-center text-[#1c212c] font-bold">
                    <span className="font-display text-sm">AN</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display text-lg font-bold text-[#1c212c]">Anthropic</span>
                    <span className="text-xs text-[#948374]">Claude 3.5 Sonnet / Haiku</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-[#ea580c] text-xs font-bold border border-orange-200">BYOK</span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="text-[#948374] font-semibold">Encrypted API Key</label>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">🔒 Safe</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f5f3ef] font-mono text-xs text-[#576071] border border-[#e2d9d2]/60">
                  <span>sk-ant-••••••••3a9f</span>
                  <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 flex items-center justify-between text-[#576071] text-xs border-t border-[#e2d9d2]/40">
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Connected
              </span>
              <span className="text-[#948374]">Latency: ~410ms</span>
            </div>
          </div>

          {/* Card 3: Google Gemini */}
          <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all border border-[#e2d9d2]/70 hover:border-orange-200">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f5f3ef] flex items-center justify-center text-[#1c212c] font-bold">
                    <span className="font-display text-sm">GG</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display text-lg font-bold text-[#1c212c]">Google Gemini</span>
                    <span className="text-xs text-[#948374]">Gemini 1.5 Pro / Flash</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-[#ea580c] text-xs font-bold border border-orange-200">BYOK</span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="text-[#948374] font-semibold">Encrypted API Key</label>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">🔒 Safe</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f5f3ef] font-mono text-xs text-[#576071] border border-[#e2d9d2]/60">
                  <span>AIzaSy••••••••72wQ</span>
                  <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 flex items-center justify-between text-[#576071] text-xs border-t border-[#e2d9d2]/40">
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Connected
              </span>
              <span className="text-[#948374]">Latency: ~280ms</span>
            </div>
          </div>

          {/* Card 4: Groq */}
          <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all border border-[#e2d9d2]/70 hover:border-orange-200">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#ea580c] font-bold">
                    <span className="font-display text-sm">GQ</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display text-lg font-bold text-[#1c212c]">Groq Cloud</span>
                    <span className="text-xs text-[#ea580c] font-bold">Ultra-Low Latency LPU</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-[#0d9488] text-xs font-bold border border-teal-200">BYOK</span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="text-[#948374] font-semibold">Encrypted API Key</label>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">🔒 Safe</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f5f3ef] font-mono text-xs text-[#576071] border border-[#e2d9d2]/60">
                  <span>gsk_••••••••83km</span>
                  <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 flex items-center justify-between text-[#576071] text-xs border-t border-[#e2d9d2]/40">
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active Failover
              </span>
              <span className="text-[#ea580c] font-bold">~85ms (850 tok/s)</span>
            </div>
          </div>

          {/* Card 5: OpenRouter */}
          <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all border border-[#e2d9d2]/70 hover:border-orange-200">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f5f3ef] flex items-center justify-center text-[#1c212c] font-bold">
                    <span className="font-display text-sm">OR</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display text-lg font-bold text-[#1c212c]">OpenRouter</span>
                    <span className="text-xs text-[#948374]">Multi-Model Gateway</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#f5f3ef] text-[#1c212c] text-xs font-semibold">Routing</span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="text-[#948374] font-semibold">Encrypted Key / Topup</label>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">🔒 Safe</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f5f3ef] font-mono text-xs text-[#576071] border border-[#e2d9d2]/60">
                  <span>sk-or-••••••••10ef</span>
                  <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 flex items-center justify-between text-[#576071] text-xs border-t border-[#e2d9d2]/40">
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Connected
              </span>
              <span className="font-semibold text-[#1c212c]">Balance: $18.40</span>
            </div>
          </div>

          {/* Card 6: Ollama / Local Models */}
          <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all border border-[#e2d9d2]/70 hover:border-orange-200">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#0d9488] font-bold">
                    <span className="material-symbols-outlined text-[20px]">terminal</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display text-lg font-bold text-[#1c212c]">Ollama / Local</span>
                    <span className="text-xs text-[#948374]">Air-Gapped Local Inference</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-[#0d9488] text-xs font-bold border border-teal-200">Local Node</span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="text-[#948374] font-semibold">Endpoint Socket</label>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">🔒 100% On-Prem</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f5f3ef] font-mono text-xs text-[#1c212c] border border-[#e2d9d2]/60">
                  <span>http://localhost:11434</span>
                  <span className="material-symbols-outlined text-[18px] text-emerald-600">sensors</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 flex items-center justify-between text-[#576071] text-xs border-t border-[#e2d9d2]/40">
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 32GB VRAM Free
              </span>
              <span className="text-[#948374]">Zero Cloud Egress</span>
            </div>
          </div>

          {/* Card 7: Custom Endpoint */}
          <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all border border-[#e2d9d2]/70 hover:border-orange-200">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#ea580c] font-bold">
                    <span className="material-symbols-outlined text-[20px]">alt_route</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display text-lg font-bold text-[#1c212c]">Custom Endpoint</span>
                    <span className="text-xs text-[#948374]">OpenAI-Spec Proxy / vLLM</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#f5f3ef] text-[#1c212c] text-xs font-semibold">Proxy</span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="text-[#948374] font-semibold">Base URL & Header</label>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">🔒 Safe</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f5f3ef] font-mono text-xs text-[#1c212c] border border-[#e2d9d2]/60">
                  <span className="truncate max-w-[180px]">https://vllm.infra.internal/v1</span>
                  <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 flex items-center justify-between text-[#576071] text-xs border-t border-[#e2d9d2]/40">
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Validated
              </span>
              <span className="text-[#948374]">Auth: Bearer JWT</span>
            </div>
          </div>

          {/* Card 8: Add New Slot */}
          <div
            onClick={() => setIsAddProviderOpen(true)}
            className="rounded-2xl p-5 flex flex-col items-center justify-center text-center hover:bg-orange-50/50 hover:border-orange-300 transition-all cursor-pointer group bg-[#f5f3ef]/50 border-2 border-dashed border-[#e2d9d2]/80"
          >
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#ea580c] group-hover:scale-110 transition-transform mb-3 shadow-sm border border-orange-200">
              <span className="material-symbols-outlined text-[24px]">add</span>
            </div>
            <span className="font-display font-bold text-base text-[#1c212c]">Connect New Inference Provider</span>
            <span className="text-xs text-[#948374] mt-1 max-w-[200px]">DeepInfra, Together AI, Mistral, or Private GPU Cluster</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: Bridge to Advanced Engineering Console */}
      <div className="mt-8 p-6 md:p-8 rounded-3xl bg-white shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 border border-[#e2d9d2]/60">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#ea580c] flex items-center justify-center shrink-0 border border-orange-200">
            <span className="material-symbols-outlined text-[28px]">terminal</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="font-display text-2xl font-bold text-[#1c212c]">Advanced Engineering Console</h3>
              <span className="text-xs text-[#576071] font-medium">(غرفة التحكم الهندسي والتشغيل اللحظي)</span>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center gap-1.5 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> LIVE STREAM
              </span>
            </div>
            <p className="text-sm text-[#576071] mt-1.5 max-w-3xl leading-relaxed">
              Reserved for developers and engineering teams to inspect execution graphs, AST code validation, step-by-step diff validation, token-per-second waterfalls, and raw MCP socket packets.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('studio')}
          className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-[#ea580c] hover:bg-orange-700 text-white font-bold text-sm transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <span>Launch Engineering Console</span>
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
