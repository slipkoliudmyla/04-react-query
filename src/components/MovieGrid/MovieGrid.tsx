import css from './MovieGrid.module.css';
import type { Movie } from '../../types/movie';
import type { KeyboardEvent } from 'react';

interface MovieGridProps {
  onSelect: (movie: Movie) => void;
  movies: Movie[];
}

function MovieGrid({ onSelect, movies }: MovieGridProps) {
  return (
    <ul className={css.grid}>
      {movies.map((movie) => (
        <li
          key={movie.id}
          role="button"
          tabIndex={0}
          aria-label={`View details for ${movie.title}`}
          onClick={() => onSelect(movie)}
          onKeyDown={(event: KeyboardEvent<HTMLLIElement>) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onSelect(movie);
            }
          }}
        >
          <div className={css.card}>
            {movie.poster_path ? (
              <img
                className={css.image}
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                loading="lazy"
              />
            ) : (
              <div className={`${css.image} ${css.placeholder}`}>
                No poster available
              </div>
            )}
            <h2 className={css.title}>{movie.title}</h2>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default MovieGrid;
