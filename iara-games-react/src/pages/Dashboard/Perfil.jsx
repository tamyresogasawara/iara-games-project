import { useAuth } from '../../context/AuthContext';

export default function Perfil() {
  const { user } = useAuth();
  if (!user) return null;

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');

  return (
    <>
      <h1 className="dashboard-title">Perfil</h1>
      <p className="dashboard-subtitle">Dados vindos de <code>GET /auth/me</code> (DummyJSON).</p>
      <section className="dashboard-section" aria-labelledby="perfil-heading">
        <h2 id="perfil-heading" style={{ position: 'absolute', left: '-9999px' }}>Dados do usuário</h2>
        <div className="profile-grid">
          <img
            src={user.image || '/images/logo.png'}
            alt={`Avatar de ${fullName}`}
            className="profile-avatar"
          />
          <div>
            <p className="profile-name">{fullName || user.username}</p>
            <dl className="profile-meta">
              <div><dt>Usuário</dt><dd>@{user.username}</dd></div>
              <div><dt>Email</dt><dd>{user.email}</dd></div>
              {user.gender && <div><dt>Gênero</dt><dd>{user.gender}</dd></div>}
              {user.id && <div><dt>ID</dt><dd>{user.id}</dd></div>}
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
