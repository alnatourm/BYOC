import React, { useState, useEffect } from 'react';
import { api } from '../api';

interface Member {
  userId: string;
  email: string;
  role: 'owner' | 'admin' | 'requester' | 'reviewer' | 'viewer';
  reviewerScope: 'spec' | 'design' | 'code' | 'qc' | 'release' | 'all' | null;
  emailVerifiedAt: string | null;
}

interface TenantSettings {
  requesters_can_decide: boolean;
  separation_of_duties: boolean;
  separation_of_duties_all_gates: boolean;
  max_revisions_per_stage: number;
}

interface MembersViewProps {
  currentUser: {
    id: string;
    email: string;
  };
  currentRole: string;
  lang?: 'en' | 'ar';
}

export const MembersView: React.FC<MembersViewProps> = ({
  currentUser,
  currentRole,
  lang = 'en',
}) => {
  const isRtl = lang === 'ar';
  const isOwner = currentRole === 'owner';
  const isAdminOrOwner = currentRole === 'owner' || currentRole === 'admin';

  const [members, setMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState<boolean>(true);
  const [memberError, setMemberError] = useState<string | null>(null);
  const [memberSuccess, setMemberSuccess] = useState<string | null>(null);

  // Editing state for members
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<'owner' | 'admin' | 'requester' | 'reviewer' | 'viewer'>('viewer');
  const [editScope, setEditScope] = useState<string>('none');
  const [savingMember, setSavingMember] = useState<boolean>(false);

  // Tenant Settings state (Owner only)
  const [settings, setSettings] = useState<TenantSettings>({
    requesters_can_decide: false,
    separation_of_duties: true,
    separation_of_duties_all_gates: false,
    max_revisions_per_stage: 3,
  });
  const [loadingSettings, setLoadingSettings] = useState<boolean>(false);
  const [savingSettings, setSavingSettings] = useState<boolean>(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [settingsSuccess, setSettingsSuccess] = useState<string | null>(null);

  const fetchMembers = async () => {
    try {
      setLoadingMembers(true);
      setMemberError(null);
      const res = await api('/v1/members');
      setMembers(res.members || []);
    } catch (err: any) {
      setMemberError(err.message || 'Failed to fetch tenant members.');
    } finally {
      setLoadingMembers(false);
    }
  };

  const fetchSettings = async () => {
    if (!isAdminOrOwner) return;
    try {
      setLoadingSettings(true);
      setSettingsError(null);
      const res = await api('/v1/tenant/settings');
      if (res.settings) {
        setSettings({
          requesters_can_decide: res.settings.requesters_can_decide ?? res.settings.requestersCanDecide ?? false,
          separation_of_duties: res.settings.separation_of_duties ?? res.settings.separationOfDuties ?? true,
          separation_of_duties_all_gates: res.settings.separation_of_duties_all_gates ?? res.settings.separationOfDutiesAllGates ?? false,
          max_revisions_per_stage: res.settings.max_revisions_per_stage ?? res.settings.maxRevisionsPerStage ?? 3,
        });
      }
    } catch (err: any) {
      setSettingsError(err.message || 'Failed to fetch workspace settings.');
    } finally {
      setLoadingSettings(false);
    }
  };

  useEffect(() => {
    if (isAdminOrOwner) {
      fetchMembers();
      fetchSettings();
    }
  }, [isAdminOrOwner]);

  if (!isAdminOrOwner) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-rose-200 text-rose-800 text-center space-y-2 my-8 shadow-xs">
        <span className="material-symbols-outlined text-[36px] text-rose-600">lock</span>
        <h2 className="font-display font-bold text-lg">Access Denied • غير مسموح بالوصول</h2>
        <p className="text-xs font-mono text-stone-600">
          The Members & Workspace Rules screen is restricted to workspace Owners and Admins only.
        </p>
      </div>
    );
  }

  const startEditMember = (m: Member) => {
    setEditingUserId(m.userId);
    setEditRole(m.role);
    setEditScope(m.reviewerScope || 'none');
    setMemberError(null);
    setMemberSuccess(null);
  };

  const cancelEditMember = () => {
    setEditingUserId(null);
  };

  const handleSaveMember = async (userId: string) => {
    try {
      setSavingMember(true);
      setMemberError(null);
      setMemberSuccess(null);

      const reviewerScopeValue = editRole === 'reviewer'
        ? (editScope === 'none' ? null : editScope)
        : null;

      await api(`/v1/members/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          role: editRole,
          reviewerScope: reviewerScopeValue,
        }),
      });

      setMemberSuccess('Member membership updated successfully.');
      setEditingUserId(null);
      await fetchMembers();
    } catch (err: any) {
      setMemberError(err.message || 'Failed to update member role.');
    } finally {
      setSavingMember(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) return;

    try {
      setSavingSettings(true);
      setSettingsError(null);
      setSettingsSuccess(null);

      await api('/v1/tenant/settings', {
        method: 'PATCH',
        body: JSON.stringify({
          requesters_can_decide: settings.requesters_can_decide,
          separation_of_duties: settings.separation_of_duties,
          separation_of_duties_all_gates: settings.separation_of_duties_all_gates,
          max_revisions_per_stage: settings.max_revisions_per_stage,
        }),
      });

      setSettingsSuccess('Workspace rules saved successfully!');
    } catch (err: any) {
      setSettingsError(err.message || 'Failed to update workspace settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className={`space-y-8 pb-20 font-sans text-[#1c212c] ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-[#ea580c] font-bold text-xs">
              Access & Governance
            </span>
            <span className="text-stone-400">•</span>
            <span className="text-xs text-stone-500 font-mono">Your Role: {currentRole}</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-[#1c212c]">Workspace Members & Rules</h1>
          <p className="text-xs text-stone-600 mt-0.5 font-medium">
            Manage teammate membership roles, reviewer gate scopes, and tenant enforcement policies.
          </p>
        </div>
      </div>

      {/* MEMBER MANAGEMENT TABLE */}
      <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ea580c]">group</span>
            <h2 className="font-display font-bold text-base text-[#1c212c]">Teammate Memberships</h2>
          </div>
          <span className="text-xs font-mono text-stone-500">{members.length} Total Members</span>
        </div>

        {!isOwner && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-amber-700">info</span>
            <span>
              <strong>Admin Note:</strong> Only workspace Owners can grant the Owner role or modify an Owner member. Owner actions are disabled.
            </span>
          </div>
        )}

        {memberError && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between">
            <span>⚠️ {memberError}</span>
            <button onClick={() => setMemberError(null)} className="text-rose-600 font-bold hover:text-rose-900">×</button>
          </div>
        )}

        {memberSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
            <span>✓ {memberSuccess}</span>
            <button onClick={() => setMemberSuccess(null)} className="text-emerald-600 font-bold hover:text-emerald-900">×</button>
          </div>
        )}

        {loadingMembers ? (
          <div className="p-8 text-center text-xs text-stone-500 font-mono animate-pulse">Loading members table...</div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 font-bold text-stone-700">
                <tr>
                  <th className="p-3.5">Email Address</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Reviewer Gate Scope</th>
                  <th className="p-3.5">Email Verified</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-sans">
                {members.map((m) => {
                  const isSelf = m.userId === currentUser.id;
                  const isTargetOwner = m.role === 'owner';
                  const isEditing = editingUserId === m.userId;
                  const cannotEditReason = isSelf
                    ? 'Users cannot change their own role or scope.'
                    : (!isOwner && isTargetOwner)
                    ? 'Only owners can modify an owner member.'
                    : null;

                  return (
                    <tr key={m.userId} className={isEditing ? 'bg-amber-50/40' : 'hover:bg-stone-50/60'}>
                      <td className="p-3.5 font-medium text-stone-900">
                        <div className="flex items-center gap-2">
                          <span>{m.email}</span>
                          {isSelf && (
                            <span className="px-2 py-0.5 rounded-full bg-stone-200 text-stone-800 font-bold text-[10px] uppercase">
                              You
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-3.5">
                        {isEditing ? (
                          <select
                            value={editRole}
                            onChange={(e: any) => setEditRole(e.target.value)}
                            className="p-1.5 rounded-lg border border-stone-300 text-xs bg-white outline-none focus:border-[#ea580c]"
                          >
                            {isOwner && <option value="owner">Owner</option>}
                            <option value="admin">Admin</option>
                            <option value="requester">Requester</option>
                            <option value="reviewer">Reviewer</option>
                            <option value="viewer">Viewer</option>
                          </select>
                        ) : (
                          <span
                            className={`px-2.5 py-1 rounded-full font-bold text-[11px] font-mono ${
                              m.role === 'owner'
                                ? 'bg-purple-100 text-purple-900'
                                : m.role === 'admin'
                                ? 'bg-blue-100 text-blue-900'
                                : m.role === 'reviewer'
                                ? 'bg-amber-100 text-amber-900'
                                : m.role === 'requester'
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            {m.role.toUpperCase()}
                          </span>
                        )}
                      </td>

                      <td className="p-3.5">
                        {isEditing ? (
                          editRole === 'reviewer' ? (
                            <select
                              value={editScope}
                              onChange={(e) => setEditScope(e.target.value)}
                              className="p-1.5 rounded-lg border border-stone-300 text-xs bg-white outline-none focus:border-[#ea580c]"
                            >
                              <option value="none">No Scope (Cannot decide any gate)</option>
                              <option value="all">All Gates (all)</option>
                              <option value="spec">Gate 1: Spec Review (spec)</option>
                              <option value="design">Gate 2: UI Design (design)</option>
                              <option value="code">Gate 3: Code Implementation (code)</option>
                              <option value="qc">Gate 4: QC & Security (qc)</option>
                              <option value="release">Gate 5: Release & Deploy (release)</option>
                            </select>
                          ) : (
                            <span className="text-stone-400 italic text-[11px]">N/A (NULL for {editRole})</span>
                          )
                        ) : m.role === 'reviewer' ? (
                          m.reviewerScope ? (
                            <span className="px-2 py-0.5 rounded bg-orange-50 border border-orange-200 text-[#ea580c] font-bold text-[11px] font-mono">
                              Scope: {m.reviewerScope}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-800 font-bold text-[11px] flex items-center gap-1 w-fit">
                              <span className="material-symbols-outlined text-[14px]">block</span>
                              <span>No scope (cannot decide any gate / لا يمكن اتخاذ قرار)</span>
                            </span>
                          )
                        ) : (
                          <span className="text-stone-400 italic text-[11px]">—</span>
                        )}
                      </td>

                      <td className="p-3.5">
                        {m.emailVerifiedAt ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                            Verified ✓
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[11px]">
                            Unverified ✉
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 text-right font-medium">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleSaveMember(m.userId)}
                              disabled={savingMember}
                              className="px-3 py-1 rounded-lg bg-[#ea580c] hover:bg-orange-700 text-white font-bold text-xs shadow-2xs transition disabled:opacity-50 cursor-pointer"
                            >
                              {savingMember ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={cancelEditMember}
                              disabled={savingMember}
                              className="px-3 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : cannotEditReason ? (
                          <span className="text-[11px] text-stone-400 italic" title={cannotEditReason}>
                            {cannotEditReason}
                          </span>
                        ) : (
                          <button
                            onClick={() => startEditMember(m)}
                            className="px-3 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition cursor-pointer"
                          >
                            Edit Role / Scope
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* WORKSPACE RULES PANEL (OWNER ONLY) */}
      <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ea580c]">policy</span>
            <h2 className="font-display font-bold text-base text-[#1c212c]">Workspace Rules & Governance Panel</h2>
          </div>
          {isOwner ? (
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 font-bold text-xs">
              Owner Control
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 font-bold text-xs">
              View Only (Owner Required to Edit)
            </span>
          )}
        </div>

        {settingsError && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between">
            <span>⚠️ {settingsError}</span>
            <button onClick={() => setSettingsError(null)} className="text-rose-600 font-bold hover:text-rose-900">×</button>
          </div>
        )}

        {settingsSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
            <span>✓ {settingsSuccess}</span>
            <button onClick={() => setSettingsSuccess(null)} className="text-emerald-600 font-bold hover:text-emerald-900">×</button>
          </div>
        )}

        {loadingSettings ? (
          <div className="p-6 text-center text-xs text-stone-500 font-mono animate-pulse">Loading workspace rules...</div>
        ) : (
          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rule 1: requesters_can_decide */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-xs text-stone-900 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#ea580c]">how_to_reg</span>
                    <span>Requesters Can Decide Gates</span>
                  </label>
                  <input
                    type="checkbox"
                    checked={settings.requesters_can_decide}
                    onChange={(e) => setSettings({ ...settings, requesters_can_decide: e.target.checked })}
                    disabled={!isOwner}
                    className="w-4 h-4 text-[#ea580c] rounded focus:ring-orange-500 cursor-pointer disabled:opacity-50"
                  />
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-sans">
                  <strong>Explanation:</strong> Allows members with the <code>requester</code> role to approve or reject gate reviews. When disabled, only reviewers, admins, and owners can decide gates.
                </p>
                <div className="text-[11px] text-stone-500 font-sans italic border-t border-stone-200/60 pt-1.5">
                  تتيح للمُطالِبين الموافقة أو الرفض في مراجعات البوابات.
                </div>
              </div>

              {/* Rule 2: separation_of_duties (Gate 5) */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-xs text-stone-900 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#ea580c]">security</span>
                    <span>Separation of Duties (Gate 5)</span>
                  </label>
                  <input
                    type="checkbox"
                    checked={settings.separation_of_duties}
                    onChange={(e) => setSettings({ ...settings, separation_of_duties: e.target.checked })}
                    disabled={!isOwner}
                    className="w-4 h-4 text-[#ea580c] rounded focus:ring-orange-500 cursor-pointer disabled:opacity-50"
                  />
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-sans">
                  <strong>Explanation:</strong> Enforces independent approval for Gate 5 (Release). The user who created the pipeline run cannot approve Gate 5.
                </p>
                <div className="text-[11px] text-stone-500 font-sans italic border-t border-stone-200/60 pt-1.5">
                  تتطلب موافقة مستقلة للبوابة الخامسة. لا يمكن لمنشئ التشغيل اعتماد البوابة الخامسة.
                </div>
              </div>

              {/* Rule 3: separation_of_duties_all_gates */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-xs text-stone-900 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#ea580c]">verified_user</span>
                    <span>Separation of Duties (All Gates)</span>
                  </label>
                  <input
                    type="checkbox"
                    checked={settings.separation_of_duties_all_gates}
                    onChange={(e) => setSettings({ ...settings, separation_of_duties_all_gates: e.target.checked })}
                    disabled={!isOwner}
                    className="w-4 h-4 text-[#ea580c] rounded focus:ring-orange-500 cursor-pointer disabled:opacity-50"
                  />
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-sans">
                  <strong>Explanation:</strong> Extends separation of duties to all 5 stage gates. The user who started a stage dispatch cannot approve its gate review.
                </p>
                <div className="text-[11px] text-stone-500 font-sans italic border-t border-stone-200/60 pt-1.5">
                  تطبيق الفصل بين المهام على جميع البوابات الخمسمائة. المستخدم الذي بدأ المرحلة لا يمكنه اعتماد بوابتها.
                </div>
              </div>

              {/* Rule 4: max_revisions_per_stage */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-xs text-stone-900 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#ea580c]">autorenew</span>
                    <span>Max Revisions Per Stage (1 to 10)</span>
                  </label>
                  <select
                    value={settings.max_revisions_per_stage}
                    onChange={(e) => setSettings({ ...settings, max_revisions_per_stage: parseInt(e.target.value, 10) })}
                    disabled={!isOwner}
                    className="p-1.5 rounded-lg border border-stone-300 text-xs bg-white font-mono outline-none focus:border-[#ea580c] cursor-pointer disabled:opacity-50"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'revision' : 'revisions'}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed font-sans">
                  <strong>Explanation:</strong> Maximum number of interactive refinement dispatches permitted per stage run before hitting the revision limit.
                </p>
                <div className="text-[11px] text-stone-500 font-sans italic border-t border-stone-200/60 pt-1.5">
                  الحد الأقصى لعدد التعديلات التفاعلية المسموح بها لكل مرحلة قبل الوصول للحد.
                </div>
              </div>
            </div>

            {isOwner && (
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-6 py-2.5 rounded-xl bg-[#ea580c] hover:bg-orange-700 text-white font-bold text-xs shadow-sm transition disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>{savingSettings ? 'Saving Settings...' : 'Save Workspace Rules • حفظ القواعد'}</span>
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
