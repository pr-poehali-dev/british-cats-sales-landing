import { useEffect, useRef, useState } from 'react';

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
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      setHide(y > lastY.current && y > 400);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav id="nav" className={`${solid ? 'solid' : ''} ${hide ? 'hide' : ''}`}>
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
        <a className="btn btn-sm" href="#final" onClick={(e) => scrollTo(e, '#final')}>Занять место</a>
      </div>
    </nav>
  );
};

export default Navbar;
