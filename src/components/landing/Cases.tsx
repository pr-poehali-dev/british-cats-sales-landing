import { useEffect, useRef } from 'react';
import Reveal from './Reveal';

const CASES = [
  { av: 'АМ', name: 'Анна Михайлова', role: 'SMM-СПЕЦИАЛИСТ', res: <>Пост за 4 часа → <b>за 15 минут</b>. Рост скорости ×16, те же клиенты — больше проектов.</>, when: '2 МЕСЯЦА ПОСЛЕ КУРСА' },
  { av: 'ДК', name: 'Дмитрий Козлов', role: 'ПРЕДПРИНИМАТЕЛЬ', res: <>Доход <b>150 000 → 450 000 ₽/мес</b>. Автоворонка на нейросетях вместо найма отдела.</>, when: '3 МЕСЯЦА ПОСЛЕ КУРСА' },
  { av: 'ЕС', name: 'Елена Соколова', role: 'КОНТЕНТ-МЕЙКЕР', res: <>Аудитория <b>3 500 → 31 000</b> подписчиков. Рост ×9 на системном контенте.</>, when: '4 МЕСЯЦА ПОСЛЕ КУРСА' },
  { av: 'МВ', name: 'Марина Волкова', role: 'ДИЗАЙНЕР', res: <><b>3 → 15 макетов</b> в неделю. Тот же уровень качества, ×5 скорость.</>, when: '2 МЕСЯЦА ПОСЛЕ КУРСА' },
  { av: 'ИП', name: 'Игорь Петренко', role: 'ВИДЕОМЕЙКЕР', res: <>Ролик за 2 дня → <b>за 3 часа</b>. Генерация + монтаж на связке инструментов.</>, when: '3 МЕСЯЦА ПОСЛЕ КУРСА' },
  { av: 'ОК', name: 'Ольга Краснова', role: 'МАРКЕТОЛОГ', res: <>Стоимость лида <b>820 ₽ → 190 ₽</b>. Снижение CPL в 4 раза на новых креативах.</>, when: '2 МЕСЯЦА ПОСЛЕ КУРСА' },
  { av: 'АС', name: 'Артём Савченко', role: 'ПРЕДПРИНИМАТЕЛЬ', res: <>5 сотрудников поддержки → 1 + ИИ-бот. <b>Экономия 280 000 ₽/мес</b>.</>, when: '3 МЕСЯЦА ПОСЛЕ КУРСА' },
  { av: 'НК', name: 'Наталья Ким', role: 'БЛОГЕР', res: <><b>2 → 12 Reels</b> в неделю. Нейро-аватар снимает рутину съёмок.</>, when: '2 МЕСЯЦА ПОСЛЕ КУРСА' },
  { av: 'ВЛ', name: 'Виктор Лебедев', role: 'ПРЕДПРИНИМАТЕЛЬ', res: <>Запуск продукта <b>3 месяца → 2 недели</b>. Ускорение ×6 на всех этапах.</>, when: 'ПОСЛЕ КУРСА' },
  { av: 'КЖ', name: 'Кристина Жукова', role: 'SMM-СПЕЦИАЛИСТ', res: <>Доход <b>45 000 → 120 000 ₽/мес</b>. Рост ×2.7 за счёт скорости и новых услуг.</>, when: '4 МЕСЯЦА ПОСЛЕ КУРСА' },
];

const Cases = () => {
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, scroll: 0, moved: false });

  const onDown = (x: number) => {
    const el = box.current!;
    drag.current = { down: true, startX: x, scroll: el.scrollLeft, moved: false };
    el.classList.add('grabbing');
  };
  const onMove = (x: number) => {
    if (!drag.current.down) return;
    const el = box.current!;
    const d = x - drag.current.startX;
    if (Math.abs(d) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.scroll - d;
  };
  const onUp = () => {
    drag.current.down = false;
    box.current?.classList.remove('grabbing');
  };

  const paused = useRef(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let raf = 0;
    const speed = 0.4;
    const step = () => {
      if (!paused.current && !drag.current.down) {
        el.scrollLeft += speed;
        const half = el.scrollWidth / 2;
        if (el.scrollLeft >= half) el.scrollLeft -= half;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="sec" id="cases" style={{ background: 'var(--deep)' }}>
      <div className="wrap">
        <div className="cases-head">
          <div>
            <Reveal className="eyebrow">// 06 · РЕЗУЛЬТАТЫ</Reveal>
            <Reveal as="h2" className="sec-title grad-text">Было → стало.<br />Кейсы студентов</Reveal>
          </div>
          <Reveal className="drag-hint">ТЯНИ</Reveal>
        </div>
      </div>
      <div
        className="cases"
        ref={box}
        onMouseDown={(e) => onDown(e.pageX)}
        onMouseMove={(e) => onMove(e.pageX)}
        onMouseUp={onUp}
        onTouchStart={(e) => onDown(e.touches[0].pageX)}
        onTouchMove={(e) => onMove(e.touches[0].pageX)}
        onTouchEnd={onUp}
        onMouseEnter={() => { paused.current = true; }}
        onMouseLeave={() => { paused.current = false; onUp(); }}
        style={{ overflowX: 'auto', scrollbarWidth: 'none' }}
      >
        <div className="cases-track">
          {[...CASES, ...CASES].map((c, i) => (
            <div className="case" key={`${c.name}-${i}`}>
              <div className="case-top">
                <div className="avatar">{c.av}</div>
                <div><b>{c.name}</b><span>{c.role}</span></div>
              </div>
              <div className="case-res">{c.res}</div>
              <div className="case-when">{c.when}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Cases;