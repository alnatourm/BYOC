import React, { useState } from 'react';
import { useBYOK } from '../context/BYOKContext';

export const Gate1SpecReviewView: React.FC = () => {
  const { setCurrentGateStep, selectedArtifact } = useBYOK();
  const [isApproving, setIsApproving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  const handleApproveGate1 = () => {
    setIsApproving(true);
    setTimeout(() => {
      setIsApproving(false);
      showToast('✅ Gate 1 Approved! PRD & PostgreSQL Data Model locked. Transitioning to Stage 02: Google Stitch UI Designer...');
      setTimeout(() => {
        setCurrentGateStep('gate2');
      }, 1000);
    }, 1000);
  };

  const handleRequestEdits = () => {
    const edits = prompt('Enter specific specification or data model adjustment notes:', 'Add loyalty points table to data model');
    if (edits) {
      showToast(`Spec revision notes dispatched to Agent 01: "${edits}"`);
    }
  };

  return (
    <div className="flex flex-col w-full pb-32 font-sans text-[#1f242e] bg-[#f8f7f5] min-h-screen">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-8 bg-white border-2 border-[#ea580c] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-[#1f242e] z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="material-symbols-outlined text-[#ea580c] text-[24px]">verified</span>
          <div>
            <p className="font-display font-bold text-sm text-[#ea580c]">Gate 1 Update</p>
            <p className="text-xs text-[#554336]">{toastMsg}</p>
          </div>
        </div>
      )}

      {/* Top Ambient Glow & Meta Strip */}
      <div className="relative w-full pt-4 pb-6">
        <div className="absolute -top-10 left-1/3 w-96 h-32 bg-orange-200/30 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Meta Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-200/80 text-[#1f242e]">
              <span className="text-[11px] font-mono text-[#887364] font-bold">PROJECT</span>
              <span className="font-display text-sm font-bold text-[#ea580c]">
                {selectedArtifact?.title ? selectedArtifact.title.substring(0, 20) : 'PRJ-8842'}
              </span>
              <span className="text-stone-400">/</span>
              <span className="font-display text-sm font-bold text-[#1f242e]">
                {selectedArtifact?.category || 'SaaS Application'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-[#ea580c] font-bold">
                Bilingual v1.0
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-[#554336] text-xs font-semibold">
              <span className="material-symbols-outlined text-[16px] text-[#ea580c]">psychology</span>
              <span>Stage 1 PRD & Data Model Generated</span>
            </div>
          </div>

          {/* Human Gate 1 Badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-orange-100/80 text-[#ea580c] shadow-2xs border border-orange-200">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ea580c] animate-ping"></span>
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 leading-tight">
              <span className="font-display text-xs font-bold text-[#1f242e]">Gate 1 Mandatory Approval</span>
              <span className="text-[11px] font-bold text-[#ea580c]">اعتماد المواصفات ونموذج البيانات</span>
            </div>
          </div>
        </div>

        {/* Pipeline 5-Stage Stepper */}
        <div className="w-full bg-white p-4 rounded-2xl shadow-xs border border-stone-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {/* Step 1: Active */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50/80 border-2 border-[#ea580c] shadow-sm transition-all">
              <div className="w-8 h-8 rounded-lg bg-[#ea580c] text-white flex items-center justify-center font-bold shrink-0">
                01
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-[#ea580c] font-bold">01. PRODUCT SPEC</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#ea580c] text-white text-[9px] font-bold">ACTIVE</span>
                </div>
                <span className="font-display text-xs font-bold text-[#1f242e] truncate">Gate 1 Pending</span>
                <span className="text-[10px] text-[#554336]">بانتظار اعتماد المواصفات</span>
              </div>
            </div>

            {/* Step 2: Locked */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 opacity-60 border border-stone-200">
              <div className="w-8 h-8 rounded-lg bg-stone-200 text-stone-500 flex items-center justify-center font-bold shrink-0">
                <span className="material-symbols-outlined text-[18px]">lock</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-mono text-[#887364] font-bold">02. UI/UX DESIGN</span>
                <span className="font-display text-xs font-semibold text-[#1f242e] truncate">Google Stitch AI</span>
                <span className="text-[10px] text-[#887364]">مغلق حتى الاعتماد</span>
              </div>
            </div>

            {/* Step 3: Locked */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 opacity-60 border border-stone-200">
              <div className="w-8 h-8 rounded-lg bg-stone-200 text-stone-500 flex items-center justify-center font-bold shrink-0">
                <span className="material-symbols-outlined text-[18px]">lock</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-mono text-[#887364] font-bold">03. DEV AGENT</span>
                <span className="font-display text-xs font-semibold text-[#1f242e] truncate">Full-Stack Code</span>
                <span className="text-[10px] text-[#887364]">مغلق</span>
              </div>
            </div>

            {/* Step 4: Locked */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 opacity-60 border border-stone-200">
              <div className="w-8 h-8 rounded-lg bg-stone-200 text-stone-500 flex items-center justify-center font-bold shrink-0">
                <span className="material-symbols-outlined text-[18px]">lock</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-mono text-[#887364] font-bold">04. QC & SECURITY</span>
                <span className="font-display text-xs font-semibold text-[#1f242e] truncate">SAST Security Scan</span>
                <span className="text-[10px] text-[#887364]">فحص الأمان</span>
              </div>
            </div>

            {/* Step 5: Locked */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 opacity-60 border border-stone-200">
              <div className="w-8 h-8 rounded-lg bg-stone-200 text-stone-500 flex items-center justify-center font-bold shrink-0">
                <span className="material-symbols-outlined text-[18px]">lock</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-mono text-[#887364] font-bold">05. DEPLOYMENT</span>
                <span className="font-display text-xs font-semibold text-[#1f242e] truncate">Live Edge Deploy</span>
                <span className="text-[10px] text-[#887364]">الإطلاق</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agent 01 Bio & Generated Spec Output */}
      <section className="mb-6">
        <div className="bg-white p-6 rounded-3xl shadow-xs border border-stone-200 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#ea580c] text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
                01
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-xl font-bold text-[#1f242e]">
                    Product & Spec Agent Output
                  </h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-100 text-[#ea580c] font-bold">
                    المنتج والمواصفات
                  </span>
                </div>
                <p className="text-xs md:text-sm text-[#554336] mt-1 font-medium">
                  Merges Product Manager, Spec Analyst, and System Architect capabilities. Review the requirements and PostgreSQL data model below before unlocking Google Stitch UI Design.
                </p>
              </div>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-orange-50 border border-orange-200 text-right shrink-0">
              <span className="text-[10px] text-[#887364] font-bold uppercase block">PRD Match Confidence</span>
              <span className="font-display text-xl font-bold text-[#ea580c]">98.6% Validated</span>
            </div>
          </div>

          {/* Generated Specification Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Epics & User Stories */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center gap-2 text-[#1f242e] font-bold text-sm">
                <span className="material-symbols-outlined text-[#ea580c]">format_list_bulleted</span>
                <span>User Story Epics & Features</span>
              </div>
              <ul className="space-y-2 text-xs text-[#554336]">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-teal-600 mt-0.5">check_circle</span>
                  <span><strong>Customer Booking:</strong> Interactive date/time slot picker with instant confirmation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-teal-600 mt-0.5">check_circle</span>
                  <span><strong>WhatsApp Reminders:</strong> Automated booking webhook notifications & status links.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-teal-600 mt-0.5">check_circle</span>
                  <span><strong>Staff Roster:</strong> Individual specialist shift management & service menu.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-teal-600 mt-0.5">check_circle</span>
                  <span><strong>Tax Compliance:</strong> ZATCA 15% VAT calculation & printable PDF receipts.</span>
                </li>
              </ul>
            </div>

            {/* Card 2: PostgreSQL Data Model */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#1f242e] font-bold text-sm">
                  <span className="material-symbols-outlined text-[#ea580c]">database</span>
                  <span>PostgreSQL Data Model</span>
                </div>
                <span className="text-[10px] font-mono text-teal-800 bg-teal-100 font-bold px-2 py-0.5 rounded">
                  5 Tables
                </span>
              </div>
              <div className="space-y-1.5 font-mono text-[11px] text-[#554336] bg-white p-3 rounded-xl border border-stone-200">
                <p>• <strong className="text-[#1f242e]">users</strong> (id, name, email, phone, role)</p>
                <p>• <strong className="text-[#1f242e]">services</strong> (id, title_ar, title_en, price, duration)</p>
                <p>• <strong className="text-[#1f242e]">appointments</strong> (id, user_id, service_id, staff_id, date, status)</p>
                <p>• <strong className="text-[#1f242e]">staff_members</strong> (id, name, specialty, shift_hours)</p>
                <p>• <strong className="text-[#1f242e]">audit_logs</strong> (id, action, ip_address, timestamp)</p>
              </div>
            </div>

            {/* Card 3: Integrations & Boundaries */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center gap-2 text-[#1f242e] font-bold text-sm">
                <span className="material-symbols-outlined text-[#ea580c]">integration_instructions</span>
                <span>System Boundaries & APIs</span>
              </div>
              <ul className="space-y-2 text-xs text-[#554336]">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-teal-600 mt-0.5">verified</span>
                  <span><strong>WhatsApp Cloud API:</strong> Webhook triggers on appointment booking & status change.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-teal-600 mt-0.5">verified</span>
                  <span><strong>Payment Gateway:</strong> Mada / Visa / Apple Pay online checkout integration.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-teal-600 mt-0.5">verified</span>
                  <span><strong>Bilingual i18n Engine:</strong> Arabic (RTL) & English (LTR) language keys mapped.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Human Approval Gate 1 Action Bar */}
      <div className="fixed bottom-0 left-0 md:left-72 right-0 bg-white/95 backdrop-blur-xl p-4 z-40 border-t border-stone-200 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#ea580c] flex items-center justify-center shrink-0 font-bold">
              01
            </div>
            <div className="flex flex-col">
              <span className="font-display text-sm font-bold text-[#1f242e]">
                Human Approval Gate 1: Approve Spec & PostgreSQL Data Model
              </span>
              <span className="text-xs text-[#554336]">
                By approving Gate 1, you authorize <strong className="text-[#1f242e]">02. Designer Agent (Google Stitch)</strong> to generate UI wireframes & design tokens.
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={handleRequestEdits}
              className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#1f242e] font-bold text-xs transition cursor-pointer"
            >
              ✏️ Request Spec Edits / تعديل المواصفات
            </button>

            <button
              onClick={handleApproveGate1}
              disabled={isApproving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ea580c] to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-extrabold text-xs shadow-lg transition cursor-pointer flex items-center gap-2"
            >
              {isApproving ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                  <span>Authorizing Google Stitch Designer...</span>
                </>
              ) : (
                <>
                  <span>✅ Approve Gate 1 & Proceed to Gate 2 UI Design</span>
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
