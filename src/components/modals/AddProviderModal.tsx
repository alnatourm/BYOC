import React, { useState } from 'react';
import { useBYOK } from '../../context/BYOKContext';
import { ProviderType } from '../../types/byok';

export const AddProviderModal: React.FC = () => {
  const { isAddProviderOpen, setIsAddProviderOpen, addProvider } = useBYOK();

  const [name, setName] = useState('Google Gemini AI');
  const [type, setType] = useState<ProviderType>('gemini');
  const [baseUrl, setBaseUrl] = useState('https://generativelanguage.googleapis.com');
  const [secret, setSecret] = useState('');
  const [rateLimit, setRateLimit] = useState(300);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAddProviderOpen) return null;

  const handleTypeChange = (newType: ProviderType) => {
    setType(newType);
    if (newType === 'gemini') {
      setBaseUrl('https://generativelanguage.googleapis.com');
      setName('Google Gemini AI');
    } else if (newType === 'openai') {
      setBaseUrl('https://api.openai.com/v1');
      setName('OpenAI Enterprise');
    } else if (newType === 'anthropic') {
      setBaseUrl('https://api.anthropic.com/v1');
      setName('Anthropic Claude');
    } else if (newType === 'groq') {
      setBaseUrl('https://api.groq.com/openai/v1');
      setName('Groq Cloud');
    } else if (newType === 'deepseek') {
      setBaseUrl('https://api.deepseek.com/v1');
      setName('DeepSeek AI');
    } else if (newType === 'ollama') {
      setBaseUrl('http://localhost:11434');
      setName('Local Ollama Cluster');
    } else {
      setBaseUrl('https://my-custom-llm-proxy.internal');
      setName('Custom Endpoint');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    await addProvider(
      {
        name,
        type,
        baseUrl,
        maskedSecret: secret ? `sk-${secret.slice(-4)}` : '••••••••',
        rateLimitRpm: rateLimit,
        vaultKeyId: `vault_${Date.now()}`,
        isSecretInVault: true,
        status: 'active',
      },
      secret
    );
    setIsSubmitting(false);
    setIsAddProviderOpen(false);
    setSecret('');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans text-[#1c212c]">
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-lg w-full border border-[#e2d9d2] shadow-2xl relative space-y-5">
        <div className="flex items-center justify-between border-b border-[#e2d9d2]/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#ea580c]">
              <span className="material-symbols-outlined text-[24px]">key</span>
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#1c212c]">Add AI Provider / إضافة مزود</h3>
              <p className="text-xs text-[#948374]">AES-256 Encrypted Key Vault Injection</p>
            </div>
          </div>

          <button
            onClick={() => setIsAddProviderOpen(false)}
            className="text-[#948374] hover:text-[#1c212c] transition-colors p-1"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1c212c]">Provider Type / نوع المزود</label>
            <select
              value={type}
              onChange={(e) => handleTypeChange(e.target.value as ProviderType)}
              className="w-full bg-[#f9f8f6] border border-[#e2d9d2]/70 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#1c212c] outline-none focus:border-[#ea580c] cursor-pointer"
            >
              <option value="gemini">Google Gemini AI</option>
              <option value="openai">OpenAI Enterprise</option>
              <option value="anthropic">Anthropic Claude</option>
              <option value="groq">Groq LPU Engine</option>
              <option value="deepseek">DeepSeek AI</option>
              <option value="ollama">Local Ollama Node</option>
              <option value="custom">Custom Endpoint / Proxy</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1c212c]">Display Name / الاسم</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-[#f9f8f6] border border-[#e2d9d2]/70 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#1c212c] outline-none focus:border-[#ea580c]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1c212c]">API Key / المفتاح المشفر</label>
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="sk-••••••••••••••••••••"
              className="w-full bg-[#f9f8f6] border border-[#e2d9d2]/70 rounded-xl px-3.5 py-2.5 text-xs font-mono text-[#1c212c] outline-none focus:border-[#ea580c]"
            />
            <span className="text-[10px] text-emerald-700 font-semibold block pt-0.5">
              🔒 Encrypted directly into KMS Vault. Zero plaintext client storage.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAddProviderOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-[#f5f3ef] hover:bg-[#e8e3dc] text-xs font-bold text-[#1c212c] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#ea580c] hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add_moderator</span>
              <span>{isSubmitting ? 'Injecting Key...' : 'Save & Encrypt Key / حفظ'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
