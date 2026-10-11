import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useBYOK } from '../context/BYOKContext';

export const AdminPanelView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'factory' | 'tenants' | 'users' | 'plans' | 'quotes'>('factory');
  const { connections } = useBYOK();
  
  const [status, setStatus] = useState<{ user?: any; membership?: any; isSuperAdmin: boolean } | null>(null);
  const [factorySettings, setFactorySettings] = useState<any[]>([]);
  const [envKeyConfigured, setEnvKeyConfigured] = useState(false);
  
  const [tenants, setTenants] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Quote Form State
  const [provider, setProvider] = useState('');
  const [planLabel, setPlanLabel] = useState('');
  const [amountUsd, setAmountUsd] = useState<number>(0);
  const [sourceUrl, setSourceUrl] = useState('');

  const checkStatus = async () => {
    try {
      const res = await api('/v1/admin/status');
      setStatus(res);
    } catch {
      setStatus({ isSuperAdmin: false });
    }
  };

  const handleClaimSuperAdmin = async () => {
    setError(null);
    setSuccessMsg(null);
    try {
      await api('/v1/admin/claim-superadmin', { method: 'POST' });
      setSuccessMsg('You are now elevated to Platform Super Admin!');
      await checkStatus();
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to claim super admin access.');
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'factory') {
        const res = await api('/v1/admin/factory-settings');
        setFactorySettings(res.factorySettings || []);
        setEnvKeyConfigured(!!res.platformEnvKeyConfigured);
      } else if (activeTab === 'tenants') {
        const res = await api('/v1/admin/tenants');
        setTenants(res.tenants || []);
      } else if (activeTab === 'users') {
        const res = await api('/v1/admin/users');
        setUsers(res.users || []);
      } else if (activeTab === 'plans') {
        const res = await api('/v1/admin/plans');
        setPlans(res.plans || []);
      } else if (activeTab === 'quotes') {
        const res = await api('/v1/admin/quotes');
        setQuotes(res.quotes || []);
      }
    } catch (err: any) {
      if (err?.message?.includes('FORBIDDEN')) {
        setError('Super Admin role required. Click "Elevate to Super Admin" above.');
      } else {
        setError(err.message || 'Failed to fetch admin data.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleSaveFactoryRole = async (roleName: string, connectionId: string | null, modelName: string) => {
    setError(null);
    setSuccessMsg(null);
    try {
      await api('/v1/admin/factory-settings', {
        method: 'POST',
        body: JSON.stringify({
          role: roleName,
          connectionId: connectionId || null,
          model: modelName,
        }),
      });
      setSuccessMsg(`System Factory settings saved for Role '${roleName.toUpperCase()}'`);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to save factory settings.');
    }
  };

  const handleAddQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api('/v1/admin/quotes', {
        method: 'POST',
        body: JSON.stringify({
          provider,
          planLabel,
          amountUsd: Number(amountUsd),
          currency: 'USD',
          sourceUrl,
        }),
      });
      setProvider('');
      setPlanLabel('');
      setAmountUsd(0);
      setSourceUrl('');
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to add quote.');
    }
  };

  const handleDeleteQuote = async (id: string) => {
    try {
      await api(`/v1/admin/quotes/${id}`, { method: 'DELETE' });
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete quote.');
    }
  };

  const roleTitles: Record<string, string> = {
    spec: 'Role 01 · Product & Spec Agent',
    design: 'Role 02 · Designer & Layout Agent',
    dev: 'Role 03 · Developer & Code Agent',
    qc: 'Role 04 · QC & Security Agent',
    release: 'Role 05 · Release & Deployment Agent',
  };

  return (
    <div className="space-y-6 font-sans text-[#1c212c]">
      {/* Top Admin Header & Status Bar */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
                🛡️ System Factory & Platform Admin Dashboard
              </span>
              <span className="text-stone-400">•</span>
              <span className="text-xs text-stone-500 font-medium">لوحة التحكم وخزنة النظام</span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#1f242e] tracking-tight">
              Platform & System Factory Settings
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Configure system-wide default keys for each pipeline role, manage billing plans, and view platform metrics.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(['factory', 'tenants', 'users', 'plans', 'quotes'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition capitalize cursor-pointer ${
                  activeTab === t ? 'bg-[#d97706] text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {t === 'factory' ? '🏭 Factory Keys' : t}
              </button>
            ))}
          </div>
        </div>

        {/* User Identity & Claim Access Row */}
        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-xs">
              {status?.user?.email ? status.user.email.substring(0, 2).toUpperCase() : 'US'}
            </div>
            <div>
              <div className="font-bold text-[#1f242e]">
                Signed In As: <span className="text-amber-700 font-mono">{status?.user?.email || 'Checking account...'}</span>
              </div>
              <div className="text-[#887364]">
                Platform Role: <span className="font-bold uppercase text-stone-700">{status?.user?.platformRole || 'standard_user'}</span> · Tenant Role: <span className="font-bold capitalize">{status?.membership?.role || 'owner'}</span>
              </div>
            </div>
          </div>

          {!status?.isSuperAdmin ? (
            <button
              onClick={handleClaimSuperAdmin}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
              <span>Elevate to Platform Super Admin</span>
            </button>
          ) : (
            <div className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
              <span>Platform Super Admin Active</span>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
          <span className="material-symbols-outlined text-rose-600 text-[18px]">error</span>
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
          <span>{successMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-xs text-stone-500">Loading system settings...</div>
      ) : (
        <>
          {/* TAB 1: SYSTEM FACTORY SETTINGS */}
          {activeTab === 'factory' && (
            <div className="space-y-6">
              <div className="p-5 bg-white rounded-2xl border border-stone-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#1f242e] flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-600 text-[20px]">factory</span>
                    <span>System Factory Default Keys & Models</span>
                  </h3>
                  <div className="text-xs text-stone-500 font-mono">
                    System Environment Key (`GEMINI_API_KEY`):{' '}
                    <span className={`font-bold ${envKeyConfigured ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {envKeyConfigured ? 'Active ✓' : 'Not Configured (Optional)'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-stone-600">
                  When users select <strong>"Use System Factory Keys"</strong> during project execution, the system will use the role-specific provider keys below (or fall back to the platform environment key).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {['spec', 'design', 'dev', 'qc', 'release'].map((roleKey) => {
                  const setting = factorySettings.find((s) => s.role === roleKey) || {
                    role: roleKey,
                    model: 'gemini-3.8-flash',
                    connectionId: null,
                  };

                  return (
                    <div
                      key={roleKey}
                      className="p-5 bg-white rounded-2xl border border-stone-200 space-y-4 shadow-xs flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                          <span className="material-symbols-outlined text-amber-600 text-[18px]">smart_toy</span>
                          <span className="font-bold text-sm text-[#1f242e]">{roleTitles[roleKey]}</span>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-stone-500 uppercase">Selected AI Model</label>
                          <input
                            type="text"
                            defaultValue={setting.model || 'gemini-3.8-flash'}
                            id={`model-input-${roleKey}`}
                            className="w-full p-2.5 rounded-xl border border-stone-300 font-mono text-xs text-[#1c212c] outline-none focus:border-amber-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-stone-500 uppercase">Bound Factory Provider Key</label>
                          <select
                            defaultValue={setting.connectionId || 'default'}
                            id={`conn-select-${roleKey}`}
                            className="w-full p-2.5 rounded-xl border border-stone-300 text-xs text-[#1c212c] bg-white outline-none focus:border-amber-500 cursor-pointer"
                          >
                            <option value="default">Default System Platform Key (GEMINI_API_KEY)</option>
                            {connections.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.label} ({c.type.toUpperCase()} · ••••{c.last4})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-600 space-y-1">
                          <div className="font-bold text-[#1f242e]">Active Status:</div>
                          <div className="font-mono text-amber-700">
                            {setting.connectionLabel ? `Bound to Key: ${setting.connectionLabel}` : 'Using Default System Key'}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const modelVal = (document.getElementById(`model-input-${roleKey}`) as HTMLInputElement)?.value;
                          const connVal = (document.getElementById(`conn-select-${roleKey}`) as HTMLSelectElement)?.value;
                          handleSaveFactoryRole(roleKey, connVal === 'default' ? null : connVal, modelVal);
                        }}
                        className="w-full py-2 bg-[#d97706] hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-2xs transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">save</span>
                        <span>Save Factory Settings for {roleKey.toUpperCase()}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'tenants' && (
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-50 text-stone-500 uppercase border-b border-stone-200">
                  <tr>
                    <th className="p-4">Tenant ID</th>
                    <th className="p-4">Company Name</th>
                    <th className="p-4">Plan</th>
                    <th className="p-4">Members</th>
                    <th className="p-4">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {tenants.map((t) => (
                    <tr key={t.id} className="hover:bg-stone-50">
                      <td className="p-4 font-mono font-bold text-[#d97706]">{t.id}</td>
                      <td className="p-4 font-bold text-[#1f242e]">{t.name}</td>
                      <td className="p-4 uppercase">{t.plan_id}</td>
                      <td className="p-4">{t.member_count}</td>
                      <td className="p-4 text-stone-500">{new Date(t.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {tenants.length === 0 && (
                    <tr><td colSpan={5} className="p-8 text-center text-stone-400">No tenants registered.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-50 text-stone-500 uppercase border-b border-stone-200">
                  <tr>
                    <th className="p-4">User ID</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Platform Role</th>
                    <th className="p-4">Tenant Role</th>
                    <th className="p-4">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-stone-50">
                      <td className="p-4 font-mono font-bold text-[#1f242e]">{u.id}</td>
                      <td className="p-4">{u.email}</td>
                      <td className="p-4 font-bold text-amber-600">{u.platform_role || 'standard_user'}</td>
                      <td className="p-4 font-semibold">{u.tenant_role || 'member'}</td>
                      <td className="p-4 text-stone-500">{new Date(u.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={5} className="p-8 text-center text-stone-400">No users found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'plans' && (
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs p-6 space-y-4">
              <h3 className="font-bold text-sm text-[#1f242e]">Platform Billing Tiers</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((p) => (
                  <div key={p.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
                    <span className="font-bold text-sm text-[#d97706] block">{p.name}</span>
                    <p className="text-xs text-stone-600">Runs/mo: {p.runs_per_month}</p>
                    <p className="text-xs text-stone-600">Active Runs: {p.active_runs}</p>
                    <p className="text-xs text-stone-600">Projects: {p.projects}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'quotes' && (
            <div className="space-y-6">
              <form onSubmit={handleAddQuote} className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 shadow-xs">
                <h3 className="font-bold text-sm text-[#1f242e]">Enter Verified Hosting Price Quote</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Provider (e.g. Hetzner)"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="p-2.5 rounded-lg border border-stone-300 text-xs outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Plan Label (e.g. CX22 2vCPU/4GB)"
                    value={planLabel}
                    onChange={(e) => setPlanLabel(e.target.value)}
                    className="p-2.5 rounded-lg border border-stone-300 text-xs outline-none focus:border-amber-500"
                  />
                  <input
                    type="number"
                    required
                    step="0.01"
                    placeholder="Amount USD (e.g. 12.50)"
                    value={amountUsd}
                    onChange={(e) => setAmountUsd(Number(e.target.value))}
                    className="p-2.5 rounded-lg border border-stone-300 text-xs outline-none focus:border-amber-500"
                  />
                  <input
                    type="url"
                    required
                    placeholder="Source URL (e.g. https://hetzner.com/cloud)"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    className="p-2.5 rounded-lg border border-stone-300 text-xs outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#d97706] hover:bg-amber-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Save Official Price Quote
                </button>
              </form>

              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-50 text-stone-500 uppercase border-b border-stone-200">
                    <tr>
                      <th className="p-4">Provider</th>
                      <th className="p-4">Plan Label</th>
                      <th className="p-4">Cost (USD)</th>
                      <th className="p-4">Source</th>
                      <th className="p-4">Quoted Date</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {quotes.map((q) => (
                      <tr key={q.id} className="hover:bg-stone-50">
                        <td className="p-4 font-bold text-[#1f242e]">{q.provider}</td>
                        <td className="p-4">{q.plan_label}</td>
                        <td className="p-4 font-mono font-bold text-emerald-700">${parseFloat(q.amount_usd).toFixed(2)} USD</td>
                        <td className="p-4">
                          <a href={q.source_url} target="_blank" rel="noreferrer" className="text-amber-600 hover:underline">
                            Source Link
                          </a>
                        </td>
                        <td className="p-4 text-stone-500">{new Date(q.quoted_at).toLocaleDateString()}</td>
                        <td className="p-4">
                          <button
                            onClick={() => handleDeleteQuote(q.id)}
                            className="px-3 py-1 rounded bg-rose-100 text-rose-700 font-bold hover:bg-rose-200 cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {quotes.length === 0 && (
                      <tr><td colSpan={6} className="p-8 text-center text-stone-400">No quotes loaded. (Gate 5 will show "No quote loaded").</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
