import React from 'react';
import { useBYOK } from '../context/BYOKContext';

export const ModelsView: React.FC = () => {
  const { models, providers, deleteModel, setIsAddModelOpen } = useBYOK();

  return (
    <div className="flex flex-col w-full pb-16 font-sans text-[#1c212c]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-100 font-bold text-xs text-[#ea580c]">
              ⚡ System Settings & Intelligence Registry
            </span>
            <span className="text-[#948374]">•</span>
            <span className="text-xs text-[#576071] font-medium">الإعدادات وسجل النماذج الذكية</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-[#1c212c] tracking-tight">
            Settings & Model Catalog / الإعدادات
          </h1>
          <p className="text-xs md:text-sm text-[#576071] mt-1 max-w-2xl font-medium">
            Manage global AI model catalogs, context windows, token pricing limits, and provider bindings.
          </p>
        </div>

        <button
          onClick={() => setIsAddModelOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#ea580c] hover:bg-orange-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Add Custom Model / إضافة نموذج</span>
        </button>
      </div>

      {/* Models Grouped by Provider */}
      <div className="space-y-6">
        {providers.map((provider) => {
          const providerModels = models.filter((m) => m.providerId === provider.id || m.providerName === provider.name);

          return (
            <div key={provider.id} className="bg-white rounded-2xl border border-[#e2d9d2]/70 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#e2d9d2]/50 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-[#ea580c] font-display font-bold text-sm">
                    {provider.type.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-[#1c212c]">{provider.name}</h3>
                    <div className="text-xs font-mono text-[#948374]">Vault ID: {provider.vaultKeyId}</div>
                  </div>
                </div>

                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {providerModels.length} Models Registered
                </span>
              </div>

              {providerModels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {providerModels.map((model) => (
                    <div
                      key={model.id}
                      className="p-4 bg-[#f9f8f6] rounded-xl border border-[#e2d9d2]/60 hover:border-[#ea580c]/50 transition-all flex flex-col justify-between gap-3 group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-display font-bold text-sm text-[#1c212c] group-hover:text-[#ea580c] transition-colors">
                            {model.name}
                          </h4>
                          <button
                            onClick={() => deleteModel(model.id)}
                            className="text-[#948374] hover:text-red-600 transition-colors p-1"
                            title="Delete model"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                        <div className="text-[11px] font-mono text-[#887364] bg-white px-2 py-0.5 rounded border border-[#e2d9d2]/50 inline-block">
                          {model.modelIdentifier}
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-[#576071] border-t border-[#e2d9d2]/40 pt-2 font-medium">
                        <div className="flex justify-between">
                          <span>Context Window:</span>
                          <strong className="text-[#1c212c] font-mono">{(model.contextWindow / 1000).toFixed(0)}k tokens</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Cost per 1M Input:</span>
                          <strong className="text-[#1c212c] font-mono">${model.costPer1kInputUsd ? (model.costPer1kInputUsd * 1000).toFixed(2) : '0.00'}</strong>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {model.capabilities?.map((cap, idx) => (
                          <span key={idx} className="text-[10px] bg-orange-50 text-[#ea580c] font-bold px-2 py-0.5 rounded border border-orange-200">
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-[#948374] italic">
                  No models attached to this provider yet.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
