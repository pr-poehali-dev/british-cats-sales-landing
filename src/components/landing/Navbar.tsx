import { useEffect, useRef, useState } from 'react';
import { scrollToSection } from '@/lib/scroll';

const LINKS = [
  { href: '#program', label: 'Программа' },
  { href: '#speaker', label: 'Спикер' },
  { href: '#cases', label: 'Результаты' },
  { href: '#pricing', label: 'Тарифы' },
  { href: '#faq', label: 'FAQ' },
];

const Navbar = () => {
  const [solid, setSolid] = useState(false);
  const [hide, setHide] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      setHide(y > lastY.current && y > 400 && !open);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const scrollTo = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setOpen(false);
    setTimeout(() => scrollToSection(href), 10);
  };

  return (
    <nav id="nav" className={`${solid || open ? 'solid' : ''} ${hide ? 'hide' : ''}`}>
      <a className="nav-logo" href="#hero" onClick={(e) => scrollTo(e, '#hero')}>
        <img src="/site/logo.jpg" alt="ХН" />
        <b>ХАКНИ<br />НЕЙРОСЕТИ</b>
      </a>
      <div className="nav-links">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={(e) => scrollTo(e, l.href)}>{l.label}</a>
        ))}
      </div>
      <div className="nav-right">
        <span className="chip-seats">ОСТАЛОСЬ 7 МЕСТ</span>
        <a className="btn btn-sm" href="#pricing" onClick={(e) => scrollTo(e, '#pricing')}>Занять место</a>
      </div>
      <button
        className={`nav-burger${open ? ' open' : ''}`}
        aria-label="Меню"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span /><span /><span />
      </button>
      <div className={`nav-mobile${open ? ' open' : ''}`}>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={(e) => scrollTo(e, l.href)}>{l.label}</a>
        ))}
        <span className="chip-seats mob">ОСТАЛОСЬ 7 МЕСТ</span>
        <a className="btn" href="#pricing" onClick={(e) => scrollTo(e, '#pricing')}>Занять место →</a>
      </div>
    </nav>
  );
};

export default Navbar;