import { useEffect, useRef, useState } from 'react';
import Reveal from './Reveal';
import CountUp from './CountUp';
import Icon from '@/components/ui/icon';
import LossCalculatorModal from './LossCalculatorModal';

const WORD = 'УСВОЯЕМОСТЬ';

const VsBar = ({ w, off }: { w: number; off?: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [filled, setFilled] = useState(false);
  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver((e) => {
      if (e[0].isIntersecting) { setFilled(true); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className="vs-bar" ref={ref}>
      <i style={{ width: filled ? `${w}%` : 0, transition: 'width 1.2s cubic-bezier(.16,1,.3,1)', background: off ? 'var(--t3)' : 'var(--cyan)' }} />
    </div>
  );
};

const VsLabel = ({ off }: { off?: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver((e) => {
      if (e[0].isIntersecting) {
        io.disconnect();
        const step = (i: number) => {
          setShown(i);
          if (i < WORD.length) setTimeout(() => step(i + 1), 55);
        };
        setTimeout(() => step(1), 300);
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const done = shown >= WORD.length;
  return (
    <div className={`vs-label ${off ? 'off' : 'on'}`} ref={ref}>
      <span className="vs-label-text">{WORD.slice(0, shown)}</span>
      {done && (
        <Icon
          name={off ? 'OctagonX' : 'CheckCircle2'}
          size={18}
          className="vs-label-icon"
        />
      )}
    </div>
  );
};

const Versus = () => {
  const [calcOpen, setCalcOpen] = useState(false);
  return (
    <section className="sec" id="versus" style={{ background: 'var(--deep)' }}>
      <div className="wrap">
        <Reveal className="eyebrow">// 08 · ФОРМАТ</Reveal>
        <Reveal as="h2" className="sec-title grad-text">Почему живой класс,<br />а не онлайн-записи</Reveal>
        <div className="vs">
          <Reveal className="vs-col on">
            <h3 className="cyan">ЖИВОЙ КЛАСС · ХАКНИ НЕЙРОСЕТИ</h3>
            <div className="vs-pct-row">
              <div className="vs-pct"><CountUp to={90} suffix="%" /></div>
              <VsLabel />
            </div>
            <VsBar w={90} />
            <ul>
              <li>Спикер + 2 куратора-практика на каждом занятии</li>
              <li>Разбор твоих вопросов в реальном времени</li>
              <li>Среда таких же: партнёрства и клиенты прямо в группе</li>
              <li>Домашние задания с проверкой и обратной связью</li>
            </ul>
          </Reveal>
          <Reveal className="vs-col off" delay={0.1}>
            <h3 style={{ color: 'var(--t2)' }}>ТИПИЧНЫЙ ОНЛАЙН-КУРС</h3>
            <div className="vs-pct-row">
              <div className="vs-pct"><CountUp to={12} suffix="%" /></div>
              <VsLabel off />
            </div>
            <VsBar w={12} off />
            <ul>
              <li>Записи, которые «посмотришь потом»</li>
              <li>Вопрос в чате — ответ через сутки</li>
              <li>Никто не заметит, что ты бросил</li>
              <li>Доводимость до результата 10–15%</li>
            </ul>
          </Reveal>
        </div>
        <Reveal className="vs-calc-cta" delay={0.15}>
          <button type="button" className="btn btn-ghost" onClick={() => setCalcOpen(true)}>
            <Icon name="Calculator" size={18} />
            Посчитать, сколько теряю без ИИ
          </button>
        </Reveal>
      </div>
      <LossCalculatorModal open={calcOpen} onClose={() => setCalcOpen(false)} />
    </section>
  );
};

export default Versus;