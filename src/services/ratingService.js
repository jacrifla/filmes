import { BASE_URL } from "../utils/constants";
const ENDPOINT = `${BASE_URL}/ratings`;

export const addOrUpdateRating = async ({ token, userId, tmdbId, type, rating, comment }) => {
  const response = await fetch(`${ENDPOINT}/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ userId, tmdbId, type, rating, comment })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Erro ao salvar avaliação');
  return data.data;
};

export const getAllRatings = async (token) => {
  const response = await fetch(`${ENDPOINT}/all`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Erro ao buscar avaliações');
  return data.data;
};

export const getRatingsByUser = async (userId, token) => {
  const response = await fetch(`${ENDPOINT}/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Erro ao buscar avaliações do usuário');
  return data.data;
};

export const getRatingByUserAndMedia = async (userId, tmdbId, type, token) => {
  const response = await fetch(`${ENDPOINT}/${tmdbId}/${userId}/${type}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(data.message || 'Erro ao buscar avaliação');
  }
  return data.data;
};

export const getAverageRatingByMedia = async (tmdbId, type) => {
  const response = await fetch(`${ENDPOINT}/media/average/${tmdbId}/${type}`);
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(data.message || 'Erro ao buscar média de avaliações');
  }
  return data.data;
};
