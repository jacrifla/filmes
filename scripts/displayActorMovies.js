import { createMovieCard } from "../components/MovieCard.js";
import { MovieModal } from "../components/MovieModal.js";

// Exibe os filmes como cards (adaptado para filmes do ator)
export async function displayActorMovies(movies) {
    const movieResultsContainer = document.getElementById('movie-results');
    movieResultsContainer.innerHTML = ''; // Limpa resultados anteriores

    // Adiciona uma classe para layout em grade usando Bootstrap
    movieResultsContainer.className = 'row g-3'; // 'g-3' adiciona gap (espaço) entre as colunas

    if (movies.length === 0) {
        movieResultsContainer.textContent = 'Nenhum filme encontrado para este ator.';
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
    
        // Verifica se o filme foi assistido
        if (watchedMovies.includes(movie.id)) {
            movieCard.classList.add('watched');
        }
    
        movieCard.id = `movie-card-${movie.id}`;
    
        // Abre o modal ao clicar no card
        movieCard.addEventListener('click', () => {
            MovieModal(movie.id);
        });
    
        movieResultsContainer.appendChild(movieCard);
    });
}

// Função para buscar filmes de um ator
export async function loadMoviesByActor(actorId) {
    const actorMovies = await getMoviesByActor(actorId);  // Função que retorna os filmes do ator
    displayActorMovies(actorMovies);  // Exibe os filmes do ator
}
