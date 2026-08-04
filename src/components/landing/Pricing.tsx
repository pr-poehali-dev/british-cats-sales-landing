import Reveal from './Reveal';

const scrollTo = (e: React.MouseEvent, href: string) => {
  e.preventDefault();
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
};

const PLANS = [
  {
    badge: 'Выбор большинства', badgeO: false, hot: true,
    tag: 'ДЛЯ СТАРТА', name: 'БАЗА', sum: 'от 12 500 ₽', per: '/ МЕСЯЦ В РАССРОЧКУ',
    feats: ['3 месяца обучения, 72 часа практики', 'Домашние задания с проверкой кураторами', 'Общий чат потока', 'Записи всех занятий на 6 месяцев', 'Библиотека промптов школы', 'Экзамен и сертификат'],
    btn: 'Взять базу', ghost: false,
  },
  {
    badge: null as string | null, badgeO: false, hot: false,
    tag: 'ДЛЯ КОМПАНИЙ', name: 'КОРПОРАТИВНОЕ ОБУЧЕНИЕ', sum: 'по консультации', per: 'ОПЛАТА ОТ ЮРЛИЦА ПО ДОГОВОРУ',
    feats: ['Обучение команды нейросетям под задачи бизнеса', 'Программа адаптируется под ваши процессы', 'Групповые и индивидуальные форматы', 'Закрытый чат и сопровождение кураторов', 'Отчётность и закрывающие документы'],
    btn: 'Обсудить обучение', ghost: true,
  },
  {
    badge: 'Мест мало', badgeO: true, hot: false,
    tag: 'МАКСИМУМ', name: 'ИНДИВИДУАЛЬНЫЙ', sum: 'по консультации', per: 'ЛИЧНОЕ СОПРОВОЖДЕНИЕ',
    feats: ['Личный куратор на весь курс', 'Индивидуальный трек под твой бизнес', 'Полная программа: 72 часа практики', 'Разбор воронки и продукта 1-на-1', 'Доступ к Сергею и команде школы'],
    btn: 'Обсудить формат', ghost: true,
  },
];

const Pricing = () => {
  return (
    <section className="sec" id="pricing" style={{ background: 'var(--deep)' }}>
      <div className="wrap">
        <Reveal className="eyebrow">// 10 · ТАРИФЫ</Reveal>
        <Reveal as="h2" className="sec-title grad-text">Выбери формат</Reveal>
        <Reveal as="p" className="sec-sub">Все тарифы — полные 3 месяца программы. Рассрочка от 12 500 ₽/мес, кредит на 3/6/12 месяцев, оплата от юрлица по договору.</Reveal>
        <div className="price-grid">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} className={`price${p.hot ? ' hot' : ''}`} delay={i * 0.08}>
              {p.badge && <div className={`p-badge${p.badgeO ? ' o' : ''}`}>{p.badge}</div>}
              <div className="p-tag">{p.tag}</div>
              <h3>{p.name}</h3>
              <div className="p-sum">{p.sum}</div>
              <div className="p-per">{p.per}</div>
              <ul>{p.feats.map((f) => <li key={f}>{f}</li>)}</ul>
              <a className={`btn${p.ghost ? ' btn-ghost' : ''}`} href="#final" style={{ justifyContent: 'center' }} onClick={(e) => scrollTo(e, '#final')}>{p.btn}</a>
            </Reveal>
          ))}
        </div>
        <Reveal className="price-note"><b>Оплата от юридических лиц</b> — по реквизитам с договором и закрывающими документами. Кредит на 3, 6 или 12 месяцев оформляется на месте.</Reveal>
      </div>
    </section>
  );
};

export default Pricing;