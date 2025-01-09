import { getWatchedList } from './listaAssistirService.js';

export async function syncWatchedMoviesWithLocalStorage() {
    try {
        // Obtém filmes assistidos do banco de dados
        const watchedMoviesFromDB = await getWatchedList();

        if (!Array.isArray(watchedMoviesFromDB)) {
            console.error('A lista de filmes assistidos não é um array:', watchedMoviesFromDB);
            return;
        }

        // Extrai os tmdb_id dos filmes assistidos
        const tmdbIdsFromDB = watchedMoviesFromDB.map(movie => movie.tmdb_id);

        // Obtém filmes assistidos do localStorage
        const watchedMoviesFromLocalStorage = JSON.parse(localStorage.getItem('watchedMovies')) || [];

        // Mescla as listas sem duplicatas
        const uniqueWatchedMovies = new Set([...watchedMoviesFromLocalStorage, ...tmdbIdsFromDB]);

        // Atualiza o localStorage
        localStorage.setItem('watchedMovies', JSON.stringify(Array.from(uniqueWatchedMovies)));
    } catch (error) {
        console.error('Erro ao sincronizar filmes assistidos com localStorage:', error);
    }
}
