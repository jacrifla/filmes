import { getWatchedList } from '../services/listaAssistirService.js';
import { fetchMovieDetails } from '../services/apiservice.js';
import { createMovieCard } from '../components/MovieCard.js';
import { fetchUserRating } from './ratings.js';
import { getComentarios } from '../services/comentarioService.js';
import { filterByRating, loadGenres, loadRatings, loadYears } from '../services/filterService.js';

const watchedMoviesCache = {}; 
let watchedMoviesCacheData = [];

export async function renderWatchedMovies(userId) {
    const watchedMoviesList = document.getElementById('watchedMoviesList');
    watchedMoviesList.innerHTML = '';

    const watchedMovies = await fetchWatchedMovies();
    if (!watchedMovies) {
      renderEmptyMessage(watchedMoviesList, 'Nenhum filme assistido encontrado.');
      return;
    }

    watchedMoviesCacheData = watchedMovies;

    const fragment = document.createDocumentFragment();

    // Carregar gêneros
    loadGenres();
    
    // Carregar anos de filmes assistidos
    loadYears(watchedMoviesCacheData);
    
    // Carregar faixas de nota IMDb
    loadRatings();

    // Filtro do campo de busca
    const searchInput = document.getElementById('movieSearchInput');
    searchInput.addEventListener('input', () => filterMovies(userId));

    // Filtro de gênero
    const genreFilter = document.getElementById('genreFilter');
    genreFilter.addEventListener('change', () => filterMovies(userId));

    // Filtro de ano
    const yearFilter = document.getElementById('yearFilter');
    yearFilter.addEventListener('change', () => filterMovies(userId));

    // Filtro de nota IMDb
    const ratingFilter = document.getElementById('ratingFilter');
    ratingFilter.addEventListener('change', () => filterMovies(userId));

    // Exibe todos os filmes assistidos inicialmente
    await renderMovieCards(watchedMoviesCacheData, userId);
}

function filterMovies(userId) {
    const query = document.getElementById('movieSearchInput').value.toLowerCase();
    const selectedGenre = document.getElementById('genreFilter').value;
    const selectedYear = document.getElementById('yearFilter').value;
    const selectedRating = document.getElementById('ratingFilter').value;

    // Filtrar filmes pelo título e gênero
    const filteredMovies = watchedMoviesCacheData.filter(movie => {
        // Acessa o título do filme
        const movieTitle = movie.movieDetails?.title?.toLowerCase();
        
        // Acessa os gêneros do filme
        const movieGenres = movie.movieDetails?.genres || [];
        
        // Acessa o ano de lançamento
        const movieYear = new Date(movie.movieDetails?.release_date).getFullYear()

        const imdbRating = parseFloat(movie.movieDetails?.vote_average) || 0;
        
        // Verifica se correspondem aos filtros
        const matchesTitle = movieTitle && movieTitle.includes(query);
        const matchesGenre = selectedGenre ? movieGenres.some(genre => genre.id === parseInt(selectedGenre)) : true;
        const matchesYear = selectedYear ? movieYear === parseInt(selectedYear) : true;
        const matchesRating = selectedRating ? filterByRating(imdbRating, selectedRating) : true;

        return matchesTitle && matchesGenre && matchesYear && matchesRating;
    });

    renderMovieCards(filteredMovies, userId);
}


async function renderMovieCards(filteredMovies, userId) {
  const watchedMoviesList = document.getElementById('watchedMoviesList');
  watchedMoviesList.innerHTML = '';  // Limpa a lista de filmes antes de renderizar

  const fragment = document.createDocumentFragment();

  // Carrega detalhes dos filmes filtrados
  const movieDetailsPromises = filteredMovies.map(async (movie) => {
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

  const movieCards = await Promise.all(movieDetailsList.map(async ({ movieDetails, comentarios, userRating }) => {
    if (movieDetails?.poster_path) {
      const movieCard = await createMovieCard(movieDetails, userId, userRating);
      return movieCard;
    }
  }));

  movieCards.forEach((movieCard) => {
    if (movieCard) {
      fragment.appendChild(movieCard);
    }
  });

  watchedMoviesList.appendChild(fragment);
}

async function fetchWatchedMovies() {
    const response = await getWatchedList();
    if (response?.success && response.data?.length) {
      const movieDetailsPromises = response.data.map(async (movie) => {
        if (!movie.movieDetails) {
          const movieDetails = await fetchMovieDetails(movie.tmdb_id);
          movie.movieDetails = movieDetails;
        }
        return movie;
      });

      const moviesWithDetails = await Promise.all(movieDetailsPromises);
      return moviesWithDetails;
    }

    console.error('Failed to fetch watched movies:', response);
    return null;
}

function renderEmptyMessage(container, message) {
    container.innerHTML = `<p class="text-center text-muted">${message}</p>`;
}
