import React, { useState, useEffect } from 'react';
import { BYOKProvider, useBYOK } from './context/BYOKContext';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { DashboardView } from './components/DashboardView';
import { RolesView } from './components/RolesView';
import { AgentsView } from './components/AgentsView';
import { ModelsView } from './components/ModelsView';
import { ProvidersView } from './components/ProvidersView';
import { LiveStudioView } from './components/LiveStudioView';
import { BuildSuiteView } from './components/BuildSuiteView';
import { AdminPanelView } from './components/AdminPanelView';
import { MembersView } from './components/MembersView';
import { AuthContainer } from './components/auth/AuthContainer';
import { AddProviderModal } from './components/modals/AddProviderModal';
import { AddModelModal } from './components/modals/AddModelModal';
import { AddAgentModal } from './components/modals/AddAgentModal';
import { AddRoleModal } from './components/modals/AddRoleModal';
import { CreateProjectModal } from './components/modals/CreateProjectModal';
import { api, setMemoryCsrfToken } from './api';

function MainLayout({ user, tenant, onLogout, lang, setLang, onUserVerified }: { user: any; tenant: any; onLogout: () => void; lang: 'en' | 'ar'; setLang: (l: 'en' | 'ar') => void; onUserVerified: () => void }) {
  const { activeTab } = useBYOK();
  const isSuperAdmin = user?.platformRole === 'super_admin';
  const userRole = tenant?.role || 'viewer';

  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [verifyToken, setVerifyToken] = useState('');
  const [verifying, setVerifying] = useState(false);

  const handleResend = async () => {
    try {
      setResending(true);
      setResendStatus(null);
      await api('/v1/auth/resend-verification', { method: 'POST' });
      setResendStatus('Verification email sent! Check server logs or inbox.');
    } catch (err: any) {
      setResendStatus(`Error: ${err.message || 'Failed to resend'}`);
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyToken.trim()) return;
    try {
      setVerifying(true);
      await api('/v1/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ token: verifyToken.trim() }),
      });
      setVerifyToken('');
      setResendStatus('Email verified successfully!');
      onUserVerified();
    } catch (err: any) {
      setResendStatus(`Error: ${err.message || 'Invalid token'}`);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#fff8f5] text-[#231a10] font-sans antialiased ${lang === 'ar' ? 'rtl' : 'ltr'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Sidebar isSuperAdmin={isSuperAdmin} userRole={userRole} onLogout={onLogout} lang={lang} setLang={setLang} />
      <TopHeader user={user} tenant={tenant} lang={lang} setLang={setLang} />

      <div className={lang === 'ar' ? 'pr-72' : 'pl-72'}>
        <main className="w-full pt-20 px-8 pb-12 max-w-7xl mx-auto space-y-6">
          {!user?.emailVerified && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[24px] text-amber-600">mark_email_unread</span>
                <div>
                  <h4 className="font-bold text-xs font-display text-amber-950">
                    Email Address Unverified • البريد غير مؤكد
                  </h4>
                  <p className="text-xs text-amber-900 mt-0.5">
                    Your account email ({user?.email}) is unverified. Email verification is required to start stage dispatches, refine documents, or manage hosting connections.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0 w-full md:w-auto">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition cursor-pointer disabled:opacity-50"
                >
                  {resending ? 'Sending...' : 'Resend Verification Email'}
                </button>

                <form onSubmit={handleVerify} className="flex items-center gap-1">
                  <input
                    type="text"
                    value={verifyToken}
                    onChange={(e) => setVerifyToken(e.target.value)}
                    placeholder="Paste token..."
                    className="px-2.5 py-1 rounded-lg border border-amber-300 text-xs font-mono bg-white outline-none w-32 focus:border-amber-600"
                  />
                  <button
                    type="submit"
                    disabled={verifying || !verifyToken.trim()}
                    className="px-3 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition cursor-pointer disabled:opacity-50"
                  >
                    {verifying ? '...' : 'Verify'}
                  </button>
                </form>
              </div>

              {resendStatus && (
                <div className="w-full text-xs font-mono text-amber-900 bg-amber-100/60 p-2 rounded-lg">
                  {resendStatus}
                </div>
              )}
            </div>
          )}

          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'build' && <BuildSuiteView />}
          {activeTab === 'roles' && <RolesView />}
          {activeTab === 'agents' && <AgentsView />}
          {activeTab === 'models' && <ModelsView />}
          {activeTab === 'providers' && <ProvidersView />}
          {activeTab === 'studio' && <LiveStudioView />}
          {activeTab === 'members' && (userRole === 'owner' || userRole === 'admin') && (
            <MembersView currentUser={user} currentRole={userRole} lang={lang} />
          )}
          {activeTab === 'admin' && isSuperAdmin && <AdminPanelView />}
        </main>
      </div>

      <AddProviderModal />
      <AddModelModal />
      <AddAgentModal />
      <AddRoleModal />
      <CreateProjectModal />
    </div>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentTenant, setCurrentTenant] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [lang, setLangState] = useState<'en' | 'ar'>(() => {
    return (localStorage.getItem('byoc_lang') as 'en' | 'ar') || 'en';
  });

  const setLang = (newLang: 'en' | 'ar') => {
    setLangState(newLang);
    localStorage.setItem('byoc_lang', newLang);
  };

  const checkAuthStatus = async () => {
    try {
      setCheckingAuth(true);
      const res = await api('/v1/me');
      setCurrentUser(res.user);
      setCurrentTenant(res.tenant);
      if (res.csrfToken) {
        setMemoryCsrfToken(res.csrfToken);
      }
    } catch {
      setCurrentUser(null);
      setCurrentTenant(null);
    } finally {
      setCheckingAuth(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await api('/v1/auth/logout', { method: 'POST' });
    } catch {}
    setCurrentUser(null);
    setCurrentTenant(null);
    setMemoryCsrfToken(null);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Authenticating BYOC Platform Session...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <AuthContainer
        onAuthSuccess={(u, t) => {
          setCurrentUser(u);
          setCurrentTenant(t);
        }}
        lang={lang}
        setLang={setLang}
      />
    );
  }

  return (
    <BYOKProvider>
      <MainLayout user={currentUser} tenant={currentTenant} onLogout={handleLogout} lang={lang} setLang={setLang} onUserVerified={checkAuthStatus} />
    </BYOKProvider>
  );
}
