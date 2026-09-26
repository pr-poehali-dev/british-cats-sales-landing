import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CabinetShell from '@/components/cabinet/CabinetShell';
import Icon from '@/components/ui/icon';
import { api, type ProgressItem } from '@/lib/cabinet-api';

const fmt = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long' });

const Bars = ({ label, data, max, suffix = '' }: {
  label: string;
  data: { name: string; value: number | null }[];
  max: number;
  suffix?: string;
}) => {
  const points = data.filter((d) => d.value !== null);
  if (points.length < 1) return null;
  const first = points[0].value as number;
  const last = points[points.length - 1].value as number;
  const diff = last - first;

  return (
    <div className="cab-card">
      <div className="cab-dyn-head">
        <h2>{label}</h2>
        {points.length >= 2 && (
          <span className={`cab-badge ${diff > 0 ? 'green' : diff < 0 ? 'red' : 'gray'}`}>
            {diff > 0 ? '+' : ''}{diff}{suffix === '%' ? ' п.п.' : ''}
          </span>
        )}
      </div>
      <div className="cab-bars">
        {data.map((d, i) => (
          <div className="cab-bar-col" key={i}>
            <div className="cab-bar-track">
              <div
                className="cab-bar-fill"
                style={{ height: d.value !== null ? `${Math.max(4, (d.value / max) * 100)}%` : '0%' }}
              >
                {d.value !== null && <b>{d.value}{suffix}</b>}
              </div>
            </div>
            <span>{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Progress = () => {
  const [items, setItems] = useState<ProgressItem[]>([]);
  const [enough, setEnough] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const d = await api.progress();
        setItems(d.items);
        setEnough(d.has_enough);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <CabinetShell><div className="cab-loading">ЗАГРУЗКА…</div></CabinetShell>;

  const label = (it: ProgressItem) =>
    it.type === 'entrance' ? 'Старт' : it.type === 'final' ? 'Финал' : (it.period || fmt(it.completed_at));

  const tests = items.filter((i) => i.score !== null).map((i) => ({ name: label(i), value: i.score }));
  const selfs = items.filter((i) => i.self_score != null).map((i) => ({ name: label(i), value: Number(i.self_score) }));
  const sats = items.filter((i) => i.satisfaction != null).map((i) => ({ name: label(i), value: Number(i.satisfaction) }));

  const hasFinal = items.some((i) => i.type === 'final');

  return (
    <CabinetShell>
      <p className="cab-eyebrow">// ДИНАМИКА</p>
      <h1 className="cab-h1">Моя динамика</h1>
      <p className="cab-sub">
        Как меняются ваши результаты от анкеты к анкете. Данные берутся только из завершённых анкет.
      </p>

      {error && <div className="cab-error">{error}</div>}

      {!enough ? (
        <div className="cab-card">
          <div className="cab-empty">
            <Icon name="ChartLine" size={34} style={{ marginBottom: 14, opacity: 0.5 }} />
            <br />
            Недостаточно данных для динамики.
            <br />
            Она появится после того, как вы завершите минимум две анкеты.
          </div>
        </div>
      ) : (
        <>
          <Bars label="Результат теста" data={tests} max={100} suffix="%" />
          <Bars label="Самооценка навыков работы с AI" data={selfs} max={10} />
          {sats.length > 0 && <Bars label="Удовлетворённость обучением" data={sats} max={10} />}

          <div className="cab-card">
            <h2>Применение AI по периодам</h2>
            <div className="cab-kv">
              {items.map((i, n) => (
                <div key={n}>
                  <span>{label(i)}</span>
                  <b>{i.applied || i.ai_frequency || '—'}</b>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {hasFinal && (
        <div className="cab-card cab-cta-card">
          <div>
            <h2>Отчёт «Было → Стало» готов</h2>
            <p className="cab-task-meta">Полное сравнение стартовых и итоговых показателей.</p>
          </div>
          <Link className="cab-btn cab-inline-btn" to="/cabinet/report">Открыть отчёт</Link>
        </div>
      )}
    </CabinetShell>
  );
};

export default Progress;
