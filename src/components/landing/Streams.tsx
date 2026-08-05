import Reveal from './Reveal';
import { scrollToSection } from '@/lib/scroll';

const TICKETS = [
  { date: '14.09', sub: 'ПОНЕДЕЛЬНИК + ЧЕТВЕРГ · 19:00', flow: 'ПОТОК 1', left: 'ОСТАЛОСЬ 4 МЕСТА' },
  { date: '16.09', sub: 'СРЕДА + СУББОТА · 19:00', flow: 'ПОТОК 2', left: 'ОСТАЛОСЬ 3 МЕСТА' },
];

const goToFinal = () => scrollToSection('#pricing');

const Streams = () => {
  return (
    <section className="sec" id="streams">
      <div className="wrap">
        <Reveal className="eyebrow">// 09 · РАСПИСАНИЕ</Reveal>
        <Reveal as="h2" className="sec-title grad-text">Два потока.<br />Сентябрь 2026</Reveal>
        <Reveal as="p" className="sec-sub">Владивосток, ул. Русская 41а, 3 этаж. Пропустил занятие — запись остаётся на 6 месяцев.</Reveal>
        <div className="streams">
          {TICKETS.map((t, i) => (
            <Reveal key={t.flow} className="ticket" delay={i * 0.1}>
              <div
                className="ticket-inner"
                role="button"
                tabIndex={0}
                onClick={goToFinal}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goToFinal(); } }}
              >
                <div className="t-date"><b>{t.date}</b><span>{t.sub}</span></div>
                <div className="t-info">{t.flow}<br /><span className="left">{t.left}</span></div>
                <div className="t-stub" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Streams;