import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CabinetShell from '@/components/cabinet/CabinetShell';
import Icon from '@/components/ui/icon';
import { api, type ReportData } from '@/lib/cabinet-api';
import { useCabinet } from '@/contexts/CabinetAuth';

const Report = () => {
  const { me } = useCabinet();
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setData(await api.report());
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <CabinetShell><div className="cab-loading">ЗАГРУЗКА…</div></CabinetShell>;

  if (!data?.ready) {
    return (
      <CabinetShell>
        <p className="cab-eyebrow">// ИТОГИ</p>
        <h1 className="cab-h1">Отчёт «Было → Стало»</h1>
        <div className="cab-card">
          <div className="cab-empty">
            <Icon name="FileClock" size={34} style={{ marginBottom: 14, opacity: 0.5 }} />
            <br />
            Отчёт станет доступен после завершения входной и итоговой анкет.
            <br />
            {data?.has_entrance ? 'Входная анкета пройдена. ' : 'Входная анкета ещё не пройдена. '}
            {data?.has_final ? 'Итоговая пройдена.' : 'Осталась итоговая.'}
            <br /><br />
            <Link className="cab-btn cab-inline-btn" to="/cabinet">Вернуться в кабинет</Link>
          </div>
        </div>
      </CabinetShell>
    );
  }

  return (
    <CabinetShell>
      <p className="cab-eyebrow">// ИТОГИ ОБУЧЕНИЯ</p>
      <h1 className="cab-h1">Было → Стало</h1>
      <p className="cab-sub">
        {me?.profile?.first_name} {me?.profile?.last_name}
        {data.completed_at && ` · отчёт сформирован ${new Date(data.completed_at).toLocaleDateString('ru-RU')}`}
      </p>

      {error && <div className="cab-error">{error}</div>}

      <div className="cab-card">
        <h2>Сравнение показателей</h2>
        <div className="cab-ba-head">
          <span>Показатель</span><span>Было</span><span>Стало</span>
        </div>
        {data.rows?.map((r) => (
          <div className="cab-ba-row" key={r.label}>
            <span className="cab-ba-label">{r.label}</span>
            <span className="cab-ba-before">{r.before}</span>
            <span className={`cab-ba-after${r.positive ? ' up' : ''}`}>
              {r.after}
              {r.delta && <em>{r.delta}</em>}
            </span>
          </div>
        ))}
      </div>

      <div className="cab-card">
        <h2>Ваша цель</h2>
        <div className="cab-kv">
          <div><span>Что хотели получить</span><b>{data.goal?.text || '—'}</b></div>
          <div><span>Какую задачу решали</span><b>{data.goal?.task || '—'}</b></div>
          <div>
            <span>Цель достигнута</span>
            <b className="cab-accent">{data.goal?.reached || '—'}</b>
          </div>
          <div>
            <span>Задача решена</span>
            <b className="cab-accent">{data.goal?.task_solved || '—'}</b>
          </div>
        </div>
      </div>

      {data.new_tasks && data.new_tasks.length > 0 && (
        <div className="cab-card">
          <h2>Новые направления, которые освоили</h2>
          <div className="cab-chips">
            {data.new_tasks.map((t) => <span className="cab-chip" key={t}>{t}</span>)}
          </div>
        </div>
      )}

      <div className="cab-card">
        <h2>Главный результат</h2>
        <p className="cab-quote">{data.main_result || '—'}</p>
        {data.changes && (
          <>
            <h2 style={{ marginTop: 26 }}>Что изменилось в работе</h2>
            <p className="cab-quote">{data.changes}</p>
          </>
        )}
        {data.next_plans && (
          <>
            <h2 style={{ marginTop: 26 }}>Планы дальше</h2>
            <p className="cab-quote">{data.next_plans}</p>
          </>
        )}
      </div>

      {data.dynamics && data.dynamics.length > 0 && (
        <div className="cab-card">
          <h2>Динамика по периодам</h2>
          <div className="cab-table-wrap">
            <table className="cab-table" style={{ minWidth: 520 }}>
              <thead>
                <tr><th>Период</th><th>Удовлетворённость</th><th>Самооценка</th><th>Применение AI</th></tr>
              </thead>
              <tbody>
                {data.dynamics.map((d, i) => (
                  <tr key={i}>
                    <td>{d.period}</td>
                    <td>{d.satisfaction ?? '—'}{d.satisfaction ? '/10' : ''}</td>
                    <td>{d.self_score ?? '—'}{d.self_score ? '/10' : ''}</td>
                    <td className="cab-muted">{d.applied || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data.satisfaction != null && (
        <div className="cab-card cab-result" style={{ padding: 36 }}>
          <div className="cab-score" style={{ marginBottom: 0 }}>
            <b>{data.satisfaction}/10</b>
            <span>ваша итоговая оценка программы</span>
          </div>
        </div>
      )}

      <div className="cab-survey-actions">
        <button className="cab-btn cab-btn-ghost cab-inline-btn" onClick={() => window.print()}>
          <Icon name="Printer" size={16} /> Сохранить в PDF
        </button>
        <Link className="cab-btn cab-inline-btn" to="/cabinet">Вернуться в кабинет</Link>
      </div>
    </CabinetShell>
  );
};

export default Report;
