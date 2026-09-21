import { useEffect, useRef, useState } from 'react';

interface Props {
  to: number;
  dec?: number;
  suffix?: string;
  duration?: number;
}

const format = (v: number, dec: number) =>
  dec > 0 ? v.toFixed(dec) : Math.round(v).toLocaleString('ru-RU');

const CountUp = ({ to, dec = 0, suffix = '', duration = 1600 }: Props) => {
  const final = `${format(to, dec)}${suffix}`;
  const [val, setVal] = useState<number | null>(null);
  const ref = useRef<HTMLElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !done.current) {
        done.current = true;
        const start = performance.now();
        const step = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(p < 1 ? to * eased : null);
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, dec, duration]);

  return (
    <b ref={ref} aria-label={final}>
      <span aria-hidden={val !== null ? true : undefined}>
        {val === null ? final : `${format(val, dec)}${suffix}`}
      </span>
    </b>
  );
};

export default CountUp;
