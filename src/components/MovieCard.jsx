import React, { useState } from 'react';
import ActionButtons from './ActionButtons';
import RatingStars from './RatingStars';
import CommentBox from './CommentBox';
import MovieDetailModal from './MovieDetailModal';
import '../styles/movieCard.css';

const MovieCard = ({
  movie,
  isLoggedIn,
  onAdd,
  onRemove,
  onRate,
  onComment,
  userRating,
  userComment,
  watchlistStatus
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="card movie-card-dark h-100 shadow-lg">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          className={`card-img-top ${watchlistStatus === 'watched' ? 'img-watched' : ''}`}
          alt={movie.title}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = 'scale(1.05)')
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          onClick={() => setShowModal(true)}
        />
        <div className="card-body d-flex flex-column justify-content-between">
          <h5 className="card-title text-truncate">{movie.title}</h5>
          {isLoggedIn && (
            <>
              <ActionButtons movie={movie} onAdd={onAdd} onRemove={onRemove} status={watchlistStatus} />
              <RatingStars
                movieId={movie.id}
                onRate={onRate}
                initialRating={userRating}
              />
              <CommentBox movieId={movie.id} 
              initialComment={userComment}
              onSubmitComment={onComment} />
            </>
          )}
        </div>
      </div>

      {showModal && (
        <MovieDetailModal
          movieId={movie.id}
          show={showModal}
          onHide={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default MovieCard;
