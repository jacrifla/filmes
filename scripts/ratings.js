import { getUserId } from '../other/auth.js';
import { getAvaliacoes, updateAvaliacao } from '../services/avaliacaoService.js';

export async function fetchUserRating(tmdb_id, userId) {    
    if (!userId) {
        console.error('UserId is required for fetching user rating');
        return null;
      }
  try {
    const avaliacao = await getAvaliacoes(tmdb_id, userId);    
    return avaliacao?.data.nota || 0;
  } catch (error) {
    console.error("Erro ao buscar avaliação:", error);
    return 0;
  }
}

export function createStarContainer(movie, initialRating) {
  const starContainer = document.createElement('div');
  starContainer.className = 'rating-container text-center mt-2';

  // Variável para armazenar a nota atual selecionada
  let currentRating = initialRating;

  for (let i = 1; i <= 10; i++) {
      const star = document.createElement('i');
      star.className = i <= initialRating ? 'bi bi-star-fill' : 'bi bi-star';
      star.style.cursor = 'pointer';
      star.style.fontSize = '1rem';
      star.style.color = 'gold';

      // Adiciona evento de clique para enviar a avaliação
      star.addEventListener('click', () => {
          currentRating = i; // Atualiza a nota selecionada
          submitRating(movie.id, i); // Envia a avaliação para o backend
          highlightStars(starContainer, i); // Atualiza visualmente as estrelas
      });

      // Adiciona evento de hover (mouse over)
      star.addEventListener('mouseover', () => {
          highlightStars(starContainer, i); // Mostra a avaliação do hover
      });

      // Adiciona evento de mouse out para restaurar a avaliação selecionada
      star.addEventListener('mouseout', () => {
          highlightStars(starContainer, currentRating); // Volta à avaliação fixa
      });

      starContainer.appendChild(star);
  }

  return starContainer;
}

export function highlightStars(container, rating) {
  const stars = container.querySelectorAll('.bi');
  stars.forEach((star, index) => {
      if (index < rating) {
          star.className = 'bi bi-star-fill';
      } else {
          star.className = 'bi bi-star';
      }
  });
}


export async function submitRating(movieId, rating) {
  const userId = getUserId();

  if (!userId) {
      console.error("Usuário não identificado. Não é possível enviar a avaliação.");
      return;
  }

  console.log(`Enviando avaliação: Filme ID: ${movieId}, Nota: ${rating}`);

  try {
      // Verifica se o usuário já avaliou o filme
      const existingRating = await fetchUserRating(movieId, userId);

      if (existingRating > 0) {
          // Atualiza a avaliação existente
          console.log("Atualizando avaliação existente...");
          await updateAvaliacao(userId, movieId, rating);
      } else {
          // Adiciona uma nova avaliação
          console.log("Adicionando nova avaliação...");
          await addAvaliacao({
              usuario_id: userId,
              tmdb_id: movieId,
              nota: rating,
          });
      }
      console.log("Avaliação enviada com sucesso!");
  } catch (error) {
      console.error("Erro ao enviar ou atualizar avaliação:", error);
  }
}
