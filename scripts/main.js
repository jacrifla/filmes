import Header from '../components/Header.js';
import { createSearchBar } from '../components/SearchBar.js';
import { getCurrentMovies, searchMoviesByGenre, searchMoviesByText } from '../services/apiservice.js';
import { createMovieCard } from '../components/MovieCard.js';
import { MovieModal } from '../components/MovieModal.js';

// Exibe os filmes como cards
async function displayMovies(movies) {
    const movieResultsContainer = document.getElementById('movie-results');
    movieResultsContainer.innerHTML = ''; // Limpa resultados anteriores

    // Adiciona uma classe para layout em grade usando Bootstrap
    movieResultsContainer.className = 'row g-3'; // 'g-3' adiciona gap (espaço) entre as colunas

    if (movies.length === 0) {
        movieResultsContainer.textContent = 'Nenhum filme encontrado.';
        return;
    }

    // Recupera os filmes assistidos do localStorage
    const watchedMovies = JSON.parse(localStorage.getItem('watchedMovies') || '[]');

    movies.forEach(movie => {
        const movieCard = createMovieCard(movie);
    
        // Verifica se o filme foi assistido e aplica a classe "watched"
        if (watchedMovies.includes(movie.id)) {
            movieCard.classList.add('watched');
        }
    
        // Adiciona um ID único ao card para poder aplicar a classe 'watched' diretamente
        movieCard.id = `movie-card-${movie.id}`;
    
        // Abre o modal ao clicar no card do filme
        movieCard.addEventListener('click', () => {
            MovieModal(movie.id);  // Chama a função para exibir o modal com o ID do filme
        });
    
        movieResultsContainer.appendChild(movieCard);
    });
}

// Funções de busca
async function handleSearchByGenre(genreId) {
    const movies = await searchMoviesByGenre(genreId);
    displayMovies(movies);
}

async function handleSearchByText(query) {
    const movies = await searchMoviesByText(query);
    displayMovies(movies);
}

// Função para buscar filmes atuais
async function loadCurrentMovies() {
    const currentMovies = await getCurrentMovies();  // Chama a função que busca filmes em cartaz
    displayMovies(currentMovies);  // Exibe os filmes atuais
}

async function init() {
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        headerContainer.appendChild(Header());
    }

    const searchBarContainer = document.getElementById('search-bar');
    if (searchBarContainer) {
        const searchBar = await createSearchBar(handleSearchByGenre, handleSearchByText);
        searchBarContainer.appendChild(searchBar);
    }

    // Verifique se estamos na página index antes de carregar filmes
    if (window.location.pathname === '/index.html') {
        loadCurrentMovies();
    }
}

init();
