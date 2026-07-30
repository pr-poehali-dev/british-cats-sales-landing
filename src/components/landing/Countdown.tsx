import { useEffect, useState } from 'react';

const TARGET = new Date('2026-09-14T00:00:00+10:00').getTime();

const calc = () => {
  const diff = Math.max(0, TARGET - Date.now());
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s };
};

const pad = (n: number) => String(n).padStart(2, '0');

const Countdown = () => {
  const [t, setT] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  const cells: [number, string][] = [
    [t.d, 'дней'],
    [t.h, 'часов'],
    [t.m, 'минут'],
    [t.s, 'секунд'],
  ];

  return (
    <div className="timer">
      {cells.map(([val, label], i) => (
        <div key={label} style={{ display: 'contents' }}>
          <div className="t-cell"><b>{pad(val)}</b><span>{label}</span></div>
          {i < cells.length - 1 && <div className="t-sep">:</div>}
        </div>
      ))}
    </div>
  );
};

export default Countdown;
