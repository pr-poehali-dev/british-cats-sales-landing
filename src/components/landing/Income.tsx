import Reveal from './Reveal';
import Icon from '@/components/ui/icon';

const WAYS = [
  {
    icon: 'Gauge',
    h: 'Ускорить текущую работу',
    p: 'Те же задачи занимают меньше времени: исследования, тексты, визуал, отчёты и переписка. Освободившиеся часы вы тратите на то, что приносит деньги.',
  },
  {
    icon: 'Building2',
    h: 'Внедрить в свой бизнес',
    p: 'Ассистенты и сценарии автоматизации снимают повторяющиеся процессы с команды — вместо того чтобы нанимать людей под рутину.',
  },
  {
    icon: 'Briefcase',
    h: 'Брать проекты для клиентов',
    p: 'Сайты, ролики, визуал, боты и контент-системы как услуга. Школа показывает варианты услуг и помогает упаковать портфолио.',
  },
];

const Income = () => {
  return (
    <section className="sec" id="income">
      <div className="wrap">
        <Reveal className="eyebrow">// ПРИМЕНЕНИЕ НАВЫКА</Reveal>
        <Reveal as="h2" className="sec-title grad-text">Как использовать<br />навык после курса</Reveal>
        <Reveal as="p" className="sec-sub">
          Мы не обещаем конкретный доход и не гарантируем трудоустройство. Вот три честных пути,
          по которым идут наши выпускники.
        </Reveal>

        <div className="income">
          {WAYS.map((x, i) => (
            <Reveal key={x.h} className="inc" delay={i * 0.08}>
              <div className="inc-icon"><Icon name={x.icon} size={26} /></div>
              <h3>{x.h}</h3>
              <p>{x.p}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="payoff">
          <i />
          Стоимость ИИ-проектов на рынке сильно разнится: она зависит от ниши, сложности задачи
          и вашего опыта. На курсе мы разбираем, как считать стоимость своей работы и из чего
          складывается цена конкретного проекта.
        </Reveal>
      </div>
    </section>
  );
};

export default Income;
