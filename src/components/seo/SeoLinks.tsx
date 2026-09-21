import { Link } from 'react-router-dom';

const ALL = [
  { to: '/course', label: 'Курс нейросетей' },
  { to: '/corporate', label: 'Корпоративное обучение' },
  { to: '/neyroseti-s-nulya', label: 'Нейросети с нуля' },
  { to: '/zarabotok-na-neyrosetyah', label: 'Заработок на нейросетях' },
  { to: '/about', label: 'О школе' },
  { to: '/sergey-chernikov', label: 'Сергей Черников' },
  { to: '/reviews', label: 'Отзывы' },
];

const SeoLinks = ({ exclude = '' }: { exclude?: string }) => (
  <nav className="seo-links" aria-label="Разделы сайта">
    <Link to="/">Главная</Link>
    {ALL.filter((l) => l.to !== exclude).map((l) => (
      <Link key={l.to} to={l.to}>{l.label}</Link>
    ))}
  </nav>
);

export default SeoLinks;
