import { loginUser } from '../services/authService.js';
import { createToast } from '../components/Toast.js'; // Importe a função createToast
import { getWatchedList, getWatchList } from '../services/listaAssistirService.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const email = document.getElementById('emailInput').value;
        const password = document.getElementById('passwordInput').value;

        const result = await loginUser(email, password);
        
        if (result.success) {
            localStorage.setItem('user', JSON.stringify(result.data));

            // Carregar as listas de filmes do banco de dados
            const watchList = await getWatchList();
            const watchedList = await getWatchedList();

            // Verificar se as listas de filmes existem antes de mapear
            const watchListIds = (watchList?.data || []).map(film => film.tmdb_id); // Verifica se 'data' existe
            const watchedListIds = (watchedList?.data || []).map(film => film.tmdb_id); // Verifica se 'data' existe

            // Armazenar os tmdb_id no localStorage
            localStorage.setItem('filmesSalvos', JSON.stringify(watchListIds));
            localStorage.setItem('watchedMovies', JSON.stringify(watchedListIds));

            // Substitui o uso de messageDiv por createToast
            createToast('Usuário aceito. Acessando....', 'success');
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 2000);
        } else {
            // Substitui o uso de messageDiv por createToast
            createToast(result.message, 'danger');
        }
    });
});
