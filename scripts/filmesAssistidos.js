import { getUserId } from '../other/auth.js';
import { renderWatchedMovies } from '../scripts/watchedMovies.js';

document.addEventListener('DOMContentLoaded', async () => {
  const userId = getUserId();
  await renderWatchedMovies(userId);
});
