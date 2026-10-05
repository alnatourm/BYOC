import React, { useState } from 'react';
import { api, setMemoryCsrfToken, setMemorySessionToken } from '../../api';

interface AuthContainerProps {
  initialMode?: 'login' | 'signup' | 'forgot' | 'reset' | 'verify';
  onAuthSuccess: (user: any, tenant: any) => void;
  lang: 'en' | 'ar';
  setLang: (lang: 'en' | 'ar') => void;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({
  initialMode = 'login',
  onAuthSuccess,
  lang,
  setLang,
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'reset' | 'verify'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [token, setToken] = useState(() => new URLSearchParams(window.location.search).get('token') || '');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const isRtl = lang === 'ar';

  const texts = {
    en: {
      titleLogin: 'Sign In to BYOC Platform',
      titleSignup: 'Create Your Tenant Account',
      titleForgot: 'Reset Your Password',
      titleReset: 'Enter New Password',
      titleVerify: 'Email Verification',
      emailLabel: 'Email Address',
      passwordLabel: 'Password (min 12 chars)',
      companyLabel: 'Company / Tenant Name',
      newPasswordLabel: 'New Password (min 12 chars)',
      tokenLabel: 'Verification / Reset Token',
      submitLogin: 'Sign In',
      submitSignup: 'Create Account',
      submitForgot: 'Send Reset Link',
      submitReset: 'Update Password',
      submitVerify: 'Verify Email',
      noAccount: "Don't have an account? Sign up",
      hasAccount: 'Already have an account? Sign in',
      forgotLink: 'Forgot password?',
      backToLogin: 'Back to sign in',
    },
    ar: {
      titleLogin: 'تسجيل الدخول إلى منصة BYOC',
      titleSignup: 'إنشاء حساب جديد للمؤسسة',
      titleForgot: 'إعادة ضبط كلمة المرور',
      titleReset: 'إدخال كلمة المرور الجديدة',
      titleVerify: 'تأكيد البريد الإلكتروني',
      emailLabel: 'البريد الإلكتروني',
      passwordLabel: 'كلمة المرور (12 حرفاً على الأقل)',
      companyLabel: 'اسم الشركة / المؤسسة',
      newPasswordLabel: 'كلمة المرور الجديدة',
      tokenLabel: 'رمز التأكيد',
      submitLogin: 'تسجيل الدخول',
      submitSignup: 'إنشاء الحساب',
      submitForgot: 'إرسال رابط الضبط',
      submitReset: 'تحديث كلمة المرور',
      submitVerify: 'تأكيد البريد',
      noAccount: 'ليس لديك حساب؟ سجل الآن',
      hasAccount: 'لديك حساب بالفعل؟ سجل الدخول',
      forgotLink: 'نسيت كلمة المرور؟',
      backToLogin: 'العودة لتسجيل الدخول',
    },
  };

  const t = texts[lang];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api('/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (res.csrfToken) setMemoryCsrfToken(res.csrfToken);
      if (res.token) setMemorySessionToken(res.token);
      if (res.user) {
        onAuthSuccess(res.user, res.tenant || null);
      } else {
        const me = await api('/v1/me');
        onAuthSuccess(me.user, me.tenant);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api('/v1/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, companyName }),
      });
      if (res.csrfToken) setMemoryCsrfToken(res.csrfToken);
      if (res.token) setMemorySessionToken(res.token);
      if (res.user && res.tenant) {
        onAuthSuccess(res.user, res.tenant);
      } else {
        const me = await api('/v1/me');
        onAuthSuccess(me.user, me.tenant);
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await api('/v1/auth/forgot', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setMessage(res.message || 'Reset link sent.');
    } catch (err: any) {
      setError(err.message || 'Failed to request reset.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await api('/v1/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword }),
      });
      setMessage(res.message || 'Password reset successfully.');
      setTimeout(() => setMode('login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await api('/v1/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });
      setMessage(res.message || 'Email verified.');
      setTimeout(() => setMode('login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-bold text-slate-950">
              BY
            </div>
            <span className="font-bold text-lg text-slate-100">BYOC Platform</span>
          </div>
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 font-medium"
          >
            {lang === 'en' ? 'العربية' : 'English'}
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="p-3.5 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-sm">
            {message}
          </div>
        )}

        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-100">{t.titleLogin}</h2>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">{t.emailLabel}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">{t.passwordLabel}</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-amber-500 outline-none"
              />
            </div>
            <div className="flex justify-between items-center text-xs">
              <button type="button" onClick={() => setMode('forgot')} className="text-amber-400 hover:underline">
                {t.forgotLink}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition disabled:opacity-50"
            >
              {loading ? '...' : t.submitLogin}
            </button>
            <div className="text-center pt-2">
              <button type="button" onClick={() => setMode('signup')} className="text-xs text-slate-400 hover:text-slate-200">
                {t.noAccount}
              </button>
            </div>
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-100">{t.titleSignup}</h2>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">{t.companyLabel}</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">{t.emailLabel}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">{t.passwordLabel}</label>
              <input
                type="password"
                required
                minLength={12}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-amber-500 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition disabled:opacity-50"
            >
              {loading ? '...' : t.submitSignup}
            </button>
            <div className="text-center pt-2">
              <button type="button" onClick={() => setMode('login')} className="text-xs text-slate-400 hover:text-slate-200">
                {t.hasAccount}
              </button>
            </div>
          </form>
        )}

        {mode === 'forgot' && (
          <form onSubmit={handleForgot} className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-100">{t.titleForgot}</h2>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">{t.emailLabel}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-amber-500 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition disabled:opacity-50"
            >
              {loading ? '...' : t.submitForgot}
            </button>
            <div className="text-center pt-2">
              <button type="button" onClick={() => setMode('login')} className="text-xs text-slate-400 hover:text-slate-200">
                {t.backToLogin}
              </button>
            </div>
          </form>
        )}

        {mode === 'reset' && (
          <form onSubmit={handleReset} className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-100">{t.titleReset}</h2>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">{t.tokenLabel}</label>
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">{t.newPasswordLabel}</label>
              <input
                type="password"
                required
                minLength={12}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-amber-500 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition disabled:opacity-50"
            >
              {loading ? '...' : t.submitReset}
            </button>
            <div className="text-center pt-2">
              <button type="button" onClick={() => setMode('login')} className="text-xs text-slate-400 hover:text-slate-200">
                {t.backToLogin}
              </button>
            </div>
          </form>
        )}

        {mode === 'verify' && (
          <form onSubmit={handleVerify} className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-100">{t.titleVerify}</h2>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">{t.tokenLabel}</label>
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:border-amber-500 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition disabled:opacity-50"
            >
              {loading ? '...' : t.submitVerify}
            </button>
            <div className="text-center pt-2">
              <button type="button" onClick={() => setMode('login')} className="text-xs text-slate-400 hover:text-slate-200">
                {t.backToLogin}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
