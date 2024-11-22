import { addComentario } from "../services/comentarioService.js";
import { getUserId } from "../services/listaAssistirService.js";
import { createToast } from "../components/Toast.js"

export function CommentModal(movieId, movieTitle) {
    // Verifica se o modal já existe na página
    let modal = document.getElementById('commentModal');
    if (!modal) {
        // Cria o modal dinamicamente com tema escuro
        modal = document.createElement('div');
        modal.id = 'commentModal';
        modal.className = 'modal fade';
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('aria-hidden', 'true');
        modal.innerHTML = modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content bg-dark text-light"> <!-- bg-dark e text-light no conteúdo -->
                <div class="modal-header">
                    <h5 class="modal-title" id="commentModalLabel">Comentário sobre o filme</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p class="text-white">Filme: <strong id="modalMovieTitle"></strong></p> <!-- text-white para garantir que o texto "Filme:" seja claro -->
                    <textarea id="commentInput" class="form-control bg-dark text-light border-light" rows="4" placeholder="Escreva seu comentário aqui..."></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                    <button type="button" class="btn btn-primary" id="saveCommentButton">Salvar Comentário</button>
                </div>
            </div>
        </div>
    `;
    
        document.body.appendChild(modal);
    }

    // Atualiza o título do modal com o nome do filme
    document.getElementById('modalMovieTitle').textContent = movieTitle;

    // Adiciona evento ao botão de salvar
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
                    usuario_id: getUserId(), // Exemplo: Recupera o ID do usuário logado
                };

                // Salva o comentário usando a função `addComentario`
                const result = await addComentario(comentario);
                
                // Exibe o toast de sucesso
                createToast('Comentário salvo com sucesso!', 'success');
                console.log('Comentário salvo:', result);

                // Fecha o modal após salvar
                const modalInstance = bootstrap.Modal.getInstance(modal);
                modalInstance.hide();

                // Limpa o campo de texto
                commentInput.value = '';
            } catch (error) {
                console.error('Erro ao salvar o comentário:', error);
                // Exibe o toast de erro
                createToast('Erro ao salvar o comentário. Tente novamente.', 'danger');
            }
        } else {
            // Exibe o toast caso o comentário esteja vazio
            createToast('Por favor, insira um comentário antes de salvar.', 'warning');
        }
    };

    // Exibe o modal
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
}
