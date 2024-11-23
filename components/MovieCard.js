import { getUserId } from '../other/auth.js';
import { fetchUserRating, createStarContainer } from '../scripts/ratings.js';
import { createCardButtons } from './movieCardButtons.js';
import { MovieModal } from './MovieModal.js';

const idUser = getUserId();


export async function createMovieCard(movie, userId, userRating) {
    userId = idUser

    const card = document.createElement('div');
    card.className = 'col-12 col-sm-6 col-md-4 col-lg-3';

    const cardElement = document.createElement('div');
    cardElement.className = 'card mb-4';

    // Imagem do filme com tamanho fixo
    const img = document.createElement('img');
    img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    img.className = 'card-img-top';
    img.alt = movie.title;
    img.style.objectFit = 'cover';
    img.style.height = '350px';
    img.style.width = '100%';

    // Corpo do card
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body d-flex flex-column justify-content-between';

    // Título do filme
    const title = document.createElement('h5');
    title.className = 'card-title text-truncate text-center';
    title.textContent = movie.title;

    // Formatar data para o padrão dd/mm/yyyy
    const releaseDate = document.createElement('p');
    releaseDate.className = 'card-text text-center small';
    const date = new Date(movie.release_date);
    releaseDate.textContent = `Lançamento: ${date.toLocaleDateString('pt-BR')}`;

    // Avaliação IMDb
    const rating = document.createElement('p');
    rating.className = 'card-text text-center small';
    rating.textContent = `IMDb: ${movie.vote_average.toFixed(1)} / 10`;

    // Cria as estrelas de avaliação
    const initialRating = await fetchUserRating(movie.id, userId);    
    const starContainer = createStarContainer(movie, initialRating);

    // Adiciona os elementos no card
    cardBody.appendChild(title);
    cardBody.appendChild(releaseDate);
    cardBody.appendChild(rating);
    cardBody.appendChild(starContainer);

    // Verifica se o usuário está logado antes de adicionar os botões
    const isUserLoggedIn = checkIfUserIsLoggedIn(); // Função para verificar autenticação

    if (isUserLoggedIn) {
        const buttonContainer = createCardButtons(movie);
        cardBody.appendChild(buttonContainer);
    }

    cardElement.appendChild(img);
    cardElement.appendChild(cardBody);

    // Quando o card for clicado, abre o modal
    cardElement.addEventListener('click', () => {
        console.log('ID do Filme: ', movie.id);        
        MovieModal(movie.id);
    });

    card.appendChild(cardElement);

    // Retorna o elemento completo do card
    return card;
}

function checkIfUserIsLoggedIn() {
    const user = localStorage.getItem('user');

    // Se o usuário não estiver definido, retorna falso
    if (!user) {
        return false;
    }

    try {
        const parsedUser = JSON.parse(user);
        return parsedUser && Object.keys(parsedUser).length > 0;
    } catch (error) {
        console.error('Erro ao verificar login:', error);
        return false;
    }
}
