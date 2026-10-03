import React, { useState } from 'react';
import { useBYOK } from '../../context/BYOKContext';

export const AddModelModal: React.FC = () => {
  const { isAddModelOpen, setIsAddModelOpen, providers, addModel } = useBYOK();

  const [providerId, setProviderId] = useState(providers[0]?.id || '');
  const [name, setName] = useState('');
  const [apiModelId, setApiModelId] = useState('');
  const [contextWindow, setContextWindow] = useState(128000);

  if (!isAddModelOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !apiModelId.trim()) return;

    const provider = providers.find((p) => p.id === providerId) || providers[0];

    addModel({
      providerId: provider.id,
      providerName: provider.name,
      name,
      modelIdentifier: apiModelId,
      capabilities: ['code', 'function_calling', 'reasoning'],
      contextWindow,
      maxOutputTokens: 8192,
      costPer1kInputUsd: 0.001,
      costPer1kOutputUsd: 0.002,
      latencyMs: 250,
      status: 'available',
    });

    setIsAddModelOpen(false);
    setName('');
    setApiModelId('');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans text-[#1c212c]">
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-lg w-full border border-[#e2d9d2] shadow-2xl relative space-y-5">
        <div className="flex items-center justify-between border-b border-[#e2d9d2]/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#ea580c]">
              <span className="material-symbols-outlined text-[24px]">psychology</span>
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#1c212c]">Add Custom Model / إضافة نموذج</h3>
              <p className="text-xs text-[#948374]">Register Model Capabilities to Provider</p>
            </div>
          </div>

          <button
            onClick={() => setIsAddModelOpen(false)}
            className="text-[#948374] hover:text-[#1c212c] transition-colors p-1"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1c212c]">Provider Binding / المزود</label>
            <select
              value={providerId}
              onChange={(e) => setProviderId(e.target.value)}
              className="w-full bg-[#f9f8f6] border border-[#e2d9d2]/70 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#1c212c] outline-none focus:border-[#ea580c] cursor-pointer"
            >
              {providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.type})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1c212c]">Model Title / اسم النموذج</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Claude 3.5 Sonnet v2"
              required
              className="w-full bg-[#f9f8f6] border border-[#e2d9d2]/70 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#1c212c] outline-none focus:border-[#ea580c]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1c212c]">API Model ID / معرف API</label>
            <input
              type="text"
              value={apiModelId}
              onChange={(e) => setApiModelId(e.target.value)}
              placeholder="e.g. claude-3-5-sonnet-20241022"
              required
              className="w-full bg-[#f9f8f6] border border-[#e2d9d2]/70 rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#1c212c] outline-none focus:border-[#ea580c]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1c212c]">Context Window (Tokens)</label>
            <input
              type="number"
              value={contextWindow}
              onChange={(e) => setContextWindow(Number(e.target.value))}
              className="w-full bg-[#f9f8f6] border border-[#e2d9d2]/70 rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#1c212c] outline-none focus:border-[#ea580c]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModelOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-[#f5f3ef] hover:bg-[#e8e3dc] text-xs font-bold text-[#1c212c] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#ea580c] hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Register Model / إضافة النموذج</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
