export default function WatchedMovies({ movies }) {
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
              <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>Você não tem filmes assistidos ainda.</p>
      )}
    </div>
  );
}
