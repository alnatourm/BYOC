import React from 'react';
import { useBYOK } from '../context/BYOKContext';

interface NavItem {
  id: 'dashboard' | 'roles' | 'build' | 'agents' | 'providers' | 'models' | 'studio';
  icon: string;
  titleEn: string;
  titleAr: string;
  isHighlight?: boolean;
  subItems?: Array<{ id: 'agents' | 'providers' | 'studio'; label: string; dotColor: string }>;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useBYOK();

  const navItems: NavItem[] = [
    { id: 'dashboard', icon: 'home', titleEn: 'Home', titleAr: 'الرئيسية' },
    { id: 'roles', icon: 'inventory_2', titleEn: 'My Software', titleAr: 'تطبيقاتي' },
    { id: 'build', icon: 'auto_awesome', titleEn: 'Build Software', titleAr: 'بناء جديد ✨', isHighlight: true },
    {
      id: 'agents',
      icon: 'precision_manufacturing',
      titleEn: 'My Factory',
      titleAr: 'المصنع',
      subItems: [
        { id: 'agents', label: 'Workforce & Roles', dotColor: 'bg-[#f97316]' },
        { id: 'providers', label: 'Providers & BYOK', dotColor: 'bg-stone-300' },
        { id: 'studio', label: 'Advanced Console', dotColor: 'bg-emerald-500' },
      ],
    },
    { id: 'providers', icon: 'pie_chart', titleEn: 'Usage & Billing', titleAr: 'الفوترة' },
    { id: 'models', icon: 'settings', titleEn: 'Settings', titleAr: 'الإعدادات' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-[#fcfbf9] z-50 flex flex-col justify-between p-6 border-r border-[#e2ded8]/60 shadow-[0_1px_12px_rgba(0,0,0,0.03)] font-sans">
      <div className="flex flex-col gap-6 overflow-y-auto">
        {/* Brand Header */}
        <a 
          href="#dashboard"
          onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}
          className="flex items-center gap-3 px-1 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#ea580c] flex items-center justify-center shadow-[0_4px_12px_rgba(234,88,12,0.28)] text-white">
            <span className="material-symbols-outlined text-[22px]">factory</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-lg text-[#1e2229] leading-none font-display">OGroup Studio</span>
            <span className="text-xs text-[#ea580c] font-bold tracking-wide mt-1">AI Software Factory</span>
          </div>
        </a>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            
            if (item.isHighlight) {
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab('build')}
                  className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all text-xs font-bold cursor-pointer shadow-md ${
                    isActive
                      ? 'bg-gradient-to-r from-[#ea580c] to-amber-500 text-white shadow-orange-500/25 ring-2 ring-orange-400'
                      : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-orange-500/20'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[20px] text-white">
                      {item.icon}
                    </span>
                    <span className="text-white font-extrabold">{item.titleEn}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-orange-100 font-sans">{item.titleAr}</span>
                </button>
              );
            }

            return (
              <div key={item.id} className="flex flex-col gap-1">
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all text-xs cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#ea580c] shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-[#e2ded8]/60 font-semibold'
                      : 'text-[#5f6672] hover:bg-white hover:text-[#1e2229]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-[#ea580c]' : 'text-[#948f88]'}`}>
                      {item.icon}
                    </span>
                    <span>{item.titleEn}</span>
                  </div>
                  <span className="text-[11px] text-[#948f88] font-sans">{item.titleAr}</span>
                </button>

                {/* Sub items for My Factory */}
                {item.subItems && (
                  <div className="pl-8 flex flex-col gap-1 pt-0.5">
                    {item.subItems.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => setActiveTab(sub.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                          activeTab === sub.id ? 'text-[#ea580c] font-bold bg-orange-50/60' : 'text-[#5f6672] hover:text-[#1e2229] hover:bg-white/60'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${sub.dotColor}`}></span>
                        <span>{sub.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Friendly Assistance Card */}
      <div className="bg-white p-4 rounded-xl border border-[#e2ded8]/60 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col gap-1.5 mt-2">
        <div className="flex items-center gap-1.5 text-[#ea580c] font-semibold text-xs">
          <span className="material-symbols-outlined text-[16px]">volunteer_activism</span>
          <span>Friendly Assistance</span>
        </div>
        <p className="text-xs text-[#5f6672] leading-relaxed">
          Need a warm human touch? Our founders community is live.
        </p>
        <button 
          onClick={() => setActiveTab('build')}
          className="text-[#ea580c] hover:text-[#f97316] font-bold text-xs transition-colors mt-1 inline-block text-left cursor-pointer"
        >
          Get Help • المساعدة →
        </button>
      </div>
    </aside>
  );
};
