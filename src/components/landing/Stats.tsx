import Reveal from './Reveal';
import CountUp from './CountUp';

const STATS = [
  { to: 10000, suffix: '+', label: 'участников на программах Сергея с 2018 года — включая мастер-классы и интенсивы' },
  { to: 5, dec: 1, suffix: '/5', label: 'рейтинг школы в 2ГИС' },
  { to: 33, suffix: '', label: 'независимых отзыва в 2ГИС на сентябрь 2026 года' },
  { to: 72, suffix: ' ч', label: 'живой практики в классе за три месяца обучения' },
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
        <Reveal className="eyebrow">// ПОЧЕМУ МЫ</Reveal>
        <Reveal as="h2" className="sec-title grad-text">Живая школа<br />прикладного ИИ</Reveal>
        <Reveal as="p" className="sec-sub">Не вебинары и не «записи в ленте» — очный класс во Владивостоке, спикер и два куратора-практика на каждом занятии. Проверить нас можно по независимым отзывам, а не только по нашим словам.</Reveal>
        <div className="stats">
          {STATS.map((s, i) => (
            <Reveal key={s.label} className="stat" delay={i * 0.08}>
              <CountUp to={s.to} dec={s.dec} suffix={s.suffix} />
              <span>{s.label}</span>
            </Reveal>
          ))}
        </div>
        <Reveal className="trustline-head">
          <em>Сотрудники и руководители этих компаний учились у нас:</em>
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