import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import './Login.css';

const TEST_CREDS = { username: 'emilys', password: 'emilyspass' };

export default function Login() {
  const { status, login, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/dashboard/perfil';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'authed') navigate(redirectTo, { replace: true });
  }, [status, navigate, redirectTo]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const result = await login(username.trim(), password);
    setSubmitting(false);
    if (result.ok) navigate(redirectTo, { replace: true });
  }

  function fillTestCredentials() {
    setUsername(TEST_CREDS.username);
    setPassword(TEST_CREDS.password);
  }

  return (
    <main className="login-shell">
      <section className="login-card" aria-labelledby="login-title">
        <header className="login-header">
          <img src="/images/logo.png" alt="Iara Games" className="login-logo" />
          <h1 id="login-title">Entrar na sua área</h1>
          <p className="muted-text">Use suas credenciais DummyJSON para acessar o catálogo e seu perfil.</p>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <label className="login-field">
            <span>Usuário</span>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </label>

          <label className="login-field">
            <span>Senha</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && (
            <p className="error-text" role="alert">
              {error.kind === 'network' ? 'Erro de rede. Tente novamente.' : error.message}
            </p>
          )}

          <button type="submit" className="btn btn-primary login-submit" disabled={submitting || !username || !password}>
            {submitting ? <Spinner label="Entrando…" /> : 'Entrar'}
          </button>
        </form>

        <aside className="login-hint" aria-label="Credenciais de teste">
          <strong>Credenciais de teste (DummyJSON):</strong>
          <code>{TEST_CREDS.username}</code> / <code>{TEST_CREDS.password}</code>
          <button type="button" className="btn btn-secondary login-fill" onClick={fillTestCredentials}>
            Preencher
          </button>
        </aside>
      </section>
    </main>
  );
}
