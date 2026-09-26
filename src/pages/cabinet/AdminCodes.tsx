import { useCallback, useEffect, useState } from 'react';
import CabinetShell from '@/components/cabinet/CabinetShell';
import Icon from '@/components/ui/icon';
import { api, type AccessCode } from '@/lib/cabinet-api';

const STATUS_LABEL: Record<string, { text: string; cls: string }> = {
  new: { text: 'НЕ ИСПОЛЬЗОВАЛСЯ', cls: 'gray' },
  activated: { text: 'АКТИВЕН', cls: 'green' },
  disabled: { text: 'ЗАКРЫТ', cls: 'red' },
};

const fmt = (d: string | null) =>
  d ? new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';

const AdminCodes = () => {
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fresh, setFresh] = useState<{ id: number; code: string; group_name?: string }[]>([]);
  const [form, setForm] = useState({ group_name: '', course_name: '', period: '', custom_code: '', max_students: '' });
  const [busy, setBusy] = useState(false);
  const [confirmAll, setConfirmAll] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.listCodes();
      setCodes(data.codes);
      setStats(data.stats);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = async () => {
    setBusy(true);
    setError('');
    try {
      const res = await api.createCodes({
        group_name: form.group_name,
        course_name: form.course_name,
        period: form.period,
        custom_code: form.custom_code,
        max_students: form.max_students ? Number(form.max_students) : null,
      });
      setFresh(res.created);
      setForm({ group_name: '', course_name: '', period: '', custom_code: '', max_students: '' });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось создать');
    } finally {
      setBusy(false);
    }
  };

  const act = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    try {
      await fn();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка');
    } finally {
      setBusy(false);
    }
  };

  const regen = async (id: number) => {
    setBusy(true);
    setError('');
    try {
      const res = await api.regenerateCode(id);
      setFresh([res]);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка');
    } finally {
      setBusy(false);
    }
  };

  const copy = (text: string) => navigator.clipboard?.writeText(text);

  return (
    <CabinetShell>
      <p className="cab-eyebrow">// АДМИНИСТРИРОВАНИЕ</p>
      <h1 className="cab-h1">Пароли потоков</h1>
      <p className="cab-sub">
        Один пароль на весь поток — выдайте его всей группе. Каждый ученик при первом входе создаёт
        свой профиль и придумывает личный PIN, по которому система узнаёт именно его.
        Анкеты учеников не пересекаются: чужие ответы не видит никто, кроме вас.
      </p>

      {error && <div className="cab-error">{error}</div>}

      <div className="cab-stats">
        <div className="cab-stat"><b>{stats.total ?? 0}</b><span>потоков</span></div>
        <div className="cab-stat"><b>{stats.activated ?? 0}</b><span>активных</span></div>
        <div className="cab-stat"><b>{stats.students ?? 0}</b><span>учеников всего</span></div>
        <div className="cab-stat"><b>{stats.disabled ?? 0}</b><span>закрыто</span></div>
      </div>

      {codes.length > 0 && (
        <div className="cab-card cab-cta-card" style={{ borderColor: 'var(--line)' }}>
          <div>
            <h2>Массовое управление доступом</h2>
            <p className="cab-task-meta">
              Закрытие мгновенно завершает все сессии. Профили и ответы учеников сохраняются.
            </p>
          </div>
          <div className="cab-row-actions">
            <button className="cab-btn cab-btn-ghost cab-btn-sm cab-danger" disabled={busy} onClick={() => setConfirmAll(true)}>
              <Icon name="Lock" size={15} /> Закрыть все потоки
            </button>
            {(stats.disabled ?? 0) > 0 && (
              <button className="cab-btn cab-btn-ghost cab-btn-sm" disabled={busy}
                onClick={() => act(() => api.enableAllCodes())}>
                <Icon name="LockOpen" size={15} /> Открыть все
              </button>
            )}
          </div>
        </div>
      )}

      <div className="cab-card">
        <h2>Создать поток</h2>
        <div className="cab-form-grid">
          <div className="cab-field">
            <label>Название потока *</label>
            <input className="cab-input" value={form.group_name} placeholder="Поток 5"
              onChange={(e) => setForm({ ...form, group_name: e.target.value })} />
          </div>
          <div className="cab-field">
            <label>Курс</label>
            <input className="cab-input" value={form.course_name} placeholder="Хакни Нейросети"
              onChange={(e) => setForm({ ...form, course_name: e.target.value })} />
          </div>
          <div className="cab-field">
            <label>Период</label>
            <input className="cab-input" value={form.period} placeholder="декабрь 2026 — март 2027"
              onChange={(e) => setForm({ ...form, period: e.target.value })} />
          </div>
          <div className="cab-field">
            <label>Лимит учеников</label>
            <input className="cab-input" type="number" min={1} value={form.max_students} placeholder="без лимита"
              onChange={(e) => setForm({ ...form, max_students: e.target.value })} />
          </div>
        </div>
        <div className="cab-field">
          <label>Свой пароль (необязательно)</label>
          <input className="cab-input" value={form.custom_code} placeholder="оставьте пустым — создам сам"
            onChange={(e) => setForm({ ...form, custom_code: e.target.value.toUpperCase() })} />
        </div>

        <button className="cab-btn cab-inline-btn" onClick={create} disabled={busy || !form.group_name.trim()}>
          <Icon name="Plus" size={16} />
          {busy ? 'Создаём…' : 'Создать поток'}
        </button>

        {fresh.length > 0 && (
          <div className="cab-codes-out">
            <h3>Пароль потока — скопируйте сейчас</h3>
            {fresh.map((c) => (
              <div className="cab-code-line" key={c.id}>
                <span>{c.code}</span>
                <button className="cab-btn cab-btn-ghost cab-btn-sm" onClick={() => copy(c.code)}>
                  Копировать
                </button>
              </div>
            ))}
            <p className="cab-warn">
              Выдайте этот пароль всей группе. После обновления страницы он больше не отобразится —
              в базе хранится только зашифрованный отпечаток. Если пароль потеряется, создайте новый.
            </p>
          </div>
        )}
      </div>

      <div className="cab-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div className="cab-empty">Загрузка…</div>
        ) : codes.length === 0 ? (
          <div className="cab-empty">Потоков пока нет. Создайте первый выше.</div>
        ) : (
          <div className="cab-table-wrap" style={{ border: 'none', borderRadius: 0 }}>
            <table className="cab-table">
              <thead>
                <tr>
                  <th>Поток</th>
                  <th>Пароль</th>
                  <th>Учеников</th>
                  <th>Статус</th>
                  <th>Первый вход</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {codes.map((c) => {
                  const st = STATUS_LABEL[c.status];
                  return (
                    <tr key={c.id}>
                      <td>
                        {c.group_name || '—'}
                        {c.period && <><br /><span className="cab-muted" style={{ fontSize: 12 }}>{c.period}</span></>}
                      </td>
                      <td className="cab-muted" style={{ fontFamily: 'var(--mono)' }}>{c.code_hint}</td>
                      <td>
                        {c.students_count}
                        {c.max_students ? <span className="cab-muted"> / {c.max_students}</span> : null}
                      </td>
                      <td><span className={`cab-badge ${st.cls}`}>{st.text}</span></td>
                      <td className="cab-muted">{fmt(c.activated_at)}</td>
                      <td>
                        <div className="cab-row-actions">
                          <button className="cab-btn cab-btn-ghost cab-btn-sm" disabled={busy} onClick={() => regen(c.id)}>
                            Новый пароль
                          </button>
                          {c.status === 'disabled' ? (
                            <button className="cab-btn cab-btn-ghost cab-btn-sm" disabled={busy}
                              onClick={() => act(() => api.enableCode(c.id))}>
                              Открыть
                            </button>
                          ) : (
                            <button className="cab-btn cab-btn-ghost cab-btn-sm cab-danger" disabled={busy}
                              onClick={() => act(() => api.disableCode(c.id))}>
                              Закрыть
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {confirmAll && (
        <div className="cab-modal" onClick={() => !busy && setConfirmAll(false)}>
          <div className="cab-modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Закрыть все потоки?</h2>
            <p>
              Вход будет закрыт для всех учеников — сейчас открытых потоков {(stats.total ?? 0) - (stats.disabled ?? 0)}.
              Профили и ответы сохранятся, доступ вернётся кнопкой «Открыть все».
            </p>
            <div className="cab-row-actions">
              <button className="cab-btn cab-btn-sm cab-danger" disabled={busy}
                onClick={async () => { await act(() => api.disableAllCodes()); setConfirmAll(false); }}>
                Да, закрыть все
              </button>
              <button className="cab-btn cab-btn-ghost cab-btn-sm" disabled={busy} onClick={() => setConfirmAll(false)}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </CabinetShell>
  );
};

export default AdminCodes;
