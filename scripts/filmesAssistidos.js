import {
  getUserId,
  getWatchedList,
} from '../services/listaAssistirService.js';
import { fetchMovieDetails } from '../services/apiservice.js';
import {
  getComentarios,
  addComentario,
  updateComentario,
  deleteComentario,
} from '../services/comentarioService.js';
import { createToast } from '../components/Toast.js';
import {
  addAvaliacao,
  getAvaliacoes,
  updateAvaliacao,
} from '../services/avaliacaoService.js';

const watchedMoviesCache = {}; // Cache para armazenar detalhes dos filmes

// Executa a renderização ao carregar a página
document.addEventListener('DOMContentLoaded', async () => {
  const userId = getUserId();
  await renderWatchedMovies(userId);
});

// Função principal para renderizar os filmes assistidos
async function renderWatchedMovies(userId) {
  const watchedMoviesList = document.getElementById('watchedMoviesList');
  watchedMoviesList.innerHTML = '';

  const watchedMovies = await fetchWatchedMovies();
  if (!watchedMovies) {
    renderEmptyMessage(watchedMoviesList, 'Nenhum filme assistido encontrado.');
    return;
  }

  const fragment = document.createDocumentFragment();

  // Busca todos os detalhes dos filmes com uso de cache
  const movieDetailsPromises = watchedMovies.map(async (movie) => {
    if (watchedMoviesCache[movie.tmdb_id]) {
      return watchedMoviesCache[movie.tmdb_id];
    }

    const [movieDetails, comentarios, userRating] = await Promise.all([
      fetchMovieDetails(movie.tmdb_id),
      getComentarios(movie.tmdb_id),
      fetchUserRating(movie.tmdb_id, userId),
    ]);

    const movieData = { movieDetails, comentarios, userRating };
    watchedMoviesCache[movie.tmdb_id] = movieData; // Salva no cache
    return movieData;
  });

  const movieDetailsList = await Promise.all(movieDetailsPromises);

  // Criação dos cards
  for (const { movieDetails, comentarios, userRating } of movieDetailsList) {
    if (movieDetails?.poster_path) {
      const movieCard = buildMovieCard(
        movieDetails,
        movieDetails.genres.map((genre) => genre.name).join(', '),
        movieDetails.credits.crew.find((person) => person.job === 'Director')?.name || 'Desconhecido',
        movieDetails.credits.cast.slice(0, 3).map((actor) => actor.name).join(', '),
        comentarios,
        userRating,
        userId
      );

      fragment.appendChild(movieCard);
    }
  }

  watchedMoviesList.appendChild(fragment);
}

// Busca a lista de filmes assistidos
async function fetchWatchedMovies() {
  const response = await getWatchedList();
  if (response?.success && response.data?.length) {
    return response.data;
  }
  return null;
}

// Renderiza mensagem quando a lista está vazia
function renderEmptyMessage(container, message) {
  container.innerHTML = `<p class="text-center text-muted">${message}</p>`;
}

// Cria o card de filme
async function createMovieCard(movie, userId) {
  try {
    const movieDetails = await fetchMovieDetails(movie.tmdb_id);
    if (!movieDetails?.poster_path) return null;

    const genres = movieDetails.genres.map((genre) => genre.name).join(', ');
    const director = movieDetails.credits.crew.find(
      (person) => person.job === 'Director'
    )?.name || 'Desconhecido';
    const cast = movieDetails.credits.cast
      .slice(0, 3)
      .map((actor) => actor.name)
      .join(', ');
    const comentarios = await getComentarios(movie.tmdb_id);
    const userRating = await fetchUserRating(movie.tmdb_id, userId);    

    return buildMovieCard(movieDetails, genres, director, cast, comentarios, userRating, userId);
  } catch (error) {
    console.error(`Erro ao processar filme ${movie.tmdb_id}:`, error);
    return null;
  }
}

// Obtém a avaliação do usuário
async function fetchUserRating(tmdb_id, userId) {
  try {
    const avaliacao = await getAvaliacoes(tmdb_id, userId);
    return avaliacao?.nota || 0; // Retorna 0 se não houver avaliação
  } catch (error) {
    console.error("Erro ao buscar avaliação:", error);
    return 0;
  }
}


// Constrói o elemento do card do filme
function buildMovieCard(movieDetails, genres, director, cast, comentarios, userRating, userId) {
    
  const movieCard = document.createElement('li');
  movieCard.classList.add('list-group-item', 'p-3');

  const card = document.createElement('div');
  card.classList.add('card', 'shadow-sm', 'border-0');

  const row = document.createElement('div');
  row.classList.add('row', 'g-0');

  row.appendChild(createMoviePoster(movieDetails.poster_path, movieDetails.title));
  row.appendChild(createMovieDetails(movieDetails, genres, director, cast, comentarios, userRating, userId)
  );

  card.appendChild(row);
  movieCard.appendChild(card);
  return movieCard;
}

// Cria a seção de imagem do filme
function createMoviePoster(posterPath, title) {
  const colImg = document.createElement('div');
  colImg.classList.add('col-md-3');
  const img = document.createElement('img');
  img.src = `https://image.tmdb.org/t/p/w500${posterPath}`;
  img.classList.add('img-fluid', 'rounded-start', 'movie-poster');
  img.alt = title;
  colImg.appendChild(img);
  return colImg;
}

// Cria os detalhes do filme
function createMovieDetails(movieDetails, genres, director, cast, comentarios, userRating, userId) {
  const colDetails = document.createElement('div');
  colDetails.classList.add('col-md-9');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  cardBody.innerHTML = `
    <h5 class="card-title fw-bold text-primary">${movieDetails.title}</h5>
    <p class="text-muted mb-1"><strong>Diretor:</strong> ${director}</p>
    <p class="text-muted mb-1"><strong>Atores:</strong> ${cast}</p>
    <p class="text-muted mb-1"><strong>Gênero:</strong> ${genres}</p>
    <p class="card-text mb-3"><strong>Sinopse:</strong> ${movieDetails.overview}</p>
    <span class="text-muted small"><strong>Lançamento:</strong> ${new Date(
      movieDetails.release_date
    ).toLocaleDateString('pt-BR')}</span>
  `;

  cardBody.appendChild(createStarRating(userRating, movieDetails.id, userId));  
  cardBody.appendChild(createCommentsSection(comentarios, movieDetails.id, userId));

  colDetails.appendChild(cardBody);
  return colDetails;
}

// Cria a seção de comentários
function createCommentsSection(comentarios, tmdb_id, userId) {
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

// Cria input para novos comentários
function createCommentInput(tmdb_id, userId, section) {
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

  // Adiciona um ouvinte de evento para salvar o filme ao pressionar "Enter"
  commentInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Impede o comportamento padrão do Enter (como pular linha)
      await handleNewComment(commentInput, tmdb_id, userId, section);
    }
  });

  container.appendChild(commentInput);
  container.appendChild(submitButton);

  return container;
}

// Lida com o envio de um novo comentário
async function handleNewComment(input, tmdb_id, userId, section) {
  const comentario = {
    usuario_id: userId,
    tmdb_id,
    comentario: input.value.trim(), // Remove espaços extras
  };

  if (!comentario.comentario) {
    createToast('O comentário não pode estar vazio.', 'warning');
    return;
  }

  try {
    // Envia o novo comentário para o servidor
    const newComment = await addComentario(comentario);

    // Limpa o campo de input
    input.value = '';

    // Verifica se o servidor retornou o comentário completo
    if (!newComment || !newComment.data || !newComment.data.comentario) {
      createToast('Erro ao recuperar o comentário. Tente novamente.', 'danger');
      return;
    }

    // Cria o elemento do novo comentário
    const commentElement = createCommentElement(newComment.data, tmdb_id, userId);

    // Identifica a seção de input para inserir o novo comentário
    const commentInputContainer = section.querySelector('.d-flex');
    
    // Inserir o novo comentário antes do input
    section.insertBefore(commentElement, commentInputContainer);

    // Atualiza o cache (se necessário)
    if (!watchedMoviesCache[tmdb_id].comentarios) {
      watchedMoviesCache[tmdb_id].comentarios = { data: [] };
    }

    // Adiciona o novo comentário ao cache
    watchedMoviesCache[tmdb_id].comentarios.data.push(newComment.data);

    // Exibe uma notificação de sucesso
    createToast('Comentário adicionado com sucesso!', 'success');
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error);
    createToast('Erro ao adicionar comentário.', 'danger');
  }
}

// Cria um elemento de comentário
function createCommentElement(comentario, tmdb_id, userId) {
  const commentElement = document.createElement('div');
  commentElement.classList.add(
    'comment-element',
    'd-flex',
    'justify-content-between',
    'align-items-center',
    'mb-3'
  );

  // Texto do comentário
  const textElement = document.createElement('span');
  textElement.textContent = comentario.comentario;

  // Ações do comentário
  const actions = document.createElement('div');
  actions.classList.add('actions');

  // Verifica se o comentário é do usuário logado
  if (comentario.usuario_id === userId) {    
    // Botão de editar
    const editButton = document.createElement('button');
    editButton.classList.add('btn', 'btn-warning', 'btn-sm', 'me-2');
    editButton.innerHTML = '<i class="bi bi-pencil"></i>';
    editButton.addEventListener('click', () => handleEditComment(comentario, textElement));

    // Botão de excluir
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
    deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
    deleteButton.addEventListener('click', () => handleDeleteComment(comentario));

    // Adiciona os botões de editar e excluir
    actions.appendChild(editButton);
    actions.appendChild(deleteButton);
  }

  // Adiciona o texto do comentário e as ações ao elemento do comentário
  commentElement.appendChild(textElement);
  commentElement.appendChild(actions);

  return commentElement;
}


// Função para criar as estrelas de avaliação
function createStarRating(rating, tmdb_id, userId) {
  const container = document.createElement('div');
  container.classList.add('star-rating');
  container.setAttribute('data-tmdb-id', tmdb_id); // Identificador para o filme

  for (let i = 1; i <= 10; i++) {
    const star = document.createElement('i');
    star.classList.add('fa', 'fa-star', 'text-warning');
    if (i <= rating) {
      star.classList.add('fa-solid'); // Marca como preenchida
    } else {
      star.classList.add('fa-regular'); // Marca como vazia
    }

    star.addEventListener('click', () => handleStarClick(tmdb_id, userId, i));

    container.appendChild(star);
  }

  return container;
}

// Lida com o clique nas estrelas
async function handleStarClick(tmdb_id, userId, rating) {
  try {
    // Atualiza visualmente as estrelas imediatamente
    const container = document.querySelector(`[data-tmdb-id="${tmdb_id}"]`);
    if (container) {
      const stars = container.querySelectorAll('.fa-star');
      stars.forEach((star, index) => {
        if (index < rating) {
          star.classList.remove('fa-regular');
          star.classList.add('fa-solid'); // Marca como preenchida
        } else {
          star.classList.remove('fa-solid');
          star.classList.add('fa-regular'); // Marca como vazia
        }
      });
    }

    // Atualiza no backend
    const avaliacao = await getAvaliacoes(tmdb_id, userId);
    if (avaliacao) {
      await updateAvaliacao(userId, tmdb_id, rating);
    } else {
      await addAvaliacao({ usuario_id: userId, tmdb_id, nota: rating });
    }

    // Atualiza o cache com a nova nota
    if (watchedMoviesCache[tmdb_id]) {
      watchedMoviesCache[tmdb_id].userRating = rating;
    }

    createToast('Avaliação salva com sucesso!', 'success');
  } catch (error) {
    createToast('Erro ao salvar avaliação', 'danger');
  }
}

// Função para editar o comentário
function handleEditComment(comentario, textElement) {
  const newComment = prompt('Editar comentário:', comentario.comentario);
  if (newComment && newComment !== comentario.comentario) {
    comentario.comentario = newComment;
    textElement.textContent = newComment;
    // Enviar a atualização ao banco de dados
    updateComentario(comentario);
  }
}

// Função para excluir o comentário
function handleDeleteComment(comentario) {
  if (confirm('Tem certeza que deseja excluir este comentário?')) {
    const comentarioId = comentario.id;   

    // Enviar a exclusão ao banco de dados com o ID correto
    deleteComentario(comentarioId);

    // Remover o comentário da tela
    const comentarioElement = document.querySelector(`[data-id="${comentarioId}"]`);
    if (comentarioElement) {
      comentarioElement.remove();
    }
  }
}

// Atualiza as estrelas após avaliação
function updateStars(container, rating) {
  Array.from(container.children).forEach((star, index) => {
    star.classList.toggle('bi-star-fill', index < rating);
    star.classList.toggle('bi-star', index >= rating);
  });
}
