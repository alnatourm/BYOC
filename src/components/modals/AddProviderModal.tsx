import React, { useState } from 'react';
import { useBYOK } from '../../context/BYOKContext';
import { ProviderType } from '../../types/byok';
import { X, Lock, ShieldCheck } from 'lucide-react';

export const AddProviderModal: React.FC = () => {
  const { isAddProviderOpen, setIsAddProviderOpen, addProvider } = useBYOK();

  const [name, setName] = useState('');
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
    } else if (newType === 'stitch') {
      setBaseUrl('https://stitch.google.com/api/v1');
      setName('Google Stitch AI');
    } else if (newType === 'ollama') {
      setBaseUrl('http://localhost:11434');
      setName('Local Ollama Cluster');
    } else {
      setBaseUrl('https://my-custom-llm-proxy.internal');
      setName('Custom VLLM Endpoint');
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
        vaultKeyId: '',
        maskedSecret: '',
        isSecretInVault: true,
        status: 'active',
        rateLimitRpm: rateLimit,
      },
      secret
    );

    setIsSubmitting(false);
    setIsAddProviderOpen(false);
    setName('');
    setSecret('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white font-display">Add BYOK Provider</h2>
          </div>

          <button onClick={() => setIsAddProviderOpen(false)} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Provider Preset</label>
            <select
              value={type}
              onChange={(e) => handleTypeChange(e.target.value as ProviderType)}
              className="w-full bg-slate-950 text-white border border-slate-700 rounded-lg p-2.5 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="gemini">Google Gemini AI</option>
              <option value="stitch">Google Stitch AI (Design Engine)</option>
              <option value="openai">OpenAI Enterprise</option>
              <option value="anthropic">Anthropic Claude</option>
              <option value="groq">Groq Cloud LPU</option>
              <option value="deepseek">DeepSeek AI</option>
              <option value="ollama">Local Ollama / vLLM</option>
              <option value="custom">Custom Endpoint</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Provider Label / Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-slate-950 text-white border border-slate-700 rounded-lg p-2.5 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Base URL Endpoint</label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              required
              className="w-full bg-slate-950 text-white border border-slate-700 rounded-lg p-2.5 font-mono focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">API Key / Secret (Encrypted in Vault)</label>
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="e.g. sk-proj-••••••••"
              className="w-full bg-slate-950 text-white border border-slate-700 rounded-lg p-2.5 font-mono focus:ring-1 focus:ring-indigo-500"
            />
            <p className="text-[10px] text-slate-500 mt-1 italic">
              "Provider metadata only. Secrets stay in the encrypted server vault."
            </p>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Rate Limit (RPM)</label>
            <input
              type="number"
              value={rateLimit}
              onChange={(e) => setRateLimit(Number(e.target.value))}
              className="w-full bg-slate-950 text-white border border-slate-700 rounded-lg p-2.5 font-mono focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddProviderOpen(false)}
              className="px-4 py-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition"
            >
              {isSubmitting ? 'Encrypting...' : 'Seal in Server Vault'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
