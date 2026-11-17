import { env } from 'node:process';

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const query = searchParams.get('query')?.trim();
  const page = Number(searchParams.get('page') ?? '1');

  if (!query) {
    return Response.json({ error: 'Enter a movie title.' }, { status: 400 });
  }

  if (!Number.isInteger(page) || page < 1 || page > 500) {
    return Response.json({ error: 'Invalid page number.' }, { status: 400 });
  }

  const apiKey = env.TMDB_API_KEY;
  const token = env.TMDB_TOKEN;
  if (!apiKey && !token) {
    return Response.json(
      { error: 'Movie search is unavailable.' },
      { status: 503 },
    );
  }

  const url = new URL('https://api.themoviedb.org/3/search/movie');
  url.searchParams.set('query', query);
  url.searchParams.set('page', String(page));
  if (!token && apiKey) {
    url.searchParams.set('api_key', apiKey);
  }

  try {
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      throw new Error('TMDB request failed');
    }
    return Response.json(await response.json());
  } catch {
    return Response.json({ error: 'Could not load movies.' }, { status: 502 });
  }
}
