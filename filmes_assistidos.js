// Carregar os filmes assistidos do localStorage
const watchedMovies = JSON.parse(localStorage.getItem('watchedMovies')) || [];

const watchedMoviesList = document.getElementById('watchedMoviesList');
watchedMovies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('col');
    movieCard.innerHTML = `
        <div class="card mb-3">
            <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" class="card-img-top" alt="${movie.title}">
            <div class="card-body">
                <h5 class="card-title">${movie.title}</h5>
                <p class="card-text">Data de Lançamento: ${formatDate(movie.release_date)}</p>
                <p class="card-text">Avaliação: ${formatRating(movie.vote_average)} / 10</p>
            </div>
        </div>
    `;

    // Ação para abrir o modal com detalhes ao clicar no filme
    movieCard.addEventListener('click', function () {
        openModal(movie.id);
    });

    watchedMoviesList.appendChild(movieCard);
});

// Função para abrir o modal com os detalhes do filme
async function openModal(movieId) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=57d80942fbc1daf9cd1429ea9c9ee8f5&language=pt-BR&append_to_response=credits`);
    const movie = await response.json();

    const modal = new bootstrap.Modal(document.getElementById('movieModal'));
    const modalMovieInfo = document.getElementById('modalMovieInfo');
    
    // Obtendo as informações do filme
    const diretor = movie.credits.crew.find(person => person.job === 'Director')?.name || 'Desconhecido';
    const atores = movie.credits.cast.slice(0, 5).map(actor => actor.name).join(', ') || 'Atores desconhecidos';
    const releaseDate = formatDate(movie.release_date);
    const rating = formatRating(movie.vote_average);
    
    // Adicionando gêneros e país de origem
    const genres = movie.genres.map(genre => genre.name).join(', ') || 'Gêneros desconhecidos';
    const originCountry = movie.production_countries.map(country => country.name).join(', ') || 'País de origem desconhecido';

    // Atualizando o conteúdo do modal
    modalMovieInfo.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" class="img-fluid rounded mb-3" alt="${movie.title}">
        <p><strong>${movie.title}</strong></p>
        <p>${movie.overview}</p>
        <p><strong>Data de Lançamento:</strong> ${releaseDate}</p>
        <p><strong>Diretor:</strong> ${diretor}</p>
        <p><strong>Atores:</strong> ${atores}</p>
        <p><strong>Gêneros:</strong> ${genres}</p>
        <p><strong>País de Origem:</strong> ${originCountry}</p>
        <p><strong>Avaliação:</strong> ${rating} / 10</p>
    `;

    modal.show();
}

// Função para formatar a data no formato DD/MM/YYYY
function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

// Função para formatar a avaliação com uma casa decimal
function formatRating(rating) {
    return rating.toFixed(1);
}

// Ação do botão Voltar
document.getElementById('backButton').addEventListener('click', function() {
    window.history.back(); // Retorna à página anterior
});
