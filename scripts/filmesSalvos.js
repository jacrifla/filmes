import { getWatchList, markAsWatched } from '../services/listaAssistirService.js';
import { fetchMovieDetails } from '../services/apiservice.js';

async function renderSavedMovies() {
    const savedMoviesList = document.getElementById('savedMoviesList');
    savedMoviesList.innerHTML = ''; // Limpa a lista antes de renderizar

    const response = await getWatchList();

    if (!response || !response.success || !response.data || response.data.length === 0) {
        savedMoviesList.innerHTML = '<p>Nenhum filme salvo encontrado.</p>';
        return;
    }

    const savedMovies = response.data;

    for (const movie of savedMovies) {
        try {
            const movieDetails = await fetchMovieDetails(movie.tmdb_id);

            const genres = movieDetails.genres.map(genre => genre.name).join(', ');
            const director = movieDetails.credits.crew.find(person => person.job === 'Director')?.name || 'Desconhecido';
            const cast = movieDetails.credits.cast.slice(0, 3).map(actor => actor.name).join(', ');

            // Criação do card com design aprimorado
            const movieCard = `
            <li id="movie-card-${movie.tmdb_id}" class="list-group-item p-3">
                <div class="card shadow-sm border-0">
                    <div class="row g-0">
                        <!-- Imagem do filme -->
                        <div class="col-md-3">
                            <img src="https://image.tmdb.org/t/p/w500${movieDetails.poster_path}" 
                                class="img-fluid rounded-start movie-poster" 
                                alt="${movieDetails.title}">
                        </div>
                        <!-- Detalhes do filme -->
                        <div class="col-md-9">
                            <div class="card-body">
                                <h5 class="card-title fw-bold text-primary">${movieDetails.title}</h5>
                                <p class="text-muted mb-1"><strong>Diretor:</strong> ${director}</p>
                                <p class="text-muted mb-1"><strong>Atores:</strong> ${cast}</p>
                                <p class="text-muted mb-1"><strong>Gênero:</strong> ${genres}</p>
                                <p class="text-muted mb-1"><strong>Avaliação:</strong> ⭐ ${movieDetails.vote_average.toFixed(1)}</p>
                                <p class="card-text mb-3"><strong>Sinopse:</strong> ${movieDetails.overview}</p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="text-muted small"><strong>Lançamento:</strong> ${new Date(movieDetails.release_date).toLocaleDateString('pt-BR')}</span>
                                    <button id="mark-watched-${movie.tmdb_id}" class="btn btn-success btn-sm">Assistido</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        `;

            savedMoviesList.innerHTML += movieCard;
        } catch (error) {
            console.error(`Erro ao buscar detalhes do filme com ID ${movie.tmdb_id}:`, error);
        }
    }

    addWatchedEventListeners();
}

function addWatchedEventListeners() {
    const buttons = document.querySelectorAll('[id^="mark-watched-"]');
    buttons.forEach(button => {
        button.addEventListener('click', async () => {
            const tmdbId = parseInt(button.id.replace('mark-watched-', ''), 10);
            await markAsWatched(tmdbId); // Marca o filme como assistido no backend ou serviço
            renderSavedMovies(); // Atualiza a lista de filmes na página após marcar como assistido
        });
    });
}

// Executa a renderização ao carregar a página
document.addEventListener('DOMContentLoaded', renderSavedMovies);
