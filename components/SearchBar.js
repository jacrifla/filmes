import { displayActorMovies } from '../scripts/displayActorMovies.js';
import { fetchGenres, getPersonMovies } from '../services/apiservice.js';

export async function createSearchBar(onSearchByGenre, onSearchByText) {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'd-flex align-items-center w-100 px-5'; // Mantém o layout flexível

    // Seletor de gênero
    const genreSelect = document.createElement('select');
    genreSelect.className = 'form-control mr-3'; // Adiciona uma margem à direita

    genreSelect.innerHTML = `<option value="">Todos os Gêneros</option>`;

    // Carrega os gêneros e preenche o seletor
    const genres = await fetchGenres();
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.name;
        genreSelect.appendChild(option);
    });

    // Função para buscar filmes por gênero ao selecionar um gênero
    genreSelect.addEventListener('change', () => {
        const genreId = genreSelect.value;
        if (genreId) {
            onSearchByGenre(genreId); // Chama a função de busca por gênero
        }
    });

    // Container para o campo de busca e o botão
    const searchInputContainer = document.createElement('div');
    searchInputContainer.className = 'd-flex col-7 col-md-8';

    // Campo de texto para a busca
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'form-control flex-grow-1';
    searchInput.placeholder = 'Buscar filme ou ator...';

    // Botão de busca
    const searchButton = document.createElement('button');
    searchButton.className = 'btn btn-primary ml-2 btn-search';
    searchButton.textContent = 'Buscar';
    searchButton.onclick = async () => {
        const query = searchInput.value.trim();
        if (query) {
            // Primeiro tentamos buscar como um ator
            const actorMovies = await getPersonMovies(query);
            if (actorMovies.length > 0) {
                console.log('Filmes do ator:', actorMovies);
                // Exibe filmes do ator
                displayActorMovies(actorMovies);
            } else {
                // Chama a função de busca por texto (filme)
                onSearchByText(query); 
            }
        }
    };

    // Adiciona o evento de pressionar Enter
    searchInput.addEventListener('keydown', async (event) => {
        if (event.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                // Primeiro tentamos buscar como um ator
                const actorMovies = await getPersonMovies(query);
                if (actorMovies.length > 0) {
                    console.log('Filmes do ator:', actorMovies);
                    displayActorMovies(actorMovies);
                } else {
                    // Se não encontrar ator, procura por filmes
                    onSearchByText(query); // Chama a função de busca por texto (filme)
                }
            }
        }
    });

    // Adiciona o campo de busca e botão ao container de busca
    searchInputContainer.appendChild(searchInput);
    searchInputContainer.appendChild(searchButton);

    // Adiciona os elementos ao container principal
    searchContainer.appendChild(genreSelect);
    searchContainer.appendChild(searchInputContainer);

    return searchContainer;
}
