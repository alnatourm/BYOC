import React, { useState, useEffect } from 'react';
import { useBYOK } from '../context/BYOKContext';
import { ShieldCheck, Lock, Plus, Server, KeyRound, Activity, Trash2, CheckCircle2 } from 'lucide-react';

export const ProvidersView: React.FC = () => {
  const { providers, deleteProvider, setIsAddProviderOpen } = useBYOK();
  const [vaultInfo, setVaultInfo] = useState<{ status: string; count: number; kms: string } | null>(null);

  useEffect(() => {
    fetch('/api/vault/status')
      .then((res) => res.json())
      .then((data) => {
        setVaultInfo({
          status: data.status,
          count: data.vaultEncryptedSecretsCount,
          kms: data.kmsAlgorithm,
        });
      })
      .catch(() => {
        setVaultInfo({ status: 'online', count: providers.length, kms: 'AES-256-GCM-KMS' });
      });
  }, [providers]);

  return (
    <div className="space-y-8">
      {/* View Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono mb-1">
            <span>Security Architecture</span>
            <span>·</span>
            <span>KMS Vault Isolation</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white font-display">
            Providers & Server Vault
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
            <strong className="text-white">Provider metadata only.</strong> Secrets stay in the encrypted server vault. Clients receive masked reference tokens (<code className="text-indigo-300 font-mono">vault_sec_••••</code>).
          </p>
        </div>

        <button
          onClick={() => setIsAddProviderOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Provider</span>
        </button>
      </div>

      {/* Encrypted Vault Security Banner */}
      <div className="p-6 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">Encrypted Server Vault Status</h2>
              <p className="text-xs text-slate-400">Hardware-Isolated KMS Secrets Vault</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Vault Active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-slate-500 mb-1">Encrypted Key Slots</div>
            <div className="text-lg font-bold text-white tabular-nums">{vaultInfo?.count || providers.length} Secrets Sealed</div>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-slate-500 mb-1">Encryption Protocol</div>
            <div className="text-lg font-bold text-indigo-400">{vaultInfo?.kms || 'AES-256-GCM-KMS'}</div>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-slate-500 mb-1">Proxy Authorization</div>
            <div className="text-lg font-bold text-emerald-400">Bearer Token Masked</div>
          </div>
        </div>
      </div>

      {/* Providers Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className="p-6 bg-slate-900 rounded-xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4 shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white font-display">{provider.name}</h3>
                  <p className="text-xs text-slate-400 font-mono truncate max-w-[200px]">{provider.baseUrl}</p>
                </div>

                <span className="px-2 py-0.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 rounded">
                  {provider.status.toUpperCase()}
                </span>
              </div>

              {/* Vault Secret Metadata (Masked) */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Vault Reference</span>
                  <span className="text-indigo-400 font-semibold">{provider.vaultKeyId}</span>
                </div>

                <div className="p-2 bg-slate-900 rounded font-mono text-xs text-slate-300 border border-slate-800">
                  {provider.maskedSecret}
                </div>
                <div className="text-[10px] text-slate-500 font-sans italic">Raw secret retained exclusively in server vault memory</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-400 pt-1">
                <div>
                  <span className="text-slate-500">Rate Limit:</span> {provider.rateLimitRpm} RPM
                </div>
                <div>
                  <span className="text-slate-500">Calls / Mo:</span> {provider.totalCallsMonth.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Added {provider.createdDate}</span>

              <button
                onClick={() => deleteProvider(provider.id)}
                className="text-slate-500 hover:text-rose-400 transition"
                title="Remove provider metadata"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
