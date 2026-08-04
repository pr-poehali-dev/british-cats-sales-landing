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
    btn: 'Взять базу', ghost: false, link: null as string | null,
  },
  {
    badge: null as string | null, badgeO: false, hot: false,
    tag: 'ДЛЯ КОМПАНИЙ', name: 'КОРПОРАТИВНОЕ ОБУЧЕНИЕ', sum: 'Обсуждается индивидуально', per: 'ОПЛАТА ОТ ЮРЛИЦА ПО ДОГОВОРУ',
    feats: ['Обучение команды нейросетям под задачи бизнеса', 'Программа адаптируется под ваши процессы', 'Групповые и индивидуальные форматы', 'Закрытый чат и сопровождение кураторов', 'Отчётность и закрывающие документы'],
    btn: 'Обсудить обучение', ghost: true, link: 'https://t.me/chernikovpsiholog',
  },
  {
    badge: 'Мест мало', badgeO: true, hot: false,
    tag: 'МАКСИМУМ', name: 'ИНДИВИДУАЛЬНЫЙ', sum: 'Обсуждается индивидуально', per: 'ЛИЧНОЕ ОБУЧЕНИЕ 1-НА-1',
    feats: ['Личное обучение один на один с наставником', 'Программа полностью под ваши цели и задачи', 'Занятия в удобном для вас графике', 'Разбор ваших проектов на каждой встрече', 'Прямой контакт с Сергеем и командой школы'],
    btn: 'Записаться на обучение', ghost: true, link: 'https://t.me/chernikovpsiholog',
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
              <div className={`p-sum${/^\d/.test(p.sum) ? '' : ' txt'}`}>{p.sum}</div>
              <div className="p-per">{p.per}</div>
              <ul>{p.feats.map((f) => <li key={f}>{f}</li>)}</ul>
              {p.link ? (
                <a className={`btn${p.ghost ? ' btn-ghost' : ''}`} href={p.link} target="_blank" rel="noopener noreferrer" style={{ justifyContent: 'center' }}>{p.btn}</a>
              ) : (
                <a className={`btn${p.ghost ? ' btn-ghost' : ''}`} href="#final" style={{ justifyContent: 'center' }} onClick={(e) => scrollTo(e, '#final')}>{p.btn}</a>
              )}
            </Reveal>
          ))}
        </div>
        <Reveal className="price-note"><b>Оплата от юридических лиц</b> — по реквизитам с договором и закрывающими документами. Кредит на 3, 6 или 12 месяцев оформляется на месте.</Reveal>
      </div>
    </section>
  );
};

export default Pricing;