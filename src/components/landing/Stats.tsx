import Reveal from './Reveal';
import CountUp from './CountUp';

const STATS = [
  { to: 10000, suffix: '+', label: 'студентов прошли обучение' },
  { to: 4.9, dec: 1, suffix: '/5', label: 'рейтинг школы по отзывам выпускников' },
  { to: 94, suffix: '%', label: 'выпускников применяют ИИ в работе уже через месяц' },
  { to: 90, suffix: '%', label: 'доводимость до результата — против 10–15% у онлайн-курсов' },
];

const TRUST = ['Опора России', 'Мой Бизнес', 'Росмолодёжь', 'Штаб общественной поддержки', 'ПАО «Дальприбор»', 'Бизнес Завтрак', 'Пасифик Медиа', 'VLPACIFIC', 'LogisticForce', 'Аэропорт Владивосток', 'Энергостройсервис', 'ЦРП Владивостока', 'Плесы Песчаного', 'АН Перспектива', 'Геометрия Уюта', 'Кинотеатр ШАХТЕР'];

const TRUST_A = TRUST.slice(0, 8);
const TRUST_B = TRUST.slice(8);

const TrustMarquee = ({ items, dir }: { items: string[]; dir: 'left' | 'right' }) => (
  <div className="trust-marquee">
    <div className={`trust-track ${dir}`}>
      {[0, 1].map((copy) => (
        <div className="trust-set" key={copy} aria-hidden={copy === 1}>
          {items.map((t) => (
            <span className="trust-item" key={`${copy}-${t}`}>{t}</span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

const Stats = () => {
  return (
    <section className="sec" id="stats">
      <div className="wrap">
        <Reveal className="eyebrow">// 01 · ПОЧЕМУ МЫ</Reveal>
        <Reveal as="h2" className="sec-title grad-text">Первая живая школа ИИ<br />на Дальнем Востоке</Reveal>
        <Reveal as="p" className="sec-sub">Работаем с 2022 года при поддержке приморского отделения «Опоры России». Не вебинары и не «записи в ленте» — живой класс, спикер и два куратора-практика на каждом занятии.</Reveal>
        <div className="stats">
          {STATS.map((s, i) => (
            <Reveal key={s.label} className="stat" delay={i * 0.08}>
              <CountUp to={s.to} dec={s.dec} suffix={s.suffix} />
              <span>{s.label}</span>
            </Reveal>
          ))}
        </div>
        <Reveal className="trustline-head">
          <em>Нам доверяют:</em>
        </Reveal>
        <div className="trust-rows">
          <TrustMarquee items={TRUST_A} dir="left" />
          <TrustMarquee items={TRUST_B} dir="right" />
        </div>
      </div>
    </section>
  );
};

export default Stats;