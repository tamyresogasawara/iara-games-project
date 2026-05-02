# Iara Games — Área do Jogador (Fase 7)

App React + Vite que cumpre os critérios da Fase 7 da disciplina de Cloud Computing & DevOps:

1. **C1 — 70%**: área em React consumindo APIs reais (DummyJSON `/auth/login` + `/auth/me` + `/auth/refresh` e FreeToGame `/api/games`).
2. **C2 — 30%**: deploy na Vercel com URL pública HTTPS, SPA-rewrite configurado para evitar 404 em rotas profundas.

## Telas

- `/login` — formulário consumindo `POST /auth/login`. Exibe credenciais de teste (`emilys` / `emilyspass`).
- `/dashboard/perfil` — protegida; revalida sessão via `GET /auth/me` e exibe dados reais do usuário.
- `/dashboard/catalogo` — protegida; consome FreeToGame por gênero. Em caso de falha, ativa fallback embutido com 6 indies brasileiros (Chroma Squad, Dandara, Blazing Chrome, Horizon Chase Turbo, Dodgeball Academia, Kaze and the Wild Masks).

## Como rodar

```bash
npm install
npm run dev   # http://localhost:5173
```

Build de produção:

```bash
npm run build
npm run preview
```

## Deploy (Vercel)

1. `vercel.com/new` → importar este repositório.
2. Framework preset detecta **Vite** automaticamente.
3. Build command: `npm run build` · Output directory: `dist`.
4. `vercel.json` na raiz garante o rewrite SPA (sem ele, F5 em `/dashboard/perfil` retorna 404).

## Estrutura

```
src/
  api/           # auth.js, games.js (com mock fallback de indies BR)
  components/    # Header, ProtectedRoute, Spinner
  context/       # AuthContext (login, /me revalidation, refresh, logout)
  pages/
    Login.jsx
    Dashboard/   # index (layout + Outlet), Perfil, Catalogo
  styles/        # tokens.css (variáveis da identidade visual), global.css
public/
  favicon.png
  images/        # logo + 6 thumbs do fallback
vercel.json      # rewrite SPA
```

## Identidade visual

Tokens CSS reaproveitados do site estático original (`--accent-purple #8b5cf6`, gradiente indigo → purple → pink, fonte Inter, fundo `#0f0f23`). Definidos em `src/styles/tokens.css`.
