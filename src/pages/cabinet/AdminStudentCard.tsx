import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CabinetShell from '@/components/cabinet/CabinetShell';
import { api } from '@/lib/cabinet-api';

interface Row {
  questionnaire_id: number;
  title: string;
  type: string;
  period: string | null;
  status: string;
  answers_json: Record<string, unknown> | null;
  score: string | null;
  test_correct: number | null;
  test_total: number | null;
  completed_at: string | null;
}

interface Q {
  questionnaire_id: number;
  question_code: string;
  text: string;
  type: string;
  position: number;
}

const val = (v: unknown) => (Array.isArray(v) ? v.join(', ') : v === undefined || v === null || v === '' ? '—' : String(v));

const AdminStudentCard = () => {
  const { studentId } = useParams();
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [questions, setQuestions] = useState<Q[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const d = await api.adminStudent(Number(studentId));
        setProfile(d.profile);
        setRows(d.responses as unknown as Row[]);
        setQuestions(d.questions as unknown as Q[]);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    })();
  }, [studentId]);

  if (loading) return <CabinetShell><div className="cab-loading">ЗАГРУЗКА…</div></CabinetShell>;
  if (error) return <CabinetShell><div className="cab-error">{error}</div></CabinetShell>;

  const p = profile as Record<string, string> | null;
  const entrance = rows.find((r) => r.type === 'entrance' && r.score !== null);
  const final = rows.find((r) => r.type === 'final' && r.score !== null);
  const diff = entrance && final ? Number(final.score) - Number(entrance.score) : null;

  return (
    <CabinetShell>
      <p className="cab-eyebrow">// КАРТОЧКА УЧЕНИКА</p>
      <h1 className="cab-h1">{p?.first_name} {p?.last_name}</h1>
      <p className="cab-sub">
        {p?.email} · {p?.phone}
        {p?.group_name ? ` · группа: ${p.group_name}` : ''}
      </p>

      <Link className="cab-btn cab-btn-ghost cab-btn-sm" to="/cabinet/admin/students" style={{ marginBottom: 22, display: 'inline-flex' }}>
        ← К списку
      </Link>

      <div className="cab-stats">
        <div className="cab-stat"><b>{entrance ? `${Number(entrance.score)}%` : '—'}</b><span>входной тест</span></div>
        <div className="cab-stat"><b>{final ? `${Number(final.score)}%` : '—'}</b><span>итоговый тест</span></div>
        <div className="cab-stat">
          <b>{diff !== null ? `${diff > 0 ? '+' : ''}${diff.toFixed(0)}` : '—'}</b>
          <span>изменение, п.п.</span>
        </div>
        <div className="cab-stat">
          <b>{rows.filter((r) => r.status === 'completed').length}</b>
          <span>анкет завершено</span>
        </div>
      </div>

      <div className="cab-card">
        <h2>Профиль</h2>
        <div className="cab-kv">
          <div><span>Город</span><b>{p?.city || '—'}</b></div>
          <div><span>Сфера деятельности</span><b>{p?.industry || '—'}</b></div>
          <div><span>Профессия</span><b>{p?.profession || '—'}</b></div>
          <div><span>Формат занятости</span><b>{p?.employment_type || '—'}</b></div>
        </div>
      </div>

      {rows.map((r) => {
        const qs = questions.filter((q) => q.questionnaire_id === r.questionnaire_id);
        return (
          <div className="cab-card" key={r.questionnaire_id}>
            <h2>{r.title}{r.period ? ` · ${r.period}` : ''}</h2>
            <p className="cab-task-meta" style={{ marginBottom: 18 }}>
              {r.status === 'completed' ? (
                <>
                  <span className="cab-badge green">ЗАВЕРШЕНА</span>
                  {r.score !== null && <> · тест {Number(r.score)}% ({r.test_correct}/{r.test_total})</>}
                </>
              ) : (
                <span className="cab-badge gray">{r.status === 'in_progress' ? 'В ПРОЦЕССЕ' : 'НЕ НАЧАТА'}</span>
              )}
            </p>
            {r.answers_json && Object.keys(r.answers_json).length > 0 ? (
              <div className="cab-kv">
                {qs.map((q) => (
                  <div key={q.question_code}>
                    <span>{q.text}</span>
                    <b>{val(r.answers_json?.[q.question_code])}</b>
                  </div>
                ))}
              </div>
            ) : (
              <p className="cab-muted">Ответов пока нет.</p>
            )}
          </div>
        );
      })}
    </CabinetShell>
  );
};

export default AdminStudentCard;
