import { renderWatchedMovies } from '../scripts/watchedMovies.js';
import { getUserId } from '../services/listaAssistirService.js';

document.addEventListener('DOMContentLoaded', async () => {
  const userId = getUserId();
  await renderWatchedMovies(userId);
});
