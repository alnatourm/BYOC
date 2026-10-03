import React, { useState } from 'react';

interface LiveAppPreviewCanvasProps {
  title: string;
  category?: string;
  description?: string;
}

export const LiveAppPreviewCanvas: React.FC<LiveAppPreviewCanvasProps> = ({ title, category = '', description = '' }) => {
  const fullPromptText = (title + ' ' + category + ' ' + description).toLowerCase();

  // Canvas View Mode Override State (Allows switching Google Stitch canvas templates live)
  const [activeCanvasTemplate, setActiveCanvasTemplate] = useState<'salon' | 'saas' | 'doc_control' | 'coffee'>(
    fullPromptText.includes('saloon') || fullPromptText.includes('salon') || fullPromptText.includes('booking') || fullPromptText.includes('faraj') || fullPromptText.includes('barber')
      ? 'salon'
      : 'salon' // Default to Salon preview so Google Stitch design is immediately visible!
  );

  // Helper to extract clean business name
  const getDisplayName = () => {
    if (fullPromptText.includes('faraj') || fullPromptText.includes('faraj salon')) {
      return 'Faraj Salon & Spa • صالون الفرج';
    }
    if (title.toUpperCase().includes('SALOON') || title.toUpperCase().includes('SALON') || title.toLowerCase().includes('website for my app')) {
      return 'Faraj Salon & Spa • صالون الفرج';
    }
    return title || 'Faraj Salon & Spa • صالون الفرج';
  };

  const displayName = getDisplayName();

  // Helper to detect requested color theme
  const isBlueTheme = true; // White and Blue theme requested for Faraj Salon & Google Stitch Canvas!

  // Dynamic Theme Styling
  const primaryBg = isBlueTheme ? 'bg-[#2563eb] hover:bg-[#1d4ed8]' : 'bg-[#ea580c] hover:bg-orange-700';
  const primaryText = isBlueTheme ? 'text-[#2563eb]' : 'text-[#ea580c]';
  const primaryBorder = isBlueTheme ? 'border-[#3b82f6]' : 'border-[#ea580c]';
  const lightBg = isBlueTheme ? 'bg-blue-50/80' : 'bg-orange-50/80';
  const lightBorder = isBlueTheme ? 'border-blue-200' : 'border-orange-200';
  const ringColor = isBlueTheme ? 'ring-blue-200' : 'ring-orange-200';

  // Active Tab state inside previewed app
  const [activeTab, setActiveTab] = useState('overview');
  
  // Salon Booking State
  const [selectedService, setSelectedService] = useState('haircut');
  const [selectedStaff, setSelectedStaff] = useState('Maya (Senior Stylist)');
  const [selectedTime, setSelectedTime] = useState('02:30 PM');
  const [clientName, setClientName] = useState('Tariq Al-Natour');
  const [clientPhone, setClientPhone] = useState('+966 50 123 4567');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // SaaS Billing State
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  // Interactive Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* Google Stitch AI Canvas Template Switcher Bar */}
      <div className="bg-white p-3 rounded-xl border border-[#e2d9d2] flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-xs text-[#1c212c] font-display flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-[#2563eb]">palette</span>
            Google Stitch AI Canvas Engine Template:
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <button
            onClick={() => setActiveCanvasTemplate('salon')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCanvasTemplate === 'salon'
                ? 'bg-[#2563eb] text-white shadow-sm ring-2 ring-blue-200'
                : 'bg-[#f9f8f6] text-[#576071] border border-[#e2d9d2] hover:bg-blue-50 hover:text-[#2563eb]'
            }`}
          >
            <span>✂️ Faraj Salon (White & Blue)</span>
          </button>

          <button
            onClick={() => setActiveCanvasTemplate('saas')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCanvasTemplate === 'saas'
                ? 'bg-[#2563eb] text-white shadow-sm ring-2 ring-blue-200'
                : 'bg-[#f9f8f6] text-[#576071] border border-[#e2d9d2] hover:bg-blue-50 hover:text-[#2563eb]'
            }`}
          >
            <span>📊 SaaS Analytics Portal</span>
          </button>

          <button
            onClick={() => setActiveCanvasTemplate('doc_control')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCanvasTemplate === 'doc_control'
                ? 'bg-[#2563eb] text-white shadow-sm ring-2 ring-blue-200'
                : 'bg-[#f9f8f6] text-[#576071] border border-[#e2d9d2] hover:bg-blue-50 hover:text-[#2563eb]'
            }`}
          >
            <span>📄 Document Control Vault</span>
          </button>

          <button
            onClick={() => setActiveCanvasTemplate('coffee')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCanvasTemplate === 'coffee'
                ? 'bg-[#2563eb] text-white shadow-sm ring-2 ring-blue-200'
                : 'bg-[#f9f8f6] text-[#576071] border border-[#e2d9d2] hover:bg-blue-50 hover:text-[#2563eb]'
            }`}
          >
            <span>☕ Coffee Delivery</span>
          </button>
        </div>
      </div>

      {/* Render Template 1: Salon Booking (Faraj Salon - White & Blue Theme) */}
      {activeCanvasTemplate === 'salon' && (
        <div className="w-full bg-[#f8fafc] rounded-2xl border-2 border-blue-200 overflow-hidden shadow-lg">
          {/* Simulated Browser Header */}
          <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              <div className="ml-2 px-3 py-0.5 bg-white rounded-md text-[11px] text-slate-500 font-mono border border-slate-200">
                🔒 https://faraj-salon.ogroup.app/booking
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#2563eb] text-[11px] font-bold flex items-center gap-1">
              <span>🎨 Google Stitch AI Canvas · White & Blue</span>
            </span>
          </div>

          {/* Salon Header with Custom Business Name & Colors */}
          <div className="bg-white p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${primaryBg} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                ✂️
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-slate-900">{displayName}</h3>
                <p className="text-xs text-slate-500">Riyadh Olaya District · Online Booking & Appointments</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className={`px-3 py-1 rounded-full ${lightBg} ${primaryText} font-bold border ${lightBorder}`}>
                ⭐ 4.9 (320 Reviews)
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                Open Today: 10 AM - 10 PM
              </span>
            </div>
          </div>

          {/* Salon Main Interactive Booking Flow */}
          <div className="p-6 space-y-6">
            {toastMsg && (
              <div className="p-3.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>{toastMsg}</span>
              </div>
            )}

            {bookingConfirmed ? (
              <div className="p-8 bg-white rounded-2xl border-2 border-emerald-300 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl font-bold">
                  ✓
                </div>
                <h4 className="font-display font-bold text-xl text-slate-900">Appointment Booked at {displayName}! 🎉</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Confirmation SMS & WhatsApp sent to <strong className="text-slate-900">{clientPhone}</strong>. See you on <strong className={primaryText}>Today at {selectedTime}</strong> with {selectedStaff}!
                </p>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 max-w-sm mx-auto text-xs text-left space-y-1 font-mono">
                  <div>Salon: <strong className="text-slate-900">{displayName}</strong></div>
                  <div>Service: <strong className="text-slate-900">{selectedService.toUpperCase()}</strong></div>
                  <div>Staff: <strong className="text-slate-900">{selectedStaff}</strong></div>
                  <div>Time: <strong className={primaryText}>{selectedTime}</strong></div>
                  <div>Client: <strong className="text-slate-900">{clientName}</strong></div>
                </div>

                <button
                  onClick={() => setBookingConfirmed(false)}
                  className={`px-6 py-2.5 rounded-xl ${primaryBg} text-white font-bold text-xs shadow-md transition-colors cursor-pointer`}
                >
                  Book Another Appointment
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Select Service & Specialist (7 cols) */}
                <div className="lg:col-span-7 space-y-5">
                  {/* Step 1: Services */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                    <h4 className="font-display font-bold text-sm text-slate-900 flex items-center justify-between">
                      <span>1. Select Service / اختر الخدمة</span>
                      <span className={`text-xs ${primaryText} font-bold`}>Step 1 of 3</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { id: 'haircut', title: 'Hair Styling & Blowdry', price: '180 SAR', duration: '45 mins', emoji: '💇‍♀️' },
                        { id: 'facial', title: 'HydraFacial Glow Treatment', price: '350 SAR', duration: '60 mins', emoji: '✨' },
                        { id: 'manicure', title: 'Luxury Gel Manicure', price: '150 SAR', duration: '40 mins', emoji: '💅' },
                        { id: 'beard', title: 'Beard Sculpting & Spa', price: '120 SAR', duration: '30 mins', emoji: '💈' },
                      ].map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setSelectedService(s.id)}
                          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            selectedService === s.id
                              ? `${lightBg} ${primaryBorder} ring-2 ${ringColor}`
                              : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-2xl">{s.emoji}</span>
                            <span className={`font-extrabold text-xs ${primaryText}`}>{s.price}</span>
                          </div>
                          <div className="mt-2 font-bold text-xs text-slate-900">{s.title}</div>
                          <div className="text-[10px] text-slate-500">{s.duration}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Specialist */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                    <h4 className="font-display font-bold text-sm text-slate-900">2. Choose Specialist / المصمم المفضل</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { name: 'Maya (Senior Stylist)', role: 'Master Hair Specialist', rating: '4.9 ⭐' },
                        { name: 'Sami (Barber Master)', role: 'Beard & Styling Expert', rating: '4.9 ⭐' },
                        { name: 'Noura (Skin Care)', role: 'HydraFacial Specialist', rating: '4.8 ⭐' },
                      ].map((staff, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedStaff(staff.name)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            selectedStaff === staff.name
                              ? `${lightBg} ${primaryBorder} ring-2 ${ringColor} font-bold`
                              : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="font-bold text-xs text-slate-900">{staff.name}</div>
                          <div className="text-[10px] text-slate-500">{staff.role}</div>
                          <div className={`text-[10px] ${primaryText} font-bold mt-1`}>{staff.rating}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Time Slot & Customer Checkout (5 cols) */}
                <div className="lg:col-span-5 space-y-5">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                    <h4 className="font-display font-bold text-sm text-slate-900">3. Date & Available Slots</h4>

                    <div className="grid grid-cols-3 gap-2">
                      {['01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM', '07:00 PM', '08:30 PM'].map((t) => (
                        <button
                          key={t}
                          onClick={() => setSelectedTime(t)}
                          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                            selectedTime === t
                              ? `${primaryBg} text-white shadow-md`
                              : 'bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-200 space-y-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-900">Client Name / اسم العميل</label>
                        <input
                          type="text"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-900">Phone / رقم الجوال (للتأكيد)</label>
                        <input
                          type="text"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 outline-none"
                        />
                      </div>

                      <button
                        onClick={() => {
                          setBookingConfirmed(true);
                          triggerToast('Appointment Booked Successfully!');
                        }}
                        className={`w-full py-3 rounded-xl ${primaryBg} text-white font-extrabold text-xs shadow-md transition-all cursor-pointer mt-2`}
                      >
                        Confirm Booking & Pay at {displayName} (تأكيد الحجز) ⚡
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Render Template 2: SaaS Analytics Portal */}
      {activeCanvasTemplate === 'saas' && (
        <div className="w-full bg-slate-50 rounded-2xl border-2 border-slate-200 overflow-hidden shadow-lg font-sans text-slate-900">
          <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              <div className="ml-2 px-3 py-0.5 bg-white rounded-md text-[11px] text-slate-500 font-mono border border-slate-200">
                🔒 https://nova-saas.ogroup.app/workspace
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#2563eb] text-[11px] font-bold">
              🎨 Google Stitch AI Canvas · SaaS Portal
            </span>
          </div>

          <div className="bg-white p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl ${primaryBg} flex items-center justify-center text-white font-extrabold text-sm shadow-md`}>
                N
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">Nova SaaS Analytics & Billing Portal</h3>
                <p className="text-xs text-slate-500">Google Stitch Generated Micro-Frontend</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {['overview', 'analytics', 'billing', 'settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                    activeTab === tab
                      ? `${primaryBg} text-white shadow-sm`
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                <span className="text-xs text-slate-500 font-semibold">Total Revenue</span>
                <div className="text-2xl font-black text-slate-900 font-display">$42,850.00</div>
                <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> +18.4% this month
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                <span className="text-xs text-slate-500 font-semibold">Active Users</span>
                <div className={`text-2xl font-black ${primaryText} font-display`}>1,420 Users</div>
                <div className="text-[11px] text-slate-500 font-medium">99.2% retention rate</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                <span className="text-xs text-slate-500 font-semibold">System Velocity</span>
                <div className="text-2xl font-black text-teal-700 font-display">2.8M tok/day</div>
                <div className="text-[11px] text-teal-800 font-bold">Sub-100ms response</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Render Template 3: Document Control Vault */}
      {activeCanvasTemplate === 'doc_control' && (
        <div className="w-full bg-slate-50 rounded-2xl border-2 border-slate-200 overflow-hidden shadow-lg p-6 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">Document Control Register</h3>
              <p className="text-xs text-slate-500">Google Stitch Governed Audit Vault</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
              SHA-256 Chain Locked
            </span>
          </div>
        </div>
      )}

      {/* Render Template 4: Coffee Delivery */}
      {activeCanvasTemplate === 'coffee' && (
        <div className="w-full bg-slate-50 rounded-2xl border-2 border-slate-200 overflow-hidden shadow-lg p-6 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">Artisanal Coffee Roastery Delivery</h3>
              <p className="text-xs text-slate-500">Google Stitch E-Commerce Mobile App</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
              ⚡ 15 Mins Delivery
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
