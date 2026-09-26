import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCabinet } from '@/contexts/CabinetAuth';
import { api } from '@/lib/cabinet-api';

interface GroupInfo {
  ticket: string;
  group_name: string | null;
  course_name: string | null;
  period: string | null;
  students_count: number;
  group_full: boolean;
}

export const TICKET_KEY = 'cabinet_ticket';

const Login = () => {
  const { me, loading, applyToken } = useCabinet();
  const [code, setCode] = useState('');
  const [pin, setPin] = useState('');
  const [group, setGroup] = useState<GroupInfo | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const pinRef = useRef<HTMLInputElement>(null);
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

  useEffect(() => {
    if (group) pinRef.current?.focus();
  }, [group]);

  const submitCode = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await api.checkCode(code.trim());
      if (res.step === 'done' && res.token) {
        const fresh = await applyToken(res.token);
        nav(fresh.role === 'admin' ? '/cabinet/admin' : '/cabinet', { replace: true });
        return;
      }
      sessionStorage.setItem(TICKET_KEY, res.ticket || '');
      sessionStorage.setItem('cabinet_group', res.group_name || '');
      setGroup({
        ticket: res.ticket || '',
        group_name: res.group_name ?? null,
        course_name: res.course_name ?? null,
        period: res.period ?? null,
        students_count: res.students_count ?? 0,
        group_full: !!res.group_full,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось войти');
    } finally {
      setBusy(false);
    }
  };

  const submitPin = async (e: FormEvent) => {
    e.preventDefault();
    if (!group) return;
    setError('');
    setNotFound(false);
    setBusy(true);
    try {
      const res = await api.loginPin(group.ticket, pin.trim());
      const fresh = await applyToken(res.token);
      nav(fresh.role === 'admin' ? '/cabinet/admin' : '/cabinet', { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Не удалось войти';
      if (msg.includes('не найден')) setNotFound(true);
      else setError(msg);
    } finally {
      setBusy(false);
    }
  };

  const restart = () => {
    setGroup(null);
    setPin('');
    setNotFound(false);
    setError('');
    sessionStorage.removeItem(TICKET_KEY);
  };

  return (
    <div className="cab cab-login">
      <div className="spot l" />
      <div className="spot r" />
      <div className="grid-bg" />

      {!group ? (
        <form className="cab-login-card" onSubmit={submitCode}>
          <img className="cab-login-logo" src="/site/logo.jpg" alt="Хакни Нейросети" />
          <h1>Личный кабинет ученика</h1>
          <p>Введите пароль вашего потока — его выдала школа. Регистрация не нужна.</p>

          {error && <div className="cab-error">{error}</div>}

          <div className="cab-field">
            <label htmlFor="code">Пароль потока</label>
            <input
              id="code"
              className="cab-input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="POTOK-XXXX"
              autoComplete="off"
              autoCapitalize="characters"
              disabled={busy}
            />
          </div>

          <button className="cab-btn" type="submit" disabled={busy || !code.trim()}>
            {busy ? 'Проверяем…' : 'Продолжить'}
          </button>

          <div className="cab-hint">
            Пароль один на весь поток. Внутри у каждого ученика свой личный PIN — чужие анкеты увидеть нельзя.
            <br />
            Не подходит пароль? Напишите в{' '}
            <a href="https://t.me/chernikovpsiholog" target="_blank" rel="noopener">Telegram</a>.
            <br />
            <Link to="/">← Вернуться на сайт</Link>
          </div>
        </form>
      ) : (
        <form className="cab-login-card" onSubmit={submitPin}>
          <img className="cab-login-logo" src="/site/logo.jpg" alt="Хакни Нейросети" />
          <h1>{group.group_name || 'Ваш поток'}</h1>
          <p>Поток подтверждён. Теперь введите свой личный PIN, который придумали при создании профиля.</p>

          {error && <div className="cab-error">{error}</div>}

          {notFound && (
            <div className="cab-error">
              Профиля с таким PIN в этом потоке нет.
              <br />
              Если вы здесь впервые — создайте профиль кнопкой ниже. Если уже создавали, проверьте PIN
              или попросите школу сбросить его.
            </div>
          )}

          <div className="cab-field">
            <label htmlFor="pin">Ваш личный PIN</label>
            <input
              id="pin"
              ref={pinRef}
              className="cab-input cab-pin-input"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="••••"
              inputMode="numeric"
              autoComplete="off"
              disabled={busy}
            />
          </div>

          <button className="cab-btn" type="submit" disabled={busy || pin.length < 4}>
            {busy ? 'Проверяем…' : 'Войти'}
          </button>

          {!group.group_full ? (
            <button
              type="button"
              className="cab-btn cab-btn-ghost"
              style={{ marginTop: 10 }}
              disabled={busy}
              onClick={() => nav('/cabinet/setup')}
            >
              Я здесь впервые — создать профиль
            </button>
          ) : (
            <p className="cab-warn" style={{ marginTop: 14 }}>
              В этом потоке все места заняты. Если вы новый ученик — обратитесь к администратору.
            </p>
          )}

          <div className="cab-hint">
            {group.students_count > 0 && <>В потоке уже {group.students_count} участников.<br /></>}
            <button type="button" className="cab-link-btn" onClick={restart}>← Другой поток</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;
