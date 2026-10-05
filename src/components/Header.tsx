import React from 'react';
import { useBYOK } from '../context/BYOKContext';

export const Header: React.FC = () => {
  const { setActiveTab } = useBYOK();

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b border-stone-200">
      <div className="font-bold text-lg text-slate-800">BYOC Platform</div>
      <button
        onClick={() => setActiveTab('build')}
        className="px-4 py-2 rounded-xl bg-[#d97706] text-white font-bold text-xs"
      >
        Build Software
      </button>
    </header>
  );
};
