import { useRef, useEffect } from 'react';
import Reveal from './Reveal';

const SEGMENTS = [
  {
    num: '01',
    title: 'Предпринимателям',
    text: 'Найдёте процессы, которые можно ускорить с ИИ, и создадите помощников для маркетинга, продаж, документов и работы с клиентами.',
  },
  {
    num: '02',
    title: 'Специалистам и экспертам',
    text: 'Научитесь быстрее исследовать рынок, создавать контент, визуал, презентации, сайты и цифровые продукты.',
  },
  {
    num: '03',
    title: 'Тем, кто ищет новое направление',
    text: 'Соберёте портфолио из реальных работ и поймёте, какие услуги с ИИ готовы предлагать клиентам.',
  },
];

const TRACKS = ['Маркетинг', 'Контент', 'Дизайн', 'Видео', 'Сайты', 'Автоматизация'];

const ProfCard = ({ num, title, text }: { num: string; title: string; text: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--gx', `${e.clientX - r.left}px`);
      el.style.setProperty('--gy', `${e.clientY - r.top}px`);
    };
    el.addEventListener('mousemove', move);
    return () => el.removeEventListener('mousemove', move);
  }, []);
  return (
    <div className="prof" ref={ref}>
      <div className="glare" />
      <div className="num">{num}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
};

const Professions = () => {
  return (
    <section className="sec" id="professions" style={{ background: 'var(--deep)' }}>
      <div className="wrap">
        <Reveal className="eyebrow">// КОМУ ПОДОЙДЁТ</Reveal>
        <Reveal as="h2" className="sec-title grad-text">Три причины<br />прийти на курс</Reveal>
        <Reveal as="p" className="sec-sub">
          Не «пощупать ChatGPT», а собрать рабочие связки инструментов под свою реальную задачу.
        </Reveal>
        <div className="profs profs-3">
          {SEGMENTS.map((p, i) => (
            <Reveal key={p.num} delay={i * 0.06}>
              <ProfCard {...p} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="seg-tracks">
            <h3>Освойте базу ИИ и попробуйте шесть направлений</h3>
            <p>
              Вы получите общую систему работы с ИИ, а в процессе поймёте, что полезнее именно вам.
            </p>
            <div className="seg-chips">
              {TRACKS.map((t) => <span key={t}>{t}</span>)}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.26}>
          <div className="seg-filter">
            <b>Честно: курс не подойдёт</b>
            <p>
              Тем, кто хочет получить результат без практики между занятиями, и тем, кто ожидает
              гарантированного заработка сразу после оплаты. Мы даём систему, инструменты и помощь
              в классе — результат появляется из вашей работы над своим проектом.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Professions;
