import React, { useState } from 'react';
import { useBYOK } from '../../context/BYOKContext';

export const CreateProjectModal: React.FC = () => {
  const { isCreateProjectOpen, setIsCreateProjectOpen, createProject, createRun, setActiveTab, setActiveRunId } = useBYOK();
  const [name, setName] = useState('');
  const [mode, setMode] = useState<'byok' | 'managed'>('managed');
  const [intent, setIntent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isCreateProjectOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const derivedName = name.trim() || intent.slice(0, 30) || 'New App';
      const proj = await createProject(derivedName, mode);
      const newRun = await createRun(proj.id, `${derivedName} Assembly Run`, intent || `Build ${derivedName}`);
      setActiveRunId(newRun.id);
      setIsCreateProjectOpen(false);
      setName('');
      setIntent('');
      setActiveTab('build');
    } catch (err: any) {
      setError(err.message || 'Failed to initialize project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-[#e5e3dd] shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#e5e3dd]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ea580c]">auto_awesome</span>
            <h3 className="font-bold text-base text-[#1f242e]">Build New Software • ابدأ بناء برنامجك</h3>
          </div>
          <button onClick={() => setIsCreateProjectOpen(false)} className="text-[#887364] hover:text-[#1f242e] font-bold">✕</button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#1f242e] mb-1">Project Name (Optional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Real Estate Client Portal"
              className="w-full p-2.5 rounded-xl border border-[#e5e3dd] bg-[#faf8f5] outline-none focus:border-[#ea580c] focus:bg-white text-xs text-[#1f242e]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#1f242e] mb-1">Execution Mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as 'byok' | 'managed')}
              className="w-full p-2.5 rounded-xl border border-[#e5e3dd] bg-[#faf8f5] outline-none text-xs text-[#1f242e]"
            >
              <option value="managed">🌟 Managed Factory (100% Automated, Zero Setup)</option>
              <option value="byok">🔑 BYOK (Bring Your Own Key & Custom Models)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#1f242e] mb-1">Describe what you want to build • صف فكرتك</label>
            <textarea
              rows={4}
              required
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              placeholder="e.g., An online store for my bakery with Mada/Apple Pay checkout, order status tracker, and WhatsApp notifications..."
              className="w-full p-3 rounded-xl border border-[#e5e3dd] bg-[#faf8f5] outline-none focus:border-[#ea580c] focus:bg-white text-xs text-[#1f242e] resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateProjectOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e5e3dd] text-[#554336] font-bold hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-[#ea580c] hover:bg-orange-700 text-white font-bold disabled:opacity-50 shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              <span>{loading ? 'Initializing Run...' : 'Start Building My App'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
