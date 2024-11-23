import { createCardButtons } from './movieCardButtons.js';
import { MovieModal } from './MovieModal.js';

export function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'col-12 col-sm-6 col-md-4 col-lg-3'; // Ajuste para responsividade com grid do Bootstrap

    // Cria o card com Bootstrap
    const cardElement = document.createElement('div');
    cardElement.className = 'card mb-4'; 

    // Imagem do filme com tamanho fixo
    const img = document.createElement('img');
    img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    img.className = 'card-img-top';
    img.alt = movie.title;
    img.style.objectFit = 'cover'; // Faz a imagem cobrir a área
    img.style.height = '350px'; // Altura padrão para todas as imagens
    img.style.width = '100%'; // Faz a imagem preencher toda a largura do card

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
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    releaseDate.textContent = `Data de Estreia: ${formattedDate}`;

    // Avaliação IMDb
    const rating = document.createElement('p');
    rating.className = 'card-text text-center small';
    rating.textContent = `Avaliação IMDb: ${movie.vote_average.toFixed(1)} / 10`;

    cardBody.appendChild(title);
    cardBody.appendChild(releaseDate);
    cardBody.appendChild(rating);

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
    return card;
}

function checkIfUserIsLoggedIn() {
    const user = localStorage.getItem('user');

    // Se o usuário não estiver definido, retorna falso
    if (!user) {
        return false;
    }

    try {
        // Tenta analisar o JSON do usuário e verifica se tem dados
        const parsedUser = JSON.parse(user);
        return parsedUser && Object.keys(parsedUser).length > 0;
    } catch (error) {
        console.error('Erro ao analisar o usuário do localStorage:', error);
        return false;
    }
}
