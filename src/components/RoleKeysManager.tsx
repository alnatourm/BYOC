import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useBYOK } from '../context/BYOKContext';

export const RoleKeysManager: React.FC = () => {
  const { connections, projects } = useBYOK();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [projectData, setProjectData] = useState<any>(null);
  const [roleSlots, setRoleSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects]);

  const loadRoleSlots = async () => {
    if (!selectedProjectId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api(`/v1/projects/${selectedProjectId}/role-slots`);
      setProjectData(res.project || null);
      setRoleSlots(res.roleSlots || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load project role slots.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoleSlots();
  }, [selectedProjectId]);

  const handleToggleMode = async (newMode: 'managed' | 'byok') => {
    if (!selectedProjectId) return;
    setError(null);
    setSuccessMsg(null);
    try {
      await api(`/v1/projects/${selectedProjectId}/mode`, {
        method: 'PATCH',
        body: JSON.stringify({ mode: newMode }),
      });
      setSuccessMsg(`Project execution mode updated to ${newMode === 'managed' ? 'System Factory Keys' : 'Custom BYOK Keys'}.`);
      await loadRoleSlots();
    } catch (err: any) {
      setError(err.message || 'Failed to update project mode.');
    }
  };

  const handleSaveRoleSlot = async (roleName: string, connectionId: string | null, modelName: string) => {
    if (!selectedProjectId) return;
    setError(null);
    setSuccessMsg(null);
    try {
      await api(`/v1/projects/${selectedProjectId}/role-slots/${roleName}`, {
        method: 'PATCH',
        body: JSON.stringify({
          connectionId: connectionId || null,
          model: modelName,
        }),
      });
      setSuccessMsg(`Role slot '${roleName.toUpperCase()}' bound successfully.`);
      await loadRoleSlots();
    } catch (err: any) {
      setError(err.message || 'Failed to bind provider key to role slot.');
    }
  };

  const roleTitles: Record<string, string> = {
    spec: 'Role 01 · Product & Spec Agent',
    design: 'Role 02 · Designer Agent',
    dev: 'Role 03 · Developer Agent',
    qc: 'Role 04 · QC & Security Agent',
    release: 'Role 05 · Release Agent',
  };

  const isManagedMode = projectData?.mode === 'managed';

  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-6 font-sans text-[#1c212c] my-6">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-[#ea580c] font-bold text-xs">
              🤖 End-User Role Slot & Provider Key Bindings
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500 font-medium">مفاتيح أدوار الذكاء الاصطناعي</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#1f242e] tracking-tight">
            Role Keys & Factory Default Switcher
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Choose whether your project runs on <strong>System Factory Keys</strong> or <strong>Custom User BYOK Keys</strong> for each role slot.
          </p>
        </div>

        {/* Project Selector */}
        {projects.length > 0 && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-stone-500">Project:</label>
            <select
              value={selectedProjectId || ''}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-bold bg-white text-[#1f242e] outline-none focus:border-amber-500 cursor-pointer"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.mode.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
          <span className="material-symbols-outlined text-rose-600 text-[18px]">error</span>
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
          <span>{successMsg}</span>
        </div>
      )}

      {/* Mode Selector Toggle */}
      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="font-bold text-sm text-[#1f242e]">
            Execution Mode: <span className="text-[#ea580c] uppercase font-mono">{projectData?.mode || 'managed'}</span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            {isManagedMode
              ? 'Using System Factory Default Keys for all AI execution dispatches.'
              : 'Using Custom User Provider Keys bound to each individual Role Slot below.'}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleToggleMode('managed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              isManagedMode ? 'bg-[#ea580c] text-white shadow-xs' : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">factory</span>
            <span>Use System Factory Keys</span>
          </button>
          <button
            onClick={() => handleToggleMode('byok')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              !isManagedMode ? 'bg-[#ea580c] text-white shadow-xs' : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">key</span>
            <span>Assign Custom BYOK Keys</span>
          </button>
        </div>
      </div>

      {/* Role Slots Table / Grid */}
      {loading ? (
        <div className="p-8 text-center text-xs text-stone-500">Loading project role slots...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roleSlots.map((slot) => {
            const isUsingFactory = isManagedMode || !slot.connectionId;

            return (
              <div
                key={slot.role}
                className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                    <span className="font-bold text-xs text-[#1f242e]">{roleTitles[slot.role]}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isUsingFactory ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isUsingFactory ? 'Factory Default' : 'Custom Key'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-500 uppercase">Model</label>
                    <input
                      type="text"
                      defaultValue={slot.model || 'gemini-3.8-flash'}
                      id={`user-model-${slot.role}`}
                      className="w-full p-2 rounded-xl border border-stone-300 text-xs font-mono outline-none focus:border-amber-500 bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-500 uppercase">Assigned Provider Key</label>
                    <select
                      defaultValue={slot.connectionId || 'system_factory'}
                      id={`user-conn-${slot.role}`}
                      disabled={isManagedMode}
                      className="w-full p-2 rounded-xl border border-stone-300 text-xs text-[#1f242e] bg-white outline-none focus:border-amber-500 cursor-pointer disabled:bg-stone-100 disabled:opacity-75"
                    >
                      <option value="system_factory">🏭 Use System Factory Key</option>
                      {connections.map((c) => (
                        <option key={c.id} value={c.id}>
                          🔑 {c.label} ({c.type.toUpperCase()} · ••••{c.last4})
                        </option>
                      ))}
                    </select>
                  </div>

                  {slot.connectionLabel && (
                    <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-[11px] text-emerald-800 font-medium">
                      Active Connection: <span className="font-bold">{slot.connectionLabel}</span> (••••{slot.connectionLast4})
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    const mVal = (document.getElementById(`user-model-${slot.role}`) as HTMLInputElement)?.value;
                    const cVal = (document.getElementById(`user-conn-${slot.role}`) as HTMLSelectElement)?.value;
                    handleSaveRoleSlot(slot.role, cVal === 'system_factory' ? null : cVal, mVal);
                  }}
                  disabled={isManagedMode}
                  className="w-full py-2 bg-[#ea580c] hover:bg-orange-700 text-white font-bold rounded-xl text-xs shadow-2xs transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Slot Binding
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
