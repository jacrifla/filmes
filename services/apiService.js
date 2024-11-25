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

export async function getPersonMovies(query) {
    // Buscar o ID da pessoa primeiro
    const urlSearch = `${baseUrl}/search/person?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=pt-BR&include_adult=false`;

    try {
        const responseSearch = await fetch(urlSearch);
        if (!responseSearch.ok) {
            throw new Error('Erro ao buscar a pessoa');
        }
        const dataSearch = await responseSearch.json();

        // Verificando se encontrou algum resultado
        if (dataSearch.results.length === 0) {
            console.log('Pessoa não encontrada');
            return [];
        }

        // Pegando o ID da pessoa (aqui estamos considerando o primeiro resultado)
        const personId = dataSearch.results[0].id;

        // Agora buscar todos os filmes dessa pessoa
        const urlMovies = `${baseUrl}/person/${personId}/movie_credits?api_key=${API_KEY}&language=pt-BR`;
        const responseMovies = await fetch(urlMovies);

        if (!responseMovies.ok) {
            throw new Error('Erro ao buscar os filmes da pessoa');
        }

        const dataMovies = await responseMovies.json();
        return dataMovies.cast; // Retorna a lista de filmes em que a pessoa atuou
    } catch (error) {
        console.error('Erro:', error);
        return [];
    }
}

