import React from 'react';
import { Brain, CheckCircle2, ShieldCheck, Zap, Layers, ListChecks, Check, Wifi, Sparkles, Cloud } from 'lucide-react';

export const ProjectBrainGrid: React.FC = () => {
  const cards = [
    {
      id: 'features',
      icon: '📋',
      titleEn: '1. App Features & Needs',
      titleAr: 'المميزات والمتطلبات',
      summary: '18 verified items clearly documented and confirmed, matching your exact operational requirements.',
      badge: '18 verified items',
      statusColor: 'emerald',
    },
    {
      id: 'rules',
      icon: '⚖️',
      titleEn: '2. How Your App Works',
      titleAr: 'قواعد العمل',
      summary: 'Role-based document access, retention policies, and signer workflows.',
      badge: 'Simple permissions & rules',
      statusColor: 'amber',
    },
    {
      id: 'cloud',
      icon: '☁️',
      titleEn: '3. Cloud & Tech Setup',
      titleAr: 'البنية السحابية',
      summary: 'Modern secure cloud infrastructure with automated database backups and instant file delivery.',
      badge: 'Modern secure cloud',
      statusColor: 'indigo',
    },
    {
      id: 'decisions',
      icon: '🔨',
      titleEn: '4. Agreed Decisions',
      titleAr: 'القرارات المتفق عليها',
      summary: '2 milestones logged: Automatic document watermarking approved and SSO integration confirmed.',
      badge: '2 milestones logged',
      statusColor: 'orange',
    },
    {
      id: 'screens',
      icon: '🎨',
      titleEn: '5. Saved Visual Screens',
      titleAr: 'الشاشات والتصاميم',
      summary: '8 screens approved with clean bilingual Arabic & English typography and responsive layouts.',
      badge: '8 screens approved',
      statusColor: 'emerald',
    },
    {
      id: 'todo',
      icon: '☑️',
      titleEn: '6. Next Steps & Todo',
      titleAr: 'خطوات العمل',
      summary: '14 done / 4 active. Ongoing sprints for frontend responsiveness and secure storage integration.',
      badge: '14 done / 4 active',
      statusColor: 'indigo',
    },
    {
      id: 'quality',
      icon: '🛡️',
      titleEn: '7. Quality Notes',
      titleAr: 'ملاحظات الجودة',
      summary: '0 issues found. Code health is optimal, regression scans clear, and accessibility checks passed.',
      badge: '0 issues found',
      statusColor: 'emerald',
    },
    {
      id: 'tests',
      icon: '🧪',
      titleEn: '8. Verification Tests',
      titleAr: 'نتائج الفحص والتشغيل',
      summary: '42 / 42 passed (100%). Automated continuous test suite guarantees user data and button reliability.',
      badge: '42 / 42 passed (100%)',
      statusColor: 'emerald',
    },
    {
      id: 'versions',
      icon: '🚀',
      titleEn: '9. Launch Versions',
      titleAr: 'إصدارات الإطلاق',
      summary: 'v0.3 preview live. Staging sandbox is refreshed automatically with each completed stage.',
      badge: 'v0.3 preview live',
      statusColor: 'orange',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Friendly Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-orange-950/40 border border-orange-900/40 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center font-bold">
                <Brain className="w-5 h-5" />
              </div>
              <h2 className="font-extrabold text-2xl text-white font-display tracking-tight">
                Project Brain 🧠 / <span className="text-orange-400 font-bold">عقل المشروع الدائم</span>
              </h2>
            </div>
            <p className="text-sm text-slate-200 font-medium">
              🧠 Your App's Memory: Everything your AI team knows and remembers about your project in one organized place.
            </p>
            <p className="text-xs text-slate-400">
              ذاكرة ذكية موحدة تحفظ المعايير الهندسية وقرارات العمل حتى تلتزم جميع روبوتات المصنع بنفس الرؤية دون أي تشتت أو انحراف.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 flex items-center gap-2 text-xs font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold">Knowledge Graph Synchronized ⚡</span>
            </div>
          </div>
        </div>
      </div>

      {/* 9 Accessible Memory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-orange-500/40 transition-all flex flex-col justify-between cursor-pointer group shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-2xl group-hover:scale-110 transition-transform">{c.icon}</div>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-slate-950 text-indigo-300 border border-slate-800">
                  {c.badge}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-white font-display group-hover:text-orange-300 transition-colors">
                  {c.titleEn}
                </h4>
                <div className="text-xs text-orange-400 font-semibold mt-0.5">{c.titleAr}</div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{c.summary}</p>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-slate-400 text-xs font-mono">
              <span className="text-[11px] text-emerald-400 font-medium">✓ Validated</span>
              <Check className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
