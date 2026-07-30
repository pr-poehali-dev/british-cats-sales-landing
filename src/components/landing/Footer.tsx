const scrollTo = (e: React.MouseEvent, href: string) => {
  e.preventDefault();
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
};

const NAV = [
  { href: '#program', label: 'Программа' },
  { href: '#speaker', label: 'Спикер' },
  { href: '#cases', label: 'Результаты' },
  { href: '#pricing', label: 'Тарифы' },
  { href: '#faq', label: 'Вопросы' },
];

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
        <div className="foot-word">ХАКНИ НЕЙРОСЕТИ</div>
        <div className="foot-bottom">
          <span>© 2026 ХАКНИ НЕЙРОСЕТИ · ИП ЧЕРНИКОВ С.А.</span>
          <span>VLADIVOSTOK · 43.11°N 131.88°E</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
