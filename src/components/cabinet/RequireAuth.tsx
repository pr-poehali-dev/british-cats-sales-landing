import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useCabinet } from '@/contexts/CabinetAuth';

interface Props {
  children: ReactNode;
  role?: 'student' | 'admin';
}

const RequireAuth = ({ children, role }: Props) => {
  const { me, loading } = useCabinet();
  const loc = useLocation();

  if (loading) return <div className="cab cab-loading">ЗАГРУЗКА…</div>;
  if (!me) return <Navigate to="/cabinet/login" replace state={{ from: loc.pathname }} />;
  if (role && me.role !== role) {
    return <Navigate to={me.role === 'admin' ? '/cabinet/admin' : '/cabinet'} replace />;
  }
  if (me.role === 'student' && !me.has_profile && loc.pathname !== '/cabinet/setup') {
    return <Navigate to="/cabinet/setup" replace />;
  }
  if (me.role === 'student' && me.has_profile && loc.pathname === '/cabinet/setup') {
    return <Navigate to="/cabinet" replace />;
  }
  return <>{children}</>;
};

export default RequireAuth;