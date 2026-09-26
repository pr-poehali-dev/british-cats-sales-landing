import { useEffect, useState, type FormEvent } from 'react';
import CabinetShell from '@/components/cabinet/CabinetShell';
import { api } from '@/lib/cabinet-api';
import { useCabinet } from '@/contexts/CabinetAuth';

const INDUSTRIES = [
  'Услуги', 'Торговля и маркетплейсы', 'Производство', 'Строительство и ремонт',
  'Недвижимость', 'Логистика и транспорт', 'Образование', 'Медицина и здоровье',
  'Красота и здоровье', 'Общепит', 'IT и digital', 'Маркетинг и реклама',
  'Финансы и консалтинг', 'Туризм', 'Государственная сфера', 'Другое',
];

const EMPLOYMENT = [
  'Предприниматель', 'Руководитель', 'Специалист в найме',
  'Фрилансер', 'Студент', 'Временно не работаю', 'Другое',
];

const StudentProfile = () => {
  const { me, refresh } = useCabinet();
  const [form, setForm] = useState({
    first_name: '', last_name: '', phone: '', email: '',
    city: '', industry: '', profession: '', employment_type: '',
  });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [pins, setPins] = useState({ current: '', next: '', repeat: '' });
  const [pinMsg, setPinMsg] = useState('');
  const [pinError, setPinError] = useState('');

  useEffect(() => {
    if (me?.profile) {
      setForm({
        first_name: me.profile.first_name,
        last_name: me.profile.last_name,
        phone: me.profile.phone,
        email: me.profile.email,
        city: me.profile.city || '',
        industry: me.profile.industry,
        profession: me.profile.profession || '',
        employment_type: me.profile.employment_type,
      });
    }
  }, [me]);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMsg('');
    setBusy(true);
    try {
      await api.updateProfile(form);
      await refresh();
      setMsg('Профиль сохранён');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось сохранить');
    } finally {
      setBusy(false);
    }
  };

  const changePin = async (e: FormEvent) => {
    e.preventDefault();
    setPinError('');
    setPinMsg('');
    if (pins.next.length < 4) {
      setPinError('Новый PIN должен быть от 4 до 6 цифр');
      return;
    }
    if (pins.next !== pins.repeat) {
      setPinError('Новый PIN и его повтор не совпадают');
      return;
    }
    setBusy(true);
    try {
      await api.changePin(pins.current, pins.next);
      setPins({ current: '', next: '', repeat: '' });
      setPinMsg('PIN изменён. В следующий раз входите с новым.');
    } catch (err) {
      setPinError(err instanceof Error ? err.message : 'Не удалось изменить PIN');
    } finally {
      setBusy(false);
    }
  };

  const digits = (v: string) => v.replace(/\D/g, '').slice(0, 6);

  return (
    <CabinetShell>
      <p className="cab-eyebrow">// ПРОФИЛЬ</p>
      <h1 className="cab-h1">Мои данные</h1>
      <p className="cab-sub">Ответы завершённых анкет при изменении профиля не меняются.</p>

      {error && <div className="cab-error">{error}</div>}
      {msg && <div className="cab-card" style={{ borderColor: 'var(--cyan)', padding: 16 }}>{msg}</div>}

      <form className="cab-card" onSubmit={submit}>
        <div className="cab-form-grid">
          <div className="cab-field">
            <label>Имя</label>
            <input className="cab-input" value={form.first_name} onChange={(e) => set('first_name', e.target.value)} />
          </div>
          <div className="cab-field">
            <label>Фамилия</label>
            <input className="cab-input" value={form.last_name} onChange={(e) => set('last_name', e.target.value)} />
          </div>
          <div className="cab-field">
            <label>Телефон</label>
            <input className="cab-input" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          </div>
          <div className="cab-field">
            <label>Email</label>
            <input className="cab-input" value={form.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div className="cab-field">
            <label>Город</label>
            <input className="cab-input" value={form.city} onChange={(e) => set('city', e.target.value)} />
          </div>
          <div className="cab-field">
            <label>Профессия или должность</label>
            <input className="cab-input" value={form.profession} onChange={(e) => set('profession', e.target.value)} />
          </div>
        </div>

        <div className="cab-field">
          <label>Сфера деятельности</label>
          <select className="cab-input" value={form.industry} onChange={(e) => set('industry', e.target.value)}>
            {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div className="cab-field">
          <label>Формат занятости</label>
          <select className="cab-input" value={form.employment_type} onChange={(e) => set('employment_type', e.target.value)}>
            {EMPLOYMENT.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>

        <button className="cab-btn cab-inline-btn" type="submit" disabled={busy}>
          {busy ? 'Сохраняем…' : 'Сохранить'}
        </button>
      </form>

      <form className="cab-card" onSubmit={changePin}>
        <h2>Личный PIN</h2>
        <p className="cab-sub" style={{ marginBottom: 20 }}>
          PIN — ваш личный ключ внутри потока. Пароль потока при этом не меняется.
        </p>

        {pinError && <div className="cab-error">{pinError}</div>}
        {pinMsg && <div className="cab-ok">{pinMsg}</div>}

        <div className="cab-form-grid">
          <div className="cab-field">
            <label>Текущий PIN</label>
            <input className="cab-input cab-pin-input" inputMode="numeric" value={pins.current}
              onChange={(e) => setPins({ ...pins, current: digits(e.target.value) })} placeholder="••••" />
          </div>
          <div className="cab-field">
            <label>Новый PIN</label>
            <input className="cab-input cab-pin-input" inputMode="numeric" value={pins.next}
              onChange={(e) => setPins({ ...pins, next: digits(e.target.value) })} placeholder="••••" />
          </div>
          <div className="cab-field">
            <label>Повторите новый</label>
            <input className="cab-input cab-pin-input" inputMode="numeric" value={pins.repeat}
              onChange={(e) => setPins({ ...pins, repeat: digits(e.target.value) })} placeholder="••••" />
          </div>
        </div>

        <button className="cab-btn cab-btn-ghost cab-inline-btn" type="submit"
          disabled={busy || pins.current.length < 4 || pins.next.length < 4}>
          Изменить PIN
        </button>
      </form>
    </CabinetShell>
  );
};

export default StudentProfile;