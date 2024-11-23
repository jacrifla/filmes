import { createToast } from "../components/Toast.js";
import { getUserId } from "../other/auth.js";
import { BASE_API_URL } from "../other/config.js";

const API_URL = `${BASE_API_URL}/lista_assistir`;
const userId = getUserId();

// Função para salvar no localStorage na lista de filmes "para assistir"
function saveFilmToWatchList(tmdbId) {
    const savedFilms = JSON.parse(localStorage.getItem('filmesSalvos') || '[]');

    // Verifica se o filme já foi salvo, caso contrário, adiciona
    if (!savedFilms.includes(tmdbId)) {
        savedFilms.push(tmdbId);
        localStorage.setItem('filmesSalvos', JSON.stringify(savedFilms));
    }
}

// Função para salvar na lista "Assistidos"
function saveFilmToWatchedList(tmdbId) {
    const watchedFilms = JSON.parse(localStorage.getItem('watchedMovies') || '[]');

    // Verifica se o filme já foi salvo, caso contrário, adiciona
    if (!watchedFilms.includes(tmdbId)) {
        watchedFilms.push(tmdbId);
        localStorage.setItem('watchedMovies', JSON.stringify(watchedFilms));
    }
}

// Função para obter filmes na lista "para assistir"
export async function getWatchList() {
    const usuarioId = getUserId();  
    if (!usuarioId) {
        console.error("Usuário não está logado!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/to-watch/${usuarioId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erro ao obter lista para assistir:", error);
    }
}

// Função para obter filmes na lista "assistido"
export async function getWatchedList() {
    const usuarioId = getUserId();  
    if (!usuarioId) {
        console.error("Usuário não está logado!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/watched/${usuarioId}`);
        const data = await response.json();
        
        return data;
    } catch (error) {
        console.error("Erro ao obter lista para assistir:", error);
    }
}

// Função para adicionar um filme à lista para assistir
export async function addToWatchList(tmdbId, showToast = true) {
    const usuarioId = getUserId();  // Recupera o ID do usuário
    if (!usuarioId) {
        console.error("Usuário não está logado!");
        createToast("Erro ao adicionar filme, usuário não encontrado.", "danger");
        return false; // Retorne falso em caso de erro
    }

    try {
        // Verifica se o filme já está na lista para o mesmo usuário
        const checkResponse = await fetch(`${API_URL}/checkFilmInList`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id: usuarioId, tmdb_id: tmdbId })
        });

        const checkData = await checkResponse.json();
        
        if (checkData.data.exists) {
            if (showToast) createToast('Este filme já está na lista para assistir!', 'warning');
            return true; // Filme já está na lista, então retorne verdadeiro
        }

        // Caso o filme não esteja na lista, ele será adicionado à tabela 'lista_assistir'
        const addResponse = await fetch(`${API_URL}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuario_id: usuarioId,  // ID do usuário que está salvando
                tmdb_id: tmdbId,  // ID do filme
                status: 'para assistir'  // Status inicial como 'para assistir'
            })
        });

        const addData = await addResponse.json();

        if (addData.success) {
            if (showToast) createToast('Filme adicionado à lista para assistir com sucesso!', 'success');
            saveFilmToWatchList(tmdbId); // Salva localmente na lista "para assistir"
            return true;
        } else {
            console.error("Erro ao adicionar filme à lista:", addData.message);
            createToast('Erro ao adicionar filme à lista', 'danger');
            return false;
        }

    } catch (error) {
        console.error("Erro ao adicionar filme:", error);
        createToast("Erro de conexão com o servidor", "danger");
        return false; // Retorne falso em caso de erro
    }
}

// Função para marcar o filme como assistido
export async function markAsWatched(tmdbId) {
    const usuarioId = getUserId();
    if (!usuarioId) {
        console.error("Usuário não está logado!");
        createToast("Erro ao marcar filme, usuário não encontrado.", "danger");
        return;
    }

    try {
        // Verifica se o filme está na lista de "para assistir" no banco de dados
        const checkResponse = await fetch(`${API_URL}/checkFilmInList`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id: usuarioId, tmdb_id: tmdbId })
        });
        
        const checkData = await checkResponse.json();

        // Se o filme não estiver na lista, adiciona usando addToWatchList sem mostrar o toast
        if (!checkData.data.exists) {  
            const addResponse = await addToWatchList(tmdbId, false); // Passa `false` para não mostrar o toast
            if (!addResponse) {
                console.error("Erro ao adicionar filme à lista para assistir");
                return;
            }
        }

        // Marca o filme como "assistido" no banco de dados
        const response = await fetch(`${API_URL}/mark`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id: usuarioId, tmdb_id: tmdbId })
        });
        
        const data = await response.json();

        if (data.success) {
            createToast('Filme marcado como assistido!', 'success');

            // Salva localmente na lista "assistidos"
            saveFilmToWatchedList(tmdbId);

            // Atualiza o estado do DOM
            const movieCard = document.getElementById(`movie-card-${tmdbId}`);
            if (movieCard) {
                movieCard.classList.add('watched');
            } else {
                console.error("Card do filme não encontrado:", `movie-card-${tmdbId}`);
            }
        } else {
            createToast('Erro ao marcar filme como assistido', 'danger');
        }
    } catch (error) {
        console.error("Erro ao marcar filme como assistido:", error);
        createToast("Erro de conexão com o servidor", "danger");
    }
}

// Função para remover um filme da lista "para assistir"
export async function removeFromWatchList(tmdbId) {
    const usuarioId = getUserId();  // Recupera o usuario_id
    if (!usuarioId) {
        console.error("Usuário não está logado!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/remove`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id: usuarioId, tmdb_id: tmdbId })
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
export async function isMovieInWatchedList(movieId) {
    const watchedMoviesResponse = await getWatchedList();
    
    // Verifique se a resposta tem a chave 'data' e se é um array
    if (watchedMoviesResponse && Array.isArray(watchedMoviesResponse.data)) {
        return watchedMoviesResponse.data.some(movie => movie.id === movieId);
    } else {
        console.error("watchedMoviesResponse.data não é um array:", watchedMoviesResponse);
        return false;
    }
}

// Verifica se o filme está na lista de filmes "para assistir"
export async function isMovieInWatchList(movieId) {
    const watchListResponse = await getWatchList();
    
    // Verifique se a resposta tem a chave 'data' e se é um array
    if (watchListResponse && Array.isArray(watchListResponse.data)) {
        return watchListResponse.data.some(movie => movie.id === movieId);
    } else {
        console.error("watchListResponse.data não é um array:", watchListResponse);
        return false; 
    }
}

