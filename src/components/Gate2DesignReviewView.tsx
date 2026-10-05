import React, { useState } from 'react';
import { useBYOK } from '../context/BYOKContext';

interface ServiceItem {
  id: string;
  title: string;
  price: number;
  duration: string;
  badge: string;
  icon: string;
}

interface StylistItem {
  id: string;
  name: string;
  title: string;
  exp: string;
  avatar: string;
}

export const Gate2DesignReviewView: React.FC = () => {
  const { setActiveTab, setCurrentGateStep, selectedArtifact } = useBYOK();
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isApproved, setIsApproved] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [tweakInput, setTweakInput] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Dynamic Prompt Classification
  const promptDesc = selectedArtifact?.description || selectedArtifact?.title || 'build a salon booking app for my saloon colors gold and white name sameer saloon';
  const isSalonPrompt = promptDesc.toLowerCase().includes('sal') || 
                        promptDesc.toLowerCase().includes('hair') || 
                        promptDesc.toLowerCase().includes('barber') || 
                        promptDesc.toLowerCase().includes('sameer');

  // Sameer Saloon Interactive Booking State
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedStylist, setSelectedStylist] = useState<string>('sameer');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('11:30 AM');
  const [clientName, setClientName] = useState('Tariq Al-Natour');
  const [clientPhone, setClientPhone] = useState('+966 50 882 1099');
  const [showBookingModal, setShowBookingModal] = useState(false);

  const services: ServiceItem[] = [
    {
      id: 'srv-1',
      title: '✂️ VIP Haircut & Beard Styling',
      price: 180,
      duration: '45 Mins',
      badge: 'Most Popular',
      icon: 'content_cut'
    },
    {
      id: 'srv-2',
      title: '💈 Master Beard Grooming & Hot Towel',
      price: 120,
      duration: '30 Mins',
      badge: 'Classic',
      icon: 'face'
    },
    {
      id: 'srv-3',
      title: '🧖 Royal Hair Care & Keratin Treatment',
      price: 260,
      duration: '60 Mins',
      badge: 'Luxury Care',
      icon: 'spa'
    },
    {
      id: 'srv-4',
      title: '👑 Full Executive Sameer Grooming Package',
      price: 380,
      duration: '90 Mins',
      badge: 'Signature VIP',
      icon: 'workspace_premium'
    }
  ];

  const stylists: StylistItem[] = [
    {
      id: 'sameer',
      name: 'Master Sameer',
      title: 'Head Stylist & Owner',
      exp: '14 Yrs Exp',
      avatar: '👑'
    },
    {
      id: 'ahmed',
      name: 'Specialist Ahmed',
      title: 'Beard & Razor Specialist',
      exp: '9 Yrs Exp',
      avatar: '💈'
    },
    {
      id: 'youssef',
      name: 'Stylist Youssef',
      title: 'Modern Hair Trends',
      exp: '7 Yrs Exp',
      avatar: '✂️'
    }
  ];

  const timeSlots = ['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:00 PM', '08:15 PM'];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  const handleRequestChanges = () => {
    const reason = prompt('Enter specific design change request for Layla (UI/UX Agent):', 'Adjust Gold (#d97706) header accent & font contrast');
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
      showToast('✅ Gate 2 Approved! Sameer Saloon Gold & White Design Tokens locked. Unlocking Stage 03: Developer Agent...');
      setTimeout(() => {
        setCurrentGateStep('gate3');
      }, 600);
    }, 800);
  };

  const getViewportWidthClass = () => {
    if (viewportMode === 'mobile') return 'max-w-[390px] mx-auto min-h-[680px] shadow-2xl rounded-[38px] border-8 border-stone-800 my-4';
    if (viewportMode === 'tablet') return 'max-w-[768px] mx-auto min-h-[600px] shadow-xl rounded-3xl border-4 border-stone-700 my-2';
    return 'w-full min-h-[500px]';
  };

  return (
    <div className="flex flex-col w-full pb-32 font-sans text-[#1f242e] bg-[#f8f7f5] min-h-screen">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-8 bg-white border-2 border-[#d97706] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-[#1f242e] z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="material-symbols-outlined text-[#d97706] text-[24px]">content_cut</span>
          <div>
            <p className="font-display font-bold text-sm text-[#d97706]">Gate 2 Stitch Engine Update</p>
            <p className="text-xs text-stone-600">{toastMsg}</p>
          </div>
        </div>
      )}

      {/* Top Breadcrumb & Metadata Banner */}
      <div className="pt-4 pb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium text-stone-600">
            <span className="px-2.5 py-1 rounded-md bg-stone-100 font-bold text-[#1f242e] border border-stone-200">
              PRJ-8842
            </span>
            <span className="text-stone-300">/</span>
            <span className="font-display text-base text-[#d97706] font-bold">
              Sameer Saloon • Salon Booking App
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
              Gold & White Theme v1.0
            </span>
            <span className="text-stone-300">•</span>
            <span className="flex items-center gap-1 text-teal-700 font-bold">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              Spec Locked from Gate 1
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-[#d97706] font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-[#d97706] animate-ping"></span>
              Gate 2 Mandatory Approval • Google Stitch Gold & White Tokens
            </div>
          </div>
        </div>

        {/* 5-Stage Stepper Bar */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="flex items-center gap-2 p-2.5 bg-stone-50 rounded-lg">
              <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs">✓</div>
              <div className="flex flex-col truncate text-xs">
                <span className="font-bold text-[#1f242e]">01. SPEC AGENT</span>
                <span className="text-teal-700 text-[10px]">Gate 1 Passed ✓</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-amber-50 border-2 border-[#d97706] rounded-lg shadow-2xs">
              <div className="w-7 h-7 rounded-full bg-[#d97706] text-white flex items-center justify-center font-bold text-xs">02</div>
              <div className="flex flex-col truncate text-xs">
                <span className="font-bold text-[#d97706]">UI/UX DESIGN</span>
                <span className="text-[#d97706] text-[10px] font-bold">Sameer Saloon UI</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-stone-50 opacity-60 rounded-lg">
              <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center font-bold text-xs">🔒</div>
              <div className="flex flex-col truncate text-xs">
                <span className="font-bold text-stone-500">03. DEV AGENT</span>
                <span className="text-stone-400 text-[10px]">Awaiting Gate 2</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-stone-50 opacity-60 rounded-lg">
              <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center font-bold text-xs">🔒</div>
              <div className="flex flex-col truncate text-xs">
                <span className="font-bold text-stone-500">04. QC & SECURITY</span>
                <span className="text-stone-400 text-[10px]">Awaiting Gate 3</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-stone-50 opacity-60 rounded-lg">
              <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center font-bold text-xs">🔒</div>
              <div className="flex flex-col truncate text-xs">
                <span className="font-bold text-stone-500">05. DEPLOYMENT</span>
                <span className="text-stone-400 text-[10px]">Awaiting Gate 4</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agent 02 Bio & Synthesis Header */}
      <section className="mb-6">
        <div className="bg-white p-6 rounded-3xl shadow-xs border border-stone-200 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#d97706] to-amber-500 flex items-center justify-center text-white shadow-md">
                  <span className="material-symbols-outlined text-[28px]">content_cut</span>
                </div>
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-teal-600 flex items-center justify-center text-white text-[11px] font-bold">
                  ✓
                </span>
              </div>

              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-xl font-bold text-[#1f242e]">
                    Layla • UI/UX Designer Agent (Google Stitch AI)
                  </h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-[#d97706] font-bold">
                    Gold (#d97706) & Crisp White (#ffffff) Theme
                  </span>
                </div>
                <p className="text-xs md:text-sm text-stone-600 mt-1 font-medium">
                  Synthesized Sameer Saloon luxury appointment booking prototype with service menu, stylist selection, slot picker, and WhatsApp ticket confirmation in 18 seconds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Prototype & Viewport Canvas */}
      <section className="mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-xs border border-stone-200 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#d97706]">smart_display</span>
              <h3 className="font-display font-bold text-base text-[#1f242e]">
                Google Stitch Live Canvas • Sameer Saloon
              </h3>
            </div>

            {/* Viewport Controls */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setViewportMode('desktop')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                  viewportMode === 'desktop' ? 'bg-white text-[#d97706] shadow-2xs' : 'text-stone-600'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">desktop_windows</span>
                <span>Desktop (1440px)</span>
              </button>

              <button
                onClick={() => setViewportMode('tablet')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                  viewportMode === 'tablet' ? 'bg-white text-[#d97706] shadow-2xs' : 'text-stone-600'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">tablet_mac</span>
                <span>Tablet</span>
              </button>

              <button
                onClick={() => setViewportMode('mobile')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                  viewportMode === 'mobile' ? 'bg-white text-[#d97706] shadow-2xs' : 'text-stone-600'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">smartphone</span>
                <span>Mobile (390px)</span>
              </button>
            </div>
          </div>

          {/* Rendered Live Canvas Container */}
          <div className="bg-stone-100 p-4 md:p-6 rounded-2xl border border-stone-200 overflow-hidden">
            <div className={`transition-all duration-300 ${getViewportWidthClass()}`}>
              {/* Fake Browser Window Chrome */}
              <div className="bg-[#d97706] text-white px-4 py-3 rounded-t-2xl flex items-center justify-between border-b border-amber-600 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-300"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-200"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-300"></span>
                  <span className="font-mono text-xs text-amber-100 ml-2 font-bold">
                    https://sameer-saloon.sa/book
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="bg-amber-800 px-2 py-0.5 rounded text-white text-[10px]">Gold & White Theme</span>
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                </div>
              </div>

              {/* Sameer Saloon Interactive Body */}
              <div className="bg-white text-[#1f242e] p-6 rounded-b-2xl shadow-inner min-h-[480px] space-y-6">
                {/* Saloon Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#d97706] to-amber-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
                      ✂️
                    </div>
                    <div>
                      <h2 className="font-display font-black text-xl text-[#1f242e]">
                        Sameer Saloon • صالون سمير الفاخر
                      </h2>
                      <p className="text-xs text-stone-500 font-semibold">
                        VIP Haircut, Grooming & Styling Lounge • Riyadh Olaya Branch
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-[#d97706] font-extrabold text-xs border border-amber-200">
                      ✨ Gold & Crisp White Premium Edition
                    </span>
                  </div>
                </div>

                {/* Service Selection Section */}
                <div className="space-y-3">
                  <h3 className="font-display font-bold text-sm text-[#1f242e] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#d97706]">content_cut</span>
                    <span>Select Grooming Service • اختر الخدمة المطلوبة</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((srv) => (
                      <div
                        key={srv.id}
                        onClick={() => setSelectedService(srv)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-2xs ${
                          selectedService?.id === srv.id
                            ? 'border-2 border-[#d97706] bg-amber-50/70'
                            : 'border-stone-200 hover:border-amber-300 bg-white'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#1f242e]">{srv.title}</span>
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-[#d97706] text-[10px] font-bold">
                              {srv.badge}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 font-semibold">Duration: {srv.duration}</p>
                        </div>

                        <div className="text-right">
                          <span className="font-display text-lg font-extrabold text-[#d97706] block">
                            SAR {srv.price}
                          </span>
                          <button className="text-[11px] font-bold text-[#d97706] underline mt-0.5">
                            {selectedService?.id === srv.id ? 'Selected ✓' : 'Select Service'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stylist Selection */}
                <div className="space-y-3 pt-2">
                  <h3 className="font-display font-bold text-sm text-[#1f242e] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#d97706]">face</span>
                    <span>Select Stylist / Barber • اختر الحلاق المفضل</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {stylists.map((st) => (
                      <div
                        key={st.id}
                        onClick={() => setSelectedStylist(st.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                          selectedStylist === st.id
                            ? 'border-2 border-[#d97706] bg-amber-50/70 shadow-2xs'
                            : 'border-stone-200 bg-white hover:border-amber-300'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl font-bold">
                          {st.avatar}
                        </div>
                        <div>
                          <strong className="text-xs font-bold text-[#1f242e] block">{st.name}</strong>
                          <span className="text-[10px] text-stone-500 block font-semibold">{st.title}</span>
                          <span className="text-[10px] text-[#d97706] font-bold">{st.exp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time Slot Picker */}
                <div className="space-y-3 pt-2">
                  <h3 className="font-display font-bold text-sm text-[#1f242e] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#d97706]">schedule</span>
                    <span>Select Time Slot Today • حدد وقت الحجز المناسب</span>
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                          selectedTimeSlot === slot
                            ? 'bg-[#d97706] text-white shadow-md'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Book Action Banner */}
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-stone-600 font-bold block">
                      Booking Summary for Sameer Saloon:
                    </span>
                    <strong className="text-sm font-bold text-[#d97706]">
                      {selectedService ? selectedService.title : 'VIP Haircut & Beard Styling'}
                    </strong>
                    <span className="text-xs text-stone-500 block font-semibold mt-0.5">
                      Stylist: {stylists.find((s) => s.id === selectedStylist)?.name} • Time: {selectedTimeSlot}
                    </span>
                  </div>

                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="px-6 py-3 rounded-xl bg-[#d97706] hover:bg-amber-700 text-white font-extrabold text-xs shadow-md transition cursor-pointer flex items-center gap-2 shrink-0"
                  >
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>Book Appointment at Sameer Saloon ✂️</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#d97706] text-[24px]">content_cut</span>
                <div>
                  <h3 className="font-display font-bold text-base text-[#1f242e]">Confirm Sameer Saloon Ticket</h3>
                  <p className="text-xs text-stone-500">تأكيد حجز الموعد في صالون سمير</p>
                </div>
              </div>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Client Full Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-semibold outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Phone Number (WhatsApp Confirmation)</label>
                <input
                  type="text"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-semibold outline-none font-mono"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                <strong className="text-[#d97706] block font-bold">Appointment Ticket:</strong>
                <span className="text-stone-700 block font-semibold">Sameer Saloon Olaya Branch</span>
                <span className="text-stone-500 text-[11px] block font-mono">
                  Time: {selectedTimeSlot} • Total: SAR {selectedService ? selectedService.price : 180}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                showToast(`✂️ Appointment confirmed at Sameer Saloon for ${clientName}! Instant WhatsApp confirmation ticket sent to ${clientPhone}.`);
                setShowBookingModal(false);
              }}
              className="w-full py-3 rounded-xl bg-[#d97706] hover:bg-amber-700 text-white font-extrabold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Confirm & Dispatch WhatsApp Ticket ➔</span>
            </button>
          </div>
        </div>
      )}

      {/* Sticky Bottom Human Approval Gate 2 Action Bar */}
      <div className="fixed bottom-0 left-0 md:left-72 right-0 bg-white/95 backdrop-blur-xl p-4 z-40 border-t border-stone-200 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 text-[#d97706] flex items-center justify-center font-bold">
              02
            </div>
            <div>
              <span className="font-display text-sm font-bold text-[#1f242e]">
                Human Approval Gate 2: Approve Sameer Saloon Design Tokens
              </span>
              <p className="text-xs text-stone-600">
                Authorizes <strong className="text-[#1f242e]">03. Developer Agent (Nour)</strong> to compile React 19 + TypeScript + Fastify APIs for Sameer Saloon.
              </p>
            </div>
          </div>

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
                  ? 'bg-emerald-600 hover:bg-emerald-700' 
                  : 'bg-gradient-to-r from-[#d97706] to-amber-600 hover:from-amber-700 hover:to-amber-800'
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
