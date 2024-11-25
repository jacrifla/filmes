import { createToast } from "../components/Toast.js";
import { getUserId } from "../other/auth.js";
import { BASE_API_URL } from "../other/config.js";

const API_URL = `${BASE_API_URL}/lista_assistir`;

// Função auxiliar para salvar no localStorage
function saveToLocalStorage(key, tmdbId) {
    const items = JSON.parse(localStorage.getItem(key) || '[]');
    if (!items.includes(tmdbId)) {
        items.push(tmdbId);
        localStorage.setItem(key, JSON.stringify(items));
    }
}

// Função auxiliar para verificar se o usuário está logado
function validateUser() {
    const userId = getUserId();
    if (!userId) {
        createToast("Usuário não está logado!", "danger");
        return null;
    }
    return userId;
}

// Função para obter lista de filmes "para assistir"
export async function getWatchList() {
    const userId = validateUser();
    if (!userId) return;

    try {
        const response = await fetch(`${API_URL}/to-watch/${userId}`);
        return await response.json();
    } catch (error) {
        console.error("Erro ao obter lista para assistir:", error);
    }
}

// Função para obter lista de filmes "assistidos"
export async function getWatchedList() {
    const userId = validateUser();
    if (!userId) return;

    try {
        const response = await fetch(`${API_URL}/watched/${userId}`);
        return await response.json();
    } catch (error) {
        console.error("Erro ao obter lista de assistidos:", error);
    }
}

// Função para adicionar filme à lista "para assistir"
export async function addToWatchList(tmdbId, showToast = true) {
    const userId = validateUser();
    if (!userId) return false;

    try {
        const checkResponse = await fetch(`${API_URL}/checkFilmInList`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id: userId, tmdb_id: tmdbId })
        });
        const checkData = await checkResponse.json();

        if (checkData.data.exists) {
            if (showToast) createToast('Este filme já está na lista para assistir!', 'warning');
            return true;
        }

        const addResponse = await fetch(`${API_URL}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id: userId, tmdb_id: tmdbId, status: 'para assistir' })
        });
        const addData = await addResponse.json();

        if (addData.success) {
            if (showToast) createToast('Filme adicionado à lista para assistir com sucesso!', 'success');
            saveToLocalStorage('filmesSalvos', tmdbId);
            return true;
        }

        console.error("Erro ao adicionar filme à lista:", addData.message);
        createToast('Erro ao adicionar filme à lista', 'danger');
        return false;
    } catch (error) {
        console.error("Erro ao adicionar filme:", error);
        createToast("Erro de conexão com o servidor", "danger");
        return false;
    }
}

// Função para marcar filme como "assistido"
export async function markAsWatched(tmdbId) {
    const userId = validateUser();
    if (!userId) return;

    try {
        const checkResponse = await fetch(`${API_URL}/checkFilmInList`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id: userId, tmdb_id: tmdbId })
        });
        const checkData = await checkResponse.json();

        if (!checkData.data.exists) {
            const added = await addToWatchList(tmdbId, false);
            if (!added) return;
        }

        const response = await fetch(`${API_URL}/mark`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id: userId, tmdb_id: tmdbId })
        });
        const data = await response.json();

        if (data.success) {
            createToast('Filme marcado como assistido!', 'success');
            saveToLocalStorage('watchedMovies', tmdbId);
        } else {
            createToast('Erro ao marcar filme como assistido', 'danger');
        }
    } catch (error) {
        console.error("Erro ao marcar filme como assistido:", error);
        createToast("Erro de conexão com o servidor", "danger");
    }
}

// Função para remover filme da lista "para assistir"
export async function removeFromWatchList(tmdbId) {
    const userId = validateUser();
    if (!userId) return;

    try {
        const response = await fetch(`${API_URL}/remove`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id: userId, tmdb_id: tmdbId })
        });
        const data = await response.json();

        if (data.success) {
            createToast('Filme removido da lista!', 'success');
        } else {
            createToast('Erro ao remover filme da lista', 'danger');
        }
    } catch (error) {
        console.error("Erro ao remover filme:", error);
    }
}

// Verifica se o filme está na lista de filmes assistidos
export function isMovieInWatchedList(tmdbId) {
    const watchedList = JSON.parse(localStorage.getItem('watchedMovies')) || [];
    return watchedList.includes(tmdbId);
}

// Verifica se o filme está na lista "para assistir"
export function isMovieInWatchList(tmdbId) {
    const watchList = JSON.parse(localStorage.getItem('filmesSalvos')) || [];
    return watchList.includes(tmdbId);
}
