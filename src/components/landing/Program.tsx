import { useEffect, useRef, useState } from 'react';
import Reveal from './Reveal';

const MODULES = [
  { n: '01', t: 'Основы нейросетей', d: 'Как устроены LLM, что они умеют на самом деле, где границы. Снимаем магию — оставляем инструмент.' },
  { n: '02', t: 'ChatGPT на практике', d: 'Настройка, режимы работы, первые рабочие сценарии под твою нишу уже на первом занятии.' },
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
  { n: '15', t: 'Генерация изображений', d: 'Визуалы, карточки, обложки и иллюстрации под задачу — Midjourney, Kandinsky, Nano Banana.' },
  { n: '16', t: 'Генерация видео', d: 'Ролики и клипы из текста и фото: Seedance, Runway. Реклама без съёмочной группы.' },
  { n: '17', t: 'Работа с голосом и звуком', d: 'Озвучка, клонирование голоса, музыка и звуковые эффекты для контента.' },
  { n: '18', t: 'Дизайн и презентации', d: 'Логотипы, фирменный стиль и продающие презентации студийного уровня без студии.' },
  { n: '19', t: 'Автоматизация процессов', d: 'Связки инструментов и сценарии, которые снимают рутину и работают без тебя.' },
  { n: '20', t: 'Чат-боты и ассистенты', d: 'Собственные боты в Telegram на Salebot: поддержка, продажи, приём заявок.' },
  { n: '21', t: 'Аналитика и данные', d: 'Отчёты, таблицы и выводы из данных за минуты — вместо часов ручной работы.' },
  { n: '22', t: 'Личный бренд с ИИ', d: 'Упаковка эксперта, системный контент и репутация, которая приводит клиентов.' },
  { n: '23', t: 'Масштабирование и продажи', d: 'Как выстроить поток заказов, поднять чек и превратить навык в стабильный доход.' },
  { n: '24', t: 'Экзамен и сертификат', d: 'Финальный проект, защита перед кураторами и сертификат школы. Бонус: уроки по чат-ботам Salebot.' },
];

const Program = () => {
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width:900px)');
    const upd = () => setIsMobile(mq.matches);
    upd();
    mq.addEventListener('change', upd);
    return () => mq.removeEventListener('change', upd);
  }, []);

  useEffect(() => {
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
  }, []);

  const pct = Math.round((active / MODULES.length) * 100);
  const dash = 364;
  const offset = dash - (dash * pct) / 100;

  return (
    <section className="sec" id="program">
      <div className="wrap">
        <div className="prog-layout">
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
          <div className="modules">
            {MODULES.map((m, i) => {
              // На мобильном показываем модули постепенно: видимы только до active+1,
              // следующий выезжает по мере прокрутки — список не грузит экран сразу.
              const revealed = !isMobile || i <= active;
              return (
                <div
                  key={m.n}
                  data-idx={i}
                  ref={(el) => (refs.current[i] = el)}
                  className={`module${i < active ? ' active' : ''}`}
                  style={isMobile ? {
                    opacity: revealed ? 1 : 0,
                    transform: revealed ? 'none' : 'translateX(-60px)',
                    maxHeight: revealed ? 400 : 0,
                    paddingTop: revealed ? undefined : 0,
                    paddingBottom: revealed ? undefined : 0,
                    borderTopWidth: revealed ? undefined : 0,
                    overflow: 'hidden',
                    transition: 'opacity .5s var(--ease), transform .5s var(--ease), max-height .5s var(--ease), padding .5s var(--ease)',
                  } : undefined}
                >
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
      </div>
    </section>
  );
};

export default Program;