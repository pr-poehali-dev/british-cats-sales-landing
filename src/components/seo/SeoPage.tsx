import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import Icon from '@/components/ui/icon';

interface Crumb {
  to: string;
  label: string;
}

interface Props {
  eyebrow: string;
  h1: string;
  lead: string;
  crumbs?: Crumb[];
  children: ReactNode;
}

const SeoPage = ({ eyebrow, h1, lead, crumbs = [], children }: Props) => {
  return (
    <>
      <div className="noise" />
      <Navbar />
      <main className="seo-page">
        <div className="wrap">
          <nav className="seo-crumbs" aria-label="Хлебные крошки">
            <Link to="/">Главная</Link>
            {crumbs.map((c) => (
              <span key={c.to}>
                <Icon name="ChevronRight" size={13} />
                <Link to={c.to}>{c.label}</Link>
              </span>
            ))}
          </nav>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="seo-h1 grad-text">{h1}</h1>
          <p className="seo-lead">{lead}</p>
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SeoPage;
