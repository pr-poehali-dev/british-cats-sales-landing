import { useEffect, useRef, useState } from 'react';
import Reveal from './Reveal';

const TL = [
  { y: '2017', h: 'Старт в IT', p: 'Машинное обучение и автоматизация бизнес-процессов.' },
  { y: '2018', h: 'Super-SMM и первые курсы', p: 'Собственные продукты автоматизации лидогенерации.' },
  { y: '2020', h: 'Переезд во Владивосток', p: 'Воркшопы по автоматизации бизнеса для предпринимателей Приморья.' },
  { y: '2022', h: 'Super-SMM', p: 'Запуск агрегаторов на ИИ, первые живые воркшопы.' },
  { y: '2024', h: '«Хакни Нейросети»', p: 'Запуск очной школы прикладного ИИ во Владивостоке.' },
  { y: '2025', h: 'Воркшопы по ИИ во Владивостоке', p: 'Серия открытых мероприятий для предпринимателей города — попали в городскую афишу.' },
  { y: '2026', h: 'Благотворительное ИИ-шоу «Без Ширмы»', p: 'Организовано совместно с «Опорой России». Полный зал и 235 000 ₽, собранных для центра «Маяк».' },
  { y: '2026', h: 'Благодарности за вклад в предпринимательство', p: 'От ЦРП, «Опоры России» и Правительства Приморского края.' },
];

const REVEAL_IMG = 'https://cdn.poehali.dev/projects/d3e635a0-73f6-4725-9cb9-7faeace376fe/bucket/1946ff7d-ffc3-444f-999e-77e10e27cf34.jpeg';

const Speaker = () => {
  const tlRef = useRef<HTMLDivElement>(null);
  const [lineH, setLineH] = useState(0);
  const [lens, setLens] = useState<{ x: number; y: number } | null>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setLens({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  useEffect(() => {
    const onScroll = () => {
      const el = tlRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.7;
      const p = Math.max(0, Math.min(1, (start - r.top) / (r.height * 0.85)));
      setLineH(p * r.height);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="sec" id="speaker">
      <div className="wrap">
        <Reveal className="eyebrow">// СПИКЕР</Reveal>
        <div className="spk">
          <Reveal className="spk-photo">
            <div
              className="frame spk-lens"
              onMouseMove={onMove}
              onMouseLeave={() => setLens(null)}
            >
              <img className="spk-under" src={REVEAL_IMG} alt="" aria-hidden />
              <img
                className="spk-top"
                src="/site/speaker.jpg"
                alt="Сергей Черников"
                style={lens ? {
                  WebkitMaskImage: `radial-gradient(circle 90px at ${lens.x}px ${lens.y}px, transparent 0, transparent 65px, #000 110px)`,
                  maskImage: `radial-gradient(circle 90px at ${lens.x}px ${lens.y}px, transparent 0, transparent 65px, #000 110px)`,
                } : undefined}
              />
              {lens && (
                <span
                  className="spk-glow"
                  style={{ left: lens.x, top: lens.y }}
                />
              )}
              {!lens && <span className="spk-hint">Наведи</span>}
            </div>
          </Reveal>
          <div>
            <Reveal as="h2" className="sec-title grad-text">Учит не теоретик,<br />а практик внедрения</Reveal>
            <Reveal as="p" className="sec-sub" style={{ marginBottom: 40 }}>
              Сергей Черников — основатель «Хакни Нейросети», CEO Super-SMM и разработчик ИИ-продуктов
              GPT-BOSS и MultiChat. Более шести лет занимается внедрением ИИ в бизнес, с 2016 года
              выступает по теме автоматизации. На курсе ведёт занятия лично, разбирает проекты студентов
              и обновляет программу под изменения инструментов.
            </Reveal>
            <div className="tl" ref={tlRef}>
              <div className="tl-line" style={{ height: lineH }} />
              {TL.map((t) => (
                <Reveal key={t.h} className="tl-item">
                  <b>{t.y}</b>
                  <h4>{t.h}</h4>
                  <p>{t.p}</p>
                </Reveal>
              ))}
            </div>
            <Reveal as="div" className="quote">
              «Не знать AI в 2026 году — это как не уметь пользоваться интернетом в 2010-м. Я учу только тому, что работает у меня самого».
              <small>СЕРГЕЙ ЧЕРНИКОВ · ОСНОВАТЕЛЬ ШКОЛЫ</small>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Speaker;