import { useEffect, useRef } from 'react';

/**
 * Автоматически вписывает содержимое в ширину контейнера-обёртки,
 * уменьшая масштаб (transform: scale), если контент шире доступного места.
 * Гарантирует отсутствие обрезки текста на любом устройстве и разрешении.
 */
export function useFitWidth<Wrap extends HTMLElement = HTMLDivElement, Inner extends HTMLElement = HTMLDivElement>() {
  const wrapRef = useRef<Wrap>(null);
  const innerRef = useRef<Inner>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const fit = () => {
      inner.style.transform = 'scale(1)';
      const wrapWidth = wrap.clientWidth;
      const innerWidth = inner.scrollWidth;
      if (innerWidth > wrapWidth && wrapWidth > 0) {
        const scale = (wrapWidth / innerWidth) * 0.98;
        inner.style.transform = `scale(${scale})`;
      }
    };

    fit();

    const ro = new ResizeObserver(fit);
    ro.observe(wrap);

    window.addEventListener('resize', fit);
    document.fonts?.ready.then(fit).catch(() => {});

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', fit);
    };
  }, []);

  return { wrapRef, innerRef };
}