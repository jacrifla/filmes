import Header from '../components/Header.js';
import { createSearchBar } from '../components/SearchBar.js';
import { getCurrentMovies, searchMoviesByGenre, searchMoviesByText } from '../services/apiservice.js';
import { createMovieCard } from '../components/MovieCard.js';
import { MovieModal } from '../components/MovieModal.js';
import { ScrollToTopButton } from '../components/ScrollToTop.js.js';

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

    movies.forEach(async (movie) => {
        const movieCard = await createMovieCard(movie); // Aguarda a criação do card, caso seja async
        
        if (!(movieCard instanceof HTMLElement)) {
            console.error('Erro: movieCard não é um elemento válido', movieCard);
            return;
        }

        // Verifica se o filme foi assistido e aplica a classe
        if (watchedMovies.includes(movie.id)) {
            movieCard.classList.add('watched');
        } else {
            movieCard.classList.remove('watched');
        }
    
        movieCard.id = `movie-card-${movie.id}`;
    
        // Abre o modal ao clicar no card
        movieCard.addEventListener('click', () => {
            MovieModal(movie.id);
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

document.addEventListener('DOMContentLoaded', () => {
    const scrollToTopButton = ScrollToTopButton();
    document.body.appendChild(scrollToTopButton);
})

init();
