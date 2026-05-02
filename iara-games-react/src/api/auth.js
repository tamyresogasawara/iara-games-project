const BASE_URL = 'https://dummyjson.com/auth';

export class AuthError extends Error {
  constructor(message, kind) {
    super(message);
    this.kind = kind;
  }
}

async function request(path, init) {
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    });
  } catch {
    throw new AuthError('Sem conexão. Verifique sua internet.', 'network');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 || res.status === 400) {
      throw new AuthError(data.message || 'Credenciais inválidas.', 'credentials');
    }
    throw new AuthError(data.message || `Erro ${res.status}.`, 'server');
  }
  return data;
}

export function login(username, password) {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password, expiresInMins: 60 }),
  });
}

export function getCurrentUser(accessToken) {
  return request('/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export function refreshToken(token) {
  return request('/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken: token, expiresInMins: 60 }),
  });
}
