import React from 'react';

export default function FilterBar({
  genres,
  selectedGenre,
  onGenreChange,
  searchQuery,
  onSearchChange,
  onSearchSubmit
}) {
  return (
    <div className="d-flex gap-3 align-items-end mb-4 flex-wrap">
      <div>
        <label htmlFor="genreSelect" className="form-label">
          Filtrar por gênero
        </label>
        <select
          id="genreSelect"
          className="form-select"
          value={selectedGenre}
          onChange={onGenreChange}
        >
          <option value="">Todos os gêneros</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={onSearchSubmit} className="d-flex flex-grow-1">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Buscar por título, diretor ou ator"
          value={searchQuery}
          onChange={onSearchChange}
        />
        <button type="submit" className="btn btn-primary">
          Buscar
        </button>
      </form>
    </div>
  );
}