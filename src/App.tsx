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
import { AuthContainer } from './components/auth/AuthContainer';
import { api, setMemoryCsrfToken } from './api';

function MainLayout({ user, tenant, onLogout, lang, setLang }: { user: any; tenant: any; onLogout: () => void; lang: 'en' | 'ar'; setLang: (l: 'en' | 'ar') => void }) {
  const { activeTab } = useBYOK();
  const isSuperAdmin = user?.platformRole === 'super_admin';

  return (
    <div className={`min-h-screen bg-[#fff8f5] text-[#231a10] font-sans antialiased ${lang === 'ar' ? 'rtl' : 'ltr'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Sidebar isSuperAdmin={isSuperAdmin} onLogout={onLogout} lang={lang} setLang={setLang} />
      <TopHeader user={user} tenant={tenant} lang={lang} setLang={setLang} />

      <div className={lang === 'ar' ? 'pr-72' : 'pl-72'}>
        <main className="w-full pt-20 px-8 pb-12 max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'build' && <BuildSuiteView />}
          {activeTab === 'roles' && <RolesView />}
          {activeTab === 'agents' && <AgentsView />}
          {activeTab === 'models' && <ModelsView />}
          {activeTab === 'providers' && <ProvidersView />}
          {activeTab === 'studio' && <LiveStudioView />}
          {activeTab === 'admin' && isSuperAdmin && <AdminPanelView />}
        </main>
      </div>
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
      <MainLayout user={currentUser} tenant={currentTenant} onLogout={handleLogout} lang={lang} setLang={setLang} />
    </BYOKProvider>
  );
}
