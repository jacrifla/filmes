import { useAuth } from '../hooks/useAuth';
import { watchlistService } from '../services/watchlistService';
import { toast } from 'react-toastify';

export default function Watchlist({ movies, onRefresh }) {
  const { token } = useAuth();

  const handleMarkAsWatched = async (movie) => {
    try {
      await watchlistService.addToWatchlist({
        token,
        tmdbId: movie.tmdbId,
        type: 'movie',
        title: movie.title,
        imageUrl: movie.imageUrl,
        status: 'watched',
      });
      toast.success(`"${movie.title}" marcado como assistido!`);
      onRefresh();
    } catch (err) {
      toast.error(`Erro ao marcar como assistido: ${err.message}`);
    }
  };

  const handleRemove = async (movie) => {
    try {
      await watchlistService.removeFromWatchlist({
        token,
        tmdbId: movie.tmdbId,
        type: 'movie',
      });
      toast.info(`"${movie.title}" removido da sua lista.`);
      onRefresh();
    } catch (err) {
      toast.error(`Erro ao remover: ${err.message}`);
    }
  };

  return (
    <div className="row">
      {movies.length > 0 ? (
        movies.map((movie) => (
          <div
            className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
            key={movie.tmdbId}
          >
            <div className="card bg-secondary text-light shadow h-100 d-flex flex-column">
              <img
                src={`https://image.tmdb.org/t/p/w500/${movie.imageUrl}`}
                alt={movie.title}
                className="card-img-top"
              />
              <div className="card-body d-flex flex-column justify-content-between">
                <h5
                  className="card-title"
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={movie.title}
                >
                  {movie.title}
                </h5>
                <div className="mt-2 d-flex justify-content-between">
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleMarkAsWatched(movie)}
                  >
                    Marcar como Assistido
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemove(movie)}
                  >
                    Remover da Lista
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>Você não tem filmes na lista de "Quero Assistir".</p>
      )}
    </div>
  );
}
