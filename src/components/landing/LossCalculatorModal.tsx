import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Icon from '@/components/ui/icon';
import { scrollToSection } from '@/lib/scroll';

interface Project {
  id: string;
  name: string;
  diyHours: number;
  hire: number;
  aiCost: number;
  aiHours: number;
}

const PROJECTS: Project[] = [
  { id: 'site', name: 'Сайт / лендинг', diyHours: 60, hire: 45000, aiCost: 2500, aiHours: 4 },
  { id: 'video', name: 'Рекламный ролик', diyHours: 30, hire: 35000, aiCost: 2000, aiHours: 3 },
  { id: 'content', name: 'Контент-план на месяц', diyHours: 20, hire: 25000, aiCost: 800, aiHours: 2 },
  { id: 'brand', name: 'Логотип + фирменный стиль', diyHours: 25, hire: 30000, aiCost: 1500, aiHours: 2 },
  { id: 'bot', name: 'Бот + воронка продаж', diyHours: 50, hire: 60000, aiCost: 3000, aiHours: 5 },
  { id: 'deck', name: 'Презентация для продаж', diyHours: 12, hire: 15000, aiCost: 600, aiHours: 1 },
];

const PRESETS: Record<string, { rate: number; routine: number; count: number; sel: string[] }> = {
  freelance: { rate: 900, routine: 20, count: 8, sel: ['content', 'video', 'deck'] },
  service: { rate: 1500, routine: 15, count: 6, sel: ['site', 'bot', 'content'] },
  ecom: { rate: 1200, routine: 12, count: 10, sel: ['content', 'deck', 'video'] },
};

const COURSE_FEE = 150000;
const SUBS_YEAR = 60000;
const ROUTINE_AI_KEEP = 0.3;

const fmtMoney = (v: number) => `${Math.round(v).toLocaleString('ru-RU')} ₽`;
const fmtMoneyShort = (v: number) => {
  const abs = Math.abs(v);
  if (abs >= 1000000) return `${(v / 1000000).toLocaleString('ru-RU', { maximumFractionDigits: 1 })} млн ₽`;
  if (abs >= 10000) return `${Math.round(v / 1000)} тыс ₽`;
  return fmtMoney(v);
};

const useTween = (target: number, formatter: (v: number) => string) => {
  const [text, setText] = useState(formatter(0));
  const curRef = useRef(0);
  const rafRef = useRef(0);
  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    const from = curRef.current;
    const t0 = performance.now();
    const dur = 550;
    const frame = (now: number) => {
      const pr = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - pr, 3);
      curRef.current = from + (target - from) * eased;
      setText(formatter(curRef.current));
      if (pr < 1) rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  return text;
};

interface LossCalculatorModalProps {
  open: boolean;
  onClose: () => void;
}

const LossCalculatorModal = ({ open, onClose }: LossCalculatorModalProps) => {
  const [rate, setRate] = useState(1500);
  const [routine, setRoutine] = useState(12);
  const [count, setCount] = useState(4);
  const [selected, setSelected] = useState<Record<string, boolean>>({ site: true, video: true, content: true });

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const toggleProject = (id: string) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id]; else next[id] = true;
      return next;
    });
  };

  const applyPreset = (key: string) => {
    const pr = PRESETS[key];
    if (!pr) return;
    setRate(pr.rate);
    setRoutine(pr.routine);
    setCount(pr.count);
    const sel: Record<string, boolean> = {};
    pr.sel.forEach((id) => { sel[id] = true; });
    setSelected(sel);
  };

  const calc = useMemo(() => {
    const picked = PROJECTS.filter((p) => selected[p.id]);
    let diyHours = 0, diyCost = 0, hireCost = 0, aiToolCost = 0, aiHours = 0;
    picked.forEach((p) => {
      diyHours += p.diyHours * count;
      diyCost += p.diyHours * count * rate;
      hireCost += p.hire * count;
      aiToolCost += p.aiCost * count;
      aiHours += p.aiHours * count;
    });
    const aiFull = aiToolCost + COURSE_FEE + SUBS_YEAR;
    const routineManual = routine * 52 * rate;
    const routineAI = routineManual * ROUTINE_AI_KEEP;
    const baseline = picked.length ? Math.min(diyCost, hireCost) : 0;
    const projectLoss = Math.max(baseline - aiFull, 0);
    const routineLoss = Math.max(routineManual - routineAI, 0);
    const totalLoss = Math.max(projectLoss + routineLoss, 0);
    const maxVal = Math.max(diyCost, hireCost, aiFull, 1);
    const monthsEq = rate > 0 ? totalLoss / (rate * 160) : 0;
    const hoursFreed = Math.max((diyHours - aiHours) + Math.round(routine * 52 * (1 - ROUTINE_AI_KEEP)), 0);
    const savingMonthly = totalLoss / 12;
    const payback = savingMonthly > 0 ? (COURSE_FEE + SUBS_YEAR) / savingMonthly : 0;

    return {
      picked, diyHours, diyCost, hireCost, aiFull, aiHours, maxVal, totalLoss, monthsEq,
      baseline, routineManual, hoursFreed, payback,
    };
  }, [rate, routine, count, selected]);

  const diySumText = useTween(calc.diyCost, fmtMoneyShort);
  const hireSumText = useTween(calc.hireCost, fmtMoneyShort);
  const aiSumText = useTween(calc.aiFull, fmtMoneyShort);
  const lossText = useTween(calc.totalLoss, fmtMoney);
  const threeYearText = useTween(calc.totalLoss * 3, fmtMoneyShort);

  if (!open) return null;

  const breakdownRows = [
    { key: 'base', cls: 'lc-plus', label: 'Переплата за проекты (найм/ваше время)', val: calc.baseline, show: calc.picked.length > 0 },
    { key: 'routine', cls: 'lc-plus', label: 'Рутина, которую ИИ закрыл бы на 70%', val: Math.round(calc.routineManual * (1 - ROUTINE_AI_KEEP)), show: true },
    { key: 'invest', cls: 'lc-minus', label: 'Инвестиция в ИИ (курс + подписки)', val: -COURSE_FEE - SUBS_YEAR, show: true },
  ];

  const content = (
    <div className="lc-overlay" role="dialog" aria-modal="true">
      <div className="lc-scroll">
        <div className="lc-wrap">
          <button type="button" className="lc-close" onClick={onClose} aria-label="Закрыть">
            <Icon name="X" size={22} />
          </button>

          <div className="lc-hero">
            <span className="lc-label">// КАЛЬКУЛЯТОР ПОТЕРЬ</span>
            <h1>Сколько вы теряете, <em>не внедряя ИИ</em></h1>
            <p>Сравните стоимость проекта <b>своими силами</b>, <b>на найме специалистов</b> и <b>с помощью нейросетей</b> — и узнайте, сколько денег сгорает каждый год, пока вы откладываете обучение.</p>
            <div className="lc-presets">
              <button className="lc-preset" onClick={() => applyPreset('freelance')}>Я фрилансер</button>
              <button className="lc-preset" onClick={() => applyPreset('service')}>Бизнес услуг</button>
              <button className="lc-preset" onClick={() => applyPreset('ecom')}>Онлайн-продажи</button>
            </div>
          </div>

          <div className="lc-grid">
            <div className="lc-col">
              <div className="lc-panel">
                <span className="lc-panel-title">// ШАГ 01 · ВАШЕ ВРЕМЯ</span>
                <div className="lc-panel-head"><h3>Сколько стоит ваш час и рутина</h3></div>

                <div className="lc-sld-row">
                  <div className="lc-sld-lbl"><b>Стоимость вашего часа работы</b><span className="lc-sld-val">{rate.toLocaleString('ru-RU')} ₽/ч</span></div>
                  <input type="range" min={300} max={10000} step={100} value={rate} onChange={(e) => setRate(+e.target.value)} />
                  <div className="lc-sld-hint">СКОЛЬКО ВЫ ЗАРАБАТЫВАЕТЕ В ЧАС ИЛИ МОГЛИ БЫ ПОТРАТИТЬ НА РАЗВИТИЕ</div>
                </div>

                <div className="lc-sld-row" style={{ marginBottom: 0 }}>
                  <div className="lc-sld-lbl"><b>Часов рутины в неделю</b><span className="lc-sld-val">{routine} ч/нед</span></div>
                  <input type="range" min={0} max={60} step={1} value={routine} onChange={(e) => setRoutine(+e.target.value)} />
                  <div className="lc-sld-hint">КОНТЕНТ, ОТВЕТЫ, ВИЗУАЛ, ОТЧЁТЫ, ПОСТЫ, ПРЕЗЕНТАЦИИ — ВСЁ, ЧТО ИИ БЕРЁТ НА СЕБЯ НА 70%</div>
                </div>
              </div>

              <div className="lc-panel">
                <span className="lc-panel-title">// ШАГ 02 · ПРОЕКТЫ</span>
                <div className="lc-panel-head"><h3>Какие задачи вы делаете или планируете</h3></div>
                <div className="lc-proj-grid">
                  {PROJECTS.map((p) => (
                    <div
                      key={p.id}
                      className={`lc-proj-card${selected[p.id] ? ' sel' : ''}`}
                      onClick={() => toggleProject(p.id)}
                    >
                      <div className="lc-proj-check"><Icon name="Check" size={13} /></div>
                      <div className="lc-proj-name">{p.name}</div>
                      <div className="lc-proj-meta">
                        <span><b>Сам:</b> {p.diyHours} ч вашего времени</span>
                        <span><b>Найм:</b> {p.hire.toLocaleString('ru-RU')} ₽</span>
                        <span className="lc-pm-ai"><b>ИИ:</b> {p.aiCost.toLocaleString('ru-RU')} ₽ + {p.aiHours} ч</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="lc-sld-row" style={{ marginTop: 24, marginBottom: 0 }}>
                  <div className="lc-sld-lbl"><b>Таких проектов в год</b><span className="lc-sld-val">{count} шт/год</span></div>
                  <input type="range" min={1} max={24} step={1} value={count} onChange={(e) => setCount(+e.target.value)} />
                  <div className="lc-sld-hint">СУММАРНО ПО ВСЕМ ВЫБРАННЫМ ТИПАМ ЗАДАЧ: САЙТЫ, РОЛИКИ, КОНТЕНТ-ПЛАНЫ И Т.Д.</div>
                </div>
              </div>
            </div>

            <div className="lc-results">
              <div className="lc-res-panel">
                <span className="lc-panel-title">// РЕЗУЛЬТАТ · СРАВНЕНИЕ</span>
                <div className="lc-panel-head"><h3>Стоимость проектов за год</h3></div>

                <div className="lc-cmp-row lc-f-diy">
                  <div className="lc-cmp-top">
                    <span className="lc-cmp-name">ДЕЛАТЬ САМОМУ {calc.picked.length ? <span className="lc-hrs">· {calc.diyHours.toLocaleString('ru-RU')} ч/год</span> : null}</span>
                    <span className="lc-cmp-sum">{diySumText}</span>
                  </div>
                  <div className="lc-cmp-bar"><div className="lc-cmp-fill" style={{ width: `${(calc.diyCost / calc.maxVal) * 100}%` }} /></div>
                </div>
                <div className="lc-cmp-row lc-f-hire">
                  <div className="lc-cmp-top">
                    <span className="lc-cmp-name">НАНИМАТЬ СПЕЦИАЛИСТОВ</span>
                    <span className="lc-cmp-sum">{hireSumText}</span>
                  </div>
                  <div className="lc-cmp-bar"><div className="lc-cmp-fill" style={{ width: `${(calc.hireCost / calc.maxVal) * 100}%` }} /></div>
                </div>
                <div className="lc-cmp-row lc-f-ai" style={{ marginBottom: 0 }}>
                  <div className="lc-cmp-top">
                    <span className="lc-cmp-name">С ПОМОЩЬЮ ИИ {calc.picked.length ? <span className="lc-hrs">· {calc.aiHours.toLocaleString('ru-RU')} ч/год</span> : null}</span>
                    <span className="lc-cmp-sum">{aiSumText}</span>
                  </div>
                  <div className="lc-cmp-bar"><div className="lc-cmp-fill" style={{ width: `${(calc.aiFull / calc.maxVal) * 100}%` }} /></div>
                </div>
              </div>

              <div className="lc-loss-box">
                <div className="lc-loss-title"><span className="lc-dot" /> ВАШИ ПОТЕРИ ЗА ГОД БЕЗ ИИ</div>
                <div className="lc-loss-num">{lossText}</div>
                <div className="lc-loss-sub">
                  {calc.picked.length
                    ? `≈ ${calc.monthsEq.toLocaleString('ru-RU', { maximumFractionDigits: 1 })} МЕСЯЦЕВ ВАШЕЙ РАБОТЫ, СГОРЕВШИХ ВПУСТУЮ`
                    : 'ВЫБЕРИТЕ ХОТЯ БЫ ОДИН ПРОЕКТ, ЧТОБЫ УВИДЕТЬ ПОЛНУЮ КАРТИНУ'}
                </div>
                <div className="lc-breakdown">
                  {breakdownRows.filter((r) => r.show && !(r.val === 0 && r.cls === 'lc-plus')).map((r) => (
                    <div key={r.key} className={`lc-bd-row ${r.cls}`}>
                      <span>{r.label}</span>
                      <b>{r.val < 0 ? '− ' : '+ '}{fmtMoney(Math.abs(r.val))}</b>
                    </div>
                  ))}
                  <div className="lc-bd-row lc-bd-total">
                    <span>ИТОГО ПОТЕРИ</span>
                    <b>{fmtMoney(calc.totalLoss)}</b>
                  </div>
                </div>
              </div>

              <div className="lc-metric-grid">
                <div className="lc-metric"><div className="lc-metric-num">{calc.hoursFreed.toLocaleString('ru-RU')} ч</div><div className="lc-metric-lbl">ВРЕМЕНИ ОСВОБОДИТ ИИ ЗА ГОД</div></div>
                <div className="lc-metric"><div className="lc-metric-num teal">{calc.payback > 0 ? (calc.payback < 0.5 ? '< 0.5 мес' : `${calc.payback.toLocaleString('ru-RU', { maximumFractionDigits: 1 })} мес`) : '—'}</div><div className="lc-metric-lbl">ОКУПАЕМОСТЬ ОБУЧЕНИЯ</div></div>
                <div className="lc-metric"><div className="lc-metric-num red">{threeYearText}</div><div className="lc-metric-lbl">ПОТЕРИ ЗА 3 ГОДА БЕЗ ИИ</div></div>
              </div>

              <a
                className="lc-cta"
                href="#pricing"
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                  setTimeout(() => scrollToSection('#pricing'), 250);
                }}
              >
                Хватит терять — занять место →
              </a>

              <div className="lc-res-note"><b>* РАСЧЁТ:</b> ЦЕНЫ ПО РЫНКУ ВЛАДИВОСТОКА/ФРИЛАНСА НА ОСНОВЕ КЕЙСОВ ВЫПУСКНИКОВ ШКОЛЫ. ИНВЕСТИЦИЯ В ИИ: КУРС «БАЗА» 150 000 ₽ + ПОДПИСКИ НА НЕЙРОСЕТИ ~5 000 ₽/МЕС. ИИ СНИМАЕТ ~70% РУТИННЫХ ЗАДАЧ.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

export default LossCalculatorModal;