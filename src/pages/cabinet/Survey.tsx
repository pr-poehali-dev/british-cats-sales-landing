import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CabinetShell from '@/components/cabinet/CabinetShell';
import Icon from '@/components/ui/icon';
import { api, type Answers, type Question, type SurveyData } from '@/lib/cabinet-api';

const isAnswered = (v: unknown) => {
  if (v === undefined || v === null || v === '') return false;
  if (Array.isArray(v)) return v.length > 0;
  return true;
};

const visible = (q: Question, answers: Answers) => {
  const c = q.conditional_logic_json;
  if (!c) return true;
  const dep = answers[c.depends_on];
  if (c.not_equals !== undefined) return dep !== undefined && dep !== c.not_equals;
  if (c.in) return typeof dep === 'string' && c.in.includes(dep);
  return true;
};

const Survey = () => {
  const { assignmentId } = useParams();
  const aid = Number(assignmentId);
  const nav = useNavigate();

  const [data, setData] = useState<SurveyData | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [review, setReview] = useState(false);
  const [done, setDone] = useState<{ score: number | null; correct: number | null; total: number | null } | null>(null);
  const submitting = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const d = await api.getSurvey(aid);
        setData(d);
        setAnswers(d.response.answers || {});
        if (d.response.status === 'completed') {
          setDone({
            score: d.response.score ? Number(d.response.score) : null,
            correct: d.response.test_correct,
            total: d.response.test_total,
          });
        } else {
          setStep(Math.min(d.response.current_question || 0, d.questions.length - 1));
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Не удалось загрузить анкету');
      } finally {
        setLoading(false);
      }
    })();
  }, [aid]);

  const shown = useMemo(
    () => (data ? data.questions.filter((q) => visible(q, answers)) : []),
    [data, answers],
  );

  const q = shown[step];

  const save = useCallback(async (code: string, value: unknown, idx: number) => {
    setSaving('saving');
    try {
      await api.saveAnswer({ assignment_id: aid, question_code: code, value, current_question: idx });
      setSaving('saved');
    } catch {
      setSaving('error');
    }
  }, [aid]);

  const setAnswer = (code: string, value: unknown) => {
    setAnswers((a) => ({ ...a, [code]: value }));
    save(code, value, step);
  };

  const next = () => {
    if (step < shown.length - 1) setStep(step + 1);
    else setReview(true);
  };

  const finish = async () => {
    if (submitting.current) return;
    submitting.current = true;
    setError('');
    try {
      const res = await api.completeSurvey(aid);
      setDone({ score: res.score ?? null, correct: res.test_correct, total: res.test_total });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось завершить');
      submitting.current = false;
    }
  };

  if (loading) return <CabinetShell><div className="cab-loading">ЗАГРУЗКА…</div></CabinetShell>;
  if (error && !data) return <CabinetShell><div className="cab-error">{error}</div></CabinetShell>;
  if (!data) return null;

  if (done) {
    return (
      <CabinetShell>
        <div className="cab-card cab-result">
          <div className="cab-result-icon"><Icon name="CircleCheck" size={44} /></div>
          <h1 className="cab-h1">Анкета завершена</h1>
          <p className="cab-sub">Ответы сохранены. Спасибо!</p>
          {done.total ? (
            <div className="cab-score">
              <b>{done.score}%</b>
              <span>правильных ответов в тесте — {done.correct} из {done.total}</span>
            </div>
          ) : null}
          <button className="cab-btn cab-inline-btn" onClick={() => nav('/cabinet')}>
            Вернуться в кабинет
          </button>
        </div>
      </CabinetShell>
    );
  }

  if (review) {
    const missing = shown.filter((x) => x.is_required && !isAnswered(answers[x.question_code]));
    return (
      <CabinetShell>
        <p className="cab-eyebrow">// {data.assignment.title}</p>
        <h1 className="cab-h1">Проверьте ответы</h1>
        <p className="cab-sub">После отправки изменить ответы будет нельзя.</p>
        {error && <div className="cab-error">{error}</div>}

        <div className="cab-card">
          {shown.map((x, i) => {
            const v = answers[x.question_code];
            const empty = !isAnswered(v);
            return (
              <div className="cab-review-row" key={x.question_code}>
                <div>
                  <span className="cab-muted" style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{i + 1}.</span> {x.text}
                  <div className={empty ? 'cab-review-empty' : 'cab-review-val'}>
                    {empty ? (x.is_required ? 'Не заполнено — обязательный вопрос' : 'Пропущено') : (Array.isArray(v) ? v.join(', ') : String(v))}
                  </div>
                </div>
                <button className="cab-btn cab-btn-ghost cab-btn-sm" onClick={() => { setReview(false); setStep(i); }}>
                  Изменить
                </button>
              </div>
            );
          })}
        </div>

        <div className="cab-survey-actions">
          <button className="cab-btn cab-btn-ghost cab-inline-btn" onClick={() => { setReview(false); setStep(shown.length - 1); }}>
            ← Назад
          </button>
          <button className="cab-btn cab-inline-btn" onClick={finish} disabled={missing.length > 0}>
            {missing.length > 0 ? `Осталось заполнить: ${missing.length}` : 'Завершить анкету'}
          </button>
        </div>
      </CabinetShell>
    );
  }

  const value = answers[q.question_code];
  const canNext = !q.is_required || isAnswered(value);
  const opts = Array.isArray(q.options_json) ? q.options_json : [];
  const scale = !Array.isArray(q.options_json) && q.options_json ? q.options_json : { min: 1, max: 10 };

  const toggleMulti = (o: string) => {
    const cur = Array.isArray(value) ? [...(value as string[])] : [];
    const i = cur.indexOf(o);
    if (i >= 0) cur.splice(i, 1);
    else {
      if (q.max_choices && cur.length >= q.max_choices) return;
      cur.push(o);
    }
    setAnswer(q.question_code, cur);
  };

  return (
    <CabinetShell>
      <p className="cab-eyebrow">// {data.assignment.title}</p>

      <div className="cab-progress">
        <div className="cab-progress-head">
          <span>Вопрос {step + 1} из {shown.length}</span>
          <span className={`cab-save cab-save-${saving}`}>
            {saving === 'saving' && 'Сохраняем…'}
            {saving === 'saved' && 'Сохранено'}
            {saving === 'error' && 'Не удалось сохранить'}
          </span>
        </div>
        <div className="cab-progress-bar">
          <i style={{ width: `${((step + 1) / shown.length) * 100}%` }} />
        </div>
      </div>

      <div className="cab-card cab-question">
        <h2>{q.text}</h2>
        {q.hint && <p className="cab-qhint">{q.hint}</p>}

        {(q.type === 'SINGLE_CHOICE' || q.type === 'TEST_SINGLE_CHOICE') && (
          <div className="cab-options">
            {opts.map((o) => (
              <button
                key={o}
                type="button"
                className={`cab-option${value === o ? ' sel' : ''}`}
                onClick={() => setAnswer(q.question_code, o)}
              >
                <i /><span>{o}</span>
              </button>
            ))}
          </div>
        )}

        {q.type === 'MULTIPLE_CHOICE' && (
          <>
            {q.max_choices && (
              <p className="cab-qhint">
                Выбрано {(Array.isArray(value) ? value.length : 0)} из {q.max_choices}
              </p>
            )}
            <div className="cab-options">
              {opts.map((o) => {
                const sel = Array.isArray(value) && (value as string[]).includes(o);
                return (
                  <button
                    key={o}
                    type="button"
                    className={`cab-option box${sel ? ' sel' : ''}`}
                    onClick={() => toggleMulti(o)}
                  >
                    <i /><span>{o}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {q.type === 'SCALE' && (
          <div className="cab-scale">
            {Array.from({ length: (scale as { max: number }).max - (scale as { min: number }).min + 1 }, (_, i) => i + (scale as { min: number }).min).map((n) => (
              <button
                key={n}
                type="button"
                className={`cab-scale-btn${value === n ? ' sel' : ''}`}
                onClick={() => setAnswer(q.question_code, n)}
              >
                {n}
              </button>
            ))}
          </div>
        )}

        {q.type === 'LONG_TEXT' && (
          <textarea
            className="cab-input"
            rows={6}
            value={(value as string) || ''}
            onChange={(e) => setAnswers((a) => ({ ...a, [q.question_code]: e.target.value }))}
            onBlur={(e) => save(q.question_code, e.target.value, step)}
            placeholder="Ваш ответ"
          />
        )}

        {q.type === 'SHORT_TEXT' && (
          <input
            className="cab-input"
            value={(value as string) || ''}
            onChange={(e) => setAnswers((a) => ({ ...a, [q.question_code]: e.target.value }))}
            onBlur={(e) => save(q.question_code, e.target.value, step)}
          />
        )}

        {!q.is_required && <p className="cab-optional">Необязательный вопрос — можно пропустить</p>}
      </div>

      <div className="cab-survey-actions">
        <button
          className="cab-btn cab-btn-ghost cab-inline-btn"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          ← Назад
        </button>
        <button className="cab-btn cab-inline-btn" onClick={next} disabled={!canNext}>
          {step === shown.length - 1 ? 'К проверке ответов' : 'Продолжить →'}
        </button>
      </div>
    </CabinetShell>
  );
};

export default Survey;