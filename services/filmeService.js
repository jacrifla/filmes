import { createToast } from "../components/Toast.js";
import { BASE_API_URL } from "../other/config.js";

const API_URL = `${BASE_API_URL}/filmes`;

// Função para salvar filme no banco de dados e no localStorage
export async function salvarFilme(tmdbId) {
    try {
        // Salva o filme no banco de dados
        const response = await fetch(`${API_URL}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tmdb_id: tmdbId })
        });

        const data = await response.json();
        if (response.status === 201) {
            return true;  // Retorna verdadeiro se o filme for salvo com sucesso
        } else if (response.status === 400 && data.message === 'Filme já adicionado.') {
            createToast('Este filme já foi adicionado à lista!', 'warning');
            return false; 
        } else {
            console.error('Erro ao salvar filme:', data.message);
            createToast(data.message, 'danger');
            return false;  // Retorna falso se houve outro tipo de erro
        }
    } catch (err) {
        console.error('Erro ao salvar filme:', err);
        createToast('Erro de conexão com o servidor', 'danger');
        return false;  // Retorna falso em caso de erro
    }
}
