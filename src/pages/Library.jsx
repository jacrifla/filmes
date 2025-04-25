import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { watchlistService } from '../services/watchlistService';
import WatchedMovies from '../components/WatchedMovies';
import Watchlist from '../components/Watchlist';
import { toast } from 'react-toastify';
import '../styles/library.css';

export default function Library() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('watched');
  const [watchlist, setWatchlist] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch library data
  const fetchLibrary = useCallback(async () => {
    if (!user || !token) return;
    setLoading(true);
    try {
      const data = await watchlistService.getUserMediaWatchlist(token);
      const watchlistData = data.filter((item) => item.status === 'watchlist');
      const watchedData = data.filter((item) => item.status === 'watched');
      setWatchlist(watchlistData);
      setWatchedMovies(watchedData);
    } catch (err) {
      toast.error(`Erro ao carregar sua biblioteca: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary]);

  if (loading)
    return (
      <p className="text-center mt-5 text-light">Carregando biblioteca...</p>
    );

  return (
    <div className="container mt-4 bg-dark text-light p-4 rounded shadow">
      <h2>Minha Biblioteca</h2>

      <ul className="nav nav-tabs mt-3">
        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === 'watched'
                ? 'active bg-light text-dark'
                : 'text-light'
            }`}
            style={{ cursor: 'pointer' }}
            onClick={() => setActiveTab('watched')}
          >
            Assistidos
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === 'watchlist'
                ? 'active bg-light text-dark'
                : 'text-light'
            }`}
            style={{ cursor: 'pointer' }}
            onClick={() => setActiveTab('watchlist')}
          >
            Quero Assistir
          </button>
        </li>
      </ul>

      <div className="tab-content mt-3">
        {activeTab === 'watched' && <WatchedMovies movies={watchedMovies} />}
        {activeTab === 'watchlist' && (
          <Watchlist movies={watchlist} onRefresh={fetchLibrary} />
        )}
      </div>
    </div>
  );
}
