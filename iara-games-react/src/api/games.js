// Proxied through Vite (dev) and Vercel (prod) — see vite.config.js & vercel.json.
// FreeToGame doesn't send Access-Control-Allow-Origin, so direct calls are
// CORS-blocked by the browser; the proxy makes it a same-origin request.
const FREETOGAME_BASE = '/freetogame/api/games';

export const FALLBACK_INDIES_BR = [
  {
    id: 9001,
    title: 'Chroma Squad',
    thumbnail: '/images/chroma-squad.jpg',
    short_description: 'Tactical RPG em que você gerencia um estúdio de TV de Power Rangers.',
    genre: 'Tactical RPG',
    platform: 'PC (Windows)',
    publisher: 'Behold Studios',
    developer: 'Behold Studios',
    release_date: '2015-04-30',
  },
  {
    id: 9002,
    title: 'Dandara: Trials of Fear Edition',
    thumbnail: '/images/dandara.png',
    short_description: 'Metroidvania inspirado na líder quilombola Dandara dos Palmares.',
    genre: 'Metroidvania',
    platform: 'PC (Windows)',
    publisher: 'Raw Fury',
    developer: 'Long Hat House',
    release_date: '2018-02-06',
  },
  {
    id: 9003,
    title: 'Blazing Chrome',
    thumbnail: '/images/blazing-chrome.png',
    short_description: 'Run-and-gun retrô com co-op local, inspirado em Contra.',
    genre: 'Run and Gun',
    platform: 'PC (Windows)',
    publisher: 'The Arcade Crew',
    developer: 'JoyMasher',
    release_date: '2019-07-11',
  },
  {
    id: 9004,
    title: 'Horizon Chase Turbo',
    thumbnail: '/images/horizon-chase.jpg',
    short_description: 'Corrida arcade nostálgica com trilha de Barry Leitch.',
    genre: 'Racing',
    platform: 'PC (Windows)',
    publisher: 'Aquiris Game Studio',
    developer: 'Aquiris Game Studio',
    release_date: '2018-05-09',
  },
  {
    id: 9005,
    title: 'Dodgeball Academia',
    thumbnail: '/images/dodgeball-academia.jpg',
    short_description: 'RPG esportivo de queimada cheio de personalidade.',
    genre: 'Sports RPG',
    platform: 'PC (Windows)',
    publisher: 'Humble Games',
    developer: 'Pocket Trap',
    release_date: '2021-08-05',
  },
  {
    id: 9006,
    title: 'Kaze and the Wild Masks',
    thumbnail: '/images/kaze-wild-masks.jpg',
    short_description: 'Plataforma 2D inspirado nos clássicos 16-bit dos anos 90.',
    genre: 'Platformer',
    platform: 'PC (Windows)',
    publisher: 'PixelHive',
    developer: 'PixelHive',
    release_date: '2021-03-26',
  },
];

export const GAME_CATEGORIES = [
  { value: '', label: 'Todos' },
  { value: 'shooter', label: 'Shooter' },
  { value: 'mmorpg', label: 'MMORPG' },
  { value: 'strategy', label: 'Estratégia' },
  { value: 'racing', label: 'Corrida' },
  { value: 'sports', label: 'Esportes' },
  { value: 'fighting', label: 'Luta' },
  { value: 'card', label: 'Card' },
];

export class GamesError extends Error {
  constructor(message, kind, fallback) {
    super(message);
    this.kind = kind;
    this.fallback = fallback;
  }
}

export async function fetchGamesByCategory(category) {
  const url = category ? `${FREETOGAME_BASE}?category=${encodeURIComponent(category)}` : FREETOGAME_BASE;
  let res;
  try {
    res = await fetch(url);
  } catch {
    throw new GamesError('FreeToGame indisponível. Mostrando catálogo BR (fallback).', 'network', FALLBACK_INDIES_BR);
  }
  if (!res.ok) {
    throw new GamesError(`FreeToGame retornou ${res.status}. Mostrando catálogo BR (fallback).`, 'server', FALLBACK_INDIES_BR);
  }
  const data = await res.json().catch(() => null);
  if (!Array.isArray(data)) {
    throw new GamesError('Resposta inválida do FreeToGame. Mostrando catálogo BR (fallback).', 'parse', FALLBACK_INDIES_BR);
  }
  return data;
}
