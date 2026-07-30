import { useEffect, useState } from 'react';

const Preloader = () => {
  const [progress, setProgress] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 1600;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setProgress(p);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setGone(true), 400);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (gone) return null;

  const total = 30 * 60;
  const left = Math.round(total * (1 - progress));
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');

  return (
    <div
      id="preloader"
      style={{
        opacity: progress >= 1 ? 0 : 1,
        transition: 'opacity .4s ease',
        pointerEvents: progress >= 1 ? 'none' : 'auto',
      }}
    >
      <img src="/site/logo.jpg" alt="Хакни Нейросети" />
      <div id="pl-num">{mm}:{ss}</div>
      <div id="pl-bar"><i style={{ width: `${progress * 100}%` }} /></div>
      <div id="pl-word">ЗАГРУЖАЕМ НЕЙРОСЕТИ</div>
    </div>
  );
};

export default Preloader;
