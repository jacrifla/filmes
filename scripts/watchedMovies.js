import { getWatchedList } from '../services/listaAssistirService.js';
import { fetchMovieDetails } from '../services/apiservice.js';
import { createMovieCard } from '../components/MovieCard.js';
import { fetchUserRating } from './ratings.js';
import { getComentarios } from '../services/comentarioService.js';
import { filterByRating, loadGenres, loadRatings, loadYears } from '../services/filterService.js';
import { MovieModal } from '../components/MovieModal.js';

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
  watchedMoviesList.innerHTML = ''; // Limpa a lista de filmes antes de renderizar

  const row = document.createElement('div');
  row.classList.add('row', 'gy-3'); // Grid do Bootstrap com espaçamento entre linhas

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

  movieDetailsList.forEach(({ movieDetails }) => {
    if (movieDetails?.title) {
        const imdbRating = parseFloat(movieDetails.vote_average) || 0;

        // Formata o IMDb para ter apenas uma casa decimal
        const formattedRating = imdbRating.toFixed(1);

        // Determina a cor do badge IMDb
        let badgeClass = 'bg-secondary';
        if (imdbRating < 4) badgeClass = 'bg-danger';
        else if (imdbRating < 7) badgeClass = 'bg-warning text-dark';
        else if (imdbRating >= 8) badgeClass = 'bg-success';

        // Cria a coluna para o filme
        const col = document.createElement('div');
        col.classList.add('col-md-4', 'col-sm-6');

        // Adiciona conteúdo do filme
        col.innerHTML = `
            <div class="movie-item" style="cursor: pointer;">
                <strong>${movieDetails.title}</strong>
                <span class="year" style="font-size: 0.85rem;">(${new Date(movieDetails.release_date).getFullYear()})</span>
                <div>
                    IMDb: <span class="badge ${badgeClass}">${formattedRating || 'N/A'}</span>
                </div>
            </div>
        `;

        // Adiciona evento de clique para abrir o modal
        col.querySelector('.movie-item').addEventListener('click', () => {
            MovieModal(movieDetails.id); // Chama o componente do modal
        });

        row.appendChild(col);
    }
  });


  watchedMoviesList.appendChild(row);
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
      
        // Ordena os filmes por título em ordem alfabética
        moviesWithDetails.sort((a, b) => {
            const titleA = a.movieDetails?.title?.toLowerCase() || '';
            const titleB = b.movieDetails?.title?.toLowerCase() || '';
            return titleA.localeCompare(titleB);
        });

        return moviesWithDetails;
    }

    console.error('Failed to fetch watched movies:', response);
    return null;
}

function renderEmptyMessage(container, message) {
    container.innerHTML = `<p class="text-center text-muted">${message}</p>`;
}
