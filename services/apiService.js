const API_KEY = '57d80942fbc1daf9cd1429ea9c9ee8f5';
const baseUrl = 'https://api.themoviedb.org/3';

export async function fetchGenres() {
    const response = await fetch(`${baseUrl}/genre/movie/list?api_key=${API_KEY}&language=pt-BR&include_adult=false`);
    const data = await response.json();
    return data.genres;
}

export async function searchMoviesByGenre(genreId) {
    const response = await fetch(`${baseUrl}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=pt-BR&include_adult=false`);
    const data = await response.json();
    return data.results;
}

export async function searchMoviesByText(query) {
    const response = await fetch(`${baseUrl}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=pt-BR&include_adult=false`);
    const data = await response.json();
    return data.results;
}

export async function fetchMovieDetails(movieId) {
    const response = await fetch(`${baseUrl}/movie/${movieId}?api_key=${API_KEY}&language=pt-BR&append_to_response=credits&include_adult=false`);
    const data = await response.json();
    return data;
}

export async function getCurrentMovies() {
    const response = await fetch(`${baseUrl}/movie/now_playing?api_key=${API_KEY}&language=pt-BR&include_adult=false`);
    const data = await response.json();
    return data.results;
}
