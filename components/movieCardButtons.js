import { addToWatchList, isMovieInWatchedList, isMovieInWatchList, markAsWatched, removeFromWatchList } from "../services/listaAssistirService.js";
import { CommentModal } from "./CommentModal.js";

export function createCardButtons(movie) {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'd-flex justify-content-around mt-2';

    // Verifica se o filme já foi assistido e se está na lista de "para assistir"
    let isWatched = isMovieInWatchedList(movie.id);
    let isInWatchList = isMovieInWatchList(movie.id);

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
    updateWatchedButton(watchedButton, isWatched);

    watchedButton.addEventListener('click', async (e) => {
        e.stopPropagation();
        try {
            if (isWatched) {
                // Se já foi assistido, remove da lista de "assistidos"
                await removeFromWatchList(movie.id);
                console.log(`Removendo o filme ${movie.title} da lista de assistidos`);
                isWatched = false;
            } else {
                // Marca como assistido e atualiza o status
                await markAsWatched(movie.id);
                console.log(`Marcando o filme ${movie.title} como assistido. ID: ${movie.id}`);
                isWatched = true;
            }
            updateWatchedButton(watchedButton, isWatched);

            // Atualiza a classe do card para refletir o status
            const movieCard = document.getElementById(`movie-card-${movie.id}`);
            if (movieCard) {
                movieCard.classList.toggle('watched', isWatched);
            }
        } catch (error) {
            console.error("Erro ao alternar status do filme:", error);
        }
    });

    // Botão de adicionar à lista
    const addToListButton = document.createElement('button');
    addToListButton.className = 'btn btn-link btn-card';
    updateWatchListButton(addToListButton, isInWatchList);

    addToListButton.addEventListener('click', async (e) => {
        e.stopPropagation();
        try {
            if (isInWatchList) {
                // Se já estiver na lista, remove da lista de "para assistir"
                await removeFromWatchList(movie.id);
                console.log(`Removendo o filme ${movie.title} da lista de "para assistir"`);
                isInWatchList = false;
            } else {
                // Adiciona à lista de "para assistir"
                await addToWatchList(movie.id);
                console.log(`Adicionando o filme ${movie.title} à lista de "para assistir"`);
                isInWatchList = true;
            }
            updateWatchListButton(addToListButton, isInWatchList);
        } catch (error) {
            console.error("Erro ao alternar status do filme:", error);
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


// Atualiza o botão "Assistido" com base no estado.
function updateWatchedButton(button, isWatched) {
    button.innerHTML = isWatched ? '<i class="bi bi-eye-fill"></i>' : '<i class="bi bi-eye"></i>';
    button.title = isWatched ? 'Assistido' : 'Marcar como assistido';
    button.setAttribute('data-tooltip', isWatched ? 'Assistido' : 'Marcar como assistido');
}

// Atualiza o botão "Adicionar à lista" com base no estado.
function updateWatchListButton(button, isInWatchList) {
    button.innerHTML = isInWatchList ? '<i class="bi bi-bookmark-fill"></i>' : '<i class="bi bi-bookmark"></i>';
    button.title = isInWatchList ? 'Adicionado à lista' : 'Adicionar à lista';
    button.setAttribute('data-tooltip', isInWatchList ? 'Adicionado à lista' : 'Adicionar à lista');
}

// Compartilha o filme usando a API de compartilhamento ou exibe um link.
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