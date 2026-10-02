import React, { useState } from 'react';
import { useBYOK } from '../../context/BYOKContext';
import { AgentTool } from '../../types/byok';
import { X, Bot } from 'lucide-react';

export const AddAgentModal: React.FC = () => {
  const { isAddAgentOpen, setIsAddAgentOpen, addAgent } = useBYOK();

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [directives, setDirectives] = useState('');
  const [temperature, setTemperature] = useState(0.3);
  const [tools, setTools] = useState<AgentTool[]>(['code_executor', 'eslint_linter']);

  if (!isAddAgentOpen) return null;

  const toggleTool = (tool: AgentTool) => {
    setTools((prev) => (prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !directives.trim()) return;

    addAgent({
      name,
      title: title || 'Worker Agent',
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      directives,
      temperature,
      tools,
      maxRunsPerDay: 500,
      status: 'idle',
    });

    setIsAddAgentOpen(false);
    setName('');
    setTitle('');
    setDirectives('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white font-display">Add Worker Agent</h2>
          </div>

          <button onClick={() => setIsAddAgentOpen(false)} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Agent Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. PixelCraft-v2, Arch-Dev, AuditBot"
              required
              className="w-full bg-slate-950 text-white border border-slate-700 rounded-lg p-2.5"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Title / Specialization</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. UI/UX Component Architect"
              className="w-full bg-slate-950 text-white border border-slate-700 rounded-lg p-2.5"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">System Directives & Instructions</label>
            <textarea
              value={directives}
              onChange={(e) => setDirectives(e.target.value)}
              rows={3}
              placeholder="Explicit rules and directives for this worker agent..."
              required
              className="w-full bg-slate-950 text-white border border-slate-700 rounded-lg p-3 font-sans"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Enabled Tool Access</label>
            <div className="flex flex-wrap gap-2 pt-1">
              {(
                [
                  'git_commit',
                  'figma_exporter',
                  'code_executor',
                  'cypress_tester',
                  'eslint_linter',
                  'db_migrator',
                  'gemini_vision',
                  'google_stitch_canvas',
                  'google_stitch_figma',
                ] as AgentTool[]
              ).map((tool) => (
                <button
                  key={tool}
                  type="button"
                  onClick={() => toggleTool(tool)}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded border transition ${
                    tools.includes(tool)
                      ? 'bg-indigo-600 text-white border-indigo-500 font-semibold'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {tool.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Sampling Temperature: {temperature}</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddAgentOpen(false)}
              className="px-4 py-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition"
            >
              Add Agent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
