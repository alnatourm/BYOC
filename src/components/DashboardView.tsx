import React, { useState } from 'react';
import { useBYOK } from '../context/BYOKContext';

export const DashboardView: React.FC = () => {
  const { runs, projects, createProject, createRun, setActiveTab, setActiveRunId } = useBYOK();
  const [appIdea, setAppIdea] = useState('');
  const [projectName, setProjectName] = useState('');
  const [deliveryMode, setDeliveryMode] = useState<'managed' | 'byok'>('managed');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fillIdea = (title: string, text: string) => {
    setProjectName(title);
    setAppIdea(text);
  };

  const handleStartBuild = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const promptText = appIdea.trim();
    if (!promptText) {
      setError('Please describe what you want to build / يرجى كتابة فكرة تطبيقك للبدء');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const derivedTitle = projectName.trim() || promptText.slice(0, 30) + ' App';
      const proj = await createProject(derivedTitle, deliveryMode);
      const newRun = await createRun(proj.id, `${derivedTitle} Assembly Run`, promptText);
      setActiveRunId(newRun.id);
      setActiveTab('build');
    } catch (err: any) {
      setError(err?.message || 'Failed to initialize build run.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Warm Top Atmosphere Hero Section */}
      <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-b from-white via-[#faf8f5] to-[#f6ece6] border border-[#e5e3dd] p-6 md:p-8 shadow-xs">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-orange-100/60 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-amber-100/50 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
          {/* Founder Cheerful Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#e5e3dd] text-[#1f242e] shadow-2xs mb-4">
            <span className="text-base">✨</span>
            <span className="font-semibold text-xs text-[#1f242e]">Zero code needed • بدون أي كود برمجي إطلاقاً</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]"></span>
            <span className="font-bold text-xs text-[#ea580c]">100% Beginner Friendly</span>
          </div>

          {/* Main Warm Header */}
          <h1 className="text-3xl md:text-4xl text-[#1f242e] font-bold font-display tracking-tight mb-1">
            Build Your Next Business Application ☀️
          </h1>
          <p className="text-lg md:text-xl text-[#ea580c] font-semibold mb-2" dir="rtl">
            ماذا تود أن تصنع وتطلق لعملك اليوم؟
          </p>
          <p className="text-xs md:text-sm text-[#554336] max-w-2xl mb-6">
            Turn your business idea into a real, working app in minutes. Describe your requirements in plain language, and our governed autonomous AI Factory handles the rest!
          </p>

          {/* Conversational Idea Box (Card Pod) */}
          <div className="w-full bg-white rounded-2xl p-5 md:p-6 border border-[#e5e3dd] shadow-md text-left flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[#1f242e] font-bold text-sm">
                <span className="material-symbols-outlined text-[#ea580c] text-[22px]">draw</span>
                <span>Describe what you want to build • صف فكرتك بأسلوبك اليومي</span>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Governed Factory Listening
              </span>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#1f242e] mb-1">Project Name (Optional)</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Artisanal Espresso & Delivery App"
                  className="w-full bg-[#faf8f5] border border-[#e5e3dd] rounded-xl px-3.5 py-2 font-sans text-xs text-[#1f242e] placeholder:text-[#887364] focus:outline-none focus:border-[#ea580c] focus:bg-white transition-all"
                />
              </div>

              <div className="relative w-full">
                <textarea
                  id="appIdeaInput"
                  rows={4}
                  value={appIdea}
                  onChange={(e) => setAppIdea(e.target.value)}
                  placeholder="e.g. I want an appointment booking app for my boutique grooming spa with WhatsApp reminders, customer receipts, and Arabic invoice support..."
                  className="w-full bg-[#faf8f5] border border-[#e5e3dd] rounded-xl p-4 font-sans text-xs text-[#1f242e] placeholder:text-[#887364] focus:outline-none focus:border-[#ea580c] focus:bg-white focus:ring-2 focus:ring-[#ea580c]/20 shadow-inner transition-all resize-none"
                />
                {appIdea && (
                  <button
                    type="button"
                    onClick={() => setAppIdea('')}
                    className="absolute right-3 top-3 text-[#887364] hover:text-[#1f242e] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                )}
              </div>
            </div>

            {/* Delivery Mode Toggle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setDeliveryMode('managed')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  deliveryMode === 'managed'
                    ? 'border-[#ea580c] bg-orange-50/80 ring-1 ring-[#ea580c]'
                    : 'border-[#e5e3dd] bg-[#faf8f5] hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-xs text-[#1f242e]">
                  <span>🌟 Build For Me (Managed Factory)</span>
                  {deliveryMode === 'managed' && <span className="text-[#ea580c]">✓ Active</span>}
                </div>
                <p className="text-[11px] text-[#554336] mt-0.5">100% Automated. Autonomous AI designs, codes, and hosts your app with zero technical overhead.</p>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMode('byok')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  deliveryMode === 'byok'
                    ? 'border-[#ea580c] bg-orange-50/80 ring-1 ring-[#ea580c]'
                    : 'border-[#e5e3dd] bg-[#faf8f5] hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-xs text-[#1f242e]">
                  <span>🔑 Connect Custom AI (BYOK)</span>
                  {deliveryMode === 'byok' && <span className="text-[#ea580c]">✓ Active</span>}
                </div>
                <p className="text-[11px] text-[#554336] mt-0.5">Advanced. Connect custom Gemini keys, local Ollama models, or specific provider endpoints.</p>
              </button>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-[#554336] font-semibold">Attached Context:</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#faf8f5] border border-[#e5e3dd] text-[11px] font-mono text-[#554336]">
                  Full-Stack App Graph
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#faf8f5] border border-[#e5e3dd] text-[11px] font-mono text-[#554336]">
                  AES-GCM Secure Vault
                </span>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleStartBuild()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#ea580c] hover:bg-orange-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all transform active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                <span>{loading ? 'Initializing Factory Run...' : 'Build My App Now • ابدأ صنع تطبيقي'}</span>
              </button>
            </div>

            {/* Quick Inspiration Sparks */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-[#e5e3dd]">
              <span className="text-xs text-[#887364] font-medium">Quick inspiration sparks (Click to load):</span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => fillIdea('Artisanal Coffee Store', '☕ Artisanal Coffee Store & Delivery: Menu showcase, cart, WhatsApp orders, loyalty stamp card')}
                  className="px-3 py-1 rounded-full bg-[#faf8f5] hover:bg-orange-100/70 border border-[#e5e3dd] text-[#1f242e] text-xs transition-colors cursor-pointer"
                >
                  ☕ Artisanal Coffee Store & Delivery
                </button>
                <button
                  type="button"
                  onClick={() => fillIdea('Boutique Spa Booking', '💆 Boutique Spa & Booking: Specialist portfolios, calendar slots, SMS reminders in Arabic and English')}
                  className="px-3 py-1 rounded-full bg-[#faf8f5] hover:bg-orange-100/70 border border-[#e5e3dd] text-[#1f242e] text-xs transition-colors cursor-pointer"
                >
                  💆 Boutique Spa & Booking
                </button>
                <button
                  type="button"
                  onClick={() => fillIdea('Client Document Vault', '📋 Client Intake & Document Vault: Digital sign-off, PDF upload, client status tracker')}
                  className="px-3 py-1 rounded-full bg-[#faf8f5] hover:bg-orange-100/70 border border-[#e5e3dd] text-[#1f242e] text-xs transition-colors cursor-pointer"
                >
                  📋 Client Intake & Documents
                </button>
                <button
                  type="button"
                  onClick={() => fillIdea('Inventory Tracker', '🏷️ Quick Inventory & Barcode Tracker: Simple stock in/out logger, low stock alert')}
                  className="px-3 py-1 rounded-full bg-[#faf8f5] hover:bg-orange-100/70 border border-[#e5e3dd] text-[#1f242e] text-xs transition-colors cursor-pointer"
                >
                  🏷️ Inventory & Barcode Tracker
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reassurance 3-Step Ribbon */}
      <div className="w-full bg-white rounded-2xl p-6 border border-[#e5e3dd] shadow-xs">
        <div className="text-center max-w-xl mx-auto mb-6">
          <span className="text-xs uppercase tracking-widest text-[#ea580c] font-bold">Clear & Stress-Free Process</span>
          <h2 className="text-xl text-[#1f242e] font-bold mt-1 font-display">How It Works in 3 Gentle Steps</h2>
          <p className="text-xs text-[#554336]" dir="rtl">كيف يعمل مصنع التطبيقات الذكي بكل سهولة وبدون تعقيد</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1 */}
          <div className="bg-[#faf8f5] rounded-xl p-4 border border-[#e5e3dd] flex flex-col gap-2 relative overflow-hidden transition-all hover:bg-white hover:shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-[#ea580c] font-bold text-lg mb-1">
              💡
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[#1f242e]">1. Tell Us Your Idea</span>
              <span className="font-bold text-xs text-[#ea580c]">خطوة ١</span>
            </div>
            <p className="text-xs text-[#554336]">Describe what your business needs in everyday language. No technical knowledge required.</p>
            <span className="text-[11px] text-[#ea580c] font-medium" dir="rtl">تحدث بلهجتك الطبيعية وفريقنا يفهم كل التفاصيل</span>
          </div>

          {/* Step 2 */}
          <div className="bg-[#faf8f5] rounded-xl p-4 border border-[#e5e3dd] flex flex-col gap-2 relative overflow-hidden transition-all hover:bg-white hover:shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-[#ea580c] font-bold text-lg mb-1">
              🪄
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[#1f242e]">2. AI Builds It For You</span>
              <span className="font-bold text-xs text-[#ea580c]">خطوة ٢</span>
            </div>
            <p className="text-xs text-[#554336]">Our governed factory crafts your screen layouts, database schemas, and workflows quietly.</p>
            <span className="text-[11px] text-[#ea580c] font-medium" dir="rtl">الذكاء يبني القوائم وقواعد البيانات تلقائياً</span>
          </div>

          {/* Step 3 */}
          <div className="bg-[#faf8f5] rounded-xl p-4 border border-[#e5e3dd] flex flex-col gap-2 relative overflow-hidden transition-all hover:bg-white hover:shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-teal-100 border border-teal-200 flex items-center justify-center text-[#0d9488] font-bold text-lg mb-1">
              🚀
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[#1f242e]">3. Review & Launch</span>
              <span className="font-bold text-xs text-[#0d9488]">خطوة ٣</span>
            </div>
            <p className="text-xs text-[#554336]">Inspect through 5 human approval gates. When satisfied, release with one single click!</p>
            <span className="text-[11px] text-[#0d9488] font-medium" dir="rtl">اعتمد مراحل الإنشاء بهاتفك وانشره بضغطة زر</span>
          </div>
        </div>
      </div>

      {/* Real Studio Metrics Pills */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#e5e3dd] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="w-9 h-9 rounded-xl bg-[#f6ece6] flex items-center justify-center text-[#1f242e]">
              <span className="material-symbols-outlined text-[20px]">apps</span>
            </span>
            <span className="text-xs text-[#554336] font-bold">Total Projects</span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold font-mono text-[#1f242e]">{projects.length}</span>
            <p className="text-xs text-[#887364]">Active in your workspace</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#e5e3dd] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-[#ea580c]">
              <span className="material-symbols-outlined text-[20px]">cyclone</span>
            </span>
            <span className="text-xs font-bold text-[#ea580c] bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full">
              Assembly Runs
            </span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold font-mono text-[#ea580c]">{runs.length}</span>
            <p className="text-xs text-[#887364]">In governed pipeline</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border-2 border-[#ea580c]/30 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="w-9 h-9 rounded-xl bg-[#ea580c] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">lock</span>
            </span>
            <span className="text-xs font-bold text-[#ea580c] bg-orange-100 px-2.5 py-0.5 rounded-full">
              100% Enforced
            </span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold font-mono text-[#ea580c]">Human Gates</span>
            <p className="text-xs text-[#887364]">Zero automatic promotion</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#e5e3dd] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center text-[#0d9488]">
              <span className="material-symbols-outlined text-[20px]">security</span>
            </span>
            <span className="text-xs font-bold text-[#0d9488] bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
              Hash Chained
            </span>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold font-mono text-[#0d9488]">Audit Log</span>
            <p className="text-xs text-[#887364]">AES-256 Vault protected</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Software Assembly Workshop Feed */}
      <div className="bg-white p-6 rounded-2xl border border-[#e5e3dd] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-base text-[#1f242e] font-display">
              My Software Workshop • تطبيقاتي
            </h2>
            <p className="text-xs text-[#554336]">
              Every software run advances through 5 human-in-the-loop approval gates.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('build')}
            className="inline-flex items-center gap-1 text-xs text-[#ea580c] font-bold hover:underline cursor-pointer"
          >
            <span>Open Pipeline ({runs.length})</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="space-y-3">
          {runs.map((r) => (
            <div key={r.id} className="p-4 rounded-xl border border-[#e5e3dd] bg-[#faf8f5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-[#ea580c] font-bold text-[11px]">
                    Stage {r.currentStage || 1} / 5
                  </span>
                  <span className="font-bold text-sm text-[#1f242e]">{r.title}</span>
                </div>
                <p className="text-xs text-[#554336] line-clamp-2">{r.intent}</p>
              </div>

              <button
                onClick={() => {
                  setActiveRunId(r.id);
                  setActiveTab('build');
                }}
                className="px-4 py-2 rounded-xl bg-[#ea580c] hover:bg-orange-700 text-white font-bold text-xs shadow-xs cursor-pointer shrink-0 self-start sm:self-auto"
              >
                Inspect Stage {r.currentStage || 1} Gate →
              </button>
            </div>
          ))}

          {runs.length === 0 && (
            <div className="p-8 text-center text-xs text-[#887364] bg-[#faf8f5] rounded-xl border border-dashed border-[#e5e3dd]">
              No active software runs yet. Use the prompt box above to describe your app and click "Build My App Now"!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
