import Reveal from './Reveal';
import Countdown from './Countdown';
import Icon from '@/components/ui/icon';
import { scrollToSection } from '@/lib/scroll';

const FinalCta = () => {
  return (
    <section id="final">
      <div className="spot l" /><div className="spot r" />
      <div className="wrap inner">
        <Reveal className="eyebrow" style={{ justifyContent: 'center' }}>// ПЕРВЫЙ ШАГ</Reveal>
        <Reveal as="h2">
          <span className="grad-text">Посмотрите, как проходит обучение,</span><br />
          <span className="cyan">прежде чем принимать решение</span>
        </Reveal>
        <Reveal as="p" className="sec-sub">
          Приходите в класс на Русской, 41а, познакомьтесь с преподавателем и кураторами, попробуйте
          выполнить первую задачу с ИИ и задайте вопросы о программе. После встречи менеджер поможет
          выбрать поток — или честно скажет, если курс не подходит под вашу задачу.
        </Reveal>

        <Reveal className="final-timer">
          <div className="final-timer-label">До старта ближайшего потока · 07.12.2026</div>
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
            Записаться на бесплатное пробное занятие →
          </a>
          <a className="btn btn-ghost magnetic" href="https://t.me/ChernikovGPT_Bot" target="_blank" rel="noopener">
            Задать вопрос в Telegram
          </a>
        </Reveal>

        <Reveal as="p" className="final-microtext" delay={0.1}>
          <Icon name="MapPin" size={14} /> Владивосток, Русская, 41а · отвечаем в рабочее время ·
          без обязательства покупать курс
        </Reveal>
      </div>
    </section>
  );
};

export default FinalCta;
