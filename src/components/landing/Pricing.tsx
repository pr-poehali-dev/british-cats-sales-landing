import Reveal from './Reveal';
import Icon from '@/components/ui/icon';

const scrollTo = (e: React.MouseEvent, href: string) => {
  e.preventDefault();
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
};

const PLANS = [
  {
    badge: 'Выбор большинства', badgeO: false, hot: true,
    tag: 'ДЛЯ СТАРТА', name: 'БАЗА', old: 'Стоимость 150 000 ₽', sum: 'от 12 500 ₽', per: '/ МЕСЯЦ В РАССРОЧКУ',
    feats: ['3 месяца обучения, 72 часа практики', 'Домашние задания с проверкой кураторами', 'Общий чат потока', 'Записи всех занятий на 6 месяцев', 'Библиотека промптов школы', 'Экзамен и сертификат'],
    btn: 'Взять базу', ghost: false, link: 'https://torguykriptoy.getcourse.ru/chernikovgpt' as string | null,
  },
  {
    badge: null as string | null, badgeO: false, hot: false,
    tag: 'ДЛЯ КОМПАНИЙ', name: 'КОРПОРАТИВНОЕ ОБУЧЕНИЕ', sum: 'от 200 000 ₽', per: 'ЗА КОМАНДУ ДО 10 ЧЕЛОВЕК · 10 ЗАНЯТИЙ ПО 2 ЧАСА',
    feats: ['Обучение команды нейросетям под задачи бизнеса', 'Программа адаптируется под ваши процессы', 'Групповые и индивидуальные форматы', 'Закрытый чат и сопровождение кураторов', 'Отчётность и закрывающие документы'],
    btn: 'Обсудить обучение', ghost: true, link: 'https://t.me/chernikovpsiholog',
  },
  {
    badge: 'Мест мало', badgeO: true, hot: false,
    tag: 'МАКСИМУМ', name: 'ИНДИВИДУАЛЬНЫЙ', sum: 'от 300 000 ₽', per: 'ЛИЧНОЕ ОБУЧЕНИЕ 1-НА-1',
    feats: ['Личное обучение один на один с наставником', 'Программа полностью под ваши цели и задачи', 'Занятия в удобном для вас графике', 'Разбор ваших проектов на каждой встрече', 'Прямой контакт с Сергеем и командой школы'],
    btn: 'Записаться на обучение', ghost: true, link: 'https://t.me/chernikovpsiholog',
  },
];

const Pricing = () => {
  return (
    <section className="sec" id="pricing" style={{ background: 'var(--deep)' }}>
      <div className="wrap">
        <Reveal className="eyebrow">// 12 · ТАРИФЫ</Reveal>
        <Reveal as="h2" className="sec-title grad-text">Выбери формат</Reveal>
        <Reveal as="p" className="sec-sub">Все тарифы — полные 3 месяца программы. Рассрочка от 12 500 ₽/мес, кредит на 3/6/12 месяцев, оплата от юрлица по договору.</Reveal>
        <div className="price-grid">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} className={`price${p.hot ? ' hot' : ''}`} delay={i * 0.08}>
              {p.badge && <div className={`p-badge${p.badgeO ? ' o' : ''}`}>{p.badge}</div>}
              <div className="p-tag">{p.tag}</div>
              <h3>{p.name}</h3>
              {'old' in p && p.old && <div className="p-full">{p.old}</div>}
              <div className={`p-sum${/^\d/.test(p.sum) ? '' : ' txt'}`}>{p.sum}</div>
              <div className="p-per">{p.per}</div>
              <ul>{p.feats.map((f) => <li key={f}>{f}</li>)}</ul>
              {p.link ? (
                <a id={i === 0 ? 'pricing-cta' : undefined} className={`btn${p.ghost ? ' btn-ghost' : ''}`} href={p.link} target="_blank" rel="noopener noreferrer" style={{ justifyContent: 'center' }}>{p.btn}</a>
              ) : (
                <a className={`btn${p.ghost ? ' btn-ghost' : ''}`} href="#final" style={{ justifyContent: 'center' }} onClick={(e) => scrollTo(e, '#final')}>{p.btn}</a>
              )}
            </Reveal>
          ))}
        </div>
        <Reveal className="price-guarantee" delay={0.2}>
          <Icon name="ShieldCheck" size={22} />
          <span>Если после первых двух занятий поймёшь, что формат не твой, — вернём всю сумму</span>
        </Reveal>
        <Reveal className="price-note"><b>Оплата от юридических лиц</b> — по реквизитам с договором и закрывающими документами (обратитесь к менеджеру). Кредит и беспроцентная рассрочка (сплит, долями) на 3, 4, 6 или 12 месяцев оформляется в платежном терминале в пару кликов.</Reveal>
      </div>
    </section>
  );
};

export default Pricing;