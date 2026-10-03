import React, { useState } from 'react';
import { useBYOK } from '../../context/BYOKContext';

export const CreateProjectModal: React.FC = () => {
  const { isCreateProjectOpen, setIsCreateProjectOpen, roles, agents, models, runTeamOrchestration, isOrchestrating, setSelectedArtifact, setActiveTab } = useBYOK();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('SaaS Dashboard');
  const [prompt, setPrompt] = useState('');

  if (!isCreateProjectOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !prompt.trim() || isOrchestrating) return;

    const artifact = await runTeamOrchestration(title, prompt, category);
    setIsCreateProjectOpen(false);
    if (artifact) {
      setSelectedArtifact(artifact);
      setActiveTab('dashboard');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans text-[#1c212c]">
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-lg w-full border border-[#e2d9d2] shadow-2xl relative space-y-5">
        <div className="flex items-center justify-between border-b border-[#e2d9d2]/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#ea580c]">
              <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#1c212c]">Create New Software / بناء جديد</h3>
              <p className="text-xs text-[#948374]">OGroup Autonomous AI Factory Pipeline</p>
            </div>
          </div>

          <button
            onClick={() => setIsCreateProjectOpen(false)}
            className="text-[#948374] hover:text-[#1c212c] transition-colors p-1"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1c212c]">Software Name / اسم التطبيق</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Pet Grooming Appointment App"
              required
              className="w-full bg-[#f9f8f6] border border-[#e2d9d2]/70 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#1c212c] focus:outline-none focus:border-[#ea580c]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1c212c]">Category / التصنيف</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#f9f8f6] border border-[#e2d9d2]/70 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#1c212c] focus:outline-none focus:border-[#ea580c] cursor-pointer"
            >
              <option value="SaaS Dashboard">SaaS Dashboard / لوحة تحكم</option>
              <option value="Booking & Appointments">Booking & Appointments / حجز مواعيد</option>
              <option value="E-Commerce Retail">E-Commerce Retail / متجر إلكتروني</option>
              <option value="Mobile Touch App">Mobile Touch App / تطبيق جوال</option>
              <option value="Custom Software">Custom Software / مخصص</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#1c212c]">Description / الوصف بكلماتك</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe features, pages, and requirements in Arabic or English..."
              rows={3}
              required
              className="w-full bg-[#f9f8f6] border border-[#e2d9d2]/70 rounded-xl p-3.5 text-xs font-medium text-[#1c212c] focus:outline-none focus:border-[#ea580c] resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateProjectOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-[#f5f3ef] hover:bg-[#e8e3dc] text-xs font-bold text-[#1c212c] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isOrchestrating}
              className="px-6 py-2.5 rounded-xl bg-[#ea580c] hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              <span>{isOrchestrating ? 'Building App...' : 'Start AI Factory Build / ابدأ البناء'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
