import { API_KEY } from "../utils/constants";

const BASE_URL = 'https://api.themoviedb.org/3';
const LANGUAGE = 'pt-BR';

// Função genérica para chamadas à API TMDB
async function fetchFromTMDB(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  const searchParams = new URLSearchParams({
    api_key: API_KEY,
    language: LANGUAGE,
    ...params,
  });
  url.search = searchParams;

  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.status_message || 'Erro ao buscar dados na TMDB');
  }
  return response.json();
}

// Popular
export async function getPopularMovies(page = 1) {
  const data = await fetchFromTMDB('/movie/popular', { page });
  return data;
}

// Top Rated
export async function getTopRatedMovies(page = 1) {
  const data = await fetchFromTMDB('/movie/top_rated', { page });
  return data.results;
}

// Upcoming
export async function getUpcomingMovies(page = 1) {
  const data = await fetchFromTMDB('/movie/upcoming', { page });
  return data.results;
}

// Search
export async function searchMovies(query, page = 1) {
  if (!query) return [];
  const data = await fetchFromTMDB('/search/movie', { query, page, include_adult: false });
  return data.results;
}

// Detalhes do filme
export async function getMovieDetails(movieId) {
  if (!movieId) throw new Error('ID do filme é obrigatório');
  return fetchFromTMDB(`/movie/${movieId}`, {});
}

// Créditos (cast & crew)
export async function getMovieCredits(movieId) {
  if (!movieId) throw new Error('ID do filme é obrigatório');
  const data = await fetchFromTMDB(`/movie/${movieId}/credits`, {});
  return data;
}

// Buscar gêneros
export async function getGenres() {
  const data = await fetchFromTMDB('/genre/movie/list');
  return data.genres;
}

export async function getPopularMoviesWithParams(params = {}) {
  const data = await fetchFromTMDB('/discover/movie', params);
  return data;
}

// Exportando um objeto padrão
export default {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  searchMovies,
  getMovieDetails,
  getMovieCredits,
  getGenres,
  getPopularMoviesWithParams,
};
