import React, { useState } from 'react';
import { useBYOK } from '../context/BYOKContext';

export const BuildSuiteView: React.FC = () => {
  const { setActiveTab, setSelectedArtifact, artifacts, runTeamOrchestration, setCurrentGateStep } = useBYOK();
  const [promptText, setPromptText] = useState('');
  const [deliveryMode, setDeliveryMode] = useState<'for-me' | 'with-ai'>('for-me');
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchStepIndex, setLaunchStepIndex] = useState(0);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [createdArtifact, setCreatedArtifact] = useState<any>(null);
  const [linkInput, setLinkInput] = useState('');
  const [attachments, setAttachments] = useState<Array<{ name: string; type: string }>>([]);

  const launchSteps = [
    'Synthesizing PRD requirements & user stories...',
    'Connecting Google Stitch AI Canvas Engine for UI/UX screen generation...',
    'Deploying Developer Agent for React TSX code synthesis...',
    'Performing Q/C audit & locking Stitch design tokens into Project Brain...',
    'Build sprint launched! Opening Live Preview Sandbox...',
  ];

  const hydratePrompt = (text: string) => {
    setPromptText(text);
  };

  const handleAttachFile = (e: React.ChangeEvent<HTMLInputElement>, typeLabel: string) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAttachments((prev) => [...prev, { name: file.name, type: typeLabel }]);
    }
  };

  const handleAddLink = () => {
    if (linkInput.trim()) {
      setAttachments((prev) => [...prev, { name: linkInput.trim(), type: 'External Link' }]);
      setLinkInput('');
      setShowLinkModal(false);
    }
  };

  const handleLaunchBuild = async () => {
    setIsLaunching(true);
    setLaunchStepIndex(0);

    const interval = setInterval(() => {
      setLaunchStepIndex((prev) => {
        if (prev < launchSteps.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 900);

    setTimeout(async () => {
      const fallbackTitle = promptText.trim() ? promptText.trim().substring(0, 30) + ' App' : 'New Custom SaaS Software';
      const created = await runTeamOrchestration(
        fallbackTitle,
        promptText || 'Full-stack responsive application with database and WhatsApp reminders.',
        'SaaS Custom'
      );
      setIsLaunching(false);
      const art = created || artifacts[0];
      setCreatedArtifact(art);
      setSelectedArtifact(art);
      setCurrentGateStep('gate1');
      setActiveTab('roles');
    }, 4000);
  };

  return (
    <div className="flex flex-col w-full pb-16 font-sans text-[#1f242e]">
      {/* Top Header Title & Status Banner */}
      <div className="flex flex-col gap-2 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-orange-100 text-[#ea580c] font-bold text-xs uppercase tracking-wider">
              ✨ Build Suite
            </span>
            <span className="text-[#887364] text-xs">/</span>
            <span className="text-xs text-[#554338] font-semibold">Factory Ready / المصنع جاهز للعمل</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Factory Ready / المصنع جاهز للعمل
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-baseline justify-between gap-4 mt-1">
          <div>
            <h1 className="font-display text-3xl md:text-4xl text-[#1f242e] tracking-tight font-extrabold flex items-center gap-2">
              Build New Software <span className="text-[#887364] font-normal text-xl md:text-2xl">/ ابدأ بناء برنامجك</span>
            </h1>
            <p className="text-sm text-[#554338] mt-1 font-medium">
              Describe your software in plain language. Our autonomous AI Factory designs, codes, and ships it.
              <span className="text-[#887364] text-xs block sm:inline mt-0.5 sm:mt-0 font-medium"> / صف فكرتك بكل بساطة، وسيتكفل المصنع بالبناء بالكامل.</span>
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200/80 px-3.5 py-1.5 rounded-xl">
            <span className="material-symbols-outlined text-[18px] text-[#ea580c]">auto_awesome</span>
            <span className="text-xs text-orange-950 font-bold">بناء ذكي ومؤتمت بالكامل • بدون برمجة</span>
          </div>
        </div>
      </div>

      {/* Main 12-Column Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-4">
        {/* Left 8 Columns */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          {/* STEP 1: Conversational Prompt Specification */}
          <section className="flex flex-col rounded-2xl bg-white border border-[#e5e3dd] p-6 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#ea580c] to-amber-500 flex items-center justify-center font-display text-white font-bold text-sm shadow-sm">
                  01
                </span>
                <div>
                  <h2 className="font-display text-lg text-[#1f242e] font-bold">What do you want to build?</h2>
                  <span className="text-xs text-[#887364] font-medium">ماذا تريد أن تبني؟ حدد فكرتك بكلماتك البسيطة بدون أي مصطلحات تقنية</span>
                </div>
              </div>

              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                ✨ Zero Tech Knowledge Needed / لا تحتاج لأي خبرة برمجية
              </span>
            </div>

            <div className="flex flex-col bg-[#faf8f5] border border-[#e5e3dd] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#ea580c]/20 focus-within:border-[#ea580c] transition-all">
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="e.g., I want an app where customers can book appointments with my barbershop, receive WhatsApp reminders, and pay online. / مثلاً: أريد تطبيقاً لحجز المواعيد مع تنبيهات واتساب والدفع الإلكتروني..."
                rows={5}
                className="w-full bg-transparent p-4 text-sm text-[#1f242e] placeholder-[#887364]/70 focus:outline-none resize-none leading-relaxed border-0"
              />

              {/* Attachment Pills Bar */}
              {attachments.length > 0 && (
                <div className="px-4 py-2 bg-white border-t border-[#e5e3dd]/60 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-[#554338] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                    Attached Context:
                  </span>
                  {attachments.map((att, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-orange-50 border border-orange-200 text-xs font-mono">
                      <span className="text-[#ea580c] font-bold">{att.type}:</span>
                      <span className="truncate max-w-[140px] text-[#554338]">{att.name}</span>
                      <button
                        type="button"
                        onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-red-500 hover:text-red-700 font-bold ml-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Input Capability Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#f4f1eb]/60 border-t border-[#e5e3dd]">
                <div className="flex flex-wrap items-center gap-2">
                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#e5e3dd] hover:bg-orange-50 hover:border-orange-200 text-[#1f242e] text-xs font-bold cursor-pointer transition-all shadow-2xs">
                    <span className="material-symbols-outlined text-[16px] text-amber-600">description</span>
                    <span>📄 Upload Notes or PDF</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      className="hidden"
                      onChange={(e) => handleAttachFile(e, 'Document')}
                    />
                  </label>

                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#e5e3dd] hover:bg-orange-50 hover:border-orange-200 text-[#1f242e] text-xs font-bold cursor-pointer transition-all shadow-2xs">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">image</span>
                    <span>🖼️ Add Photos / Sketches</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleAttachFile(e, 'Wireframe')}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowLinkModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#e5e3dd] hover:bg-orange-50 hover:border-orange-200 text-[#1f242e] text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#ea580c]">link</span>
                    <span>🔗 Add Website Link</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#887364]">
                    {promptText ? `${promptText.trim().split(/\s+/).length} words` : 'Draft ready'}
                  </span>
                  {promptText && (
                    <button
                      type="button"
                      onClick={() => setPromptText('')}
                      className="p-1 rounded-lg hover:bg-white text-[#887364] hover:text-[#1f242e] transition-colors"
                      title="Clear draft"
                    >
                      <span className="material-symbols-outlined text-[18px]">clear_all</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Prompts Pills */}
            <div className="mt-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#887364] uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-[#ea580c]">lightbulb</span>
                  Quick Ideas to Start / أمثلة سريعة للبدء
                </span>
                <span className="text-xs text-[#887364] font-medium">انقر لتعبئة نموذج الطلب تلقائياً</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => hydratePrompt('I want an online store to sell my products, with a simple shopping cart, Mada and Apple Pay checkout, and order status updates.')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#faf8f5] border border-[#e5e3dd] hover:bg-orange-50 hover:border-orange-300 text-[#1f242e] text-xs font-bold transition-colors cursor-pointer"
                >
                  <span>🛍️</span>
                  <span>Online Store</span>
                </button>

                <button
                  type="button"
                  onClick={() => hydratePrompt('I need a booking app where clients can select a service, pick an available date and time, and receive instant confirmation reminders.')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#faf8f5] border border-[#e5e3dd] hover:bg-orange-50 hover:border-orange-300 text-[#1f242e] text-xs font-bold transition-colors cursor-pointer"
                >
                  <span>📅</span>
                  <span>Appointments & Booking</span>
                </button>

                <button
                  type="button"
                  onClick={() => hydratePrompt('A friendly business dashboard to see daily sales, incoming client inquiries, and team tasks in one simple screen.')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#faf8f5] border border-[#e5e3dd] hover:bg-orange-50 hover:border-orange-300 text-[#1f242e] text-xs font-bold transition-colors cursor-pointer"
                >
                  <span>📊</span>
                  <span>Business Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={() => hydratePrompt('A customer portal where clients can log in, track their service requests, view invoices, and chat directly with our support team.')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#faf8f5] border border-[#e5e3dd] hover:bg-orange-50 hover:border-orange-300 text-[#1f242e] text-xs font-bold transition-colors cursor-pointer"
                >
                  <span>🤝</span>
                  <span>Customer Portal</span>
                </button>
              </div>
            </div>
          </section>

          {/* STEP 2: Choose Delivery Method */}
          <section className="flex flex-col rounded-2xl bg-white border border-[#e5e3dd] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#ea580c] to-amber-500 flex items-center justify-center font-display text-white font-bold text-sm shadow-sm">
                  02
                </span>
                <div>
                  <h2 className="font-display text-lg text-[#1f242e] font-bold">Choose delivery method</h2>
                  <span className="text-xs text-[#887364] font-medium">اختر طريقة التنفيذ والتسليم المناسبة لبيئة عملك</span>
                </div>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#faf8f5] border border-[#e5e3dd] text-[#554338] font-mono font-semibold">
                Fully Managed or Custom AI
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CARD A: Build For Me (SELECTED BY DEFAULT) */}
              <div
                onClick={() => setDeliveryMode('for-me')}
                className={`relative rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-md ${
                  deliveryMode === 'for-me'
                    ? 'ring-2 ring-[#ea580c] bg-gradient-to-b from-orange-50/80 via-white to-orange-50/40 border border-orange-200'
                    : 'bg-[#faf8f5] border border-[#e5e3dd] hover:bg-white'
                }`}
              >
                <div className="flex flex-col gap-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-sm">
                      <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                      🌟 100% Automated - We Handle Everything
                    </span>
                    {deliveryMode === 'for-me' && (
                      <span className="flex items-center gap-1 text-xs text-emerald-700 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>Active Mode
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-display text-lg text-[#1f242e] flex items-center justify-between font-extrabold">
                      <span>Build For Me</span>
                      <span className="text-sm text-[#887364] font-semibold">ابنِه لي بالكامل</span>
                    </h3>
                    <p className="text-xs text-[#554338] mt-1 leading-relaxed font-medium">
                      The easiest way to bring software to life. Our autonomous AI Factory handles design, development, and hosting with zero code from you.
                    </p>
                    <p className="text-xs text-[#887364] mt-0.5 leading-relaxed font-medium">
                      صف فكرتك وسيتولى المصنع الذكي كل خطوات الإنتاج والاستضافة دون أي مجهود برمجي.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 pt-2 text-xs font-semibold text-[#1f242e]">
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0">check_circle</span>
                      <span>You describe it, AI builds the whole app</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0">check_circle</span>
                      <span>No coding, no hosting, no server setup</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0">check_circle</span>
                      <span>Preview your working app in minutes</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-emerald-600 text-[18px] shrink-0">check_circle</span>
                      <span>You approve the design before anything goes live</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 relative z-10">
                  <button
                    type="button"
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      deliveryMode === 'for-me'
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                        : 'bg-white border border-[#e5e3dd] text-[#1f242e]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span>✓ Selected: Build For Me (Recommended)</span>
                  </button>
                </div>
              </div>

              {/* CARD B: Build With My AI */}
              <div
                onClick={() => setDeliveryMode('with-ai')}
                className={`relative rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-md ${
                  deliveryMode === 'with-ai'
                    ? 'ring-2 ring-[#ea580c] bg-gradient-to-b from-orange-50/80 via-white to-orange-50/40 border border-orange-200'
                    : 'bg-[#faf8f5] border border-[#e5e3dd] hover:bg-white'
                }`}
              >
                <div className="flex flex-col gap-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-[#e5e3dd] text-[#554338] font-semibold text-xs">
                      <span className="material-symbols-outlined text-[14px] text-[#887364]">terminal</span>
                      Advanced: Optional for Engineers
                    </span>
                    {deliveryMode === 'with-ai' && (
                      <span className="flex items-center gap-1 text-xs text-emerald-700 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>Active Mode
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-display text-lg text-[#1f242e] flex items-center justify-between font-extrabold">
                      <span>Connect Custom AI</span>
                      <span className="text-sm text-[#887364] font-semibold">للمطورين والخبراء</span>
                    </h3>
                    <p className="text-xs text-[#554338] mt-1 leading-relaxed font-medium">
                      Connect your own AI providers, API keys, local Ollama models, or custom agent endpoints to factory pipelines.
                    </p>
                    <p className="text-xs text-[#887364] mt-0.5 leading-relaxed font-medium">
                      مخصص للمطورين الراغبين في ربط مفاتيحهم ونماذجهم الخاصة.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 pt-2 text-xs font-medium text-[#1f242e]">
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[#887364] text-[18px] shrink-0">key</span>
                      <span>Bring Your Own Keys (BYOK) & local models</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[#887364] text-[18px] shrink-0">tune</span>
                      <span>Configure granular agent roles manually</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[#887364] text-[18px] shrink-0">sync_alt</span>
                      <span>Raw pipeline telemetry & endpoint routing</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 relative z-10">
                  <button
                    type="button"
                    className="w-full py-2.5 px-4 rounded-xl bg-white border border-[#e5e3dd] hover:bg-orange-50 hover:border-orange-300 text-[#1f242e] font-bold text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Advanced: Connect Custom AI (للمطورين والخبراء)</span>
                    <span className="material-symbols-outlined text-[16px] text-[#887364]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Notice Panel */}
            {deliveryMode === 'for-me' ? (
              <div className="mt-6 p-4 rounded-xl bg-orange-50/80 border border-orange-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#ea580c] shrink-0">
                    <span className="material-symbols-outlined text-[22px]">verified</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#1f242e] block">Zero Setup Required / بدون أي إعدادات معقدة</span>
                    <p className="text-xs text-[#554338] font-medium">
                      Everything runs securely on OGroup managed cloud with automatic database, preview URLs, and SSL certificates.
                    </p>
                  </div>
                </div>
                <span className="text-xs text-emerald-800 bg-emerald-100/90 border border-emerald-300/80 px-3 py-1 rounded-full font-bold">
                  All Systems Ready • جاهز للبناء
                </span>
              </div>
            ) : (
              <div className="mt-6 p-4 rounded-xl bg-[#faf8f5] border border-[#e5e3dd] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#ea580c] shrink-0">
                    <span className="material-symbols-outlined text-[22px]">account_tree</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#1f242e] block">Custom Model Routing Enabled</span>
                    <p className="text-xs text-[#554338] font-medium">
                      After initiating, you will assign your custom API endpoints and MCP agent servers in the step inspection console.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('providers')}
                  className="text-xs text-[#ea580c] font-bold hover:underline"
                >
                  Manage API Keys →
                </button>
              </div>
            )}
          </section>

          {/* Launch Action Bar */}
          <section className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-[#e5e3dd] shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ea580c] to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0">
                <span className="material-symbols-outlined text-[26px]">rocket_launch</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-bold text-sm text-[#1f242e]">Factory Ready / المصنع جاهز</span>
                  <span className="text-[#887364]">•</span>
                  <span className="text-xs text-[#ea580c] font-bold">First Preview in ~4 mins</span>
                </div>
                <span className="text-xs text-[#887364] font-medium">التسليم الأولي التفاعلي للمعاينة في غضون 4 دقائق</span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                type="button"
                onClick={() => alert('Pipeline Blueprint Verified: All 4 governance pods (Designer, Developer, Q/C, Document Control) staged.')}
                className="w-full md:w-auto px-4 py-3 rounded-xl bg-[#faf8f5] border border-[#e5e3dd] hover:bg-white text-[#1f242e] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#887364]">visibility</span>
                <span>Preview Summary / معاينة الخطة</span>
              </button>

              <button
                type="button"
                onClick={handleLaunchBuild}
                className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30 hover:from-orange-600 hover:to-amber-600 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                <span>✨ Start Building My App / ابدأ إنشاء تطبيقي الآن</span>
              </button>
            </div>
          </section>
        </div>

        {/* Right 4 Columns Sidebar */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          {/* What Happens Next? */}
          <div className="rounded-2xl bg-white border border-[#e5e3dd] p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#ea580c] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">checklist</span>
                </div>
                <h3 className="font-display font-bold text-base text-[#1f242e]">What Happens Next?</h3>
              </div>
              <span className="text-xs text-[#887364]">ماذا بعد الإطلاق؟</span>
            </div>

            <p className="text-xs text-[#554338] font-medium">Our friendly AI agents guide your project smoothly from idea to live deployment:</p>

            <div className="flex flex-col gap-2.5">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#faf8f5] border border-[#e5e3dd]/60">
                <div className="w-7 h-7 rounded-full bg-orange-100 text-[#ea580c] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</div>
                <div>
                  <span className="text-xs text-[#1f242e] block leading-tight font-bold">We organize your idea into clear features</span>
                  <span className="text-[11px] text-[#554338] font-medium">نلخص فكرتك في خطة عمل ومواصفات واضحة</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#faf8f5] border border-[#e5e3dd]/60">
                <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</div>
                <div>
                  <span className="text-xs text-[#1f242e] block leading-tight font-bold">You preview the visual screens & click around</span>
                  <span className="text-[11px] text-[#554338] font-medium">تشاهد التصميم الأولي وتجرب الشاشات مباشرة</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#faf8f5] border border-[#e5e3dd]/60">
                <div className="w-7 h-7 rounded-full bg-teal-100 text-[#0d9488] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</div>
                <div>
                  <span className="text-xs text-[#1f242e] block leading-tight font-bold">AI creates the working app & database</span>
                  <span className="text-[11px] text-[#554338] font-medium">يبني الذكاء الاصطناعي الواجهات وقواعد البيانات</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#faf8f5] border border-[#e5e3dd]/60">
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">4</div>
                <div>
                  <span className="text-xs text-[#1f242e] block leading-tight font-bold">You click Launch when you love it!</span>
                  <span className="text-[11px] text-[#554338] font-medium">تعتمد التطبيق فقط عندما ينال إعجابك التام</span>
                </div>
              </div>
            </div>
          </div>

          {/* Estimated Delivery Time */}
          <div className="rounded-2xl bg-white border border-[#e5e3dd] p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#ea580c] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                </div>
                <h3 className="font-display font-bold text-base text-[#1f242e]">Estimated Delivery Time</h3>
              </div>
              <span className="text-xs text-[#887364]">الوقت المتوقع</span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-[#faf8f5] border border-[#e5e3dd]/60 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#1f242e]">First visual preview</span>
                  <span className="text-[11px] text-[#887364]">المعاينة البصرية الأولى</span>
                </div>
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-bold">~4 minutes</span>
              </div>

              <div className="p-3 rounded-xl bg-[#faf8f5] border border-[#e5e3dd]/60 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#1f242e]">Working app</span>
                  <span className="text-[11px] text-[#887364]">تطبيق عملي متكامل</span>
                </div>
                <span className="text-xs text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200 font-bold">Under 24 hours</span>
              </div>
            </div>
          </div>

          {/* Confidential Notice */}
          <div className="rounded-2xl bg-white border border-[#e5e3dd] p-4 flex items-center gap-3 shadow-2xs">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>
            <div className="flex flex-col">
              <span className="text-xs text-[#1f242e] font-bold">Private & Secure Workspace 🔒</span>
              <span className="text-xs text-[#887364]">Your ideas, database, and software stay 100% confidential</span>
            </div>
          </div>
        </div>
      </div>

      {/* Link Reference Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#e5e3dd] shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#e5e3dd] pb-3">
              <h4 className="font-display font-bold text-base text-[#1f242e]">Add Reference Link</h4>
              <button onClick={() => setShowLinkModal(false)} className="text-[#887364] hover:text-[#1f242e]">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-xs text-[#554338]">Provide a competitor URL, Figma canvas prototype, or public GitHub repo for agent reverse-engineering:</p>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-[#554338]">Resource URL</label>
              <input
                type="url"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                placeholder="https://figma.com/file/... or https://competitor.io"
                className="w-full bg-[#faf8f5] border border-[#e5e3dd] px-3.5 py-2 rounded-xl text-xs text-[#1f242e] focus:outline-none focus:border-[#ea580c]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 rounded-xl bg-[#faf8f5] border border-[#e5e3dd] text-xs font-bold text-[#1f242e]"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLink}
                className="px-4 py-2 rounded-xl bg-[#ea580c] text-white text-xs font-bold shadow-sm"
              >
                Attach Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assembly Simulator Overlay */}
      {isLaunching && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center text-center gap-4 border border-orange-100">
            <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center text-[#ea580c] relative shadow-md">
              <span className="material-symbols-outlined text-[36px] animate-spin text-[#ea580c]">refresh</span>
            </div>

            <div>
              <h3 className="font-display font-extrabold text-xl text-[#1f242e]">Assembling Autonomous Workforce</h3>
              <span className="font-bold text-sm text-[#ea580c] block mt-1">جاري بدء بناء البرمجية وتشغيل المصنع 🚀</span>
            </div>

            <p className="text-xs text-[#554338] font-medium leading-relaxed">
              {launchSteps[launchStepIndex]}
            </p>

            <div className="w-full bg-[#faf8f5] border border-[#e5e3dd] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(launchStepIndex + 1) * 20}%` }}
              ></div>
            </div>

            <div className="text-xs text-orange-700 bg-orange-50 px-3 py-1 rounded-full border border-orange-200 flex items-center gap-1.5 font-bold mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Target SLA: 03m:45s remaining to first preview
            </div>
          </div>
        </div>
      )}
      {/* Human Approval Gate 1 Modal: Product & Spec Agent Output Signoff */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full border border-stone-200 shadow-2xl space-y-5 animate-in zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#ea580c] flex items-center justify-center text-white font-black text-lg shadow-sm">
                  01
                </div>
                <div>
                  <div className="text-[11px] font-mono text-[#ea580c] font-bold tracking-wider">HUMAN APPROVAL GATE 1</div>
                  <h3 className="font-display font-extrabold text-xl text-[#1c212c]">01. Product & Spec Agent Output</h3>
                </div>
              </div>
              <span className="px-3 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200 font-bold text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                Awaiting Your Signoff / بانتظار موافقتك
              </span>
            </div>

            {/* Spec List Box */}
            <div className="space-y-3 bg-[#f9f8f6] p-5 rounded-2xl border border-stone-200 text-xs font-sans">
              <div className="font-bold text-[#1c212c] text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ea580c]">assignment</span>
                  <span>Agent 01 Created Requirements & Data Model List:</span>
                </span>
                <span className="text-[10px] text-emerald-800 bg-emerald-100 font-mono font-bold px-2 py-0.5 rounded">
                  98.2% Spec Match
                </span>
              </div>
              
              <ul className="space-y-2.5 text-[#576071] pt-1">
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0">check_circle</span>
                  <span><strong>Product Name & Scope:</strong> {createdArtifact?.title || promptText.substring(0, 40) || 'Custom SaaS Platform'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0">check_circle</span>
                  <span><strong>Epics & Features:</strong> Interactive Booking Calendar, WhatsApp Reminders, Staff Scheduling & Payment Gateway Integration.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0">check_circle</span>
                  <span><strong>PostgreSQL Data Model:</strong> Initialized schema with 5 primary tables (<code>users</code>, <code>appointments</code>, <code>services</code>, <code>staff</code>, <code>audit_logs</code>).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0">check_circle</span>
                  <span><strong>Bilingual UI Support:</strong> Full Arabic (RTL) and English (LTR) language translation keys pre-allocated.</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setActiveTab('dashboard');
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-bold text-xs transition cursor-pointer"
              >
                ✏️ Request Spec Edits / تعديل المواصفات
              </button>

              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setActiveTab('roles');
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#ea580c] to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-extrabold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>✅ Approve Requirements & Start Google Stitch Design →</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
