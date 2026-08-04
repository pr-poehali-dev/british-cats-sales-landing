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
            <div className="foot-glitch">
              <img className="fg-robot" src="https://cdn.poehali.dev/projects/d3e635a0-73f6-4725-9cb9-7faeace376fe/bucket/2a99f48e-b96a-4740-b7b5-20e600a11814.png" alt="" aria-hidden />
              <img className="fg-human" src="/site/speaker.jpg" alt="Сергей Черников" />
            </div>
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