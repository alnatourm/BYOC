import React, { useState } from 'react';
import { useBYOK } from '../context/BYOKContext';

export const DashboardView: React.FC = () => {
  const { artifacts, setSelectedArtifact, setActiveTab } = useBYOK();
  const [appIdeaInput, setAppIdeaInput] = useState('');

  const fillIdea = (text: string) => {
    setAppIdeaInput(text);
  };

  const handleBuildApp = () => {
    setActiveTab('build');
  };

  const docVaultArtifact = artifacts.find((a) => a.id === 'art-nova-saas-billing') || artifacts[0];

  return (
    <div className="flex flex-col w-full pb-16 font-sans text-[#1e2229]">
      {/* Warm Top Atmosphere Hero Section */}
      <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-b from-white via-[#fcfbf9] to-[#f1eee9] border border-[#e2ded8]/70 p-6 md:p-10 shadow-sm mb-8">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-orange-100/60 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-amber-100/50 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center space-y-4">
          {/* Founder Cheerful Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#e2ded8]/60 text-[#1e2229] shadow-sm mb-2">
            <span className="text-base">✨</span>
            <span className="font-medium">Zero code needed • بدون أي كود برمجي إطلاقاً</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]"></span>
            <span className="text-[#ea580c] font-bold">100% Beginner Friendly</span>
          </div>

          {/* Main Warm Header */}
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[#1e2229] tracking-tight">
            Good morning, Tariq! ☀️
          </h1>
          <p className="font-display text-xl md:text-2xl text-[#ea580c] font-semibold" dir="rtl">
            صباح الخير طارق! ماذا تود أن تصنع وتطلق لعملك اليوم؟
          </p>
          <p className="text-sm md:text-base text-[#5f6672] max-w-2xl leading-relaxed">
            Turn your business idea into a real, working app in minutes without touching a single line of code. Our cheerful AI team designs the screens, handles the data, and prepares everything for your customers!
          </p>

          {/* Conversational Idea Box (Card Pod) */}
          <div className="w-full bg-white rounded-xl p-6 border border-[#e2ded8]/70 shadow-md text-left flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[#1e2229] font-semibold text-base font-display">
                <span className="material-symbols-outlined text-[#ea580c] text-[24px]">draw</span>
                <span>Describe your dream app • صف فكرتك بأسلوبك اليومي</span>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 font-semibold text-xs text-[#003732] bg-[#ccfbf1]/50 border border-[#0d9488]/20 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#0d9488] animate-ping"></span>
                AI Copilot Listening
              </span>
            </div>

            <div className="relative w-full">
              <textarea
                value={appIdeaInput}
                onChange={(e) => setAppIdeaInput(e.target.value)}
                placeholder="e.g. An easy appointment booking app for my pet grooming salon with WhatsApp reminders and Arabic customer receipts... / مثال: تطبيق لحجز مواعيد لصالوني مع تذكير واتساب وقبول مدفوعات"
                rows={3}
                className="w-full bg-[#fcfbf9] border border-[#e2ded8]/60 rounded-xl p-4 text-sm text-[#1e2229] placeholder-[#948f88] focus:outline-none focus:border-[#ea580c] focus:bg-white focus:ring-2 focus:ring-[#ea580c]/20 shadow-inner transition-all resize-none"
              />
              {appIdeaInput && (
                <button
                  onClick={() => setAppIdeaInput('')}
                  className="absolute right-3 top-3 text-[#948f88] hover:text-[#1e2229]"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            {/* Quick Attachments & Helpers */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveTab('build')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#fcfbf9] hover:bg-[#f1eee9] border border-[#e2ded8]/60 text-[#1e2229] font-medium text-xs transition-all shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[#ea580c] text-[18px]">description</span>
                  <span>Add Notes or Docs</span>
                </button>
                <button
                  onClick={() => setActiveTab('build')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#fcfbf9] hover:bg-[#f1eee9] border border-[#e2ded8]/60 text-[#1e2229] font-medium text-xs transition-all shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[#0d9488] text-[18px]">mic</span>
                  <span>Voice Note (سجل صوتك)</span>
                </button>
                <button
                  onClick={() => setActiveTab('build')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#fcfbf9] hover:bg-[#f1eee9] border border-[#e2ded8]/60 text-[#1e2229] font-medium text-xs transition-all shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[#ea580c] text-[18px]">image</span>
                  <span>Sketch or Photo</span>
                </button>
              </div>

              {/* Big Warm Action Button */}
              <button
                onClick={handleBuildApp}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-semibold text-xs md:text-sm shadow-md hover:shadow-lg transition-all transform active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                <span>Build My App Now • ابدأ صنع تطبيقي</span>
              </button>
            </div>

            {/* Quick Idea Sparks */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-[#e2ded8]/40">
              <span className="text-xs text-[#5f6672] font-medium">Quick inspiration sparks (Click to try):</span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => fillIdea('☕ Artisanal Coffee Store & Delivery: Menu showcase, cart, WhatsApp orders, loyalty stamp card')}
                  className="px-3.5 py-1.5 rounded-full bg-[#fcfbf9] hover:bg-[#ffedd5]/70 border border-[#e2ded8]/50 text-[#1e2229] text-xs transition-colors shadow-sm cursor-pointer"
                >
                  ☕ Artisanal Coffee Store & Delivery
                </button>
                <button
                  onClick={() => fillIdea('💇 Salon & Spa Booking: Stylist portfolios, calendar slots, SMS reminders in Arabic and English')}
                  className="px-3.5 py-1.5 rounded-full bg-[#fcfbf9] hover:bg-[#ffedd5]/70 border border-[#e2ded8]/50 text-[#1e2229] text-xs transition-colors shadow-sm cursor-pointer"
                >
                  💇 Salon & Spa Booking
                </button>
                <button
                  onClick={() => fillIdea('📋 Client Intake & Document Vault: Digital sign-off, PDF upload, client status tracker')}
                  className="px-3.5 py-1.5 rounded-full bg-[#fcfbf9] hover:bg-[#ffedd5]/70 border border-[#e2ded8]/50 text-[#1e2229] text-xs transition-colors shadow-sm cursor-pointer"
                >
                  📋 Client Intake & Documents
                </button>
                <button
                  onClick={() => fillIdea('🏷️ Quick Inventory & Barcode Scanner: Simple stock in/out logger, low stock alert')}
                  className="px-3.5 py-1.5 rounded-full bg-[#fcfbf9] hover:bg-[#ffedd5]/70 border border-[#e2ded8]/50 text-[#1e2229] text-xs transition-colors shadow-sm cursor-pointer"
                >
                  🏷️ Inventory & Barcode Tracker
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dummy-Proof 3-Step Reassurance Ribbon */}
      <div className="w-full bg-white rounded-xl p-6 md:p-8 border border-[#e2ded8]/60 shadow-sm mb-8">
        <div className="text-center max-w-xl mx-auto mb-6 space-y-1">
          <span className="text-xs uppercase tracking-widest text-[#ea580c] font-bold">Clear & Stress-Free Process</span>
          <h2 className="font-display text-2xl font-bold text-[#1e2229]">
            How It Works in 3 Gentle Steps
          </h2>
          <p className="text-sm text-[#5f6672]" dir="rtl">
            كيف يعمل مصنع التطبيقات الذكي بكل سهولة وبدون تعقيد
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-[#fcfbf9] rounded-xl p-5 border border-[#e2ded8]/60 flex flex-col gap-2 relative overflow-hidden transition-all hover:bg-white hover:shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-[#ea580c] font-display text-2xl shadow-sm mb-2">
              💡
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-base text-[#1e2229] font-display">1. Tell Us Your Idea</span>
              <span className="text-xs text-[#ea580c] font-bold">خطوة ١</span>
            </div>
            <p className="text-xs text-[#5f6672] leading-relaxed">
              Describe what your business needs in everyday, conversational language or record your voice. No tech specs needed.
            </p>
            <span className="text-xs text-[#ea580c] font-medium mt-1" dir="rtl">تحدث بلهجتك الطبيعية وفريقنا يفهم كل التفاصيل</span>
          </div>

          {/* Step 2 */}
          <div className="bg-[#fcfbf9] rounded-xl p-5 border border-[#e2ded8]/60 flex flex-col gap-2 relative overflow-hidden transition-all hover:bg-white hover:shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-[#ea580c] font-display text-2xl shadow-sm mb-2">
              🪄
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-base text-[#1e2229] font-display">2. AI Builds It For You</span>
              <span className="text-xs text-[#ea580c] font-bold">خطوة ٢</span>
            </div>
            <p className="text-xs text-[#5f6672] leading-relaxed">
              Our smart system crafts your screen layouts, customer databases, and automated WhatsApp buttons quietly behind the scenes.
            </p>
            <span className="text-xs text-[#ea580c] font-medium mt-1" dir="rtl">الذكاء يبني القوائم وقواعد البيانات تلقائياً</span>
          </div>

          {/* Step 3 */}
          <div className="bg-[#fcfbf9] rounded-xl p-5 border border-[#e2ded8]/60 flex flex-col gap-2 relative overflow-hidden transition-all hover:bg-white hover:shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-teal-100 border border-teal-200 flex items-center justify-center text-[#0d9488] font-display text-2xl shadow-sm mb-2">
              🚀
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-base text-[#1e2229] font-display">3. Preview & Launch</span>
              <span className="text-xs text-[#0d9488] font-bold">خطوة ٣</span>
            </div>
            <p className="text-xs text-[#5f6672] leading-relaxed">
              Tap the interactive prototype directly on your smartphone. When you are happy, publish your live app link with one single click!
            </p>
            <span className="text-xs text-[#0d9488] font-medium mt-1" dir="rtl">جرّب التطبيق بهاتفك وانشره لزبائنك بضغطة زر</span>
          </div>
        </div>
      </div>

      {/* Studio Snapshot Metric Pills */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Stat 1 */}
        <div className="bg-white rounded-xl p-5 border border-[#e2ded8]/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="w-10 h-10 rounded-xl bg-[#f1eee9] flex items-center justify-center text-[#1e2229]">
              <span className="material-symbols-outlined text-[20px]">apps</span>
            </span>
            <span className="text-xs text-[#5f6672] font-medium">Total Apps • المجموع</span>
          </div>
          <div className="mt-4">
            <span className="font-display text-3xl font-bold text-[#1e2229]">4</span>
            <p className="text-xs text-[#5f6672] mt-0.5">Active in your studio</p>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white rounded-xl p-5 border border-[#e2ded8]/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#ea580c]">
              <span className="material-symbols-outlined text-[20px] animate-spin">cyclone</span>
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#ea580c] bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#ea580c] animate-pulse"></span>
              Building
            </span>
          </div>
          <div className="mt-4">
            <span className="font-display text-3xl font-bold text-[#ea580c]">2</span>
            <p className="text-xs text-[#5f6672] mt-0.5">Crafting right now • قيد الإنشاء</p>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white rounded-xl p-5 border-2 border-[#ea580c]/40 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="w-10 h-10 rounded-xl bg-[#ea580c] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">touch_app</span>
            </span>
            <span className="text-xs text-[#ea580c] font-bold bg-orange-100 px-2 py-0.5 rounded-full">
              Action Ready!
            </span>
          </div>
          <div className="mt-4">
            <span className="font-display text-3xl font-bold text-[#ea580c]">1</span>
            <p className="text-xs text-[#5f6672] mt-0.5">Waiting for your touch • بانتظار رأيك</p>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white rounded-xl p-5 border border-[#e2ded8]/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-[#0d9488]">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
            </span>
            <span className="text-xs text-[#0d9488] font-bold bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
              Serving Clients
            </span>
          </div>
          <div className="mt-4">
            <span className="font-display text-3xl font-bold text-[#0d9488]">1</span>
            <p className="text-xs text-[#5f6672] mt-0.5">Live & taking orders • مباشر ويعمل</p>
          </div>
        </div>
      </div>

      {/* Main 12-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Columns: Active Apps Feed */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-[#1e2229]">
                My Software Workshop • تطبيقاتي
              </h2>
              <p className="text-xs text-[#5f6672] mt-0.5">
                Every screen is fully customizable with zero technical hurdles.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('build')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#ea580c] hover:text-orange-700 transition-colors cursor-pointer"
            >
              <span>View All (4)</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>

          {/* App Card 1: Needs Tariq's Review (Hero Card) */}
          <div className="bg-white rounded-xl p-6 border border-[#e2ded8]/70 shadow-md flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-orange-100/40 rounded-bl-full pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-[#ea580c] shadow-inner shrink-0">
                  <span className="material-symbols-outlined text-[30px]">folder_shared</span>
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 border border-orange-200 text-[#ea580c] text-xs font-bold mb-1">
                    <span>🎨 Design Preview Ready! • التصميم جاهز للمعاينة</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#1e2229]">
                    Document Vault & Signatures
                  </h3>
                  <span className="text-xs text-[#5f6672] font-medium" dir="rtl">نظام إدارة الوثائق والتوقيع الإلكتروني للعملاء</span>
                </div>
              </div>

              <div className="text-right flex flex-col sm:items-end">
                <span className="font-display text-2xl text-[#ea580c] font-bold">65%</span>
                <span className="text-xs text-[#5f6672]">Prototype Complete</span>
              </div>
            </div>

            {/* Progress Bar Warm Orange */}
            <div className="w-full bg-[#f1eee9] rounded-full h-3 overflow-hidden">
              <div className="bg-[#ea580c] h-full rounded-full transition-all duration-1000" style={{ width: '65%' }}></div>
            </div>

            {/* Cheerful Note from AI Designer */}
            <div className="bg-[#fcfbf9] rounded-xl p-3 border border-[#e2ded8]/50 flex items-start gap-2 text-[#1e2229] text-xs">
              <span className="material-symbols-outlined text-[#ea580c] text-[20px] shrink-0 mt-0.5">sentiment_very_satisfied</span>
              <p className="leading-relaxed">
                <strong className="font-semibold text-[#ea580c]">Message from Maya (AI Designer):</strong> "I designed the mobile sign-up form, customer intake cards, and WhatsApp PDF delivery. Tap preview below to test the buttons!"
              </p>
            </div>

            {/* Visual Mini Mockup Preview Image */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <div className="relative rounded-lg overflow-hidden h-28 bg-[#f1eee9] border border-[#e2ded8]/60 group">
                <img
                  src="https://images.unsplash.com/photo-1555421689-491a97ff2040?w=600&auto=format&fit=crop&q=80"
                  alt="Client Sign-in"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                  <span className="text-xs text-white font-semibold">1. Client Sign-in</span>
                </div>
              </div>

              <div className="relative rounded-lg overflow-hidden h-28 bg-[#f1eee9] border border-[#e2ded8]/60 group">
                <img
                  src="https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=600&auto=format&fit=crop&q=80"
                  alt="PDF Vault"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                  <span className="text-xs text-white font-semibold">2. PDF Vault</span>
                </div>
              </div>

              <div className="relative rounded-lg overflow-hidden h-28 bg-[#f1eee9] border border-[#e2ded8]/60 group">
                <img
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80"
                  alt="WhatsApp Receipt"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                  <span className="text-xs text-white font-semibold">3. WhatsApp Receipt</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedArtifact(docVaultArtifact)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#f1eee9] border border-[#e2ded8]/60 text-[#1e2229] font-medium text-xs transition-all shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#5f6672]">chat_bubble</span>
                  <span>Request Tweaks • اطلب تعديلاً</span>
                </button>
                <button
                  onClick={() => setSelectedArtifact(docVaultArtifact)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#f1eee9] border border-[#e2ded8]/60 text-[#1e2229] font-medium text-xs transition-all shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#5f6672]">share</span>
                  <span>Share Preview</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedArtifact(docVaultArtifact)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#ea580c] text-white hover:bg-orange-700 font-semibold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">visibility</span>
                <span>Try Interactive Preview • عاين واختبر الآن</span>
              </button>
            </div>
          </div>

          {/* App Card 2: AI Building in Progress */}
          <div className="bg-white rounded-xl p-5 border border-[#e2ded8]/60 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-[#ea580c] shrink-0">
                  <span className="material-symbols-outlined text-[26px]">apartment</span>
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-[#ea580c] text-xs font-semibold mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] animate-pulse"></span>
                    <span>🛠️ AI Building Your Database • جاري تهيئة البيانات</span>
                  </div>
                  <h3 className="font-display text-base font-bold text-[#1e2229]">
                    Real Estate Client Portal
                  </h3>
                  <p className="text-xs text-[#5f6672]">
                    Property catalog, virtual tour scheduling & lead capture form
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col sm:items-end justify-between items-center">
                <span className="text-xs text-[#5f6672] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#ea580c]">schedule</span>
                  ~15 mins remaining
                </span>
                <span className="font-display text-base text-[#ea580c] font-bold">40%</span>
              </div>
            </div>

            <div className="w-full bg-[#f1eee9] rounded-full h-2 overflow-hidden">
              <div className="bg-[#ea580c] h-full rounded-full" style={{ width: '40%' }}></div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-[#948f88]">
                Step 2 of 4: Generating property listing columns & photo galleries
              </span>
              <button
                onClick={() => setActiveTab('build')}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white hover:bg-[#f1eee9] border border-[#e2ded8]/60 text-[#1e2229] transition-colors shadow-sm cursor-pointer font-medium"
              >
                <span>Open Details</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>

          {/* App Card 3: Live App Taking Customers */}
          <div className="bg-white rounded-xl p-5 border border-[#e2ded8]/60 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-100 border border-teal-200 flex items-center justify-center text-[#0d9488] shrink-0">
                  <span className="material-symbols-outlined text-[26px]">coffee</span>
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-[#003732] text-xs font-semibold mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0d9488]"></span>
                    <span>🟢 Live & Running Smoothly • مباشر ويعمل بنجاح</span>
                  </div>
                  <h3 className="font-display text-base font-bold text-[#1e2229]">
                    Coffee Roastery Quick Delivery
                  </h3>
                  <p className="text-xs text-[#5f6672]">
                    Live link: <code className="bg-[#f1eee9] px-1.5 py-0.5 rounded text-[#ea580c] font-semibold">roastery.ogroup.app</code>
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#f1eee9] text-[#1e2229] text-xs font-medium self-start">
                <span className="material-symbols-outlined text-[#0d9488] text-[16px]">shopping_bag</span>
                48 Orders Today
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#e2ded8]/40 text-xs">
              <span className="inline-flex items-center gap-1 text-[#0d9488] font-medium">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                100% uptime this week
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('build')}
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#f1eee9] border border-[#e2ded8]/60 text-[#1e2229] transition-colors shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">insights</span>
                  <span>Analytics</span>
                </button>
                <button
                  onClick={() => setActiveTab('build')}
                  className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#0d9488] text-white hover:bg-teal-700 text-xs font-medium transition-colors shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  <span>Visit Live App • فتح التطبيق</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: Cheerful AI Guide & Knowledge Pod */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Friendly AI Mascot Guide Card */}
          <div className="bg-white rounded-xl p-5 border border-[#e2ded8]/60 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-[#ea580c] shadow-sm">
                <span className="material-symbols-outlined text-[26px]">smart_toy</span>
              </div>
              <div>
                <h4 className="font-display text-base font-bold text-[#1e2229]">Meet Your AI Crew</h4>
                <p className="text-xs text-[#5f6672]">Always on call for edits</p>
              </div>
            </div>
            <p className="text-xs text-[#5f6672] leading-relaxed">
              Maya designs your screens, Sami hooks up WhatsApp, and Rami automates your payments. Just ask in plain Arabic or English!
            </p>
            <div className="p-2.5 bg-[#fcfbf9] rounded-lg border border-[#e2ded8]/50 flex items-center justify-between text-[#1e2229] text-xs font-medium">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-teal-500"></span> 3 AI Assistants Active</span>
              <span className="text-[#ea580c] font-semibold">Ready</span>
            </div>
          </div>

          {/* Quick Founder Tips & Learning Bento */}
          <div className="bg-white rounded-xl p-5 border border-[#e2ded8]/60 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-base font-bold text-[#1e2229]">Founder Quick Tips</h4>
              <span className="material-symbols-outlined text-[#ea580c] text-[20px]">lightbulb</span>
            </div>
            <div className="flex flex-col gap-2 text-xs text-[#5f6672]">
              <div className="p-2.5 rounded-lg bg-[#fcfbf9] border border-[#e2ded8]/40 flex items-start gap-2">
                <span className="material-symbols-outlined text-[#ea580c] text-[18px] shrink-0 mt-0.5">check_circle</span>
                <span>Use Arabic voice notes to describe complex booking workflows without writing.</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#fcfbf9] border border-[#e2ded8]/40 flex items-start gap-2">
                <span className="material-symbols-outlined text-[#ea580c] text-[18px] shrink-0 mt-0.5">check_circle</span>
                <span>One-click export directly connects with local payment gateways (Mada, Apple Pay).</span>
              </div>
            </div>
          </div>

          {/* Warm Founder Support Card */}
          <div className="bg-gradient-to-br from-[#ea580c] to-[#c2410c] rounded-xl p-5 text-white shadow-md flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px]">support_agent</span>
              <h4 className="font-display text-base font-bold">1-on-1 Concierge Help</h4>
            </div>
            <p className="text-xs text-orange-100 leading-relaxed">
              Have a specific business requirement? Book a quick 10-minute setup call with a senior solution builder.
            </p>
            <button 
              onClick={() => setActiveTab('build')}
              className="mt-2 w-full py-2.5 rounded-full bg-white text-[#ea580c] font-bold text-xs hover:bg-orange-50 transition-colors shadow cursor-pointer"
            >
              Book Free Call • حجز استشارة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
