import React, { useState } from 'react';
import { useBYOK } from '../context/BYOKContext';

export const Gate1SpecReviewView: React.FC = () => {
  const { setCurrentGateStep, selectedArtifact } = useBYOK();
  const [activePrdTab, setActivePrdTab] = useState<'epics' | 'summary' | 'boundaries'>('epics');
  const [schemaMode, setSchemaMode] = useState<'plain' | 'ddl'>('plain');
  const [showReasoning, setShowReasoning] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [tweakInput, setTweakInput] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  // Dynamic Prompt Classification
  const promptDesc = selectedArtifact?.description || selectedArtifact?.title || 'build a salon booking app for my saloon colors gold and white name sameer saloon';
  const isSalonPrompt = promptDesc.toLowerCase().includes('sal') || 
                        promptDesc.toLowerCase().includes('hair') || 
                        promptDesc.toLowerCase().includes('barber') || 
                        promptDesc.toLowerCase().includes('sameer');
  
  const isCarPrompt = !isSalonPrompt && (promptDesc.toLowerCase().includes('car') || promptDesc.toLowerCase().includes('vehicle'));

  // Theme Accent Color
  const themeColor = isSalonPrompt ? '#d97706' : isCarPrompt ? '#dc2626' : '#ea580c';
  const themeBgLight = isSalonPrompt ? 'bg-amber-50' : isCarPrompt ? 'bg-red-50' : 'bg-orange-50';
  const themeBorder = isSalonPrompt ? 'border-amber-200' : isCarPrompt ? 'border-red-200' : 'border-orange-200';
  const themeBadge = isSalonPrompt ? 'bg-amber-100 text-amber-900' : isCarPrompt ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-900';

  const appTitle = isSalonPrompt ? 'Sameer Saloon • Salon Booking App' : isCarPrompt ? 'Car Agency Dealership Portal' : selectedArtifact?.title || 'Custom AI Software';

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  const handleApplyTweak = (text: string) => {
    if (tweakInput) {
      setTweakInput((prev) => prev + ' + ' + text);
    } else {
      setTweakInput(text);
    }
  };

  const handleUpdateSpec = () => {
    if (!tweakInput.trim()) {
      showToast('Please enter or select a specification adjustment first.');
      return;
    }
    showToast(`Spec updated with instructions: "${tweakInput}". Agent 01 re-indexed PRD.`);
    setTweakInput('');
  };

  const handleToggleVoice = () => {
    setIsRecordingVoice(!isRecordingVoice);
    if (!isRecordingVoice) {
      showToast('Listening to voice instructions in Arabic/English...');
      setTimeout(() => {
        setTweakInput('[Voice Note 0:12s]: "Enforce Gold & White theme styling for Sameer Saloon UI."');
        setIsRecordingVoice(false);
      }, 2500);
    }
  };

  const handleOpenApprovalModal = () => {
    setShowConfirmationModal(true);
  };

  const handleConfirmGate1Handoff = () => {
    setIsApproving(true);
    setTimeout(() => {
      setIsApproving(false);
      setShowConfirmationModal(false);
      showToast(`🎉 Gate 1 Approved! ${appTitle} Specification locked. Handing off to Agent 02: Google Stitch Designer...`);
      setTimeout(() => {
        setCurrentGateStep('gate2');
      }, 600);
    }, 800);
  };

  return (
    <div className="flex flex-col w-full pb-32 font-sans text-[#1f242e] bg-[#f8f7f5] min-h-screen">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-8 bg-white border-2 border-[#d97706] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-[#1f242e] z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="material-symbols-outlined text-[#d97706] text-[24px]">content_cut</span>
          <div>
            <p className="font-display font-bold text-sm text-[#d97706]">Gate 1 Spec Update</p>
            <p className="text-xs text-stone-600">{toastMsg}</p>
          </div>
        </div>
      )}

      {/* Pipeline Tracker Banner */}
      <section className="w-full pb-6 pt-2">
        <div className="bg-white rounded-2xl shadow-xs p-6 border border-stone-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#d97706] animate-pulse"></span>
              <h2 className="font-display text-lg font-bold text-[#1f242e] tracking-tight">
                Software Delivery Pipeline{' '}
                <span className="text-[#d97706] font-semibold text-sm">
                  (PRJ-8842: {appTitle})
                </span>
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 text-[#554336] text-xs font-semibold">
              <span className="material-symbols-outlined text-[16px] text-[#d97706]">verified_user</span>
              <span>Human Approval Gate on Every Stage</span>
              <span className="text-stone-300">/</span>
              <span>اعتماد بشري إلزامي في كل مرحلة</span>
            </div>
          </div>

          {/* 5-Stage Stepper Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-4">
            {/* Stage 1: Active */}
            <div className="relative bg-amber-50/80 border-2 border-[#d97706] rounded-xl p-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-[#d97706] font-bold text-[11px]">
                  01 • ACTIVE
                </span>
                <span className="material-symbols-outlined text-[#d97706] text-[20px]">content_cut</span>
              </div>
              <div className="pt-2">
                <p className="font-display text-xs font-bold text-[#1f242e]">Product & Spec</p>
                <p className="text-[11px] text-stone-600">
                  {isSalonPrompt ? 'محلل مواصفات صالون سمير' : 'محلل المواصفات ومعمارية النظام'}
                </p>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[#d97706] text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d97706] animate-ping"></span>
                <span>Gate 1 Pending</span>
              </div>
            </div>

            {/* Stage 2: Locked */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 opacity-70">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-stone-200 text-stone-600 text-[11px]">02 • LOCKED</span>
                <span className="material-symbols-outlined text-stone-400 text-[18px]">palette</span>
              </div>
              <div className="pt-2">
                <p className="font-display text-xs font-semibold text-[#1f242e]">UI/UX Designer</p>
                <p className="text-[11px] text-stone-500">
                  {isSalonPrompt ? 'تصميم باللونين الذهبي والأبيض' : 'نماذج الواجهات الذكية'}
                </p>
              </div>
              <div className="mt-2 flex items-center gap-1 text-stone-400 text-xs">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                <span>Requires Gate 1</span>
              </div>
            </div>

            {/* Stage 3: Locked */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 opacity-70">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-stone-200 text-stone-600 text-[11px]">03 • LOCKED</span>
                <span className="material-symbols-outlined text-stone-400 text-[18px]">terminal</span>
              </div>
              <div className="pt-2">
                <p className="font-display text-xs font-semibold text-[#1f242e]">Dev Full-Stack</p>
                <p className="text-[11px] text-stone-500">المبرمج React 19 + APIs</p>
              </div>
              <div className="mt-2 flex items-center gap-1 text-stone-400 text-xs">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                <span>Awaiting Stage 2</span>
              </div>
            </div>

            {/* Stage 4: Locked */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 opacity-70">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-stone-200 text-stone-600 text-[11px]">04 • LOCKED</span>
                <span className="material-symbols-outlined text-stone-400 text-[18px]">verified</span>
              </div>
              <div className="pt-2">
                <p className="font-display text-xs font-semibold text-[#1f242e]">QC & Security</p>
                <p className="text-[11px] text-stone-500">فحص الأمان وضمان الجودة</p>
              </div>
              <div className="mt-2 flex items-center gap-1 text-stone-400 text-xs">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                <span>98%+ Target Pass</span>
              </div>
            </div>

            {/* Stage 5: Locked */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 opacity-70">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-stone-200 text-stone-600 text-[11px]">05 • LOCKED</span>
                <span className="material-symbols-outlined text-stone-400 text-[18px]">cloud_done</span>
              </div>
              <div className="pt-2">
                <p className="font-display text-xs font-semibold text-[#1f242e]">Release & Deploy</p>
                <p className="text-[11px] text-stone-500">الإطلاق السحابي المباشر</p>
              </div>
              <div className="mt-2 flex items-center gap-1 text-stone-400 text-xs">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                <span>SHA-256 Bundle</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agent 01 Header & Synthesizer Identity Card */}
      <section className="w-full pb-6">
        <div className="bg-white rounded-2xl shadow-xs p-6 border border-stone-200 relative overflow-hidden space-y-4">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#d97706] to-amber-500 flex items-center justify-center text-white shadow-md shrink-0 font-bold text-xl">
                01
              </div>
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#d97706]">Agent 01</span>
                  <span className="text-stone-300">•</span>
                  <h1 className="font-display text-xl text-[#1f242e] font-bold">Product & Spec Agent</h1>
                  <span className="text-xs text-stone-600 font-medium">
                    ({isSalonPrompt ? 'محلل مواصفات صالون سمير' : 'محلل المواصفات ومعمارية النظام'})
                  </span>
                </div>
                <p className="text-xs md:text-sm text-stone-600 mt-1 font-medium">
                  Synthesized <span className="font-bold text-[#1f242e]">14 User Stories</span>, <span className="font-bold text-[#1f242e]">4 Core Epics</span>, {isSalonPrompt ? 'Gold (#d97706) & White Theme Guidelines' : 'Design Tokens'}, and a complete <span className="font-bold text-[#1f242e]">{isSalonPrompt ? 'Sameer Saloon PostgreSQL Schema' : 'PostgreSQL Schema'}</span> in 18 seconds.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
              <div className="px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d97706] animate-ping"></span>
                <div className="flex flex-col">
                  <span className="font-bold text-xs text-[#d97706]">Ready for Gate 1 Approval</span>
                  <span className="text-[10px] text-stone-600">المواصفات جاهزة بانتظار اعتمادك</span>
                </div>
              </div>
              <button
                onClick={() => setShowReasoning(!showReasoning)}
                className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#1f242e] text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-[#d97706]">terminal</span>
                <span>AI Reasoning Trail (4 steps)</span>
              </button>
            </div>
          </div>

          {/* Expandable Reasoning Log */}
          {showReasoning && (
            <div className="mt-4 pt-4 border-t border-stone-100 bg-stone-50 rounded-xl p-4 flex flex-col gap-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs text-stone-600 pb-1">
                <span className="font-bold text-[#1f242e]">Agent Inference Trail for Sameer Saloon:</span>
                <span>Execution time: 18.42s • Confidence: 99.8%</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white rounded-lg border border-stone-200">
                  <p className="font-bold text-[#d97706]">1. Salon Intent Parsing</p>
                  <p className="text-stone-600 mt-1">Parsed brief: Grooming service menu, Barber shift slot picker, Gold & White luxury theme.</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-stone-200">
                  <p className="font-bold text-[#d97706]">2. Role-Based Access (RBAC)</p>
                  <p className="text-stone-600 mt-1">Actors: Salon Admin (Sameer), Stylist/Barber, Client (Booker).</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-stone-200">
                  <p className="font-bold text-[#d97706]">3. Relational Schema</p>
                  <p className="text-stone-600 mt-1">Designed `services`, `stylists`, `appointments`, `whatsapp_reminders`, `zatca_receipts`.</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-stone-200">
                  <p className="font-bold text-[#d97706]">4. Gate 1 Handoff</p>
                  <p className="text-stone-600 mt-1">Configured Google Stitch UI tokens with Gold (#d97706) primary & Crisp White (#ffffff) canvas.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Stage 1 Inspection & Deliverables Workspace (Asymmetric Layout) */}
      <section className="w-full grid grid-cols-1 xl:grid-cols-12 gap-6 pb-6">
        {/* Left Column: PRD & Executive Spec (7 Cols) */}
        <div className="xl:col-span-7 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-xs p-6 border border-stone-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#d97706] text-[22px]">content_cut</span>
                <div>
                  <h3 className="font-display font-bold text-base text-[#1f242e]">
                    {isSalonPrompt ? 'Sameer Saloon PRD & Feature Spec' : 'Generated PRD & Feature Spec'}
                  </h3>
                  <p className="text-xs text-stone-600">متطلبات صالون سمير وحجوزات المواعيد</p>
                </div>
              </div>

              {/* Tab Buttons */}
              <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setActivePrdTab('epics')}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    activePrdTab === 'epics' ? 'bg-white text-[#1f242e] shadow-2xs' : 'text-stone-600'
                  }`}
                >
                  Core Epics (4)
                </button>
                <button
                  onClick={() => setActivePrdTab('summary')}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    activePrdTab === 'summary' ? 'bg-white text-[#1f242e] shadow-2xs' : 'text-stone-600'
                  }`}
                >
                  Executive Scope
                </button>
                <button
                  onClick={() => setActivePrdTab('boundaries')}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    activePrdTab === 'boundaries' ? 'bg-white text-[#1f242e] shadow-2xs' : 'text-stone-600'
                  }`}
                >
                  Boundaries (حدود)
                </button>
              </div>
            </div>

            {/* Non-Tech Friendly Explainer Banner */}
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 text-xs">
              <span className="material-symbols-outlined text-[#d97706] text-[20px] shrink-0 mt-0.5">lightbulb</span>
              <div className="text-[#1f242e] leading-relaxed">
                <span className="font-bold">Sameer Saloon Brief Match:</span> Custom grooming services catalog, barber slot picker, WhatsApp booking reminders, and luxury Gold & White visual theme.
                <span className="block text-stone-600 text-[11px] mt-0.5" dir="rtl">تطبيق متكامل لصالون سمير بحجوزات المواعيد وتذكير الواتساب وتصميم باللونين الذهبي والأبيض.</span>
              </div>
            </div>

            {/* Tab Content 1: Core Epics Checklist */}
            {activePrdTab === 'epics' && (
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-[#d97706] bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  User Brief: "{promptDesc}"
                </p>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-stone-200 text-[#d97706] flex items-center justify-center font-bold text-xs">E1</span>
                      <div>
                        <h4 className="font-display text-xs font-bold text-[#1f242e]">Haircut & Grooming Service Menu</h4>
                        <p className="text-[11px] text-stone-600">قائمة خدمات العناية والشعر واللحية والأسعار</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-[#d97706] text-xs font-bold">Ready • جاهز</span>
                  </div>
                  <div className="pl-9 space-y-1 text-xs text-[#1f242e]">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-teal-600 text-[16px]">check_circle</span>
                      <span>User Story 1.1: Service catalog (Haircut, Beard Trim, Royal Package) with price SAR & duration mins.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-teal-600 text-[16px]">check_circle</span>
                      <span>User Story 1.2: Luxury Gold (#d97706) & Crisp White (#ffffff) responsive card design.</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-stone-200 text-[#d97706] flex items-center justify-center font-bold text-xs">E2</span>
                      <div>
                        <h4 className="font-display text-xs font-bold text-[#1f242e]">Barber Specialist & Slot Booking Engine</h4>
                        <p className="text-[11px] text-stone-600">اختيار الحلاق المفضل وتحديد وقت الحجز</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-[#d97706] text-xs font-bold">Ready • جاهز</span>
                  </div>
                  <div className="pl-9 space-y-1 text-xs text-[#1f242e]">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-teal-600 text-[16px]">check_circle</span>
                      <span>User Story 2.1: Select preferred stylist (Master Sameer, Barber Ahmed) and available time slot.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-teal-600 text-[16px]">check_circle</span>
                      <span>User Story 2.2: Instant slot reservation with client contact number verification.</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-stone-200 text-[#d97706] flex items-center justify-center font-bold text-xs">E3</span>
                      <div>
                        <h4 className="font-display text-xs font-bold text-[#1f242e]">WhatsApp Booking Confirmation & Reminders</h4>
                        <p className="text-[11px] text-stone-600">تأكيد الموعد والتذكير الآلي عبر الواتساب</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-[#d97706] text-xs font-bold">Ready • جاهز</span>
                  </div>
                  <div className="pl-9 space-y-1 text-xs text-[#1f242e]">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-teal-600 text-[16px]">check_circle</span>
                      <span>User Story 3.1: WhatsApp Cloud API webhook dispatching appointment ticket to client.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-teal-600 text-[16px]">check_circle</span>
                      <span>User Story 3.2: Automated 2-hour pre-appointment nudge reminder.</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-stone-200 text-[#d97706] flex items-center justify-center font-bold text-xs">E4</span>
                      <div>
                        <h4 className="font-display text-xs font-bold text-[#1f242e]">Gold & White Design Tokens & ZATCA Receipt</h4>
                        <p className="text-[11px] text-stone-600">نظام ألوان صالون سمير وحساب ضريبة القيمة المضافة</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-[#d97706] text-xs font-bold">Ready • جاهز</span>
                  </div>
                  <div className="pl-9 space-y-1 text-xs text-[#1f242e]">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-teal-600 text-[16px]">check_circle</span>
                      <span>User Story 4.1: Google Stitch design tokens set to `#d97706` Luxury Gold & `#ffffff` White.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePrdTab === 'summary' && (
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2 text-[#1f242e]">
                <strong className="text-sm font-bold block text-[#1f242e]">Executive Target</strong>
                <p className="text-stone-600 leading-relaxed">
                  Provides Sameer Saloon customers with a frictionless appointment booking experience, while providing Sameer and stylists with a real-time calendar and WhatsApp reminder engine.
                </p>
              </div>
            )}

            {activePrdTab === 'boundaries' && (
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2 text-[#1f242e]">
                <strong className="text-sm font-bold text-red-600 block">Explicit Non-Goals for Version 1.0 (ما لا يفعله النظام الآن)</strong>
                <ul className="space-y-1 text-stone-600">
                  <li>• No home delivery hair products store in initial release.</li>
                  <li>• No custom mobile app required (runs smoothly as PWA in browser).</li>
                </ul>
              </div>
            )}
          </div>

          {/* Human Feedback & Voice/Text Tweak Tool */}
          <div className="bg-white rounded-2xl shadow-xs p-6 border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#d97706] text-[22px]">tune</span>
                <div>
                  <h3 className="font-display text-xs font-bold text-[#1f242e]">Want to adjust anything before approving?</h3>
                  <p className="text-[11px] text-stone-600">هل ترغب بتعديل أي تفصيل في مواصفات صالون سمير قبل الاعتماد؟</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 text-xs font-semibold">Co-Pilot Ready</span>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleApplyTweak('Add VIP Private Grooming Room selection')}
                className="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-[#1f242e] text-xs flex items-center gap-1 transition cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px] text-[#d97706]">add</span>
                <span>Add VIP Private Grooming Room selection</span>
              </button>

              <button
                onClick={() => handleApplyTweak('Add SMS reminder 1 hour prior to appointment')}
                className="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-[#1f242e] text-xs flex items-center gap-1 transition cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px] text-[#d97706]">add</span>
                <span>Add SMS reminder 1 hour prior</span>
              </button>

              <button
                onClick={() => handleApplyTweak('Add Mada & Apple Pay online deposit')}
                className="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-[#1f242e] text-xs flex items-center gap-1 transition cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px] text-[#d97706]">add</span>
                <span>Add Mada & Apple Pay online deposit</span>
              </button>
            </div>

            {/* Chat / Voice Input Box */}
            <div className="relative bg-stone-50 rounded-xl p-3 border border-stone-200 space-y-2">
              <textarea
                value={tweakInput}
                onChange={(e) => setTweakInput(e.target.value)}
                placeholder="Type changes for Agent 01, or record your voice instructions (e.g. 'Add extra slot on Friday after Jumaa prayer')..."
                rows={2}
                className="w-full bg-transparent border-0 text-[#1f242e] placeholder-stone-400 text-xs focus:outline-none resize-none"
              />
              <div className="flex items-center justify-between pt-1 border-t border-stone-200">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleVoice}
                    className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                      isRecordingVoice ? 'text-red-600 bg-red-50 animate-pulse' : 'text-stone-600 hover:text-[#d97706]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">mic</span>
                    <span>{isRecordingVoice ? 'Listening...' : 'Voice note'}</span>
                  </button>
                  <span className="text-stone-300">|</span>
                  <span className="text-[11px] text-stone-500">Auto-merges into Spec</span>
                </div>

                <button
                  onClick={handleUpdateSpec}
                  className="px-4 py-1.5 rounded-lg bg-[#d97706] hover:bg-amber-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <span>Update Spec</span>
                  <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive PostgreSQL Data Model (5 Cols) */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-xs p-6 border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#d97706] text-[22px]">database</span>
                <div>
                  <h3 className="font-display font-bold text-base text-[#1f242e]">Sameer Saloon Schema</h3>
                  <p className="text-xs text-stone-600">جداول الخدمات والحجوزات والحلاقين</p>
                </div>
              </div>

              {/* Toggle: Plain English vs DDL Code */}
              <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setSchemaMode('plain')}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    schemaMode === 'plain' ? 'bg-white text-[#1f242e] shadow-2xs' : 'text-stone-600'
                  }`}
                >
                  Plain
                </button>
                <button
                  onClick={() => setSchemaMode('ddl')}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    schemaMode === 'ddl' ? 'bg-white text-[#1f242e] shadow-2xs' : 'text-stone-600'
                  }`}
                >
                  SQL DDL
                </button>
              </div>
            </div>

            {/* Entity Diagram Metric Chips */}
            <div className="grid grid-cols-3 gap-2 py-1 text-center">
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-display text-lg font-bold text-[#d97706] block">5</span>
                <p className="text-[10px] text-stone-600 uppercase font-bold">Core Tables</p>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-display text-lg font-bold text-teal-700 block">11</span>
                <p className="text-[10px] text-stone-600 uppercase font-bold">Foreign Keys</p>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-display text-lg font-bold text-[#1f242e] block">100%</span>
                <p className="text-[10px] text-stone-600 uppercase font-bold">RLS Enabled</p>
              </div>
            </div>

            {/* Friendly Schema View */}
            {schemaMode === 'plain' && (
              <div className="flex flex-col gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#1f242e]">services</span>
                    <span className="text-[11px] text-stone-500">قائمة خدمات الصالون</span>
                  </div>
                  <p className="text-stone-600">Haircut, beard styling, pricing SAR, and duration in minutes.</p>
                  <div className="flex flex-wrap gap-1 font-mono text-[10px] pt-1">
                    <span className="px-1.5 py-0.5 rounded bg-white border border-stone-200 font-bold text-[#d97706]">id: uuid (PK)</span>
                    <span className="px-1.5 py-0.5 rounded bg-white border border-stone-200 font-bold text-emerald-700">price_sar: numeric</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#1f242e]">stylists</span>
                    <span className="text-[11px] text-stone-500">فريق الحلاقين الخبراء</span>
                  </div>
                  <p className="text-stone-600">Master Sameer, Ahmed, Youssef, specialty & shift hours.</p>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#1f242e]">appointments</span>
                    <span className="text-[11px] text-stone-500">جدول الحجوزات</span>
                  </div>
                  <p className="text-stone-600">Customer name, phone, booking date/time, and status (`confirmed`/`completed`).</p>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#1f242e]">whatsapp_logs</span>
                    <span className="text-[11px] text-stone-500">سجل إشعارات الواتساب</span>
                  </div>
                  <p className="text-stone-600">Automated booking confirmations and 2h pre-appointment reminders.</p>
                </div>
              </div>
            )}

            {schemaMode === 'ddl' && (
              <pre className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-[11px] overflow-x-auto leading-relaxed max-h-[300px]">
                <code>{`-- Sameer Saloon Schema generated by Agent 01
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar VARCHAR(128) NOT NULL,
  title_en VARCHAR(128) NOT NULL,
  price_sar NUMERIC(10,2) NOT NULL,
  duration_mins INT DEFAULT 45
);

CREATE TABLE stylists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(128) NOT NULL,
  specialty VARCHAR(128)
);

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES services(id),
  stylist_id UUID REFERENCES stylists(id),
  client_name VARCHAR(128) NOT NULL,
  client_phone VARCHAR(32) NOT NULL,
  booking_time TIMESTAMPTZ NOT NULL,
  status VARCHAR(32) DEFAULT 'confirmed'
);`}</code>
              </pre>
            )}
          </div>

          {/* Compliance & Readiness Summary Card */}
          <div className="bg-white rounded-2xl shadow-xs p-5 border border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-stone-100 text-teal-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">verified</span>
              </div>
              <div>
                <h4 className="font-display text-xs font-bold text-[#1f242e]">Gate 1 Readiness Checklist</h4>
                <p className="text-[11px] text-stone-500">كل المعايير الأساسية لصالون سمير تم التحقق منها</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-stone-100 font-bold text-xs text-[#1f242e]">4 / 4 Cleared</span>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Human Approval Gate 1 Bar */}
      <div className="fixed bottom-0 left-0 md:left-72 right-0 bg-white/95 backdrop-blur-xl p-4 z-40 border-t border-stone-200 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-200 text-[#d97706] flex items-center justify-center shrink-0 font-bold">
              01
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-bold text-[#1f242e]">
                  Human Approval Gate 1: Approve Sameer Saloon Spec
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#d97706] text-white font-bold text-[10px]">MANDATORY</span>
              </div>
              <p className="text-xs text-stone-600">
                By approving Gate 1, you authorize <strong className="text-[#1f242e]">02. Designer Agent (Google Stitch)</strong> to generate Gold & White UI wireframes & booking prototype.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={() => showToast('Exporting Sameer Saloon PRD specification PDF...')}
              className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#1f242e] font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Export Spec (PDF)</span>
            </button>

            <button
              onClick={handleOpenApprovalModal}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-amber-600 hover:from-amber-700 hover:to-amber-800 text-white font-extrabold text-xs shadow-lg transition cursor-pointer flex items-center gap-2"
            >
              <span>Approve Spec & Proceed to Gate 2 UI Design</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-stone-200 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#d97706] flex items-center justify-center font-bold">
                  01
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-[#1f242e]">Gate 1 Sameer Saloon Approval</h3>
                  <p className="text-xs text-stone-500">اعتماد مواصفات ومعمارية صالون سمير</p>
                </div>
              </div>
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-2">
              <p className="font-bold text-[#1f242e]">Next Automatic Sequence:</p>
              <div className="flex items-center gap-2 text-[#d97706] font-semibold">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>Lock Sameer Saloon PRD v1.0 into immutable audit log</span>
              </div>
              <div className="flex items-center gap-2 text-[#d97706] font-semibold">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>Invoke Agent 02 (Google Stitch Gold & White UI Designer)</span>
              </div>
              <div className="flex items-center gap-2 text-[#d97706] font-semibold">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>Render Salon Grooming Menu & Appointment Slot Picker</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmGate1Handoff}
                disabled={isApproving}
                className="px-5 py-2.5 rounded-xl bg-[#d97706] hover:bg-amber-700 text-white font-extrabold text-xs shadow-md transition cursor-pointer flex items-center gap-2"
              >
                {isApproving ? 'Transitioning...' : 'Authorize Agent 02 Now 🚀'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
