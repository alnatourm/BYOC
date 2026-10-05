import React, { useState } from 'react';
import { useBYOK } from '../context/BYOKContext';

interface TopHeaderProps {
  user?: any;
  tenant?: any;
  lang?: 'en' | 'ar';
  setLang?: (l: 'en' | 'ar') => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ user, tenant, lang = 'en', setLang }) => {
  const { setActiveTab, connections } = useBYOK();
  const [searchQuery, setSearchQuery] = useState('');

  const isSuperAdmin = user?.platformRole === 'super_admin';
  const activeConn = connections[0];
  const maskedKeyDisplay = activeConn ? `••••${activeConn.last4}` : null;

  return (
    <header className="fixed top-0 left-72 right-0 h-20 bg-[#f8f7f5]/90 backdrop-blur-md z-40 border-b border-[#e2ded8]/60 shadow-[0_1px_6px_rgba(0,0,0,0.02)] px-8 flex items-center justify-between gap-4 font-sans">
      <div className="flex-1 max-w-lg">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-4 text-[#948f88] text-[20px]">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search software runs, dispatches, gates... (⌘K)"
            className="w-full pl-12 pr-4 py-2.5 rounded-full bg-white border border-[#e2ded8]/70 text-[#1e2229] placeholder-[#948f88] text-xs outline-none focus:border-[#ea580c] focus:ring-2 focus:ring-[#ea580c]/20 shadow-[0_1px_4px_rgba(0,0,0,0.03)] transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {maskedKeyDisplay && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-mono font-bold text-amber-900">
            <span className="material-symbols-outlined text-[16px] text-amber-600">key</span>
            <span>Key: {maskedKeyDisplay}</span>
          </div>
        )}

        <button
          onClick={() => setActiveTab('build')}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs rounded-xl hover:from-orange-600 hover:to-amber-600 shadow-sm shadow-orange-500/25 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Build Software</span>
        </button>

        {setLang && (
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#f1eee9] border border-[#e2ded8]/60 text-[#1e2229] font-semibold text-xs transition-colors cursor-pointer"
          >
            <span>{lang === 'en' ? 'العربية' : 'English'}</span>
          </button>
        )}

        {isSuperAdmin && (
          <button
            onClick={() => setActiveTab('admin')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1c212c] text-amber-400 hover:bg-stone-800 border border-amber-500/40 font-bold text-xs shadow-xs transition-colors cursor-pointer"
            title="Open Super Admin Panel"
          >
            <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
            <span>Super Admin</span>
          </button>
        )}

        <div className="flex items-center gap-2.5 pl-1 py-1 pr-3.5 rounded-full bg-white border border-[#e2ded8]/60 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="w-7 h-7 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center font-bold text-xs text-[#ea580c]">
            {user?.email ? user.email.slice(0, 2).toUpperCase() : 'US'}
          </div>
          <div className="flex flex-col text-left">
            <span className="font-bold text-xs text-[#1e2229] truncate max-w-[120px]">{user?.email || 'Authenticated User'}</span>
            <span className="text-[10px] text-stone-500">{tenant?.name || 'Tenant'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
