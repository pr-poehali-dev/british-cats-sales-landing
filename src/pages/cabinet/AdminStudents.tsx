import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import CabinetShell from '@/components/cabinet/CabinetShell';
import { api, type AdminStudent } from '@/lib/cabinet-api';

const AdminStudents = () => {
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [group, setGroup] = useState('');
  const [onlyAttention, setOnlyAttention] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const d = await api.adminStudents();
        setStudents(d.students);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const groups = useMemo(
    () => Array.from(new Set(students.map((s) => s.group_name).filter(Boolean))) as string[],
    [students],
  );

  const rows = students.filter(
    (s) => (!group || s.group_name === group) && (!onlyAttention || s.attention),
  );

  const delta = (s: AdminStudent) => {
    if (s.entrance_score === null || s.final_score === null) return '—';
    const d = Number(s.final_score) - Number(s.entrance_score);
    return `${d > 0 ? '+' : ''}${d.toFixed(0)} п.п.`;
  };

  return (
    <CabinetShell>
      <p className="cab-eyebrow">// АДМИНИСТРИРОВАНИЕ</p>
      <h1 className="cab-h1">Ученики</h1>
      <p className="cab-sub">
        Профили, созданные учениками, их прогресс по анкетам и динамика теста.
        Подсветка означает низкую удовлетворённость или сомнение в продолжении.
      </p>

      {error && <div className="cab-error">{error}</div>}

      <div className="cab-card">
        <div className="cab-form-grid" style={{ marginBottom: 0 }}>
          <div className="cab-field" style={{ marginBottom: 0 }}>
            <label>Группа</label>
            <select className="cab-input" value={group} onChange={(e) => setGroup(e.target.value)}>
              <option value="">Все группы</option>
              {groups.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div className="cab-field" style={{ marginBottom: 0, display: 'flex', alignItems: 'flex-end' }}>
            <label className="cab-consent" style={{ marginBottom: 12 }}>
              <input type="checkbox" checked={onlyAttention} onChange={(e) => setOnlyAttention(e.target.checked)} />
              <span>Только требующие внимания</span>
            </label>
          </div>
        </div>
      </div>

      <div className="cab-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div className="cab-empty">Загрузка…</div>
        ) : rows.length === 0 ? (
          <div className="cab-empty">Учеников пока нет. Создайте коды доступа и передайте их ученикам.</div>
        ) : (
          <div className="cab-table-wrap" style={{ border: 'none', borderRadius: 0 }}>
            <table className="cab-table">
              <thead>
                <tr>
                  <th>Ученик</th>
                  <th>Группа</th>
                  <th>Анкет завершено</th>
                  <th>Входной тест</th>
                  <th>Итоговый тест</th>
                  <th>Изменение</th>
                  <th>Удовлетворённость</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s.id} className={s.attention ? 'cab-row-attention' : undefined}>
                    <td>
                      {s.first_name} {s.last_name}
                      <br />
                      <span className="cab-muted" style={{ fontSize: 12 }}>{s.email}</span>
                    </td>
                    <td className="cab-muted">{s.group_name || '—'}</td>
                    <td>{s.completed_count}</td>
                    <td>{s.entrance_score !== null ? `${Number(s.entrance_score)}%` : '—'}</td>
                    <td>{s.final_score !== null ? `${Number(s.final_score)}%` : '—'}</td>
                    <td className={s.entrance_score !== null && s.final_score !== null ? 'cab-delta' : 'cab-muted'}>
                      {delta(s)}
                    </td>
                    <td>
                      {s.last_csat !== null ? (
                        <span className={`cab-badge ${s.attention ? 'red' : 'green'}`}>{s.last_csat}/10</span>
                      ) : <span className="cab-muted">—</span>}
                    </td>
                    <td>
                      <Link className="cab-btn cab-btn-ghost cab-btn-sm" to={`/cabinet/admin/students/${s.id}`}>
                        Открыть
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </CabinetShell>
  );
};

export default AdminStudents;
