import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Reveal from './Reveal';
import Icon from '@/components/ui/icon';
import certCrp from '@/assets/certs/cert-crp.jpg';
import certOpora from '@/assets/certs/cert-opora.jpg';
import certRegion from '@/assets/certs/cert-region.jpg';

const AWARDS = [
  { img: certCrp, title: 'Центр развития предпринимательства', desc: 'За значительный вклад в социально-экономическое развитие города Владивостока' },
  { img: certOpora, title: '«Опора России»', desc: 'Приморское краевое отделение — за вклад в развитие предпринимательской деятельности' },
  { img: certRegion, title: 'Правительство Приморского края', desc: 'За личный вклад в развитие малого и среднего предпринимательства в регионе' },
];

const Awards = () => {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = active !== null ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [active]);

  return (
    <section className="sec" id="awards">
      <div className="wrap">
        <Reveal className="eyebrow">// 06 · ПРИЗНАНИЕ</Reveal>
        <Reveal as="h2" className="sec-title grad-text">Официальное признание</Reveal>
        <Reveal as="p" className="sec-sub">Школа отмечена благодарственными письмами от государственных и отраслевых организаций Приморья</Reveal>
        <Reveal className="awd-grid">
          {AWARDS.map((a, i) => (
            <button type="button" key={a.title} className="awd-card" onClick={() => setActive(i)}>
              <div className="awd-img-wrap">
                <img src={a.img} alt={a.title} loading="lazy" />
                <span className="awd-zoom"><Icon name="ZoomIn" size={18} /></span>
              </div>
              <h4>{a.title}</h4>
              <p>{a.desc}</p>
            </button>
          ))}
        </Reveal>
      </div>

      {active !== null && createPortal(
        <div className="awd-overlay" role="dialog" aria-modal="true" onClick={() => setActive(null)}>
          <button type="button" className="awd-close" onClick={() => setActive(null)} aria-label="Закрыть">
            <Icon name="X" size={22} />
          </button>
          <img
            className="awd-full"
            src={AWARDS[active].img}
            alt={AWARDS[active].title}
            onClick={(e) => e.stopPropagation()}
          />
        </div>,
        document.body,
      )}
    </section>
  );
};

export default Awards;
