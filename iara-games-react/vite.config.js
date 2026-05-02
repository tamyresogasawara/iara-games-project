import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// FreeToGame doesn't send Access-Control-Allow-Origin, so direct browser
// fetch is blocked by CORS. We proxy /freetogame/* in dev (Vite) and prod
// (vercel.json), turning it into a same-origin request.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/freetogame': {
        target: 'https://www.freetogame.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/freetogame/, ''),
      },
    },
  },
});
