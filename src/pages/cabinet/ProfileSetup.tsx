import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
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

const EMPTY = {
  first_name: '', last_name: '', phone: '', email: '',
  city: '', industry: '', profession: '', employment_type: '',
};

const ProfileSetup = () => {
  const { refresh } = useCabinet();
  const [form, setForm] = useState(EMPTY);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  const set = (k: keyof typeof EMPTY, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setError('Проверьте формат email');
      return;
    }
    if (form.phone.replace(/\D/g, '').length < 10) {
      setError('Проверьте номер телефона');
      return;
    }
    setBusy(true);
    try {
      await api.createProfile({ ...form, consent });
      await refresh();
      nav('/cabinet', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось сохранить профиль');
    } finally {
      setBusy(false);
    }
  };

  const ready =
    form.first_name.trim() && form.last_name.trim() && form.phone.trim() &&
    form.email.trim() && form.industry && form.employment_type && consent;

  return (
    <div className="cab cab-login" style={{ alignItems: 'flex-start', paddingTop: 48, paddingBottom: 48 }}>
      <div className="spot l" />
      <div className="grid-bg" />
      <form className="cab-login-card" style={{ maxWidth: 560 }} onSubmit={submit}>
        <img className="cab-login-logo" src="/site/logo.jpg" alt="Хакни Нейросети" />
        <h1>Добро пожаловать!</h1>
        <p>Перед началом заполните короткий профиль — это займёт около двух минут.</p>

        {error && <div className="cab-error">{error}</div>}

        <div className="cab-form-grid">
          <div className="cab-field">
            <label>Имя *</label>
            <input className="cab-input" value={form.first_name} onChange={(e) => set('first_name', e.target.value)} />
          </div>
          <div className="cab-field">
            <label>Фамилия *</label>
            <input className="cab-input" value={form.last_name} onChange={(e) => set('last_name', e.target.value)} />
          </div>
          <div className="cab-field">
            <label>Телефон *</label>
            <input className="cab-input" type="tel" placeholder="+7 900 000-00-00"
              value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          </div>
          <div className="cab-field">
            <label>Email *</label>
            <input className="cab-input" type="email" placeholder="you@mail.ru"
              value={form.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div className="cab-field">
            <label>Город</label>
            <input className="cab-input" placeholder="Владивосток"
              value={form.city} onChange={(e) => set('city', e.target.value)} />
          </div>
          <div className="cab-field">
            <label>Профессия или должность</label>
            <input className="cab-input" value={form.profession} onChange={(e) => set('profession', e.target.value)} />
          </div>
        </div>

        <div className="cab-field">
          <label>Сфера деятельности *</label>
          <select className="cab-input" value={form.industry} onChange={(e) => set('industry', e.target.value)}>
            <option value="">Выберите вариант</option>
            {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>

        <div className="cab-field">
          <label>Формат занятости *</label>
          <select className="cab-input" value={form.employment_type} onChange={(e) => set('employment_type', e.target.value)}>
            <option value="">Выберите вариант</option>
            {EMPLOYMENT.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>

        <label className="cab-consent">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
          <span>Согласен на обработку персональных данных школой «Хакни Нейросети»</span>
        </label>

        <button className="cab-btn" type="submit" disabled={busy || !ready} style={{ marginTop: 10 }}>
          {busy ? 'Сохраняем…' : 'Создать профиль'}
        </button>
      </form>
    </div>
  );
};

export default ProfileSetup;
