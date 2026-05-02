import { useEffect, useState } from 'react';
import { fetchGamesByCategory, GAME_CATEGORIES, GamesError } from '../../api/games';
import Spinner from '../../components/Spinner';

export default function Catalogo() {
  const [category, setCategory] = useState('shooter');
  const [games, setGames] = useState([]);
  const [status, setStatus] = useState('idle');
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setStatus('loading');
      setNotice(null);
      try {
        const data = await fetchGamesByCategory(category);
        if (cancelled) return;
        setGames(data);
        setStatus('ready');
      } catch (err) {
        if (cancelled) return;
        if (err instanceof GamesError && err.fallback) {
          setGames(err.fallback);
          setNotice(err.message);
          setStatus('fallback');
        } else {
          setGames([]);
          setNotice('Erro ao carregar o catálogo.');
          setStatus('error');
        }
      }
    }
    load();
    return () => { cancelled = true; };
  }, [category]);

  return (
    <>
      <h1 className="dashboard-title">Catálogo</h1>
      <p className="dashboard-subtitle">Jogos da FreeToGame API com fallback para indies brasileiros.</p>

      <section className="dashboard-section">
        <div className="catalog-toolbar">
          <label htmlFor="category-select" style={{ fontWeight: 600 }}>Gênero:</label>
          <select
            id="category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={status === 'loading'}
          >
            {GAME_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          {status === 'loading' && <Spinner label="Carregando jogos…" />}
          {status === 'fallback' && <span className="catalog-status is-error">{notice}</span>}
          {status === 'ready' && <span className="catalog-status">{games.length} jogo(s) encontrados</span>}
        </div>

        {status === 'error' && <p className="empty-state">{notice}</p>}
        {status !== 'loading' && games.length === 0 && status !== 'error' && (
          <p className="empty-state">Nenhum jogo encontrado para este gênero.</p>
        )}

        {games.length > 0 && (
          <ul className="game-grid" role="list">
            {games.slice(0, 24).map((g) => (
              <li key={g.id} className="game-card">
                <img
                  src={g.thumbnail}
                  alt={`Capa de ${g.title}`}
                  className="game-card-thumb"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.src = '/images/logo.png'; }}
                />
                <div className="game-card-body">
                  <span className="game-card-meta">{g.genre}{g.platform ? ` · ${g.platform}` : ''}</span>
                  <h3 className="game-card-title">{g.title}</h3>
                  <p className="game-card-desc">{g.short_description || g.developer}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
