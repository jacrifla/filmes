export function buildMovieCard(movieDetails, genres, director, cast, comentarios, userRating, userId) {
    const movieCard = document.createElement('li');
    movieCard.classList.add('list-group-item', 'p-3');
  
    const card = document.createElement('div');
    card.classList.add('card', 'shadow-sm', 'border-0');
  
    const row = document.createElement('div');
    row.classList.add('row', 'g-0');
  
    row.appendChild(createMoviePoster(movieDetails.poster_path, movieDetails.title));
    row.appendChild(createMovieDetails(movieDetails, genres, director, cast, comentarios, userRating, userId));
  
    card.appendChild(row);
    movieCard.appendChild(card);
    return movieCard;
  }
  
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
      <span class="text-muted small"><strong>Lançamento:</strong> ${new Date(movieDetails.release_date).toLocaleDateString('pt-BR')}</span>
    `;
  
    cardBody.appendChild(createStarRating(userRating, movieDetails.id, userId));  
    cardBody.appendChild(createCommentsSection(comentarios, movieDetails.id, userId));
  
    colDetails.appendChild(cardBody);
    return colDetails;
  }
  
  function createStarRating(rating, tmdb_id, userId) {
    // Função para criar as estrelas de avaliação
  }
  