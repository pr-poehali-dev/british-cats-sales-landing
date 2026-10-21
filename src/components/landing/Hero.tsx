import { useEffect, useRef } from 'react';
import Countdown from './Countdown';
import HeroVideo from './HeroVideo';
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
        <div className="hero-v2">
          <div className="hv2-head">
            <div className="hero-tag"><i />ВЛАДИВОСТОК · ОЧНО · 3 МЕСЯЦА · С НУЛЯ</div>
            <h1>
              <span className="row"><span className="grad-text">ОСВОЙТЕ ИИ</span></span>
              <span className="row"><span className="grad-text">НА ПРАКТИКЕ</span></span>
              <span className="row"><span className="cyan">ДЛЯ СВОЕГО ДЕЛА</span></span>
              <span className="h1-seo sr-only">Курсы нейросетей во Владивостоке — живая школа «Хакни Нейросети»</span>
            </h1>
          </div>
          <div className="hv2-media">
            <HeroVideo />
            <div className="hero-start">
              <div className="timer-label">СТАРТ ПОТОКА 07.12 · ОСТАЛОСЬ 14 МЕСТ</div>
              <Countdown />
            </div>
          </div>
          <div className="hv2-body">
            <p className="hero-sub">
              Три месяца в живом классе — и у вас <b>6 готовых ИИ-инструментов</b> для своей работы или бизнеса:
              ассистент, контент, визуал, видео, сайт и автоматизация. Без программирования.
            </p>
            <div className="hero-cta">
              <a className="btn magnetic" href="#streams" onClick={(e) => scrollTo(e, '#streams')}>Подобрать поток →</a>
              <a className="btn btn-ghost magnetic" href="#final" onClick={(e) => scrollTo(e, '#final')}>Пробное занятие бесплатно</a>
            </div>
            <ul className="hero-points">
              <li><Icon name="ShieldCheck" size={16} />Вернём деньги, если после двух занятий формат не подойдёт</li>
              <li><Icon name="Wallet" size={16} />150 000 ₽ или от 12 500 ₽ в месяц</li>
              <li>
                <Icon name="Download" size={16} />
                <a
                  href="https://cdn.poehali.dev/projects/d3e635a0-73f6-4725-9cb9-7faeace376fe/bucket/59140a36-aa2c-45a5-8af4-734797273ad3.pdf"
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Скачать программу PDF
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="hero-meta">
          <div><b>72 часа</b>живой практики</div>
          <div><b>Спикер + 2 куратора</b>на каждом занятии</div>
          <div><b>До 30 человек</b>в группе</div>
          <div><b>6 месяцев</b>доступ к записям</div>
        </div>
      </div>
    </header>
  );
};

export default Hero;