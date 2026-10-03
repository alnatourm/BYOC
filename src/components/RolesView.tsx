import React, { useState } from 'react';
import { useBYOK } from '../context/BYOKContext';

export const RolesView: React.FC = () => {
  const { setActiveTab } = useBYOK();
  const [isApproved, setIsApproved] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activePersona, setActivePersona] = useState<'auditor' | 'admin' | 'contributor'>('auditor');

  const handleApproveDesign = () => {
    setIsApproving(true);
    setTimeout(() => {
      setIsApproving(false);
      setIsApproved(true);
      showToast('Design Approved! 🎉 The Factory has locked these layouts into Project Brain and will proceed with implementation.');
    }, 1000);
  };

  const handleSendFeedback = () => {
    setShowFeedbackModal(false);
    showToast('Notes Delivered to AI Agents! AI agents are recalculating requirements and adapting the build plan.');
    setFeedbackText('');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  return (
    <div className="flex flex-col w-full pb-16 font-sans text-[#181d27]">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-white border-2 border-emerald-400 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 text-[#181d27] z-50 animate-in slide-in-from-bottom duration-200">
          <span className="material-symbols-outlined text-emerald-600 text-[24px]">verified</span>
          <div>
            <p className="font-display font-bold text-sm">Update Processed</p>
            <p className="text-xs text-[#554336]">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Header & Project Identity */}
      <div className="pt-2 pb-5 flex flex-col gap-4">
        {/* Breadcrumb + Live Status Pill */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[#887364] text-sm">
            <span onClick={() => setActiveTab('dashboard')} className="hover:text-[#ea580c] transition-colors cursor-pointer font-medium">Projects</span>
            <span className="material-symbols-outlined text-[14px] text-stone-300">chevron_right</span>
            <span className="text-[#181d27] font-display font-bold">PRJ-8842</span>
            <span className="px-2 py-0.5 rounded-md bg-stone-200/80 font-mono text-xs text-stone-700 font-semibold">PROD-TRACK</span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Active Autonomous Build • جاري البناء الذاتي
            </span>
            <button
              onClick={() => showToast('Share link copied to clipboard!')}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-[#e4e1db] hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-[#ea580c]">share</span>
              <span>Share Report</span>
            </button>
          </div>
        </div>

        {/* Main Project Headline & Metric Overview */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-baseline gap-3 flex-wrap">
              <h1 className="font-display font-extrabold text-3xl text-[#181d27] tracking-tight">
                Document Control System
              </h1>
              <span className="font-display font-medium text-xl text-[#887364]">
                نظام إدارة ومطابقة الوثائق
              </span>
            </div>
            <p className="text-sm text-[#554336] leading-relaxed max-w-2xl font-sans">
              Enterprise regulatory compliance, tamper-evident audit trails, and automated team access matrix. Orchestrated by friendly OGroup Autonomous Pods.
            </p>
          </div>

          {/* Completion Indicator Badge */}
          <div className="flex items-center gap-5 bg-white border border-[#e4e1db] p-4 rounded-2xl shadow-sm min-w-[270px] justify-between">
            <div className="flex flex-col">
              <span className="font-display text-[11px] font-bold uppercase tracking-wider text-[#887364]">Build Trajectory</span>
              <span className="font-display text-3xl text-[#ea580c] tracking-tight font-extrabold">62%</span>
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[15px]">trending_up</span> On Schedule (Est. 4h left)
              </span>
            </div>
            <div className="w-16 h-16 relative flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path className="text-stone-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5"></path>
                <path className="text-[#ea580c]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="62, 100" strokeLinecap="round" strokeWidth="3.5"></path>
              </svg>
              <span className="material-symbols-outlined absolute text-[22px] text-[#ea580c]">engineering</span>
            </div>
          </div>
        </div>
      </div>

      {/* Friendly 9-Stage Pipeline Track */}
      <div className="bg-white border border-[#e4e1db] rounded-2xl p-5 shadow-2xs mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-[#ea580c] font-display text-xs font-bold uppercase tracking-wide">Stage 4 of 9</span>
              <span className="font-display font-bold text-base text-[#181d27]">Build 🛠️ (التشييد والبرمجة)</span>
            </div>
            <p className="text-xs text-[#887364] mt-1">Autonomous Code Synthesis in progress • جاري توليد كود التطبيق بدقة</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#554336] bg-[#f8f7f5] px-3 py-1.5 rounded-xl font-semibold border border-[#e4e1db]/60">
            <span className="text-emerald-700">✓ 3 completed</span>
            <span className="text-stone-300">|</span>
            <span className="text-[#ea580c] font-bold">1 active</span>
            <span className="text-stone-300">|</span>
            <span className="text-stone-500">5 queued</span>
          </div>
        </div>

        {/* Warm Linear Progress Bar */}
        <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden mb-5 p-0.5">
          <div className="bg-gradient-to-r from-amber-500 via-[#ea580c] to-orange-500 h-full rounded-full transition-all duration-1000 shadow-2xs" style={{ width: '62%' }}></div>
        </div>

        {/* 9-Step Visual Badges */}
        <div className="grid grid-cols-3 md:grid-cols-9 gap-2">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center p-2 rounded-xl bg-[#f8f7f5] border border-stone-200/70">
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1 text-sm font-bold">✓</div>
            <span className="font-display text-xs text-[#181d27] font-bold">Idea 💡</span>
            <span className="text-[11px] text-[#887364]">الفكرة</span>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center p-2 rounded-xl bg-[#f8f7f5] border border-stone-200/70">
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1 text-sm font-bold">✓</div>
            <span className="font-display text-xs text-[#181d27] font-bold">Reqs 📋</span>
            <span className="text-[11px] text-[#887364]">المتطلبات</span>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center p-2 rounded-xl bg-[#f8f7f5] border border-stone-200/70">
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1 text-sm font-bold">✓</div>
            <span className="font-display text-xs text-[#181d27] font-bold">Design 🎨</span>
            <span className="text-[11px] text-[#887364]">التصميم</span>
          </div>

          {/* Step 4: ACTIVE */}
          <div className="flex flex-col items-center text-center p-2 rounded-xl bg-orange-50 border-2 border-[#ea580c] shadow-sm">
            <div className="w-7 h-7 rounded-full bg-[#ea580c] text-white flex items-center justify-center mb-1 text-xs font-bold animate-pulse">4</div>
            <span className="font-display text-xs text-[#ea580c] font-extrabold">Build 🛠️</span>
            <span className="text-[11px] text-orange-700 font-semibold">التشييد</span>
          </div>

          {/* Step 5 */}
          <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white border border-dashed border-stone-200 opacity-75">
            <div className="w-7 h-7 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mb-1 text-xs font-bold">5</div>
            <span className="font-display text-xs text-stone-600 font-semibold">Testing 🧪</span>
            <span className="text-[11px] text-stone-400">الفحص</span>
          </div>

          {/* Step 6 */}
          <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white border border-dashed border-stone-200 opacity-75">
            <div className="w-7 h-7 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mb-1 text-xs font-bold">6</div>
            <span className="font-display text-xs text-stone-600 font-semibold">Security 🛡️</span>
            <span className="text-[11px] text-stone-400">الأمان</span>
          </div>

          {/* Step 7 */}
          <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white border border-dashed border-stone-200 opacity-75">
            <div className="w-7 h-7 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mb-1 text-xs font-bold">7</div>
            <span className="font-display text-xs text-stone-600 font-semibold">Review 👀</span>
            <span className="text-[11px] text-stone-400">المراجعة</span>
          </div>

          {/* Step 8 */}
          <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white border border-dashed border-stone-200 opacity-75">
            <div className="w-7 h-7 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mb-1 text-xs font-bold">8</div>
            <span className="font-display text-xs text-stone-600 font-semibold">Deploy 🚀</span>
            <span className="text-[11px] text-stone-400">النشر</span>
          </div>

          {/* Step 9 */}
          <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white border border-dashed border-stone-200 opacity-75">
            <div className="w-7 h-7 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mb-1 text-xs font-bold">9</div>
            <span className="font-display text-xs text-stone-600 font-semibold">Live ✨</span>
            <span className="text-[11px] text-stone-400">حي ومباشر</span>
          </div>
        </div>
      </div>

      {/* Human Approval Gate Banner */}
      <div className="bg-gradient-to-r from-orange-50 via-white to-amber-50/60 p-6 rounded-2xl border-2 border-orange-200/80 shadow-2xs mb-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
          <div className="flex items-start gap-4 max-w-2xl">
            <div className="w-12 h-12 rounded-2xl bg-[#ea580c] text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-300/50">
              <span className="material-symbols-outlined text-[26px]">verified_user</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-[#ea580c] font-display text-xs font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#ea580c] animate-ping"></span>Human Approval Gate • بوابة الاعتماد البشري
                </span>
              </div>
              <h3 className="font-display font-bold text-lg text-[#181d27]">Design & Permissions Sign-Off / اعتماد التصميم ومصفوفة الصلاحيات</h3>
              <p className="text-sm text-[#554336] font-sans">Everything is running smoothly! Review the interactive sandbox below and approve the stage or drop quick friendly notes.</p>
              <div className="flex items-center gap-2 pt-0.5 text-xs text-[#887364]">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                <span>Completed Gates: Idea Approved ✓ | Requirements Approved ✓ | Next Gate: Live Production Launch</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={handleApproveDesign}
              disabled={isApproving}
              className={`flex-1 lg:flex-initial px-5 py-3 font-display font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                isApproved
                  ? 'bg-emerald-600 text-white shadow-emerald-400/30'
                  : 'bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-orange-400/30'
              }`}
            >
              {isApproving ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                  <span>Approving Design...</span>
                </>
              ) : isApproved ? (
                <>
                  <span>✨ Design Approved!</span>
                  <span className="text-xs text-emerald-100 font-normal">/ معتمد</span>
                </>
              ) : (
                <>
                  <span>✨ Approve Design</span>
                  <span className="text-xs text-orange-200 font-normal">/ اعتماد</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowFeedbackModal(true)}
              className="flex-1 lg:flex-initial px-5 py-3 bg-stone-200/80 hover:bg-stone-300 text-stone-800 font-display font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 border border-stone-300 cursor-pointer"
            >
              <span>💬 Request Changes</span>
              <span className="text-xs text-stone-500 font-normal">/ طلب تعديل</span>
            </button>
          </div>
        </div>
      </div>

      {/* Operational Split View: Live Factory Pulse + Real-time Interactive Sandbox */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-8">
        {/* Left 5 Cols: Factory Focus & Feed */}
        <div className="xl:col-span-5 flex flex-col gap-5">
          {/* Factory Focus Card */}
          <div className="bg-white border border-[#e4e1db] rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ea580c] text-[22px]">smart_toy</span>
                <span className="font-display font-bold text-base text-[#181d27]">Factory Focus Now</span>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Realtime Synced
              </span>
            </div>

            <div className="p-4 rounded-xl bg-orange-50/60 border border-orange-100 flex items-start gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white border border-orange-200 flex items-center justify-center text-[#ea580c] shrink-0 shadow-2xs">
                <span className="material-symbols-outlined text-[22px] animate-spin">sync</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#ea580c]">Current Agent Activity:</span>
                <p className="font-display font-bold text-sm text-[#181d27] leading-snug">
                  Developer Agent is implementing document permissions & access control matrix.
                </p>
                <p className="text-xs text-[#887364] font-sans">
                  يقوم وكيل التطوير البرمجي ببناء مصفوفة الصلاحيات لحماية الملفات ومزامنة التراخيص.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#f8f7f5] border border-stone-200/70 flex flex-col">
                <span className="text-xs text-[#887364] font-medium">Code Health Score</span>
                <span className="font-display font-extrabold text-xl text-emerald-600 flex items-center gap-1 mt-0.5">
                  99.4% <span className="material-symbols-outlined text-[16px]">verified</span>
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#f8f7f5] border border-stone-200/70 flex flex-col">
                <span className="text-xs text-[#887364] font-medium">Agents Working</span>
                <span className="font-display font-extrabold text-xl text-[#ea580c] flex items-center gap-1 mt-0.5">
                  3 Pods Active 🤖
                </span>
              </div>
            </div>
          </div>

          {/* Recent Accomplishments Feed */}
          <div className="bg-white border border-[#e4e1db] rounded-2xl p-5 shadow-2xs flex-1">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-stone-400 text-[18px]">history</span>
                <h3 className="font-display font-bold text-sm text-[#181d27]">Recent Accomplishments</h3>
              </div>
              <span className="text-xs text-[#887364] font-medium">اليوم • Today</span>
            </div>

            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[16px]">database</span>
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-xs text-[#181d27]">10:45 AM</span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Completed</span>
                  </div>
                  <p className="text-xs font-semibold text-stone-800">Database Engineer completed multi-tenant schema with 12 tables.</p>
                  <p className="text-[11px] text-[#887364]">تم الانتهاء من بناء هيكلة قاعدة البيانات المتكاملة بنجاح.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-[#ea580c] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[16px]">palette</span>
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-xs text-[#181d27]">10:12 AM</span>
                    <span className="text-[11px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full">Signed Off</span>
                  </div>
                  <p className="text-xs font-semibold text-stone-800">UI Design approved by customer.</p>
                  <p className="text-[11px] text-[#887364]">تم اعتماد واجهات المستخدم والخطوط العربية المعتمدة.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[16px]">task_alt</span>
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-xs text-[#181d27]">09:30 AM</span>
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">Validated</span>
                  </div>
                  <p className="text-xs font-semibold text-stone-800">Requirements validated against regulatory compliance.</p>
                  <p className="text-[11px] text-[#887364]">تمت مطابقة متطلبات النظام مع سياسات حوكمة البيانات المعتمدة.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Interactive Preview Sandbox Card */}
        <div className="xl:col-span-7 flex flex-col">
          <div className="bg-white border-2 border-stone-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
            {/* Browser Header Bar */}
            <div className="bg-stone-100/90 border-b border-stone-200 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-stone-200 text-stone-600 font-mono text-xs">
                  <span className="material-symbols-outlined text-[13px] text-emerald-600">lock</span>
                  <span>https://sandbox.ogroup.internal/doc-control/live-preview</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-[#ea580c] font-display text-xs font-bold">
                  Interactive Sandbox
                </span>
                <button
                  onClick={() => showToast('Interactive Sandbox is live!')}
                  className="p-1 rounded-lg hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">open_in_full</span>
                </button>
              </div>
            </div>

            {/* Inside the Preview Sandbox */}
            <div className="p-5 bg-stone-50/50 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between pb-4 gap-3 bg-white p-3 rounded-xl border border-stone-200 mb-4 shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#ea580c] flex items-center justify-center text-white font-display font-bold text-base shadow-2xs">
                      D
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-[#181d27] leading-tight">Document Center</h4>
                      <span className="text-xs text-[#887364]">Confidential Workspace • مساحة الوثائق</span>
                    </div>
                  </div>

                  {/* Persona Switcher */}
                  <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
                    <span className="text-xs text-[#887364] px-1 font-medium">Role:</span>
                    <button
                      onClick={() => setActivePersona('auditor')}
                      className={`px-2.5 py-1 rounded-lg font-display text-xs font-bold transition-all cursor-pointer ${
                        activePersona === 'auditor' ? 'bg-white text-[#ea580c] shadow-2xs' : 'text-stone-600 hover:bg-white/60'
                      }`}
                    >
                      Legal Auditor
                    </button>
                    <button
                      onClick={() => setActivePersona('admin')}
                      className={`px-2.5 py-1 rounded-lg font-display text-xs font-bold transition-all cursor-pointer ${
                        activePersona === 'admin' ? 'bg-white text-[#ea580c] shadow-2xs' : 'text-stone-600 hover:bg-white/60'
                      }`}
                    >
                      Admin
                    </button>
                    <button
                      onClick={() => setActivePersona('contributor')}
                      className={`px-2.5 py-1 rounded-lg font-display text-xs font-bold transition-all cursor-pointer ${
                        activePersona === 'contributor' ? 'bg-white text-[#ea580c] shadow-2xs' : 'text-stone-600 hover:bg-white/60'
                      }`}
                    >
                      Contributor
                    </button>
                  </div>
                </div>

                {/* Document Table Preview */}
                <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
                  <div className="grid grid-cols-12 bg-stone-100/70 px-4 py-2 text-[#887364] font-display font-bold text-xs uppercase tracking-wider">
                    <div className="col-span-5">Document Title / اسم الملف</div>
                    <div className="col-span-3">Access Level</div>
                    <div className="col-span-2">Retention</div>
                    <div className="col-span-2 text-right">Action</div>
                  </div>

                  {/* Row 1 */}
                  <div className="grid grid-cols-12 px-4 py-3 items-center hover:bg-orange-50/40 transition-colors text-xs border-b border-stone-100">
                    <div className="col-span-5 flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[18px] text-[#ea580c]">description</span>
                      <div className="flex flex-col min-w-0">
                        <span className="font-display font-bold text-xs text-stone-800 truncate">Board_Resolution_Q3_2025.pdf</span>
                        <span className="text-[11px] text-[#887364] truncate">قرار مجلس الإدارة - الاعتماد المالي</span>
                      </div>
                    </div>
                    <div className="col-span-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold text-[11px] border border-rose-200">
                        <span className="material-symbols-outlined text-[12px]">lock</span> Restricted
                      </span>
                    </div>
                    <div className="col-span-2 font-mono text-stone-600 font-medium">10 Years</div>
                    <div className="col-span-2 text-right">
                      <button onClick={() => showToast('Inspecting Board Resolution...')} className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-[#ea580c] hover:text-white text-stone-700 font-semibold text-xs transition-colors cursor-pointer">Inspect</button>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-12 px-4 py-3 items-center hover:bg-orange-50/40 transition-colors text-xs border-b border-stone-100 bg-stone-50/30">
                    <div className="col-span-5 flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[18px] text-[#f97316]">contract</span>
                      <div className="flex flex-col min-w-0">
                        <span className="font-display font-bold text-xs text-stone-800 truncate">Cloud_Vendor_SLA_Master.docx</span>
                        <span className="text-[11px] text-[#887364] truncate">اتفاقية مستوى الخدمة السحابية</span>
                      </div>
                    </div>
                    <div className="col-span-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                        <span className="material-symbols-outlined text-[12px]">group</span> Team Read
                      </span>
                    </div>
                    <div className="col-span-2 font-mono text-stone-600 font-medium">5 Years</div>
                    <div className="col-span-2 text-right">
                      <button onClick={() => showToast('Inspecting Cloud Vendor SLA...')} className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-[#ea580c] hover:text-white text-stone-700 font-semibold text-xs transition-colors cursor-pointer">Inspect</button>
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div className="grid grid-cols-12 px-4 py-3 items-center hover:bg-orange-50/40 transition-colors text-xs">
                    <div className="col-span-5 flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[18px] text-amber-600">verified</span>
                      <div className="flex flex-col min-w-0">
                        <span className="font-display font-bold text-xs text-stone-800 truncate">ISO27001_Audit_Manifest.xlsx</span>
                        <span className="text-[11px] text-[#887364] truncate">سجل مطابقة شهادة الآيزو</span>
                      </div>
                    </div>
                    <div className="col-span-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[11px] border border-blue-200">
                        <span className="material-symbols-outlined text-[12px]">visibility</span> Public Read
                      </span>
                    </div>
                    <div className="col-span-2 font-mono text-stone-600 font-medium">Permanent</div>
                    <div className="col-span-2 text-right">
                      <button onClick={() => showToast('Inspecting ISO27001 Audit...')} className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-[#ea580c] hover:text-white text-stone-700 font-semibold text-xs transition-colors cursor-pointer">Inspect</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Footer Info */}
              <div className="mt-4 pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between text-[#887364] text-xs">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-emerald-600 text-[16px]">verified</span>
                  Document watermarking and dynamic masking active in this live preview.
                </span>
                <span className="font-display font-bold text-[#ea580c]">✨ Ready for design sign-off</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PROJECT BRAIN SECTION (عقل المشروع الدائم) */}
      <div className="mt-2 flex flex-col gap-6">
        <div className="p-6 rounded-2xl bg-white border border-[#e4e1db] shadow-2xs relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#ea580c] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[22px]">psychology</span>
                </div>
                <h2 className="font-display font-extrabold text-2xl text-[#181d27] tracking-tight">Project Brain 🧠 / عقل المشروع الدائم</h2>
              </div>
              <p className="text-sm text-stone-700 font-medium">
                Project Brain keeps your project's important decisions and context so AI agents stay aligned throughout development.
              </p>
              <p className="text-xs text-[#887364]">
                ذاكرة ذكية موحدة تحفظ المعايير الهندسية وقرارات العمل حتى تلتزم جميع روبوتات المصنع بنفس الرؤية دون أي تشتت أو انحراف.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-[#f8f7f5] border border-stone-200 text-stone-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-display font-bold text-xs">Knowledge Graph Synchronized ⚡</span>
              </div>
            </div>
          </div>
        </div>

        {/* 9 Approachable Warm Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="p-5 rounded-2xl bg-white border border-[#e4e1db] shadow-2xs hover:shadow-sm hover:border-orange-300 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#ea580c] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
                </div>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">18 verified rules</span>
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-[#181d27]">1. Requirements (متطلبات النظام)</h4>
                <p className="text-xs text-[#554336] mt-1 leading-relaxed">
                  Every business and functional specification mapped out clearly into testable criteria.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between text-[#887364] text-xs">
              <span className="font-medium">Zero ambiguity flags</span>
              <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-2xl bg-white border border-[#e4e1db] shadow-2xs hover:shadow-sm hover:border-orange-300 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">policy</span>
                </div>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold border border-amber-200">RBAC + SLA Policies</span>
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-[#181d27]">2. Business Rules (قواعد العمل)</h4>
                <p className="text-xs text-[#554336] mt-1 leading-relaxed">
                  Role-based permissions, SLA policies, and internal document lifecycle constraints.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between text-[#887364] text-xs">
              <span className="font-medium">Strict compliance enforced</span>
              <span className="material-symbols-outlined text-[16px] text-[#ea580c]">verified</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-2xl bg-white border border-[#e4e1db] shadow-2xs hover:shadow-sm hover:border-orange-300 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">architecture</span>
                </div>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-bold border border-stone-200">Standard Modern Stack</span>
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-[#181d27]">3. Architecture (البنية العامة)</h4>
                <p className="text-xs text-[#554336] mt-1 leading-relaxed">
                  High-performance Next.js foundation, Supabase managed storage, and distributed cloud services.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between text-[#887364] text-xs">
              <span className="font-medium">Scalable cloud architecture</span>
              <span className="material-symbols-outlined text-[16px] text-emerald-600">cloud_done</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-5 rounded-2xl bg-white border border-[#e4e1db] shadow-2xs hover:shadow-sm hover:border-orange-300 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#ea580c] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">gavel</span>
                </div>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-orange-50 text-[#ea580c] font-bold border border-orange-200">2 Milestones Logged</span>
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-[#181d27]">4. Decisions (القرارات المعتمدة)</h4>
                <p className="text-xs text-[#554336] mt-1 leading-relaxed">
                  Auto-watermarking approved by founder, and enterprise SAML integration added to pipeline.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between text-[#887364] text-xs">
              <span className="font-medium">Locked & communicated to agents</span>
              <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
            </div>
          </div>

          {/* Card 5 */}
          <div className="p-5 rounded-2xl bg-white border border-[#e4e1db] shadow-2xs hover:shadow-sm hover:border-orange-300 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#ea580c] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">layers</span>
                </div>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 font-bold border border-orange-200">8 screens locked</span>
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-[#181d27]">5. Approved Designs (التصاميم)</h4>
                <p className="text-xs text-[#554336] mt-1 leading-relaxed">
                  Wireframes and high-fidelity layouts signed off with unified Arabic & English typography.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between text-[#887364] text-xs">
              <span className="font-medium">Design system v2 synced</span>
              <span className="material-symbols-outlined text-[16px] text-emerald-600">done_all</span>
            </div>
          </div>

          {/* Card 6 */}
          <div className="p-5 rounded-2xl bg-white border border-[#e4e1db] shadow-2xs hover:shadow-sm hover:border-orange-300 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">checklist</span>
                </div>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-bold border border-stone-200">14 done / 4 active / 2 left</span>
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-[#181d27]">6. Tasks (المهام الحالية)</h4>
                <p className="text-xs text-[#554336] mt-1 leading-relaxed">
                  Active execution pipeline across front-end rendering, secure storage keys, and audit logging.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between text-[#887364] text-xs">
              <span className="font-medium">Overall task velocity: High</span>
              <span className="material-symbols-outlined text-[16px] text-[#ea580c]">speed</span>
            </div>
          </div>

          {/* Card 7 */}
          <div className="p-5 rounded-2xl bg-white border border-[#e4e1db] shadow-2xs hover:shadow-sm hover:border-orange-300 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">task_alt</span>
                </div>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">0 critical issues</span>
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-[#181d27]">7. Known Issues (الملاحظات)</h4>
                <p className="text-xs text-[#554336] mt-1 leading-relaxed">
                  Zero blockers, zero regression alerts. Minor PDF parser edge case already handled.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between text-[#887364] text-xs">
              <span className="font-medium">Clean quality radar</span>
              <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
            </div>
          </div>

          {/* Card 8 */}
          <div className="p-5 rounded-2xl bg-white border border-[#e4e1db] shadow-2xs hover:shadow-sm hover:border-orange-300 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">fact_check</span>
                </div>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">42 / 42 passed (100%)</span>
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-[#181d27]">8. Testing Evidence (نتائج الفحص)</h4>
                <p className="text-xs text-[#554336] mt-1 leading-relaxed">
                  Automated continuous testing verifies every user action, security perimeter, and load response.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between text-[#887364] text-xs">
              <span className="font-medium">100% green compliance pass</span>
              <span className="material-symbols-outlined text-[16px] text-emerald-600">task_alt</span>
            </div>
          </div>

          {/* Card 9 */}
          <div className="p-5 rounded-2xl bg-white border border-[#e4e1db] shadow-2xs hover:shadow-sm hover:border-orange-300 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#ea580c] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
                </div>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-orange-50 text-[#ea580c] font-bold border border-orange-200">v0.3 staging preview</span>
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-[#181d27]">9. Deployment History (سجل الإطلاق)</h4>
                <p className="text-xs text-[#554336] mt-1 leading-relaxed">
                  Staging environment is actively updated. Production cutover ready once Security stage wraps.
                </p>
              </div>
            </div>
            <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between text-[#887364] text-xs">
              <span className="font-medium">Customer preview link online</span>
              <span className="material-symbols-outlined text-[16px] text-[#ea580c]">wifi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-stone-200 relative">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#ea580c] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">edit_note</span>
                </div>
                <h3 className="font-display font-bold text-base text-[#181d27]">Provide Build Feedback • الملاحظات</h3>
              </div>
              <button onClick={() => setShowFeedbackModal(false)} className="text-stone-400 hover:text-stone-700">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-sm text-[#554336] font-sans my-4">
              What adjustments would you like the Factory team to execute on the permissions matrix or layout?
            </p>

            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="e.g. Add 2-factor authentication for Legal Auditors, and adjust the upload button color to contrast better..."
              rows={4}
              className="w-full bg-[#f8f7f5] text-[#181d27] placeholder:text-stone-400 text-sm p-3.5 rounded-xl border border-stone-200 focus:outline-none focus:border-orange-400 focus:bg-white transition-all mb-4"
            />

            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-display font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSendFeedback}
                className="px-5 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-display font-bold text-xs shadow-sm shadow-orange-300 cursor-pointer"
              >
                Send to AI Factory 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
