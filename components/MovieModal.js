import { addToWatchList, markAsWatched } from '../services/listaAssistirService.js';
import { fetchMovieDetails } from '../services/apiservice.js';


function cleanUpModal() {
    // Remove qualquer modal e backdrop restantes
    const existingModal = document.getElementById('movieModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Remove o backdrop e a classe modal-open do body, se existirem
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
        backdrop.remove();
    }

    // Restaura o scroll do body
    document.body.classList.remove('modal-open');
    document.body.style.overflow = ''; // Garante que o overflow do body é restaurado

    // Restaura o scroll do html, caso tenha sido afetado
    document.documentElement.style.overflow = ''; // Restaura overflow do html
}


export async function MovieModal(movieId) {
    try {
        // Limpa o modal anterior
        cleanUpModal();

        // Obtém detalhes do filme
        const movie = await fetchMovieDetails(movieId);

        // Verifica se o usuário está logado
        const isLoggedIn = localStorage.getItem('user') !== null;

        // Monta o conteúdo do modal, incluindo os botões somente se o usuário estiver logado
        const modalContent = `
            <div class="modal fade" id="movieModal" tabindex="-1" aria-labelledby="movieModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="movieModalLabel">${movie.title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-4">
                                    <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" class="img-fluid rounded" alt="${movie.title}" style="object-fit: cover;">
                                </div>
                                <div class="col-md-8">
                                    <p><strong>Data de Lançamento:</strong> ${new Date(movie.release_date).toLocaleDateString()}</p>
                                    <p><strong>Diretor:</strong> ${movie.credits?.crew?.find(person => person.job === 'Director')?.name || 'Desconhecido'}</p>
                                    <p><strong>Atores:</strong> ${movie.credits.cast.slice(0, 5).map(actor => actor.name).join(', ') || 'Desconhecido'}</p>
                                    <p><strong>Gêneros:</strong> ${movie.genres.map(genre => genre.name).join(', ') || 'Desconhecido'}</p>
                                    <p><strong>Avaliação:</strong> ${movie.vote_average.toFixed(1)} / 10</p>
                                    <p>${movie.overview}</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                            ${isLoggedIn ? 
                                `<button type="button" class="btn btn-primary" id="watchMovieButton">Salvar Filme</button>
                                 <button type="button" class="btn btn-success" id="watchedButton">Assistido</button>` : 
                                ''}
                            <button type="button" class="btn btn-info" id="shareBtn">Compartilhar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalContent);

        const modalElement = document.getElementById('movieModal');
        
        // Inicializa e mostra o modal
        const modalInstance = new bootstrap.Modal(modalElement);
        modalInstance.show();

        if (isLoggedIn) {
            // Adicionar eventos no botão de salvar
            const saveButton = modalElement.querySelector('#watchMovieButton');
            if (!saveButton.hasAttribute('data-event-bound')) {
                saveButton.addEventListener('click', async () => {
                    await addToWatchList(movie.id);
                    modalInstance.hide();
                });
                saveButton.setAttribute('data-event-bound', 'true');
            }

            // Adicionar eventos no botão de assistido
            const watchButton = modalElement.querySelector('#watchedButton');
            if (!watchButton.hasAttribute('data-event-bound')) {
                watchButton.addEventListener('click', async () => {
                    await markAsWatched(movie.id);
                    modalInstance.hide();
                });
                watchButton.setAttribute('data-event-bound', 'true');
            }
        }

        modalElement.querySelector('#shareBtn').addEventListener('click', () => {
            shareMovie(movie);
        });

        modalElement.addEventListener('hidden.bs.modal', () => {
            cleanUpModal();
        });

    } catch (error) {
        console.error('Erro ao carregar o filme para o modal:', error);
    }
}


let isSharing = false;  // Variável para controlar o estado do compartilhamento

function shareMovie(movie) {
    if (isSharing) {
        // Se o compartilhamento já estiver em andamento, retorna para evitar duplicação
        return;
    }

    console.log(`Tentando compartilhar o filme "${movie.title}".`);
    const shareButton = document.getElementById('shareBtn');
    
    if (navigator.share) {
        // Desabilita o botão temporariamente para evitar múltiplas chamadas
        shareButton.disabled = true;
        isSharing = true;  // Marca que o compartilhamento está em andamento

        navigator.share({
            title: movie.title,
            text: `Confira este filme: ${movie.title}`,
            url: `https://www.themoviedb.org/movie/${movie.id}`
        }).then(() => {
            console.log('Filme compartilhado com sucesso!');
        }).catch(error => {
            console.error('Erro ao compartilhar:', error);
            alert("Falha ao compartilhar o filme. Tente novamente mais tarde.");
        }).finally(() => {
            // Reabilita o botão após um atraso de 1 segundo e reseta o estado
            setTimeout(() => {
                shareButton.disabled = false;
                isSharing = false;  // Reseta a variável de controle
            }, 1000);
        });
    } else {
        alert("A função de compartilhamento não é suportada neste dispositivo.");
    }
}
