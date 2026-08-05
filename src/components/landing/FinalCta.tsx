import Reveal from './Reveal';
import Countdown from './Countdown';
import { scrollToSection } from '@/lib/scroll';

const FinalCta = () => {
  return (
    <section id="final">
      <div className="spot l" /><div className="spot r" />
      <div className="wrap inner">
        <Reveal className="eyebrow" style={{ justifyContent: 'center' }}>// 13 · РЕШЕНИЕ</Reveal>
        <Reveal as="h2">
          <span className="grad-text">Пока ты думаешь —</span><br />
          <span className="cyan">конкурент уже учится</span>
        </Reveal>
        <Reveal as="p" className="sec-sub">Два вечера в неделю — и через 3 месяца ИИ работает на тебя. В группе 30 мест, осталось 7. Записи остаются навсегда — навыки тоже.</Reveal>
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
            Занять место →
          </a>
          <a className="btn btn-ghost magnetic" href="https://t.me/ChernikovGPT_Bot" target="_blank" rel="noopener">Бесплатная консультация</a>
        </Reveal>
      </div>
    </section>
  );
};

export default FinalCta;