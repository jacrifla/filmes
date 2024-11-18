import { BASE_API_URL } from "../other/config.js";

const API_BASE_URL = `${BASE_API_URL}/comentarios`;

// Função para buscar comentários de um filme
export async function getComentarios(tmdb_id) {
  try {
    const response = await fetch(`${API_BASE_URL}/${tmdb_id}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Erro ao buscar comentários para o filme ${tmdb_id}:`, errorData.message);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar comentários:", error.message);
    return null;
  }
};

// Função para adicionar um comentário
export const addComentario = async (comentario) => {
  const url = `${API_BASE_URL}/add`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comentario),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// Função para editar um comentário
export const updateComentario = async (id, comentario) => {
  try {
    // Enviar o comentário diretamente como string (sem JSON.stringify)
    const response = await fetch(`${API_BASE_URL}/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comentario: comentario }) // Agora é uma string simples
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Erro ao editar comentário');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao editar comentário:", error);
    throw error;
  }
};


// Função para deletar um comentário (soft delete)
export const deleteComentario = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Erro ao deletar comentário');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao deletar comentário:", error);
    throw error;
  }
};
