import Reveal from './Reveal';
import { scrollToSection } from '@/lib/scroll';

const goToFinal = () => scrollToSection('#pricing');

const Streams = () => {
  return (
    <section className="sec" id="streams">
      <div className="wrap">
        <Reveal className="eyebrow">// 11 · РАСПИСАНИЕ</Reveal>
        <Reveal as="h2" className="sec-title grad-text">Продажи закрыты.<br />Следующий старт — декабрь</Reveal>
        <Reveal as="p" className="sec-sub">Владивосток, ул. Русская 41а, 3 этаж. Текущий поток набран полностью. Оставь заявку — сообщим первыми, как только откроется запись на декабрьский поток.</Reveal>
        <Reveal className="ticket" style={{ maxWidth: 560, margin: '0 auto' }}>
          <div
            className="ticket-inner"
            role="button"
            tabIndex={0}
            onClick={goToFinal}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goToFinal(); } }}
          >
            <div className="t-date"><b>ДЕКАБРЬ</b><span>ТОЧНЫЕ ДАТЫ СКОРО</span></div>
            <div className="t-info">НОВЫЙ ПОТОК<br /><span className="left">ЗАПИСЬ ОТКРОЕТСЯ СКОРО</span></div>
            <div className="t-stub" />
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Streams;