import Reveal from './Reveal';
import { openGiftPopup } from '@/lib/giftPopup';
import photo1 from '@/assets/class/class-1.jpg';
import photo2 from '@/assets/class/class-2.jpg';
import photo3 from '@/assets/class/class-3.jpg';
import photo4 from '@/assets/class/class-4.jpg';

const PHOTOS = [
  { src: photo1, alt: 'Живой класс на Русской 41а' },
  { src: photo2, alt: 'Практика на занятии' },
  { src: photo3, alt: 'Выпускники с сертификатами школы' },
  { src: photo4, alt: 'Разбор материала в группе' },
];

const ClassPhotos = () => {
  return (
    <section className="sec" id="class-photos">
      <div className="wrap">
        <Reveal className="eyebrow">// 10 · КЛАСС</Reveal>
        <Reveal as="h2" className="sec-title grad-text">Как проходит занятие</Reveal>
        <Reveal as="p" className="sec-sub">Владивосток, ул. Русская 41а, 3 этаж. Так выглядит наш класс изнутри.</Reveal>
        <Reveal className="class-grid">
          {PHOTOS.map((p) => (
            <div className="class-photo" key={p.src}>
              <img src={p.src} alt={p.alt} loading="lazy" />
            </div>
          ))}
        </Reveal>
        <Reveal className="class-cta" delay={0.1}>
          <p>Хочешь посмотреть своими глазами — приходи на пробное занятие</p>
          <button type="button" className="btn btn-ghost magnetic" onClick={() => openGiftPopup()}>
            Записаться →
          </button>
        </Reveal>
      </div>
    </section>
  );
};

export default ClassPhotos;