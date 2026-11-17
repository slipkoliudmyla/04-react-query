import axios from 'axios';
import type { Movie } from '../types/movie';

interface FetchMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const TMDB = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
  },
});

export async function fetchMovies(
  query: string,
  page: number,
  signal?: AbortSignal,
): Promise<FetchMoviesResponse> {
  const response = import.meta.env.VITE_TMDB_TOKEN
    ? await TMDB.get<FetchMoviesResponse>('/search/movie', {
        params: { query, page },
        signal,
      })
    : await axios.get<FetchMoviesResponse>('/api/movies', {
        params: { query, page },
        signal,
      });
  return response.data;
}
