import { addComentario, getComentarios } from "../services/comentarioService.js";
import { getUserId } from "../services/listaAssistirService.js";
import { createToast } from "../components/Toast.js";
import { getUserName } from "../services/authService.js";

export function CommentModal(movieId, movieTitle) {
    // Verifica se o modal já existe na página
    let modal = document.getElementById('commentModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'commentModal';
        modal.className = 'modal fade';
        modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content bg-dark text-light">
                <div class="modal-header">
                    <h5 class="modal-title" id="commentModalLabel">Comentário sobre o filme</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p class="text-white">Filme: <strong id="modalMovieTitle"></strong></p>
                    
                    <!-- Lista de comentários existentes -->
                    <div id="commentsList" class="mb-3">
                        <p class="text-muted">Carregando comentários...</p>
                    </div>
                    
                    <!-- Campo de texto para novo comentário -->
                    <textarea id="commentInput" class="form-control bg-dark text-light border-light" rows="4" placeholder="Escreva seu comentário aqui..."></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                    <button type="button" class="btn btn-primary" id="saveCommentButton">Salvar Comentário</button>
                </div>
            </div>
        </div>`;
        
        document.body.appendChild(modal);
    }

    // Atualiza o título do modal
    document.getElementById('modalMovieTitle').textContent = movieTitle;

    // Carrega os comentários existentes
    loadComments(movieId);

    // Adiciona evento para salvar comentário
    const saveButton = document.getElementById('saveCommentButton');
    saveButton.onclick = async function () {
        const commentInput = document.getElementById('commentInput');
        const comment = commentInput.value.trim();

        if (comment !== '') {
            try {
                // Dados do comentário
                const comentario = {
                    tmdb_id: movieId,
                    comentario: comment,
                    usuario_id: getUserId(),
                };

                await addComentario(comentario);
                createToast('Comentário salvo com sucesso!', 'success');

                // Fecha o modal após salvar
                const modalInstance = bootstrap.Modal.getInstance(modal);
                modalInstance.hide();

                // Limpa o campo de texto
                commentInput.value = '';

                // Atualiza a lista de comentários
                loadComments(movieId);
            } catch (error) {
                console.error('Erro ao salvar o comentário:', error);
                createToast('Erro ao salvar o comentário. Tente novamente.', 'danger');
            }
        } else {
            createToast('Por favor, insira um comentário antes de salvar.', 'warning');
        }
    };

    // Exibe o modal
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
}

// Função para carregar comentários existentes
async function loadComments(movieId) {
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = '<p class="text-muted">Carregando comentários...</p>';

    try {
        const comentarios = await getComentarios(movieId);
        if (comentarios.data.length === 0) {
            commentsList.innerHTML = '<p class="text-muted">Nenhum comentário ainda. Seja o primeiro a comentar!</p>';
            return;
        }

        // Limpa a lista de comentários
        commentsList.innerHTML = '';

        // Obtém os nomes dos usuários de uma vez para melhorar a performance
        const usuarios = await Promise.all(
            comentarios.data.map(({ usuario_id }) => getUserName(usuario_id))
        );

        // Cria os elementos para exibir os comentários
        comentarios.data.forEach(({ comentario, usuario_id, criado_em }, index) => {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'mb-3 p-3 bg-secondary text-light rounded d-flex flex-column';

            // Obtém o nome do usuário (pegando apenas o primeiro nome)
            const usuarioNome = usuarios[index].split(' ')[0]; // Apenas o primeiro nome

            // Formata a data
            const date = new Date(criado_em);
            const formattedDate = formatDate(date);

            // Estrutura os elementos dentro do comentário
            commentDiv.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <strong>${usuarioNome}</strong>
                    <span class="text-muted small">${formattedDate}</span>
                </div>
                <p class="mb-0 mt-2">${comentario}</p>
            `;
            
            commentsList.appendChild(commentDiv);
        });
    } catch (error) {
        console.error(error);
        commentsList.innerHTML = '<p class="text-danger">Erro ao carregar os comentários.</p>';
    }
}

// Função para formatar a data no formato "dd/mm/yyyy às hh:mm"
function formatDate(date) {
    return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
