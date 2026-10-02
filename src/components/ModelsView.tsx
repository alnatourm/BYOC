import React from 'react';
import { useBYOK } from '../context/BYOKContext';
import { Plus, Cpu, Zap, Shield, Eye, Code, Wrench, Trash2 } from 'lucide-react';

export const ModelsView: React.FC = () => {
  const { models, providers, deleteModel, setIsAddModelOpen } = useBYOK();

  return (
    <div className="space-y-8">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono mb-1">
            <span>Model Registry</span>
            <span>·</span>
            <span>Provider Capabilities</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white font-display">
            Models Catalog
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
            <strong className="text-white">Models belong to providers</strong> and expose capabilities to worker agents.
          </p>
        </div>

        <button
          onClick={() => setIsAddModelOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Model</span>
        </button>
      </div>

      {/* Models Table / Cards */}
      <div className="space-y-6">
        {providers.map((provider) => {
          const providerModels = models.filter((m) => m.providerId === provider.id || m.providerName === provider.name);

          return (
            <div key={provider.id} className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs font-mono">
                    {provider.type.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-display">{provider.name}</h3>
                    <div className="text-xs text-slate-400 font-mono">Vault ID: {provider.vaultKeyId}</div>
                  </div>
                </div>

                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded">
                  {providerModels.length} Models
                </span>
              </div>

              {providerModels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {providerModels.map((model) => (
                    <div
                      key={model.id}
                      className="p-4 bg-slate-950/80 rounded-lg border border-slate-800 hover:border-slate-700 transition space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-sm font-bold text-white font-display">{model.name}</div>
                          <div className="text-[11px] font-mono text-indigo-300 mt-0.5">{model.modelIdentifier}</div>
                        </div>

                        <button
                          onClick={() => deleteModel(model.id)}
                          className="text-slate-500 hover:text-rose-400 transition"
                          title="Delete model"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Capabilities */}
                      <div className="flex flex-wrap gap-1">
                        {model.capabilities.map((cap, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 text-[10px] font-mono text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded"
                          >
                            {cap}
                          </span>
                        ))}
                      </div>

                      {/* Spec metrics */}
                      <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                        <div>
                          <span className="text-slate-500">Context:</span> {(model.contextWindow / 1000).toFixed(0)}k
                        </div>
                        <div>
                          <span className="text-slate-500">Latency:</span> {model.latencyMs}ms
                        </div>
                        <div>
                          <span className="text-slate-500">Input 1k:</span> ${model.costPer1kInputUsd}
                        </div>
                        <div>
                          <span className="text-slate-500">Output 1k:</span> ${model.costPer1kOutputUsd}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic py-2">No models registered for this provider yet.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
