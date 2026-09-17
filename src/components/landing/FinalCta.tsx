import Reveal from './Reveal';
import Countdown from './Countdown';
import { scrollToSection } from '@/lib/scroll';

const FinalCta = () => {
  return (
    <section id="final">
      <div className="spot l" /><div className="spot r" />
      <div className="wrap inner">
        <Reveal className="eyebrow" style={{ justifyContent: 'center' }}>// 15 · РЕШЕНИЕ</Reveal>
        <Reveal as="h2">
          <span className="grad-text">Пока ты думаешь —</span><br />
          <span className="cyan">конкурент уже учится</span>
        </Reveal>
        <Reveal as="p" className="sec-sub">Продажи на текущий поток закрыты — набор полностью укомплектован. Следующие потоки стартуют 7 и 9 декабря, оставь заявку и попади в числе первых. Записи остаются на полгода — навыки остаются <span className="cyan">навсегда</span>.</Reveal>
        <Reveal className="final-timer">
          <Countdown />
        </Reveal>
        <Reveal className="hero-cta" style={{ justifyContent: 'center' }}>
          <a
            className="btn magnetic"
            href="#pricing"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#pricing');
            }}
          >
            Оставить заявку на декабрь →
          </a>
          <a className="btn btn-ghost magnetic" href="https://t.me/ChernikovGPT_Bot" target="_blank" rel="noopener">Бесплатная консультация</a>
        </Reveal>
        <Reveal as="p" className="final-microtext" delay={0.1}>Продажи закрыты · Следующий поток — декабрь · Отвечаем в течение 15 минут в рабочее время</Reveal>
      </div>
    </section>
  );
};

export default FinalCta;