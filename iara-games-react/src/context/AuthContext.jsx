import { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { login as apiLogin, getCurrentUser, refreshToken as apiRefresh } from '../api/auth';

const STORAGE_KEY = 'iara.auth';

const AuthContext = createContext(null);

const initial = { status: 'booting', user: null, accessToken: null, refreshToken: null, error: null };

function reducer(state, action) {
  switch (action.type) {
    case 'BOOT_DONE_AUTHED':
      return { status: 'authed', user: action.user, accessToken: action.accessToken, refreshToken: action.refreshToken, error: null };
    case 'BOOT_DONE_ANON':
      return { ...initial, status: 'anon' };
    case 'LOGIN_START':
      return { ...state, status: 'logging-in', error: null };
    case 'LOGIN_OK':
      return { status: 'authed', user: action.user, accessToken: action.accessToken, refreshToken: action.refreshToken, error: null };
    case 'LOGIN_FAIL':
      return { ...state, status: 'anon', error: action.error };
    case 'LOGOUT':
      return { ...initial, status: 'anon' };
    default:
      return state;
  }
}

function persist(payload) {
  if (payload) localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  else localStorage.removeItem(STORAGE_KEY);
}

function readPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      const stored = readPersisted();
      if (!stored?.accessToken) {
        dispatch({ type: 'BOOT_DONE_ANON' });
        return;
      }
      try {
        const user = await getCurrentUser(stored.accessToken);
        if (cancelled) return;
        dispatch({ type: 'BOOT_DONE_AUTHED', user, accessToken: stored.accessToken, refreshToken: stored.refreshToken });
      } catch {
        if (stored.refreshToken) {
          try {
            const refreshed = await apiRefresh(stored.refreshToken);
            const user = await getCurrentUser(refreshed.accessToken);
            if (cancelled) return;
            persist({ accessToken: refreshed.accessToken, refreshToken: refreshed.refreshToken });
            dispatch({ type: 'BOOT_DONE_AUTHED', user, accessToken: refreshed.accessToken, refreshToken: refreshed.refreshToken });
            return;
          } catch {
            // fall through
          }
        }
        if (cancelled) return;
        persist(null);
        dispatch({ type: 'BOOT_DONE_ANON' });
      }
    }
    boot();
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (username, password) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const data = await apiLogin(username, password);
      persist({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      dispatch({
        type: 'LOGIN_OK',
        user: data,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      return { ok: true };
    } catch (err) {
      dispatch({ type: 'LOGIN_FAIL', error: err });
      return { ok: false, error: err };
    }
  }, []);

  const logout = useCallback(() => {
    persist(null);
    dispatch({ type: 'LOGOUT' });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
