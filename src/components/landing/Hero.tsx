import { useEffect, useRef } from 'react';
import Countdown from './Countdown';
import Icon from '@/components/ui/icon';
import { scrollToSection } from '@/lib/scroll';

const scrollTo = (e: React.MouseEvent, href: string) => {
  e.preventDefault();
  scrollToSection(href);
};

const Particles = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    let raf = 0;
    let w = 0, h = 0;
    const dots: { x: number; y: number; vx: number; vy: number }[] = [];

    const seed = () => {
      dots.length = 0;
      const count = Math.min(220, Math.max(80, Math.floor((w * h) / 9000)));
      for (let i = 0; i < count; i++) {
        dots.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3 });
      }
    };
    const resize = () => {
      const nw = canvas.offsetWidth;
      const nh = canvas.offsetHeight;
      if (nw === w && nh === h) return;
      w = canvas.width = nw;
      h = canvas.height = nh;
      seed();
    };
    const forceReseed = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      seed();
    };
    forceReseed();
    const t1 = setTimeout(forceReseed, 300);
    const t2 = setTimeout(forceReseed, 1200);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of dots) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,229,245,.5)';
        ctx.fill();
      }
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(0,229,245,${0.12 * (1 - dist / 150)})`;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener('resize', resize);
    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); ro.disconnect(); clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return <canvas id="particles" ref={ref} />;
};

const Hero = () => {
  return (
    <header id="hero">
      <Particles />
      <div className="spot l" /><div className="spot r" />
      <div className="grid-bg" />
      <div className="wrap hero-inner">
        <div className="hero-tag"><i />ВЛАДИВОСТОК · ЖИВОЙ КЛАСС · 43.11°N 131.88°E</div>
        <h1>
          <span className="row"><span className="grad-text">НАУЧИСЬ</span></span>
          <span className="row"><span className="grad-text">ЗАРАБАТЫВАТЬ</span></span>
          <span className="row"><span className="cyan">С НЕЙРОСЕТЯМИ</span></span>
        </h1>
        <div className="hero-grid">
          <div>
            <p className="hero-sub">Практический курс по нейросетям для предпринимателей и специалистов — даже если начинаешь с нуля. 3 месяца в живом классе с кураторами, и ИИ начнёт работать на тебя.</p>
            <div className="hero-cta">
              <a className="btn magnetic" href="#pricing" onClick={(e) => scrollTo(e, '#pricing')}>Занять место →</a>
              <a className="btn btn-ghost magnetic" href="#program" onClick={(e) => scrollTo(e, '#program')}>Программа курса</a>
            </div>
            <div className="hero-note-row">
              <div className="hero-cta-note glow">Рассрочка от 12 500 ₽/мес · Курс окупается 1–2 заказами (один ИИ-проект стоит от 30 000 ₽)</div>
              <a
                className="btn btn-ghost btn-sm hero-download"
                href="https://cdn.poehali.dev/projects/d3e635a0-73f6-4725-9cb9-7faeace376fe/bucket/59140a36-aa2c-45a5-8af4-734797273ad3.pdf"
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="Download" size={14} />
                Скачать программу
              </a>
            </div>
            <div className="timer-wrap">
              <div>
                <div className="timer-label">ДО СТАРТА ПОТОКА · 14.09.2026</div>
                <Countdown />
              </div>
            </div>
            <div className="hero-meta">
              <div><b>72 часа</b>практики</div>
              <div><b>2 раза</b>в неделю по 3 часа</div>
              <div><b>30 мест</b>в группе</div>
              <div><b>6 месяцев</b>доступ к записям</div>
            </div>
          </div>
          <div className="portrait" role="button" tabIndex={0} onClick={(e) => scrollTo(e, '#speaker')} style={{ cursor: 'pointer' }}>
            <div className="frame hero-glitch">
              <img className="hg-robot" src="https://cdn.poehali.dev/projects/d3e635a0-73f6-4725-9cb9-7faeace376fe/bucket/2a99f48e-b96a-4740-b7b5-20e600a11814.png" alt="" aria-hidden />
              <img className="hg-human" src="/site/speaker.jpg" alt="Сергей Черников" />
            </div>
            <div className="brackets"><i /><i /><i /><i /></div>
            <div className="float-tag t1">СЕРГЕЙ ЧЕРНИКОВ · СПИКЕР</div>
            <div className="float-tag t2">10 000+ УЧЕНИКОВ НА ПРОГРАММАХ С 2018 ГОДА</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;