import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const { TMDB_API_KEY, TMDB_TOKEN } = loadEnv(mode, process.cwd(), 'TMDB_');
  const proxy = {
    '/api/movies': {
      target: 'https://api.themoviedb.org',
      changeOrigin: true,
      headers: TMDB_TOKEN
        ? { Authorization: `Bearer ${TMDB_TOKEN}` }
        : undefined,
      rewrite(path: string) {
        const request = new URL(path, 'http://localhost');
        const params = new URLSearchParams({
          query: request.searchParams.get('query') ?? '',
          page: request.searchParams.get('page') ?? '1',
        });
        if (!TMDB_TOKEN) {
          params.set('api_key', TMDB_API_KEY ?? '');
        }
        return `/3/search/movie?${params}`;
      },
    },
  };

  return {
    plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
    server: { proxy },
    preview: { proxy },
    build: { sourcemap: true },
  };
});
