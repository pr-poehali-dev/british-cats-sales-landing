import { type ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCabinet } from '@/contexts/CabinetAuth';

const STUDENT_NAV = [
  { to: '/cabinet', label: 'ГЛАВНАЯ', end: true },
  { to: '/cabinet/profile', label: 'ПРОФИЛЬ' },
];

const ADMIN_NAV = [
  { to: '/cabinet/admin', label: 'ОБЗОР', end: true },
  { to: '/cabinet/admin/codes', label: 'КОДЫ ДОСТУПА' },
];

const CabinetShell = ({ children }: { children: ReactNode }) => {
  const { me, logout } = useCabinet();
  const nav = useNavigate();
  const items = me?.role === 'admin' ? ADMIN_NAV : STUDENT_NAV;

  const doLogout = async () => {
    await logout();
    nav('/cabinet/login', { replace: true });
  };

  return (
    <div className="cab">
      <header className="cab-top">
        <div className="cab-top-inner">
          <Link className="cab-top-logo" to={me?.role === 'admin' ? '/cabinet/admin' : '/cabinet'}>
            <img src="/site/logo.jpg" alt="Хакни Нейросети" />
            <span>ХАКНИ<br />НЕЙРОСЕТИ</span>
          </Link>
          <nav className="cab-top-nav">
            {items.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => (isActive ? 'active' : '')}>
                {n.label}
              </NavLink>
            ))}
          </nav>
          <button className="cab-logout" onClick={doLogout}>ВЫЙТИ</button>
        </div>
      </header>
      <main className="cab-main">{children}</main>
    </div>
  );
};

export default CabinetShell;
