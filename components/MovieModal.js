import { fetchMovieDetails } from '../services/apiservice.js';

// Limpa o modal e os efeitos relacionados
function cleanUpModal() {
    const existingModal = document.getElementById('movieModal');
    if (existingModal) {
        existingModal.remove();
    }

    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
        backdrop.remove();
    }

    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
}

// Cria o conteúdo do modal com os dados do filme
function createModalContent(movie) {
    // Função para criar cada seção de informação (Data, Avaliação, etc.)
    const createInfoItem = (iconClass, title, value, color) => {
        return `
            <p><i class="${iconClass}" style="font-size: 1.2rem; margin-right: 8px; color: ${color};"></i>
                <strong style="font-size: 0.9rem; color: ${color};">${title}:</strong>
                <span style="font-size: 0.9rem; color: #ffffff;">${value}</span>
            </p>
        `;
    };

    return `
        <div class="modal fade" id="movieModal" aria-labelledby="movieModalLabel">
            <div class="modal-dialog modal-lg">
                <div class="modal-content bg-dark text-light">
                    <div class="modal-header">
                        <h5 class="modal-title" id="movieModalLabel">${movie.title}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <!-- Imagem do filme -->
                            <div class="col-md-4">
                                <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" class="img-fluid rounded" alt="${movie.title}" style="object-fit: cover;">
                            </div>
                            <div class="col-md-8">
                                <!-- Dados do Filme -->
                                ${createInfoItem('bi bi-calendar-fill', 'Data de Lançamento', new Date(movie.release_date).toLocaleDateString(), '#FFD700')}
                                ${createInfoItem('bi bi-star-fill', 'Avaliação', `${movie.vote_average.toFixed(1)} / 10`, '#f39c12')}
                                ${createInfoItem('bi bi-person', 'Diretor', movie.credits?.crew?.find(person => person.job === 'Director')?.name || 'Desconhecido', '#3498db')}
                                ${createInfoItem('bi bi-clock-fill', 'Duração', `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`, '#1abc9c')}
                                ${createInfoItem('bi bi-person-fill', 'Atores', movie.credits.cast.slice(0, 5).map(actor => actor.name).join(', ') || 'Desconhecido', '#e74c3c')}
                                ${createInfoItem('bi bi-film', 'Gêneros', movie.genres.map(genre => genre.name).join(', ') || 'Desconhecido', '#8e44ad')}

                                <!-- Sinopse -->
                                <p>
                                    <strong style="font-size: 0.9rem; color: #ffffff;">Sinopse:</strong>
                                    <span style="font-size: 0.9rem; color: #ffffff;">${movie.overview}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}


// Inicializa e mostra o modal
function initializeModal(modalElement) {
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();

    modalElement.addEventListener('hidden.bs.modal', () => {
        cleanUpModal();
    });
}

// Obtém os detalhes do filme e exibe o modal
export async function MovieModal(movieId) {
    try {
        cleanUpModal();  // Limpa o modal anterior

        const movie = await fetchMovieDetails(movieId);  // Obtém detalhes do filme

        const modalContent = createModalContent(movie);  // Cria o conteúdo do modal
        document.body.insertAdjacentHTML('beforeend', modalContent);  // Adiciona o modal no DOM

        const modalElement = document.getElementById('movieModal');
        initializeModal(modalElement);  // Inicializa e mostra o modal

    } catch (error) {
        console.error('Erro ao carregar o filme para o modal:', error);
    }
}
