import { scrollToSection } from '@/lib/scroll';
import Reveal from './Reveal';
import { useFitWidth } from '@/hooks/use-fit-width';

const scrollTo = (e: React.MouseEvent, href: string) => {
  e.preventDefault();
  scrollToSection(href);
};

const NAV = [
  { href: '#program', label: 'Программа' },
  { href: '#speaker', label: 'Спикер' },
  { href: '#cases', label: 'Результаты' },
  { href: '#pricing', label: 'Тарифы' },
  { href: '#faq', label: 'Вопросы' },
];

const FootWord = () => {
  const { wrapRef, innerRef } = useFitWidth<HTMLDivElement, HTMLDivElement>();
  return (
    <Reveal className="foot-word-outer">
      <div ref={wrapRef} className="foot-word-wrap">
        <div ref={innerRef} className="foot-word-inner">
          <span className="foot-word" aria-hidden="true">ХАКНИ НЕЙРОСЕТИ</span>
          <span className="foot-word foot-word-shine" aria-hidden="true">ХАКНИ НЕЙРОСЕТИ</span>
        </div>
      </div>
    </Reveal>
  );
};

const Footer = () => {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <img src="/site/logo.jpg" alt="Хакни Нейросети" />
            <p>Первая живая школа нейросетей на Дальнем Востоке. Учим зарабатывать с ИИ — с нуля, вживую, с кураторами.</p>
          </div>
          <div>
            <h5>Контакты</h5>
            <a href="https://t.me/chernikovgpt" target="_blank" rel="noopener">Telegram-канал — @chernikovgpt</a>
            <a href="https://t.me/ChernikovGPT_Bot" target="_blank" rel="noopener">Бот консультаций — @ChernikovGPT_Bot</a>
            <a>Владивосток, ул. Русская 41а, 3 этаж</a>
            <a>Пн–Пт · 10:00–19:00</a>
          </div>
          <div>
            <h5>Навигация</h5>
            {NAV.map((n) => (
              <a key={n.href} href={n.href} onClick={(e) => scrollTo(e, n.href)}>{n.label}</a>
            ))}
          </div>
        </div>
        <FootWord />
        <div className="foot-bottom">
          <span>© 2026 ХАКНИ НЕЙРОСЕТИ · ИП ЧЕРНИКОВ С.Н. · ОГРН 321253600091137 · ИНН 783801003680</span>
          <span>VLADIVOSTOK · 43.11°N 131.88°E</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;