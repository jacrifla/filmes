import { BASE_API_URL } from "../other/config.js";

const API_BASE_URL = `${BASE_API_URL}/avaliacoes`;

// Função para buscar avaliações de um filme
export async function getAvaliacoes(tmdb_id, usuario_id) {

    try {
        const response = await fetch(`${API_BASE_URL}/${tmdb_id}/${usuario_id}`);

        if (!response.ok) {
            const errorData = await response.json();
            console.error(`Erro ao buscar avaliações para o filme ${tmdb_id} e usuário ${usuario_id}:`, errorData.message);
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar avaliações:', error);
        return 0;
    }
}

export async function getRatings(usuario_id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${usuario_id}`);        

        const result = await response.json();        
        return result.data;
    } catch (error) {
        console.error(error);
        return 0;
    }
}

// Função para adicionar uma avaliação
export async function addAvaliacao(avaliacao) {

    const url = `${API_BASE_URL}/add`;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(avaliacao),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Erro ao adicionar avaliação:", error);
        throw error;
    }
}

// Função para atualizar uma avaliação
export async function updateAvaliacao(usuarioId, filmeId, rating) {

    const url = `${API_BASE_URL}/update/${usuarioId}/${filmeId}`;

    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ nota: rating }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Erro ao editar avaliação:", error);
        throw error;
    }
}

// Função para deletar uma avaliação (soft delete)
export const deleteAvaliacao = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: "DELETE",
        });

        // Verifique se a resposta é ok
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Erro ao deletar avaliação");
        }

        // Resposta de sucesso
        const data = await response.json();

        return data;
    } catch (error) {
        console.error("Erro ao deletar avaliação:", error);
        throw error;
    }
};

