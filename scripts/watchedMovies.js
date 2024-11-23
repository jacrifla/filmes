import { getWatchedList } from '../services/listaAssistirService.js';
import { fetchMovieDetails } from '../services/apiservice.js';
import { createMovieCard } from '../components/MovieCard.js';
import { fetchUserRating } from './ratings.js';
import { getComentarios } from '../services/comentarioService.js';

const watchedMoviesCache = {}; 

export async function renderWatchedMovies(userId) {
    const watchedMoviesList = document.getElementById('watchedMoviesList');
    watchedMoviesList.innerHTML = '';
  
    const watchedMovies = await fetchWatchedMovies();
    if (!watchedMovies) {
      renderEmptyMessage(watchedMoviesList, 'Nenhum filme assistido encontrado.');
      return;
    }
  
    const fragment = document.createDocumentFragment();
  
    const movieDetailsPromises = watchedMovies.map(async (movie) => {
      if (watchedMoviesCache[movie.tmdb_id]) {
        return watchedMoviesCache[movie.tmdb_id];
      }
  
      const [movieDetails, comentarios, userRating] = await Promise.all([
        fetchMovieDetails(movie.tmdb_id),
        getComentarios(movie.tmdb_id),
        fetchUserRating(movie.tmdb_id, userId),
      ]);
  
      const movieData = { movieDetails, comentarios, userRating };
      watchedMoviesCache[movie.tmdb_id] = movieData;
      return movieData;
    });
  
    const movieDetailsList = await Promise.all(movieDetailsPromises);
  
    movieDetailsList.forEach(({ movieDetails, comentarios, userRating }) => {
      if (movieDetails?.poster_path) {
        const movieCard = createMovieCard(movieDetails, userId);
        fragment.appendChild(movieCard);
      }
    });
  
    watchedMoviesList.appendChild(fragment);
}
  

async function fetchWatchedMovies() {
  const response = await getWatchedList();
  if (response?.success && response.data?.length) {
    return response.data;
  }
  return null;
}

function renderEmptyMessage(container, message) {
  container.innerHTML = `<p class="text-center text-muted">${message}</p>`;
}
