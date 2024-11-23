import { getAvaliacoes } from '../services/avaliacaoService.js';

export async function fetchUserRating(tmdb_id, userId) {
  try {
    const avaliacao = await getAvaliacoes(tmdb_id, userId);
    return avaliacao?.nota || 0; 
  } catch (error) {
    console.error("Erro ao buscar avaliação:", error);
    return 0;
  }
}
