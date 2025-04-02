import { getWatchList, markAsWatched } from '../services/listaAssistirService.js';
import { fetchMovieDetails } from '../services/apiservice.js';
import { MovieModal } from '../components/MovieModal.js';

// Função principal para renderizar os filmes salvos na página.
async function renderSavedMovies() {
    const savedMoviesList = document.getElementById('savedMoviesList');
    savedMoviesList.innerHTML = ''; // Limpa a lista antes de renderizar
    
    // Obtém a lista de filmes salvos
    const response = await getWatchList();    

    // Verifica se há filmes salvos para exibir
    if (!response || response.length === 0) {
        savedMoviesList.innerHTML = '<p>Nenhum filme salvo encontrado.</p>';
        return;
    }

    const savedMovies = response;

    // Cria um contêiner de grade para organizar os cartões de filmes
    const gridContainer = document.createElement('div');
    gridContainer.classList.add('row', 'g-4'); // Estilo para a grade

    for (const movie of savedMovies) {        
        try {
            // Busca os detalhes do filme a partir do ID no TMDb
            const movieDetails = await fetchMovieDetails(movie);                     

            // Cria o cartão de filme com os detalhes obtidos
            const movieCard = `
            <div class="col-md-4 col-sm-6">
                <div class="card shadow-sm border-0 h-100">
                    <!-- Imagem do filme -->
                    <img src="https://image.tmdb.org/t/p/w500${movieDetails.poster_path}" 
                        class="card-img-top movie-poster" 
                        alt="${movieDetails.title}">
                    <!-- Detalhes do filme -->
                    <div class="card-body">
                        <h5 class="card-title fw-bold text-center p-2">${movieDetails.title}</h5>
                        <div class="d-flex justify-content-between align-items-center">
                            <button class="btn btn-primary btn-sm view-details" data-movie-id="${movieDetails.id}">Ver Detalhes</button>
                            <button id="mark-watched-${movie}" class="btn btn-success btn-sm">Assistido</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

            // Adiciona o cartão de filme à grade
            gridContainer.innerHTML += movieCard;
        } catch (error) {
            console.error(`Erro ao buscar detalhes do filme com ID ${movie}:`, error);
        }
    }

    // Adiciona a grade com os cartões à lista de filmes salvos
    savedMoviesList.appendChild(gridContainer);

    // Adiciona os listeners para "Ver Detalhes"
    addDetailsButtonListeners();
    
    // Adiciona os listeners para "Assistido"
    addWatchedEventListeners();
}

// Adiciona os eventos de clique nos botões "Ver Detalhes".
function addDetailsButtonListeners() {
    const detailButtons = document.querySelectorAll('.view-details');
    detailButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const movieId = button.getAttribute('data-movie-id');
            
            // Exibe o modal com os detalhes do filme
            MovieModal(movieId);
        });
    });
}

// Adiciona os eventos de clique nos botões "Assistido".
function addWatchedEventListeners() {
    const buttons = document.querySelectorAll('[id^="mark-watched-"]');

    buttons.forEach(button => {
        button.addEventListener('click', async () => {
            
            // Extrai o ID do filme do atributo do botão
            const tmdbId = parseInt(button.id.replace('mark-watched-', ''), 10);
            
            await markAsWatched(tmdbId);
            renderSavedMovies();
        });
    });
}

// Executa a renderização ao carregar a página
document.addEventListener('DOMContentLoaded', renderSavedMovies);
