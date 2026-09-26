import { useCallback, useEffect, useState } from 'react';
import CabinetShell from '@/components/cabinet/CabinetShell';
import Icon from '@/components/ui/icon';
import { api, type AccessCode } from '@/lib/cabinet-api';

const STATUS_LABEL: Record<string, { text: string; cls: string }> = {
  new: { text: 'НЕ АКТИВИРОВАН', cls: 'gray' },
  activated: { text: 'АКТИВИРОВАН', cls: 'green' },
  disabled: { text: 'ОТКЛЮЧЁН', cls: 'red' },
};

const fmt = (d: string | null) =>
  d ? new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';

const AdminCodes = () => {
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fresh, setFresh] = useState<{ id: number; code: string }[]>([]);
  const [form, setForm] = useState({ count: 1, group_name: '', course_name: '', period: '', note: '' });
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
        count: Number(form.count) || 1,
        group_name: form.group_name,
        course_name: form.course_name,
        period: form.period,
        note: form.note,
      });
      setFresh(res.created);
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
      <h1 className="cab-h1">Коды доступа учеников</h1>
      <p className="cab-sub">
        Создайте персональный пароль и передайте его ученику. При первом входе он сам заполнит профиль.
        Пароль показывается только один раз — после этого его можно лишь заменить на новый.
      </p>

      {error && <div className="cab-error">{error}</div>}

      <div className="cab-stats">
        <div className="cab-stat"><b>{stats.total ?? 0}</b><span>всего кодов</span></div>
        <div className="cab-stat"><b>{stats.activated ?? 0}</b><span>активированы</span></div>
        <div className="cab-stat"><b>{stats.with_profile ?? 0}</b><span>профилей создано</span></div>
        <div className="cab-stat"><b>{stats.disabled ?? 0}</b><span>отключены</span></div>
      </div>

      {codes.length > 0 && (
        <div className="cab-card cab-cta-card" style={{ borderColor: 'var(--line)' }}>
          <div>
            <h2>Массовое управление доступом</h2>
            <p className="cab-task-meta">
              Отключение мгновенно завершает все активные сессии. Данные и ответы учеников сохраняются.
            </p>
          </div>
          <div className="cab-row-actions">
            <button className="cab-btn cab-btn-ghost cab-btn-sm cab-danger" disabled={busy} onClick={() => setConfirmAll(true)}>
              <Icon name="Lock" size={15} /> Отключить все коды
            </button>
            {(stats.disabled ?? 0) > 0 && (
              <button
                className="cab-btn cab-btn-ghost cab-btn-sm"
                disabled={busy}
                onClick={() => act(() => api.enableAllCodes())}
              >
                <Icon name="LockOpen" size={15} /> Включить все
              </button>
            )}
          </div>
        </div>
      )}

      <div className="cab-card">
        <h2>Создать коды</h2>
        <div className="cab-form-grid">
          <div className="cab-field">
            <label>Количество</label>
            <input
              className="cab-input"
              type="number"
              min={1}
              max={50}
              value={form.count}
              onChange={(e) => setForm({ ...form, count: Number(e.target.value) })}
            />
          </div>
          <div className="cab-field">
            <label>Группа</label>
            <input className="cab-input" value={form.group_name} placeholder="Поток 1, декабрь"
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
        </div>
        <button className="cab-btn cab-inline-btn" onClick={create} disabled={busy}>
          <Icon name="Plus" size={16} />
          {busy ? 'Создаём…' : 'Создать коды'}
        </button>

        {fresh.length > 0 && (
          <div className="cab-codes-out">
            <h3>Новые пароли — скопируйте сейчас</h3>
            {fresh.map((c) => (
              <div className="cab-code-line" key={c.id}>
                <span>{c.code}</span>
                <button className="cab-btn cab-btn-ghost cab-btn-sm" onClick={() => copy(c.code)}>
                  Копировать
                </button>
              </div>
            ))}
            <p className="cab-warn">
              После обновления страницы пароли больше не отобразятся — в базе хранится только их зашифрованный отпечаток.
            </p>
          </div>
        )}
      </div>

      <div className="cab-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div className="cab-empty">Загрузка…</div>
        ) : codes.length === 0 ? (
          <div className="cab-empty">Кодов пока нет. Создайте первый выше.</div>
        ) : (
          <div className="cab-table-wrap" style={{ border: 'none', borderRadius: 0 }}>
            <table className="cab-table">
              <thead>
                <tr>
                  <th>Код</th>
                  <th>Ученик</th>
                  <th>Группа</th>
                  <th>Статус</th>
                  <th>Активирован</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {codes.map((c) => {
                  const st = STATUS_LABEL[c.status];
                  return (
                    <tr key={c.id}>
                      <td className="cab-muted" style={{ fontFamily: 'var(--mono)' }}>{c.code_hint}</td>
                      <td>
                        {c.profile_id ? (
                          <>
                            {c.first_name} {c.last_name}
                            <br />
                            <span className="cab-muted" style={{ fontSize: 12 }}>{c.email}</span>
                          </>
                        ) : (
                          <span className="cab-muted">профиль не создан</span>
                        )}
                      </td>
                      <td className="cab-muted">{c.group_name || '—'}</td>
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
                              Включить
                            </button>
                          ) : (
                            <button className="cab-btn cab-btn-ghost cab-btn-sm" disabled={busy}
                              onClick={() => act(() => api.disableCode(c.id))}>
                              Отключить
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
            <h2>Отключить все коды?</h2>
            <p>
              Вход будет закрыт для всех учеников — сейчас активных кодов {(stats.total ?? 0) - (stats.disabled ?? 0)}.
              Профили и ответы сохранятся, доступ можно вернуть кнопкой «Включить все».
            </p>
            <div className="cab-row-actions">
              <button
                className="cab-btn cab-btn-sm cab-danger"
                disabled={busy}
                onClick={async () => { await act(() => api.disableAllCodes()); setConfirmAll(false); }}
              >
                Да, отключить все
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