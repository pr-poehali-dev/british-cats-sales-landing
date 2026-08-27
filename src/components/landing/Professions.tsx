import { useRef, useEffect } from 'react';
import Reveal from './Reveal';
import Icon from '@/components/ui/icon';

const PROFS = [
  { num: '01', icon: 'Smartphone', accent: 'cyan', title: 'СММ-специалист', text: 'Контент и стратегии продвижения: посты за минуты, контент-планы на месяц, разбор аудитории.' },
  { num: '02', icon: 'TrendingUp', accent: 'orange', title: 'Маркетолог', text: 'Анализ рынка и ЦА, рекламные тексты, воронки и стратегии, которые продают.' },
  { num: '03', icon: 'Palette', accent: 'cyan', title: 'Дизайнер', text: 'Визуал, логотипы, фирменный стиль и презентации студийного уровня без студии.' },
  { num: '04', icon: 'Clapperboard', accent: 'orange', title: 'Видеомейкер', text: 'Ролики, монтаж, клипы и реклама — генерация видео из текста и фото.' },
  { num: '05', icon: 'Camera', accent: 'cyan', title: 'Блогер / контент-мейкер', text: 'Нейро-аватары и клоны, Reels по трендам, съёмка без камеры.' },
  { num: '06', icon: 'BrainCircuit', accent: 'orange', title: 'Предприниматель с ИИ', text: 'Автоматизация рутины, нейросотрудники, автоворонки — бизнес без лишних наймов.' },
];

const ProfCard = ({ num, icon, accent, title, text }: { num: string; icon: string; accent: string; title: string; text: string }) => {
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
      <div className={`prof-icon prof-icon-${accent}`}>
        <div className="prof-icon-inner">
          <Icon name={icon} size={28} />
        </div>
      </div>
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
        <Reveal className="eyebrow">// 02 · ЧТО ОСВОИШЬ</Reveal>
        <Reveal as="h2" className="sec-title grad-text">6 профессий<br />на одном курсе</Reveal>
        <Reveal as="p" className="sec-sub">Не «пощупать ChatGPT», а рабочие связки инструментов под реальные задачи бизнеса и фриланса.</Reveal>
        <div className="profs">
          {PROFS.map((p, i) => (
            <Reveal key={p.num} delay={i * 0.06}>
              <ProfCard {...p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Professions;