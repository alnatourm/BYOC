import React, { useState } from 'react';
import { useBYOK } from '../context/BYOKContext';

export const TopHeader: React.FC = () => {
  const { setActiveTab } = useBYOK();
  const [searchQuery, setSearchQuery] = useState('');
  const [isArabic, setIsArabic] = useState(false);

  return (
    <header className="fixed top-0 left-72 right-0 h-20 bg-[#f8f7f5]/90 backdrop-blur-md z-40 border-b border-[#e2ded8]/60 shadow-[0_1px_6px_rgba(0,0,0,0.02)] px-8 flex items-center justify-between gap-4 font-sans">
      {/* Search Input */}
      <div className="flex-1 max-w-lg">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-4 text-[#948f88] text-[20px]">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search software, templates, agents... (⌘K)"
            className="w-full pl-12 pr-4 py-2.5 rounded-full bg-white border border-[#e2ded8]/70 text-[#1e2229] placeholder-[#948f88] text-xs outline-none focus:border-[#ea580c] focus:ring-2 focus:ring-[#ea580c]/20 shadow-[0_1px_4px_rgba(0,0,0,0.03)] transition-all"
          />
        </div>
      </div>

      {/* Right Header Items */}
      <div className="flex items-center gap-3">
        {/* Factory Status Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Factory: <strong className="font-bold text-emerald-700">100% Online</strong></span>
        </div>

        {/* Build New Software Button */}
        <button
          onClick={() => setActiveTab('build')}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs rounded-xl hover:from-orange-600 hover:to-amber-600 shadow-sm shadow-orange-500/25 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Build New Software</span>
        </button>

        {/* Language Toggle */}
        <button
          onClick={() => setIsArabic((prev) => !prev)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#f1eee9] border border-[#e2ded8]/60 text-[#1e2229] font-semibold text-xs transition-colors cursor-pointer"
        >
          <span>{isArabic ? 'EN / عربي' : 'عربي / EN'}</span>
        </button>

        {/* Notification Icon */}
        <button className="relative w-9 h-9 rounded-full bg-white border border-[#e2ded8]/60 hover:bg-[#f1eee9] flex items-center justify-center text-[#5f6672] transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ea580c] ring-2 ring-white"></span>
        </button>

        {/* User Profile Badge */}
        <div className="flex items-center gap-2.5 pl-1 py-1 pr-3.5 rounded-full bg-white border border-[#e2ded8]/60 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="w-7 h-7 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center font-bold text-xs text-[#ea580c]">
            TA
          </div>
          <span className="font-bold text-xs text-[#1e2229]">Tariq A.</span>
        </div>
      </div>
    </header>
  );
};
