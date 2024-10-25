// Variáveis globais
const apiKey = '57d80942fbc1daf9cd1429ea9c9ee8f5';
let savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];
let watchedMovies = JSON.parse(localStorage.getItem('watchedMovies')) || [];

// Atualizar a exibição ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    fetchNowPlayingMovies(); // Carregar filmes em cartaz
    updateSavedMoviesPanel(); // Atualizar painel lateral
});

// Ação de buscar filmes ao clicar no botão
document.getElementById('searchBtn').addEventListener('click', function () {
    const query = document.getElementById('searchInput').value.trim();
    if (query) {
        clearCurrentMovies(); // Limpar filmes em cartaz
        searchMovies(query); // Buscar filmes com a query
    }
});

// Ação de buscar filmes ao clicar no enter
document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const query = event.target.value.trim();
        if (query) {
            clearCurrentMovies(); // Limpar filmes em cartaz
            searchMovies(query); // Buscar filmes com a query
        }
    }
});

// Função para limpar os filmes em cartaz
function clearCurrentMovies() {
    const moviesContainer = document.getElementById('nowPlayingMovies');
    moviesContainer.innerHTML = ''; // Limpa a lista de filmes em cartaz
}

// Função de buscar filmes na API
async function searchMovies(query) {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=pt-BR&query=${query}`);
    const data = await response.json();
    displayMovies(data.results); // Exibir apenas os filmes buscados
}

// Função para buscar filmes em cartaz
async function fetchNowPlayingMovies() {
    const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=pt-BR`);
    const data = await response.json();
    displayNowPlayingMovies(data.results);
}

// Função para exibir filmes em cartaz, excluindo os assistidos
function displayNowPlayingMovies(movies) {
    const nowPlayingMoviesContainer = document.getElementById('nowPlayingMovies');
    nowPlayingMoviesContainer.innerHTML = '';

    // Filtrar filmes que já foram assistidos
    const unwatchedMovies = movies.filter(movie => {
        return !watchedMovies.some(watched => watched.id === movie.id);
    });

    unwatchedMovies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('col');

        movieElement.innerHTML = `
        <div class="card h-100">
            <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" class="card-img-top" alt="${movie.title}" style="height: 250px; object-fit: cover;">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${movie.title}</h5>
                <p class="card-text"><strong>Data de Lançamento:</strong> ${formatDate(movie.release_date)}</p>
                <p class="card-text"><strong>Avaliação:</strong> ${formatRating(movie.vote_average)} / 10</p>
            </div>
        </div>
        `;

        // Ação de abrir o modal com detalhes ao clicar no filme
        movieElement.addEventListener('click', function () {
            openModal(movie.id);
        });

        nowPlayingMoviesContainer.appendChild(movieElement);
    });
}

// Função para exibir filmes encontrados
function displayMovies(movies) {
    const moviesContainer = document.getElementById('movies');
    const nowPlayingTitle = document.getElementById('nowPlayingTitle'); 
    moviesContainer.innerHTML = '';

    if (movies.length === 0) {
        moviesContainer.innerHTML = '<p>Nenhum filme encontrado.</p>';
        return;
    }

    nowPlayingTitle.innerText = 'Filmes Pesquisados';

    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('col');

        // Verifica se o filme está na lista de assistidos
        const isWatched = watchedMovies.some(watched => watched.id === movie.id);

        const releaseDate = formatDate(movie.release_date);
        const rating = formatRating(movie.vote_average);

        movieElement.innerHTML = `
            <div class="card h-100 ${isWatched ? 'watched-opacity' : ''}">
                <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" class="card-img-top" alt="${movie.title}">
                <div class="card-body">
                    <h5 class="card-title">${movie.title}</h5>
                    <p class="card-text"><strong>Data de Lançamento:</strong> ${releaseDate}</p>
                    <p class="card-text"><strong>Avaliação:</strong> ${rating} / 10</p>
                </div>
            </div>
        `;

        // Ação de abrir o modal com detalhes ao clicar no filme
        movieElement.addEventListener('click', function () {
            openModal(movie.id);
        });

        moviesContainer.appendChild(movieElement);
    });
}

// Função de abrir o modal com os detalhes do filme
async function openModal(movieId) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=pt-BR&append_to_response=credits`);
    const movie = await response.json();
    const tituloFilme = document.getElementById('movieModalLabel');

    const modal = new bootstrap.Modal(document.getElementById('movieModal'));
    const modalMovieInfo = document.getElementById('modalMovieInfo');
    const diretor = movie.credits.crew.find(person => person.job === 'Director')?.name || 'Desconhecido';
    const atores = movie.credits.cast.slice(0, 5).map(actor => actor.name).join(', ') || 'Atores desconhecidos';
    const releaseDate = formatDate(movie.release_date);
    const rating = formatRating(movie.vote_average);
    console.log(tituloFilme.innerText = movie.title);
    
    // Adicionando gêneros e país de origem
    const genres = movie.genres.map(genre => genre.name).join(', ') || 'Gêneros desconhecidos';
    const originCountry = movie.origin_country.join(', ') || 'País de origem desconhecido';

    modalMovieInfo.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" class="img-fluid rounded mb-3" alt="${movie.title}">
        <p>${movie.overview}</p>
        <p><strong>Data de Lançamento:</strong> ${releaseDate}</p>
        <p><strong>Diretor:</strong> ${diretor}</p>
        <p><strong>Atores:</strong> ${atores}</p>
        <p><strong>Gêneros:</strong> ${genres}</p>
        <p><strong>País de Origem:</strong> ${originCountry}</p>
        <p><strong>Avaliação:</strong> ${rating} / 10</p>
    `;

    // Configurar o botão "Assistido"
    document.getElementById('watchButton').onclick = function() {
        markAsWatched(movie);
        modal.hide();
    };

    // Compartilhando filme com outros aplicativos
    document.getElementById('shareBtn').onclick = function() {
        if (navigator.share) {
            navigator.share({
                title: movie.title,
                text: `Confira este filme: ${movie.title}`,
                url: `https://www.themoviedb.org/movie/${movieId}`
            }).then(() => console.log('Filme compartilhado com sucesso!'))
            .catch(error => console.log('Erro ao compartilhar', error));
        } else {
            alert("A função de compartilhamento não é suportada neste dispositivo.");
        }
    };


    // Salvando filme ao clicar no botão
    document.getElementById('saveMovieBtn').onclick = function() {
        saveMovie(movie);
        modal.hide();
    };

    modal.show();
}

function markAsWatched(movie) {
    // Adicionar o filme à lista de assistidos, se não estiver já lá
    if (!watchedMovies.some(watched => watched.id === movie.id)) {
        watchedMovies.push(movie);
        saveWatchedMovies(); // Salvar no localStorage
    }

    // Remover o filme da lista de salvos, se estiver lá
    savedMovies = savedMovies.filter(saved => saved.id !== movie.id);
    localStorage.setItem('savedMovies', JSON.stringify(savedMovies)); // Atualizar localStorage
    
    updateSavedMoviesPanel(); // Atualizar painel lateral
}


// Função para salvar o filme
function saveMovie(movie) {
    if (!savedMovies.find(savedMovie => savedMovie.id === movie.id)) {
        savedMovies.push(movie);
        localStorage.setItem('savedMovies', JSON.stringify(savedMovies));
        updateSavedMoviesPanel();
    }
}

// Atualizar painel lateral com filmes salvos
function updateSavedMoviesPanel() {
    const savedMoviesList = document.getElementById('savedMoviesList');
    savedMoviesList.innerHTML = '';

    savedMovies.forEach(movie => {
        const savedMovieElement = document.createElement('div');
        const releaseDate = formatDate(movie.release_date);
        
        savedMovieElement.innerHTML = `
            <div class="d-flex align-items-center mb-2">
                <input type="checkbox" class="form-check-input me-2 watched-checkbox" data-id="${movie.id}" />
                <div>
                    <p class="mb-0">
                        <strong class="movie-title text-primary" data-id="${movie.id}">${movie.title}</strong>
                    </p>
                    <small class="text-muted">${releaseDate}</small>
                </div>
                <button class="btn btn-outline-danger btn-sm ms-auto remove-btn" data-id="${movie.id}">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;

        // Adicionar evento para abrir o modal ao clicar no nome do filme
        const movieTitle = savedMovieElement.querySelector('.movie-title');
        movieTitle.addEventListener('click', function () {
            openModal(movie.id); // Abre o modal com detalhes do filme
        });

        // Adicionar evento para checkboxes
        const checkbox = savedMovieElement.querySelector('.watched-checkbox');
        checkbox.addEventListener('change', function () {
            if (this.checked) {
                // Adicionar o filme à lista de assistidos
                if (!watchedMovies.some(watched => watched.id === movie.id)) {
                    watchedMovies.push(movie);
                    saveWatchedMovies(); // Atualiza o localStorage
                }

                // Remover o filme da lista de salvos
                savedMovies = savedMovies.filter(m => m.id !== movie.id);
                localStorage.setItem('savedMovies', JSON.stringify(savedMovies)); // Atualiza localStorage
                updateSavedMoviesPanel(); // Atualiza o painel após remoção
            }
        });

        const removeBtn = savedMovieElement.querySelector('.remove-btn');
        removeBtn.addEventListener('click', function () {
            savedMovies = savedMovies.filter(m => m.id !== movie.id);
            localStorage.setItem('savedMovies', JSON.stringify(savedMovies));
            updateSavedMoviesPanel();
        });

        savedMoviesList.appendChild(savedMovieElement);
    });
}


// Função para salvar filmes assistidos no localStorage
function saveWatchedMovies() {
    localStorage.setItem('watchedMovies', JSON.stringify(watchedMovies)); // Evitar duplicatas
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

// Ação para abrir o painel lateral de filmes para assistir
document.getElementById('toggleSavedMoviesBtn').addEventListener('click', function () {
    const savedMoviesPanel = new bootstrap.Offcanvas(document.getElementById('savedMoviesPanel'));
    savedMoviesPanel.toggle();
});

// Ao carregar a página, atualiza o painel lateral e remove filmes assistidos da lista
document.addEventListener('DOMContentLoaded', function() {
    updateSavedMoviesPanel();
    // Remover os filmes assistidos da lista de salvos
    savedMovies = savedMovies.filter(saved => !watchedMovies.some(watched => watched.id === saved.id));
    localStorage.setItem('savedMovies', JSON.stringify(savedMovies)); // Atualiza o localStorage
});
