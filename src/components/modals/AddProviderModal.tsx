import React, { useState } from 'react';
import { useBYOK } from '../../context/BYOKContext';

export const AddProviderModal: React.FC = () => {
  const { isAddProviderOpen, setIsAddProviderOpen, addConnection } = useBYOK();
  const [type, setType] = useState('gemini');
  const [label, setLabel] = useState('');
  const [secret, setSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAddProviderOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await addConnection(type, label, secret);
      setIsAddProviderOpen(false);
      setLabel('');
      setSecret('');
    } catch (err: any) {
      setError(err.message || 'Failed to add connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-stone-200 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <h3 className="font-bold text-base text-[#1f242e]">Add Encrypted Provider Key (BYOK)</h3>
          <button onClick={() => setIsAddProviderOpen(false)} className="text-stone-400 hover:text-stone-600">✕</button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1">Provider Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-stone-300 outline-none text-xs bg-white"
            >
              <option value="gemini">Google Gemini API</option>
              <option value="anthropic">Anthropic Claude</option>
              <option value="openai">OpenAI GPT-4</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Connection Label</label>
            <input
              type="text"
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. My Organization Gemini Key"
              className="w-full p-2.5 rounded-lg border border-stone-300 outline-none focus:border-amber-500 text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">API Key / Secret (Write-Only)</label>
            <input
              type="password"
              required
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full p-2.5 rounded-lg border border-stone-300 outline-none focus:border-amber-500 text-xs font-mono"
            />
            <p className="text-[10px] text-stone-500 mt-1">Secrets are encrypted with AES-256-GCM in vault and never returned in plaintext.</p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddProviderOpen(false)}
              className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-[#d97706] hover:bg-amber-700 text-white font-bold disabled:opacity-50"
            >
              {loading ? 'Encrypting...' : 'Save Encrypted Key'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
