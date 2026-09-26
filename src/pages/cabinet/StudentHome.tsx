import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CabinetShell from '@/components/cabinet/CabinetShell';
import Icon from '@/components/ui/icon';
import { api, type Assignment, type StudentDashboard } from '@/lib/cabinet-api';

const TYPE_LABEL: Record<string, string> = {
  entrance: 'Стартовая точка обучения',
  checkpoint: 'Срез в процессе обучения',
  final: 'Итоги обучения',
};

const StudentHome = () => {
  const [data, setData] = useState<StudentDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setData(await api.dashboard());
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const card = (a: Assignment) => {
    const completed = a.status === 'completed';
    const started = a.answered > 0 && !completed;
    const pct = a.total_questions ? Math.round((a.answered / a.total_questions) * 100) : 0;

    return (
      <div className="cab-card" key={a.assignment_id}>
        <div className="cab-task">
          <div className="cab-task-info">
            <h2>{a.title}{a.period ? ` · ${a.period}` : ''}</h2>
            <div className="cab-task-meta">
              {completed ? (
                <>
                  <span className="cab-badge green">ЗАВЕРШЕНА</span>
                  {a.score !== null && <> · результат теста {Number(a.score)}%</>}
                </>
              ) : started ? (
                <>
                  <span className="cab-badge cyan">НАЧАТА</span> · заполнено {a.answered} из {a.total_questions} вопросов
                  <div className="cab-mini-bar"><i style={{ width: `${pct}%` }} /></div>
                </>
              ) : (
                <>
                  <span className="cab-badge cyan">ДОСТУПНА</span> · {TYPE_LABEL[a.type]}, {a.total_questions} вопросов
                </>
              )}
            </div>
          </div>
          <button
            className={`cab-btn cab-inline-btn${completed ? ' cab-btn-ghost' : ''}`}
            onClick={() => nav(`/cabinet/survey/${a.assignment_id}`)}
          >
            <Icon name={completed ? 'Eye' : started ? 'Play' : 'ArrowRight'} size={16} />
            {completed ? 'Посмотреть результат' : started ? 'Продолжить' : 'Начать'}
          </button>
        </div>
      </div>
    );
  };

  if (loading) return <CabinetShell><div className="cab-loading">ЗАГРУЗКА…</div></CabinetShell>;

  return (
    <CabinetShell>
      <p className="cab-eyebrow">// ЛИЧНЫЙ КАБИНЕТ</p>
      <h1 className="cab-h1">Здравствуйте, {data?.profile.first_name}!</h1>
      <p className="cab-sub">
        {data?.group_name ? `Группа: ${data.group_name}. ` : ''}
        {data?.period ? `Период: ${data.period}. ` : ''}
        Проходите анкеты по мере их открытия — так мы увидим вашу динамику от старта до финала.
      </p>

      {error && <div className="cab-error">{error}</div>}

      {!data?.assignments.length ? (
        <div className="cab-card">
          <div className="cab-empty">
            Пока нет доступных анкет. Как только школа откроет анкету, она появится здесь.
          </div>
        </div>
      ) : (
        data.assignments.map(card)
      )}
    </CabinetShell>
  );
};

export default StudentHome;
