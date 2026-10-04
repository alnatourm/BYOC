import React, { useState } from 'react';
import { useBYOK } from '../context/BYOKContext';

export const Gate5CloudDeployView: React.FC = () => {
  const { setCurrentGateStep, selectedArtifact } = useBYOK();
  const [isDeploying, setIsDeploying] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [tweakInput, setTweakInput] = useState('');
  const [showLaunchModal, setShowLaunchModal] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  const handleApproveGate5 = () => {
    setIsDeploying(true);
    setShowLaunchModal(true);
    setTimeout(() => {
      setIsDeploying(false);
      showToast('🚀 Gate 5 Approved! Live Cloud Switchover Complete. Application deployed to AWS me-central-1 Riyadh & Cloudflare Edge.');
    }, 1500);
  };

  const handleApplyTweak = () => {
    if (!tweakInput.trim()) {
      showToast('Please type a deployment instruction first.');
      return;
    }
    showToast(`Badr (DevOps Agent) applied: "${tweakInput}". Staging topology updated.`);
    setTweakInput('');
  };

  return (
    <div className="flex flex-col w-full pb-32 font-sans text-[#18181b] bg-[#f9f8f6] min-h-screen">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-8 bg-white border-2 border-[#ea580c] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-[#18181b] z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="material-symbols-outlined text-[#ea580c] text-[24px]">verified</span>
          <div>
            <p className="font-display font-bold text-sm text-[#ea580c]">Gate 5 Update</p>
            <p className="text-xs text-[#52525b]">{toastMsg}</p>
          </div>
        </div>
      )}

      {/* Top Breadcrumb & Metadata Banner */}
      <div className="pt-4 pb-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-stone-600">
            <span className="px-2 py-0.5 rounded-full bg-stone-100 border border-stone-200 font-bold">PROJECT</span>
            <span className="font-display text-base font-bold text-[#ea580c]">PRJ-8842</span>
            <span className="text-stone-300">/</span>
            <span className="font-bold text-[#18181b]">{selectedArtifact?.title || 'VaultSign OS'}</span>
            <span className="px-2 py-0.5 rounded-md bg-orange-50 border border-orange-200 font-bold text-orange-800">Bilingual v1.2</span>
            <span className="text-stone-300">•</span>
            <span className="font-mono text-xs flex items-center gap-1 text-teal-700">
              <span className="material-symbols-outlined text-[16px]">lock</span>
              commit <strong className="text-[#ea580c]">c8f1e29</strong> (QC Verified)
            </span>
          </div>

          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200 border-l-4 border-l-[#ea580c]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ea580c] animate-ping"></span>
            <div className="flex flex-col">
              <span className="font-bold text-xs text-[#ea580c] uppercase">Gate 5 Mandatory Final Sign-Off</span>
              <span className="text-[11px] text-stone-600">اعتماد بشري إلزامي للإطلاق السحابي والتشغيل الحي</span>
            </div>
          </div>
        </div>

        {/* 5-Stage Stepper Bar */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 flex flex-col justify-between text-xs">
              <span className="font-bold text-stone-400">01. SPEC AGENT</span>
              <strong className="text-[#18181b]">PRD Locked ✓</strong>
            </div>

            <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 flex flex-col justify-between text-xs">
              <span className="font-bold text-stone-400">02. DESIGN AGENT</span>
              <strong className="text-[#18181b]">Figma Tokens ✓</strong>
            </div>

            <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 flex flex-col justify-between text-xs">
              <span className="font-bold text-stone-400">03. DEV AGENT</span>
              <strong className="text-[#18181b]">Codebase Built ✓</strong>
            </div>

            <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 flex flex-col justify-between text-xs">
              <span className="font-bold text-stone-400">04. QC & SECURITY</span>
              <strong className="text-[#18181b]">38/38 Passed ✓</strong>
            </div>

            <div className="p-3 rounded-lg bg-gradient-to-r from-[#ea580c] to-amber-500 text-white shadow-sm flex flex-col justify-between relative overflow-hidden text-xs">
              <span className="font-bold tracking-wider">05. RELEASE & DEPLOY</span>
              <strong className="font-bold text-sm">Gate 5 Pending • الإطلاق الحي</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Agent 05 Profile Hero Banner */}
      <section className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4 mb-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#ea580c] to-amber-500 flex items-center justify-center text-white shadow-md">
                <span className="material-symbols-outlined text-[32px]">cloud_sync</span>
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"></span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-lg text-[#18181b]">Agent 05: Badr (بدر)</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-[#ea580c] text-xs font-bold">
                  Autonomous DevOps Engineer
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-0.5 font-medium">
                وكيل النشر وهندسة العمليات السحابية المتكاملة • Automated CI/CD & Zero-Downtime Multi-Region Operator
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-stone-50 border border-stone-200 px-3 py-2 rounded-xl text-xs font-mono font-bold">
            <span className="text-[#ea580c]">Docker Compose</span>
            <span className="text-stone-300">•</span>
            <span className="text-teal-700">Cloudflare Edge</span>
            <span className="text-stone-300">•</span>
            <span className="text-amber-800">AWS me-central-1</span>
          </div>
        </div>

        {/* 4 Real-Time Deployment Readiness Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-stone-500 font-bold block">Edge Latency</span>
            <strong className="font-display text-2xl font-bold text-emerald-700 block mt-1">18 ms</strong>
            <span className="text-[#887364]">Cloudflare Riyadh Edge POP</span>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-stone-500 font-bold block">Artifact Hash</span>
            <strong className="font-mono text-sm font-bold text-[#ea580c] block mt-1 truncate">3bc4928d11c0...</strong>
            <span className="text-emerald-700 font-bold">SHA-256 Verified ✓</span>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-stone-500 font-bold block">Container Size</span>
            <strong className="font-display text-2xl font-bold text-[#18181b] block mt-1">42.8 MB</strong>
            <span className="text-stone-500">Alpine Distroless</span>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-stone-500 font-bold block">Target SLA</span>
            <strong className="font-display text-2xl font-bold text-teal-700 block mt-1">99.99 %</strong>
            <span className="text-teal-700 font-bold">Multi-AZ Active</span>
          </div>
        </div>
      </section>

      {/* Main 2-Column Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Left Column (8 Cols): Infrastructure Topology */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          <section className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-base text-[#18181b] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ea580c]">hub</span>
              <span>Pre-Flight Cloud Infrastructure & Deployment Plan</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex justify-between items-center">
                <div>
                  <strong className="text-sm font-bold text-[#18181b] block">1. Cloudflare Edge & DDoS Shield</strong>
                  <span className="text-stone-600">TLS 1.3 Strict Mode, Custom SSL *.vaultsign.sa & WAF Rate Limiting.</span>
                </div>
                <span className="px-2.5 py-1 bg-orange-100 text-[#ea580c] font-bold rounded-full">Staged & Ready</span>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex justify-between items-center">
                <div>
                  <strong className="text-sm font-bold text-[#18181b] block">2. AWS Riyadh (me-central-1) Kubernetes Pod Cluster</strong>
                  <span className="text-stone-600">3 Replicas configured with Horizontal Pod Autoscaler.</span>
                </div>
                <span className="px-2.5 py-1 bg-stone-100 text-stone-700 font-bold rounded-full">Warm Standby</span>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex justify-between items-center">
                <div>
                  <strong className="text-sm font-bold text-[#18181b] block">3. Production PostgreSQL & Supabase Database</strong>
                  <span className="text-stone-600">AES-256 storage encryption compliant with Saudi PDPL regulations.</span>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full">Synced & Migrated ✓</span>
              </div>
            </div>
          </section>

          {/* Custom Instruction Input */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <h4 className="font-display font-bold text-sm text-[#18181b]">Pre-Approval Adjustments & Custom Instructions</h4>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tweakInput}
                onChange={(e) => setTweakInput(e.target.value)}
                placeholder="Ask Badr for release tweaks (e.g. 'Increase minimum replica pods to 5')..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-[#18181b] outline-none"
              />
              <button
                onClick={handleApplyTweak}
                className="px-4 py-2 bg-[#ea580c] text-white font-bold text-xs rounded-xl shadow-xs shrink-0 hover:bg-orange-700 cursor-pointer"
              >
                Apply Instruction
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (4 Cols): Domain & Routing */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3 text-xs">
            <h3 className="font-display font-bold text-sm text-[#18181b]">Production Domain & Routing</h3>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <span className="text-stone-500 font-bold block">PRIMARY DOMAIN</span>
              <strong className="font-display text-base font-bold text-[#ea580c] block">vaultsign.sa</strong>
              <span className="text-emerald-700 font-bold block">TLS 1.3 Active ✓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Mandatory Approval Gate 5 Bar */}
      <div className="fixed bottom-0 left-0 md:left-72 right-0 bg-white/95 backdrop-blur-xl p-4 z-40 border-t border-stone-200 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200 text-[#ea580c] flex items-center justify-center font-bold">
              🚀
            </div>
            <div>
              <span className="font-display text-sm font-bold text-[#18181b]">
                Human Approval Gate 5: Approve Gate 5 & Launch Live to Cloud
              </span>
              <p className="text-xs text-stone-600">
                Authorizes Agent 05 (Badr) to execute Blue-Green DNS swap & activate AWS Riyadh cloud containers.
              </p>
            </div>
          </div>

          <button
            onClick={handleApproveGate5}
            disabled={isDeploying}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#ea580c] to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-extrabold text-xs shadow-lg transition cursor-pointer flex items-center gap-2"
          >
            {isDeploying ? 'Executing Live Cloud Switchover...' : '🚀 Approve Gate 5 & Launch Live to Cloud (تشغيل حياً)'}
          </button>
        </div>
      </div>

      {/* Launch Confirmation Modal */}
      {showLaunchModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full border border-stone-200 shadow-2xl text-center space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-orange-100 text-[#ea580c] flex items-center justify-center mx-auto shadow-sm">
              <span className="material-symbols-outlined text-[36px] animate-spin">cyclone</span>
            </div>
            <div>
              <h3 className="font-display font-extrabold text-xl text-[#18181b]">Initiating Live Cloud Switchover...</h3>
              <p className="text-xs text-stone-600 mt-1">جارِ تنفيذ التوجيه النهائي وتفعيل خوادم الرياض AWS me-central-1 عبر الوكيل بدر</p>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 font-mono text-xs text-left space-y-2">
              <p className="text-teal-700 font-bold">✓ Blue-Green swap: Routing 100% traffic to v1.2</p>
              <p className="text-teal-700 font-bold">✓ Cloudflare Anycast edge cache primed (18ms)</p>
              <p className="text-[#ea580c] font-bold animate-pulse">⚡ Activating WhatsApp API production hooks...</p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowLaunchModal(false)}
                className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
              >
                Close Window
              </button>
              <a
                href="https://vaultsign.sa"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#ea580c] hover:bg-orange-700 text-white font-extrabold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                <span>Open Live URL (زيارة المنصة الحية)</span>
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
