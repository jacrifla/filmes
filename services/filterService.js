import { fetchGenres } from "./apiservice.js";

// Função para carregar os gêneros de filmes
export async function loadGenres() {
    const genres = await fetchGenres();  // Função para buscar os gêneros da API (você já tem uma função `fetchGenres` implementada)
    const genreSelect = document.getElementById('genreFilter');
    
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.name;
        genreSelect.appendChild(option);
    });
}

// Função para carregar os anos dos filmes assistidos
export async function loadYears(watchedMovies) {
    const yearFilter = document.getElementById('yearFilter');
    const years = watchedMovies.map(movie => {
        const year = new Date(movie.movieDetails.release_date).getFullYear();
        return year;
    });

    // Filtra os anos para não ter duplicatas
    const uniqueYears = [...new Set(years)];

    // Preenche o select com os anos únicos
    uniqueYears.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });
}

export function loadRatings() {
    const ratingFilter = document.getElementById('ratingFilter');
    const ratings = [
        { label: '1 - 3', value: '1-3' },
        { label: '3 - 6', value: '3-6' },
        { label: '6 - 7', value: '6-7' },
        { label: '7 - 8', value: '7-8' },
        { label: '8 - 9', value: '8-9' },
        { label: '9 - 10', value: '9-10' },
    ];

    ratings.forEach(rating => {
        const option = document.createElement('option');
        option.value = rating.value;
        option.textContent = rating.label;
        ratingFilter.appendChild(option);
    });
}

export function filterByRating(imdbRating, ratingRange) {
    const [minRating, maxRating] = ratingRange.split('-').map(Number);
    return imdbRating >= minRating && imdbRating <= maxRating;
}
