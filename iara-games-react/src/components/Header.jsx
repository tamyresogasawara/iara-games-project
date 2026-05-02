import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

export default function Header() {
  const { status, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="iara-header">
      <div className="container iara-header-inner">
        <Link to="/" className="iara-brand">
          <img src="/images/logo.png" alt="Iara Games" className="iara-logo" />
        </Link>
        {status === 'authed' && (
          <nav className="iara-nav" aria-label="Navegação principal">
            <NavLink to="/dashboard/catalogo" className={({ isActive }) => `iara-nav-link${isActive ? ' is-active' : ''}`}>
              Catálogo
            </NavLink>
            <NavLink to="/dashboard/perfil" className={({ isActive }) => `iara-nav-link${isActive ? ' is-active' : ''}`}>
              Perfil
            </NavLink>
          </nav>
        )}
        <div className="iara-header-actions">
          {status === 'authed' && user && (
            <>
              <span className="iara-user-chip" title={user.email}>
                {user.image && <img src={user.image} alt="" className="iara-user-avatar" />}
                <span>{user.firstName}</span>
              </span>
              <button type="button" className="btn btn-secondary" onClick={handleLogout}>
                Sair
              </button>
            </>
          )}
          {status === 'anon' && (
            <Link to="/login" className="btn btn-primary">Entrar</Link>
          )}
        </div>
      </div>
    </header>
  );
}
