import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block font-['Barlow_Condensed'] text-[11px] font-bold tracking-[0.18em] uppercase text-[#6b7280] mb-2">
        {label}
      </label>
      {children}
      {error && <p className="text-[#ff3c2e] text-xs mt-1">{error}</p>}
    </div>
  );
}

function Input(props) {
  return (
    <input
      className="w-full bg-[#0a0a0a] border border-[#2a2d35] text-white px-4 py-3 text-sm placeholder-[#3a3d45] focus:outline-none focus:border-[#e8f216] transition-colors"
      {...props}
    />
  );
}

export default function AuthModal({ open, onClose }) {
  const { login, register } = useAuth();
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [regForm, setRegForm] = useState({ username: '', email: '', password: '', password2: '' });

  function switchTab(t) {
    setTab(t);
    setErrors({});
    setGlobalError('');
  }

  async function handleLogin(e) {
    e.preventDefault();
    setGlobalError('');
    if (!loginForm.username || !loginForm.password) {
      setErrors({ username: !loginForm.username ? 'Введите логин' : '', password: !loginForm.password ? 'Введите пароль' : '' });
      return;
    }
    setLoading(true);
    try {
      await login(loginForm.username, loginForm.password);
      onClose();
    } catch (err) {
      setGlobalError(err.data?.detail || 'Неверный логин или пароль');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setGlobalError('');
    const errs = {};
    if (!regForm.username) errs.username = 'Введите имя пользователя';
    if (!regForm.email) errs.email = 'Введите email';
    if (!regForm.password) errs.password = 'Введите пароль';
    else if (regForm.password.length < 6) errs.password = 'Минимум 6 символов';
    if (regForm.password !== regForm.password2) errs.password2 = 'Пароли не совпадают';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await register(regForm);
      onClose();
    } catch (err) {
      if (err.data) {
        const serverErrs = {};
        Object.entries(err.data).forEach(([k, v]) => { serverErrs[k] = Array.isArray(v) ? v[0] : v; });
        setErrors(serverErrs);
      } else {
        setGlobalError('Ошибка регистрации');
      }
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/70 z-50" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-[#111214] border border-[#2a2d35] w-full max-w-md relative">
          {/* Top accent */}
          <div className="h-1 bg-gradient-to-r from-[#e8f216] to-[#c8d200]" />

          {/* Close */}
          <button onClick={onClose} className="absolute top-4 right-4 text-[#6b7280] hover:text-white text-lg transition-colors">✕</button>

          {/* Logo */}
          <div className="text-center pt-10 pb-6">
            <div className="font-['Barlow_Condensed'] font-black text-3xl uppercase text-white">
              STRIKE<span className="text-[#e8f216]">ZONE</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#2a2d35] mx-8">
            {[['login', 'Вход'], ['register', 'Регистрация']].map(([key, label]) => (
              <button
                key={key}
                onClick={() => switchTab(key)}
                className={`flex-1 py-3 font-['Barlow_Condensed'] font-bold text-sm tracking-widest uppercase transition-colors border-b-2 ${
                  tab === key
                    ? 'text-[#e8f216] border-[#e8f216]'
                    : 'text-[#6b7280] border-transparent hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Global error */}
          {globalError && (
            <div className="mx-8 mt-4 bg-[#ff3c2e]/10 border border-[#ff3c2e]/30 text-[#ff3c2e] text-sm px-4 py-3">
              {globalError}
            </div>
          )}

          {/* Login form */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="px-8 py-6 space-y-4">
              <Field label="Логин" error={errors.username}>
                <Input
                  placeholder="Ваш логин"
                  value={loginForm.username}
                  onChange={e => { setLoginForm(f => ({ ...f, username: e.target.value })); setErrors({}); }}
                />
              </Field>
              <Field label="Пароль" error={errors.password}>
                <Input
                  type="password"
                  placeholder="••••••"
                  value={loginForm.password}
                  onChange={e => { setLoginForm(f => ({ ...f, password: e.target.value })); setErrors({}); }}
                />
              </Field>
              <button
                type="submit"
                disabled={loading}
                className="w-full font-['Barlow_Condensed'] font-black text-sm tracking-widest uppercase bg-[#e8f216] text-[#0a0a0a] py-4 hover:bg-white transition-colors disabled:opacity-60 mt-2"
                style={{ clipPath: 'polygon(12px 0%,100% 0%,calc(100% - 12px) 100%,0% 100%)' }}
              >
                {loading ? 'Вход...' : 'Войти'}
              </button>
              <p className="text-center text-sm text-[#6b7280]">
                Нет аккаунта?{' '}
                <button type="button" onClick={() => switchTab('register')} className="text-[#e8f216] hover:underline">
                  Зарегистрироваться
                </button>
              </p>
            </form>
          )}

          {/* Register form */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="px-8 py-6 space-y-4">
              <Field label="Имя пользователя" error={errors.username}>
                <Input
                  placeholder="username"
                  value={regForm.username}
                  onChange={e => { setRegForm(f => ({ ...f, username: e.target.value })); setErrors({}); }}
                />
              </Field>
              <Field label="Email" error={errors.email}>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={regForm.email}
                  onChange={e => { setRegForm(f => ({ ...f, email: e.target.value })); setErrors({}); }}
                />
              </Field>
              <Field label="Пароль" error={errors.password}>
                <Input
                  type="password"
                  placeholder="Минимум 6 символов"
                  value={regForm.password}
                  onChange={e => { setRegForm(f => ({ ...f, password: e.target.value })); setErrors({}); }}
                />
              </Field>
              <Field label="Повторите пароль" error={errors.password2}>
                <Input
                  type="password"
                  placeholder="••••••"
                  value={regForm.password2}
                  onChange={e => { setRegForm(f => ({ ...f, password2: e.target.value })); setErrors({}); }}
                />
              </Field>
              <button
                type="submit"
                disabled={loading}
                className="w-full font-['Barlow_Condensed'] font-black text-sm tracking-widest uppercase bg-[#e8f216] text-[#0a0a0a] py-4 hover:bg-white transition-colors disabled:opacity-60 mt-2"
                style={{ clipPath: 'polygon(12px 0%,100% 0%,calc(100% - 12px) 100%,0% 100%)' }}
              >
                {loading ? 'Регистрация...' : 'Создать аккаунт'}
              </button>
              <p className="text-center text-sm text-[#6b7280]">
                Уже есть аккаунт?{' '}
                <button type="button" onClick={() => switchTab('login')} className="text-[#e8f216] hover:underline">
                  Войти
                </button>
              </p>
            </form>
          )}

          <div className="pb-2" />
        </div>
      </div>
    </>
  );
}
