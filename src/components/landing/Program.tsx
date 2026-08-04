import { useEffect, useRef, useState } from 'react';
import Reveal from './Reveal';

const MODULES = [
  { n: '01', t: 'Основы нейросетей', d: 'Как устроены LLM, что они умеют на самом деле, где границы. Снимаем магию — оставляем инструмент.' },
  { n: '02', t: 'LLM на практике', d: 'Настройка, режимы работы, первые рабочие сценарии под твою нишу уже на первом занятии.' },
  { n: '03', t: 'Промптовое мышление', d: 'Фирменная система промптов школы: как получать результат с первого запроса, а не с двадцатого.' },
  { n: '04', t: 'Создание клона', d: 'Нейро-аватар, который говорит твоим голосом и выглядит как ты. Контент без камеры.' },
  { n: '05', t: 'Контент-маркетинг с ИИ', d: 'Посты, сценарии, контент-планы: производство контента в 10 раз быстрее.' },
  { n: '06', t: 'Распаковка экспертности и продукта', d: 'Вытаскиваем из головы то, за что клиенты готовы платить, и упаковываем в оффер.' },
  { n: '07', t: 'Исследование ЦА', d: 'Нейросети считают портрет клиента, боли и возражения — точнее, чем «на глаз».' },
  { n: '08', t: 'Конкурентная разведка', d: 'Разбираем конкурентов до винтика: цены, связки, слабые места — и обходим их.' },
  { n: '09', t: 'Контентная матрица и упаковка профиля', d: 'Система тем под твою нишу + профиль, который продаёт вместо тебя.' },
  { n: '10', t: 'Создание сайта', d: 'Свой лендинг на нейросетях: структура, тексты, дизайн, публикация — без программиста.' },
  { n: '11', t: 'Лид-магниты и трипваеры', d: 'Продукты-входы, которые собирают базу и прогревают к продаже.' },
  { n: '12', t: 'Воронки продаж и автоворонки', d: 'Связки, которые ведут клиента от первого касания до оплаты — на автопилоте.' },
  { n: '13', t: 'Заработок на нейросетях', d: 'Модели монетизации: услуги, фриланс, внедрение в свой бизнес. Разбор первых заказов.' },
  { n: '14', t: 'Нейросотрудники', d: 'ИИ-агенты на рутинные роли: поддержка, продажи, контент. Экономия сотен тысяч в месяц.' },
  { n: '15', t: 'Генерация изображений', d: 'Визуалы, карточки, обложки и иллюстрации под задачу — GPT 2, Seedream, Nano Banana.' },
  { n: '16', t: 'Генерация видео', d: 'Ролики и клипы из текста и фото: Seedance, Kling, Gemini Omni Flash. Реклама без съёмочной группы.' },
  { n: '17', t: 'Работа с голосом и звуком', d: 'Озвучка, клонирование голоса, музыка и звуковые эффекты для контента.' },
  { n: '18', t: 'Дизайн и презентации', d: 'Логотипы, фирменный стиль и продающие презентации студийного уровня без студии.' },
  { n: '19', t: 'Автоматизация процессов', d: 'Связки инструментов и сценарии, которые снимают рутину и работают без тебя.' },
  { n: '20', t: 'Чат-боты и ассистенты', d: 'Собственные боты в Telegram: поддержка, продажи, приём заявок.' },
  { n: '21', t: 'Аналитика и данные', d: 'Отчёты, таблицы и выводы из данных за минуты — вместо часов ручной работы.' },
  { n: '22', t: 'Личный бренд с ИИ', d: 'Упаковка эксперта, системный контент и репутация, которая приводит клиентов.' },
  { n: '23', t: 'Масштабирование и продажи', d: 'Как выстроить поток заказов, поднять чек и превратить навык в стабильный доход.' },
  { n: '24', t: 'Экзамен и сертификат', d: 'Финальный проект, защита перед кураторами и сертификат школы.' },
];

const Program = () => {
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width:900px)');
    const upd = () => setIsMobile(mq.matches);
    upd();
    mq.addEventListener('change', upd);
    return () => mq.removeEventListener('change', upd);
  }, []);

  // Десктоп: подсветка модулей по мере попадания в зону видимости.
  useEffect(() => {
    if (isMobile) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const idx = Number((e.target as HTMLElement).dataset.idx);
          setActive((prev) => Math.max(prev, idx + 1));
        }
      });
    }, { threshold: 0.6, rootMargin: '0px 0px -20% 0px' });
    refs.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, [isMobile]);

  // Мобильный: sticky-карусель. Прогресс прокрутки трека → индекс активного модуля.
  // Один блок виден за раз, при скролле уезжает влево, следующий приезжает справа.
  useEffect(() => {
    if (!isMobile) return;
    const onScroll = () => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      const passed = Math.min(Math.max(-rect.top, 0), scrollable);
      const p = scrollable > 0 ? passed / scrollable : 0;
      const idx = Math.min(MODULES.length - 1, Math.round(p * (MODULES.length - 1)));
      setActive(idx);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [isMobile]);

  const activeCount = isMobile ? active + 1 : active;
  const pct = Math.round((activeCount / MODULES.length) * 100);
  const dash = 364;
  const offset = dash - (dash * pct) / 100;

  const header = (
    <div className="prog-sticky">
      <Reveal className="eyebrow">// 03 · ПРОГРАММА</Reveal>
      <Reveal as="h2" className="sec-title grad-text">24 модуля.<br />Ноль воды.</Reveal>
      <Reveal as="p" className="sec-sub">Каждый модуль — практика на своём проекте. Листай — программа оживает.</Reveal>
      <div className="prog-ring">
        <svg width="130" height="130">
          <circle cx="65" cy="65" r="58" fill="none" stroke="var(--line)" strokeWidth="3" />
          <circle cx="65" cy="65" r="58" fill="none" stroke="var(--cyan)" strokeWidth="3" strokeDasharray={dash} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset .5s cubic-bezier(.16,1,.3,1)' }} />
        </svg>
        <div className="val mono">{pct}%</div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <section className="sec" id="program">
        <div className="wrap">{header}</div>
        <div className="prog-track" ref={trackRef} style={{ height: `${MODULES.length * 60 + 100}vh` }}>
          <div className="prog-stage">
            <div className="prog-count mono">{String(active + 1).padStart(2, '0')} / {MODULES.length}</div>
            {MODULES.map((m, i) => {
              const state = i === active ? 'cur' : i < active ? 'past' : 'next';
              return (
                <div key={m.n} className={`prog-slide ${state}`}>
                  <div className="m-num">{m.n}</div>
                  <div>
                    <h3>{m.t}</h3>
                    <p>{m.d}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="sec" id="program">
      <div className="wrap">
        <div className="prog-layout">
          {header}
          <div className="modules">
            {MODULES.map((m, i) => (
              <div
                key={m.n}
                data-idx={i}
                ref={(el) => (refs.current[i] = el)}
                className={`module${i < active ? ' active' : ''}`}
              >
                <div className="m-num">{m.n}</div>
                <div>
                  <h3>{m.t}</h3>
                  <p>{m.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Program;