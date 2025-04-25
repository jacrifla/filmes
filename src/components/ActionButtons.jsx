import React from 'react';

const ActionButtons = ({ movie, onAdd, onRemove, status }) => {
  return (
    <div className="d-flex justify-content-between my-2 gap-2">
      <button
        className={`btn btn-sm ${status === 'watched' ? 'btn-secondary' : 'btn-success'}`}
        onClick={() => onAdd(movie, 'watched')}
        disabled={status === 'watched'}
      >
        Assistido
      </button>

      <button
        className={`btn btn-sm ${status === 'watchlist' ? 'btn-secondary' : 'btn-warning'}`}
        onClick={() => onAdd(movie, 'watchlist')}
        disabled={status === 'watchlist'}
      >
        Quero ver
      </button>

      <button
        className="btn btn-sm btn-danger"
        onClick={() => onRemove(movie)}
      >
        Remover
      </button>
    </div>
  );
};

export default ActionButtons;
