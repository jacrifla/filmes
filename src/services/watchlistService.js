import { BASE_URL } from "../utils/constants";

const ENDPOINT = `${BASE_URL}/watchlist`;

export const watchlistService = {
  async addToWatchlist({ token, tmdbId, type, title, imageUrl, status }) {
    const res = await fetch(`${ENDPOINT}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ tmdbId, type, title, imageUrl, status }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erro ao adicionar à lista');

    return data.data;
  },

  async getUserWatchlist(token) {
    const res = await fetch(`${ENDPOINT}/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erro ao buscar lista');

    return data.data;
  },

  async removeFromWatchlist({ token, tmdbId, type }) {
    const res = await fetch(`${ENDPOINT}/remove`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ tmdbId, type }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erro ao remover item');

    return data.data;
  },

  async getUserMediaWatchlist(token) {
    const res = await fetch(`${ENDPOINT}/library`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    })
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Erro ao buscar biblioteca');

    return data.data;
  },    
};
