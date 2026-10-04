import React, { useState } from 'react';
import { useBYOK } from '../context/BYOKContext';

export const Gate2DesignReviewView: React.FC = () => {
  const { setActiveTab, setCurrentGateStep } = useBYOK();
  const [activeScreen, setActiveScreen] = useState<number>(1);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isApproved, setIsApproved] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [tweakInput, setTweakInput] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [inspectMode, setInspectMode] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  const handleApplyTweak = (text: string) => {
    setTweakInput(text);
  };

  const handleSubmitTweak = () => {
    if (!tweakInput.trim()) {
      showToast('Please type or select a design tweak first.');
      return;
    }
    showToast(`Layla (Designer Agent) is processing: "${tweakInput}". Re-rendering prototype in 3s...`);
    setTweakInput('');
  };

  const handleRequestChanges = () => {
    const reason = prompt('Enter specific design change request for Layla (UI/UX Agent):', 'Adjust mobile signature pad button width');
    if (reason) {
      showToast(`Revision request dispatched to Agent 02: "${reason}"`);
    }
  };

  const handleApproveGate2 = () => {
    if (isApproved) {
      setCurrentGateStep('gate3');
      return;
    }
    setIsApproving(true);
    setTimeout(() => {
      setIsApproving(false);
      setIsApproved(true);
      showToast('✅ Gate 2 Approved! Unlocking Stage 03: Developer Agent & Code Review...');
      setTimeout(() => {
        setCurrentGateStep('gate3');
      }, 600);
    }, 800);
  };

  // Viewport width styling
  const getViewportStyle = () => {
    if (viewportMode === 'tablet') return 'max-w-[768px] mx-auto';
    if (viewportMode === 'mobile') return 'max-w-[390px] mx-auto';
    return 'w-full';
  };

  return (
    <div className="flex flex-col w-full pb-32 font-sans text-[#1f242e] bg-[#f8f7f5] min-h-screen">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-8 bg-white border-2 border-[#ea580c] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-[#1f242e] z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="material-symbols-outlined text-[#ea580c] text-[24px]">verified</span>
          <div>
            <p className="font-display font-bold text-sm text-[#ea580c]">Gate 2 Update</p>
            <p className="text-xs text-[#554336]">{toastMsg}</p>
          </div>
        </div>
      )}

      {/* Top Ambient Glow & Meta Strip */}
      <div className="relative w-full pt-4 pb-6">
        <div className="absolute -top-10 left-1/3 w-96 h-32 bg-orange-200/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-2 right-10 w-72 h-24 bg-teal-200/30 rounded-full blur-2xl pointer-events-none"></div>

        {/* Top Meta Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-200/80 text-[#1f242e]">
              <span className="text-[11px] font-mono text-[#887364] font-bold">PROJECT</span>
              <span className="font-display text-sm font-bold text-[#ea580c]">PRJ-8842</span>
              <span className="text-stone-400">/</span>
              <span className="font-display text-sm font-bold text-[#1f242e]">VaultSign OS</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-[#ea580c] font-bold">
                Bilingual v1.2
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-[#554336] text-xs font-semibold">
              <span className="material-symbols-outlined text-[16px] text-teal-600">verified</span>
              <span>Spec handoff verified from Stage 1</span>
            </div>
          </div>

          {/* Human Gate 2 Badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-orange-100/70 text-[#ea580c] shadow-2xs border border-orange-200">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ea580c] animate-ping"></span>
            <span className="material-symbols-outlined text-[18px]">gavel</span>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 leading-tight">
              <span className="font-display text-xs font-bold text-[#1f242e]">Gate 2 Mandatory Approval</span>
              <span className="text-[11px] font-bold text-[#ea580c]">اعتماد بشري إلزامي للواجهات</span>
            </div>
          </div>
        </div>

        {/* Pipeline 5-Stage Stepper */}
        <div className="w-full bg-white p-4 rounded-2xl shadow-xs border border-stone-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {/* Step 1: Passed */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 transition-all border border-emerald-200/60">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold shrink-0">
                <span className="material-symbols-outlined text-[18px]">check</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-mono text-[#887364] font-bold">01. PRODUCT SPEC</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                </div>
                <span className="font-display text-xs font-bold text-[#1f242e] truncate">Gate 1 Passed ✓</span>
                <span className="text-[10px] text-[#887364]">تم اعتماد المواصفات</span>
              </div>
            </div>

            {/* Step 2: Active */}
            <div className={`flex items-center gap-3 p-3 rounded-xl transition-all border-2 ${
              isApproved 
                ? 'bg-emerald-50 border-emerald-400' 
                : 'bg-orange-50/70 border-[#ea580c] shadow-sm'
            }`}>
              <div className={`w-8 h-8 rounded-lg text-white flex items-center justify-center font-bold shrink-0 shadow-sm ${
                isApproved ? 'bg-emerald-600' : 'bg-[#ea580c]'
              }`}>
                <span className="material-symbols-outlined text-[18px]">
                  {isApproved ? 'check' : 'brush'}
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-mono font-bold ${isApproved ? 'text-emerald-700' : 'text-[#ea580c]'}`}>
                    02. UI/UX DESIGN
                  </span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                    isApproved ? 'bg-emerald-200 text-emerald-800' : 'bg-[#ea580c] text-white'
                  }`}>
                    {isApproved ? 'APPROVED' : 'ACTIVE'}
                  </span>
                </div>
                <span className="font-display text-xs font-bold text-[#1f242e] truncate">
                  {isApproved ? 'Gate 2 Passed ✓' : 'Gate 2 Pending'}
                </span>
                <span className="text-[10px] text-[#554336]">
                  {isApproved ? 'تم اعتماد الواجهات' : 'بانتظار موافقتك'}
                </span>
              </div>
            </div>

            {/* Step 3: Locked or Unlocked */}
            <div className={`flex items-center gap-3 p-3 rounded-xl transition-all border ${
              isApproved ? 'bg-orange-50 border-[#ea580c]' : 'bg-stone-50 opacity-60 border-stone-200'
            }`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0 ${
                isApproved ? 'bg-[#ea580c] text-white' : 'bg-stone-200 text-stone-500'
              }`}>
                <span className="material-symbols-outlined text-[18px]">
                  {isApproved ? 'code' : 'lock'}
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-mono text-[#887364] font-bold">03. DEV AGENT</span>
                <span className="font-display text-xs font-bold text-[#1f242e] truncate">
                  {isApproved ? 'Full-Stack Coding' : 'Full-Stack Code'}
                </span>
                <span className="text-[10px] text-[#887364]">
                  {isApproved ? 'جاري البرمجة الآن' : 'مغلق حتى الاعتماد'}
                </span>
              </div>
            </div>

            {/* Step 4: Locked */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 opacity-60 border border-stone-200">
              <div className="w-8 h-8 rounded-lg bg-stone-200 text-stone-500 flex items-center justify-center font-bold shrink-0">
                <span className="material-symbols-outlined text-[18px]">lock</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-mono text-[#887364] font-bold">04. QC & SECURITY</span>
                <span className="font-display text-xs font-semibold text-[#1f242e] truncate">Security Audit</span>
                <span className="text-[10px] text-[#887364]">فحص الأمان التلقائي</span>
              </div>
            </div>

            {/* Step 5: Locked */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 opacity-60 border border-stone-200">
              <div className="w-8 h-8 rounded-lg bg-stone-200 text-stone-500 flex items-center justify-center font-bold shrink-0">
                <span className="material-symbols-outlined text-[18px]">lock</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-mono text-[#887364] font-bold">05. DEPLOYMENT</span>
                <span className="font-display text-xs font-semibold text-[#1f242e] truncate">Global Edge Release</span>
                <span className="text-[10px] text-[#887364]">الإطلاق السحابي</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agent 02 Bio & Synthesis Header */}
      <section className="mb-6">
        <div className="bg-white p-6 rounded-3xl shadow-xs border border-stone-200 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#ea580c] to-amber-500 flex items-center justify-center text-white shadow-md">
                  <span className="material-symbols-outlined text-[28px]">palette</span>
                </div>
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-teal-600 flex items-center justify-center text-white text-[11px] font-bold">
                  ✓
                </span>
              </div>

              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-xl font-bold text-[#1f242e]">
                    Layla • UI/UX Designer Agent
                  </h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-100 text-[#ea580c] font-bold">
                    وكيل التصميم والواجهات
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 font-mono font-bold">
                    Stitch AI Adapter v3.1
                  </span>
                </div>
                <p className="text-xs md:text-sm text-[#554336] mt-1 font-medium">
                  Generated 4 production-ready responsive screens, unified atomic design tokens (60-30-10 ratio), and WCAG AAA interactive prototypes in 41 seconds.
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-2.5 text-xs text-[#554336]">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#ea580c]">speed</span>
                    <span>Execution: <strong className="text-[#1f242e]">41.2s</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-teal-600">check_circle</span>
                    <span>Confidence: <strong className="text-[#1f242e]">99.1%</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-amber-600">token</span>
                    <span>Tokens mapped: <strong className="text-[#1f242e]">148 nodes</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metric Badges */}
            <div className="flex items-center gap-3 self-start lg:self-center shrink-0">
              <div className="px-4 py-2 rounded-2xl bg-stone-50 border border-stone-200 text-center">
                <span className="font-display text-lg font-bold text-[#ea580c] block">100%</span>
                <span className="text-[10px] text-[#887364] uppercase font-bold">WCAG Contrast</span>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-stone-50 border border-stone-200 text-center">
                <span className="font-display text-lg font-bold text-teal-700 block">4 Screens</span>
                <span className="text-[10px] text-[#887364] uppercase font-bold">Ready for React</span>
              </div>
            </div>
          </div>

          {/* Synthesis Trail Pills */}
          <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] font-mono text-[#887364] font-bold uppercase">Synthesis Trail:</span>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 text-[#1f242e] font-medium shadow-2xs">
              <span className="material-symbols-outlined text-[14px] text-teal-600">task_alt</span>
              <span>1. PRD Spatial Mapping</span>
            </div>
            <span className="text-stone-300">→</span>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 text-[#1f242e] font-medium shadow-2xs">
              <span className="material-symbols-outlined text-[14px] text-teal-600">task_alt</span>
              <span>2. 60-30-10 Token Engine</span>
            </div>
            <span className="text-stone-300">→</span>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 text-[#1f242e] font-medium shadow-2xs">
              <span className="material-symbols-outlined text-[14px] text-teal-600">task_alt</span>
              <span>3. Hi-Fi Layout Rigging</span>
            </div>
            <span className="text-stone-300">→</span>
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-white font-medium shadow-2xs ${
              isApproved ? 'bg-teal-600' : 'bg-[#ea580c]'
            }`}>
              <span className="material-symbols-outlined text-[14px]">
                {isApproved ? 'verified' : 'refresh'}
              </span>
              <span>{isApproved ? '4. Gate 2 Approved ✓' : '4. Gate 2 Human Verification'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main 12-Col Split Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Hi-Fi Prototype Canvas (8 Cols) */}
        <div className="xl:col-span-8 flex flex-col gap-4">
          {/* Tabs & Viewport Switcher */}
          <div className="bg-white p-3 rounded-2xl shadow-xs border border-stone-200 flex flex-wrap items-center justify-between gap-3">
            {/* Screen Tabs */}
            <div className="flex flex-wrap items-center gap-1">
              <button
                onClick={() => setActiveScreen(1)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeScreen === 1
                    ? 'bg-[#ea580c] text-white shadow-sm'
                    : 'hover:bg-stone-100 text-[#1f242e]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">folder_shared</span>
                <span>1. Document Vault</span>
              </button>

              <button
                onClick={() => setActiveScreen(2)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeScreen === 2
                    ? 'bg-[#ea580c] text-white shadow-sm'
                    : 'hover:bg-stone-100 text-[#1f242e]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">fingerprint</span>
                <span>2. Digital Sign & OTP</span>
              </button>

              <button
                onClick={() => setActiveScreen(3)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeScreen === 3
                    ? 'bg-[#ea580c] text-white shadow-sm'
                    : 'hover:bg-stone-100 text-[#1f242e]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">history_edu</span>
                <span>3. Audit Trail</span>
              </button>

              <button
                onClick={() => setActiveScreen(4)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeScreen === 4
                    ? 'bg-[#ea580c] text-white shadow-sm'
                    : 'hover:bg-stone-100 text-[#1f242e]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>4. WhatsApp Dispatch</span>
              </button>
            </div>

            {/* Viewport Toggles & Inspect */}
            <div className="flex items-center gap-2">
              <div className="flex items-center p-1 rounded-xl bg-stone-100 border border-stone-200">
                <button
                  onClick={() => setViewportMode('desktop')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                    viewportMode === 'desktop' ? 'bg-white text-[#ea580c] shadow-2xs' : 'text-[#887364]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">desktop_windows</span>
                  <span className="hidden sm:inline">1440px</span>
                </button>
                <button
                  onClick={() => setViewportMode('tablet')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                    viewportMode === 'tablet' ? 'bg-white text-[#ea580c] shadow-2xs' : 'text-[#887364]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">tablet_mac</span>
                  <span className="hidden sm:inline">Tablet</span>
                </button>
                <button
                  onClick={() => setViewportMode('mobile')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                    viewportMode === 'mobile' ? 'bg-white text-[#ea580c] shadow-2xs' : 'text-[#887364]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">smartphone</span>
                  <span className="hidden sm:inline">390px</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setInspectMode(!inspectMode);
                  showToast(inspectMode ? 'Live Inspector Disabled' : 'Live Inspector Active: Design nodes and spatial tokens highlighted.');
                }}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition cursor-pointer ${
                  inspectMode ? 'bg-[#ea580c] text-white shadow-sm' : 'bg-stone-100 hover:bg-stone-200 text-[#1f242e]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                <span>{inspectMode ? 'Inspecting' : 'Inspect Live'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Mockup Canvas Container */}
          <div className="w-full bg-stone-200/50 p-4 sm:p-6 rounded-3xl min-h-[560px] flex justify-center transition-all">
            <div className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${getViewportStyle()}`}>
              {/* Chrome Header Bar */}
              <div className="h-10 bg-stone-100 px-4 flex items-center justify-between border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                  <span className="ml-3 font-mono text-[11px] text-[#887364]">vaultsign.ogroup.internal/app/vault</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[10px] text-[#554336] font-bold bg-white px-2 py-0.5 rounded border border-stone-200">
                    Active Locale: English / العربية
                  </span>
                  <span className="material-symbols-outlined text-[#887364] text-[16px]">security</span>
                </div>
              </div>

              {/* SCREEN 1: Document Vault */}
              {activeScreen === 1 && (
                <div className="p-6 flex flex-col gap-5 animate-in fade-in duration-200">
                  {/* Mockup Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-lg text-[#1f242e]">خزينة العقود الذكية • VaultSign</span>
                        <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold">KSA Compliant</span>
                      </div>
                      <p className="text-xs text-[#554336] mt-0.5 font-medium">Manage, sign, and seal high-security digital documents with biometric audit trail.</p>
                    </div>
                    <button
                      onClick={() => showToast('Opening contract upload modal...')}
                      className="px-4 py-2 rounded-xl bg-[#ea580c] hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">upload_file</span>
                      <span>Upload Contract (رفع وثيقة)</span>
                    </button>
                  </div>

                  {/* Mockup Stat Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-[#887364] font-bold uppercase">Active Documents</span>
                        <span className="font-display text-2xl font-bold text-[#1f242e] block mt-1">128</span>
                        <span className="text-xs text-teal-700 font-semibold">12 awaiting signature</span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined text-[22px]">description</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-[#887364] font-bold uppercase">Verified Signers</span>
                        <span className="font-display text-2xl font-bold text-[#1f242e] block mt-1">1,402</span>
                        <span className="text-xs text-[#ea580c] font-semibold">Via Nafath & OTP</span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#ea580c] flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined text-[22px]">how_to_reg</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-[#887364] font-bold uppercase">Tamper Integrity</span>
                        <span className="font-display text-2xl font-bold text-[#1f242e] block mt-1">100%</span>
                        <span className="text-xs text-teal-700 font-semibold">SHA-256 Ledger Locked</span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                        <span className="material-symbols-outlined text-[22px]">verified_user</span>
                      </div>
                    </div>
                  </div>

                  {/* Documents Table */}
                  <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
                    <div className="p-4 bg-stone-50 flex flex-wrap items-center justify-between gap-3 border-b border-stone-200">
                      <div className="flex items-center gap-2 flex-1 max-w-sm bg-white px-3 py-1.5 rounded-xl border border-stone-200">
                        <span className="material-symbols-outlined text-stone-400 text-[18px]">search</span>
                        <input className="bg-transparent text-xs text-[#1f242e] outline-none w-full placeholder:text-stone-400 font-medium" placeholder="Search by party, ID or title..." readOnly />
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-[#887364] font-semibold">Filter:</span>
                        <span className="px-2.5 py-1 rounded-lg bg-white text-[#1f242e] font-bold shadow-2xs border border-stone-200">All Contracts</span>
                        <span className="px-2.5 py-1 rounded-lg text-[#554336] hover:bg-stone-100 font-semibold cursor-pointer">Requires OTP (3)</span>
                      </div>
                    </div>

                    <div className="divide-y divide-stone-100">
                      {/* Row 1 */}
                      <div className="p-4 flex flex-wrap items-center justify-between gap-3 hover:bg-orange-50/40 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#ea580c] flex items-center justify-center font-bold">
                            <span className="material-symbols-outlined text-[20px]">assignment</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-display font-bold text-sm text-[#1f242e]">عقد توريد تقني • Aramco Services Master Agreement</span>
                              <span className="px-2 py-0.5 rounded-full bg-orange-100 text-[#ea580c] text-[10px] font-bold">Needs My Signature</span>
                            </div>
                            <span className="text-xs text-[#887364]">Signers: Tariq A. (OGroup), Khalid M. (Saudi Aramco) • Expires in 2 days</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[11px] text-[#887364]">SHA-256: 4f98...d81a</span>
                          <button
                            onClick={() => setActiveScreen(2)}
                            className="px-3.5 py-1.5 rounded-lg bg-[#ea580c] text-white text-xs font-bold shadow-xs hover:bg-orange-700 cursor-pointer"
                          >
                            Sign Now (توقيع)
                          </button>
                        </div>
                      </div>

                      {/* Row 2 */}
                      <div className="p-4 flex flex-wrap items-center justify-between gap-3 hover:bg-stone-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                            <span className="material-symbols-outlined text-[20px]">verified</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-display font-bold text-sm text-[#1f242e]">اتفاقية سرية المعلومات (Bilingual NDA)</span>
                              <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">Signed & Verified ✓</span>
                            </div>
                            <span className="text-xs text-[#887364]">Fully executed with Biometric OTP stamp • 3 Signatures</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[11px] text-[#887364]">ZATCA Stamp #4401</span>
                          <button
                            onClick={() => setActiveScreen(3)}
                            className="px-3.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-[#1f242e] text-xs font-semibold cursor-pointer"
                          >
                            Download Certificate
                          </button>
                        </div>
                      </div>

                      {/* Row 3 */}
                      <div className="p-4 flex flex-wrap items-center justify-between gap-3 hover:bg-stone-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-600 flex items-center justify-center font-bold">
                            <span className="material-symbols-outlined text-[20px]">history_toggle_off</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-display font-bold text-sm text-[#1f242e]">عرض شراء أصول وتراخيص سحابية</span>
                              <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-bold">Pending Counterparty</span>
                            </div>
                            <span className="text-xs text-[#887364]">Dispatched via WhatsApp Interactive Notification to +966 50 *** 9912</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[11px] text-[#887364]">Sent 42m ago</span>
                          <button
                            onClick={() => setActiveScreen(4)}
                            className="px-3.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-[#1f242e] text-xs font-semibold cursor-pointer"
                          >
                            Resend Reminder
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SCREEN 2: Digital Sign & OTP Modal */}
              {activeScreen === 2 && (
                <div className="p-8 flex flex-col items-center justify-center min-h-[460px] animate-in fade-in duration-200">
                  <div className="max-w-md w-full bg-stone-50 p-6 rounded-3xl border border-stone-200 shadow-md text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-orange-100 text-[#ea580c] mx-auto flex items-center justify-center">
                      <span className="material-symbols-outlined text-[32px]">fingerprint</span>
                    </div>
                    <div>
                      <h3 className="font-display font-extrabold text-xl text-[#1f242e]">Nafath Biometric Signature</h3>
                      <p className="text-xs text-[#887364] mt-0.5">المصادقة والتوقيع الرقمي عبر نفاذ الوطني</p>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-stone-200 text-center shadow-2xs">
                      <span className="text-[10px] text-[#887364] font-bold uppercase block mb-1">Open Nafath App & Select Code</span>
                      <span className="font-display text-4xl font-extrabold text-[#ea580c] tracking-widest block">74</span>
                      <span className="text-xs text-teal-700 font-bold mt-1 block">Listening for Biometric Handshake... (01:48)</span>
                    </div>

                    <div className="space-y-2 text-xs text-left bg-white p-3 rounded-xl border border-stone-200">
                      <div className="flex justify-between text-[#887364]">
                        <span>Certificate Authority</span>
                        <strong className="text-[#1f242e]">Saudi Trust TSP</strong>
                      </div>
                      <div className="flex justify-between text-[#887364]">
                        <span>Signer National ID</span>
                        <strong className="text-[#1f242e]">1088*****2</strong>
                      </div>
                      <div className="flex justify-between text-[#887364]">
                        <span>Document Hash</span>
                        <strong className="font-mono text-[#ea580c]">#e3b0c442...</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        showToast('Document sealed with biometric signature certificate!');
                        setActiveScreen(3);
                      }}
                      className="w-full py-3 rounded-xl bg-[#ea580c] hover:bg-orange-700 text-white font-extrabold text-xs shadow-md transition cursor-pointer"
                    >
                      Confirm & Seal Document
                    </button>
                  </div>
                </div>
              )}

              {/* SCREEN 3: Audit Trail */}
              {activeScreen === 3 && (
                <div className="p-6 flex flex-col gap-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <div>
                      <h3 className="font-display font-bold text-lg text-[#1f242e]">Cryptographic Audit Certificate</h3>
                      <p className="text-xs text-[#887364]">سجل التدقيق الجنائي غير القابل للتعديل</p>
                    </div>
                    <span className="px-3 py-1 rounded-xl bg-teal-100 text-teal-800 font-bold text-xs">Immutable Ledger</span>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-4 text-xs">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-teal-600 text-[20px] mt-0.5">verified</span>
                      <div>
                        <strong className="text-[#1f242e] block">Document Created & Initialized</strong>
                        <span className="text-[#887364]">Tariq A. • IP 212.118.14.92 • Riyadh, KSA • 14:02:11 UTC</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-teal-600 text-[20px] mt-0.5">verified</span>
                      <div>
                        <strong className="text-[#1f242e] block">WhatsApp Notification Delivered</strong>
                        <span className="text-[#887364]">Meta Business Cloud API • Delivery Receipt #99812-D</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-[#ea580c] text-[20px] mt-0.5">fingerprint</span>
                      <div>
                        <strong className="text-[#1f242e] block">Biometric Signature Affixed</strong>
                        <span className="text-[#887364]">National ID Verified • Certificate X.509 RSA 4096-bit</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SCREEN 4: WhatsApp Dispatch */}
              {activeScreen === 4 && (
                <div className="p-8 flex flex-col items-center justify-center min-h-[460px] animate-in fade-in duration-200">
                  <div className="w-full max-w-sm bg-stone-50 p-4 rounded-3xl border border-stone-200 shadow-md space-y-3">
                    <div className="bg-teal-700 text-white px-4 py-3 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-xs">
                        <span className="material-symbols-outlined text-[20px]">chat</span>
                        <span>VaultSign Verified Bot</span>
                      </div>
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-stone-200 text-xs space-y-3 shadow-2xs">
                      <p className="font-bold text-[#ea580c]">عزيزي الشريك، أرسل لك طارق وثيقة جديدة للتوقيع الرقمي.</p>
                      <p className="text-[#554336] leading-relaxed">
                        يرجى النقر على الرابط المشفر أدناه للمراجعة والاعتماد خلال 24 ساعة بموجب نظام التعاملات الإلكترونية السعودي.
                      </p>

                      <div className="p-2.5 rounded-xl bg-stone-50 font-mono text-[11px] text-[#887364]">
                        🔒 Document: Master_Services_v1.2.pdf<br />
                        Security Code: 994-012
                      </div>

                      <button
                        onClick={() => {
                          showToast('Redirecting to secure document signing workspace...');
                          setActiveScreen(2);
                        }}
                        className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                      >
                        Open Secure Vault (فتح المستند)
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Design Specifications & Token Matrix Panel (4 Cols) */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          {/* Token Matrix Card */}
          <div className="bg-white p-6 rounded-3xl shadow-xs border border-stone-200 space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ea580c] text-[22px]">category</span>
                <h3 className="font-display font-bold text-base text-[#1f242e]">Design System Matrix</h3>
              </div>
            </div>

            {/* 60-30-10 Color Harmony Display */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#1f242e] font-bold">Color Distribution</span>
                <span className="text-[#887364] font-semibold">100% Calibrated</span>
              </div>

              {/* Visual Stacked Bar */}
              <div className="h-3 w-full rounded-full overflow-hidden flex shadow-2xs">
                <div className="h-full bg-[#fff8f5] w-[60%] border-r border-stone-200" title="60% Surface Base"></div>
                <div className="h-full bg-[#1f1b17] w-[30%]" title="30% Deep Charcoal Type"></div>
                <div className="h-full bg-[#ea580c] w-[10%]" title="10% Amber Accent"></div>
              </div>

              {/* Swatches Breakdown */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
                <div className="p-2 rounded-xl bg-stone-50 border border-stone-200 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#fff8f5] border border-stone-300 shadow-2xs"></span>
                    <span className="font-bold text-[11px] text-[#1f242e]">60% Base</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#887364]">Cream #FFF8F5</span>
                </div>

                <div className="p-2 rounded-xl bg-stone-50 border border-stone-200 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#1f1b17] shadow-2xs"></span>
                    <span className="font-bold text-[11px] text-[#1f242e]">30% Type</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#887364]">Charcoal #1F1B17</span>
                </div>

                <div className="p-2 rounded-xl bg-stone-50 border border-stone-200 flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#ea580c] shadow-2xs"></span>
                    <span className="font-bold text-[11px] text-[#1f242e]">10% Callout</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#ea580c] font-bold">Amber #EA580C</span>
                </div>
              </div>
            </div>

            {/* Typography Hierarchy */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2.5 text-xs">
              <span className="text-[10px] font-mono text-[#887364] font-bold uppercase block">Typography Rig</span>

              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-[#1f242e] block">Outfit (English)</strong>
                  <span className="text-[#887364]">Headlines, stats, CTA triggers</span>
                </div>
                <span className="font-mono text-[#ea580c] font-bold text-[11px]">Weights: 600, 700</span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-stone-200/60">
                <div>
                  <strong className="text-[#1f242e] block">IBM Plex Sans Arabic</strong>
                  <span className="text-[#887364]">العناوين والنصوص العربية المعتمدة</span>
                </div>
                <span className="font-mono text-[#ea580c] font-bold text-[11px]">Weights: 400, 600</span>
              </div>
            </div>

            {/* Gate 2 Validation Audit Checklist */}
            <div className="space-y-3 pt-2">
              <h4 className="font-display font-bold text-sm text-[#1f242e]">Gate 2 Validation Audit</h4>
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#ea580c] accent-[#ea580c]" />
                  <span className="font-semibold text-[#1f242e]">User flow mapped against Stage 1 PRD specs</span>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#ea580c] accent-[#ea580c]" />
                  <span className="font-semibold text-[#1f242e]">Bilingual typography & RTL spacing validated</span>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#ea580c] accent-[#ea580c]" />
                  <span className="font-semibold text-[#1f242e]">Color contrast compliant with WCAG AAA</span>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-[#ea580c] accent-[#ea580c]" />
                  <span className="font-semibold text-[#1f242e]">Design tokens formatted for React 19 / Tailwind</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pre-Approval Design Revision / Co-Pilot Bar */}
      <section className="mt-8">
        <div className="bg-white p-6 rounded-3xl shadow-xs border border-stone-200 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#ea580c] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[20px]">tune</span>
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-[#1f242e]">
                  Want to tweak the design before approving?
                </h4>
                <p className="text-xs text-[#887364]">
                  هل ترغب بتعديل أي لمسة تصميمية؟ وكيل التصميم جاهز لإعادة التوليد الفوري
                </p>
              </div>
            </div>
            <span className="text-xs text-[#887364] font-medium">Revision Cycle 1 of 3</span>
          </div>

          {/* Quick 1-Click Revision Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleApplyTweak('Switch Accent to Deep Navy')}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#1f242e] text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px] text-[#ea580c]">format_paint</span>
              <span>Switch Accent to Deep Navy</span>
            </button>

            <button
              onClick={() => handleApplyTweak('Enlarge Arabic Body Text (+2px)')}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#1f242e] text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px] text-[#ea580c]">text_increase</span>
              <span>Enlarge Arabic Body Text (+2px)</span>
            </button>

            <button
              onClick={() => handleApplyTweak('Increase Card Curvature (24px radius)')}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#1f242e] text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px] text-[#ea580c]">rounded_corner</span>
              <span>Increase Card Curvature (24px)</span>
            </button>

            <button
              onClick={() => handleApplyTweak('Render Dark Mode Preview')}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#1f242e] text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px] text-[#ea580c]">dark_mode</span>
              <span>Render Dark Mode Preview</span>
            </button>
          </div>

          {/* Revision Prompt Input */}
          <div className="relative w-full flex items-center bg-stone-50 rounded-2xl p-2 border border-stone-200">
            <span className="material-symbols-outlined text-stone-400 pl-3 text-[20px]">edit_note</span>
            <input
              type="text"
              value={tweakInput}
              onChange={(e) => setTweakInput(e.target.value)}
              placeholder="Type custom design prompt (e.g., 'Make the sign button full width with WhatsApp green highlight')..."
              className="w-full bg-transparent text-xs text-[#1f242e] px-3 py-2 outline-none placeholder:text-stone-400 font-medium"
            />
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleSubmitTweak}
                className="px-4 py-2 rounded-xl bg-[#ea580c] hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                <span>Tweak with Layla</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Human Approval Gate 2 Action Bar */}
      <div className="fixed bottom-0 left-0 md:left-72 right-0 bg-white/95 backdrop-blur-xl p-4 z-40 border-t border-stone-200 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Gate Notice Text */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#ea580c] flex items-center justify-center shrink-0 font-bold">
              <span className="material-symbols-outlined text-[22px]">verified_user</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-sm font-bold text-[#1f242e]">
                Human Approval Gate 2: Ready to lock UI & begin coding
              </span>
              <span className="text-xs text-[#554336]">
                By approving, you authorize <strong className="text-[#1f242e]">03. Developer Agent</strong> (React 19 + Fastify Backend) to compile components into production code.
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={handleRequestChanges}
              className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#1f242e] font-bold text-xs transition cursor-pointer"
            >
              Request Changes (طلب تعديل)
            </button>

            <button
              onClick={handleApproveGate2}
              disabled={isApproving}
              className={`px-6 py-2.5 rounded-xl text-white font-extrabold text-xs shadow-lg transition cursor-pointer flex items-center gap-2 ${
                isApproved 
                  ? 'bg-teal-600 hover:bg-teal-700' 
                  : 'bg-gradient-to-r from-[#ea580c] to-amber-500 hover:from-orange-700 hover:to-amber-600'
              }`}
            >
              {isApproving ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                  <span>Authorizing Dev Agent...</span>
                </>
              ) : isApproved ? (
                <>
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Proceed to Gate 3 / Stage 03 ➔</span>
                </>
              ) : (
                <>
                  <span>Approve Design & Unlock Stage 03</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
