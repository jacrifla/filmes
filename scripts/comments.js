import { addComentario, getComentarios } from '../services/comentarioService.js';
import { createToast } from '../components/Toast.js';

export async function createCommentsSection(comentarios, tmdb_id, userId) {
  const section = document.createElement('div');
  section.classList.add('comments-section');

  const title = document.createElement('h6');
  title.textContent = 'Comentários:';
  section.appendChild(title);

  if (comentarios?.data?.length) {
    comentarios.data.forEach((comentario) => {
      const commentElement = createCommentElement(comentario, tmdb_id, userId);
      section.appendChild(commentElement);
    });
  } else {
    section.innerHTML += '<p class="text-muted">Sem comentários.</p>';
  }

  const input = createCommentInput(tmdb_id, userId, section);
  section.appendChild(input);
  return section;
}

export function createCommentInput(tmdb_id, userId, section) {
  const container = document.createElement('div');
  container.classList.add('d-flex', 'gap-2', 'mb-3');

  const commentInput = document.createElement('input');
  commentInput.classList.add('form-control');
  commentInput.setAttribute('placeholder', 'Adicione um comentário');

  const submitButton = document.createElement('button');
  submitButton.classList.add('btn', 'btn-primary');
  submitButton.textContent = 'Enviar';
  submitButton.addEventListener('click', async () => {
    await handleNewComment(commentInput, tmdb_id, userId, section);
  });

  commentInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); 
      await handleNewComment(commentInput, tmdb_id, userId, section);
    }
  });

  container.appendChild(commentInput);
  container.appendChild(submitButton);

  return container;
}

export async function handleNewComment(input, tmdb_id, userId, section) {
  // Função para lidar com o envio de um novo comentário
}

export function createCommentElement(comentario, tmdb_id, userId) {
  // Função para criar o elemento de comentário
}
