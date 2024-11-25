// Função principal que constrói o card completo do filme
export function buildMovieCard(movieDetails, genres, director, cast, comentarios, userRating, userId) {
  // Cria o elemento principal do card como um item de lista
  const movieCard = document.createElement('li');
  movieCard.classList.add('list-group-item', 'p-3'); // Estilização do item

  // Cria o elemento card
  const card = document.createElement('div');
  card.classList.add('card', 'shadow-sm', 'border-0'); // Estilização do card

  // Cria uma estrutura de linha para o layout (imagem e detalhes lado a lado)
  const row = document.createElement('div');
  row.classList.add('row', 'g-0'); // Bootstrap: row sem espaço entre colunas

  // Adiciona o poster do filme na primeira coluna
  row.appendChild(createMoviePoster(movieDetails.poster_path, movieDetails.title));

  // Adiciona os detalhes do filme na segunda coluna
  row.appendChild(
      createMovieDetails(movieDetails, genres, director, cast, comentarios, userRating, userId)
  );

  // Monta a estrutura do card
  card.appendChild(row);
  movieCard.appendChild(card);

  // Retorna o elemento completo do card
  return movieCard;
}

// Função para criar o elemento do poster do filme
function createMoviePoster(posterPath, title) {
  // Cria a coluna para o poster
  const colImg = document.createElement('div');
  colImg.classList.add('col-md-3'); // Coluna de tamanho médio ocupando 3/12

  // Cria a imagem do poster
  const img = document.createElement('img');
  img.src = `https://image.tmdb.org/t/p/w500${posterPath}`; // URL da imagem do TMDB
  img.classList.add('img-fluid', 'rounded-start', 'movie-poster'); // Estilização
  img.alt = title; // Texto alternativo para acessibilidade

  // Adiciona a imagem à coluna
  colImg.appendChild(img);
  return colImg;
}

// Função para criar os detalhes do filme
function createMovieDetails(movieDetails, genres, director, cast, comentarios, userRating, userId) {
  // Cria a coluna para os detalhes
  const colDetails = document.createElement('div');
  colDetails.classList.add('col-md-9'); // Coluna de tamanho médio ocupando 9/12

  // Cria o corpo do card para os textos e botões
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  // Adiciona os elementos principais como título, diretor, elenco, etc.
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

  // Adiciona a seção de avaliação (estrelas) ao card
  cardBody.appendChild(createStarRating(userRating, movieDetails.id, userId));

  // Adiciona a seção de comentários ao card
  cardBody.appendChild(createCommentsSection(comentarios, movieDetails.id, userId));

  // Adiciona o corpo ao container de detalhes
  colDetails.appendChild(cardBody);
  return colDetails;
}  