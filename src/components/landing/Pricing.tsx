import Reveal from './Reveal';
import Icon from '@/components/ui/icon';

const scrollTo = (e: React.MouseEvent, href: string) => {
  e.preventDefault();
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
};

const PLANS = [
  {
    badge: 'Основной формат', badgeO: false, hot: true,
    tag: 'ОЧНО В КЛАССЕ', name: 'БАЗА', old: null as string | null,
    sum: '150 000 ₽', per: 'ИЛИ ОТ 12 500 ₽ В МЕСЯЦ В РАССРОЧКУ',
    feats: [
      '3 месяца обучения · 24 занятия · 72 часа',
      'Практика на собственном проекте',
      'Сергей и два куратора в классе',
      'Проверка домашних заданий',
      'Общий чат потока',
      'Записи занятий на 6 месяцев',
      'Библиотека инструкций и промптов',
      'Итоговый проект и сертификат школы',
    ],
    btn: 'Получить программу и подобрать поток', ghost: false,
    link: 'https://torguykriptoy.getcourse.ru/chernikovgpt' as string | null,
  },
  {
    badge: null as string | null, badgeO: false, hot: false,
    tag: 'ДЛЯ КОМПАНИЙ', name: 'КОРПОРАТИВНАЯ ПРОГРАММА', old: null,
    sum: 'от 200 000 ₽', per: '10 ЗАНЯТИЙ ПО ДВА ЧАСА ДЛЯ КОМАНДЫ ДО 10 ЧЕЛОВЕК',
    feats: [
      'Диагностика процессов перед стартом',
      'Программа вокруг 3–5 реальных задач компании',
      'Обученная команда и библиотека рабочих сценариев',
      'Внутренние правила применения ИИ',
      'План дальнейшего внедрения',
      'Договор и закрывающие документы',
    ],
    btn: 'Обсудить обучение команды', ghost: true, link: 'https://t.me/chernikovpsiholog',
  },
  {
    badge: 'Мест мало', badgeO: true, hot: false,
    tag: 'ПЕРСОНАЛЬНО', name: 'ИНДИВИДУАЛЬНЫЙ', old: null,
    sum: 'от 300 000 ₽', per: 'ЛИЧНОЕ ОБУЧЕНИЕ ОДИН НА ОДИН С СЕРГЕЕМ',
    feats: [
      'Занятия ведёт лично Сергей Черников',
      'График и темп подстраиваются под вас',
      'Программа собирается под ваши конкретные задачи',
      'Разбор ваших проектов на каждой встрече',
      'Часть работ выполняется под ключ вместе с вами',
      'Сопровождение между встречами в переписке',
    ],
    btn: 'Обсудить персональный формат', ghost: true, link: 'https://t.me/chernikovpsiholog',
  },
];

const Pricing = () => {
  return (
    <section className="sec" id="pricing" style={{ background: 'var(--deep)' }}>
      <div className="wrap">
        <Reveal className="eyebrow">// СТОИМОСТЬ</Reveal>
        <Reveal as="h2" className="sec-title grad-text">Выберите формат</Reveal>
        <Reveal as="p" className="sec-sub">
          Основной формат — очные занятия в классе на Русской, 41а. Точный объём и условия
          персонального формата менеджер уточнит на первой встрече.
        </Reveal>

        <div className="price-grid">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} className={`price${p.hot ? ' hot' : ''}`} delay={i * 0.08}>
              {p.badge && <div className={`p-badge${p.badgeO ? ' o' : ''}`}>{p.badge}</div>}
              <div className="p-tag">{p.tag}</div>
              <h3>{p.name}</h3>
              {p.old && <div className="p-full">{p.old}</div>}
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

        <Reveal delay={0.16}>
          <div className="guarantee-box">
            <div className="guarantee-icon"><Icon name="ShieldCheck" size={28} /></div>
            <div>
              <h3>Два занятия, чтобы принять решение</h3>
              <p>
                Посетите первые два занятия потока. Если поймёте, что формат вам не подходит,
                сообщите менеджеру до третьего занятия — школа вернёт стоимость обучения в порядке,
                указанном в договоре. Перед оплатой вы получаете договор и можете задать вопросы
                по условиям возврата, срокам перечисления и работе гарантии при рассрочке.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="pay-grid">
            <div className="pay-card">
              <Icon name="CreditCard" size={20} />
              <b>Рассрочка платёжного сервиса</b>
              <p>
                Оформляется в платёжном терминале за пару кликов на 3, 4, 6 или 12 месяцев.
                Решение принимает банк-партнёр сервиса, он же определяет первый взнос.
              </p>
            </div>
            <div className="pay-card">
              <Icon name="Landmark" size={20} />
              <b>Банковский кредит</b>
              <p>
                Отдельный продукт банка со своей ставкой и переплатой. Условия и одобрение
                зависят от банка — это не рассрочка школы.
              </p>
            </div>
            <div className="pay-card">
              <Icon name="Building2" size={20} />
              <b>Оплата от юридического лица</b>
              <p>
                По реквизитам, с договором и закрывающими документами. Подойдёт, если обучение
                оплачивает компания. Уточните детали у менеджера.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal className="price-note" delay={0.24}>
          <b>Дополнительные расходы.</b> Для занятий понадобится ноутбук. Часть зарубежных сервисов
          оплачивается отдельно по подписке, для некоторых нужен VPN. Кураторы помогают с регистрацией
          и настройкой оплаты. Конкретный список сервисов и примерный бюджет мы присылаем до старта потока.
        </Reveal>
      </div>
    </section>
  );
};

export default Pricing;
