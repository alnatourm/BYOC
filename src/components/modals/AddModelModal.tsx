import React, { useState } from 'react';
import { useBYOK } from '../../context/BYOKContext';
import { ModelCapability } from '../../types/byok';
import { X, Cpu } from 'lucide-react';

export const AddModelModal: React.FC = () => {
  const { isAddModelOpen, setIsAddModelOpen, providers, addModel } = useBYOK();

  const [providerId, setProviderId] = useState(providers[0]?.id || '');
  const [name, setName] = useState('');
  const [modelIdentifier, setModelIdentifier] = useState('');
  const [contextWindow, setContextWindow] = useState(128000);
  const [latencyMs, setLatencyMs] = useState(250);
  const [capabilities, setCapabilities] = useState<ModelCapability[]>(['code', 'function_calling']);

  if (!isAddModelOpen) return null;

  const toggleCapability = (cap: ModelCapability) => {
    setCapabilities((prev) =>
      prev.includes(cap) ? prev.filter((c) => c !== cap) : [...prev, cap]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !modelIdentifier.trim()) return;

    const provider = providers.find((p) => p.id === providerId) || providers[0];

    addModel({
      providerId: provider.id,
      providerName: provider.name,
      name,
      modelIdentifier,
      capabilities,
      contextWindow,
      maxOutputTokens: 8192,
      costPer1kInputUsd: 0.001,
      costPer1kOutputUsd: 0.002,
      latencyMs,
      status: 'available',
    });

    setIsAddModelOpen(false);
    setName('');
    setModelIdentifier('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white font-display">Add Model to Provider</h2>
          </div>

          <button onClick={() => setIsAddModelOpen(false)} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Belongs to Provider</label>
            <select
              value={providerId}
              onChange={(e) => setProviderId(e.target.value)}
              className="w-full bg-slate-950 text-white border border-slate-700 rounded-lg p-2.5"
            >
              {providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Model Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Gemini 2.5 Flash, GPT-4o, Claude Sonnet"
              required
              className="w-full bg-slate-950 text-white border border-slate-700 rounded-lg p-2.5"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">API Identifier String</label>
            <input
              type="text"
              value={modelIdentifier}
              onChange={(e) => setModelIdentifier(e.target.value)}
              placeholder="e.g. gemini-2.5-flash"
              required
              className="w-full bg-slate-950 text-white border border-slate-700 font-mono rounded-lg p-2.5"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Capabilities Exposed to Agents</label>
            <div className="flex flex-wrap gap-2 pt-1">
              {(['code', 'vision', 'function_calling', 'reasoning', 'image_gen', 'multimodal', 'fast_inference'] as ModelCapability[]).map((cap) => (
                <button
                  key={cap}
                  type="button"
                  onClick={() => toggleCapability(cap)}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded border transition ${
                    capabilities.includes(cap)
                      ? 'bg-indigo-600 text-white border-indigo-500 font-semibold'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {cap}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Context Window</label>
              <input
                type="number"
                value={contextWindow}
                onChange={(e) => setContextWindow(Number(e.target.value))}
                className="w-full bg-slate-950 text-white border border-slate-700 rounded-lg p-2.5 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Target Latency (ms)</label>
              <input
                type="number"
                value={latencyMs}
                onChange={(e) => setLatencyMs(Number(e.target.value))}
                className="w-full bg-slate-950 text-white border border-slate-700 rounded-lg p-2.5 font-mono"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModelOpen(false)}
              className="px-4 py-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition"
            >
              Add Model
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
