import React, { useState } from 'react';
import { useBYOK } from '../../context/BYOKContext';

export const CreateProjectModal: React.FC = () => {
  const { isCreateProjectOpen, setIsCreateProjectOpen, createProject, createRun, setActiveTab } = useBYOK();
  const [name, setName] = useState('');
  const [mode, setMode] = useState<'byok' | 'managed'>('byok');
  const [intent, setIntent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isCreateProjectOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const proj = await createProject(name, mode);
      await createRun(proj.id, `${name} Run 1.0`, intent || `Build ${name}`);
      setIsCreateProjectOpen(false);
      setName('');
      setIntent('');
      setActiveTab('build');
    } catch (err: any) {
      setError(err.message || 'Failed to create project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-stone-200 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <h3 className="font-bold text-base text-[#1f242e]">Create New Governed Software Project</h3>
          <button onClick={() => setIsCreateProjectOpen(false)} className="text-stone-400 hover:text-stone-600">✕</button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-stone-700 mb-1">Project Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sameer Saloon Mobile App"
              className="w-full p-2.5 rounded-lg border border-stone-300 outline-none focus:border-amber-500 text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Execution Mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as 'byok' | 'managed')}
              className="w-full p-2.5 rounded-lg border border-stone-300 outline-none text-xs bg-white"
            >
              <option value="byok">BYOK (Bring Your Own Key)</option>
              <option value="managed">Managed Factory</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Project Brief / Intent</label>
            <textarea
              rows={3}
              required
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              placeholder="Describe software requirements (e.g. appointment booking app for Sameer Saloon with Gold & White colors)..."
              className="w-full p-2.5 rounded-lg border border-stone-300 outline-none focus:border-amber-500 text-xs resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateProjectOpen(false)}
              className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-[#d97706] hover:bg-amber-700 text-white font-bold disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Initialize Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
