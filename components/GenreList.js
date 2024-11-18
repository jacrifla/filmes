export function createGenreList(genres) {
    const genreContainer = document.createElement('div');
    genreContainer.className = 'genre-list';

    genres.forEach(genre => {
        const genreItem = document.createElement('button');
        genreItem.className = 'btn btn-outline-secondary m-1';
        genreItem.textContent = genre.name;
        genreItem.addEventListener('click', () => {
            // Aqui você pode definir uma ação ao clicar no gênero
            console.log(`Buscar filmes do gênero: ${genre.name}`);
        });
        genreContainer.appendChild(genreItem);
    });

    return genreContainer;
}
