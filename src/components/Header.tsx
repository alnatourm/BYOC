import React from 'react';
import { useBYOK } from '../context/BYOKContext';
import { ShieldCheck, Plus, RotateCcw, Cpu, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, operatingMode, setOperatingMode, setIsAddProviderOpen, setIsCreateProjectOpen, resetToDefaults } = useBYOK();

  const navItems = [
    { id: 'dashboard', label: 'My Software', arLabel: 'برمجياتي' },
    { id: 'roles', label: 'Workforce & Roles', arLabel: 'أدوار المصنع' },
    { id: 'agents', label: 'Agents Studio', arLabel: 'الوكلاء' },
    { id: 'models', label: 'Models Catalog', arLabel: 'النماذج' },
    { id: 'providers', label: 'Providers & Vault', arLabel: 'الخزنة المشفرة' },
    { id: 'studio', label: 'My Factory', arLabel: 'مصنعي الذكي' },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-orange-950/40 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-lg">
      {/* Zone 1: OGroup AI Factory Brand Mark */}
      <div className="flex items-center gap-3">
        <a 
          href="#dashboard" 
          onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}
          className="text-xl font-extrabold tracking-tight text-white font-display flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold shadow-md shadow-orange-500/20">
            ⚡
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-white text-base leading-none font-display">OGroup</span>
            <span className="text-[10px] text-orange-500 font-bold tracking-wider leading-none mt-1">AI FACTORY ✦ v2.4 ✨</span>
          </div>
        </a>

        {/* Operating Mode Switcher (Managed Factory vs Custom BYOK) */}
        <div className="hidden lg:flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-[11px] font-mono">
          <button
            onClick={() => setOperatingMode('managed_factory')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
              operatingMode === 'managed_factory'
                ? 'bg-orange-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🌟 Managed Factory</span>
            <span className="text-[10px] font-sans text-orange-200">/ المدار</span>
          </button>
          <button
            onClick={() => setOperatingMode('byok')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
              operatingMode === 'byok'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>⚙️ Custom BYOK</span>
            <span className="text-[10px] font-sans text-indigo-200">/ المخصص</span>
          </button>
        </div>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-all whitespace-nowrap flex items-center gap-1 ${
                isActive
                  ? 'bg-orange-600 text-white font-bold shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>{item.label}</span>
              <span className="text-[10px] opacity-60 font-sans">{item.arLabel}</span>
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsCreateProjectOpen(true)}
          className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 rounded-xl shadow-md shadow-orange-500/20 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Build Software 🚀</span>
        </button>

        <button
          onClick={() => setActiveTab('studio')}
          className="hidden sm:flex px-3 py-2 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition items-center gap-1.5 whitespace-nowrap cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          <span>My Factory</span>
        </button>

        <button
          onClick={resetToDefaults}
          className="p-2 text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition"
          title="Reset to default preset data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
