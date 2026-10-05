import React, { useState } from 'react';
import { useBYOK } from '../context/BYOKContext';

export const Gate3CodeReviewView: React.FC = () => {
  const { setCurrentGateStep, selectedArtifact } = useBYOK();
  const [activeCodeTab, setActiveCodeTab] = useState<'preview' | 'code' | 'plain'>('preview');
  const [selectedFile, setSelectedFile] = useState<string>('SameerSaloonApp.tsx');
  const [isApproving, setIsApproving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [tweakInput, setTweakInput] = useState('');

  // Dynamic Prompt Classification
  const promptDesc = selectedArtifact?.description || selectedArtifact?.title || 'build a salon booking app for my saloon colors gold and white name sameer saloon';
  const isSalonPrompt = promptDesc.toLowerCase().includes('sal') || 
                        promptDesc.toLowerCase().includes('hair') || 
                        promptDesc.toLowerCase().includes('barber') || 
                        promptDesc.toLowerCase().includes('sameer');

  const appTitle = isSalonPrompt ? 'Sameer Saloon • Salon Booking App' : selectedArtifact?.title || 'Full-Stack Codebase';

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  const handleApproveGate3 = () => {
    setIsApproving(true);
    showToast('✅ Gate 3 Approved! Full-Stack Codebase locked. Unlocking Stage 04: QC & Security Scan...');
    setTimeout(() => {
      setIsApproving(false);
      setCurrentGateStep('gate4');
    }, 600);
  };

  const handleTweakNour = () => {
    if (!tweakInput.trim()) {
      showToast('Please type a code adjustment prompt first.');
      return;
    }
    showToast(`Nour is synthesizing adjustments: "${tweakInput}"... Code updated in 2s.`);
    setTweakInput('');
  };

  const codeSnippets: Record<string, string> = {
    'SameerSaloonApp.tsx': `'use client';

// OGroup AI Factory - Synthesized Component for Sameer Saloon
// Stack: React 19 + TypeScript + Fastify + Gold (#d97706) & White Theme

import React, { useState } from 'react';

export function SameerSaloonApp() {
  const [selectedService, setSelectedService] = useState('VIP Haircut & Beard');
  const [selectedStylist, setSelectedStylist] = useState('Master Sameer');
  const [selectedTime, setSelectedTime] = useState('11:30 AM');
  const [clientPhone, setClientPhone] = useState('+966 50 882 1099');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const handleBook = () => {
    setBookingConfirmed(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-3xl border border-stone-200 shadow-xl font-sans">
      <header className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#d97706] text-white flex items-center justify-center font-bold text-xl">
            ✂️
          </div>
          <div>
            <h1 className="font-display font-extrabold text-xl text-[#1f242e]">Sameer Saloon • صالون سمير</h1>
            <p className="text-xs text-stone-500 font-semibold">Luxury Grooming & Styling Lounge • Riyadh</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-amber-100 text-[#d97706] font-bold text-xs">
          Gold & White Edition
        </span>
      </header>

      {bookingConfirmed ? (
        <div className="p-8 text-center space-y-4 my-6 bg-amber-50 rounded-2xl border border-amber-200">
          <div className="w-16 h-16 rounded-full bg-[#d97706] text-white mx-auto flex items-center justify-center font-bold text-2xl">
            ✓
          </div>
          <h2 className="font-display font-extrabold text-xl text-[#1f242e]">Appointment Booked at Sameer Saloon!</h2>
          <p className="text-xs text-stone-600">WhatsApp confirmation receipt sent to {clientPhone}.</p>
          <button onClick={() => setBookingConfirmed(false)} className="px-6 py-2.5 rounded-xl bg-[#d97706] text-white text-xs font-bold shadow-md">
            Book Another Appointment
          </button>
        </div>
      ) : (
        <div className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-xs font-bold text-[#d97706] block mb-2">Selected Grooming Service</span>
              <h3 className="font-bold text-base text-[#1f242e]">{selectedService}</h3>
              <p className="text-xs text-stone-500 font-semibold mt-1">Duration: 45 Mins • Price: SAR 180</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-xs font-bold text-[#d97706] block mb-2">Selected Stylist</span>
              <h3 className="font-bold text-base text-[#1f242e]">{selectedStylist}</h3>
              <p className="text-xs text-stone-500 font-semibold mt-1">Slot: Today at {selectedTime}</p>
            </div>
          </div>

          <button onClick={handleBook} className="w-full py-3.5 rounded-2xl bg-[#d97706] hover:bg-amber-700 text-white font-extrabold text-sm shadow-md transition cursor-pointer">
            Confirm & Dispatch WhatsApp Ticket ➔
          </button>
        </div>
      )}
    </div>
  );
}`,
    'useAppointmentStore.ts': `import { create } from 'zustand';

interface AppointmentState {
  serviceId: string;
  stylistId: string;
  timeSlot: string;
  clientPhone: string;
  setService: (id: string) => void;
  setStylist: (id: string) => void;
  setTimeSlot: (slot: string) => void;
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
  serviceId: 'srv-1',
  stylistId: 'sameer',
  timeSlot: '11:30 AM',
  clientPhone: '+966 50 882 1099',
  setService: (serviceId) => set({ serviceId }),
  setStylist: (stylistId) => set({ stylistId }),
  setTimeSlot: (timeSlot) => set({ timeSlot }),
}));`,
    'serverFastifyApi.ts': `import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

// Sameer Saloon Appointment Booking Endpoint
fastify.post('/api/v1/sameer-saloon/book', async (request, reply) => {
  const { serviceId, stylistId, clientPhone, timeSlot } = request.body as any;

  // Insert into PostgreSQL appointments table
  const ticketId = \`TKT-\${Math.floor(100000 + Math.random() * 900000)}\`;

  // Dispatch WhatsApp Webhook
  return reply.send({
    success: true,
    ticketId,
    message: 'Sameer Saloon appointment confirmed!',
    vatAmount: 23.48, // 15% ZATCA VAT
    timestamp: new Date().toISOString(),
  });
});`
  };

  return (
    <div className="flex flex-col w-full pb-32 font-sans text-[#1f242e] bg-[#f8f7f5] min-h-screen">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-8 bg-white border-2 border-[#d97706] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-[#1f242e] z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="material-symbols-outlined text-[#d97706] text-[24px]">terminal</span>
          <div>
            <p className="font-display font-bold text-sm text-[#d97706]">Gate 3 Code Synthesis</p>
            <p className="text-xs text-stone-600">{toastMsg}</p>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="pt-4 pb-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#d97706] animate-pulse"></span>
            <h2 className="font-display text-lg font-bold text-[#1f242e]">
              Stage 03: Full-Stack Code Review & Compilation{' '}
              <span className="text-[#d97706] font-semibold text-sm">({appTitle})</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-[#d97706] font-bold text-xs">
              03. Developer Agent (Nour) • React 19 + TypeScript + Fastify
            </span>
          </div>
        </div>
      </div>

      {/* Code Inspection & Live Preview Area */}
      <section className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#d97706]">code</span>
            <h3 className="font-display font-bold text-base text-[#1f242e]">
              Synthesized Full-Stack Codebase
            </h3>
          </div>

          <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveCodeTab('preview')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeCodeTab === 'preview' ? 'bg-white text-[#d97706] shadow-2xs' : 'text-stone-600'
              }`}
            >
              Live Running App
            </button>
            <button
              onClick={() => setActiveCodeTab('code')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeCodeTab === 'code' ? 'bg-white text-[#d97706] shadow-2xs' : 'text-stone-600'
              }`}
            >
              Inspect Source TSX
            </button>
          </div>
        </div>

        {activeCodeTab === 'preview' && (
          <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200">
            {/* Live Interactive App Frame */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md max-w-2xl mx-auto space-y-6 font-sans">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#d97706] text-white flex items-center justify-center font-bold text-xl shadow-sm">
                    ✂️
                  </div>
                  <div>
                    <h2 className="font-display font-extrabold text-lg text-[#1f242e]">Sameer Saloon • صالون سمير</h2>
                    <p className="text-xs text-stone-500 font-semibold">Live React 19 Client Component</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  Active Runtime 🟢
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                  <strong className="text-[#d97706] font-bold block text-sm">Selected Booking Ticket:</strong>
                  <span className="text-[#1f242e] font-semibold block">VIP Haircut & Beard Styling (SAR 180)</span>
                  <span className="text-stone-500 block">Barber: Master Sameer • Slot: 11:30 AM</span>
                </div>

                <button
                  onClick={() => showToast('✂️ Test booking confirmed in live Fastify backend!')}
                  className="w-full py-3 rounded-xl bg-[#d97706] hover:bg-amber-700 text-white font-extrabold text-xs shadow-md transition cursor-pointer"
                >
                  Test Fastify Booking API Call ➔
                </button>
              </div>
            </div>
          </div>
        )}

        {activeCodeTab === 'code' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs overflow-x-auto pb-2 border-b border-stone-100">
              {Object.keys(codeSnippets).map((file) => (
                <button
                  key={file}
                  onClick={() => setSelectedFile(file)}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer font-semibold ${
                    selectedFile === file ? 'bg-[#d97706] text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {file}
                </button>
              ))}
            </div>

            <pre className="p-5 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed max-h-[420px]">
              <code>{codeSnippets[selectedFile]}</code>
            </pre>
          </div>
        )}
      </section>

      {/* Sticky Bottom Human Approval Gate 3 Bar */}
      <div className="fixed bottom-0 left-0 md:left-72 right-0 bg-white/95 backdrop-blur-xl p-4 z-40 border-t border-stone-200 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 text-[#d97706] flex items-center justify-center font-bold">
              03
            </div>
            <div>
              <span className="font-display text-sm font-bold text-[#1f242e]">
                Human Approval Gate 3: Lock Full-Stack Codebase
              </span>
              <p className="text-xs text-stone-600">
                Authorizes <strong className="text-[#1f242e]">04. QC Sentinel Agent (Faris)</strong> to run 38 automated E2E tests & security scan.
              </p>
            </div>
          </div>

          <button
            onClick={handleApproveGate3}
            disabled={isApproving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-amber-600 hover:from-amber-700 hover:to-amber-800 text-white font-extrabold text-xs shadow-lg transition cursor-pointer flex items-center gap-2"
          >
            {isApproving ? 'Authorizing Stage 04...' : 'Approve Codebase & Unlock Stage 04 QC Scan ➔'}
          </button>
        </div>
      </div>
    </div>
  );
};
