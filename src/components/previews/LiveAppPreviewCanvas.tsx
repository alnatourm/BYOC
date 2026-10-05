import React, { useState } from 'react';

interface LiveAppPreviewCanvasProps {
  title: string;
  category?: string;
  description?: string;
}

export const LiveAppPreviewCanvas: React.FC<LiveAppPreviewCanvasProps> = ({ title, category = '', description = '' }) => {
  const [activeCanvasTemplate, setActiveCanvasTemplate] = useState<'saas' | 'doc_control' | 'coffee'>('saas');

  const getDisplayName = () => {
    return title || 'SAMPLE - NOT REAL • Customer Self-Service Portal';
  };

  const displayName = getDisplayName();

  const isBlueTheme = true;
  const primaryBg = isBlueTheme ? 'bg-[#2563eb] hover:bg-[#1d4ed8]' : 'bg-[#ea580c] hover:bg-orange-700';
  const primaryText = isBlueTheme ? 'text-[#2563eb]' : 'text-[#ea580c]';
  const primaryBorder = isBlueTheme ? 'border-[#3b82f6]' : 'border-[#ea580c]';
  const lightBg = isBlueTheme ? 'bg-blue-50/80' : 'bg-orange-50/80';
  const lightBorder = isBlueTheme ? 'border-blue-200' : 'border-orange-200';
  const ringColor = isBlueTheme ? 'ring-blue-200' : 'ring-orange-200';

  const [activeTab, setActiveTab] = useState('overview');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* Canvas Engine Switcher */}
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
            <span>📂 Document Control Portal</span>
          </button>

          <button
            onClick={() => setActiveCanvasTemplate('coffee')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCanvasTemplate === 'coffee'
                ? 'bg-[#2563eb] text-white shadow-sm ring-2 ring-blue-200'
                : 'bg-[#f9f8f6] text-[#576071] border border-[#e2d9d2] hover:bg-blue-50 hover:text-[#2563eb]'
            }`}
          >
            <span>☕ Order & Inventory App</span>
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMsg && (
        <div className="p-3 bg-[#2563eb] text-white rounded-xl text-xs font-bold shadow-md animate-in fade-in">
          {toastMsg}
        </div>
      )}

      {/* Template 1: SaaS Analytics Portal */}
      {activeCanvasTemplate === 'saas' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
          <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="ml-2 font-mono text-slate-400">https://analytics-portal.ais-applet.cloud</span>
            </div>
            <span className="font-bold text-slate-300">{displayName}</span>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">{displayName}</h2>
                <p className="text-xs text-slate-500">Real-time metrics, active tenant quotas, and system usage.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  Billing: {billingCycle.toUpperCase()}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-slate-500 font-sans">Active Workspaces</div>
                <div className="text-2xl font-bold text-slate-900">24</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-slate-500 font-sans">API Dispatches / Month</div>
                <div className="text-2xl font-bold text-blue-600">142,900</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-slate-500 font-sans">System Uptime</div>
                <div className="text-2xl font-bold text-emerald-600">99.98%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template 2: Document Control Portal */}
      {activeCanvasTemplate === 'doc_control' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <h2 className="font-bold text-base text-slate-900">{displayName} • Document Control</h2>
          <p className="text-xs text-slate-500">Version controlled document distribution and audit history.</p>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono">
            <div>Document: System_Architecture_Spec_v2.1.pdf</div>
            <div className="text-slate-500 text-[11px] mt-1">Status: Approved · Hash: 9f8a...331b</div>
          </div>
        </div>
      )}

      {/* Template 3: Order & Inventory App */}
      {activeCanvasTemplate === 'coffee' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <h2 className="font-bold text-base text-slate-900">{displayName} • Inventory & Orders</h2>
          <p className="text-xs text-slate-500">Real-time inventory levels, orders queue, and supplier dispatches.</p>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono">
            <div>Active Orders: 12 in queue</div>
            <div className="text-emerald-700 font-bold mt-1">Inventory Level: 98% Optimal</div>
          </div>
        </div>
      )}
    </div>
  );
};
