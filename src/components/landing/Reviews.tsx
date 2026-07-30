import { useState } from 'react';
import Reveal from './Reveal';

const REVIEWS = [
  { av: 'СВ', name: 'Светлана', role: 'ВЫПУСКНИЦА', full: 5, text: '«Никакой воды, сплошная практика и готовые решения. Пришла вообще без опыта — ушла с работающими инструментами и первыми заказами».' },
  { av: 'НД', name: 'Надежда', role: 'ВЫПУСКНИЦА', full: 5, text: '«Это волшебный ключик, открывший дверь в новый мир. Применила знания в работе в тот же день после занятия».' },
  { av: 'АР', name: 'Артём', role: 'ВЫПУСКНИК', full: 4, text: '«Материала очень много, темп высокий — но есть записи всех занятий, так что ничего не теряется. Рекомендую».' },
  { av: 'МА', name: 'Марина', role: 'ВЫПУСКНИЦА', full: 4, text: '«Очень много практики, что здорово. Хотелось бы ещё больше живого общения — но в целом курс превзошёл ожидания».' },
  { av: 'ОК', name: 'Оксана', role: 'ВЫПУСКНИЦА', full: 5, text: '«Знания, которые экономят время, — бесценны. То, на что уходили часы, теперь делаю за минуты».' },
];

const Stars = ({ full }: { full: number }) => (
  <div className="stars">
    {'★★★★★'.split('').map((s, i) => (i < full ? <span key={i}>★</span> : <span key={i} className="dim">★</span>))}
  </div>
);

const Reviews = () => {
  const [idx, setIdx] = useState(0);
  const max = REVIEWS.length;

  return (
    <section className="sec" id="reviews">
      <div className="wrap">
        <Reveal className="eyebrow">// 11 · ОТЗЫВЫ</Reveal>
        <Reveal as="h2" className="sec-title grad-text">Что говорят студенты</Reveal>
        <Reveal className="rev-wrap">
          <div style={{ overflow: 'hidden' }}>
            <div className="rev-track" style={{ transform: `translateX(calc(-${idx} * (33.333% + 5.33px)))` }}>
              {REVIEWS.map((r) => (
                <div className="rev" key={r.name}>
                  <Stars full={r.full} />
                  <p>{r.text}</p>
                  <div className="who">
                    <div className="avatar">{r.av}</div>
                    <div><b>{r.name}</b><span>{r.role}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rev-nav">
            <button className="rev-btn" onClick={() => setIdx((i) => Math.max(0, i - 1))}>←</button>
            <button className="rev-btn" onClick={() => setIdx((i) => Math.min(max - 1, i + 1))}>→</button>
          </div>
        </Reveal>
        <Reveal className="agg"><b>4.9/5</b><span>средний рейтинг по отзывам выпускников</span></Reveal>
      </div>
    </section>
  );
};

export default Reviews;
