import React from 'react';
import { useBYOK } from '../context/BYOKContext';

export const LiveStudioView: React.FC = () => {
  const { setActiveTab } = useBYOK();

  return (
    <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-xs space-y-4">
      <h2 className="text-xl font-bold text-[#1f242e]">Advanced Assembly Console</h2>
      <p className="text-xs text-stone-600 leading-relaxed">
        Real-time pipeline orchestration is managed via the governed 5-role assembly workspace.
      </p>
      <button
        onClick={() => setActiveTab('build')}
        className="px-5 py-2.5 rounded-xl bg-[#d97706] text-white font-bold text-xs"
      >
        Open 5-Role Build Workspace
      </button>
    </div>
  );
};
