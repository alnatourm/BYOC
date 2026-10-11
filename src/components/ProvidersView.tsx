import React, { useState, useEffect } from 'react';
import { useBYOK } from '../context/BYOKContext';
import { AddProviderModal } from './modals/AddProviderModal';

export const ProvidersView: React.FC = () => {
  const { connections, providers, deleteProvider, verifyConnection, setIsAddProviderOpen } = useBYOK();
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verifyMessage, setVerifyMessage] = useState<{ id: string; success: boolean; text: string } | null>(null);

  const displayList = connections.length > 0
    ? connections.map((c) => ({
        id: c.id,
        name: c.label,
        type: c.type,
        status: c.status,
        maskedSecret: `••••${c.last4}`,
        vaultKeyId: c.fingerprint,
        lastVerifiedAt: c.lastVerifiedAt,
        isRealConnection: true,
      }))
    : providers.map((p) => ({
        id: p.id,
        name: p.name,
        type: p.type,
        status: p.status,
        maskedSecret: p.maskedSecret,
        vaultKeyId: p.vaultKeyId,
        lastVerifiedAt: undefined,
        isRealConnection: false,
      }));

  const handleVerify = async (id: string) => {
    setVerifyingId(id);
    setVerifyMessage(null);
    try {
      const res = await verifyConnection(id);
      setVerifyMessage({ id, success: true, text: res.message || 'Key verified successfully!' });
    } catch (err: any) {
      setVerifyMessage({ id, success: false, text: err.message || 'Verification failed.' });
    } finally {
      setVerifyingId(null);
    }
  };

  const handleDelete = async (id: string, isRealConnection: boolean) => {
    if (!confirm('Are you sure you want to delete this provider key from the encrypted vault?')) return;
    if (isRealConnection) {
      await deleteProvider(id);
    }
  };

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
            Vault Online · {displayList.length} Encrypted Keys
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium text-[#576071]">
          <div className="p-3.5 rounded-xl bg-[#f9f8f6] border border-[#e2d9d2]/60 flex flex-col gap-1">
            <span className="text-[#948374] font-bold">KMS Encryption Algorithm</span>
            <span className="font-mono text-[#1c212c] font-bold">AES-256-GCM-KMS</span>
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
        {displayList.map((item) => (
          <div
            key={item.id}
            className="p-5 bg-white rounded-2xl border border-[#e2d9d2]/70 hover:border-[#ea580c]/50 transition-all flex flex-col justify-between space-y-4 shadow-sm group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#ea580c] font-display font-bold text-sm">
                    {item.type.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-[#1c212c] group-hover:text-[#ea580c] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#948374] capitalize">{item.type} provider</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(item.id, item.isRealConnection)}
                  className="text-[#948374] hover:text-red-600 transition-colors p-1"
                  title="Remove provider key"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>

              <div className="p-3 bg-[#f9f8f6] rounded-xl border border-[#e2d9d2]/60 space-y-1 font-mono text-xs">
                <div className="flex items-center justify-between text-[#948374]">
                  <span>Key Reference Token:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold capitalize ${
                      item.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'failed'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="text-[#1c212c] font-bold">{item.maskedSecret}</div>
                <div className="text-[10px] text-emerald-700 font-sans font-semibold pt-0.5 truncate">
                  Fingerprint / Vault ID: {item.vaultKeyId}
                </div>
              </div>

              {verifyMessage && verifyMessage.id === item.id && (
                <div
                  className={`p-2.5 rounded-lg text-xs font-medium ${
                    verifyMessage.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {verifyMessage.text}
                </div>
              )}
            </div>

            <div className="border-t border-[#e2d9d2]/40 pt-3 flex items-center justify-between text-xs text-[#576071]">
              <span className="text-[#887364]">
                {item.lastVerifiedAt ? `Verified: ${new Date(item.lastVerifiedAt).toLocaleDateString()}` : 'Encrypted Vault Key'}
              </span>
              {item.isRealConnection && (
                <button
                  onClick={() => handleVerify(item.id)}
                  disabled={verifyingId === item.id}
                  className="px-3 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 font-bold text-[11px] text-[#1c212c] transition-colors disabled:opacity-50"
                >
                  {verifyingId === item.id ? 'Verifying...' : 'Verify Key'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Render Add Provider Key Modal */}
      <AddProviderModal />
    </div>
  );
};
