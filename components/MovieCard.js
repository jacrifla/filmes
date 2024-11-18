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

    // Título do filme com tamanho máximo
    const title = document.createElement('h5');
    title.className = 'card-title text-truncate text-center'; // Trunca o título e centraliza
    title.style.flexGrow = 1; // Garante que o título ocupe o máximo de espaço disponível
    title.textContent = movie.title;

    // Formatar data para o padrão dd/mm/yyyy
    const releaseDate = document.createElement('p');
    releaseDate.className = 'card-text text-center small';
    const date = new Date(movie.release_date);
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    releaseDate.textContent = `Data de Estreia: ${formattedDate}`;

    // Avaliação IMDb com uma casa decimal
    const rating = document.createElement('p');
    rating.className = 'card-text text-center small';
    rating.textContent = `Avaliação IMDb: ${movie.vote_average.toFixed(1)} / 10`;

    // Adicionando elementos ao corpo do card
    cardBody.appendChild(title);
    cardBody.appendChild(releaseDate);
    cardBody.appendChild(rating);
    cardElement.appendChild(img);
    cardElement.appendChild(cardBody);

    // Quando o card for clicado, abre o modal
    cardElement.addEventListener('click', () => {
        MovieModal(movie.id); // Chama a função para abrir o modal com os detalhes
    });

    card.appendChild(cardElement);
    return card;
}
