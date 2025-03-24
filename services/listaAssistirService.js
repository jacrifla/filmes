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
    if (!userId) return [];

    try {
        const response = await fetch(`${API_URL}/to-watch/${userId}`);
        const data = await response.json();
                
        return data.map(item => item.tmdb_id);
    } catch (error) {
        console.error("Erro ao obter lista para assistir:", error);
        return [];
    }
}


// Função para obter lista de filmes "assistidos"
export async function getWatchedList() {
    const userId = validateUser();
    if (!userId) throw new Error("Usuário não autenticado");

    try {
        const response = await fetch(`${API_URL}/watched/${userId}`);
        if (!response.ok) {
            throw new Error(`Erro na resposta da API: ${response.statusText}`);
        }
        const responseData = await response.json();
        
        return responseData.data;
    } catch (error) {
        console.error("Erro ao obter lista de assistidos:", error);
        throw error;
    }
}

// Função para adicionar filme à lista "para assistir" ou "assistido"
export async function manageMovieStatus(tmdbId, status, showToast = true) {
    const userId = validateUser();
    if (!userId) return false;

    try {
        // Verificar se o filme já está na lista
        const checkResponse = await fetch(`${API_URL}/checkFilmInList`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id: userId, tmdb_id: tmdbId })
        });
        const checkData = await checkResponse.json();

        if (checkData.data.exists) {
            // Atualizar status se o filme já existir
            const updateResponse = await fetch(`${API_URL}/film`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario_id: userId, tmdb_id: tmdbId, status })
            });
            const updateData = await updateResponse.json();

            if (updateData.success) {
                if (showToast) createToast(`Filme atualizado para "${status}" com sucesso!`, 'success');
                saveToLocalStorage(status === 'Assistido' ? 'watchedMovies' : 'filmesSalvos', tmdbId);
                return true;
            }

            createToast('Erro ao atualizar o status do filme', 'danger');
            return false;
        }

        // Adicionar filme com o status especificado
        const addResponse = await fetch(`${API_URL}/film`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id: userId, tmdb_id: tmdbId, status })
        });
        const addData = await addResponse.json();

        if (addData.success) {
            if (showToast) createToast(`Filme adicionado como "${status}" com sucesso!`, 'success');
            saveToLocalStorage(status === 'Assistido' ? 'watchedMovies' : 'filmesSalvos', tmdbId);
            return true;
        }

        console.error("Erro ao adicionar filme:", addData.message);
        createToast('Erro ao adicionar filme à lista', 'danger');
        return false;
    } catch (error) {
        console.error("Erro ao gerenciar status do filme:", error);
        createToast("Erro de conexão com o servidor", "danger");
        return false;
    }
}

// Função para adicionar filme à lista "para assistir"
export async function addToWatchList(tmdbId, showToast = true) {
    return manageMovieStatus(tmdbId, "para assistir", showToast);
}

// Função para marcar filme como "assistido"
export async function markAsWatched(tmdbId) {
    return manageMovieStatus(tmdbId, "assistido", true);
}

// Função para remover filme da lista
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
