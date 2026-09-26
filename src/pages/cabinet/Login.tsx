import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCabinet } from '@/contexts/CabinetAuth';

const Login = () => {
  const { me, loading, login } = useCabinet();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    document.title = 'Вход в личный кабинет — Хакни Нейросети';
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    return () => robots.remove();
  }, []);

  useEffect(() => {
    if (!loading && me) {
      nav(me.role === 'admin' ? '/cabinet/admin' : '/cabinet', { replace: true });
    }
  }, [me, loading, nav]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const fresh = await login(code.trim());
      nav(fresh.role === 'admin' ? '/cabinet/admin' : '/cabinet', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось войти');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="cab cab-login">
      <div className="spot l" />
      <div className="spot r" />
      <div className="grid-bg" />
      <form className="cab-login-card" onSubmit={submit}>
        <img className="cab-login-logo" src="/site/logo.jpg" alt="Хакни Нейросети" />
        <h1>Личный кабинет ученика</h1>
        <p>Введите персональный пароль, который выдала школа. Регистрация не нужна.</p>

        {error && <div className="cab-error">{error}</div>}

        <div className="cab-field">
          <label htmlFor="code">Персональный пароль</label>
          <input
            id="code"
            className="cab-input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="XXXX-XXXX-XXXX"
            autoComplete="off"
            autoCapitalize="characters"
            disabled={busy}
          />
        </div>

        <button className="cab-btn" type="submit" disabled={busy || !code.trim()}>
          {busy ? 'Проверяем…' : 'Войти'}
        </button>

        <div className="cab-hint">
          Пароль не приходит автоматически — его выдаёт школа. Если пароль не подходит,
          напишите нам в <a href="https://t.me/chernikovpsiholog" target="_blank" rel="noopener">Telegram</a>.
          <br />
          <Link to="/">← Вернуться на сайт</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
