import { addToWatchList, markAsWatched, isMovieInWatchedList, isMovieInWatchList } from "../services/listaAssistirService.js";
import { CommentModal } from "./CommentModal.js";

export function createCardButtons(movie) {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'd-flex justify-content-around mt-2';

    // Verifica se o filme já foi assistido
    const isWatched = isMovieInWatchedList(movie.id);

    // Botão de comentário
    const commentButton = document.createElement('button');
    commentButton.className = 'btn btn-link btn-card';
    commentButton.innerHTML = '<i class="bi bi-chat"></i>';
    commentButton.title = 'Comentar';
    commentButton.setAttribute('data-tooltip', 'Comentar');
    commentButton.addEventListener('click', (e) => {
        e.stopPropagation();
        CommentModal(movie.id, movie.title);
        console.log(`Comentando no filme ${movie.title}`);
    });

    // Botão de assistido
    const watchedButton = document.createElement('button');
    watchedButton.className = 'btn btn-link btn-card';
    watchedButton.innerHTML = isWatched ? '<i class="bi bi-eye-fill"></i>' : '<i class="bi bi-eye"></i>';
    watchedButton.title = isWatched ? 'Assistido' : 'Marcar como assistido';
    watchedButton.setAttribute('data-tooltip', isWatched ? 'Assistido' : 'Marcar como assistido');
    watchedButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isWatched) {
            console.log(`O filme ${movie.title} já foi assistido.`);
        } else {
            markAsWatched(movie.id);
            console.log(`Marcando como assistido o filme ${movie.title}`);
        }
    });

    // Botão de adicionar à lista
    const isInWatchList = isMovieInWatchList(movie.id); // Verifica se o filme está na lista
    const addToListButton = document.createElement('button');
    addToListButton.className = 'btn btn-link btn-card';
    addToListButton.innerHTML = isInWatchList ? '<i class="bi bi-bookmark-fill"></i>' : '<i class="bi bi-bookmark"></i>';
    addToListButton.title = isInWatchList ? 'Adicionado à lista' : 'Adicionar à lista';
    addToListButton.setAttribute('data-tooltip', isInWatchList ? 'Adicionado à lista' : 'Adicionar à lista');
    addToListButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isInWatchList) {
            console.log(`O filme ${movie.title} já está na lista.`);
        } else {
            addToWatchList(movie.id);
            console.log(`Adicionando à lista o filme ${movie.title}`);
        }
    });

    // Botão de compartilhamento
    const shareButton = document.createElement('button');
    shareButton.className = 'btn btn-link btn-card';
    shareButton.innerHTML = '<i class="bi bi-share"></i>';
    shareButton.title = 'Compartilhar';
    shareButton.setAttribute('data-tooltip', 'Compartilhar');
    shareButton.addEventListener('click', (e) => {
        e.stopPropagation();
        shareMovie(movie);
    });

    buttonContainer.appendChild(commentButton);
    buttonContainer.appendChild(watchedButton);
    buttonContainer.appendChild(addToListButton);
    buttonContainer.appendChild(shareButton);

    return buttonContainer;
}

function shareMovie(movie) {
    const movieUrl = `https://www.imdb.com/title/${movie.imdb_id}/`; // Link para a página do filme no IMDb

    if (navigator.share) {
        navigator.share({
            title: movie.title,
            text: `Confira esse filme: ${movie.title}`,
            url: movieUrl
        })
        .then(() => console.log('Filme compartilhado com sucesso!'))
        .catch((error) => console.log('Erro ao compartilhar:', error));
    } else {
        // Caso a API de compartilhamento não seja suportada, exibe um alerta com o link
        alert(`Compartilhe o filme com este link: ${movieUrl}`);
    }
}
