import { useCallback, useEffect, useState } from 'react';
import CabinetShell from '@/components/cabinet/CabinetShell';
import { api, type AdminSurvey } from '@/lib/cabinet-api';

const TYPE_LABEL: Record<string, string> = {
  entrance: 'Входная',
  checkpoint: 'Промежуточная',
  final: 'Итоговая',
};

const STATUS: Record<string, { text: string; cls: string }> = {
  draft: { text: 'ЗАКРЫТА', cls: 'gray' },
  available: { text: 'ОТКРЫТА', cls: 'green' },
  closed: { text: 'ЗАВЕРШЕНА', cls: 'red' },
};

const AdminSurveys = () => {
  const [surveys, setSurveys] = useState<AdminSurvey[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const d = await api.adminSurveys();
      setSurveys(d.surveys);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const change = async (id: number, status: 'draft' | 'available' | 'closed') => {
    setBusy(true);
    setError('');
    try {
      await api.setSurveyStatus(id, status);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка');
    } finally {
      setBusy(false);
    }
  };

  return (
    <CabinetShell>
      <p className="cab-eyebrow">// АДМИНИСТРИРОВАНИЕ</p>
      <h1 className="cab-h1">Анкеты</h1>
      <p className="cab-sub">
        Открывайте анкету, когда она нужна — она сразу появится у всех учеников с созданным профилем.
        Промежуточную анкету можно открывать в любой момент обучения.
      </p>

      {error && <div className="cab-error">{error}</div>}

      {loading ? (
        <div className="cab-loading">ЗАГРУЗКА…</div>
      ) : (
        surveys.map((s) => {
          const st = STATUS[s.status];
          return (
            <div className="cab-card" key={s.id}>
              <div className="cab-task">
                <div className="cab-task-info">
                  <h2>{s.title}{s.period ? ` · ${s.period}` : ''}</h2>
                  <div className="cab-task-meta">
                    <span className={`cab-badge ${st.cls}`}>{st.text}</span>
                    {' · '}{TYPE_LABEL[s.type]}{' · '}{s.questions_count} вопросов
                    {' · '}завершили {s.completed} из {s.assigned}
                  </div>
                </div>
                <div className="cab-row-actions">
                  {s.status !== 'available' && (
                    <button className="cab-btn cab-btn-sm" disabled={busy} onClick={() => change(s.id, 'available')}>
                      Открыть ученикам
                    </button>
                  )}
                  {s.status === 'available' && (
                    <button className="cab-btn cab-btn-ghost cab-btn-sm" disabled={busy} onClick={() => change(s.id, 'closed')}>
                      Закрыть приём
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </CabinetShell>
  );
};

export default AdminSurveys;
