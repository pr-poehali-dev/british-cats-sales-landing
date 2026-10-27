import { useRef, useState } from 'react';
import Reveal from './Reveal';
import Icon from '@/components/ui/icon';

const VIDEO = 'https://cdn.poehali.dev/projects/d3e635a0-73f6-4725-9cb9-7faeace376fe/bucket/71336070-1976-43db-9329-fb01a0a6b9a6.MP4';

const ROUTE_URL = 'https://2gis.ru/vladivostok/firm/70000001105602364';

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
    note: 'Позвоните — подберём поток',
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

const RouteVideo = () => {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const start = () => {
    setStarted(true);
    const v = ref.current;
    if (v) {
      v.muted = false;
      v.play().catch(() => undefined);
    }
  };

  return (
    <div className="ct-phone">
      <div className="ct-phone-frame">
        <video
          ref={ref}
          src={VIDEO}
          poster="/contacts-video-poster.jpg"
          preload="none"
          playsInline
          controls={started}
          onEnded={() => setStarted(false)}
        />
        {!started && (
          <button type="button" className="ct-play" onClick={start} aria-label="Смотреть, как нас найти">
            <span className="ct-play-btn"><Icon name="Play" size={26} /></span>
            <span className="ct-play-text">
              <b>Как нас найти</b>
              <i>Видеомаршрут · 0:27</i>
            </span>
          </button>
        )}
      </div>
      <div className="brackets"><i /><i /><i /><i /></div>
    </div>
  );
};

const Contacts = () => {
  return (
    <section className="sec" id="contacts">
      <div className="wrap">
        <div className="ct-layout">
          <Reveal className="ct-video">
            <RouteVideo />
          </Reveal>
          <div className="ct-info">
            <Reveal className="eyebrow">// КОНТАКТЫ</Reveal>
            <Reveal as="h2" className="sec-title grad-text">Приходите в гости</Reveal>
            <Reveal as="p" className="sec-sub">
              Школа в центре Владивостока. Посмотрите видеомаршрут и ищите офис «Хакни Нейросети» на третьем этаже.
            </Reveal>
            <div className="ct-grid">
              {ITEMS.map((it, i) => {
                const body = (
                  <>
                    <span className="ct-ico"><Icon name={it.icon} size={20} fallback="CircleAlert" /></span>
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
            <Reveal className="ct-route">
              <a className="btn magnetic" href={ROUTE_URL} target="_blank" rel="noopener noreferrer">
                <Icon name="Navigation" size={16} />
                Построить маршрут в 2ГИС
              </a>
              <a className="btn btn-ghost" href="tel:+79941074310">
                <Icon name="Phone" size={16} />
                Позвонить менеджеру
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacts;