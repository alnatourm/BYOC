import React, { useState, useEffect } from 'react';
import { api } from '../api';

export const AdminPanelView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tenants' | 'users' | 'plans' | 'quotes'>('tenants');
  const [tenants, setTenants] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quote Form State
  const [provider, setProvider] = useState('');
  const [planLabel, setPlanLabel] = useState('');
  const [amountUsd, setAmountUsd] = useState<number>(0);
  const [sourceUrl, setSourceUrl] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'tenants') {
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
      setError(err.message || 'Failed to fetch admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#1f242e]">Super Admin Platform Controls</h2>
          <p className="text-xs text-stone-500 mt-1">Manage tenants, users, billing plans, and verified hosting quotes.</p>
        </div>
        <div className="flex gap-2">
          {(['tenants', 'users', 'plans', 'quotes'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition capitalize cursor-pointer ${
                activeTab === t ? 'bg-[#d97706] text-white shadow-sm' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-xs text-stone-500">Loading platform admin metrics...</div>
      ) : (
        <>
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
              {/* Add Quote Form */}
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

              {/* Quotes Table */}
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
