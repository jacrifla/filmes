import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import tmdbService from '../services/tmdbService';
import '../styles/movieDetailModal.css';

const MovieDetailModal = ({ movieId, show, onHide }) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!movieId) return;
    const fetchDetails = async () => {
      try {
        // Busca detalhes básicos e créditos
        const details = await tmdbService.getMovieDetails(movieId);
        const creditsData = await tmdbService.getMovieCredits(movieId);

        // Extrai diretor dos créditos
        const director = creditsData.crew.find(person => person.job === 'Director');

        setMovieDetails({
          ...details,
          cast: creditsData.cast,
          director: director?.name || 'Não disponível',
        });
      } catch (error) {
        console.error('Erro ao buscar detalhes do filme:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [movieId]);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered contentClassName="bg-dark-custom">
      <Modal.Header closeButton>
        <Modal.Title>
          {loading ? 'Carregando...' : movieDetails?.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && <p>Carregando detalhes...</p>}
        {!loading && !movieDetails && <p>Erro ao carregar detalhes do filme.</p>}

        {!loading && movieDetails && (
          <div className="row">
            <div className="col-md-4">
              <img
                src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
                alt={movieDetails.title}
                className="img-fluid rounded"
              />
            </div>
            <div className="col-md-8">
              <h5 className="text-dark">Sinopse:</h5>
              <p className="text-dark">{movieDetails.overview || 'Não disponível'}</p>

              <h5 className="text-dark">Data de Lançamento:</h5>
              <p className="text-dark">
                {movieDetails.release_date
                  ? new Date(movieDetails.release_date).toLocaleDateString('pt-BR')
                  : 'Não disponível'}
              </p>

              <h5 className="text-dark">Gêneros:</h5>
              <p className="text-dark">
                {movieDetails.genres?.map(g => g.name).join(', ')}
              </p>

              <h5 className="text-dark">Diretor:</h5>
              <p className="text-dark">{movieDetails.director}</p>

              <h5 className="text-dark">Avaliação Média (TMDB):</h5>
              <p className="text-dark">
                {movieDetails.vote_average?.toFixed(1)} / 10
              </p>

              {movieDetails.imdb_id && (
                <p>
                  <a
                    href={`https://www.imdb.com/title/${movieDetails.imdb_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver no IMDb
                  </a>
                </p>
              )}

              <h5 className="text-dark">Elenco:</h5>
              <ul>
                {movieDetails.cast?.slice(0, 5).map(actor => (
                  <li key={actor.id}>{actor.name}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MovieDetailModal;