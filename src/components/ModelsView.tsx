import React from 'react';
import { useBYOK } from '../context/BYOKContext';

export const ModelsView: React.FC = () => {
  const { models, providers, setIsAddModelOpen } = useBYOK();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#1f242e]">Model Registry & Configuration</h2>
          <p className="text-xs text-stone-500 mt-1">Configured AI models used by system role dispatches.</p>
        </div>
        <button
          onClick={() => setIsAddModelOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#d97706] hover:bg-amber-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Add Model</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map((model) => (
          <div key={model.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[#1f242e]">{model.name}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-[#d97706] font-bold border border-amber-200">
                {model.modelIdentifier}
              </span>
            </div>
            <p className="text-xs text-stone-500">Provider: Google Gemini</p>
            <div className="flex flex-wrap gap-1 pt-2">
              {model.capabilities?.map((cap, idx) => (
                <span key={idx} className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                  {cap}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
