import React, { useState } from 'react';
import { useBYOK } from '../context/BYOKContext';

export const AdminPanelView: React.FC = () => {
  const { saasUsers, saasPlans, agents, providers, models, setActiveTab, updateAgent, addAgent } = useBYOK();
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'agents' | 'keys' | 'users' | 'pricing'>('agents');
  
  // Selected Agent for Editing
  const [editingAgentId, setEditingAgentId] = useState<string | null>(agents[0]?.id || null);
  
  // Master API Keys state (for Platform Factory)
  const [masterKeys, setMasterKeys] = useState({
    geminiKey: 'AIzaSy_Platform_Master_Gemini_Key_9921',
    anthropicKey: 'sk-ant-api03-Platform_Master_Anthropic_Key_4412',
    openaiKey: 'sk-proj-Platform_Master_OpenAI_Key_8832',
    deepseekKey: 'sk-ds-Platform_Master_DeepSeek_Key_1120',
    groqKey: 'gsk_Platform_Master_Groq_LPU_Key_3319',
  });

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const selectedAgent = agents.find((a) => a.id === editingAgentId) || agents[0];

  return (
    <div className="flex flex-col w-full pb-16 font-sans text-[#1c212c]">
      {/* Super Admin Top Header */}
      <div className="bg-[#1c212c] text-white rounded-2xl p-6 shadow-xl mb-6 space-y-4 border border-stone-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#ea580c] flex items-center justify-center text-white shadow-lg font-bold">
              <span className="material-symbols-outlined text-[24px]">admin_panel_settings</span>
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#ea580c]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>SaaS Super Admin Control Center</span>
                <span>•</span>
                <span className="text-stone-400">Master Factory Configuration</span>
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-black text-white tracking-tight">
                SaaS Factory Admin Panel / لوحة المشرف
              </h1>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('dashboard')}
            className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer border border-stone-700"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Return to User Dashboard</span>
          </button>
        </div>

        {/* Financial & AI Telemetry Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 space-y-1">
            <span className="text-stone-400 font-medium">SaaS Monthly Revenue (MRR)</span>
            <div className="text-2xl font-black text-emerald-400 font-display">$24,850.00</div>
            <div className="text-[10px] text-emerald-500 font-bold">+22.4% vs last month</div>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 space-y-1">
            <span className="text-stone-400 font-medium">Active SaaS Clients</span>
            <div className="text-2xl font-black text-white font-display">128 Accounts</div>
            <div className="text-[10px] text-stone-400">98.4% Retention Rate</div>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 space-y-1">
            <span className="text-stone-400 font-medium">Total Apps Generated</span>
            <div className="text-2xl font-black text-[#ea580c] font-display">1,420 Software</div>
            <div className="text-[10px] text-[#ea580c] font-bold">Google Stitch Canvas Enabled</div>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 space-y-1">
            <span className="text-stone-400 font-medium">Platform AI API Expenses</span>
            <div className="text-2xl font-black text-amber-400 font-display">$1,240.00 / mo</div>
            <div className="text-[10px] text-emerald-400 font-bold">95.0% Net Profit Margin</div>
          </div>
        </div>
      </div>

      {/* Admin Navigation Sub-Tabs */}
      <div className="bg-white rounded-2xl border border-[#e2d9d2] p-2 shadow-2xs mb-6 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveAdminSubTab('agents')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeAdminSubTab === 'agents'
                ? 'bg-[#ea580c] text-white shadow-sm'
                : 'text-[#576071] hover:text-[#1c212c] hover:bg-[#f9f8f6]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">smart_toy</span>
            <span>1. Factory 5 AI Agents Configurator ({agents.length} Roles)</span>
          </button>

          <button
            onClick={() => setActiveAdminSubTab('keys')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeAdminSubTab === 'keys'
                ? 'bg-[#ea580c] text-white shadow-sm'
                : 'text-[#576071] hover:text-[#1c212c] hover:bg-[#f9f8f6]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">key</span>
            <span>2. Master AI Keys Vault (مفاتيح الذكاء)</span>
          </button>

          <button
            onClick={() => setActiveAdminSubTab('users')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeAdminSubTab === 'users'
                ? 'bg-[#ea580c] text-white shadow-sm'
                : 'text-[#576071] hover:text-[#1c212c] hover:bg-[#f9f8f6]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">group</span>
            <span>3. SaaS Client Users ({saasUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminSubTab('pricing')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeAdminSubTab === 'pricing'
                ? 'bg-[#ea580c] text-white shadow-sm'
                : 'text-[#576071] hover:text-[#1c212c] hover:bg-[#f9f8f6]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">payments</span>
            <span>4. Plans & Pricing Configurator</span>
          </button>
        </div>

        <button
          onClick={() => triggerToast('Master Admin Configuration Saved Successfully!')}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">save</span>
          <span>Save Admin Config</span>
        </button>
      </div>

      {toastMsg && (
        <div className="p-3.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md mb-6 flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* SUB-TAB 1: FACTORY 10 AI AGENTS CONFIGURATOR */}
      {activeAdminSubTab === 'agents' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: List of 10 Agents (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-[#e2d9d2] p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-[#1c212c]">5 Consolidated Factory Agent Roles</h3>
                  <p className="text-xs text-[#576071]">Click any agent to edit its model key & prompt</p>
                </div>
                <button
                  onClick={() => {
                    addAgent({
                      name: 'Custom Domain Agent',
                      title: 'Specialist Synthetic Role',
                      directives: 'Executes domain logic for custom apps.',
                      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
                      temperature: 0.2,
                      tools: ['google_stitch_canvas', 'code_executor'],
                      maxRunsPerDay: 500,
                      status: 'idle',
                    });
                    triggerToast('Added New Agent Role!');
                  }}
                  className="px-3 py-1.5 bg-[#ea580c] text-white font-bold text-xs rounded-xl hover:bg-orange-700 transition cursor-pointer"
                >
                  + Add Agent
                </button>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {agents.map((agent, idx) => {
                  const isSelected = agent.id === editingAgentId;
                  return (
                    <button
                      key={agent.id}
                      onClick={() => setEditingAgentId(agent.id)}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-orange-50/80 border-[#ea580c] shadow-xs ring-2 ring-orange-200'
                          : 'bg-[#f9f8f6] border-[#e2d9d2] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isSelected ? 'bg-[#ea580c] text-white' : 'bg-orange-100 text-[#ea580c]'
                        }`}>
                          0{idx + 1}
                        </div>
                        <div>
                          <div className="font-display font-bold text-xs text-[#1c212c]">{agent.name}</div>
                          <div className="text-[10px] text-[#887364]">{agent.title}</div>
                        </div>
                      </div>

                      <span className="material-symbols-outlined text-[18px] text-[#ea580c]">
                        {isSelected ? 'tune' : 'chevron_right'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Agent Inspector & Configurator Editor (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {selectedAgent && (
              <div className="bg-white rounded-2xl border border-[#e2d9d2] p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-[#e2d9d2]/60 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#ea580c] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                      <span className="material-symbols-outlined text-[22px]">smart_toy</span>
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-[#1c212c]">{selectedAgent.name}</h3>
                      <p className="text-xs text-[#576071]">{selectedAgent.title}</p>
                    </div>
                  </div>

                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 font-bold text-xs">
                    ACTIVE IN PIPELINE
                  </span>
                </div>

                {/* Form Inputs */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#1c212c]">Agent Display Name</label>
                      <input
                        type="text"
                        value={selectedAgent.name}
                        onChange={(e) => updateAgent(selectedAgent.id, { name: e.target.value })}
                        className="w-full bg-[#f9f8f6] border border-[#e2d9d2] rounded-xl px-3 py-2 text-xs font-semibold text-[#1c212c] outline-none focus:border-[#ea580c]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#1c212c]">Role Title / الوظيفة</label>
                      <input
                        type="text"
                        value={selectedAgent.title}
                        onChange={(e) => updateAgent(selectedAgent.id, { title: e.target.value })}
                        className="w-full bg-[#f9f8f6] border border-[#e2d9d2] rounded-xl px-3 py-2 text-xs font-semibold text-[#1c212c] outline-none focus:border-[#ea580c]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#1c212c]">Assigned AI Key Provider</label>
                      <select
                        value={providers[0]?.id || ''}
                        onChange={(e) => triggerToast(`Provider bound: ${e.target.value}`)}
                        className="w-full bg-[#f9f8f6] border border-[#e2d9d2] rounded-xl px-3 py-2 text-xs font-semibold text-[#1c212c] outline-none focus:border-[#ea580c] cursor-pointer"
                      >
                        {providers.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.status})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#1c212c]">Underlying AI Model Binding</label>
                      <select
                        value={models[0]?.id || ''}
                        onChange={(e) => triggerToast(`Model bound: ${e.target.value}`)}
                        className="w-full bg-[#f9f8f6] border border-[#e2d9d2] rounded-xl px-3 py-2 text-xs font-semibold text-[#1c212c] outline-none focus:border-[#ea580c] cursor-pointer"
                      >
                        {models.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.contextWindow / 1000}K Context)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1c212c]">System Directives / System Prompt (تعليمات النظام)</label>
                    <textarea
                      value={selectedAgent.directives}
                      onChange={(e) => updateAgent(selectedAgent.id, { directives: e.target.value })}
                      rows={5}
                      className="w-full bg-[#f9f8f6] border border-[#e2d9d2] rounded-xl p-3 text-xs text-[#1c212c] font-sans leading-relaxed outline-none focus:border-[#ea580c]"
                    />
                  </div>

                  <div className="pt-3 border-t border-[#e2d9d2]/60 flex justify-end gap-2">
                    <button
                      onClick={() => triggerToast(`Agent configuration updated for ${selectedAgent.name}!`)}
                      className="px-5 py-2.5 rounded-xl bg-[#ea580c] hover:bg-orange-700 text-white font-bold text-xs shadow-sm transition cursor-pointer flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">save</span>
                      <span>Update Agent Directives & Keys</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: MASTER PLATFORM PROVIDER KEYS VAULT */}
      {activeAdminSubTab === 'keys' && (
        <div className="bg-white rounded-2xl border border-[#e2d9d2] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#e2d9d2]/60 pb-4">
            <div>
              <h3 className="font-display font-bold text-lg text-[#1c212c]">Platform Master AI Keys Vault</h3>
              <p className="text-xs text-[#576071]">
                Enter master API keys used by the SaaS AI Factory to run software builds for all client accounts.
              </p>
            </div>

            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 font-bold text-xs font-mono">
              🔒 AES-256 KMS Vault Secured
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Google Gemini Key */}
            <div className="p-4 bg-[#f9f8f6] rounded-xl border border-[#e2d9d2] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs text-[#1c212c]">Google Gemini API Master Key</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold">CONNECTED</span>
              </div>
              <input
                type="password"
                value={masterKeys.geminiKey}
                onChange={(e) => setMasterKeys({ ...masterKeys, geminiKey: e.target.value })}
                className="w-full bg-white border border-[#e2d9d2] rounded-xl px-3 py-2 text-xs font-mono text-[#1c212c] outline-none focus:border-[#ea580c]"
              />
              <p className="text-[11px] text-[#576071]">Powers Google Stitch AI Canvas & UI Design synthesis.</p>
            </div>

            {/* Anthropic Claude Key */}
            <div className="p-4 bg-[#f9f8f6] rounded-xl border border-[#e2d9d2] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs text-[#1c212c]">Anthropic Claude API Master Key</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold">CONNECTED</span>
              </div>
              <input
                type="password"
                value={masterKeys.anthropicKey}
                onChange={(e) => setMasterKeys({ ...masterKeys, anthropicKey: e.target.value })}
                className="w-full bg-white border border-[#e2d9d2] rounded-xl px-3 py-2 text-xs font-mono text-[#1c212c] outline-none focus:border-[#ea580c]"
              />
              <p className="text-[11px] text-[#576071]">Powers Product Manager, Architect & Frontend Agents.</p>
            </div>

            {/* OpenAI Key */}
            <div className="p-4 bg-[#f9f8f6] rounded-xl border border-[#e2d9d2] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs text-[#1c212c]">OpenAI API Master Key</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold">CONNECTED</span>
              </div>
              <input
                type="password"
                value={masterKeys.openaiKey}
                onChange={(e) => setMasterKeys({ ...masterKeys, openaiKey: e.target.value })}
                className="w-full bg-white border border-[#e2d9d2] rounded-xl px-3 py-2 text-xs font-mono text-[#1c212c] outline-none focus:border-[#ea580c]"
              />
              <p className="text-[11px] text-[#576071]">Powers Business Analyst & QA Sentinel Agents.</p>
            </div>

            {/* DeepSeek Key */}
            <div className="p-4 bg-[#f9f8f6] rounded-xl border border-[#e2d9d2] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs text-[#1c212c]">DeepSeek API Master Key</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold">CONNECTED</span>
              </div>
              <input
                type="password"
                value={masterKeys.deepseekKey}
                onChange={(e) => setMasterKeys({ ...masterKeys, deepseekKey: e.target.value })}
                className="w-full bg-white border border-[#e2d9d2] rounded-xl px-3 py-2 text-xs font-mono text-[#1c212c] outline-none focus:border-[#ea580c]"
              />
              <p className="text-[11px] text-[#576071]">Powers Backend Developer & Database Migrations.</p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: SAAS CLIENT USERS MANAGEMENT */}
      {activeAdminSubTab === 'users' && (
        <div className="bg-white rounded-2xl border border-[#e2d9d2] overflow-hidden shadow-sm space-y-4">
          <div className="p-6 border-b border-[#e2d9d2]/60 flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-[#1c212c]">Registered SaaS Clients & Subscribers</h3>
              <p className="text-xs text-[#576071]">Manage client accounts, subscription plans, and build permissions</p>
            </div>

            <button
              onClick={() => triggerToast('New client invite created!')}
              className="px-4 py-2 rounded-xl bg-[#ea580c] hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">person_add</span>
              <span>+ Invite Client</span>
            </button>
          </div>

          <div className="divide-y divide-[#e2d9d2]/60 text-xs font-medium text-[#576071]">
            {saasUsers.map((user) => (
              <div key={user.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#f9f8f6] transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1c212c] text-sm">{user.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      user.role === 'super_admin' ? 'bg-orange-100 text-[#ea580c]' : 'bg-slate-100 text-[#576071]'
                    }`}>
                      {user.role === 'super_admin' ? 'SUPER ADMIN' : 'CLIENT'}
                    </span>
                  </div>
                  <div className="text-xs text-[#887364] font-mono">{user.email}</div>
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-[#948374] block text-[10px]">Active Plan:</span>
                    <strong className="text-[#1c212c] font-bold">{user.planName}</strong>
                  </div>

                  <div>
                    <span className="text-[#948374] block text-[10px]">Apps Built:</span>
                    <strong className="text-[#ea580c] font-mono font-bold">{user.appsCreated} apps</strong>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    user.status === 'active' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {user.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: PLANS & PRICING CONFIGURATOR */}
      {activeAdminSubTab === 'pricing' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#e2d9d2] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#e2d9d2]/60 pb-3">
              <div>
                <h3 className="font-display font-bold text-lg text-[#1c212c]">SaaS Subscription Tiers & Pricing Configurator</h3>
                <p className="text-xs text-[#576071]">Define pricing, build quotas, and feature flags for end-users</p>
              </div>

              <button
                onClick={() => triggerToast('New Pricing Tier Added!')}
                className="px-4 py-2 rounded-xl bg-[#ea580c] hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                + Add Plan Tier
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {saasPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`p-6 rounded-2xl border space-y-4 relative ${
                    plan.isPopular ? 'bg-orange-50/50 border-[#ea580c] shadow-sm' : 'bg-[#f9f8f6] border-[#e2d9d2]'
                  }`}
                >
                  {plan.isPopular && (
                    <span className="absolute -top-3 right-4 bg-[#ea580c] text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full shadow-xs">
                      MOST POPULAR
                    </span>
                  )}

                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-lg text-[#1c212c]">{plan.name}</h4>
                    <div className="text-3xl font-black text-[#ea580c] font-display">
                      ${plan.priceMonthlyUsd} <span className="text-xs text-[#887364] font-normal">/ month</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#e2d9d2]/70 text-xs space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span>Max Apps / Mo:</span>
                      <strong className="text-[#1c212c]">{plan.appsLimitPerMonth}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Max AI Runs:</span>
                      <strong className="text-[#1c212c]">{plan.aiRunsLimitPerMonth}</strong>
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs text-[#576071] pt-2 border-t border-[#e2d9d2]/50 font-medium">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => triggerToast(`Updated plan: ${plan.name}`)}
                    className="w-full py-2.5 rounded-xl bg-[#1c212c] hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    Edit Plan Settings
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
