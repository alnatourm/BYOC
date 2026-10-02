import React, { useState } from 'react';
import { useBYOK } from '../../context/BYOKContext';
import { RoleCategory } from '../../types/byok';
import { X, Layers } from 'lucide-react';

export const AddRoleModal: React.FC = () => {
  const { isAddRoleOpen, setIsAddRoleOpen, agents, models, addRole } = useBYOK();

  const [roleTitle, setRoleTitle] = useState('');
  const [category, setCategory] = useState<RoleCategory>('dev');
  const [description, setDescription] = useState('');
  const [assignedAgentId, setAssignedAgentId] = useState(agents[0]?.id || '');
  const [assignedModelId, setAssignedModelId] = useState(models[0]?.id || '');
  const [customMandate, setCustomMandate] = useState('');

  if (!isAddRoleOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleTitle.trim()) return;

    addRole({
      roleTitle,
      category,
      description: description || `Stable position for ${roleTitle}`,
      assignedAgentId: assignedAgentId || agents[0]?.id,
      assignedModelId: assignedModelId || models[0]?.id,
      executionOrder: 4,
      customMandate: customMandate || `Execute responsibilities of ${roleTitle}`,
      status: 'active',
    });

    setIsAddRoleOpen(false);
    setRoleTitle('');
    setDescription('');
    setCustomMandate('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white font-display">Add Stable Role</h2>
          </div>

          <button onClick={() => setIsAddRoleOpen(false)} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Role Job Title</label>
            <input
              type="text"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="e.g. Designer, Developer, Q/C, Security Auditor, Technical Writer"
              required
              className="w-full bg-slate-950 text-white border border-slate-700 rounded-lg p-2.5"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Category Classification</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as RoleCategory)}
              className="w-full bg-slate-950 text-white border border-slate-700 rounded-lg p-2.5"
            >
              <option value="design">Design (UI/UX Wireframing & Design Systems)</option>
              <option value="dev">Development (Frontend/Backend React & Node)</option>
              <option value="qc">Quality Control (Q/C & Security Auditing)</option>
              <option value="product">Product Management & Spec Writing</option>
              <option value="devops">DevOps & Release Engineering</option>
              <option value="custom">Custom Specialty</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Role Job Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of responsibilities for this role position..."
              className="w-full bg-slate-950 text-white border border-slate-700 rounded-lg p-2.5"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Initial Assigned Worker Agent</label>
            <select
              value={assignedAgentId}
              onChange={(e) => setAssignedAgentId(e.target.value)}
              className="w-full bg-slate-950 text-white border border-slate-700 rounded-lg p-2.5"
            >
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} — {agent.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Initial Assigned LLM Model</label>
            <select
              value={assignedModelId}
              onChange={(e) => setAssignedModelId(e.target.value)}
              className="w-full bg-slate-950 text-white border border-slate-700 rounded-lg p-2.5"
            >
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} ({model.providerName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Custom Role Mandate / Rules</label>
            <textarea
              value={customMandate}
              onChange={(e) => setCustomMandate(e.target.value)}
              rows={2}
              placeholder="Mandatory quality standards for this job position..."
              className="w-full bg-slate-950 text-white border border-slate-700 rounded-lg p-2.5 font-sans"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddRoleOpen(false)}
              className="px-4 py-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition"
            >
              Create Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
