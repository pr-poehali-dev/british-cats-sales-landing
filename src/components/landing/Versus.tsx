import Reveal from './Reveal';
import Icon from '@/components/ui/icon';
import { scrollToSection } from '@/lib/scroll';

const FLOW = [
  {
    icon: 'Presentation',
    tag: 'ШАГ 1',
    title: 'Объяснение и демонстрация',
    text: 'Сергей разбирает принцип и показывает инструмент вживую — на экране, а не на слайде.',
  },
  {
    icon: 'Laptop',
    tag: 'ШАГ 2 · БОЛЬШАЯ ЧАСТЬ ЗАНЯТИЯ',
    title: 'Работа на своём проекте',
    text: 'Вы сразу выполняете задачу на своих материалах. Два куратора подходят, помогают настроить сервис и исправить ошибку.',
  },
  {
    icon: 'ClipboardCheck',
    tag: 'ШАГ 3',
    title: 'Разбор и фиксация результата',
    text: 'Смотрим, что получилось, дорабатываем и сохраняем готовую работу к вам в портфолио.',
  },
];

const POINTS = [
  { icon: 'Users', text: 'Спикер и два куратора в классе на каждом занятии' },
  { icon: 'MapPin', text: 'Очно во Владивостоке, Русская 41а — группа до 30 человек' },
  { icon: 'Video', text: 'Пропустили занятие — запись доступна 6 месяцев' },
  { icon: 'MessageSquare', text: 'Домашние задания с проверкой и общий чат потока' },
  { icon: 'Handshake', text: 'Рядом такие же предприниматели и специалисты — связи и партнёрства' },
  { icon: 'RefreshCw', text: 'Программа обновляется перед каждым потоком под новые инструменты' },
];

const Versus = () => {
  return (
    <section className="sec" id="class" style={{ background: 'var(--deep)' }}>
      <div className="wrap">
        <Reveal className="eyebrow">// ФОРМАТ ОБУЧЕНИЯ</Reveal>
        <Reveal as="h2" className="sec-title grad-text">Вы не остаётесь<br />один на один с записью</Reveal>
        <Reveal as="p" className="sec-sub">
          Основное обучение проходит очно. В живом классе преподаватель видит, где вы остановились,
          и помогает продолжить — поэтому обучение сложнее отложить «на потом».
        </Reveal>

        <div className="flow-grid">
          {FLOW.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <article className="flow-card">
                <span className="flow-tag">{f.tag}</span>
                <div className="flow-icon"><Icon name={f.icon} size={24} /></div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="class-points">
          {POINTS.map((p, i) => (
            <Reveal key={p.text} delay={i * 0.05}>
              <div className="class-point">
                <Icon name={p.icon} size={18} />
                <span>{p.text}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="vs-calc-cta" delay={0.15}>
          <p className="vs-calc-hook">
            Лучший способ понять формат — прийти и попробовать. Первое занятие бесплатное,
            без обязательства покупать курс.
          </p>
          <button type="button" className="btn" onClick={() => scrollToSection('#pricing')}>
            <Icon name="CalendarCheck" size={18} />
            Записаться на пробное занятие
          </button>
        </Reveal>
      </div>
    </section>
  );
};

export default Versus;
