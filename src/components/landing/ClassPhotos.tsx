import Reveal from './Reveal';
import Icon from '@/components/ui/icon';
import { scrollToSection } from '@/lib/scroll';

const PHOTOS = [
  { alt: 'Живой класс на Русской 41а' },
  { alt: 'Практика на занятии' },
  { alt: 'Работа в группах' },
  { alt: 'Разбор проектов с куратором' },
];

const ClassPhotos = () => {
  return (
    <section className="sec" id="class-photos">
      <div className="wrap">
        <Reveal className="eyebrow">// 10 · КЛАСС</Reveal>
        <Reveal as="h2" className="sec-title grad-text">Как проходит занятие</Reveal>
        <Reveal as="p" className="sec-sub">Владивосток, ул. Русская 41а, 3 этаж. Так выглядит наш класс изнутри.</Reveal>
        <Reveal className="class-grid">
          {PHOTOS.map((p, i) => (
            <div className="class-photo" key={i}>
              <Icon name="Camera" size={28} />
              <span>Фото скоро</span>
            </div>
          ))}
        </Reveal>
        <Reveal className="class-cta" delay={0.1}>
          <p>Хочешь посмотреть своими глазами — приходи на пробное занятие</p>
          <a
            className="btn btn-ghost magnetic"
            href="#pricing"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#pricing');
            }}
          >
            Записаться →
          </a>
        </Reveal>
      </div>
    </section>
  );
};

export default ClassPhotos;
