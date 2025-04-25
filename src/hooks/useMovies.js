import { useState, useEffect } from 'react';
import tmdbService from '../services/tmdbService';
import { watchlistService } from '../services/watchlistService';
import * as ratingService from '../services/ratingService';
import { toast } from 'react-toastify';

const useMovies = (user, token) => {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [ratings, setRatings] = useState([]);
    const [watchlistMap, setWatchlistMap] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const data = await tmdbService.getGenres();
                setGenres(data);
            } catch (err) {
                toast.error('Erro ao carregar gêneros.');
                console.error(err);
            }
        };

        fetchGenres();
    }, []);


    // === TMDB ===
    const fetchMovies = async (pageToLoad = 1, genreId = selectedGenre) => {
        try {
            setLoading(true);
            const params = { page: pageToLoad };
            if (genreId) params.with_genres = genreId;

            const data = await tmdbService.getPopularMoviesWithParams(params);
            setMovies((prev) => pageToLoad === 1 ? data.results : [...prev, ...data.results]);
            setTotalPages(data.total_pages);
        } catch (err) {
            toast.error('Erro ao carregar filmes.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchMovies(page);
    }, [page]);

    const loadMoreMovies = () => {
        if (page < totalPages) setPage((prev) => prev + 1);
    };

    // === RATINGS ===
    useEffect(() => {
        if (!user || !token) return;
        ratingService.getRatingsByUser(user.id, token)
            .then(setRatings)
            .catch((err) => toast.error(err.message));
    }, [user, token]);

    // === WATCHLIST ===
    useEffect(() => {
        if (!user || !token) return;

        const fetchWatchlist = async () => {
            try {
                const data = await watchlistService.getUserWatchlist(token);
                const map = {};
                data.forEach((item) => { map[item.tmdbId] = item.status; });
                setWatchlistMap(map);
            } catch (err) {
                toast.error(`Erro ao carregar lista do usuário. ${err}`);
            }
        };

        fetchWatchlist();
    }, [user, token]);

    const handleGenreChange = (e) => {
        const value = e.target.value;
        setSelectedGenre(value);
        setPage(1);
        fetchMovies(1, value);
    };


    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            setSearching(false);
            setPage(1);
            fetchMovies(1);
            return;
        }

        try {
            setLoading(true);
            setSearching(true);
            const results = await tmdbService.searchMovies(searchQuery.trim(), 1);
            setMovies(results);
            setTotalPages(1);
        } catch (err) {
            toast.error('Erro ao buscar filmes.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // === WATCHLIST HANDLERS ===
    const handleAddToWatchlist = async (movie, status = 'watchlist') => {
        try {
            await watchlistService.addToWatchlist({
                token,
                tmdbId: movie.id,
                type: 'movie',
                title: movie.title,
                imageUrl: movie.poster_path,
                status,
            });

            setWatchlistMap((prev) => ({ ...prev, [movie.id]: status }));
            toast.success(`"${movie.title}" foi ${status === 'watched' ? 'marcado como assistido' : 'adicionado à sua lista de desejo'}!`);
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleRemoveFromWatchlist = async (movie) => {
        try {
            await watchlistService.removeFromWatchlist({
                token,
                tmdbId: movie.id,
                type: 'movie',
            });

            setWatchlistMap((prev) => {
                const copy = { ...prev };
                delete copy[movie.id];
                return copy;
            });

            toast.info(`"${movie.title}" removido da sua lista.`);
        } catch (err) {
            toast.error(err.message);
        }
    };

    // === RATING HANDLERS ===
    const handleRateMovie = async (movieId, rating) => {
        if (!user || !token) return toast.error('Você precisa estar logado para avaliar.');

        try {
            await ratingService.addOrUpdateRating({
                token,
                userId: user.id,
                tmdbId: movieId,
                type: 'movie',
                rating,
                comment: '',
            });

            toast.success(`Você avaliou com ${rating} estrela${rating > 1 ? 's' : ''}!`);
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleComment = async (movieId, comment) => {
        if (!user || !token) return toast.error('Você precisa estar logado para comentar.');

        const existing = ratings.find((r) => r.tmdbId === movieId);
        const prevRating = existing?.rating || 0;

        try {
            const updated = await ratingService.addOrUpdateRating({
                token,
                userId: user.id,
                tmdbId: movieId,
                type: 'movie',
                rating: prevRating,
                comment,
            });

            setRatings((rs) => {
                const others = rs.filter((r) => r.tmdbId !== movieId);
                return [...others, updated];
            });

            toast.success('Comentário salvo!');
        } catch (err) {
            toast.error(err.message);
        }
    };

    return {
        movies,
        page,
        totalPages,
        loading,
        ratings,
        watchlistMap,
        handleAddToWatchlist,
        handleRemoveFromWatchlist,
        handleRateMovie,
        handleComment,
        setPage,
        loadMoreMovies,
        searchQuery,
        setSearchQuery,
        handleSearchSubmit,
        searching,
        genres,
        handleGenreChange,
        selectedGenre,
    };
};

export default useMovies;
