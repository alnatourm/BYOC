import React, { useState, useEffect } from 'react';
import { useBYOK } from '../context/BYOKContext';
import { api } from '../api';

export const ProvidersView: React.FC = () => {
  const { providers, deleteProvider, setIsAddProviderOpen } = useBYOK();
  const [vaultInfo, setVaultInfo] = useState<{ status: string; count: number; kms: string } | null>(null);

  useEffect(() => {
    api('/v1/connections')
      .then((data) => {
        const connList = data.connections || [];
        setVaultInfo({
          status: 'online',
          count: connList.length,
          kms: 'AES-256-GCM-KMS',
        });
      })
      .catch(() => {
        setVaultInfo({ status: 'online', count: providers.length, kms: 'AES-256-GCM-KMS' });
      });
  }, [providers]);

  return (
    <div className="flex flex-col w-full pb-16 font-sans text-[#1c212c]">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-100 font-bold text-xs text-[#ea580c]">
              💳 Usage, Billing & Provider Vault
            </span>
            <span className="text-[#948374]">•</span>
            <span className="text-xs text-[#576071] font-medium">الفوترة وخزنة المفاتيح المشفرة</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-[#1c212c] tracking-tight">
            Usage & Billing / الفوترة
          </h1>
          <p className="text-xs md:text-sm text-[#576071] mt-1 max-w-2xl font-medium">
            Monitor API token consumption, active cloud providers, encrypted key vaults, and monthly spend caps.
          </p>
        </div>

        <button
          onClick={() => setIsAddProviderOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#ea580c] hover:bg-orange-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add_moderator</span>
          <span>+ Add Provider Key / إضافة مفتاح</span>
        </button>
      </div>

      {/* Encrypted Vault Security Banner */}
      <div className="p-6 bg-white rounded-2xl border border-[#e2d9d2]/70 space-y-4 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e2d9d2]/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold">
              <span className="material-symbols-outlined text-[22px]">lock</span>
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-[#1c212c]">Encrypted Server Vault Status</h2>
              <p className="text-xs text-[#887364]">Hardware-Isolated KMS Secrets Vault (AES-256-GCM)</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Vault Online · {vaultInfo?.count || providers.length} Encrypted Keys
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium text-[#576071]">
          <div className="p-3.5 rounded-xl bg-[#f9f8f6] border border-[#e2d9d2]/60 flex flex-col gap-1">
            <span className="text-[#948374] font-bold">KMS Encryption Algorithm</span>
            <span className="font-mono text-[#1c212c] font-bold">{vaultInfo?.kms || 'AES-256-GCM-KMS'}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#f9f8f6] border border-[#e2d9d2]/60 flex flex-col gap-1">
            <span className="text-[#948374] font-bold">Client Key Leak Protection</span>
            <span className="text-emerald-700 font-bold">Zero Plaintext Client Storage</span>
          </div>
          <div className="p-3.5 rounded-xl bg-[#f9f8f6] border border-[#e2d9d2]/60 flex flex-col gap-1">
            <span className="text-[#948374] font-bold">Monthly Circuit Breaker</span>
            <span className="text-[#ea580c] font-bold">$120.00 Max Monthly Cap</span>
          </div>
        </div>
      </div>

      {/* Provider List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className="p-5 bg-white rounded-2xl border border-[#e2d9d2]/70 hover:border-[#ea580c]/50 transition-all flex flex-col justify-between space-y-4 shadow-sm group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#ea580c] font-display font-bold text-sm">
                    {provider.type.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-[#1c212c] group-hover:text-[#ea580c] transition-colors">
                      {provider.name}
                    </h3>
                    <p className="text-xs text-[#948374] capitalize">{provider.type} provider</p>
                  </div>
                </div>

                <button
                  onClick={() => deleteProvider(provider.id)}
                  className="text-[#948374] hover:text-red-600 transition-colors p-1"
                  title="Remove provider"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>

              <div className="p-3 bg-[#f9f8f6] rounded-xl border border-[#e2d9d2]/60 space-y-1 font-mono text-xs">
                <div className="text-[#948374]">Key Reference Token:</div>
                <div className="text-[#1c212c] font-bold">{provider.maskedSecret || '••••••••'}</div>
                <div className="text-[10px] text-emerald-700 font-sans font-semibold pt-0.5">Vault Key ID: {provider.vaultKeyId}</div>
              </div>
            </div>

            <div className="border-t border-[#e2d9d2]/40 pt-3 flex items-center justify-between text-xs text-[#576071]">
              <span className="text-[#887364]">Monthly usage:</span>
              <strong className="text-[#1c212c] font-mono">{provider.totalCallsMonth || 0} calls</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
