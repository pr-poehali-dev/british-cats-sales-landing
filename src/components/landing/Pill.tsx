import { useEffect, useState } from 'react';

const TARGET = new Date('2026-09-14T00:00:00+10:00').getTime();

const Pill = () => {
  const [show, setShow] = useState(false);
  const days = Math.max(0, Math.floor((TARGET - Date.now()) / 86400000));

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setShow(y > 700 && y < h - 700);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div id="pill" className={show ? 'show' : ''}>
      <span>До старта потока:</span>
      <b>{days} дней</b>
      <a
        className="btn btn-sm"
        href="#pricing"
        onClick={(e) => {
          e.preventDefault();
          const target = document.getElementById('pricing');
          if (!target) return;
          const navH = (document.getElementById('nav')?.offsetHeight ?? 0) + 12;
          window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
        }}
      >
        Занять место
      </a>
    </div>
  );
};

export default Pill;