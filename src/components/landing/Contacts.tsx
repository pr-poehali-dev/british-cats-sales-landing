import Reveal from './Reveal';
import Icon from '@/components/ui/icon';

const ITEMS = [
  {
    icon: 'MapPin',
    label: 'Адрес школы',
    value: 'Владивосток, ул. Русская, 41а, 3 этаж',
    note: 'Офис «Хакни Нейросети»',
    href: 'https://2gis.ru/vladivostok/firm/70000001105602364',
  },
  {
    icon: 'Phone',
    label: 'Телефон менеджера',
    value: '+7 994 107 43 10',
    note: 'Позвоните или напишите — подберём поток',
    href: 'tel:+79941074310',
  },
  {
    icon: 'Clock',
    label: 'Режим работы',
    value: 'Пн–Сб · 10:00–20:00',
    note: 'Воскресенье — выходной',
    href: '',
  },
  {
    icon: 'Send',
    label: 'Telegram',
    value: '@ChernikovGPT_Bot',
    note: 'Бот консультаций, отвечает сразу',
    href: 'https://t.me/ChernikovGPT_Bot',
  },
];

const Contacts = () => {
  return (
    <section className="sec" id="contacts">
      <div className="wrap">
        <Reveal className="eyebrow">// КОНТАКТЫ</Reveal>
        <Reveal as="h2" className="sec-title grad-text">Приходите в гости</Reveal>
        <Reveal as="p" className="sec-sub">
          Школа находится в центре Владивостока. Ищите офис «Хакни Нейросети» на третьем этаже.
        </Reveal>
        <div className="ct-grid">
          {ITEMS.map((it, i) => {
            const body = (
              <>
                <span className="ct-ico"><Icon name={it.icon} size={22} fallback="CircleAlert" /></span>
                <span className="ct-label">{it.label}</span>
                <b className="ct-value">{it.value}</b>
                <span className="ct-note">{it.note}</span>
              </>
            );
            return (
              <Reveal key={it.label} delay={i * 0.08}>
                {it.href ? (
                  <a
                    className="ct-card"
                    href={it.href}
                    {...(it.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {body}
                  </a>
                ) : (
                  <div className="ct-card">{body}</div>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Contacts;
