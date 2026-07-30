import { useEffect, useRef, useState } from 'react';

interface Props {
  to: number;
  dec?: number;
  suffix?: string;
  duration?: number;
}

const CountUp = ({ to, dec = 0, suffix = '', duration = 1600 }: Props) => {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !done.current) {
        done.current = true;
        const start = performance.now();
        const step = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(to * eased);
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  const shown = dec > 0 ? val.toFixed(dec) : Math.round(val).toLocaleString('ru-RU');
  return <b ref={ref}>{shown}{suffix}</b>;
};

export default CountUp;
