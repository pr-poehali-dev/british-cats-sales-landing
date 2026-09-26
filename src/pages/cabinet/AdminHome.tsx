import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CabinetShell from '@/components/cabinet/CabinetShell';

import { api } from '@/lib/cabinet-api';

interface ByType {
  type: string;
  completed: number;
  assigned: number;
  avg_score: string | null;
}

const AdminHome = () => {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setData(await api.adminAnalytics());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const byType = (data?.by_type || {}) as Record<string, ByType>;
  const csat = (data?.csat || {}) as { avg_csat: string | null; n: number };
  const entr = byType.entrance;
  const fin = byType.final;

  const pct = (v: ByType | undefined) =>
    v && v.assigned ? `${Math.round((v.completed / v.assigned) * 100)}%` : '—';

  const score = (v: ByType | undefined) =>
    v && v.avg_score !== null && v.avg_score !== undefined ? `${Math.round(Number(v.avg_score))}%` : '—';

  return (
    <CabinetShell>
      <p className="cab-eyebrow">// АДМИНИСТРИРОВАНИЕ</p>
      <h1 className="cab-h1">Обзор</h1>
      <p className="cab-sub">Общая картина по доступам, анкетам и результатам обучения.</p>

      {loading ? (
        <div className="cab-loading">ЗАГРУЗКА…</div>
      ) : (
        <>
          <div className="cab-stats">
            <div className="cab-stat"><b>{String(data?.total_codes ?? 0)}</b><span>выдано кодов</span></div>
            <div className="cab-stat"><b>{String(data?.activated ?? 0)}</b><span>активировано</span></div>
            <div className="cab-stat"><b>{String(data?.profiles ?? 0)}</b><span>профилей создано</span></div>
            <div className="cab-stat"><b>{pct(entr)}</b><span>прошли входную анкету</span></div>
            <div className="cab-stat"><b>{score(entr)}</b><span>средний входной тест</span></div>
            <div className="cab-stat"><b>{score(fin)}</b><span>средний итоговый тест</span></div>
            <div className="cab-stat">
              <b>{csat.avg_csat ? Number(csat.avg_csat).toFixed(1) : '—'}</b>
              <span>средняя удовлетворённость{csat.n ? ` (${csat.n} ответов)` : ''}</span>
            </div>
            <div className="cab-stat"><b>{pct(fin)}</b><span>прошли итоговую анкету</span></div>
          </div>

          <div className="cab-card">
            <h2>Быстрые действия</h2>
            <div className="cab-row-actions">
              <Link className="cab-btn cab-btn-sm" to="/cabinet/admin/codes">Выдать код ученику</Link>
              <Link className="cab-btn cab-btn-ghost cab-btn-sm" to="/cabinet/admin/surveys">Открыть анкету</Link>
              <Link className="cab-btn cab-btn-ghost cab-btn-sm" to="/cabinet/admin/students">Смотреть учеников</Link>
            </div>
          </div>
        </>
      )}
    </CabinetShell>
  );
};

export default AdminHome;
