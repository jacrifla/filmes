// components/WatchedMovieCard.js
export default function WatchedMovieCard({ movieDetails, comentarios, onCommentSubmit }) {
    const genres = movieDetails.genres.map(genre => genre.name).join(', ');
    const director = movieDetails.credits.crew.find(person => person.job === 'Director')?.name || 'Desconhecido';
    const cast = movieDetails.credits.cast.slice(0, 3).map(actor => actor.name).join(', ');

    return (
        <li className="list-group-item p-3">
            <div className="card shadow-sm border-0">
                <div className="row g-0">
                    <div className="col-md-3">
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
                            alt={movieDetails.title}
                            className="img-fluid rounded-start movie-poster"
                        />
                    </div>
                    <div className="col-md-9">
                        <div className="card-body">
                            <h5 className="card-title fw-bold text-primary">{movieDetails.title}</h5>
                            <MovieDetails director={director} cast={cast} genres={genres} />
                            <MovieOverview overview={movieDetails.overview} releaseDate={movieDetails.release_date} />
                            <CommentsSection comentarios={comentarios} onCommentSubmit={onCommentSubmit} />
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
}

function MovieDetails({ director, cast, genres }) {
    return (
        <>
            <p className="text-muted mb-1"><strong>Diretor:</strong> {director}</p>
            <p className="text-muted mb-1"><strong>Atores:</strong> {cast}</p>
            <p className="text-muted mb-1"><strong>Gênero:</strong> {genres}</p>
        </>
    );
}

function MovieOverview({ overview, releaseDate }) {
    return (
        <>
            <p className="card-text mb-3"><strong>Sinopse:</strong> {overview}</p>
            <span className="text-muted small">
                <strong>Lançamento:</strong> {new Date(releaseDate).toLocaleDateString('pt-BR')}
            </span>
        </>
    );
}

function CommentsSection({ comentarios, onCommentSubmit }) {
    return (
        <div className="comments-section">
            <h6>Comentários:</h6>
            {comentarios && Array.isArray(comentarios.data) ? 
                comentarios.data.map((comentario, index) => <Comment key={index} comentario={comentario} />) :
                <p className="text-muted">Sem comentários</p>
            }
            <CommentInput onCommentSubmit={onCommentSubmit} />
        </div>
    );
}

function Comment({ comentario }) {
    return (
        <p className="comment text-muted">{comentario.comentario}</p>
    );
}

function CommentInput({ onCommentSubmit }) {
    return (
        <>
            <input id="commentInput" className="form-control mb-2" placeholder="Adicione um comentário" />
            <button className="btn btn-primary" onClick={onCommentSubmit}>Enviar Comentário</button>
        </>
    );
}
